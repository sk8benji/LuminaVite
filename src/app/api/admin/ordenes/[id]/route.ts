import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/order-store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { estadoPedido } = body;

    if (!estadoPedido) {
      return NextResponse.json({ error: "Falta estadoPedido" }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, estadoPedido);
    if (!updated) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Error en PATCH /api/admin/ordenes/[id]:", error);
    return NextResponse.json({ error: error?.message || "Error al actualizar estado" }, { status: 500 });
  }
}
