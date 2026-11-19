import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  ensureSaveTheDateTables,
  getSaveTheDateTitulos,
  pickTitulosBilingues,
  updateSaveTheDateTitulos,
} from "@/lib/save-the-date-table";

// Campos que el Prisma Client generado SÍ conoce (están en schema.prisma).
// Todo lo demás que mande el cliente se ignora aquí; los 9 títulos
// bilingües van por updateSaveTheDateTitulos (SQL crudo).
const CAMPOS_PRISMA = [
  "eventoId",
  "titulo",
  "subtitulo",
  "mensaje",
  "fechaEvento",
  "fechaTextoPersonalizada",
  "ciudad",
  "estiloPlantilla",
  "colorSobre",
  "colorSello",
  "tipoLetra",
  "fotoPortadaUrl",
  "galeriaFotosUrls",
  "musicaUrl",
  "musicaTitulo",
  "mostrarSobre",
  "mostrarGaleria",
  "mostrarContador",
  "mostrarCalendario",
  "mostrarPreRsvp",
  "textoPreRsvp",
  "telefonoWhatsapp",
] as const;

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

    // GET: devolver también los títulos bilingües (no los trae Prisma).
    const titulos = await getSaveTheDateTitulos(item.id);

    return NextResponse.json({ success: true, item: { ...item, ...titulos } });
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

    // Solo campos que Prisma conoce: el form del admin manda además los 9
    // títulos bilingües (no están en el schema) y eso tumbaba el guardado
    // con "Unknown argument" (500). Esos van por SQL crudo abajo.
    const dataToUpdate: any = {};
    for (const key of CAMPOS_PRISMA) {
      if (body[key] !== undefined) dataToUpdate[key] = body[key];
    }

    // Sin vincular = null, no "" ("" rompe la FK a Evento con P2003).
    if (dataToUpdate.eventoId === "") dataToUpdate.eventoId = null;
    if (dataToUpdate.eventoId) {
      const evento = await prisma.evento.findUnique({
        where: { id: dataToUpdate.eventoId },
        select: { id: true },
      });
      if (!evento) {
        return NextResponse.json(
          { error: "La invitación vinculada ya no existe. Desvincula el Save The Date y guarda de nuevo." },
          { status: 400 }
        );
      }
    }

    // Si viene fechaEvento como string, parsearlo a Date
    if (dataToUpdate.fechaEvento) {
      const fecha = new Date(dataToUpdate.fechaEvento);
      if (isNaN(fecha.getTime())) {
        return NextResponse.json(
          { error: "La fecha del evento no es válida." },
          { status: 400 }
        );
      }
      dataToUpdate.fechaEvento = fecha;
    }
    if (dataToUpdate.galeriaFotosUrls && !Array.isArray(dataToUpdate.galeriaFotosUrls)) {
      dataToUpdate.galeriaFotosUrls = [];
    }

    // Cambio de slug: normalizar igual que en POST y evitar colisiones.
    let nuevoSlug: string | null = null;
    if (typeof body.slug === "string" && body.slug.trim()) {
      nuevoSlug = body.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");
      if (nuevoSlug && nuevoSlug !== existing.slug) {
        const choque = await prisma.saveTheDate.findUnique({
          where: { slug: nuevoSlug },
        });
        if (choque) {
          return NextResponse.json(
            { error: `Ya existe un Save The Date con el enlace "${nuevoSlug}". Por favor elige otro.` },
            { status: 409 }
          );
        }
        dataToUpdate.slug = nuevoSlug;
      }
    }

    const updated = await prisma.saveTheDate.update({
      where: { id: existing.id },
      data: dataToUpdate,
    });

    // Títulos bilingües por SQL crudo (no los conoce el Prisma Client).
    const titulos = pickTitulosBilingues(body);
    await updateSaveTheDateTitulos(existing.id, titulos);
    const titulosGuardados = await getSaveTheDateTitulos(existing.id);

    return NextResponse.json({
      success: true,
      item: { ...updated, ...titulosGuardados },
    });
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
