import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Text Message Invitations with Live RSVP | Click & Love",
  description:
    "Text message invitations with instant confirmation and a live host panel. Send your event by SMS, guests confirm from their phones. Assisted $99. VIP $199.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/text-message-invitations",
  },
  openGraph: {
    title: "Text Message Invitations with Live RSVP | Click & Love",
    description:
      "Text message invitations with instant confirmation and a live host panel. Send your event by SMS, guests confirm from their phones. Assisted $99. VIP $199.",
    url: "https://clickandlove.app/text-message-invitations",
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
      canonical="https://clickandlove.app/text-message-invitations"
      homeUrl="https://clickandlove.app/"
      pageSlug="text-message-invitations"
      h1="Text Message Invitations with Live RSVP | Click and Love"
      intro="Text message invitations from Click and Love let you send your event by SMS and get confirmations back in real time. Your guests open the link on their phones, enjoy the 3D envelope and music, and confirm by SMS without installing an app. Every answer lands in your host panel."
      sections={[
        {
          heading: "Why text message invitations work for busy families",
          paragraphs: [
            "Your guests already read their messages. A text message invitation meets them there, with no paper to lose, no email to miss and no app to install. One link carries the whole invitation, and one reply confirms the guest.",
          ],
          bullets: [
            "No app for your guests: they open the link and confirm by SMS.",
            "No third-party advertising inside your invitation, ever.",
            "Interactive 3D envelope with animation, not a static PDF.",
            "Host panel with no charges per extra guest.",
            "Sections for cover photo, date, venue with map, countdown and RSVP.",
          ],
        },
        {
          heading: "How sending works",
          paragraphs: [
            "From template to confirmed guests, the process follows six simple steps.",
          ],
          bullets: [
            "You pick a template from the catalog and you view its live demo.",
            "You customize your event details: names, date, venue, photos and sections.",
            "You review your invitation before you share it.",
            "You send the link by SMS to your guests, with a ready message you can paste in each chat.",
            "Your guests confirm by SMS with their name and phone number.",
            "Every confirmation lands in the host panel, where you see who is coming and how many passes each guest confirmed.",
          ],
        },
        {
          heading: "What your guests see",
          paragraphs: [
            "Your guests tap the link and see the full invitation: the 3D envelope, your music, the date, the venue with directions, the countdown and the confirmation form. Everything opens in the phone browser, with nothing to download and no account to create.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How much do text message invitations cost?",
          a: "The Assisted package costs $99 and the VIP package costs $199. The Buy button charges the home price. If you prefer Zelle, text (818) 299-4882 and the team will help you through that channel without changing the base price.",
        },
        {
          q: "Do my guests need an app to confirm?",
          a: "No. Your guests open your invitation link and confirm by SMS with their name and phone number. They install nothing and create no accounts. The process works on any phone with text messages, and every answer appears in your host panel.",
        },
        {
          q: "How do I send the invitations?",
          a: "Your invitation lives in a link. You send it by SMS to each guest, with a ready message you can paste in the chat. Your guests tap the link, see the invitation and confirm, and every answer lands in your panel.",
        },
        {
          q: "How do I track who confirmed?",
          a: "Every confirmation lands in your event host panel. There you see each guest name and how many people each guest confirmed. The panel opens with a link, with no login, so you can check it any time from your phone.",
        },
      ]}
      faqTitle="Frequently asked questions about text message invitations"
      serviceName="Text message invitations"
      serviceDescription="Text message invitations with instant SMS confirmation and a live host panel for weddings and quinceañeras in Los Angeles."
      packagesTitle="Packages and prices"
      assistedName="Assisted"
      assistedText="Digital invitation with SMS RSVP and host panel."
      vipName="VIP"
      vipText="VIP Los Angeles service with full team support, SMS RSVP and host panel."
      zelleNote="The Buy button charges the home price. If you prefer Zelle, text (818) 299-4882 and the team will help you through that channel."
      demosTitle="See the templates live"
      demosText="Open the catalog and browse every live demo on your phone before you buy. Elegant Rose and Beauty Quince are two of the most requested templates."
      demoCatalogUrl="/demo"
      demoCatalogLabel="Browse the catalog"
      finalTitle="Send your invitations by text"
      finalText="Do you want text message invitations for your event? Call (818) 299-4882 to confirm availability and answer your questions. We serve the full Los Angeles area, including Glendale, Burbank, Pasadena and the San Fernando Valley."
      callLabel="Call (818) 299-4882"
      smsLabel="Text us on SMS"
      smsBody="Hi, I want text message invitations for my event"
      pricingLabel="See packages"
      pricingUrl="/#precios"
      breadcrumbHome="Home"
      breadcrumbCurrent="Text Message Invitations"
    />
  );
}
