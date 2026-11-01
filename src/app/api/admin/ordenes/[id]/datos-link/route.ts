import { NextRequest, NextResponse } from "next/server";
import { ensureDatosToken } from "@/lib/order-store";
import { requireAdmin } from "@/lib/auth";
import { getSiteUrl } from "@/lib/url-safety";

/**
 * Admin: asegurar el link de datos de una orden (las órdenes viejas, de
 * antes del portal, nacen sin token) y devolverlo para copiarlo.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    // Primero: ¿la orden ya tiene token? (evita regenerarlo en cada clic)
    const { listAllOrders } = await import("@/lib/order-store");
    const existing = (await listAllOrders()).find((o) => o.id === id);
    let token = existing?.datosToken || null;
    if (!token) token = await ensureDatosToken(id);
    if (!token) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ success: true, token, link: `${getSiteUrl()}/datos/${token}` });
  } catch (err: any) {
    console.error("Error en datos-link:", err?.message || err);
    return NextResponse.json({ error: "No se pudo generar el link." }, { status: 500 });
  }
}
