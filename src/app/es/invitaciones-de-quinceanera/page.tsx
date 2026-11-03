import type { Metadata } from "next";
import EsQuinceLandingPage from "@/components/EsQuinceLandingPage";
import { FAQS_LIST_ES } from "@/lib/quince-faqs-es";

export const metadata: Metadata = {
  title: "Invitaciones de Quinceañera en Los Ángeles | Click & Love",
  description:
    "Invitaciones de quinceañera en Los Ángeles con sobre 3D, música y RSVP por SMS. Ve las demos, elige plantilla y comparte el link. Asistido $99. VIP $199.",
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
    title: "Invitaciones de Quinceañera en Los Ángeles | Click & Love",
    description:
      "Invitaciones de quinceañera en Los Ángeles con sobre 3D, música y RSVP por SMS. Ve las demos, elige plantilla y comparte el link. Asistido $99. VIP $199.",
    url: "https://clickandlove.app/es/invitaciones-de-quinceanera",
    siteName: "Click & Love",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Click & Love Invitaciones Digitales - Los Ángeles",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invitaciones de Quinceañera en Los Ángeles | Click & Love",
    description:
      "Invitaciones de quinceañera en Los Ángeles con sobre 3D, música y RSVP por SMS. Ve las demos, elige plantilla y comparte el link. Asistido $99. VIP $199.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Invitaciones digitales de quinceañera de lujo",
    image: "https://clickandlove.app/assets/og-banner.png",
    description:
      "Invitaciones digitales de quinceañera en Los Ángeles con sobre 3D, música, RSVP por SMS y control de pases en tiempo real.",
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
      name: "Los Angeles Metropolitan Area",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS_LIST_ES.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <EsQuinceLandingPage />
    </>
  );
}
