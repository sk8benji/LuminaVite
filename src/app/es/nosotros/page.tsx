import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "Nosotros | Click & Love",
  description:
    "Click & Love es un estudio en Los Ángeles que crea invitaciones digitales interactivas para quinceañeras y bodas — sobres 3D, música, RSVP por SMS y soporte en vivo. Conoce a nuestra fundadora, Elena Samaniego.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/es/nosotros",
    languages: {
      en: "https://clickandlove.app/about-us",
      es: "https://clickandlove.app/es/nosotros",
      "x-default": "https://clickandlove.app/about-us",
    },
  },
  openGraph: {
    title: "Nosotros | Click & Love",
    description:
      "Click & Love es un estudio en Los Ángeles que crea invitaciones digitales interactivas para quinceañeras y bodas — sobres 3D, música, RSVP por SMS y soporte en vivo. Conoce a nuestra fundadora, Elena Samaniego.",
    url: "https://clickandlove.app/es/nosotros",
    siteName: "Click & Love",
    locale: "es_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Nosotros - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros | Click & Love",
    description:
      "Click & Love es un estudio en Los Ángeles que crea invitaciones digitales interactivas para quinceañeras y bodas — sobres 3D, música, RSVP por SMS y soporte en vivo. Conoce a nuestra fundadora, Elena Samaniego.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function NosotrosPage() {
  return <AboutContent lang="es" />;
}
