import { NextRequest, NextResponse } from "next/server";
import { listAllOrders } from "@/lib/order-store";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const orders = await listAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error en /api/admin/ordenes:", error);
    return NextResponse.json({ error: error?.message || "Error al obtener órdenes" }, { status: 500 });
  }
}
