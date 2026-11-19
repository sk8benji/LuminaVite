import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * Títulos bilingües configurables del Save The Date.
 * OJO: estas 9 columnas existen en la DB (las crea ensureSaveTheDateTables
 * con SQL crudo) pero NO están declaradas en prisma/schema.prisma, así que
 * el Prisma Client generado NO las conoce: pasarlas en un create/update de
 * Prisma tira "Unknown argument" (500 en el admin). Por eso se leen y se
 * escriben SIEMPRE con $queryRaw/$executeRaw a través de estos helpers.
 * Si algún día se agregan al schema, estos helpers se pueden borrar.
 */
export const TITULOS_BILINGUES_KEYS = [
  "tituloCalendarioEs",
  "tituloCalendarioEn",
  "tituloContadorEs",
  "tituloContadorEn",
  "tituloRsvpEs",
  "tituloRsvpEn",
  "preguntaRsvpEs",
  "preguntaRsvpEn",
  "subtituloEn",
] as const;

export type TitulosBilingues = Partial<
  Record<(typeof TITULOS_BILINGUES_KEYS)[number], string | null>
>;

export function pickTitulosBilingues(
  body: Record<string, any>
): TitulosBilingues {
  const out: TitulosBilingues = {};
  for (const key of TITULOS_BILINGUES_KEYS) {
    if (body[key] !== undefined) out[key] = body[key] ?? null;
  }
  return out;
}

export async function getSaveTheDateTitulos(
  id: string
): Promise<TitulosBilingues> {
  try {
    const rows = await prisma.$queryRaw<TitulosBilingues[]>(
      Prisma.sql`SELECT "tituloCalendarioEs", "tituloCalendarioEn", "tituloContadorEs", "tituloContadorEn", "tituloRsvpEs", "tituloRsvpEn", "preguntaRsvpEs", "preguntaRsvpEn", "subtituloEn" FROM "SaveTheDate" WHERE "id" = ${id}`
    );
    return rows[0] || {};
  } catch {
    return {};
  }
}

export async function getSaveTheDateTitulosMany(
  ids: string[]
): Promise<Record<string, TitulosBilingues>> {
  if (ids.length === 0) return {};
  try {
    const rows = await prisma.$queryRaw<
      Array<{ id: string } & TitulosBilingues>
    >(
      Prisma.sql`SELECT "id", "tituloCalendarioEs", "tituloCalendarioEn", "tituloContadorEs", "tituloContadorEn", "tituloRsvpEs", "tituloRsvpEn", "preguntaRsvpEs", "preguntaRsvpEn", "subtituloEn" FROM "SaveTheDate" WHERE "id" IN (${Prisma.join(ids)})`
    );
    const out: Record<string, TitulosBilingues> = {};
    for (const row of rows) {
      const { id, ...titulos } = row;
      out[id] = titulos;
    }
    return out;
  } catch {
    return {};
  }
}

export async function updateSaveTheDateTitulos(
  id: string,
  fields: TitulosBilingues
): Promise<void> {
  const sets: Prisma.Sql[] = [];
  for (const key of TITULOS_BILINGUES_KEYS) {
    if (fields[key] !== undefined) {
      // La columna viene de la lista fija de arriba, nunca del usuario.
      sets.push(Prisma.sql`${Prisma.raw(`"${key}"`)} = ${fields[key] ?? null}`);
    }
  }
  if (sets.length === 0) return;
  await prisma.$executeRaw(
    Prisma.sql`UPDATE "SaveTheDate" SET ${Prisma.join(sets, ", ")} WHERE "id" = ${id}`
  );
}

let isEnsured = false;
let ensuringPromise: Promise<void> | null = null;

/**
 * Garantiza que las tablas 'SaveTheDate' y 'PreRsvpRegistro' existan en PostgreSQL.
 * Previene el error Prisma P2021 (The table `public.SaveTheDate` does not exist).
 */
export async function ensureSaveTheDateTables(): Promise<void> {
  if (isEnsured) return;
  if (ensuringPromise) return ensuringPromise;

  ensuringPromise = (async () => {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "SaveTheDate" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "slug" TEXT UNIQUE NOT NULL,
            "eventoId" TEXT REFERENCES "Evento"("id") ON DELETE SET NULL,
            "titulo" TEXT NOT NULL,
            "subtitulo" TEXT DEFAULT 'Save Our Date',
            "mensaje" TEXT,
            "fechaEvento" TIMESTAMP(3) NOT NULL,
            "fechaTextoPersonalizada" TEXT,
            "ciudad" TEXT,
            "estiloPlantilla" TEXT NOT NULL DEFAULT 'QUINCE_ROSADO',
            "colorSobre" TEXT DEFAULT '#FFF0F3',
            "colorSello" TEXT DEFAULT '#C5A059',
            "tipoLetra" TEXT DEFAULT 'Cinzel',
            "fotoPortadaUrl" TEXT NOT NULL,
            "galeriaFotosUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
            "musicaUrl" TEXT,
            "musicaTitulo" TEXT,
            "mostrarSobre" BOOLEAN NOT NULL DEFAULT true,
            "mostrarGaleria" BOOLEAN NOT NULL DEFAULT true,
            "mostrarContador" BOOLEAN NOT NULL DEFAULT true,
            "mostrarCalendario" BOOLEAN NOT NULL DEFAULT true,
            "mostrarPreRsvp" BOOLEAN NOT NULL DEFAULT true,
            "textoPreRsvp" TEXT DEFAULT '¿Crees que podrás acompañarnos?',
            "telefonoWhatsapp" TEXT,
            "vistasContador" INTEGER NOT NULL DEFAULT 0,
            "activo" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PreRsvpRegistro" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "saveTheDateId" TEXT NOT NULL REFERENCES "SaveTheDate"("id") ON DELETE CASCADE,
            "nombre" TEXT NOT NULL,
            "telefono" TEXT,
            "email" TEXT,
            "respuesta" TEXT NOT NULL DEFAULT 'SI',
            "pasesTentativos" INTEGER NOT NULL DEFAULT 1,
            "notas" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "SaveTheDate_eventoId_idx" ON "SaveTheDate"("eventoId");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "SaveTheDate_slug_idx" ON "SaveTheDate"("slug");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "PreRsvpRegistro_saveTheDateId_idx" ON "PreRsvpRegistro"("saveTheDateId");
      `);

      // Asegurar columnas de títulos bilingües configurables
      const columnasBilingues = [
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "tituloCalendarioEs" TEXT DEFAULT 'RESERVA LA FECHA';`,
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "tituloCalendarioEn" TEXT DEFAULT 'SAVE THE DATE';`,
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "tituloContadorEs" TEXT DEFAULT 'Solo Faltan...';`,
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "tituloContadorEn" TEXT DEFAULT 'Countdown...';`,
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "tituloRsvpEs" TEXT DEFAULT 'Confirmación Anticipada';`,
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "tituloRsvpEn" TEXT DEFAULT 'Early RSVP';`,
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "preguntaRsvpEs" TEXT DEFAULT '¿Podrás Acompañarnos?';`,
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "preguntaRsvpEn" TEXT DEFAULT 'Will You Join Us?';`,
        `ALTER TABLE "SaveTheDate" ADD COLUMN IF NOT EXISTS "subtituloEn" TEXT DEFAULT 'My Sweet Fifteen';`,
      ];
      for (const sql of columnasBilingues) {
        try {
          await prisma.$executeRawUnsafe(sql);
        } catch {}
      }

      isEnsured = true;
    } catch (err: any) {
      console.warn("⚠️ Aviso al asegurar tablas SaveTheDate en PostgreSQL:", err?.message || err);
    } finally {
      ensuringPromise = null;
    }
  })();

  return ensuringPromise;
}
