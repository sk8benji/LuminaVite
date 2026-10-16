import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import { ensureGuestsTable } from "@/lib/guests-table";
import {
  sendHostNotificationEmail,
  sendGuestConfirmationEmail,
  sendGuestConfirmationSms,
} from "@/lib/notifications";
import twilio from "twilio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { formatE164 } from "@/lib/phoneValidator";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/url-safety";

interface RouteContext {
  params: Promise<{ slug: string }> | { slug: string };
}

/**
 * POST /api/events/:slug/rsvp
 * Confirmación pública de RSVP para un invitado identificado
 * 
 * Payload:
 * {
 *   "guest_id": "UUID",
 *   "status": "attending" | "declined",
 *   "confirmed_pax": number,
 *   "phone"?: string,
 *   "notes"?: string
 * }
 */
export async function POST(req: NextRequest, context: RouteContext) {
  const limited = checkRateLimit(req, "rsvp-slug", RATE_LIMITS.rsvp);
  if (limited) return limited;

  try {
    const { slug } = await context.params;
    const cleanSlug = normalizeSlug(decodeURIComponent(slug || "").toLowerCase().trim()).replace(/^slug-/, "");

    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
    }

    await ensureGuestsTable();

    const body = await req.json();
    const {
      guest_id,
      status,
      confirmed_pax = 0,
      phone,
      email,
      notes,
    } = body;

    if (!guest_id) {
      return NextResponse.json(
        { error: "El campo 'guest_id' es obligatorio." },
        { status: 400 }
      );
    }

    if (!status || !["attending", "declined", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "El campo 'status' debe ser 'attending' o 'declined'." },
        { status: 400 }
      );
    }

    // Buscar evento
    const evento = await prisma.evento.findFirst({
      where: { slug: cleanSlug },
      include: {
        usuario: true,
        ordenesCompra: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
    }

    // Buscar el invitado en la base de datos
    const guest = await prisma.guest.findFirst({
      where: {
        id: String(guest_id),
        eventId: evento.id,
      },
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Invitado no encontrado en la lista de este evento." },
        { status: 404 }
      );
    }

    // Regla de deduplicación: Prevenir reenvío de SMS si ya tiene confirmación activa
    if (guest.status === "attending" && status === "attending") {
      const pases = guest.confirmedPax || guest.maxPax || 1;
      return NextResponse.json(
        {
          error: `Esta invitación ya fue confirmada previamente (${pases} ${
            pases === 1 ? "pase" : "pases"
          }) a nombre de ${guest.name}. Para realizar modificaciones, contacta al anfitrión.`,
          alreadyConfirmed: true,
          confirmedName: guest.name,
          confirmedPax: pases,
        },
        { status: 409 }
      );
    }

    let finalConfirmedPax = 0;

    if (status === "attending") {
      finalConfirmedPax = Math.max(1, Number(confirmed_pax) || 1);

      // Validación estricta: confirmed_pax <= max_pax
      if (finalConfirmedPax > guest.maxPax) {
        return NextResponse.json(
          {
            error: `El número de pases confirmados (${finalConfirmedPax}) excede los pases asignados (${guest.maxPax}).`,
            max_pax: guest.maxPax,
          },
          { status: 400 }
        );
      }
    } else if (status === "declined") {
      finalConfirmedPax = 0;
    }

    const cleanPhone = phone ? String(phone).trim() : guest.phone;
    const cleanEmail = email ? String(email).trim().toLowerCase() : guest.email;
    const cleanNotes = notes !== undefined ? (notes ? String(notes).trim() : null) : guest.notes;

    // Actualizar invitado en PostgreSQL
    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        status,
        confirmedPax: finalConfirmedPax,
        phone: cleanPhone,
        email: cleanEmail,
        notes: cleanNotes,
        updatedAt: new Date(),
      },
    });

    // Sincronizar de forma idempotente con RsvpRegistro para estadísticas generales
    try {
      const cleanPhoneDigits = cleanPhone ? cleanPhone.replace(/[^0-9]/g, "") : null;
      const isAttending = status === "attending";

      const existingRsvp = await prisma.rsvpRegistro.findFirst({
        where: {
          eventoId: evento.id,
          nombreInvitado: {
            equals: guest.name.trim(),
            mode: "insensitive",
          },
        },
      });

      if (existingRsvp) {
        await prisma.rsvpRegistro.update({
          where: { id: existingRsvp.id },
          data: {
            asistira: isAttending,
            pases: isAttending ? finalConfirmedPax : 0,
            telefono: cleanPhoneDigits || existingRsvp.telefono,
            email: cleanEmail || existingRsvp.email,
            acompanantes: cleanNotes || existingRsvp.acompanantes,
          },
        });
      } else {
        await prisma.rsvpRegistro.create({
          data: {
            eventoId: evento.id,
            nombreInvitado: guest.name.trim(),
            asistira: isAttending,
            pases: isAttending ? finalConfirmedPax : 0,
            telefono: cleanPhoneDigits,
            email: cleanEmail,
            acompanantes: cleanNotes,
          },
        });
      }
    } catch (syncErr) {
      console.warn("Aviso: No se pudo sincronizar RsvpRegistro histórico:", syncErr);
    }

    // 1. Alerta por correo siempre activa para el anfitrión (AWS SES)
    const hostEmail =
      evento.emailOrganizador ||
      evento.usuario?.email ||
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.ADMIN_EMAIL;

    if (hostEmail && status === "attending") {
      const siteUrl = getSiteUrl();
      sendHostNotificationEmail({
        hostEmail,
        eventoTitulo: evento.titulo,
        slug: cleanSlug,
        panelToken: evento.panelToken,
        nombreInvitado: updatedGuest.name,
        telefono: cleanPhone,
        email: cleanEmail,
        pases: finalConfirmedPax,
        totalPasesConfirmados: finalConfirmedPax,
        aforoTotal: evento.aforoTotal || 200,
        siteUrl,
      }).catch((err) => console.error("Error Email SES en segundo plano:", err));
    }

    // 2. Notificación al invitado: SMS Twilio (Planes VIP/Custom) vs Email AWS SES (Plan Básico / Digital Basic)
    const paquete = (evento.ordenesCompra?.[0]?.paqueteId || "").toLowerCase();
    // B1+H2: SMS solo con orden pagada de un plan que lo incluye (IDs reales de PACKAGES).
    // Sin orden no hay SMS gratis (antes el default era true).
    // Además: no reenviar SMS si el invitado ya estaba confirmado (evita abuso).
    const PLANES_CON_SMS = ["assisted", "vip"];
    const planConSms =
      Boolean(evento.ordenesCompra?.length) &&
      PLANES_CON_SMS.includes(paquete);
    const yaEstabaConfirmado = guest.status === "attending";

    if (planConSms && status === "attending" && cleanPhone && !yaEstabaConfirmado) {
      sendGuestConfirmationSms({
        telefono: cleanPhone,
        nombreInvitado: updatedGuest.name,
        pases: finalConfirmedPax,
        eventoTitulo: evento.titulo,
        ceremoniaNombre: (evento as any).ceremoniaNombre || undefined,
        ceremoniaDireccion: (evento as any).ceremoniaDireccion || undefined,
        ceremoniaMapUrl: (evento as any).ceremoniaMapUrl || undefined,
        recepcionNombre: evento.recepcionNombre || undefined,
        recepcionDireccion: (evento as any).recepcionDireccion || undefined,
        recepcionMapUrl: evento.recepcionMapUrl || undefined,
      }).catch((err) => console.error("Error SMS Twilio en segundo plano:", err));
    } else if (!planConSms && status === "attending" && cleanEmail) {
      const siteUrl = getSiteUrl();
      sendGuestConfirmationEmail({
        guestEmail: cleanEmail,
        nombreInvitado: updatedGuest.name,
        pases: finalConfirmedPax,
        eventoTitulo: evento.titulo,
        slug: cleanSlug,
        recepcionNombre: evento.recepcionNombre || undefined,
        recepcionDireccion: evento.recepcionDireccion || undefined,
        recepcionMapUrl: evento.recepcionMapUrl || undefined,
        siteUrl,
      }).catch((err) => console.error("Error Email SES Invitado en segundo plano:", err));
    }

    return NextResponse.json({
      success: true,
      guest: {
        id: updatedGuest.id,
        name: updatedGuest.name,
        phone: updatedGuest.phone,
        email: updatedGuest.email,
        max_pax: updatedGuest.maxPax,
        confirmed_pax: updatedGuest.confirmedPax,
        status: updatedGuest.status,
        notes: updatedGuest.notes,
        updated_at: updatedGuest.updatedAt,
      },
    });
  } catch (err: any) {
    console.error("Error en POST /api/events/:slug/rsvp:", err);
    return NextResponse.json(
      { error: "Error interno al confirmar RSVP." },
      { status: 500 }
    );
  }
}
