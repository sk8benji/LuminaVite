import type { Metadata } from "next";
import QuinceLandingPageEs from "@/components/QuinceLandingPageEs";

export const metadata: Metadata = {
  title: "Invitaciones Digitales de Quinceañera en Los Ángeles | Click & Love",
  description:
    "Invitaciones digitales de quinceañera en Los Ángeles con sobre 3D, música personalizada, confirmaciones instantáneas por SMS y control estricto de pases.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/es/invitaciones-de-quinceanera",
    languages: {
      en: "https://clickandlove.app/quince-invitations",
      es: "https://clickandlove.app/es/invitaciones-de-quinceanera",
      "x-default": "https://clickandlove.app/quince-invitations",
    },
  },
  openGraph: {
    title: "Invitaciones Digitales de Quinceañera en Los Ángeles | Click & Love",
    description:
      "Sobres interactivos en 3D con música personalizada, confirmaciones instantáneas por SMS y control estricto de pases para familias en Los Ángeles.",
    url: "https://clickandlove.app/es/invitaciones-de-quinceanera",
    siteName: "Click & Love",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Invitaciones Digitales de Quinceañera - Click & Love Los Ángeles",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invitaciones Digitales de Quinceañera en Los Ángeles | Click & Love",
    description:
      "Sobres 3D con música, confirmaciones por SMS y control estricto de pases para Quinceañeras en Los Ángeles y el Valle de San Fernando.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function PaginaQuinceaneraEs() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Invitaciones Digitales de Quinceañera",
        image: "https://clickandlove.app/assets/og-banner.png",
        description:
          "Invitaciones digitales de lujo con sobre 3D interactivo, vals personalizado, confirmación por SMS y control de pases por familia en Los Ángeles.",
        brand: {
          "@type": "Brand",
          name: "Click & Love",
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "99",
          highPrice: "199",
          offerCount: "2",
          offers: [
            {
              "@type": "Offer",
              name: "Plan Asistido",
              price: "99",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Plan VIP Los Ángeles",
              price: "199",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          ],
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Área Metropolitana de Los Ángeles",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Cómo funciona el control estricto de pases para que no vayan invitados de más?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tú nos indicas cuántos pases tiene asignados cada familia. Cuando ellos abren su invitación, el formulario únicamente les permite confirmar hasta ese número de personas.",
            },
          },
          {
            "@type": "Question",
            name: "¿Mis invitados necesitan descargar alguna aplicación en su teléfono?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "¡Para nada! Tus invitados reciben el enlace por SMS o WhatsApp y lo abren de inmediato en el navegador de su teléfono, sin instalar nada.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cómo sé quién ha confirmado y quién no?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Recibes acceso a un panel privado para anfitriones en tu celular con los nombres, teléfono y pases en tiempo real.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuinceLandingPageEs />
    </>
  );
}
