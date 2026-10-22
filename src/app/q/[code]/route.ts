import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { ensureQrTables } from "@/lib/qr-table";
import { getSiteUrl } from "@/lib/url-safety";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Ruta pública de los códigos QR dinámicos: /q/[code]
 * Registra el escaneo (QrScan) y redirige 302 a la URL destino de la campaña.
 * Si la campaña no existe o está inactiva, redirige a "/".
 * Un fallo al registrar el escaneo NUNCA bloquea la redirección.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> | { code: string } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const code = (resolvedParams?.code || "").trim();

  if (!code) {
    return NextResponse.redirect(new URL("/", getSiteUrl()));
  }

  try {
    await ensureQrTables();
    const campaign = await prisma.qrCampaign.findUnique({
      where: { code },
    });

    if (!campaign || !campaign.active || !campaign.targetUrl) {
      return NextResponse.redirect(new URL("/", getSiteUrl()));
    }

    // Registrar el escaneo. visitorHash = sha256(IP + User-Agent):
    // aproxima visitantes únicos sin guardar la IP cruda.
    try {
      const forwardedFor = request.headers.get("x-forwarded-for") || "";
      const ip =
        forwardedFor.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const userAgent = request.headers.get("user-agent") || "";
      const visitorHash = crypto
        .createHash("sha256")
        .update(`${ip}|${userAgent}`)
        .digest("hex");

      await prisma.qrScan.create({
        data: {
          campaignId: campaign.id,
          visitorHash,
          userAgent: userAgent || null,
        },
      });
    } catch (scanErr) {
      console.warn("Aviso: no se pudo registrar el escaneo QR:", scanErr);
    }

    return NextResponse.redirect(campaign.targetUrl, 302);
  } catch (err) {
    console.warn("Error en redirección de QR:", err);
    return NextResponse.redirect(new URL("/", getSiteUrl()));
  }
}
