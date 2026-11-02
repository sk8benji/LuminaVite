import type { Metadata } from "next";
import QuinceLandingPage from "@/components/QuinceLandingPage";

export const metadata: Metadata = {
  title: "Quinceañera Digital Invitations in Los Angeles | Click & Love",
  description:
    "Luxury 3D interactive Quinceañera invitations in Los Angeles. Custom waltz music, 1-tap SMS RSVP confirmations, direct venue GPS, and strict family pass control. Order today.",
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
      "Interactive 3D unboxing envelopes with music, SMS RSVPs, and strict pass control for Quinceañeras across Southern California.",
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
      "Luxury 3D interactive Quinceañera invitations with waltz music, SMS RSVP, and venue GPS in Los Angeles.",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuinceLandingPage />
    </>
  );
}
