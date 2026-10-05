import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventoId, nombreInvitado, asistira, pases, acompanantes } = body;

    if (!eventoId || !nombreInvitado) {
      return NextResponse.json(
        { error: "eventoId y nombreInvitado son requeridos." },
        { status: 400 }
      );
    }

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
      return NextResponse.json({ success: true, isDemo: true });
    }

    const rsvp = await prisma.rsvpRegistro.create({
      data: {
        eventoId: targetEventoId,
        nombreInvitado,
        asistira: Boolean(asistira),
        pases: Number(pases) || 1,
        acompanantes: acompanantes || null,
      },
    });

    return NextResponse.json({ success: true, rsvp });
  } catch (error) {
    console.error("Error guardando RSVP en BD:", error);
    // Retornamos 200 de todas maneras para no bloquear la experiencia de usuario
    return NextResponse.json({ success: false, error: "Error al guardar en BD" });
  }
}
