import Stripe from "stripe";

export interface PackagePlan {
  id: "basic" | "signature" | "atelier";
  name: string;
  price: number; // en dólares
  currency: string;
  description: string;
  badge: string;
  features: string[];
}

export const PACKAGES: Record<string, PackagePlan> = {
  basic: {
    id: "basic",
    name: "Digital Basic",
    price: 49,
    currency: "usd",
    description: "Ideal para eventos íntimos con elegancia esencial y confirmaciones directas.",
    badge: "Esencial & Directo",
    features: [
      "Plantilla editorial responsiva",
      "Música de fondo en alta fidelidad",
      "RSVP directo a WhatsApp",
      "Cuenta regresiva en vivo",
      "Ubicaciones con Google Maps & Waze",
    ],
  },
  signature: {
    id: "signature",
    name: "Signature VIP",
    price: 89,
    currency: "usd",
    description: "Nuestra experiencia insignia recomendada. Interactividad total, pase de invitados y efectos de lujo.",
    badge: "Recomendado • Alta Gama",
    features: [
      "Todo lo del plan Digital Basic",
      "Apertura de sobre interactiva con sello de cera",
      "Formulario RSVP con pases asignados",
      "Confirmación automática por Email",
      "Mesa de regalos (Zelle, CashApp, Enlaces)",
      "Código de vestimenta con paleta de colores",
    ],
  },
  atelier: {
    id: "atelier",
    name: "Atelier Custom",
    price: 149,
    currency: "usd",
    description: "Diseño a medida con asesoría concierge personalizada y personalizaciones avanzadas.",
    badge: "A Medida • Experiencia Total",
    features: [
      "Todo lo del plan Signature VIP",
      "Diseño y paleta 100% personalizada por diseñador",
      "Timeline / Itinerario por fases con iconos",
      "Corte de honor y damas / chambelanes completo",
      "Galería interactiva de fotos y recuerdos",
      "Soporte prioritario Concierge por WhatsApp",
    ],
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
