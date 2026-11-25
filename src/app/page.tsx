import { Metadata } from "next";
import HomeView from "@/components/home/HomeView";
import { schemaPriceRange } from "@/lib/pricing";
import { homeFaq } from "@/lib/home-faq";

export const metadata: Metadata = {
  title: "Digital Invitations in Los Angeles with SMS RSVP | Click & Love",
  description:
    "Custom digital invitations in Los Angeles for weddings, quinceañeras, and galas. Includes 3D virtual envelopes, music, and real-time SMS RSVP tracking.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/",
    languages: {
      en: "https://clickandlove.app/",
      es: "https://clickandlove.app/es/",
      "x-default": "https://clickandlove.app/",
    },
  },
  openGraph: {
    title: "Digital Invitations in Los Angeles with SMS RSVP | Click & Love",
    description:
      "Custom digital invitations in Los Angeles for weddings, quinceañeras, and galas. Includes 3D virtual envelopes, music, and real-time SMS RSVP tracking.",
    url: "https://clickandlove.app/",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Click & Love Luxury Digital Invitations - Los Angeles",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Invitations in Los Angeles with SMS RSVP | Click & Love",
    description:
      "Custom digital invitations in Los Angeles for weddings, quinceañeras, and galas. Includes 3D virtual envelopes, music, and real-time SMS RSVP tracking.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function Page() {
  // FAQ del home (SEO, nov 2026): mismas preguntas/respuestas que la sección
  // visible en HomeView (homeFaq), para que el schema no se desincronice.
  const faq = homeFaq("en");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Click & Love",
    url: "https://clickandlove.app/",
    logo: "https://clickandlove.app/logo.png",
    image: "https://clickandlove.app/assets/og-banner.png",
    description:
      "Custom digital invitations made in Los Angeles for weddings and quinceañeras, with 3D music envelopes and live SMS RSVP tracking.",
    priceRange: schemaPriceRange("en"),
    telephone: "+1-818-918-2519",
    serviceArea: "United States",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "Country", "name": "United States" },
    ],
    knowsLanguage: ["en", "es"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Invitation Services",
      itemListElement: [
        {
          "@type": "Service",
          name: "Wedding Invitations",
          url: "https://clickandlove.app/wedding-invitations-los-angeles",
        },
        {
          "@type": "Service",
          name: "Quinceañera Invitations",
          url: "https://clickandlove.app/quince-invitations",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeView initialLang="en" />
    </>
  );
}
