import type { Metadata } from "next";
import SaveTheDateLandingPage from "@/components/SaveTheDateLandingPage";

export const metadata: Metadata = {
  title: "Digital Save the Date Invitations | Click and Love",
  description:
    "Send a beautiful digital Save the Date in minutes — envelope, live countdown, Add to Calendar and Early RSVP. Only $49, or free inside VIP.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/save-the-date",
    languages: {
      en: "https://clickandlove.app/save-the-date",
      es: "https://clickandlove.app/es/save-the-date",
      "x-default": "https://clickandlove.app/save-the-date",
    },
  },
  openGraph: {
    title: "Digital Save the Date Invitations | Click and Love",
    description:
      "Send a beautiful digital Save the Date in minutes — envelope, live countdown, Add to Calendar and Early RSVP. Only $49, or free inside VIP.",
    url: "https://clickandlove.app/save-the-date",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Digital Save the Date Invitations - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Save the Date Invitations | Click and Love",
    description:
      "Send a beautiful digital Save the Date in minutes. Envelope, live countdown, Add to Calendar and Early RSVP. Only $49.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function SaveTheDatePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Digital Save the Date Invitations",
        image: "https://clickandlove.app/assets/save-the-date/principal.jpeg",
        description:
          "A digital Save the Date with an envelope that opens on your photo, a live countdown, one-tap Add to Calendar, Early RSVP, a photo gallery, and music — in English and Spanish.",
        brand: {
          "@type": "Brand",
          name: "Click & Love",
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "49",
          highPrice: "279",
          offerCount: "2",
          offers: [
            {
              "@type": "Offer",
              name: "Save the Date",
              price: "49",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "VIP All-Inclusive",
              price: "279",
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
            name: "How do you send a digital save the date?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You share a link — by text, WhatsApp, or email. Your guests tap it and the envelope opens on their phone: your photo, the date, a live countdown, and a button to add it to their calendar. No app to install, no account to create, nothing to print.",
            },
          },
          {
            "@type": "Question",
            name: "Can you combine a save the date and RSVP?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Every Save the Date includes Early RSVP: guests can already tell you if they plan to come, months before the formal invitation goes out. You see the early answers in your host dashboard.",
            },
          },
          {
            "@type": "Question",
            name: "How much do save the dates cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A digital Save the Date from Click and Love is $49, one time — envelope, countdown, Add to Calendar, Early RSVP, photo gallery, and music included. The Save the Date is also included free in the VIP plan ($279).",
            },
          },
          {
            "@type": "Question",
            name: "When should you send save the dates?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Six to twelve months before the celebration. That is early enough for out-of-town guests to plan travel, and late enough that the date is firm. Your formal invitation goes out about eight weeks before the event.",
            },
          },
          {
            "@type": "Question",
            name: "What should a save the date include?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Four things: your names, the date, the city, and a way to save it. Ours adds the rest for you — your photo, a live countdown, an Add to Calendar button, and Early RSVP so you hear back right away.",
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
      <SaveTheDateLandingPage />
    </>
  );
}
