import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Digital Invitations with RSVP Tracking | Click & Love",
  description:
    "Digital invitations with RSVP tracking in real time. See every confirmation, pass and guest detail in one host panel. Assisted $99. VIP $199.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/rsvp-tracking",
  },
  openGraph: {
    title: "Digital Invitations with RSVP Tracking | Click & Love",
    description:
      "Digital invitations with RSVP tracking in real time. See every confirmation, pass and guest detail in one host panel. Assisted $99. VIP $199.",
    url: "https://clickandlove.app/rsvp-tracking",
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
      canonical="https://clickandlove.app/rsvp-tracking"
      homeUrl="https://clickandlove.app/"
      pageSlug="rsvp-tracking"
      h1="Digital Invitations with RSVP Tracking | Click and Love"
      intro="Digital invitations with RSVP tracking from Click and Love show you every confirmation as it arrives. Your guests open the link, enjoy the 3D envelope and music, and confirm in the invitation form. You see names, passes and details in one host panel, with no calls one guest at a time."
      sections={[
        {
          heading: "How digital invitations with RSVP tracking work",
          paragraphs: [
            "Your invitation lives in a link you share by message. Your guests confirm in the integrated form, and every answer lands in the host panel. The data stays centralized in one place, so you always plan with real numbers.",
          ],
          bullets: [
            "Live guest list: every confirmation appears in the panel as it arrives.",
            "Pass control: each guest confirms their companions, and you see the total.",
            "Form details: menu choices, companions and songs, in one dynamic form.",
            "No charges per extra guest in the host panel.",
            "No third-party advertising inside your invitation, ever.",
          ],
        },
        {
          heading: "What the host panel shows",
          paragraphs: [
            "The panel opens with a link per event, with no login and no passwords to remember. There you see each guest name, how many people each guest confirmed, and the details they left in the form. You check it any time from your phone, before and after the party.",
          ],
        },
        {
          heading: "How it works",
          paragraphs: [
            "From template to a full guest list, the process follows six simple steps.",
          ],
          bullets: [
            "You pick a template from the catalog and you view its live demo.",
            "You customize your event details: names, date, venue, photos and sections.",
            "You review your invitation before you share it.",
            "You share the link by message with your guests.",
            "Your guests confirm in the invitation form, with menu, companions and songs.",
            "Every confirmation lands in the host panel, where you see who is coming and how many passes each guest confirmed.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How much do digital invitations with RSVP tracking cost?",
          a: "The Assisted package costs $99 and the VIP package costs $199. The Buy button charges the home price. If you prefer Zelle, text (818) 299-4882 and the team will help you through that channel without changing the base price.",
        },
        {
          q: "Do my guests need an app to confirm?",
          a: "No. Your guests open your invitation link and confirm in the form, or by SMS with their name and phone number. They install nothing and create no accounts. The process works on any phone, and every answer appears in your host panel.",
        },
        {
          q: "Who can see the host panel?",
          a: "The panel belongs to your event and opens with a link, with no login. You share that link only with whoever manages the guest list. Your guests never see the panel; they only see their own invitation and confirmation form.",
        },
        {
          q: "Can I see the invitation before I buy?",
          a: "Yes. The catalog has live demos of every template. Open a demo, browse its sections and check how it looks on your phone. When you like a template, call (818) 299-4882 or buy the package from pricing.",
        },
      ]}
      faqTitle="Frequently asked questions about RSVP tracking"
      serviceName="Digital invitations with RSVP tracking"
      serviceDescription="Digital invitations with real-time RSVP tracking: live guest list, pass control and form details in one host panel."
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
      finalTitle="Track every confirmation"
      finalText="Do you want digital invitations with RSVP tracking for your event? Call (818) 299-4882 to confirm availability and answer your questions. We serve the full Los Angeles area, including Glendale, Burbank, Pasadena and the San Fernando Valley."
      callLabel="Call (818) 299-4882"
      smsLabel="Text us on SMS"
      smsBody="Hi, I want digital invitations with RSVP tracking for my event"
      pricingLabel="See packages"
      pricingUrl="/#precios"
      breadcrumbHome="Home"
      breadcrumbCurrent="RSVP Tracking"
    />
  );
}
