import type { Metadata } from "next";
import RsvpTrackingLandingPage from "@/components/RsvpTrackingLandingPage";

export const metadata: Metadata = {
  title: "Live RSVP Tracking & Strict Pass Control | Click & Love",
  description:
    "Real-time RSVP tracking and strict family pass control on your phone. Stop uninvited plus-ones, see meal choices, export to Excel.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/rsvp-tracking",
  },
  openGraph: {
    title: "Live RSVP Tracking & Strict Pass Control | Click & Love",
    description:
      "Real-time event RSVP tracking on your mobile phone. View confirmed headcounts, dietary choices, and export clean Excel lists for your venue.",
    url: "https://clickandlove.app/rsvp-tracking",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Live RSVP Tracking & Pass Control - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live RSVP Tracking & Strict Pass Control | Click & Love",
    description:
      "Control every seat and family pass on your phone. Live attendance counters, dietary tracking, and 1-tap Excel export.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function RsvpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Live Event RSVP Tracking & Host Management",
        image: "https://clickandlove.app/assets/og-banner.png",
        description:
          "Private host dashboard for event RSVP tracking with strict pass quotas per household, entrée preferences, and 1-click Excel security exports.",
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
            name: "How does strict pass control work to stop uninvited guests?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You specify how many seats each guest or family is granted. When they open their link, the RSVP form only permits them to confirm up to that designated limit.",
            },
          },
          {
            "@type": "Question",
            name: "Can I export the guest list to Excel for my venue or caterer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! With one tap from your host dashboard, you can export a clean spreadsheet formatted with guest names, phone numbers, confirmed headcounts, and meal choices.",
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
      <RsvpTrackingLandingPage />
    </>
  );
}
