import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOrderBySessionId, saveOrder } from "@/lib/order-store";
import {
  sendCustomerOrderConfirmationEmail,
  sendAdminOrderAlertEmail,
} from "@/lib/order-emails";
import { getSiteUrl } from "@/lib/url-safety";

/**
 * Webhook de Stripe — POST /api/webhooks/stripe
 *
 * Registrar en el Dashboard de Stripe (Developers → Webhooks):
 *   URL: https://clickandlove.app/api/webhooks/stripe
 *   Evento: checkout.session.completed
 *   Secreto: STRIPE_WEBHOOK_SECRET (variable en Railway)
 *
 * Seguridad: si STRIPE_WEBHOOK_SECRET está configurado, se verifica la firma
 * del evento. Si no está configurado, igual se re-verifica la sesión contra la
 * API de Stripe (fuente de verdad) y solo se actúa si payment_status === "paid",
 * así un evento falsificado nunca puede marcar una orden como pagada ni
 * disparar correos.
 *
 * Efecto: marca la orden como PAGADO y envía los correos de confirmación al
 * cliente y la alerta de venta al admin, aunque el comprador nunca regrese a
 * la página de gracias. Idempotente: solo actúa en la transición
 * PENDIENTE → PAGADO.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe no configurado" },
      { status: 500 }
    );
  }

  let event: any = null;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (webhookSecret) {
      const rawBody = await req.text();
      const signature = req.headers.get("stripe-signature") || "";
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // Sin secreto: se acepta el cuerpo solo como aviso y se re-verifica
      // contra la API de Stripe abajo antes de actuar.
      event = await req.json();
    }
  } catch (err: any) {
    console.error("[Stripe webhook] Firma inválida:", err?.message);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  try {
    if (event?.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true, ignored: event?.type });
    }

    const sessionId = event.data?.object?.id as string | undefined;
    if (!sessionId) {
      return NextResponse.json({ error: "Sin session id" }, { status: 400 });
    }

    // Fuente de verdad: re-consultar la sesión en Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      console.log(`[Stripe webhook] Sesión ${sessionId} no pagada (${session.payment_status}); se ignora.`);
      return NextResponse.json({ received: true, ignored: "not_paid" });
    }

    // Filtro espejo del de GeoStack: esta cuenta puede recibir eventos de otros
    // productos si alguna vez vuelve a compartirse. Solo procesar sesiones que
    // traigan paqueteId (todas las de Click and love lo traen); sin él, no se
    // crea orden ni se mandan correos (caso inverso al de María Tapia en
    // GeoStack, 2026-10-26). Se responde ok para que Stripe no reintente.
    if (!(session.metadata as any)?.paqueteId) {
      console.log(`[Stripe webhook] Sesión ${sessionId} ignorada: no es de Click and love (sin paqueteId).`);
      return NextResponse.json({ received: true, ignored: "not_luminavite" });
    }

    const existing = await getOrderBySessionId(sessionId);
    if (existing?.estadoPago === "PAGADO") {
      // Entrega duplicada del webhook: no reenviar correos
      return NextResponse.json({ received: true, duplicate: true });
    }

    const customerEmail =
      session.customer_details?.email || session.customer_email || existing?.emailCliente || "";
    const customerName =
      session.customer_details?.name || existing?.nombreCliente || undefined;
    const customerPhone =
      session.customer_details?.phone || existing?.telefonoCliente || undefined;

    const order = await saveOrder({
      stripeSessionId: sessionId,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      montoTotal: session.amount_total ? session.amount_total / 100 : existing?.montoTotal || 0,
      moneda: session.currency || existing?.moneda || "usd",
      paqueteId: (session.metadata as any)?.paqueteId || existing?.paqueteId,
      paqueteNombre: (session.metadata as any)?.paqueteNombre || existing?.paqueteNombre,
      estadoPago: "PAGADO",
      emailCliente: customerEmail,
      nombreCliente: customerName,
      telefonoCliente: customerPhone,
    });

    // Correos (no bloqueantes para la respuesta 2xx a Stripe)
    const origin = getSiteUrl();
    await Promise.allSettled([
      sendCustomerOrderConfirmationEmail(order, origin),
      sendAdminOrderAlertEmail(order, origin),
    ]);

    console.log(`[Stripe webhook] Orden ${order.id} marcada PAGADO + correos enviados.`);
    return NextResponse.json({ received: true, orderId: order.id });
  } catch (err: any) {
    console.error("[Stripe webhook] Error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Error procesando webhook" },
      { status: 500 }
    );
  }
}
