import { Metadata } from "next";
import HomeView from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "Click & Love • Invitaciones Digitales Interactivas de Gala en Los Ángeles",
  description:
    "Papelería digital de alta costura armada por nuestro equipo en Los Ángeles para bodas y quinceañeras con confirmación directa por SMS, control de mesas y panel en vivo.",
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
    title: "Click & Love • Invitaciones Digitales Interactivas de Gala en Los Ángeles",
    description:
      "Invitaciones web interactivas de gala con sobre virtual 3D, confirmación por SMS en 1 clic y navegación GPS directa al salón en Los Ángeles, CA.",
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
    title: "Click & Love • Invitaciones Digitales Interactivas de Gala",
    description:
      "Invitaciones digitales armadas por nuestro equipo en Los Ángeles con sobre 3D y confirmación por SMS.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function SpanishHomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Click & Love Invitaciones Digitales",
    url: "https://clickandlove.app/es/",
    logo: "https://clickandlove.app/logo.png",
    image: "https://clickandlove.app/assets/og-banner.png",
    description:
      "Papelería digital interactiva para bodas y quinceañeras con confirmación SMS, navegación GPS a salones y panel de anfitrión en Los Ángeles, California.",
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
    knowsLanguage: ["es", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Invitaciones Digitales",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Paquete Digital Asistido",
          price: "99",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Servicio VIP Los Ángeles",
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
      <HomeView initialLang="es" />
    </>
  );
}
