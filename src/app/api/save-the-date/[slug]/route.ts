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

    const existing = await prisma.saveTheDate.findUnique({
      where: { slug },
    });

    if (!existing) {
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
