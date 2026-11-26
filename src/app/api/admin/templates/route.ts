import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { INITIAL_MASTER_TEMPLATES, MasterTemplateItem } from "@/lib/templates-data";
import { requireAdmin } from "@/lib/auth";
import { ensurePostgresTables } from "@/lib/init-db";
import { ensureSaveTheDateTables } from "@/lib/save-the-date-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    // La tabla MasterTemplate debe existir antes de leer (primer guardado tras el deploy)
    await ensurePostgresTables();
    // 1. Intentar cargar desde Prisma
    let dbTemplates: any[] = [];
    try {
      dbTemplates = await (prisma as any).masterTemplate.findMany({
        orderBy: { orden: "asc" },
      });
    } catch {
      // Si la tabla aún no está lista en PostgreSQL local, procedemos con overrides locales
    }

    // 2. Combinar base con DB (la DB gana). Sin archivo local: lo guardado persiste entre deploys.
    const templates = INITIAL_MASTER_TEMPLATES.map((item) => {
      const dbMatch = dbTemplates.find((d) => d.slug === item.slug);

      return {
        ...item,
        ...(dbMatch || {}),
        // El estilo es identidad del template y lo define el codigo: el admin
        // no tiene UI para cambiarlo y el guardado nunca lo escribe, asi que
        // una fila creada con el default (BLUE_BUTTERFLY) pisaria el correcto
        // y la vista previa del admin mostraria otro template (paso con Gybsy).
        estiloPlantilla: item.estiloPlantilla,
      };
    });

    return NextResponse.json({ templates });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error obteniendo plantillas", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const { slug, ...updates } = body;
    // No anidar el blob anterior: configExtra se guarda plano, sin configExtra dentro
    const { configExtra: _configExtraPrevio, ...cleanUpdates } = updates as any;

    if (!slug) {
      return NextResponse.json({ error: "El slug de la plantilla es requerido." }, { status: 400 });
    }

    // La tabla MasterTemplate debe existir antes del upsert (primer guardado tras el deploy)
    await ensurePostgresTables();
    // Guardar en PostgreSQL via Prisma (única fuente de verdad)
    try {
      await (prisma as any).masterTemplate.upsert({
        where: { slug },
        update: {
          nombre: updates.nombre,
          categoria: updates.categoria as any,
          estiloPlantilla:
            (updates.estiloPlantilla as any) ||
            (INITIAL_MASTER_TEMPLATES.find((t) => t.slug === slug)?.estiloPlantilla as any),
          titulo: updates.titulo,
          subtitulo: updates.subtitulo,
          frasePersonalizada: updates.frasePersonalizada,
          tipoLetra: updates.tipoLetra,
          musicaUrl: updates.musicaUrl,
          musicaTitulo: updates.musicaTitulo,
          colorSobre: updates.colorSobre,
          colorSello: updates.colorSello,
          fotoPortadaUrl: updates.fotoPortadaUrl,
          fotoInfanciaUrl: updates.fotoInfanciaUrl,
          fotoActualUrl: updates.fotoActualUrl,
          fotoCierreUrl: updates.fotoCierreUrl,
          configExtra: cleanUpdates,
        },
        create: {
          slug,
          nombre: updates.nombre || slug,
          categoria: (updates.categoria as any) || "QUINCEANERA",
          estiloPlantilla:
            (updates.estiloPlantilla as any) ||
            (INITIAL_MASTER_TEMPLATES.find((t) => t.slug === slug)?.estiloPlantilla as any),
          titulo: updates.titulo || "Título Base",
          subtitulo: updates.subtitulo,
          frasePersonalizada: updates.frasePersonalizada,
          tipoLetra: updates.tipoLetra || "Cinzel",
          musicaUrl: updates.musicaUrl,
          musicaTitulo: updates.musicaTitulo,
          colorSobre: updates.colorSobre || "#E8D5C4",
          colorSello: updates.colorSello || "#C5A059",
          fotoPortadaUrl: updates.fotoPortadaUrl || "",
          fotoInfanciaUrl: updates.fotoInfanciaUrl,
          fotoActualUrl: updates.fotoActualUrl,
          fotoCierreUrl: updates.fotoCierreUrl,
          configExtra: cleanUpdates,
        },
      });
    } catch (dbErr) {
      console.error("No se pudo persistir la plantilla en PostgreSQL:", dbErr);
      return NextResponse.json(
        { error: "No se pudo guardar la plantilla en la base de datos. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    // Si es una plantilla Save the Date, sincronizar también en la tabla SaveTheDate ('demo' o 'coquette-pink')
    const isQuinceRosadoStd =
      slug === "save-the-date-quince-rosado" || updates.estiloPlantilla === "SAVE_THE_DATE_QUINCE_ROSADO";
    const isCoquettePinkStd =
      slug === "save-the-date-coquette-pink" || updates.estiloPlantilla === "SAVE_THE_DATE_COQUETTE_PINK";

    if (isQuinceRosadoStd || isCoquettePinkStd) {
      const targetStdSlug = isCoquettePinkStd ? "coquette-pink" : "demo";
      try {
        await ensureSaveTheDateTables();
        const galeria = cleanUpdates.galeriaFotosUrls || [
          updates.fotoInfanciaUrl,
          updates.fotoActualUrl,
          updates.fotoCierreUrl,
        ].filter(Boolean);

        await prisma.saveTheDate.upsert({
          where: { slug: targetStdSlug },
          update: {
            titulo: updates.titulo || (isCoquettePinkStd ? "Melissa Cardenas" : "Melissa"),
            subtitulo: updates.subtitulo || "Mis Quince Años",
            mensaje: updates.frasePersonalizada || cleanUpdates.mensaje || "Guarda esta fecha especial en tu calendario.",
            fechaEvento: cleanUpdates.fechaEvento ? new Date(cleanUpdates.fechaEvento) : new Date("2027-09-18T20:00:00Z"),
            fechaTextoPersonalizada: updates.fechaTextoPersonalizada || "Viernes 18 de Septiembre, 2026",
            ciudad: cleanUpdates.ciudad || updates.fechaPlacaLugar || "Los Ángeles, California",
            colorSobre: updates.colorSobre || "#FFE8EE",
            colorSello: updates.colorSello || "#D4AF37",
            fotoPortadaUrl: updates.fotoPortadaUrl || "/assets/save-the-date/principal.jpeg",
            galeriaFotosUrls: galeria.length > 0 ? galeria : [
              "/assets/save-the-date/save1.webp",
              "/assets/save-the-date/save2.webp",
              "/assets/save-the-date/save3.webp",
            ],
            musicaUrl: updates.musicaUrl,
            musicaTitulo: updates.musicaTitulo,
            mostrarSobre: cleanUpdates.mostrarSobre !== undefined ? cleanUpdates.mostrarSobre : true,
            mostrarGaleria: cleanUpdates.mostrarGaleria !== undefined ? cleanUpdates.mostrarGaleria : true,
            mostrarContador: cleanUpdates.mostrarContador !== undefined ? cleanUpdates.mostrarContador : true,
            mostrarCalendario: cleanUpdates.mostrarCalendario !== undefined ? cleanUpdates.mostrarCalendario : true,
            mostrarPreRsvp: cleanUpdates.mostrarPreRsvp !== undefined ? cleanUpdates.mostrarPreRsvp : true,
            textoPreRsvp: cleanUpdates.textoPreRsvp || "¿Podrás Acompañarnos?",
            telefonoWhatsapp: cleanUpdates.telefonoWhatsapp || "18181234567",
          },
          create: {
            slug: targetStdSlug,
            titulo: updates.titulo || "Melissa",
            subtitulo: updates.subtitulo || "Mis Quince Años",
            mensaje: updates.frasePersonalizada || cleanUpdates.mensaje || "Guarda esta fecha especial en tu calendario.",
            fechaEvento: cleanUpdates.fechaEvento ? new Date(cleanUpdates.fechaEvento) : new Date("2027-09-18T20:00:00Z"),
            fechaTextoPersonalizada: updates.fechaTextoPersonalizada || "Viernes 18 de Septiembre, 2026",
            ciudad: cleanUpdates.ciudad || updates.fechaPlacaLugar || "Los Ángeles, California",
            colorSobre: updates.colorSobre || "#FFE8EE",
            colorSello: updates.colorSello || "#D4AF37",
            fotoPortadaUrl: updates.fotoPortadaUrl || "/assets/save-the-date/principal.jpeg",
            galeriaFotosUrls: galeria.length > 0 ? galeria : [
              "/assets/save-the-date/save1.webp",
              "/assets/save-the-date/save2.webp",
              "/assets/save-the-date/save3.webp",
            ],
            musicaUrl: updates.musicaUrl,
            musicaTitulo: updates.musicaTitulo,
            mostrarSobre: true,
            mostrarGaleria: true,
            mostrarContador: true,
            mostrarCalendario: true,
            mostrarPreRsvp: true,
            textoPreRsvp: "¿Podrás Acompañarnos?",
            telefonoWhatsapp: "18181234567",
          },
        });
      } catch (syncErr) {
        console.warn("Aviso al sincronizar SaveTheDate demo desde admin/templates:", syncErr);
      }
    }

    return NextResponse.json({ success: true, message: "Plantilla actualizada con éxito." });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar plantilla", details: error?.message },
      { status: 500 }
    );
  }
}
