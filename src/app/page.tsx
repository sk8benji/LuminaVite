import { Metadata } from "next";
import HomeView from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "Click & Love • Luxury Interactive Digital Invitations in Los Angeles",
  description:
    "Couture digital invitations custom-built in Los Angeles for weddings and quinceañeras. Features 3D musical envelope, SMS RSVPs, venue GPS navigation, and live host mobile roster.",
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
    title: "Click & Love • Luxury Interactive Digital Invitations in Los Angeles",
    description:
      "Interactive digital invitations with 3D envelope, SMS RSVPs, and turn-by-turn venue GPS. Designed for Southern California venues & celebrations.",
    url: "https://clickandlove.app/",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/template-butterfly/foto-columpio-portada.png",
        width: 1200,
        height: 630,
        alt: "Click & Love Luxury Digital Invitations - Los Angeles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Click & Love • Luxury Interactive Digital Invitations",
    description:
      "Couture invitations built by our Los Angeles team with 3D envelope and SMS RSVPs.",
    images: [
      "https://clickandlove.app/assets/template-butterfly/foto-columpio-portada.png",
    ],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Click & Love Digital Invitations",
    image:
      "https://clickandlove.app/assets/template-butterfly/foto-columpio-portada.png",
    description:
      "Interactive gala digital invitations with SMS RSVPs, venue GPS navigation, and live host dashboard based in Los Angeles, California.",
    url: "https://clickandlove.app",
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
      "Los Angeles County",
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
      <HomeView initialLang="en" />
    </>
  );
}
