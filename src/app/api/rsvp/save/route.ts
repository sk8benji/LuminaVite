import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventoId, nombreInvitado, telefono, asistira, pases, acompanantes } = body;

    if (!eventoId || !nombreInvitado) {
      return NextResponse.json(
        { error: "eventoId y nombreInvitado son requeridos." },
        { status: 400 }
      );
    }

    // Normalizar número de teléfono (solo dígitos)
    const normalizedPhone = telefono ? String(telefono).replace(/[^0-9]/g, "") : null;

    // Si es demo slug de ejemplo y la BD no tiene el evento
    let targetEventoId = eventoId;
    
    // Buscar si eventoId es en realidad un slug
    const eventoEncontrado = await prisma.evento.findFirst({
      where: {
        OR: [{ id: eventoId }, { slug: eventoId.replace(/^slug-/, "") }],
      },
      select: { id: true },
    });

    if (eventoEncontrado) {
      targetEventoId = eventoEncontrado.id;
    } else {
      // Si no existe en BD (ej. en modo demo local sin migración), retornamos éxito
      return NextResponse.json({ success: true, isDemo: true, isUpdate: false });
    }

    // CONTROL INTELIGENTE DE DUPLICADOS (UPSERT):
    // Si viene teléfono o nombre exacto para este evento, verificar si ya existe registro previo
    let rsvpExistente = null;

    if (normalizedPhone) {
      rsvpExistente = await prisma.rsvpRegistro.findFirst({
        where: {
          eventoId: targetEventoId,
          telefono: normalizedPhone,
        },
      });
    }

    // Fallback: si no mandaron teléfono o no se halló, buscar por nombre exacto en el mismo evento
    if (!rsvpExistente && nombreInvitado.trim()) {
      rsvpExistente = await prisma.rsvpRegistro.findFirst({
        where: {
          eventoId: targetEventoId,
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
      // MODO ACTUALIZACIÓN SILENCIOSA (UPSERT)
      isUpdate = true;
      seatsChanged = rsvpExistente.pases !== Number(pases);

      rsvp = await prisma.rsvpRegistro.update({
        where: { id: rsvpExistente.id },
        data: {
          nombreInvitado,
          telefono: normalizedPhone || rsvpExistente.telefono,
          asistira: Boolean(asistira),
          pases: Boolean(asistira) ? Number(pases) || 1 : 0,
          acompanantes: acompanantes || rsvpExistente.acompanantes,
        },
      });

      return NextResponse.json({
        success: true,
        rsvp,
        isUpdate: true,
        seatsChanged,
        message: `Hemos actualizado tu confirmación previa. Tienes reservados ${rsvp.pases} pases.`,
      });
    }

    // REGISTRO NUEVO
    rsvp = await prisma.rsvpRegistro.create({
      data: {
        eventoId: targetEventoId,
        nombreInvitado,
        telefono: normalizedPhone,
        asistira: Boolean(asistira),
        pases: Boolean(asistira) ? Number(pases) || 1 : 0,
        acompanantes: acompanantes || null,
      },
    });

    return NextResponse.json({
      success: true,
      rsvp,
      isUpdate: false,
      seatsChanged: false,
      message: `¡Confirmación exitosa! Tienes reservados ${rsvp.pases} pases.`,
    });
  } catch (error) {
    console.error("Error guardando RSVP en BD:", error);
    // Retornamos 200 de todas maneras para no bloquear la experiencia de usuario
    return NextResponse.json({ success: false, error: "Error al guardar en BD" });
  }
}
