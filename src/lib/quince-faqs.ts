// Preguntas del acordeón de la landing XV. Fuente única: la usa el
// componente cliente (acordeón) y page.tsx (server, schema FAQPage).

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS_LIST: FaqItem[] = [
  {
    question: "How do guests RSVP to our quince invitations?",
    answer:
      "Guests receive the invitation link via text message or WhatsApp, tap to view the 3D animated envelope, and submit their confirmation directly in their mobile browser without creating an account or downloading an application.",
  },
  {
    question: "Can we prevent uninvited guests from adding extra plus-ones?",
    answer:
      "Yes. Each invitation link can be pre-configured with a specific number of family passes. Guests can only confirm up to the allocated seat limit.",
  },
  {
    question: "What happens if our mass time, dinner schedule, or venue changes at the last minute?",
    answer:
      "Because your invitation is live software hosted in the cloud, our local Los Angeles team updates your schedule or venue details instantly. Your guests will always see the 100% correct information without you having to reprint anything.",
  },
  {
    question: "Are you locally based in Los Angeles? Can we talk to a real person?",
    answer:
      "Yes! Click & Love is a digital software platform serving celebrations nationwide across the United States. You can call or text our team anytime at (818) 299-4882 or message us on WhatsApp.",
  },
  {
    question: "Can we include my daughter's favorite waltz or entrance song?",
    answer:
      "Absolutely. You can upload any song file (.mp3, .m4a) or choose from our curated library of romantic waltzes and pop hits. As soon as your guest taps the envelope to open, the music plays automatically in high-fidelity audio.",
  },
  {
    question: "How fast is the turnaround time after I place my order?",
    answer:
      "Our team handcrafts and delivers your custom link within 24 to 48 hours. If you choose our VIP Los Angeles package, rush 24-hour turnaround and dedicated priority WhatsApp support are included at no extra cost.",
  },
  {
    question: "Can we manage a bilingual celebration for English and Spanish speakers?",
    answer:
      "Yes! Both our Assisted and VIP templates support bilingual options so abuelitos and tias can read in Spanish, while cousins and classmates can read in English with a single tap.",
  },
];
