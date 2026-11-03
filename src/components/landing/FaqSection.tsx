"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export const FAQS = [
  {
    q: "Do guests need to download an application or create an account?",
    a: "No. Your invitation opens instantly from a text message or WhatsApp link in any phone browser. Guests never install an app or create an account, which makes it easy for grandparents and busy guests alike.",
  },
  {
    q: "Can we restrict extra uninvited plus-ones?",
    a: "Yes. Each guest or family receives a personalized link with a set number of passes. The RSVP form only allows confirmations up to that limit, so uninvited plus-ones simply can't be added.",
  },
  {
    q: "How does the SMS RSVP feature actually work?",
    a: "Guests receive a text with their personal invitation link. They tap it, open the envelope, and confirm with one tap. Every response appears in your live host dashboard instantly, along with guest counts and table assignments.",
  },
  {
    q: "Can we update the ceremony or reception details if something changes?",
    a: "Absolutely. Because your invitation is live online, we can update times, venues, or schedules at any point and every guest sees the latest version the next time they open their link.",
  },
  {
    q: "Can you prepare bilingual invitations (English & Spanish)?",
    a: "Yes. We regularly create fully bilingual invitations so every relative can read the details in the language they're most comfortable with. Guests can switch between English and Spanish at any time.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 border-t border-charcoal/5 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading id="faq-title" eyebrow="FAQ" title="Frequently Asked Questions" />

        <ul className="mt-12 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <li key={item.q}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-playfair text-lg font-semibold text-charcoal">{item.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        open ? "rotate-45 border-wine bg-wine text-white" : "border-charcoal/15 text-charcoal"
                      }`}
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-14 text-sm leading-relaxed text-charcoal/65">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
