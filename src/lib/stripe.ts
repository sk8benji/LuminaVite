import Stripe from "stripe";

export interface PackagePlan {
  id: string;
  name: string;
  nameEn?: string;
  nameEs?: string;
  price: number; // en dólares
  currency: string;
  description: string;
  descriptionEn?: string;
  descriptionEs?: string;
  image?: string;
  badge: string;
  features: string[];
}

export const PACKAGES: Record<string, PackagePlan> = {
  express: {
    id: "express",
    name: "Express Digital",
    nameEn: "Express Digital Package",
    nameEs: "Paquete Express Digital",
    price: 99,
    currency: "usd",
    description: "✨ Fast & Self-Service: Select your design, submit your event details, and receive your personalized digital invitation link ready to share. Includes interactive envelope, background music & GPS directions.",
    descriptionEn: "✨ Fast & Self-Service: Select your design, submit your event details, and receive your personalized digital invitation link ready to share. Includes interactive envelope, background music & GPS directions.",
    descriptionEs: "✨ Rápido y Listo para Compartir: Elige tu diseño, envíanos los datos de tu evento y recibe tu enlace digital interactivo. Incluye sobre virtual con música de fondo, botón de navegación GPS y confirmación RSVP.",
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
    nameEn: "Assisted Digital Package",
    nameEs: "Paquete Digital Asistido",
    price: 199,
    currency: "usd",
    description: "✨ 100% Done-For-You Experience: Send us your details via WhatsApp and our team crafts your luxury interactive invitation. Includes up to 300 SMS RSVPs, GPS navigation button, calendar sync & 4 rounds of revisions.",
    descriptionEn: "✨ 100% Done-For-You Experience: Send us your details via WhatsApp and our team crafts your luxury interactive invitation. Includes up to 300 SMS RSVPs, GPS navigation button, calendar sync & 4 rounds of revisions.",
    descriptionEs: "✨ Todo Hecho por Nosotros: Envíanos tus datos por WhatsApp y diseñamos tu invitación digital de lujo. Incluye hasta 300 confirmaciones interactivas por SMS, botón de navegación GPS, guardado en calendario y 4 rondas de cambios.",
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
    nameEn: "VIP All-Inclusive Experience",
    nameEs: "Experiencia VIP All-Inclusive",
    price: 279,
    currency: "usd",
    description: "✨ Complete White-Glove VIP Experience: Dedicated designer setup • Matching Save the Date included ($49 value) • Live Guest Photo Album with table QR cards • Real-Time RSVP tracking & up to 400 SMS reminders • Turn-by-turn GPS directions & Unlimited revisions until your celebration.",
    descriptionEn: "✨ Complete White-Glove VIP Experience: Dedicated designer setup • Matching Save the Date included ($49 value) • Live Guest Photo Album with table QR cards • Real-Time RSVP tracking & up to 400 SMS reminders • Turn-by-turn GPS directions & Unlimited revisions until your celebration.",
    descriptionEs: "✨ Experiencia VIP Todo Incluido: Diseño personalizado por expertos • Save the Date adicional de regalo (valor de $99) • Álbum de fotos interactivo en vivo con tarjetas QR para mesas • Confirmación RSVP en tiempo real y hasta 400 SMS de recordatorio • Ubicación GPS y cambios ilimitados hasta tu fiesta.",
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
  "save-the-date": {
    id: "save-the-date",
    name: "Save the Date Digital",
    nameEn: "Digital Save the Date",
    nameEs: "Save the Date Digital",
    price: 49,
    currency: "usd",
    description: "Digital Save the Date: envelope with your photo, live countdown, one-tap Add to Calendar, Early RSVP, photo gallery and music — in English and Spanish.",
    descriptionEn: "Digital Save the Date: envelope with your photo, live countdown, one-tap Add to Calendar, Early RSVP, photo gallery and music — in English and Spanish.",
    descriptionEs: "Save the Date digital: sobre con tu foto, cuenta regresiva en vivo, guardar en calendario con un toque, Confirmación Anticipada, galería de fotos y música — en inglés y español.",
    image: "https://clickandlove.app/assets/save-the-date/principal.jpeg",
    badge: "Save the Date",
    features: [
      "Sobre con tu foto",
      "Cuenta regresiva en vivo",
      "Guardar en calendario (Google / Apple)",
      "Confirmación Anticipada con panel de anfitrión",
      "Galería de fotos + tu música",
      "Inglés y español",
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
