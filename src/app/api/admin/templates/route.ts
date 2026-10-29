import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { INITIAL_MASTER_TEMPLATES, MasterTemplateItem } from "@/lib/templates-data";
import { requireAdmin } from "@/lib/auth";
import { ensurePostgresTables } from "@/lib/init-db";

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
          configExtra: updates,
        },
        create: {
          slug,
          nombre: updates.nombre || slug,
          categoria: (updates.categoria as any) || "QUINCEANERA",
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
          configExtra: updates,
        },
      });
    } catch (dbErr) {
      console.error("No se pudo persistir la plantilla en PostgreSQL:", dbErr);
      return NextResponse.json(
        { error: "No se pudo guardar la plantilla en la base de datos. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Plantilla actualizada con éxito." });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar plantilla", details: error?.message },
      { status: 500 }
    );
  }
}
