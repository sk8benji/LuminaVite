import prisma from "../src/lib/db";

async function main() {
  console.log("⚡ Verificando y asegurando tabla 'guests' e índices en PostgreSQL...");
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS guests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_id TEXT NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          max_pax INT NOT NULL DEFAULT 1,
          confirmed_pax INT DEFAULT 0,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

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
    } catch (fkErr: any) {
      console.warn("Aviso al verificar constraint fk_guests_evento:", fkErr.message);
    }

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_guests_event_search ON guests(event_id, name);
    `);

    console.log("✅ Tabla 'guests' e índice 'idx_guests_event_search' garantizados.");
  } catch (err: any) {
    console.warn("⚠️ Aviso al verificar tabla guests en tiempo de inicialización:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Error en sync-guests-table:", err);
  process.exit(0);
});
