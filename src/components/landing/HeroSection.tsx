import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { HeroInvitationMockup } from "./HeroInvitationMockup";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-20 pt-14 md:px-8 lg:grid-cols-2 lg:gap-12 lg:pb-28 lg:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-charcoal/80">
            <MapPin className="h-3.5 w-3.5 text-champagne" aria-hidden />
            Serving Los Angeles, San Fernando Valley &amp; Southern California
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-balance font-playfair text-4xl font-semibold leading-[1.08] tracking-tight text-charcoal sm:text-5xl lg:text-[3.6rem]"
          >
            Luxury Digital Invitations Your Guests Actually{" "}
            <span className="italic text-wine">Open &amp; Confirm</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-charcoal/70 sm:text-lg">
            Interactive 3D animated envelopes, personalized background music, and instant SMS RSVP tracking
            without forcing your guests to download any app.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-champagne text-champagne" />
              ))}
            </div>
            <p className="text-sm text-charcoal/70">
              <span className="sr-only">Rated 5 out of 5. </span>
              Trusted by <span className="font-semibold text-charcoal">1,200+</span> California couples &amp; families
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/demo"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(107,29,46,0.8)] transition-colors hover:bg-wine-deep"
            >
              Explore Live Demos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full border border-charcoal/15 bg-white/60 px-7 py-3.5 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/30 hover:bg-white"
            >
              See Pricing &amp; Packages
            </a>
          </div>
        </div>

        <HeroInvitationMockup />
      </div>
    </section>
  );
}
