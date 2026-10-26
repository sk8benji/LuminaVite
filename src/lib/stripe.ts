import Stripe from "stripe";

export interface PackagePlan {
  id: string;
  name: string;
  price: number; // en dólares
  currency: string;
  description: string;
  image?: string;
  badge: string;
  features: string[];
}

export const PACKAGES: Record<string, PackagePlan> = {
  assisted: {
    id: "assisted",
    name: "Digital Asistido",
    price: 99,
    currency: "usd",
    description: "Full setup by our team, 200 interactive SMS, GPS directions with Waze/Maps button, and virtual envelope with music.",
    image: "https://clickandlove.app/assets/template-era-pink/foto-retrato.webp",
    badge: "El Estándar • Listo para Compartir",
    features: [
      "Configuración completa por nuestro equipo",
      "200 SMS interactivos incluidos",
      "Ubicación GPS con botón a Waze / Maps",
      "Sobre virtual interactivo con música",
      "Enlace familiar con panel en tiempo real",
      "Guardado en calendario del teléfono",
      "1 ronda de cambios incluida",
    ],
  },
  vip: {
    id: "vip",
    name: "Servicio VIP Los Ángeles",
    price: 199,
    currency: "usd",
    description: "Zero hassle. Everything in Digital Asistido, plus photo retouching, 350 SMS, QR design, and priority support.",
    image: "https://clickandlove.app/assets/template-era-pink/foto-sentada.webp",
    badge: "Recomendado • Quinceañeras & Bodas",
    features: [
      "Todo lo del Digital Asistido",
      "Retoque fotográfico para portada y galería",
      "350 SMS de confirmación incluidos",
      "Diseño de código QR listo para imprimir en mesas",
      "Soporte prioritario con cambios ilimitados hasta el evento",
    ],
  },
  // Retrocompatibilidad con nombres previos
  basic: {
    id: "assisted",
    name: "Digital Asistido",
    price: 99,
    currency: "usd",
    description: "Full setup by our team, 200 interactive SMS, GPS directions with Waze/Maps button, and virtual envelope with music.",
    image: "https://clickandlove.app/assets/template-era-pink/foto-retrato.webp",
    badge: "El Estándar • Listo para Compartir",
    features: [],
  },
  signature: {
    id: "vip",
    name: "Servicio VIP Los Ángeles",
    price: 199,
    currency: "usd",
    description: "Zero hassle. Everything in Digital Asistido, plus photo retouching, 350 SMS, QR design, and priority support.",
    image: "https://clickandlove.app/assets/template-era-pink/foto-sentada.webp",
    badge: "Recomendado • Quinceañeras & Bodas",
    features: [],
  },
  atelier: {
    id: "vip",
    name: "Servicio VIP Los Ángeles",
    price: 199,
    currency: "usd",
    description: "Zero hassle. Everything in Digital Asistido, plus photo retouching, 350 SMS, QR design, and priority support.",
    image: "https://clickandlove.app/assets/template-era-pink/foto-sentada.webp",
    badge: "Recomendado • Quinceañeras & Bodas",
    features: [],
  },
};

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });
  }
  return stripeClient;
}
