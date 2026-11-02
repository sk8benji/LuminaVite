// Preguntas del acordeón de la landing XV. Fuente única: la usa el
// componente cliente (acordeón) y page.tsx (server, schema FAQPage).

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS_LIST: FaqItem[] = [
  {
    question: "Do our guests need to download an app or sign up to view the invitation?",
    answer:
      "Zero downloads required. Your guests simply tap a private link sent via text, WhatsApp, or Instagram DM. The invitation opens instantly in Safari, Chrome, or any mobile browser with high-definition animations, music, and GPS navigation.",
  },
  {
    question: "How does the strict pass control per family work?",
    answer:
      "Unlike paper invitations where guests assume they can bring uninvited plus-ones, our platform locks the RSVP to the exact number of passes you assign (e.g., 'Familia Morales · 4 passes assigned'). When they confirm, they can only confirm up to that limit, saving you thousands on catering headcount.",
  },
  {
    question: "What happens if our mass time, dinner schedule, or venue changes at the last minute?",
    answer:
      "Because your invitation is live software hosted in the cloud, our local Los Angeles team updates your schedule or venue details instantly. Your guests will always see the 100% correct information without you having to reprint anything.",
  },
  {
    question: "Are you locally based in Los Angeles? Can we talk to a real person?",
    answer:
      "Yes! We are proudly based in Southern California, serving the San Fernando Valley, Glendale, Burbank, Pasadena, Downtown LA, and Orange County. You can call or text us anytime at (818) 299-4882 or message us on WhatsApp.",
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
