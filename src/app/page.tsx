import { Metadata } from "next";
import HomeView from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "Luxury Digital Invitations in Los Angeles | Click & Love",
  description:
    "Luxury digital invitations built in Los Angeles for weddings & quinceañeras. 3D music envelope, SMS RSVP, venue GPS, and live mobile guest list. Order today.",
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
    title: "Luxury Digital Invitations in Los Angeles | Click & Love",
    description:
      "Luxury digital invitations built in Los Angeles for weddings & quinceañeras. 3D music envelope, SMS RSVP, venue GPS, and live mobile guest list. Order today.",
    url: "https://clickandlove.app/",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner-en.jpg",
        width: 1200,
        height: 630,
        alt: "Click & Love Luxury Digital Invitations - Los Angeles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Digital Invitations in Los Angeles | Click & Love",
    description:
      "Luxury digital invitations built in Los Angeles for weddings & quinceañeras. 3D music envelope, SMS RSVP, venue GPS, and live mobile guest list. Order today.",
    images: ["https://clickandlove.app/assets/og-banner-en.jpg"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Click & Love",
    url: "https://clickandlove.app/",
    logo: "https://clickandlove.app/logo.png",
    image: "https://clickandlove.app/assets/og-banner-en.jpg",
    description:
      "Luxury interactive digital invitations custom-built in Los Angeles for weddings and quinceañeras.",
    priceRange: "$99 - $199",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", "name": "Los Angeles" },
      { "@type": "City", "name": "Glendale" },
      { "@type": "City", "name": "Burbank" },
      { "@type": "City", "name": "Pasadena" },
      { "@type": "AdministrativeArea", "name": "San Fernando Valley" },
    ],
    knowsLanguage: ["en", "es"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Invitation Services",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Digital Asistido Package",
          price: "99",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Servicio VIP Los Angeles",
          price: "199",
          priceCurrency: "USD",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeView initialLang="en" />
    </>
  );
}
