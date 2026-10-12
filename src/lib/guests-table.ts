import prisma from "@/lib/db";

let isEnsured = false;
let ensuringPromise: Promise<void> | null = null;

/**
 * Garantiza que la tabla 'guests' y sus índices existan en la base de datos PostgreSQL.
 * Previene el error Prisma P2021 (Table public.guests does not exist) en entornos de producción (Railway).
 */
export async function ensureGuestsTable(): Promise<void> {
  if (isEnsured) return;
  if (ensuringPromise) return ensuringPromise;

  ensuringPromise = (async () => {
    try {
      // 1. Crear tabla guests con las columnas requeridas
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS guests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            event_id TEXT NOT NULL,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            email VARCHAR(255),
            max_pax INT NOT NULL DEFAULT 1,
            confirmed_pax INT DEFAULT 0,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE guests ALTER COLUMN status TYPE VARCHAR(50);
      `);

      // 2. Clave foránea hacia "Evento"(id) si aún no existe
      try {
        await prisma.$executeRawUnsafe(`
          DO $$
          BEGIN
              IF NOT EXISTS (
                  SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name = 'fk_guests_evento'
              ) THEN
                  ALTER TABLE guests 
                  ADD CONSTRAINT fk_guests_evento 
                  FOREIGN KEY (event_id) REFERENCES "Evento"(id) ON DELETE CASCADE;
              END IF;
          END $$;
        `);
      } catch (fkErr) {
        // En caso de que la tabla Evento tenga variación en casing o constraint ya exista
        console.warn("Aviso al verificar constraint fk_guests_evento:", fkErr);
      }

      // 3. Índice para acelerar búsquedas por evento y nombre
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_guests_event_search ON guests(event_id, name);
      `);

      isEnsured = true;
    } catch (err: any) {
      console.warn("⚠️ Aviso al asegurar tabla guests en PostgreSQL:", err?.message || err);
    } finally {
      ensuringPromise = null;
    }
  })();

  return ensuringPromise;
}
