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
        url: "https://clickandlove.app/assets/template-butterfly/foto-columpio-portada.png",
        width: 1200,
        height: 630,
        alt: "Click & Love Invitaciones Digitales de Lujo - Los Ángeles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Click & Love • Invitaciones Digitales Interactivas de Gala",
    description:
      "Invitaciones digitales armadas por nuestro equipo en Los Ángeles con sobre 3D y confirmación por SMS.",
    images: [
      "https://clickandlove.app/assets/template-butterfly/foto-columpio-portada.png",
    ],
  },
};

export default function SpanishHomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Click & Love Invitaciones Digitales",
    image:
      "https://clickandlove.app/assets/template-butterfly/foto-columpio-portada.png",
    description:
      "Papelería digital interactiva para bodas y quinceañeras con confirmación SMS, navegación GPS a salones y panel de anfitrión en Los Ángeles, California.",
    url: "https://clickandlove.app/es/",
    telephone: "+1-818-299-4882",
    priceRange: "$99 - $199",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.0522,
      longitude: -118.2437,
    },
    areaServed: [
      "Condado de Los Ángeles",
      "San Fernando Valley",
      "Glendale",
      "Pasadena",
      "Burbank",
      "Orange County",
    ],
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
