import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About Us | Click & Love",
  description:
    "Click & Love is a Los Angeles studio making interactive digital invitations for quinceañeras and weddings — 3D envelopes, music, SMS RSVP and live guest support. Meet our founder, Elena Samaniego.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/about-us",
    languages: {
      en: "https://clickandlove.app/about-us",
      es: "https://clickandlove.app/es/nosotros",
      "x-default": "https://clickandlove.app/about-us",
    },
  },
  openGraph: {
    title: "About Us | Click & Love",
    description:
      "Click & Love is a Los Angeles studio making interactive digital invitations for quinceañeras and weddings — 3D envelopes, music, SMS RSVP and live guest support. Meet our founder, Elena Samaniego.",
    url: "https://clickandlove.app/about-us",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "About Us - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Click & Love",
    description:
      "Click & Love is a Los Angeles studio making interactive digital invitations for quinceañeras and weddings — 3D envelopes, music, SMS RSVP and live guest support. Meet our founder, Elena Samaniego.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function AboutUsPage() {
  return <AboutContent lang="en" />;
}
