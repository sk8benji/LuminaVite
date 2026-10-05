import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  sendGuestConfirmationSms,
  sendHostNotificationEmail,
} from "@/lib/notifications";

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

    if ((!eventoId && !slug) || !nombreInvitado) {
      return NextResponse.json(
        { error: "eventoId/slug y nombreInvitado son requeridos." },
        { status: 400 }
      );
    }

    const cleanIdentifier = (slug || eventoId || "").replace(/^slug-/, "");
    const normalizedPhone = telefono ? String(telefono).replace(/[^0-9]/g, "") : null;
    const passesCount = Boolean(asistira) ? Number(pases) || 1 : 0;

    // Buscar el evento en BD
    const evento = await prisma.evento.findFirst({
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

    // Si es demo o no existe en BD
    if (!evento) {
      return NextResponse.json({
        success: true,
        isDemo: true,
        isUpdate: false,
        message: `¡Gracias, ${nombreInvitado}! Tu confirmación para ${passesCount} ${
          passesCount === 1 ? "pase" : "pases"
        } ha sido registrada exitosamente. Te enviamos los detalles por SMS.`,
      });
    }

    // CONTROL INTELIGENTE DE DUPLICADOS (UPSERT)
    let rsvpExistente = null;

    if (normalizedPhone) {
      rsvpExistente = await prisma.rsvpRegistro.findFirst({
        where: {
          eventoId: evento.id,
          telefono: normalizedPhone,
        },
      });
    }

    if (!rsvpExistente && nombreInvitado.trim()) {
      rsvpExistente = await prisma.rsvpRegistro.findFirst({
        where: {
          eventoId: evento.id,
          nombreInvitado: {
            equals: nombreInvitado.trim(),
            mode: "insensitive",
          },
        },
      });
    }

    let rsvp;
    let isUpdate = false;
    let seatsChanged = false;

    if (rsvpExistente) {
      isUpdate = true;
      seatsChanged = rsvpExistente.pases !== passesCount;

      rsvp = await prisma.rsvpRegistro.update({
        where: { id: rsvpExistente.id },
        data: {
          nombreInvitado,
          telefono: normalizedPhone || rsvpExistente.telefono,
          asistira: Boolean(asistira),
          pases: passesCount,
          acompanantes: acompanantes || rsvpExistente.acompanantes,
        },
      });
    } else {
      rsvp = await prisma.rsvpRegistro.create({
        data: {
          eventoId: evento.id,
          nombreInvitado,
          telefono: normalizedPhone,
          asistira: Boolean(asistira),
          pases: passesCount,
          acompanantes: acompanantes || null,
        },
      });
    }

    // Calcular el acumulado de pases confirmados
    const totalPasesAgg = await prisma.rsvpRegistro.aggregate({
      where: {
        eventoId: evento.id,
        asistira: true,
      },
      _sum: {
        pases: true,
      },
    });
    const totalPasesConfirmados = totalPasesAgg._sum.pases || passesCount;

    // 1. DISPARAR SMS DE TWILIO AL INVITADO (en segundo plano / no bloqueante)
    if (normalizedPhone && Boolean(asistira)) {
      sendGuestConfirmationSms({
        telefono: normalizedPhone,
        nombreInvitado,
        pases: passesCount,
        eventoTitulo: evento.titulo,
        recepcionNombre: evento.recepcionNombre,
        recepcionMapUrl: evento.recepcionMapUrl,
      }).catch((err) => console.error("Error SMS Twilio no bloqueante:", err));
    }

    // 2. DISPARAR EMAIL AL ANFITRIÓN CON AWS SES (en segundo plano / no bloqueante)
    const hostEmail =
      evento.emailOrganizador ||
      evento.usuario?.email ||
      process.env.ADMIN_EMAIL ||
      "admin@luminavite.com";

    if (hostEmail && Boolean(asistira)) {
      const siteUrl = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      sendHostNotificationEmail({
        hostEmail,
        eventoTitulo: evento.titulo,
        slug: evento.slug,
        panelToken: evento.panelToken,
        nombreInvitado,
        telefono: normalizedPhone,
        pases: passesCount,
        totalPasesConfirmados,
        aforoTotal: evento.aforoTotal || 200,
        siteUrl,
      }).catch((err) => console.error("Error Email SES no bloqueante:", err));
    }

    return NextResponse.json({
      success: true,
      rsvp,
      isUpdate,
      seatsChanged,
      message: `¡Gracias, ${nombreInvitado}! Tu confirmación para ${passesCount} ${
        passesCount === 1 ? "pase" : "pases"
      } ha sido registrada exitosamente. Te enviamos los detalles por SMS.`,
    });
  } catch (error) {
    console.error("Error en /api/rsvp:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la confirmación." },
      { status: 500 }
    );
  }
}
