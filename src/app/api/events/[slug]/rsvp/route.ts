import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  try {
    const { slug } = await context.params;
    const cleanSlug = normalizeSlug(decodeURIComponent(slug || "").toLowerCase().trim()).replace(/^slug-/, "");

    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
    }

    const body = await req.json();
    const {
      guest_id,
      status,
      confirmed_pax = 0,
      phone,
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
      select: { id: true, titulo: true, aforoTotal: true },
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
    const cleanNotes = notes !== undefined ? (notes ? String(notes).trim() : null) : guest.notes;

    // Actualizar invitado en PostgreSQL
    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        status,
        confirmedPax: finalConfirmedPax,
        phone: cleanPhone,
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
            acompanantes: cleanNotes,
          },
        });
      }
    } catch (syncErr) {
      console.warn("Aviso: No se pudo sincronizar RsvpRegistro histórico:", syncErr);
    }

    return NextResponse.json({
      success: true,
      guest: {
        id: updatedGuest.id,
        name: updatedGuest.name,
        phone: updatedGuest.phone,
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
