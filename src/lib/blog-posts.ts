// Blog de Click & Love — artículos como datos (sin dependencias nuevas).
// Patrón igual que las landings: contenido en datos, estructura en el componente.
// Los párrafos aceptan enlaces inline [texto](url).
// Fechas: fecha del borrador; actualizar a la fecha real de publicación al lanzar.
// Cada artículo enlaza 2 veces a su landing (intro + CTA final), según la
// estrategia de contenido, más enlaces a plantillas donde encajan.

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  readMinutes: number;
  landing: { href: string; label: string };
  sections: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-collect-wedding-photos-from-guests",
    title: "How to Collect Wedding Photos from Guests",
    description:
      "Ask guests to scan a QR code or open a link and upload their wedding photos, no app needed. See the live wall, then download the photos in a ZIP.",
    datePublished: "2026-11-02",
    readMinutes: 4,
    landing: {
      href: "/wedding-invitations-los-angeles",
      label: "Wedding Invitations in Los Angeles",
    },
    sections: [
      {
        heading: "Your guests take the best photos",
        paragraphs: [
          "Your photographer captures the ceremony and the portraits, but your guests capture everything else: the dance floor, the toasts, the moments you never saw. The problem is that those photos end up scattered across chats, stories and phones you never get back. The fix is simple: give every guest one place to upload before the party ends. That place starts with your [wedding invitation](https://clickandlove.app/wedding-invitations-los-angeles), because the invitation is already the link every guest opens.",
        ],
      },
      {
        heading: "Give guests one place to upload",
        paragraphs: [
          "Print a QR code or share a link and let guests upload straight from their phones, with no app to install and no account to create. Every photo lands in one gallery for the event, instead of ten different chats. With Click & Love, the guest gallery is part of the VIP plan: guests scan the code or open the link, upload photos and videos, and the host sees them in the event panel. See how a wedding design looks live in the [Fairytale Castle template](https://clickandlove.app/templates/emma-and-lucas).",
        ],
        bullets: [
          "QR code or link: guests open it with the phone camera, nothing to install.",
          "No accounts: guests do not need to sign up to upload.",
          "One gallery: every upload lands in the same place, not in ten chats.",
        ],
      },
      {
        heading: "Put the QR where guests actually see it",
        paragraphs: [
          "A QR code only works if guests notice it. Put it on the entrance sign, on the tables and on the thank-you cards you hand out at the end. Mention it once during the party, out loud: guests who hear it upload ten times more than guests who only see a sign. Test the code yourself on both iPhone and Android before the event, and make sure the venue has enough signal where guests will scan.",
        ],
      },
      {
        heading: "Show the photos live during the party",
        paragraphs: [
          "The moment guests see their own photos appear on a screen, they keep uploading. A live wall on a TV or projector turns photo sharing into part of the party: new uploads pop up in real time while people dance. It also solves the oldest wedding problem, which is that half the photos only appear weeks later, when nobody is excited anymore.",
        ],
      },
      {
        heading: "After the event: collect and keep everything",
        paragraphs: [
          "Share the link once more with your thank-you message, because guests keep taking photos after they leave and they forget to send them. Then download everything in one ZIP file instead of saving photos one by one from chats. One gallery, one download, and you keep the candid side of your wedding that no photographer could cover alone.",
        ],
      },
      {
        heading: "Do guests need an app?",
        paragraphs: [
          "No. Guests open the link or scan the code in their phone browser and upload from there. That is the whole point: the easier it is to upload, the more photos you get. If your guests need an account, an app or a tutorial, most of them will simply not bother.",
        ],
      },
    ],
  },
  {
    slug: "quinceanera-invitation-wording-examples",
    title: "Quinceañera Invitation Wording Examples",
    description:
      "Wording examples for quinceañera invitations in English and Spanish: formal, family and casual texts you can copy, plus what every invitation must include.",
    datePublished: "2026-11-02",
    readMinutes: 5,
    landing: {
      href: "/quince-invitations",
      label: "Quince Invitations in Los Angeles",
    },
    sections: [
      {
        heading: "Start with the facts, then pick the tone",
        paragraphs: [
          "Every quinceañera wording answers the same five questions: who is celebrating, when, where, how to confirm, and what to wear. Once those facts are in place, the tone is a choice: formal, warm and family, or casual. The examples below are ready to copy and adapt to your own [quinceañera invitation](https://clickandlove.app/quince-invitations).",
        ],
      },
      {
        heading: "Formal wording (English)",
        paragraphs: [
          "Mr. and Mrs. Garcia request the honor of your presence at the Quinceañera of their daughter, Sofia Garcia, on Saturday, June 12th, 2027, at six in the evening, at Renaissance Banquet Hall, Glendale, California. Reception to follow. Kindly confirm your attendance through the invitation link. Formal attire requested.",
        ],
        bullets: [
          "Use full names and the full date for formal invitations.",
          "Put the RSVP instruction in the same text, not on a separate card.",
        ],
      },
      {
        heading: "Formal wording (Spanish)",
        paragraphs: [
          "Los señores García tienen el honor de invitarle a la celebración de los quince años de su hija, Sofía García, el sábado 12 de junio de 2027, a las seis de la tarde, en Renaissance Banquet Hall, Glendale, California. Recepción a continuación. Favor de confirmar su asistencia por el enlace de la invitación. Vestimenta formal.",
        ],
      },
      {
        heading: "Warm and family wording",
        paragraphs: [
          "With hearts full of joy, our family invites you to celebrate fifteen years of Sofia. Join us for mass, the waltz and a night of dancing on Saturday, June 12th, 2027, at six in the evening. Your presence is the best gift. Please confirm through the invitation link so we can save your seats. See a design that fits this tone in the [Vintage Quinceanera template](https://clickandlove.app/templates/isabella-xv).",
        ],
      },
      {
        heading: "What every quinceañera invitation must include",
        paragraphs: [
          "No matter the tone, do not leave these out: the quinceañera's full name, the date and time, the ceremony and reception venues, the RSVP link or instruction, and the dress code. Families also appreciate one extra line: which colors are reserved for the quinceañera, so guests do not show up in the same dress color.",
        ],
        bullets: [
          "Name, date, time, venues: the four facts nobody can guess.",
          "RSVP instruction: one link beats a phone number nobody calls.",
          "Dress code and reserved colors: prevents the most common guest question.",
        ],
      },
      {
        heading: "English, Spanish, or both?",
        paragraphs: [
          "In Los Angeles, most quinceañera families have guests in both languages. An invitation that shows both versions avoids the awkward case where half the family guesses the details. If you can only pick one, pick the language your grandparents read, and put the RSVP link somewhere nobody can miss it.",
        ],
      },
    ],
  },
  {
    slug: "best-google-photos-alternatives-for-events",
    title: "Best Google Photos Alternatives for Events",
    description:
      "Google Photos shared albums work, but event guests need accounts and there is no live wall. Compare Kululu, Fotify and Click & Love for weddings and parties.",
    datePublished: "2026-11-02",
    readMinutes: 4,
    landing: {
      href: "/wedding-invitations-los-angeles",
      label: "Wedding Invitations in Los Angeles",
    },
    sections: [
      {
        heading: "Why people look for an alternative",
        paragraphs: [
          "Google Photos is the default answer for sharing event photos, and for a small family album it works. But a wedding or a quinceañera is not a family album: you have a hundred guests, one night, and no patience for accounts, permissions and missing photos. That is where dedicated event photo tools earn their place, and where your [wedding invitation](https://clickandlove.app/wedding-invitations-los-angeles) can carry the photo link from the start.",
        ],
      },
      {
        heading: "What Google Photos does well",
        paragraphs: [
          "Shared albums are free, links are easy to send, and storage is generous. If every guest already has a Google account and nobody needs a live slideshow, a shared album is enough. The problems start with the guests who do not have one, and with everything that happens after the upload.",
        ],
      },
      {
        heading: "Where it falls short for events",
        paragraphs: [
          "Guests who want to contribute to a shared album need a Google account, and many will not create one for a single party. There is no QR code flow designed for guests, no live wall that shows uploads on a screen during the event, and no RSVP attached to the same link. You end up with photos in one place, confirmations in another, and questions in a third.",
        ],
        bullets: [
          "Contributors need a Google account to add photos.",
          "No live slideshow wall for the venue screen.",
          "No guest flow built around a QR code at the event.",
          "No RSVP or guest list attached to the album.",
        ],
      },
      {
        heading: "The alternatives at a glance",
        paragraphs: [
          "Prices below are the ones listed on each service's own site at the time of writing; verify them before you buy, because they change. The point is not the price, it is the flow: how a guest goes from seeing a code to uploading a photo.",
        ],
        bullets: [
          "Kululu: free entry, Plus and Pro paid plans; QR album, live photo wall and ZIP download. Built for guest photo sharing only.",
          "Fotify: free tier plus paid plans per event; photo gallery plus invitations, RSVP and seating on the higher plans.",
          "Click & Love gallery: QR or link upload with no app, live wall, ZIP download, inside the same event where guests already confirmed. Included in the VIP plan.",
          "Google Photos: free shared albums, but contributors need accounts and there is no live wall or RSVP.",
        ],
      },
      {
        heading: "Which one fits your event",
        paragraphs: [
          "If you only need a shared folder and every guest has a Google account, stay with Google Photos. If you want guests uploading from a QR code during the party and photos on a screen the same night, pick a dedicated tool. And if your guests already confirm through a digital invitation, keeping the photos in that same event saves everyone a second link, a second account and a second explanation.",
        ],
      },
    ],
  },
  {
    slug: "how-to-track-event-rsvps-via-sms",
    title: "How to Track Event RSVPs via SMS",
    description:
      "Stop calling every guest. Send the invitation by text, let guests confirm from their phones, and watch every reply live in one panel with passes per family.",
    datePublished: "2026-11-02",
    readMinutes: 4,
    landing: {
      href: "/rsvp-tracking",
      label: "Digital Invitations with RSVP",
    },
    sections: [
      {
        heading: "Why calling every guest does not scale",
        paragraphs: [
          "A hundred guests means a hundred calls, half of them unanswered, and a notebook full of crossed-out names. Every change of plans means calling again. That is how hosts end up paying for plates nobody eats, or running out of seats for people who did confirm. Text confirmation exists to kill that notebook, and it starts with [digital invitations with RSVP](https://clickandlove.app/rsvp-tracking).",
        ],
      },
      {
        heading: "The SMS flow, step by step",
        paragraphs: [
          "You send the invitation link by text message. The guest opens it, sees the 3D envelope and the event details, and taps to confirm. The confirmation lands in your host panel instantly, with the guest's name and the number of passes they confirmed. No app, no account, no phone tag. You watch the confirmed list grow live from your phone, the same way you watch messages arrive.",
        ],
        bullets: [
          "Send: one text with the invitation link per guest or family.",
          "Confirm: the guest taps attend or decline and picks their passes.",
          "Track: every reply shows up live in the host panel.",
        ],
      },
      {
        heading: "Passes per family, not per invitation",
        paragraphs: [
          "The number that breaks a budget is not the guest count, it is the passes count. One invitation for a family of four is four plates, and one invitation for a single guest is one. Set the passes per guest when you send, and the panel adds them up for you. When a family confirms two passes instead of four, you know it the same day, not the week of the event. See it in a real design with the [Celestial Butterfly template](https://clickandlove.app/templates/mariposas-xv).",
        ],
      },
      {
        heading: "What to do with guests who never reply",
        paragraphs: [
          "Every event has them. The panel shows you exactly who is still pending, so your reminder goes only to them instead of a group message that annoys everyone who already confirmed. Send one reminder a few days before your venue needs the final count, and one last reminder the week of the event. Then call only the handful that never replied to any text, instead of calling the whole list.",
        ],
        bullets: [
          "Remind only the pending list, never the whole guest list.",
          "One reminder before the venue deadline, one the week of the event.",
          "Call only the guests who ignored every text.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
