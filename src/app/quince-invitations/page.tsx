import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Quince Invitations in Los Angeles | Click & Love",
  description:
    "Quince invitations in Los Angeles with 3D envelope, music and SMS RSVP. See live demos, pick your template and share the link. Assisted $99. VIP $199.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/quince-invitations",
    languages: {
      en: "https://clickandlove.app/quince-invitations",
      es: "https://clickandlove.app/es/invitaciones-de-quinceanera",
      "x-default": "https://clickandlove.app/quince-invitations",
    },
  },
  openGraph: {
    title: "Quince Invitations in Los Angeles | Click & Love",
    description:
      "Quince invitations in Los Angeles with 3D envelope, music and SMS RSVP. See live demos, pick your template and share the link. Assisted $99. VIP $199.",
    url: "https://clickandlove.app/quince-invitations",
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
      canonical="https://clickandlove.app/quince-invitations"
      homeUrl="https://clickandlove.app/"
      pageSlug="quince-invitations"
      h1="Quince Invitations in Los Angeles | Click and Love"
      intro="Click and Love creates quince invitations for families in Los Angeles. Your invitation lives in a link you share by message. Your guests open it on their phones, enjoy the 3D envelope and music, and confirm by SMS without installing an app. You see every confirmation in the host panel."
      sections={[
        {
          heading: "Why families choose quince invitations from Click and Love",
          paragraphs: [
            "A quinceañera invitation should feel like the party: elegant, personal and easy to share. Our digital invitations open with an interactive 3D envelope, play your music and carry every detail your guests need, from the mass to the reception.",
          ],
          bullets: [
            "No third-party advertising inside your invitation, ever.",
            "Interactive 3D envelope with animation, not a static PDF.",
            "Confirmation by SMS, so your guests answer from their phones.",
            "Host panel with no charges per extra guest.",
            "Sections for cover photo, date, venue with map, countdown and RSVP.",
          ],
        },
        {
          heading: "When a digital quince invitation makes sense",
          paragraphs: [],
          bullets: [
            "You already booked the date and the venue, and you need to tell your guests with something that looks good and that you can share today.",
            "Your guest list is ready and you need to know who is coming and how many people each guest brings.",
            "You want to skip paper: printing, delivering and chasing paper replies costs time and money, and one link reaches everyone in minutes.",
            "Your guests live far away: family in other cities or other states opens the same link as your local guests.",
            "You need pass control: each guest confirms their companions, and you plan tables and food with real numbers.",
          ],
        },
        {
          heading: "How it works",
          paragraphs: [
            "From template to shared link, the process follows six simple steps.",
          ],
          bullets: [
            "You pick a template from the catalog and you view its live demo.",
            "You customize your quinceañera details: names, date, venue, photos and sections.",
            "You review your invitation before you share it.",
            "You share the link by message with your guests.",
            "Your guests confirm by SMS with their name and phone number.",
            "Every confirmation lands in the host panel, where you see who is coming and how many passes each guest confirmed.",
          ],
        },
        {
          heading: "What your invitation includes",
          paragraphs: [
            "Each template includes sections for a cover photo, date, venue, countdown and RSVP confirmation. The design fits your guests phones, which is where they will open it. The host panel opens with a link per event, with no accounts or passwords your guests must remember.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How much do quince invitations cost in Los Angeles?",
          a: "The Assisted package costs $99 and the VIP package costs $199. The Buy button charges the home price. If you prefer Zelle, text (818) 299-4882 and the team will help you through that channel without changing the base price.",
        },
        {
          q: "Do my guests need an app to confirm?",
          a: "No. Your guests open your invitation link and confirm by SMS with their name and phone number. They install nothing and create no accounts. The process works on any phone with text messages, and every answer appears in your host panel.",
        },
        {
          q: "How do I know who confirmed?",
          a: "Every confirmation lands in your event host panel. There you see each guest name and how many people each guest confirmed. The panel opens with a link, with no login, so you can check it any time from your phone.",
        },
        {
          q: "Can I see the invitation before I buy?",
          a: "Yes. The catalog has live demos of every template. Open a demo, browse its sections and check how it looks on your phone. When you like a template, call (818) 299-4882 or buy the package from pricing.",
        },
      ]}
      faqTitle="Frequently asked questions about quince invitations in Los Angeles"
      serviceName="Quince invitations in Los Angeles"
      serviceDescription="Digital quince invitations in Los Angeles with 3D envelope, music and SMS RSVP, plus a host panel for confirmations."
      packagesTitle="Packages and prices"
      assistedName="Assisted"
      assistedText="Digital invitation with SMS RSVP and host panel."
      vipName="VIP"
      vipText="VIP Los Angeles service with full team support, SMS RSVP and host panel."
      zelleNote="The Buy button charges the home price. If you prefer Zelle, text (818) 299-4882 and the team will help you through that channel."
      demosTitle="See the templates live"
      demosText="Open the catalog and browse every live demo on your phone before you buy. Elegant Rose and Beauty Quince are two of the most requested quinceañera templates."
      demoCatalogUrl="/demo"
      demoCatalogLabel="Browse the catalog"
      finalTitle="Call and book your date"
      finalText="Do you need quince invitations in Los Angeles? Call (818) 299-4882 to confirm availability and answer your questions. We serve the full Los Angeles area, including Glendale, Burbank, Pasadena and the San Fernando Valley."
      callLabel="Call (818) 299-4882"
      smsLabel="Text us on SMS"
      smsBody="Hi, I want quince invitations in Los Angeles for my event"
      pricingLabel="See packages"
      pricingUrl="/#precios"
      breadcrumbHome="Home"
      breadcrumbCurrent="Quince Invitations"
    />
  );
}
