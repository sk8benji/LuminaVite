import type { Metadata } from "next";
import SmsLandingPage from "@/components/SmsLandingPage";

export const metadata: Metadata = {
  title: "Text Message Invitations with Instant 1-Tap RSVP | Click & Love",
  description:
    "Luxury text message invitations with 98%+ open rate. Send 3D unboxing invitations straight to guests' phones via SMS with zero app downloads, instant confirmations, and automatic GPS routes.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/text-message-invitations",
  },
  openGraph: {
    title: "Text Message Invitations with Instant 1-Tap RSVP | Click & Love",
    description:
      "Interactive 3D unboxing invitations sent directly by SMS. 98%+ open rate, 0 apps needed, live host tracking dashboard, and automatic GPS directions.",
    url: "https://clickandlove.app/text-message-invitations",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Text Message Invitations with Live RSVP - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Message Invitations with Instant 1-Tap RSVP | Click & Love",
    description:
      "Skip lost paper mail. Send gorgeous 3D invitations via SMS with 98%+ open rate, live RSVP tracking, and automated GPS reminders.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function SmsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Text Message (SMS) Digital Invitations",
        image: "https://clickandlove.app/assets/og-banner.png",
        description:
          "Instant text message digital invitations featuring 3D virtual wax seal unboxing, background music, real-time SMS RSVP tracking, and automated venue GPS reminders.",
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
            name: "Why do SMS invitations perform better than email or paper?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Over 98% of text messages are opened within 3 minutes of receipt. Unlike paper invitations that cost hundreds in postage and take weeks to be answered, text invitations allow guests to confirm attendance with one tap.",
            },
          },
          {
            "@type": "Question",
            name: "Do my guests need to download an app or register an account?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No! Guests do not need to install anything from the App Store or Google Play. Tapping the link opens the invitation directly in their mobile browser.",
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
      <SmsLandingPage />
    </>
  );
}
