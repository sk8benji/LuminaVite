import { Check } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { WHATSAPP_URL } from "./site";

const TIERS = [
  {
    name: "Assisted Event Package",
    price: "$99",
    featured: false,
    blurb: "Everything you need for a beautiful, trackable invitation.",
    features: [
      "Custom 3D envelope with music",
      "Up to 200 SMS RSVP confirmations",
      "Live host dashboard & pass limits",
      "GPS map integrations",
    ],
  },
  {
    name: "VIP Concierge Los Angeles",
    price: "$199",
    featured: true,
    blurb: "White-glove service for larger, detail-rich celebrations.",
    features: [
      "Everything in Assisted",
      "Up to 350 SMS RSVP confirmations",
      "Professional photo retouching & layout tweaking",
      "Printable table QR code cards (PDF ready)",
      "Dedicated WhatsApp support for last-minute schedule updates",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="pricing-title"
          eyebrow="Transparent Pricing"
          title="Flat Fee. No Subscriptions."
          description="One payment per event. No monthly plans, no per-guest surprises."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-3xl p-8 ${
                tier.featured
                  ? "bg-wine text-white shadow-[0_30px_60px_-30px_rgba(107,29,46,0.8)]"
                  : "border border-charcoal/10 bg-white text-charcoal"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-champagne px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              )}
              <h3 className="font-playfair text-2xl font-semibold">{tier.name}</h3>
              <p className={`mt-2 text-sm ${tier.featured ? "text-white/70" : "text-charcoal/60"}`}>{tier.blurb}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-playfair text-5xl font-semibold">{tier.price}</span>
                <span className={`text-sm ${tier.featured ? "text-white/70" : "text-charcoal/60"}`}>/ one-time fee</span>
              </p>

              <ul className="mt-8 space-y-3.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? "text-champagne" : "text-wine"}`}
                      aria-hidden
                    />
                    <span className={tier.featured ? "text-white/90" : "text-charcoal/80"}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-colors ${
                  tier.featured
                    ? "bg-white text-wine hover:bg-ivory"
                    : "bg-charcoal text-white hover:bg-charcoal/90"
                }`}
              >
                Get Started with {tier.featured ? "VIP" : "Assisted"}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
