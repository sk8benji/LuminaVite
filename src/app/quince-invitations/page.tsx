import type { Metadata } from "next";
import QuinceLandingPage from "@/components/QuinceLandingPage";
import { FAQS_LIST } from "@/lib/quince-faqs";

export const metadata: Metadata = {
  title: "Quinceañera Digital Invitations in Los Angeles | Click & Love",
  description:
    "Custom quinceañera digital invitations with 3D animated envelopes, music, and real-time SMS RSVP tracking. Made for Los Angeles families.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/quince-invitations",
    languages: {
      en: "https://clickandlove.app/quince-invitations",
      es: "https://clickandlove.app/es/invitaciones-de-quinceanera",
      "x-default": "https://clickandlove.app/quince-invitations",
    },
  },
  openGraph: {
    title: "Quinceañera Digital Invitations in Los Angeles | Click & Love",
    description:
      "Custom quinceañera digital invitations with 3D animated envelopes, music, and real-time SMS RSVP tracking. Made for Los Angeles families.",
    url: "https://clickandlove.app/quince-invitations",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Quinceañera Digital Invitations - Click & Love Los Angeles",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quinceañera Digital Invitations in Los Angeles | Click & Love",
    description:
      "Custom quinceañera digital invitations with 3D animated envelopes, music, and real-time SMS RSVP tracking. Made for Los Angeles families.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function QuincePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Luxury Quinceañera Digital Invitations",
    image: "https://clickandlove.app/assets/og-banner.png",
    description:
      "Custom 3D unboxing digital invitations for Quinceañeras in Los Angeles with music, SMS RSVP, and real-time pass management.",
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
          name: "Plan Assisted",
          price: "99",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          name: "Plan VIP Los Angeles",
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
    mainEntity: FAQS_LIST.map((faq) => ({
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
      <QuinceLandingPage />
    </>
  );
}
