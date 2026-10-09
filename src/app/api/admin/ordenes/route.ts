import { NextRequest, NextResponse } from "next/server";
import { listAllOrders } from "@/lib/order-store";

export async function GET(req: NextRequest) {
  try {
    const orders = await listAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error en /api/admin/ordenes:", error);
    return NextResponse.json({ error: error?.message || "Error al obtener órdenes" }, { status: 500 });
  }
}
