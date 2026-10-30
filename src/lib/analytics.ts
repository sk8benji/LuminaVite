// Eventos GA4 del plan de marketing (semana 1). gtag ya carga global en
// layout.tsx; si no está disponible (bloqueador, SSR) no se rompe nada.
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
