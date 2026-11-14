import prisma from "@/lib/db";

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

      isEnsured = true;
    } catch (err: any) {
      console.warn("⚠️ Aviso al asegurar tablas SaveTheDate en PostgreSQL:", err?.message || err);
    } finally {
      ensuringPromise = null;
    }
  })();

  return ensuringPromise;
}
