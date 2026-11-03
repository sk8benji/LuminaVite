import type { Metadata } from "next";
import WeddingLasVegasLandingPage from "@/components/WeddingLasVegasLandingPage";

export const metadata: Metadata = {
  title: "Wedding Digital Invitations in Las Vegas | Instant SMS RSVP",
  description:
    "Luxury 3D wedding invitations in Las Vegas with first-dance music, 1-tap SMS RSVP, meal selection and GPS to Las Vegas venues.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/wedding-invitations-las-vegas",
  },
  openGraph: {
    title: "Wedding Digital Invitations in Las Vegas | Instant SMS RSVP",
    description:
      "Luxury 3D interactive wedding invitations in Las Vegas with custom wax seal unboxing, instant SMS RSVPs, plated meal tracking, and venue GPS.",
    url: "https://clickandlove.app/wedding-invitations-las-vegas",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Wedding Digital Invitations in Las Vegas - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Digital Invitations in Las Vegas | Instant SMS RSVP",
    description:
      "Luxury 3D interactive wedding invitations with custom wax seal, SMS RSVP, plated dinner tracking, and GPS to Las Vegas venues.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function WeddingLasVegasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Luxury Wedding Digital Invitations",
        image: "https://clickandlove.app/assets/og-banner.png",
        description:
          "Custom 3D unboxing wedding invitations with waltz music, instant SMS RSVP, plated dinner entrée selection, and live host dashboard in Las Vegas.",
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
              name: "Plan VIP Las Vegas",
              price: "199",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          ],
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Las Vegas Metropolitan Area",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Can our wedding guests choose their plated dinner entrée through the RSVP?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! In the VIP plan, your invitation includes an interactive meal selector where guests specify their dish choice along with any dietary allergies, viewable directly from your host panel.",
            },
          },
          {
            "@type": "Question",
            name: "How does the gift registry section work? Can we link Zelle, Venmo, or Honeyfund?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We include a dedicated registry section where you can link your Honeyfund, Zola, Amazon, or display your Zelle / Venmo details with a 1-tap copy button.",
            },
          },
          {
            "@type": "Question",
            name: "Do our wedding guests need to download an app or create an account?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No! Guests simply tap the link, enjoy the 3D unboxing experience and music, and confirm via SMS with a single tap.",
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
      <WeddingLasVegasLandingPage />
    </>
  );
}
