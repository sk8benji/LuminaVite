// Purchase GA4 por Measurement Protocol, enviado SOLO desde el webhook de
// Stripe (fuente de verdad). Motivo (2026-11-25): dos ventas reales de
// $159.20 (10 y ~12 nov) nunca llegaron a GA4 porque el purchase solo se
// disparaba en /gracias y las compradoras no volvieron tras pagar.
//
// Requiere GA4_MP_API_SECRET (GA4 → Admin → Data Streams →
// clickandlove.app → Measurement Protocol API secrets). Sin el secreto,
// NO se envía nada y se registra en log — el webhook sigue marcando la
// orden PAGADO y mandando correos igual. Nunca rompe el webhook.

const GA4_MEASUREMENT_ID = "G-BNL52QCYJM";

export interface Ga4PurchaseParams {
  /** client_id GA4 (de metadata gaClientId de la sesión de Stripe). */
  clientId?: string | null;
  /** Fallback determinista si no hay client_id: el id de sesión de Stripe. */
  transactionId: string;
  value: number;
  currency: string;
  itemId: string;
  itemName?: string;
}

/** Envía el purchase a GA4. Devuelve true solo si GA4 respondió 2xx. */
export async function sendGa4Purchase(
  params: Ga4PurchaseParams
): Promise<boolean> {
  const apiSecret = process.env.GA4_MP_API_SECRET;
  if (!apiSecret) {
    console.log(
      "[GA4 MP] GA4_MP_API_SECRET no configurado; purchase no enviado a GA4."
    );
    return false;
  }

  // Fallback determinista: sin client_id de la cookie _ga (bloqueador,
  // sesión creada antes del cambio), se usa el id de sesión de Stripe.
  // Es estable entre reintentos y único por compra.
  const clientId = params.clientId || params.transactionId;

  const url =
    `https://www.google-analytics.com/mp/collect` +
    `?measurement_id=${GA4_MEASUREMENT_ID}` +
    `&api_secret=${encodeURIComponent(apiSecret)}`;

  const payload = {
    client_id: clientId,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: params.transactionId,
          value: params.value,
          currency: params.currency.toUpperCase(),
          items: [
            {
              item_id: params.itemId,
              ...(params.itemName ? { item_name: params.itemName } : {}),
            },
          ],
        },
      },
    ],
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.warn(
        `[GA4 MP] purchase ${params.transactionId} rechazado por GA4 (HTTP ${res.status}).`
      );
      return false;
    }
    console.log(
      `[GA4 MP] purchase enviado: transaction_id=${params.transactionId} value=${params.value} ${params.currency.toUpperCase()} client_id=${clientId}.`
    );
    return true;
  } catch (err: any) {
    console.warn(
      `[GA4 MP] purchase ${params.transactionId} no enviado:`,
      err?.message || err
    );
    return false;
  }
}
