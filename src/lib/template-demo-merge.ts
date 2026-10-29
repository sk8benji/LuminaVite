// Merge demo base (demo-data.ts) + plantilla editada en el admin (MasterTemplate en DB).
// Solo se usa en el servidor (páginas demo y rutas API). Si la DB no responde o no hay
// fila, devuelve el demo base sin cambios: nunca rompe la página pública.
import prisma from "@/lib/db";
import { getSystemDemo } from "@/lib/demo-data";
import { INITIAL_MASTER_TEMPLATES } from "@/lib/templates-data";

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

export async function getMergedDemo(slug: string) {
  const base: any = getSystemDemo(slug);
  if (!base) return null;
  try {
    const initial = INITIAL_MASTER_TEMPLATES.find(
      (t) => t.estiloPlantilla === base.estiloPlantilla
    );
    if (!initial) return base;
    const row: any = await (prisma as any).masterTemplate.findUnique({
      where: { slug: initial.slug },
    });
    if (!row) return base;
    const { configExtra, ...rest } = row;
    const dbFields = nonEmpty(rest);
    for (const k of EXCLUDE) delete dbFields[k];
    const merged: any = {
      ...base,
      ...dbFields,
      ...nonEmpty(configExtra || {}),
    };
    // El tema editado (categoria) manda sobre el tipo del demo base.
    if (row.categoria) merged.tipoEvento = row.categoria;
    // El slug y el estilo del demo nunca se pisan con los de la plantilla (tpl-*).
    merged.slug = base.slug;
    merged.estiloPlantilla = base.estiloPlantilla;
    return merged;
  } catch {
    return base;
  }
}
