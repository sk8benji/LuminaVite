import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import {
  sendGuestConfirmationSms,
  sendHostNotificationEmail,
} from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventoId,
      slug,
      nombreInvitado,
      telefono,
      asistira = true,
      pases = 1,
      acompanantes,
    } = body;

    if ((!eventoId && !slug) || !nombreInvitado || !String(nombreInvitado).trim()) {
      return NextResponse.json(
        { error: "El slug/eventoId y el nombre del invitado son obligatorios." },
        { status: 400 }
      );
    }

    const cleanIdentifier = normalizeSlug(slug || eventoId || "").replace(/^slug-/, "");
    const normalizedPhone = telefono ? String(telefono).replace(/[^0-9]/g, "") : null;
    const isAttending = Boolean(asistira);
    const requestedPasses = isAttending ? Math.max(1, Number(pases) || 1) : 0;

    // Ejecutar verificación y registro atómico dentro de una transacción Prisma
    const txResult = await prisma.$transaction(async (tx) => {
      // 1. Bloquear y consultar el evento
      const evento = await tx.evento.findFirst({
        where: {
          OR: [
            { id: eventoId || "" },
            { slug: cleanIdentifier },
          ],
        },
        include: {
          usuario: true,
        },
      });

      if (!evento) {
        throw new Error("EVENT_NOT_FOUND");
      }

      // 2. Validar límite de pases por invitado
      const maxAllowed = evento.maxPasesPorInvitado || 4;
      if (isAttending && requestedPasses > maxAllowed) {
        throw new Error(`MAX_PASSES_EXCEEDED:${maxAllowed}`);
      }

      // 3. Buscar confirmación previa existente
      let rsvpExistente = null;
      if (normalizedPhone) {
        rsvpExistente = await tx.rsvpRegistro.findFirst({
          where: {
            eventoId: evento.id,
            telefono: normalizedPhone,
          },
        });
      }

      if (!rsvpExistente && String(nombreInvitado).trim()) {
        rsvpExistente = await tx.rsvpRegistro.findFirst({
          where: {
            eventoId: evento.id,
            nombreInvitado: {
              equals: String(nombreInvitado).trim(),
              mode: "insensitive",
            },
          },
        });
      }

      // 4. Verificación de Aforo Máximo
      if (isAttending && evento.aforoTotal) {
        const aggregateResult = await tx.rsvpRegistro.aggregate({
          where: {
            eventoId: evento.id,
            asistira: true,
          },
          _sum: {
            pases: true,
          },
        });

        const currentConfirmedTotal = aggregateResult._sum.pases || 0;
        const previousPasses = rsvpExistente && rsvpExistente.asistira ? rsvpExistente.pases : 0;
        const projectedTotal = currentConfirmedTotal - previousPasses + requestedPasses;

        if (projectedTotal > evento.aforoTotal) {
          const availableSeats = Math.max(0, evento.aforoTotal - (currentConfirmedTotal - previousPasses));
          throw new Error(`CAPACITY_EXCEEDED:${availableSeats}`);
        }
      }

      // 5. Inserción o Actualización atómica del RSVP
      let rsvp;
      let isUpdate = false;
      let seatsChanged = false;

      if (rsvpExistente) {
        isUpdate = true;
        seatsChanged = rsvpExistente.pases !== requestedPasses;

        rsvp = await tx.rsvpRegistro.update({
          where: { id: rsvpExistente.id },
          data: {
            nombreInvitado: String(nombreInvitado).trim(),
            telefono: normalizedPhone || rsvpExistente.telefono,
            asistira: isAttending,
            pases: requestedPasses,
            acompanantes: acompanantes ?? rsvpExistente.acompanantes,
          },
        });
      } else {
        rsvp = await tx.rsvpRegistro.create({
          data: {
            eventoId: evento.id,
            nombreInvitado: String(nombreInvitado).trim(),
            telefono: normalizedPhone,
            asistira: isAttending,
            pases: requestedPasses,
            acompanantes: acompanantes ?? null,
          },
        });
      }

      // 6. Recalcular total acumulado confirmado
      const postAgg = await tx.rsvpRegistro.aggregate({
        where: {
          eventoId: evento.id,
          asistira: true,
        },
        _sum: {
          pases: true,
        },
      });

      const totalPasesConfirmados = postAgg._sum.pases || requestedPasses;

      return {
        evento,
        rsvp,
        isUpdate,
        seatsChanged,
        totalPasesConfirmados,
      };
    });

    const { evento, rsvp, isUpdate, seatsChanged, totalPasesConfirmados } = txResult;

    // 7. Disparar notificaciones en segundo plano (no bloqueantes)
    if (normalizedPhone && isAttending) {
      sendGuestConfirmationSms({
        telefono: normalizedPhone,
        nombreInvitado: rsvp.nombreInvitado,
        pases: requestedPasses,
        eventoTitulo: evento.titulo,
        recepcionNombre: evento.recepcionNombre,
        recepcionMapUrl: evento.recepcionMapUrl,
      }).catch((err) => console.error("Error SMS Twilio en segundo plano:", err));
    }

    const hostEmail =
      evento.emailOrganizador ||
      evento.usuario?.email ||
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.ADMIN_EMAIL;

    if (hostEmail && isAttending) {
      const siteUrl = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://clickandlove.app";
      sendHostNotificationEmail({
        hostEmail,
        eventoTitulo: evento.titulo,
        slug: evento.slug,
        panelToken: evento.panelToken,
        nombreInvitado: rsvp.nombreInvitado,
        telefono: normalizedPhone,
        pases: requestedPasses,
        totalPasesConfirmados,
        aforoTotal: evento.aforoTotal || 200,
        siteUrl,
      }).catch((err) => console.error("Error Email SES en segundo plano:", err));
    }

    return NextResponse.json({
      success: true,
      rsvp,
      isUpdate,
      seatsChanged,
      message: isAttending
        ? `¡Gracias, ${rsvp.nombreInvitado}! Tu confirmación para ${requestedPasses} ${
            requestedPasses === 1 ? "pase" : "pases"
          } ha sido registrada exitosamente.`
        : `Gracias, ${rsvp.nombreInvitado}. Hemos registrado que no podrás asistir a la celebración.`,
    });
  } catch (error: any) {
    console.error("Error en /api/rsvp:", error);

    if (error?.message === "EVENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "El evento especificado no existe o no se encuentra activo." },
        { status: 404 }
      );
    }

    if (error?.message?.startsWith("MAX_PASSES_EXCEEDED:")) {
      const max = error.message.split(":")[1];
      return NextResponse.json(
        { error: `El número máximo permitido para este evento es de ${max} pases por invitado.` },
        { status: 400 }
      );
    }

    if (error?.message?.startsWith("CAPACITY_EXCEEDED:")) {
      const remaining = error.message.split(":")[1];
      return NextResponse.json(
        {
          error: `Lo sentimos, el aforo del evento está completo. ${
            Number(remaining) > 0 ? `Solo quedan ${remaining} pases disponibles.` : "No quedan pases disponibles."
          }`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Ocurrió un error al procesar la confirmación. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
