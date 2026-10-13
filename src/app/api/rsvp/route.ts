import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import {
  sendGuestConfirmationSms,
  sendGuestConfirmationEmail,
  sendHostNotificationEmail,
} from "@/lib/notifications";
import { formatE164 } from "@/lib/phoneValidator";

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
      email,
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
    const normalizedPhone = telefono ? (formatE164(String(telefono)) || String(telefono).replace(/[^0-9]/g, "")) : null;
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
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
          ordenesCompra: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
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

      // 3. Buscar confirmación previa existente por teléfono o email
      let rsvpExistente = null;
      if (normalizedPhone) {
        const cleanDigits = normalizedPhone.replace(/\D/g, "");
        const possiblePhones = Array.from(
          new Set(
            [
              normalizedPhone,
              cleanDigits,
              cleanDigits.length === 10 ? `+1${cleanDigits}` : null,
              cleanDigits.length === 11 && cleanDigits.startsWith("1") ? `+${cleanDigits}` : null,
              cleanDigits.length === 11 && cleanDigits.startsWith("1") ? cleanDigits.slice(1) : null,
            ].filter(Boolean) as string[]
          )
        );

        rsvpExistente = await tx.rsvpRegistro.findFirst({
          where: {
            eventoId: evento.id,
            telefono: { in: possiblePhones },
          },
        });
      }

      if (!rsvpExistente && cleanEmail) {
        rsvpExistente = await tx.rsvpRegistro.findFirst({
          where: {
            eventoId: evento.id,
            email: cleanEmail,
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

      // Regla de deduplicación: Si ya tiene confirmación activa, prevenir duplicado y alertar
      if (rsvpExistente && rsvpExistente.asistira && isAttending && !body.permitirActualizacion) {
        const canal = (normalizedPhone && rsvpExistente.telefono === normalizedPhone) ? "número" : "correo";
        throw new Error(`ALREADY_CONFIRMED:${canal}:${rsvpExistente.pases}:${rsvpExistente.nombreInvitado}`);
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
            email: cleanEmail || rsvpExistente.email,
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
            email: cleanEmail,
            asistira: isAttending,
            pases: requestedPasses,
            acompanantes: acompanantes ?? null,
          },
        });
      }

      // Sincronizar o crear en la tabla Guest para que aparezca en el panel del anfitrión
      try {
        const guestExistente = await tx.guest.findFirst({
          where: {
            eventId: evento.id,
            OR: [
              ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
              ...(cleanEmail ? [{ email: cleanEmail }] : []),
              { name: { equals: String(nombreInvitado).trim(), mode: "insensitive" } },
            ],
          },
        });

        if (guestExistente) {
          await tx.guest.update({
            where: { id: guestExistente.id },
            data: {
              status: isAttending ? "attending" : "declined",
              confirmedPax: isAttending ? requestedPasses : 0,
              phone: normalizedPhone || guestExistente.phone,
              email: cleanEmail || guestExistente.email,
              updatedAt: new Date(),
            },
          });
        } else {
          await tx.guest.create({
            data: {
              eventId: evento.id,
              name: String(nombreInvitado).trim(),
              phone: normalizedPhone,
              email: cleanEmail,
              maxPax: requestedPasses,
              confirmedPax: isAttending ? requestedPasses : 0,
              status: isAttending ? "attending" : "declined",
            },
          });
        }
      } catch (guestSyncErr) {
        console.warn("Aviso: Sincronización con tabla guest omitida:", guestSyncErr);
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
    const paquete = ((evento as any).ordenesCompra?.[0]?.paqueteId || "").toLowerCase();
    const planConSms = !(evento as any).ordenesCompra?.length || !paquete || (!paquete.includes("basic") && !paquete.includes("digital_basic"));

    if (planConSms && normalizedPhone && isAttending) {
      sendGuestConfirmationSms({
        telefono: normalizedPhone,
        nombreInvitado: rsvp.nombreInvitado,
        pases: requestedPasses,
        eventoTitulo: evento.titulo,
        ceremoniaNombre: (evento as any).ceremoniaNombre || undefined,
        ceremoniaDireccion: (evento as any).ceremoniaDireccion || undefined,
        ceremoniaMapUrl: (evento as any).ceremoniaMapUrl || undefined,
        recepcionNombre: evento.recepcionNombre || undefined,
        recepcionDireccion: (evento as any).recepcionDireccion || undefined,
        recepcionMapUrl: evento.recepcionMapUrl || undefined,
      }).catch((err) => console.error("Error SMS Twilio en segundo plano:", err));
    } else if (!planConSms && cleanEmail && isAttending) {
      const siteUrl = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://clickandlove.app";
      sendGuestConfirmationEmail({
        guestEmail: cleanEmail,
        nombreInvitado: rsvp.nombreInvitado,
        pases: requestedPasses,
        eventoTitulo: evento.titulo,
        slug: evento.slug,
        recepcionNombre: evento.recepcionNombre || undefined,
        recepcionDireccion: evento.recepcionDireccion || undefined,
        recepcionMapUrl: evento.recepcionMapUrl || undefined,
        siteUrl,
      }).catch((err) => console.error("Error Email SES Invitado en segundo plano:", err));
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
        email: cleanEmail || rsvp.email || undefined,
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

    if (error?.message?.startsWith("ALREADY_CONFIRMED:")) {
      const parts = error.message.split(":");
      const canal = parts[1] || "contacto";
      const pases = parts[2] || "1";
      const nombre = parts.slice(3).join(":") || "otro invitado";
      return NextResponse.json(
        {
          error: `Este ${canal} ya tiene ${pases} ${Number(pases) === 1 ? "pase confirmado" : "pases confirmados"} a nombre de ${nombre}. Para modificar tu asistencia, contacta al anfitrión.`,
          alreadyConfirmed: true,
          confirmedName: nombre,
          confirmedPax: Number(pases),
        },
        { status: 409 }
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
