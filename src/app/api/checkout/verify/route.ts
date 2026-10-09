import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOrderBySessionId, saveOrder } from "@/lib/order-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Falta session_id" }, { status: 400 });
    }

    let order = await getOrderBySessionId(sessionId);

    const stripe = getStripe();
    if (stripe && !sessionId.startsWith("sim_")) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const isPaid = session.payment_status === "paid";
        const customerEmail = session.customer_details?.email || session.customer_email || order?.emailCliente || "";
        const customerName = session.customer_details?.name || order?.nombreCliente || "";
        const customerPhone = session.customer_details?.phone || order?.telefonoCliente || "";

        order = await saveOrder({
          stripeSessionId: sessionId,
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
          montoTotal: session.amount_total ? session.amount_total / 100 : (order?.montoTotal || 89),
          moneda: session.currency || "usd",
          estadoPago: isPaid ? "PAGADO" : (order?.estadoPago || "PENDIENTE"),
          emailCliente: customerEmail,
          nombreCliente: customerName || undefined,
          telefonoCliente: customerPhone || undefined,
        });
      } catch (stripeErr: any) {
        console.warn("Aviso al verificar sesión con Stripe:", stripeErr?.message);
      }
    }

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Error en /api/checkout/verify:", error);
    return NextResponse.json({ error: error?.message || "Error al verificar la orden" }, { status: 500 });
  }
}
