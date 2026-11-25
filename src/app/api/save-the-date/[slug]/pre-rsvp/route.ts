import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ensureSaveTheDateTables } from "@/lib/save-the-date-table";
import { ensureGuestsTable } from "@/lib/guests-table";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// POST /api/save-the-date/[slug]/pre-rsvp
export async function POST(req: NextRequest, context: RouteParams) {
  try {
    await ensureSaveTheDateTables();
    await ensureGuestsTable();

    const { slug } = await context.params;
    const body = await req.json();
    const { nombre, telefono, email, respuesta, pasesTentativos, notas } = body;

    if (!nombre || !nombre.trim()) {
      return NextResponse.json(
        { error: "Por favor proporciona tu nombre para confirmar." },
        { status: 400 }
      );
    }

    const saveTheDate = await prisma.saveTheDate.findUnique({
      where: { slug },
      include: { evento: true },
    });

    if (!saveTheDate) {
      return NextResponse.json(
        { error: "Save The Date no encontrado" },
        { status: 404 }
      );
    }

    // 1. Guardar el registro de Pre-RSVP
    const preRsvp = await prisma.preRsvpRegistro.create({
      data: {
        saveTheDateId: saveTheDate.id,
        nombre: nombre.trim(),
        telefono: telefono ? telefono.trim() : null,
        email: email ? email.trim() : null,
        respuesta: respuesta || "SI",
        pasesTentativos: Number(pasesTentativos) || 1,
        notas: notas ? notas.trim() : null,
      },
    });

    // 2. Si está conectado a un Evento (Quinceañera), sincronizar automáticamente en la tabla Guest
    let guestSincronizado = null;
    if (saveTheDate.eventoId) {
      try {
        const guestStatus = respuesta === "SI" ? "attending" : respuesta === "NO" ? "declined" : "pending";
        const paxNumber = Number(pasesTentativos) || 1;

        // Buscar si ya existe un invitado por teléfono o nombre
        let existingGuest = null;
        if (telefono) {
          existingGuest = await prisma.guest.findFirst({
            where: {
              eventId: saveTheDate.eventoId,
              phone: telefono.trim(),
            },
          });
        }

        if (!existingGuest) {
          existingGuest = await prisma.guest.findFirst({
            where: {
              eventId: saveTheDate.eventoId,
              name: { equals: nombre.trim(), mode: "insensitive" },
            },
          });
        }

        if (existingGuest) {
          guestSincronizado = await prisma.guest.update({
            where: { id: existingGuest.id },
            data: {
              status: guestStatus,
              confirmedPax: respuesta === "SI" ? paxNumber : 0,
              notes: notas ? `[Save The Date]: ${notas}` : existingGuest.notes,
            },
          });
        } else {
          guestSincronizado = await prisma.guest.create({
            data: {
              eventId: saveTheDate.eventoId,
              name: nombre.trim(),
              phone: telefono ? telefono.trim() : null,
              email: email ? email.trim() : null,
              maxPax: paxNumber,
              confirmedPax: respuesta === "SI" ? paxNumber : 0,
              status: guestStatus,
              notes: `[Save The Date]: Pre-confirmación registrada`,
            },
          });
        }
      } catch (guestErr) {
        console.warn("Aviso al sincronizar guest con Evento vinculado:", guestErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "¡Gracias! Tu confirmación para el Save The Date ha sido registrada.",
      preRsvp,
      guestSincronizado: Boolean(guestSincronizado),
    });
  } catch (error: any) {
    console.error("Error al registrar pre-rsvp:", error);
    return NextResponse.json(
      { error: "Error al procesar la confirmación", details: error?.message },
      { status: 500 }
    );
  }
}
