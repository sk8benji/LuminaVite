// Precios — fuente única: la misma que usa el home
// (src/lib/home-translations.ts, t.pricing.plans, que renderiza HomeView).
// NUNCA hardcodear un precio en otro archivo: todo lo que muestre un precio
// (landing /pricing, JSON-LD, rangos) lo deriva de aquí.
import { translations, type Language } from "@/lib/home-translations";

export type PlanKey = "express" | "assisted" | "vip";

export function pricingPlans(lang: Language) {
  return translations[lang].pricing.plans;
}

export function planByKey(lang: Language, key: PlanKey) {
  const plan = translations[lang].pricing.plans.find((p) => p.planKey === key);
  if (!plan) throw new Error(`Plan ${key} no encontrado en home-translations (${lang})`);
  return plan;
}

/** "$279" -> 279 */
export function planPriceNumber(price: string): number {
  const n = parseInt(price.replace(/[^0-9]/g, ""), 10);
  if (Number.isNaN(n)) throw new Error(`Precio no numérico en home-translations: ${price}`);
  return n;
}

/** "$99 - $279" (formato JSON-LD priceRange, con guion y espacios). */
export function schemaPriceRange(lang: Language) {
  const { min, max } = pricingRange(lang);
  return `$${min} - $${max}`;
}

/** Rango de precios de los planes, derivado de la fuente única. */
export function pricingRange(lang: Language) {
  const prices = pricingPlans(lang).map((p) => planPriceNumber(p.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return {
    min,
    max,
    /** "$99–$279" */
    label: `$${min}–$${max}`,
  };
}
