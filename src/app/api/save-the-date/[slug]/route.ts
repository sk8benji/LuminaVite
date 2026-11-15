import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ensureSaveTheDateTables } from "@/lib/save-the-date-table";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/save-the-date/[slug]
export async function GET(req: NextRequest, context: RouteParams) {
  try {
    await ensureSaveTheDateTables();
    const { slug } = await context.params;

    const item = await prisma.saveTheDate.findUnique({
      where: { slug },
      include: {
        evento: {
          select: {
            id: true,
            slug: true,
            titulo: true,
            fechaEvento: true,
            tipoEvento: true,
            estiloPlantilla: true,
            telefonoWhatsappRsvp: true,
          },
        },
        preRsvps: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Save The Date no encontrado" },
        { status: 404 }
      );
    }

    // Incrementar contador de visitas de forma no bloqueante
    prisma.saveTheDate.update({
      where: { id: item.id },
      data: { vistasContador: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Error al obtener Save The Date:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error?.message },
      { status: 500 }
    );
  }
}

// PATCH /api/save-the-date/[slug]
export async function PATCH(req: NextRequest, context: RouteParams) {
  try {
    await ensureSaveTheDateTables();
    const { slug } = await context.params;
    const body = await req.json();

    let existing = await prisma.saveTheDate.findUnique({
      where: { slug },
    });

    if (!existing) {
      if (slug === "demo") {
        existing = await prisma.saveTheDate.create({
          data: {
            slug: "demo",
            titulo: body.titulo || "Melissa",
            subtitulo: body.subtitulo || "Mis Quince Años",
            mensaje: body.mensaje || "Guarda esta fecha especial en tu calendario.",
            fechaEvento: body.fechaEvento ? new Date(body.fechaEvento) : new Date("2027-09-18T20:00:00Z"),
            fechaTextoPersonalizada: body.fechaTextoPersonalizada || "Viernes 18 de Septiembre, 2026",
            ciudad: body.ciudad || "Los Ángeles, California",
            estiloPlantilla: body.estiloPlantilla || "QUINCE_ROSADO",
            colorSobre: body.colorSobre || "#FFE8EE",
            colorSello: body.colorSello || "#D4AF37",
            fotoPortadaUrl: body.fotoPortadaUrl || "/assets/save-the-date/principal.jpeg",
            galeriaFotosUrls: body.galeriaFotosUrls || [
              "/assets/save-the-date/save1.webp",
              "/assets/save-the-date/save2.webp",
              "/assets/save-the-date/save3.webp",
            ],
            musicaUrl: body.musicaUrl,
            musicaTitulo: body.musicaTitulo,
            mostrarSobre: body.mostrarSobre !== undefined ? body.mostrarSobre : true,
            mostrarGaleria: body.mostrarGaleria !== undefined ? body.mostrarGaleria : true,
            mostrarContador: body.mostrarContador !== undefined ? body.mostrarContador : true,
            mostrarCalendario: body.mostrarCalendario !== undefined ? body.mostrarCalendario : true,
            mostrarPreRsvp: body.mostrarPreRsvp !== undefined ? body.mostrarPreRsvp : true,
            textoPreRsvp: body.textoPreRsvp || "¿Podrás Acompañarnos?",
            telefonoWhatsapp: body.telefonoWhatsapp || "18181234567",
          },
        });
        return NextResponse.json({ success: true, item: existing });
      }

      return NextResponse.json(
        { error: "Save The Date no encontrado" },
        { status: 404 }
      );
    }

    const dataToUpdate: any = { ...body };

    // Si viene fechaEvento como string, parsearlo a Date
    if (dataToUpdate.fechaEvento) {
      dataToUpdate.fechaEvento = new Date(dataToUpdate.fechaEvento);
    }

    // No permitir cambiar id o slug directo en el patch simple
    delete dataToUpdate.id;

    const updated = await prisma.saveTheDate.update({
      where: { id: existing.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error("Error al actualizar Save The Date:", error);
    return NextResponse.json(
      { error: "Error al actualizar Save The Date", details: error?.message },
      { status: 500 }
    );
  }
}

// DELETE /api/save-the-date/[slug]
export async function DELETE(req: NextRequest, context: RouteParams) {
  try {
    await ensureSaveTheDateTables();
    const { slug } = await context.params;

    const existing = await prisma.saveTheDate.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Save The Date no encontrado" },
        { status: 404 }
      );
    }

    await prisma.saveTheDate.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: "Save The Date eliminado con éxito" });
  } catch (error: any) {
    console.error("Error al eliminar Save The Date:", error);
    return NextResponse.json(
      { error: "Error al eliminar Save The Date", details: error?.message },
      { status: 500 }
    );
  }
}
