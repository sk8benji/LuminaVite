import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "@/lib/db";
import { INITIAL_MASTER_TEMPLATES, MasterTemplateItem } from "@/lib/templates-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const OVERRIDES_FILE = path.join(process.cwd(), "src", "lib", "templates-overrides.json");

function getLocalOverrides(): Record<string, Partial<MasterTemplateItem>> {
  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      const data = fs.readFileSync(OVERRIDES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("No se pudo leer templates-overrides.json:", err);
  }
  return {};
}

function saveLocalOverride(slug: string, updates: Partial<MasterTemplateItem>) {
  try {
    const current = getLocalOverrides();
    current[slug] = { ...(current[slug] || {}), ...updates };
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.warn("No se pudo guardar en templates-overrides.json:", err);
  }
}

export async function GET() {
  try {
    // 1. Intentar cargar desde Prisma
    let dbTemplates: any[] = [];
    try {
      dbTemplates = await (prisma as any).masterTemplate.findMany({
        orderBy: { orden: "asc" },
      });
    } catch {
      // Si la tabla aún no está lista en PostgreSQL local, procedemos con overrides locales
    }

    const localOverrides = getLocalOverrides();

    // 2. Combinar base con DB y overrides
    const templates = INITIAL_MASTER_TEMPLATES.map((item) => {
      const dbMatch = dbTemplates.find((d) => d.slug === item.slug);
      const localMatch = localOverrides[item.slug];

      return {
        ...item,
        ...(dbMatch ? {
          nombre: dbMatch.nombre || item.nombre,
          titulo: dbMatch.titulo || item.titulo,
          subtitulo: dbMatch.subtitulo || item.subtitulo,
          frasePersonalizada: dbMatch.frasePersonalizada || item.frasePersonalizada,
          tipoLetra: dbMatch.tipoLetra || item.tipoLetra,
          musicaUrl: dbMatch.musicaUrl || item.musicaUrl,
          musicaTitulo: dbMatch.musicaTitulo || item.musicaTitulo,
          colorSobre: dbMatch.colorSobre || item.colorSobre,
          colorSello: dbMatch.colorSello || item.colorSello,
          fotoPortadaUrl: dbMatch.fotoPortadaUrl || item.fotoPortadaUrl,
          fotoInfanciaUrl: dbMatch.fotoInfanciaUrl || item.fotoInfanciaUrl,
          fotoActualUrl: dbMatch.fotoActualUrl || item.fotoActualUrl,
          fotoCierreUrl: dbMatch.fotoCierreUrl || item.fotoCierreUrl,
        } : {}),
        ...(localMatch || {}),
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
  try {
    const body = await req.json();
    const { slug, ...updates } = body;

    if (!slug) {
      return NextResponse.json({ error: "El slug de la plantilla es requerido." }, { status: 400 });
    }

    // 1. Guardar localmente para disponibilidad inmediata
    saveLocalOverride(slug, updates);

    // 2. Intentar guardar en PostgreSQL via Prisma si está disponible
    try {
      await (prisma as any).masterTemplate.upsert({
        where: { slug },
        update: {
          nombre: updates.nombre,
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
        },
        create: {
          slug,
          nombre: updates.nombre || slug,
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
        },
      });
    } catch (dbErr) {
      console.warn("No se pudo persistir en DB PostgreSQL (se guardó en almacenamiento local):", dbErr);
    }

    return NextResponse.json({ success: true, message: "Plantilla actualizada con éxito." });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar plantilla", details: error?.message },
      { status: 500 }
    );
  }
}
