// Eventos GA4 del plan de marketing (semana 1). gtag ya carga global en
// layout.tsx; si no está disponible (bloqueador, SSR) no se rompe nada.
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
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
      .gtag;
    if (typeof gtag === "function") {
      gtag("event", event, params || {});
    }
  } catch {
    // Analítica opcional: nunca debe romper la interacción.
  }
}
