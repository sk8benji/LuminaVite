import prisma from "../src/lib/db";

async function main() {
  console.log("⚡ Verificando y asegurando tabla 'guests' e índices en PostgreSQL...");
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS guests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id TEXT NOT NULL REFERENCES "Evento"(id) ON DELETE CASCADE,
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
