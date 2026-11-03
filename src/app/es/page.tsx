import { Metadata } from "next";
import HomeView from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "Invitaciones Digitales en Los Ángeles con RSVP por SMS | Click & Love",
  description:
    "Invitaciones digitales personalizadas en Los Ángeles para bodas, quinceañeras y galas. Incluyen sobres virtuales 3D, música y seguimiento de RSVP por SMS en tiempo real.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/es/",
    languages: {
      en: "https://clickandlove.app/",
      es: "https://clickandlove.app/es/",
      "x-default": "https://clickandlove.app/",
    },
  },
  openGraph: {
    title: "Invitaciones Digitales en Los Ángeles con RSVP por SMS | Click & Love",
    description:
      "Invitaciones digitales personalizadas en Los Ángeles para bodas, quinceañeras y galas. Incluyen sobres virtuales 3D, música y seguimiento de RSVP por SMS en tiempo real.",
    url: "https://clickandlove.app/es/",
    siteName: "Click & Love",
    locale: "es_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Click & Love Invitaciones Digitales de Lujo - Los Ángeles",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invitaciones Digitales en Los Ángeles con RSVP por SMS | Click & Love",
    description:
      "Invitaciones digitales personalizadas en Los Ángeles para bodas, quinceañeras y galas. Incluyen sobres virtuales 3D, música y seguimiento de RSVP por SMS en tiempo real.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function SpanishHomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Click & Love Invitaciones Digitales",
    url: "https://clickandlove.app/es/",
    logo: "https://clickandlove.app/logo.png",
    image: "https://clickandlove.app/assets/og-banner.png",
    description:
      "Papelería digital interactiva para bodas y quinceañeras con confirmación SMS, navegación GPS a salones y panel de anfitrión en Los Ángeles, California.",
    priceRange: "$99 - $199",
    telephone: "+1-818-299-4882",
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
    knowsLanguage: ["es", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Invitaciones Digitales",
      itemListElement: [
        {
          "@type": "Service",
          name: "Invitaciones de Quinceañera",
          url: "https://clickandlove.app/es/invitaciones-de-quinceanera",
        },
        {
          "@type": "Service",
          name: "Invitaciones de Boda",
          url: "https://clickandlove.app/wedding-invitations-los-angeles",
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
      <HomeView initialLang="es" />
    </>
  );
}
