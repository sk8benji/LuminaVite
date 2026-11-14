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
  express: {
    id: "express",
    name: "Express Digital",
    price: 99,
    currency: "usd",
    description: "Ordena, elige tu invitación, envíanos tu información y te regresamos tu enlace digital listo para compartir.",
    image: "https://clickandlove.app/assets/template-era-pink/foto-retrato.webp",
    badge: "Express Digital",
    features: [
      "Ordena y elige tu diseño de invitación",
      "Envíanos la información de tu evento",
      "Te regresamos tu enlace digital listo para compartir",
      "Sobre virtual interactivo con música de fondo",
      "Botón de ubicación GPS con navegación directa",
      "Panel web de confirmación RSVP (sin envíos SMS)",
    ],
  },
  assisted: {
    id: "assisted",
    name: "Assisted Digital",
    price: 199,
    currency: "usd",
    description: "Sin usar computadora: envíanos tus datos por WhatsApp y nosotros armamos todo.",
    image: "https://clickandlove.app/assets/template-era-pink/foto-retrato.webp",
    badge: "MÁS POPULAR • Listo para Compartir",
    features: [
      "Sin usar computadora: envíanos tus datos por WhatsApp y nosotros armamos todo",
      "Hasta 300 confirmaciones interactivas RSVP por SMS",
      "Enlace privado para la familia con panel en tiempo real",
      "Guardar fecha directo en el calendario del teléfono",
      "4 rondas de cambios incluidas",
    ],
  },
  vip: {
    id: "vip",
    name: "VIP All-Inclusive",
    price: 279,
    currency: "usd",
    description: "Todo lo del plan Assisted Digital, Save the Date adicional, Álbum de fotos en vivo y hasta 400 SMS.",
    image: "https://clickandlove.app/assets/template-era-pink/foto-sentada.webp",
    badge: "VIP All-Inclusive",
    features: [
      "Todo lo incluido en el plan Assisted Digital",
      "Invitación digital adicional Save the Date incluida",
      "Álbum de fotos en vivo (tus invitados suben fotos durante la fiesta)",
      "Diseño de tarjetas QR listas para imprimir en mesas",
      "Retoque profesional de fotos para portada y galería",
      "Cambios ilimitados hasta el evento y soporte prioritario",
      "Hasta 400 confirmaciones interactivas RSVP por SMS",
    ],
  },
  // Retrocompatibilidad con nombres previos
  basic: {
    id: "express",
    name: "Express Digital",
    price: 99,
    currency: "usd",
    description: "100% self-service online invitation builder.",
    badge: "Express Digital",
    features: [],
  },
  signature: {
    id: "assisted",
    name: "Assisted Digital",
    price: 199,
    currency: "usd",
    description: "Full setup by our team via WhatsApp.",
    badge: "Assisted Digital",
    features: [],
  },
  atelier: {
    id: "vip",
    name: "VIP All-Inclusive",
    price: 279,
    currency: "usd",
    description: "VIP All-Inclusive experience.",
    badge: "VIP All-Inclusive",
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
