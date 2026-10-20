import prisma from "@/lib/db";

let isEnsured = false;
let ensuringPromise: Promise<void> | null = null;

/**
 * Garantiza que las tablas 'QrCampaign' y 'QrScan' existan en PostgreSQL.
 * Previene el error Prisma P2021 (The table `public.QrCampaign` does not exist)
 * en producción (Railway), donde el `prisma db push` del arranque no siempre
 * crea las tablas nuevas. Mismo patrón que src/lib/guests-table.ts.
 * Las definiciones replican prisma/schema.prisma (QrCampaign / QrScan).
 */
export async function ensureQrTables(): Promise<void> {
  if (isEnsured) return;
  if (ensuringPromise) return ensuringPromise;

  ensuringPromise = (async () => {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "QrCampaign" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "code" TEXT UNIQUE NOT NULL,
            "targetUrl" TEXT NOT NULL,
            "active" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "QrScan" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "campaignId" TEXT NOT NULL REFERENCES "QrCampaign"("id") ON DELETE CASCADE,
            "visitorHash" TEXT,
            "userAgent" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "QrCampaign_code_idx" ON "QrCampaign"("code");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "QrScan_campaignId_idx" ON "QrScan"("campaignId");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "QrScan_createdAt_idx" ON "QrScan"("createdAt");
      `);

      isEnsured = true;
    } catch (err) {
      // No marcar como asegurado si falló: el siguiente request lo reintenta.
      ensuringPromise = null;
      console.warn("Aviso al asegurar tablas QR:", err);
    }
  })();

  return ensuringPromise;
}
