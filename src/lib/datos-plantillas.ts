import prisma from "@/lib/db";
import { INITIAL_MASTER_TEMPLATES } from "@/lib/templates-data";
import { ALL_SYSTEM_DEMOS } from "@/lib/demo-data";

// Lista de plantillas del portal de datos ("elige la plantilla que te gusta").
//
// Fuente: la base de datos (MasterTemplate) manda sobre el seed INITIAL:
// nombre comercial, portada elegida en el editor y orden. Sin DB o sin fila,
// se usa INITIAL. Solo se muestran las plantillas del catálogo público:
// las 4 solo-admin (Coraline, Esmeralda, Jardín, Minimalista) NO se ofrecen
// al cliente, igual que en /demo.
export interface PlantillaPortal {
  estilo: string;
  nombre: string;
  demoSlug: string;
  demoUrl: string;
  imagen: string;
}

const SOLO_ADMIN = new Set([
  "CORALINE_MYSTICAL",
  "ESMERALDA_ROYAL",
  "JARDIN_BOTANICA",
  "MINIMALISTA_EDITORIAL",
]);

export async function listPlantillasPortal(): Promise<PlantillaPortal[]> {
  // DB: nombre, portada y orden vivos, por estilo.
  const dbByEstilo = new Map<string, any>();
  try {
    const rows: any[] = await (prisma as any).masterTemplate.findMany({
      select: {
        slug: true,
        nombre: true,
        estiloPlantilla: true,
        fotoPortadaUrl: true,
        activo: true,
        orden: true,
      },
    });
    for (const r of rows) dbByEstilo.set(r.estiloPlantilla, r);
  } catch {
    // Sin DB: se usa INITIAL solo.
  }

  const out: PlantillaPortal[] = [];
  for (const t of INITIAL_MASTER_TEMPLATES as any[]) {
    if (SOLO_ADMIN.has(t.estiloPlantilla)) continue;
    const db = dbByEstilo.get(t.estiloPlantilla);
    if (db && db.activo === false) continue;
    const demoSlug = db?.slug || t.slug;
    const demo: any = (ALL_SYSTEM_DEMOS as any)[demoSlug];
    out.push({
      estilo: t.estiloPlantilla,
      nombre: db?.nombre || t.nombre,
      demoSlug,
      demoUrl: `/demo/${demoSlug}`,
      imagen:
        db?.fotoPortadaUrl ||
        t.fotoPortadaUrl ||
        demo?.fotoPortadaUrl ||
        "",
    });
  }
  out.sort((a, b) => {
    const oa = dbByEstilo.get(a.estilo)?.orden;
    const ob = dbByEstilo.get(b.estilo)?.orden;
    const ia = (INITIAL_MASTER_TEMPLATES as any[]).find(
      (t) => t.estiloPlantilla === a.estilo,
    )?.orden;
    const ib = (INITIAL_MASTER_TEMPLATES as any[]).find(
      (t) => t.estiloPlantilla === b.estilo,
    )?.orden;
    return (oa ?? ia ?? 99) - (ob ?? ib ?? 99);
  });
  return out;
}
