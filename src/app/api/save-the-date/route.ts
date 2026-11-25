import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  ensureSaveTheDateTables,
  getSaveTheDateFotoSobreAbiertoMany,
  getSaveTheDateTitulosMany,
  pickTitulosBilingues,
  updateSaveTheDateFotoSobreAbierto,
  updateSaveTheDateTitulos,
} from "@/lib/save-the-date-table";

export const dynamic = "force-dynamic";

// GET /api/save-the-date -> Listar todos los Save The Dates
export async function GET() {
  try {
    await ensureSaveTheDateTables();

    const items = await prisma.saveTheDate.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        evento: {
          select: {
            id: true,
            slug: true,
            titulo: true,
            fechaEvento: true,
            tipoEvento: true,
            estiloPlantilla: true,
          },
        },
        _count: {
          select: {
            preRsvps: true,
          },
        },
      },
    });

    // GET: devolver también los títulos bilingües y la foto del sobre
    // abierto (no los trae Prisma), si no el admin los ve en blanco al
    // reabrir aunque estén guardados.
    const titulosPorId = await getSaveTheDateTitulosMany(
      items.map((i: any) => i.id)
    );
    const fotosPorId = await getSaveTheDateFotoSobreAbiertoMany(
      items.map((i: any) => i.id)
    );
    const itemsConTitulos = items.map((i: any) => ({
      ...i,
      ...(titulosPorId[i.id] || {}),
      fotoSobreAbiertoUrl: fotosPorId[i.id] ?? null,
    }));

    return NextResponse.json({ success: true, items: itemsConTitulos });
  } catch (error: any) {
    console.error("Error al obtener Save The Dates:", error);
    return NextResponse.json(
      { error: "Error al obtener Save The Dates", details: error?.message },
      { status: 500 }
    );
  }
}

// POST /api/save-the-date -> Crear nuevo Save The Date
export async function POST(req: NextRequest) {
  try {
    await ensureSaveTheDateTables();

    const body = await req.json();
    const {
      slug,
      eventoId,
      titulo,
      subtitulo,
      mensaje,
      fechaEvento,
      fechaTextoPersonalizada,
      ciudad,
      estiloPlantilla,
      colorSobre,
      colorSello,
      tipoLetra,
      fotoPortadaUrl,
      galeriaFotosUrls,
      musicaUrl,
      musicaTitulo,
      mostrarSobre,
      mostrarGaleria,
      mostrarContador,
      mostrarCalendario,
      mostrarPreRsvp,
      textoPreRsvp,
      telefonoWhatsapp,
    } = body;

    if (!slug || !titulo || !fechaEvento || !fotoPortadaUrl) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: slug, titulo, fechaEvento, fotoPortadaUrl" },
        { status: 400 }
      );
    }

    // Normalizar slug
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    // Verificar colisión de slug
    const existing = await prisma.saveTheDate.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Ya existe un Save The Date con el enlace "${cleanSlug}". Por favor elige otro.` },
        { status: 409 }
      );
    }

    const created = await prisma.saveTheDate.create({
      data: {
        slug: cleanSlug,
        eventoId: eventoId || null,
        titulo: titulo.trim(),
        subtitulo: subtitulo || "Save Our Date",
        mensaje: mensaje || null,
        fechaEvento: new Date(fechaEvento),
        fechaTextoPersonalizada: fechaTextoPersonalizada || null,
        ciudad: ciudad || null,
        estiloPlantilla: estiloPlantilla || "QUINCE_ROSADO",
        colorSobre: colorSobre || "#FFF0F3",
        colorSello: colorSello || "#C5A059",
        tipoLetra: tipoLetra || "Cinzel",
        fotoPortadaUrl,
        galeriaFotosUrls: Array.isArray(galeriaFotosUrls)
          ? galeriaFotosUrls.filter((u: any) => typeof u === "string" && u.trim() !== "")
          : [],
        musicaUrl: musicaUrl || null,
        musicaTitulo: musicaTitulo || null,
        mostrarSobre: mostrarSobre !== false,
        mostrarGaleria: mostrarGaleria !== false,
        mostrarContador: mostrarContador !== false,
        mostrarCalendario: mostrarCalendario !== false,
        mostrarPreRsvp: mostrarPreRsvp !== false,
        textoPreRsvp: textoPreRsvp || "¿Crees que podrás acompañarnos?",
        telefonoWhatsapp: telefonoWhatsapp || null,
      },
    });

    // Títulos bilingües por SQL crudo (no los conoce el Prisma Client);
    // si no, al crear con títulos personalizados se perderían en silencio.
    const titulos = pickTitulosBilingues(body);
    await updateSaveTheDateTitulos(created.id, titulos);

    // Foto del sobre abierto, también por SQL crudo (misma razón).
    if (body.fotoSobreAbiertoUrl !== undefined) {
      await updateSaveTheDateFotoSobreAbierto(
        created.id,
        body.fotoSobreAbiertoUrl || null
      );
    }

    return NextResponse.json({
      success: true,
      item: {
        ...created,
        ...titulos,
        fotoSobreAbiertoUrl: body.fotoSobreAbiertoUrl ?? null,
      },
    });
  } catch (error: any) {
    console.error("Error al crear Save The Date:", error);
    return NextResponse.json(
      { error: "Error al crear Save The Date", details: error?.message },
      { status: 500 }
    );
  }
}
