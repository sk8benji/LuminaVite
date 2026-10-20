import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { isSafeHttpUrl } from "@/lib/url-safety";
import {
  generateUniqueQrCode,
  getQrPublicUrl,
  listQrCampaignsWithStats,
  serializeQrCampaign,
} from "@/lib/qr";
import { ensureQrTables } from "@/lib/qr-table";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/qr
 * Lista las campañas QR con estadísticas (total, únicos, último escaneo
 * y serie por día de los últimos 7 días).
 */
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    await ensureQrTables();
    const campaigns = await listQrCampaignsWithStats();
    return NextResponse.json({ campaigns });
  } catch (err: any) {
    console.error("Error en GET /api/admin/qr:", err);
    return NextResponse.json(
      { error: err?.message || "Error al listar campañas QR." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/qr
 * Crea una campaña QR: { name, targetUrl }.
 * Devuelve la campaña con su URL pública (qrUrl) lista para generar el QR.
 */
export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    await ensureQrTables();
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const targetUrl = typeof body?.targetUrl === "string" ? body.targetUrl.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Se requiere el nombre de la campaña." },
        { status: 400 }
      );
    }

    if (!targetUrl || !isSafeHttpUrl(targetUrl)) {
      return NextResponse.json(
        { error: "URL destino no permitida. Solo se aceptan URLs http(s)." },
        { status: 400 }
      );
    }

    const code = await generateUniqueQrCode();

    const campaign = await prisma.qrCampaign.create({
      data: { name, code, targetUrl },
    });

    return NextResponse.json({
      success: true,
      campaign: serializeQrCampaign(campaign, []),
      qrUrl: getQrPublicUrl(campaign.code),
    });
  } catch (err: any) {
    console.error("Error en POST /api/admin/qr:", err);
    return NextResponse.json(
      { error: err?.message || "Error al crear la campaña QR." },
      { status: 500 }
    );
  }
}
