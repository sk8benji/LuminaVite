import prisma from "@/lib/db";
import crypto from "crypto";

/**
 * Utilidades de campañas QR con tracking.
 * El QR impreso apunta a https://clickandlove.app/q/[code]; esa ruta pública
 * registra el escaneo (QrScan) y redirige a la URL destino de la campaña.
 */

/**
 * Base pública de la app, con la misma normalización que src/lib/shortener.ts:
 * NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_SITE_URL o el dominio oficial, nunca localhost.
 */
export function getQrPublicBaseUrl(): string {
  let rawBase =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://clickandlove.app";

  if (!rawBase || rawBase.includes("localhost") || rawBase.includes("127.0.0.1")) {
    rawBase = "https://clickandlove.app";
  }

  return rawBase.startsWith("http")
    ? rawBase.replace(/\/$/, "")
    : `https://${rawBase.replace(/\/$/, "")}`;
}

export function getQrPublicUrl(code: string): string {
  return `${getQrPublicBaseUrl()}/q/${code}`;
}

/**
 * Genera un código único de 6 caracteres hex para una campaña QR,
 * reintentando ante colisión (mismo patrón que src/lib/shortener.ts).
 */
export async function generateUniqueQrCode(): Promise<string> {
  let code = crypto.randomBytes(3).toString("hex");

  for (let i = 0; i < 5; i++) {
    const collision = await prisma.qrCampaign.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!collision) break;
    code = crypto.randomBytes(3).toString("hex");
  }

  return code;
}

export interface QrDailyPoint {
  date: string; // YYYY-MM-DD (UTC)
  count: number;
}

export interface QrCampaignWithStats {
  id: string;
  name: string;
  code: string;
  targetUrl: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  qrUrl: string;
  totalScans: number;
  uniqueScans: number;
  lastScanAt: Date | null;
  dailySeries: QrDailyPoint[];
}

/**
 * Serializa una campaña con sus estadísticas: total de escaneos, únicos
 * aproximados (visitorHash distintos), último escaneo y serie por día
 * de los últimos 7 días (incluye días en cero).
 */
export function serializeQrCampaign(
  campaign: {
    id: string;
    name: string;
    code: string;
    targetUrl: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  },
  scans: { visitorHash: string | null; createdAt: Date }[]
): QrCampaignWithStats {
  const uniqueHashes = new Set(
    scans.map((s) => s.visitorHash).filter((h): h is string => !!h)
  );

  let lastScanAt: Date | null = null;
  for (const s of scans) {
    if (!lastScanAt || s.createdAt > lastScanAt) lastScanAt = s.createdAt;
  }

  // Serie de los últimos 7 días (hoy incluido), en orden cronológico.
  const dailySeries: QrDailyPoint[] = [];
  const countsByDay = new Map<string, number>();
  for (const s of scans) {
    const day = s.createdAt.toISOString().slice(0, 10);
    countsByDay.set(day, (countsByDay.get(day) || 0) + 1);
  }
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    const day = d.toISOString().slice(0, 10);
    dailySeries.push({ date: day, count: countsByDay.get(day) || 0 });
  }

  return {
    id: campaign.id,
    name: campaign.name,
    code: campaign.code,
    targetUrl: campaign.targetUrl,
    active: campaign.active,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    qrUrl: getQrPublicUrl(campaign.code),
    totalScans: scans.length,
    uniqueScans: uniqueHashes.size,
    lastScanAt,
    dailySeries,
  };
}

/**
 * Trae todas las campañas con sus estadísticas, más recientes primero.
 */
export async function listQrCampaignsWithStats(): Promise<QrCampaignWithStats[]> {
  const campaigns = await prisma.qrCampaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      scans: {
        select: { visitorHash: true, createdAt: true },
      },
    },
  });

  return campaigns.map(({ scans, ...campaign }) => serializeQrCampaign(campaign, scans));
}
