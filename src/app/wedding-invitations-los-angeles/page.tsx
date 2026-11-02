import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Wedding Invitations in Los Angeles | Click & Love",
  description:
    "Wedding invitations in Los Angeles with 3D envelope, music and SMS RSVP. See live demos, pick your design and share the link. Assisted $99. VIP $199.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/wedding-invitations-los-angeles",
  },
  openGraph: {
    title: "Wedding Invitations in Los Angeles | Click & Love",
    description:
      "Wedding invitations in Los Angeles with 3D envelope, music and SMS RSVP. See live demos, pick your design and share the link. Assisted $99. VIP $199.",
    url: "https://clickandlove.app/wedding-invitations-los-angeles",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Click & Love Luxury Digital Invitations - Los Angeles",
        type: "image/png",
      },
    ],
  },
};

export default function Page() {
  return (
    <LandingPage
      lang="en"
      canonical="https://clickandlove.app/wedding-invitations-los-angeles"
      homeUrl="https://clickandlove.app/"
      pageSlug="wedding-invitations-los-angeles"
      h1="Wedding Invitations in Los Angeles | Click and Love"
      intro="Click and Love creates wedding invitations in Los Angeles for busy couples. Your invitation lives in a link you share by message. Your guests open it on their phones, enjoy the 3D envelope and music, and confirm by SMS without installing an app. You see every confirmation in the host panel."
      sections={[
        {
          heading: "Why couples choose wedding invitations in Los Angeles from Click and Love",
          paragraphs: [
            "Los Angeles weddings move fast: venues across the city, guests in traffic, and last-minute schedule changes. A digital invitation keeps everyone on the same page, with the venue map, the updated time and the confirmation form in one link.",
          ],
          bullets: [
            "No third-party advertising inside your invitation, ever.",
            "Interactive 3D envelope with animation, not a static PDF.",
            "Confirmation by SMS or WhatsApp link, so your guests answer from their phones.",
            "Host panel with no charges per extra guest.",
            "Sections for cover photo, date, venue with map, countdown and RSVP.",
          ],
        },
        {
          heading: "How it works",
          paragraphs: [
            "From design to confirmed guests, the process follows six simple steps.",
          ],
          bullets: [
            "You pick a design from the catalog and you view its live demo.",
            "You customize your wedding details: names, date, venue, photos and sections.",
            "You review your invitation before you share it.",
            "You share the link by message with your guests.",
            "Your guests confirm by SMS with their name and phone number.",
            "Every confirmation lands in the host panel, where you see who is coming and how many passes each guest confirmed.",
          ],
        },
        {
          heading: "What your wedding invitation includes",
          paragraphs: [
            "Each design includes sections for a cover photo, date, venue with directions, countdown and RSVP confirmation, with music that fits your celebration. The design fits your guests phones, which is where they will open it. The host panel opens with a link per event, with no accounts or passwords your guests must remember.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How much do wedding invitations cost in Los Angeles?",
          a: "The Assisted package costs $99 and the VIP package costs $199. The Buy button charges the home price. If you prefer Zelle, text (818) 299-4882 and the team will help you through that channel without changing the base price.",
        },
        {
          q: "Do my guests need an app to confirm?",
          a: "No. Your guests open your invitation link and confirm by SMS with their name and phone number. They install nothing and create no accounts. The process works on any phone with text messages, and every answer appears in your host panel.",
        },
        {
          q: "What if our venue or time changes?",
          a: "Your invitation lives in a link, not on paper. You update the details once, and every guest who opens the link sees the current information, with the venue map and directions included. That avoids reprinting and resending paper invitations.",
        },
        {
          q: "Can we see the invitation before we buy?",
          a: "Yes. The catalog has live demos of every design. Open a demo, browse its sections and check how it looks on your phone. When you like a design, call (818) 299-4882 or buy the package from pricing.",
        },
      ]}
      faqTitle="Frequently asked questions about wedding invitations in Los Angeles"
      serviceName="Wedding invitations in Los Angeles"
      serviceDescription="Digital wedding invitations in Los Angeles with 3D envelope, music and SMS RSVP, plus a host panel for confirmations."
      packagesTitle="Packages and prices"
      assistedName="Assisted"
      assistedText="Digital invitation with SMS RSVP and host panel."
      vipName="VIP"
      vipText="VIP Los Angeles service with full team support, SMS RSVP and host panel."
      zelleNote="The Buy button charges the home price. If you prefer Zelle, text (818) 299-4882 and the team will help you through that channel."
      demosTitle="See the designs live"
      demosText="Open the catalog and browse every live demo on your phone before you buy. Emma & Lucas and Sofía & Alejandro are two wedding designs you can preview now."
      demoCatalogUrl="/demo"
      demoCatalogLabel="Browse the catalog"
      featuredDemos={[
        { slug: "emma-and-lucas", label: "Emma & Lucas" },
        { slug: "sofia-y-alejandro", label: "Sofía & Alejandro" },
      ]}
      finalTitle="Book your wedding invitations"
      finalText="Do you need wedding invitations in Los Angeles? Call (818) 299-4882 to confirm availability and answer your questions. We serve the full Los Angeles area, including Glendale, Burbank, Pasadena and the San Fernando Valley."
      callLabel="Call (818) 299-4882"
      smsLabel="Text us on SMS"
      smsBody="Hi, I want wedding invitations in Los Angeles for my event"
      pricingLabel="See packages"
      pricingUrl="/#precios"
      breadcrumbHome="Home"
      breadcrumbCurrent="Wedding Invitations"
    />
  );
}
