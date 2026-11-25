// Eventos de medición (REGLA Tag Manager, 25 nov 2026): la web SOLO pushea
// eventos al dataLayer; GTM los lee y los reenvía a GA4 (tags de evento).
// Nada de gtag/fbq/clarity directo en el código. Si GTM aún no tiene el tag
// creado, el push no se pierde ni rompe nada: queda en el dataLayer.
/**
 * Lee el client_id de GA4 de la cookie _ga (formato GA1.1.<random>.<ts>).
 * El client_id es "<random>.<ts>". null si no hay cookie (bloqueador,
 * primera visita sin _ga aún) — el webhook usa entonces un fallback
 * determinista desde el id de sesión de Stripe.
 */
export function getGaClientId(): string | null {
  try {
    const match = document.cookie.match(/(?:^|; )_ga=GA1\.\d+\.(\d+\.\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function track(
  event: string,
  params?: Record<string, unknown>
): void {
  try {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...(params || {}) });
  } catch {
    // Analítica opcional: nunca debe romper la interacción.
  }
}
