import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import { ensureGuestsTable } from "@/lib/guests-table";
import { sendHostManualRequestEmail } from "@/lib/notifications";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/url-safety";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteContext {
  params: Promise<{ slug: string }> | { slug: string };
}

/**
 * POST /api/events/:slug/manual-request
 * 
 * Flujo interno de Solicitud de Confirmación Manual para invitados no listados.
 * 
 * Reglas de seguridad y costos:
 * 1. CERO SMS salientes de Twilio para eliminar al 100% el riesgo de SMS pumping / toll fraud.
 * 2. Guarda el registro en PostgreSQL con estado 'PENDIENTE_APROBACION'.
 * 3. Envía una notificación interna por correo vía AWS SES al anfitrión.
 * 4. Responde con mensaje de confirmación para el usuario.
 */
export async function POST(req: NextRequest, context: RouteContext) {
  const limited = checkRateLimit(req, "manual-request", RATE_LIMITS.manualRequest);
  if (limited) return limited;

  try {
    const { slug } = await context.params;
    const cleanSlug = normalizeSlug(decodeURIComponent(slug || "").toLowerCase().trim()).replace(/^slug-/, "");

    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { name, phone, pax = 1 } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Por favor ingresa un nombre o familia válido (mínimo 2 letras)." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanPhone = phone ? String(phone).trim() : null;
    const requestedPax = Math.min(10, Math.max(1, Number(pax) || 1));

    // Buscar el evento
    const evento = await prisma.evento.findFirst({
      where: { slug: cleanSlug },
      include: {
        usuario: true,
      },
    });

    if (!evento) {
      return NextResponse.json(
        { error: "El evento especificado no existe o no está activo." },
        { status: 404 }
      );
    }

    await ensureGuestsTable();

    // 1. Guardar solicitud en la tabla oficial de invitados de PostgreSQL
    const existingGuest = await prisma.guest.findFirst({
      where: {
        eventId: evento.id,
        name: {
          equals: cleanName,
          mode: "insensitive",
        },
      },
    });

    let savedGuest;
    if (existingGuest) {
      savedGuest = await prisma.guest.update({
        where: { id: existingGuest.id },
        data: {
          status: "PENDIENTE_APROBACION",
          maxPax: requestedPax,
          phone: cleanPhone || existingGuest.phone,
          notes: `Solicitud manual de confirmación (${requestedPax} pases solicitados)`,
          updatedAt: new Date(),
        },
      });
    } else {
      savedGuest = await prisma.guest.create({
        data: {
          eventId: evento.id,
          name: cleanName,
          phone: cleanPhone,
          maxPax: requestedPax,
          confirmedPax: 0,
          status: "PENDIENTE_APROBACION",
          notes: `Solicitud manual externa (${requestedPax} pases solicitados)`,
        },
      });
    }

    // 2. Sincronizar en RsvpRegistro como pendiente para visibilidad en el panel
    try {
      const cleanPhoneDigits = cleanPhone ? cleanPhone.replace(/[^0-9]/g, "") : null;
      const existingRsvp = await prisma.rsvpRegistro.findFirst({
        where: {
          eventoId: evento.id,
          nombreInvitado: { equals: cleanName, mode: "insensitive" },
        },
      });

      if (existingRsvp) {
        await prisma.rsvpRegistro.update({
          where: { id: existingRsvp.id },
          data: {
            asistira: false,
            pases: requestedPax,
            telefono: cleanPhoneDigits || existingRsvp.telefono,
            acompanantes: "SOLICITUD_PENDIENTE_APROBACION",
          },
        });
      } else {
        await prisma.rsvpRegistro.create({
          data: {
            eventoId: evento.id,
            nombreInvitado: cleanName,
            asistira: false,
            pases: requestedPax,
            telefono: cleanPhoneDigits,
            acompanantes: "SOLICITUD_PENDIENTE_APROBACION",
          },
        });
      }
    } catch (syncErr) {
      console.warn("Aviso: No se pudo sincronizar RsvpRegistro:", syncErr);
    }

    // 3. Notificación interna vía AWS SES al anfitrión (CERO Twilio SMS)
    const hostEmail =
      evento.emailOrganizador ||
      evento.usuario?.email ||
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.ADMIN_EMAIL;

    if (hostEmail) {
      const siteUrl = getSiteUrl();
      sendHostManualRequestEmail({
        hostEmail,
        eventoTitulo: evento.titulo,
        slug: cleanSlug,
        panelToken: evento.panelToken,
        nombreSolicitante: savedGuest.name,
        telefono: cleanPhone,
        pasesSolicitados: requestedPax,
        siteUrl,
      }).catch((err) => console.error("Error al enviar alerta manual por SES:", err));
    }

    return NextResponse.json({
      success: true,
      message: "Tu solicitud fue enviada a los anfitriones. Te contactarán para confirmar tus pases.",
      guest: {
        id: savedGuest.id,
        name: savedGuest.name,
        status: savedGuest.status,
        max_pax: savedGuest.maxPax,
      },
    });
  } catch (err: any) {
    console.error("Error en POST /api/events/:slug/manual-request:", err);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu solicitud. Por favor intenta más tarde." },
      { status: 500 }
    );
  }
}
