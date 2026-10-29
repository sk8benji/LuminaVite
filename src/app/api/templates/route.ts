// Endpoint PÚBLICO (sin auth) para que el editor de invitaciones y cualquier
// superficie lean la plantilla editada en el admin. Devuelve la plantilla base
// (INITIAL) fusionada con la fila MasterTemplate de la DB; los valores vacíos
// de la DB (null/undefined/"") no pisan la base. Sin fila o sin DB: solo INITIAL.
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { INITIAL_MASTER_TEMPLATES } from "@/lib/templates-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const EXCLUDE = new Set([
  "id",
  "slug",
  "nombre",
  "categoria",
  "activo",
  "orden",
  "createdAt",
  "updatedAt",
  "configExtra",
]);

function nonEmpty(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v !== null && v !== undefined && v !== "") out[k] = v;
  }
  return out;
}

export async function GET(req: NextRequest) {
  const estilo = req.nextUrl.searchParams.get("estilo");
  if (!estilo) {
    return NextResponse.json({ template: null }, { status: 400 });
  }
  const initial: any = INITIAL_MASTER_TEMPLATES.find(
    (t) => t.estiloPlantilla === estilo
  );
  if (!initial) {
    return NextResponse.json({ template: null }, { status: 404 });
  }
  let merged: any = { ...initial };
  try {
    const row: any = await (prisma as any).masterTemplate.findUnique({
      where: { slug: initial.slug },
    });
    if (row) {
      const { configExtra, ...rest } = row;
      const dbFields = nonEmpty(rest);
      for (const k of EXCLUDE) delete dbFields[k];
      merged = { ...initial, ...dbFields, ...nonEmpty(configExtra || {}) };
    }
  } catch {
    // Sin DB: se devuelve INITIAL solo.
  }
  return NextResponse.json({ template: merged });
}
