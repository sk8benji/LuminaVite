import type { Metadata } from "next";
import WhatsAppLandingPage from "@/components/WhatsAppLandingPage";

export const metadata: Metadata = {
  title: "WhatsApp Invitation Links with 3D Unboxing & Live RSVP | Click & Love",
  description:
    "Share luxury 3D invitations on WhatsApp with rich card previews, custom music, 1-tap opening with zero apps and live RSVP sync.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/whatsapp-invitations",
  },
  openGraph: {
    title: "WhatsApp Invitation Links with 3D Unboxing & Live RSVP | Click & Love",
    description:
      "Share luxury 3D invitations on WhatsApp with rich card previews, background music, zero app downloads, and instant RSVP sync.",
    url: "https://clickandlove.app/whatsapp-invitations",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "WhatsApp Digital Invitations - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Invitation Links with 3D Unboxing & Live RSVP | Click & Love",
    description:
      "Send luxury 3D unboxing invitations on WhatsApp. Rich card preview, background music, and real-time confirmations without noisy group chats.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function WhatsAppPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "WhatsApp Digital Event Invitations",
        image: "https://clickandlove.app/assets/og-banner.png",
        description:
          "Custom WhatsApp invitations with rich photo card previews, 3D wax seal unboxing, background music, and automatic RSVP sync to a private host dashboard.",
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
              name: "Plan VIP Concierge",
              price: "199",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Will the photo and event title show up automatically in WhatsApp?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! Every invitation includes specialized OpenGraph metadata. When you paste your link, WhatsApp automatically displays your cover photo, event title, date, and venue.",
            },
          },
          {
            "@type": "Question",
            name: "Do I have to create an 80-person group to invite everyone?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No! We recommend sending the link in private one-on-one chats or using a WhatsApp Broadcast list. Confirmations flow directly into your private host dashboard.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WhatsAppLandingPage />
    </>
  );
}
