import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "WhatsApp Invitation Link for Your Event | Click & Love",
  description:
    "Share your interactive invitation with a WhatsApp invitation link: 3D envelope preview, event title and ready message. Guests confirm on the invitation. Assisted $99. VIP $199.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/whatsapp-invitations",
  },
  openGraph: {
    title: "WhatsApp Invitation Link for Your Event | Click & Love",
    description:
      "Share your interactive invitation with a WhatsApp invitation link: 3D envelope preview, event title and ready message. Guests confirm on the invitation. Assisted $99. VIP $199.",
    url: "https://clickandlove.app/whatsapp-invitations",
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
      canonical="https://clickandlove.app/whatsapp-invitations"
      homeUrl="https://clickandlove.app/"
      pageSlug="whatsapp-invitations"
      h1="WhatsApp Invitation Link for Your Event | Click and Love"
      intro="A WhatsApp invitation link from Click and Love lets you share your interactive invitation in any private chat. Your guests tap the link, see the 3D envelope preview with your event title, and confirm on the invitation itself. No noisy groups, no generic-looking link, no app to install."
      sections={[
        {
          heading: "How a WhatsApp invitation link works",
          paragraphs: [
            "Your invitation gets its own link, built to look good the moment it lands in a chat. From there, sharing takes seconds and confirmations stay in one place.",
          ],
          bullets: [
            "Optimized preview: the link shows the 3D envelope image, your personalized event title and an attractive description, so it never looks like generic spam.",
            "Ready message: a copy-and-paste template for private chats, so you send the same warm message to every guest.",
            "Individual or full-list sending: paste the message in each private chat, one by one or across your whole list, without creating annoying groups.",
            "Guests tap the link, open the interactive invitation and confirm in the web form, with menu, companions and songs.",
            "Every confirmation lands in the host panel, with no need to read chat replies one by one.",
          ],
        },
        {
          heading: "Why share by WhatsApp",
          paragraphs: [
            "For many Latino families in Los Angeles, WhatsApp is the chat they already open every day. Sharing your invitation there means your guests actually see it, tap it and answer, instead of losing it in an inbox or a paper pile.",
          ],
        },
        {
          heading: "What stays on the web",
          paragraphs: [
            "Confirmation happens inside the invitation, in the integrated dynamic form. Your guests answer menu, companions and songs there, and the data stays centralized in your host panel database. You never depend on reading incoming text messages by hand to know who is coming. SMS confirmation stays available for guests who prefer it.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How much does a WhatsApp invitation link cost?",
          a: "The Assisted package costs $99 and the VIP package costs $199. The Buy button charges the home price. If you prefer Zelle, text (818) 299-4882 and the team will help you through that channel without changing the base price.",
        },
        {
          q: "Do my guests need an app to confirm?",
          a: "They need WhatsApp only to receive your message. The invitation itself opens in the phone browser, and guests confirm in the web form. They install nothing extra and create no accounts, and every answer appears in your host panel.",
        },
        {
          q: "Does the RSVP happen inside WhatsApp?",
          a: "No. Your guests receive the link by WhatsApp, tap it and confirm on the invitation, in the integrated form with menu, companions and songs. That keeps every answer centralized in your host panel, instead of scattered across chat replies.",
        },
        {
          q: "Can I send the invitation to many people?",
          a: "Yes. You get a ready message template to copy and paste in private chats, one by one or across your whole list. You avoid noisy groups, and every guest gets the same personal link preview with your event title.",
        },
      ]}
      faqTitle="Frequently asked questions about WhatsApp invitation links"
      serviceName="WhatsApp invitation link"
      serviceDescription="Share your interactive invitation with a WhatsApp invitation link: optimized preview, ready message template and confirmation on the invitation."
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
      finalTitle="Share your invitation on WhatsApp"
      finalText="Do you want a WhatsApp invitation link for your event? Call (818) 299-4882 to confirm availability and answer your questions. We serve the full Los Angeles area, including Glendale, Burbank, Pasadena and the San Fernando Valley."
      callLabel="Call (818) 299-4882"
      smsLabel="Text us on SMS"
      smsBody="Hi, I want a WhatsApp invitation link for my event"
      pricingLabel="See packages"
      pricingUrl="/#precios"
      breadcrumbHome="Home"
      breadcrumbCurrent="WhatsApp Invitations"
    />
  );
}
