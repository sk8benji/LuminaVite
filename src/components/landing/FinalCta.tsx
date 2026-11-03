import { MessageCircle, MessageSquareText, Phone } from "lucide-react";
import { NAV_LINKS, PHONE_DISPLAY, PHONE_SMS, PHONE_TEL, WHATSAPP_URL } from "./site";

export function FinalCta() {
  return (
    <footer className="bg-wine-deep text-white">
      <section aria-labelledby="cta-title" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,151,90,0.22),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:px-8 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-champagne">Los Angeles · Southern California</p>
          <h2
            id="cta-title"
            className="mt-4 text-balance font-playfair text-3xl font-semibold leading-tight sm:text-5xl"
          >
            Ready to Create an Unforgettable First Impression?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/75 sm:text-lg">
            Get your personalized invitation online in 24 to 48 hours.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-wine transition-colors hover:bg-ivory"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call Office
            </a>
            <a
              href={PHONE_SMS}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden />
              Send Text
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-champagne/15"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp Consultation
            </a>
          </div>
          <p className="mt-6 text-sm text-white/60">{PHONE_DISPLAY}</p>
        </div>
      </section>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-white/60 md:flex-row md:px-8">
          <p>
            <span className="font-playfair text-sm text-white">Click &amp; Love</span> · Digital Invitations in Los
            Angeles
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/es" className="hover:text-white" hrefLang="es">
                  Español
                </a>
              </li>
            </ul>
          </nav>
          <p>© {new Date().getFullYear()} Click &amp; Love</p>
        </div>
      </div>
    </footer>
  );
}
