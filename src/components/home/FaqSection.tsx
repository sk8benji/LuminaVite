"use client";

import { homeFaq } from "@/lib/home-faq";
import type { Language } from "@/lib/home-translations";

// Sección FAQ del home (SEO, nov 2026): preguntas PAA reales de los estudios
// DataForSEO. El schema FAQPage vive en src/app/page.tsx y src/app/es/page.tsx,
// construido con los mismos datos (homeFaq) para que no se desincronicen.
export default function FaqSection({ lang = "en" }: { lang?: Language }) {
  const faq = homeFaq(lang);
  return (
    <section
      id="faq"
      className="py-20 px-4 sm:px-6 bg-[#FAF8F5] border-t border-b border-neutral-200 scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-['Cinzel'] font-bold text-3xl sm:text-4xl text-[#2B0A18]">
            {faq.title}
          </h2>
        </div>
        <div className="space-y-4">
          {faq.items.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl border border-[#E7DCC8] bg-white px-5 py-4"
            >
              <summary className="font-bold text-[15px] text-[#7A002A] cursor-pointer">
                {f.q}
              </summary>
              <p className="mt-3 leading-relaxed text-[#45303B] text-[14.5px]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
