import type { Metadata } from "next";
import Link from "next/link";
import PricingPlans from "@/components/pricing/PricingPlans";
import SiteFooter from "@/components/layout/SiteFooter";
import { pricingPlans, planByKey, planPriceNumber, pricingRange } from "@/lib/pricing";

const PHONE_DISPLAY = "(818) 918-2519";
const PHONE_TEL = "tel:+18189182519";

// Title / meta exactos del keyword research (keyword-research-pricing-2026-11-15.md).
export const metadata: Metadata = {
  title: "Wedding Invitation Prices 2026: Digital vs Printed | Click and Love",
  description:
    "Printed invitations average $400–$600. Click and Love digital invitations cost $99–$279 flat — 3D envelope, music, SMS RSVP. See plans and demos.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/pricing",
    languages: {
      en: "https://clickandlove.app/pricing",
      es: "https://clickandlove.app/es/precios",
      "x-default": "https://clickandlove.app/pricing",
    },
  },
  openGraph: {
    title: "Wedding Invitation Prices 2026: Digital vs Printed | Click and Love",
    description:
      "Printed invitations average $400–$600. Click and Love digital invitations cost $99–$279 flat — 3D envelope, music, SMS RSVP. See plans and demos.",
    url: "https://clickandlove.app/pricing",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Wedding Invitation Prices - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation Prices 2026: Digital vs Printed | Click and Love",
    description:
      "Printed invitations average $400–$600. Click and Love digital invitations cost $99–$279 flat — 3D envelope, music, SMS RSVP. See plans and demos.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function PricingPage() {
  // Precios SIEMPRE desde home-translations.ts (misma fuente que el home).
  const range = pricingRange("en");
  const express = planByKey("en", "express");
  const assisted = planByKey("en", "assisted");
  const vip = planByKey("en", "vip");
  const plans = pricingPlans("en");

  // FAQ: preguntas PAA verbatim del estudio (DataForSEO). Las respuestas usan
  // solo cifras atribuidas a su fuente y precios derivados de los planes.
  const faq: { q: string; a: string }[] = [
    {
      q: "How much are wedding invites per card?",
      a: `For a typical printed suite, about $4–$6 per card: most couples spend $400–$600 on printed invitations (Yeah Weddings), and a 100-guest suite runs $400–$650 (Greenvelope). A Click and Love digital invitation has no per-card cost — it is a flat ${range.label} no matter how many guests you invite.`,
    },
    {
      q: "How much to print 100 invites?",
      a: `A printed suite for 100 guests runs $400–$650, according to Greenvelope. Most couples spend $400–$600 on printed invitations overall, according to Yeah Weddings. With digital there is no printing at all: our plans are ${range.label} flat, and every guest gets the same link.`,
    },
    {
      q: "Where can I find cheap wedding invitations with RSVP cards and envelopes?",
      a: `The big print shops — Vistaprint, Zazzle and Shutterfly — sell printed suites with RSVP cards and envelopes. If you would rather skip printing altogether, a Click and Love digital invitation has the RSVP built in (SMS confirmations on Assisted and VIP, web dashboard on every plan) from ${express.price}.`,
    },
    {
      q: "Is it cheaper to print your own wedding invitations?",
      a: `Printing at home saves the print-shop markup, but you still pay for card stock, ink, envelopes and postage — plus the assembly time. Most couples still land in the $400–$600 printed range (Yeah Weddings). A digital invitation skips all of it: ${range.label} flat, ready to share the same day.`,
    },
    {
      q: "How much do high end wedding invitations cost?",
      a: `High-end stationery can run $5,000–$8,000, according to experts quoted by Yeah Weddings. Our most complete plan, VIP All-Inclusive, is ${vip.price} and includes the live guest photo album and unlimited revisions until the event.`,
    },
    {
      q: "Is it cheaper to buy or make wedding invitations?",
      a: `Buying from a print shop is usually cheaper than making them once you count materials, ink, envelopes and postage — and far faster. Going digital is cheaper than both: ${range.label} flat with no materials at all.`,
    },
    {
      q: "How much does it cost for 200 wedding invitations?",
      a: `Printed costs grow with the guest count: the $400–$600 average (Yeah Weddings) covers a typical 100-guest suite, so 200 guests means a bigger print run and more postage. A digital invitation costs the same for 100 or 200 guests — ${range.label} flat.`,
    },
    {
      q: "What is a good budget for a wedding with 100 guests?",
      a: `For invitations, budget $400–$600 if you are printing (Yeah Weddings), or ${range.label} flat for a digital invitation with the same 3D envelope, music and RSVP.`,
    },
    {
      q: "Can I send digital wedding invitations?",
      a: "Yes. Your Click and Love invitation is a web link you share by SMS, WhatsApp or QR code. Guests open it on their phone — no app, no account, no download.",
    },
    {
      q: "How much do 150 invitations cost on Canva?",
      a: `Canva template prices vary by seller, and a template still needs your time to customize. Our invitations are not templates: our team builds yours, and the flat price is ${range.label}, including the 3D envelope, music and RSVP.`,
    },
    {
      q: "What is usually included on a save the date?",
      a: "Your names, the wedding date and the city or venue. The formal invitation with the full details follows later. Our digital Save the Date is included in the VIP plan at no extra cost.",
    },
    {
      q: "What is the cheapest way to save the date?",
      a: "A digital save the date: no printing, no postage, sent as a link in seconds. With Click and Love it is included in the VIP plan — $0 extra.",
    },
    {
      q: "How much is postage for save the dates?",
      a: "Printed save the dates need a stamp per guest, on top of printing. A digital save the date has no postage at all — it travels as a link.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Click and Love Digital Wedding Invitations",
        image: "https://clickandlove.app/assets/og-banner.png",
        description:
          "Digital wedding invitations with 3D envelope, music, SMS RSVP and live host panel. Flat pricing, no printing or postage.",
        brand: { "@type": "Brand", name: "Click & Love" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: String(range.min),
          highPrice: String(range.max),
          offerCount: String(plans.length),
          offers: plans.map((p) => ({
            "@type": "Offer",
            name: p.name,
            price: String(planPriceNumber(p.price)),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          })),
        },
        areaServed: { "@type": "Country", name: "United States" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#FDFBF8] text-[#2B0A18] font-['Montserrat']">
        {/* Header */}
        <header className="bg-[#7A002A] text-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Click and Love">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Click and Love" className="w-10 h-10 object-contain" />
              <span className="flex items-baseline whitespace-nowrap">
                <span className="font-['Montserrat'] font-extrabold text-[20px] tracking-tight text-white">
                  Click
                </span>
                <span className="font-vibes text-[28px] leading-none text-[#FFD166] ml-1.5">and Love</span>
              </span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-[13px] font-semibold">
              <Link href="/demo" className="hover:text-[#FFD166] transition">
                Live demos
              </Link>
              <a href={PHONE_TEL} className="hover:text-[#FFD166] transition">
                {PHONE_DISPLAY}
              </a>
              <Link
                href="/es/precios"
                className="border border-white/40 rounded-full px-3 py-1 hover:bg-white/10 transition"
              >
                Español
              </Link>
            </nav>
          </div>
          <div className="max-w-4xl mx-auto px-4 pb-10 pt-4">
            <p className="text-sm tracking-widest uppercase text-[#FFD166] font-bold">
              Click &amp; Love · Los Angeles
            </p>
            <h1 className="mt-3 font-['Cinzel'] text-4xl sm:text-5xl font-bold leading-tight">
              Wedding Invitation Prices
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/90">
              Printed wedding invitations average $400–$600 for most couples, according to Yeah
              Weddings. Click and Love digital invitations cost {range.label} flat: one fixed
              price, no printing, no postage and no per-guest fees. Every plan includes the
              interactive 3D envelope with music, GPS directions and a live RSVP dashboard —
              Assisted and VIP add SMS confirmations.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Planes */}
          <section aria-label="Plans">
            <h2 className="font-['Cinzel'] text-3xl font-bold text-center">Choose your plan</h2>
            <p className="text-center text-[15px] text-[#5A3C46] mt-3 max-w-2xl mx-auto">
              One-time payment. Our Los Angeles team builds your invitation — you just send your
              photos and details.
            </p>
            <div className="mt-10">
              <PricingPlans lang="en" />
            </div>
          </section>

          {/* H2: How much do wedding invitations cost? */}
          <section className="mt-16">
            <h2 className="font-['Cinzel'] text-3xl font-bold">How much do wedding invitations cost?</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              For printed invitations, most couples spend $400–$600, according to Yeah Weddings —
              and high-end stationery can run $5,000–$8,000, according to experts quoted in the
              same guide. Greenvelope puts the average printed invitation at $220, with printed
              suites for 100 guests running $400–$650.
            </p>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              That works out to roughly $4–$6 per card for a typical 100-guest suite. And the
              suite itself is only part of it: printed invitations also add envelopes, postage
              and assembly time — costs that simply do not exist with a digital invitation.
            </p>
          </section>

          {/* H2: How much do digital wedding invitations cost? */}
          <section className="mt-12">
            <h2 className="font-['Cinzel'] text-3xl font-bold">How much do digital wedding invitations cost?</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Click and Love digital invitations cost {range.label} flat. The price does not
              change with your guest count: {express.name} {express.price}, {assisted.name}{" "}
              {assisted.price} and {vip.name} {vip.price} — one payment, no printing, no
              postage, no per-guest fees.
            </p>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Your invitation is a web link you share by SMS, WhatsApp or QR code. Guests open
              it on their phone, watch the 3D envelope open with music, and confirm by text —
              no app and no account needed. Every plan includes the live host panel, so you see
              every confirmation in real time.
            </p>
          </section>

          {/* H2: Average cost — tabla comparativa */}
          <section className="mt-12">
            <h2 className="font-['Cinzel'] text-3xl font-bold">Average cost of wedding invitations</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Same 100 guests, two very different totals:
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-[14px] border border-[#E7DCC8] rounded-2xl overflow-hidden bg-white">
                <thead>
                  <tr className="bg-[#7A002A] text-white">
                    <th className="px-4 py-3 font-bold">100 guests</th>
                    <th className="px-4 py-3 font-bold">Printed</th>
                    <th className="px-4 py-3 font-bold">Click and Love digital</th>
                  </tr>
                </thead>
                <tbody className="text-[#45303B]">
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">Total price</td>
                    <td className="px-4 py-3">$400–$650</td>
                    <td className="px-4 py-3 font-bold text-[#7A002A]">{range.label} flat</td>
                  </tr>
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">Per guest</td>
                    <td className="px-4 py-3">About $4–$6 per card</td>
                    <td className="px-4 py-3">$0 — flat price, any guest count</td>
                  </tr>
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">Printing &amp; postage</td>
                    <td className="px-4 py-3">Extra, on top of the suite</td>
                    <td className="px-4 py-3">None</td>
                  </tr>
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">RSVP</td>
                    <td className="px-4 py-3">Reply cards + stamps</td>
                    <td className="px-4 py-3">SMS confirmations (Assisted &amp; VIP) or web dashboard</td>
                  </tr>
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">Delivery</td>
                    <td className="px-4 py-3">By mail, days</td>
                    <td className="px-4 py-3">Instant link, same day</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-[#8A6B76]">
              Printed figures: Greenvelope (2026) and Yeah Weddings. Digital prices: our current
              plans, one-time payment.
            </p>
          </section>

          {/* H2: Save the Dates */}
          <section className="mt-12">
            <h2 className="font-['Cinzel'] text-3xl font-bold">How much do save the dates cost?</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Printed save the dates mean a second print run and a second round of postage.
              With Click and Love, the digital Save the Date is included in the {vip.name} plan
              at $0 extra — same 3D envelope style, sent as a link the day you are ready.
            </p>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              A save the date only needs your names, the wedding date and the city or venue.
              The formal invitation with the full details follows later — and when it does, your
              guests already know the date.
            </p>
          </section>

          {/* H2: Quinceañera */}
          <section className="mt-12">
            <h2 className="font-['Cinzel'] text-3xl font-bold">Quinceañera invitation prices</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Quinceañera invitations use the same three plans — {express.name} {express.price},{" "}
              {assisted.name} {assisted.price} and {vip.name} {vip.price}. A digital
              quinceañera invitation costs the same as a wedding one: one flat price, no
              printing, no per-guest fees.
            </p>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              The {vip.name} plan adds the live guest photo album — your guests upload photos
              and videos during the party with a QR code on the tables — plus the digital Save
              the Date and unlimited revisions until the event.
            </p>
            <p className="mt-4 leading-relaxed">
              <Link href="/quince-invitations" className="font-semibold underline underline-offset-4">
                Explore Quinceañera Invitations
              </Link>
            </p>
          </section>

          {/* H2: FAQ */}
          <section className="mt-16">
            <h2 className="font-['Cinzel'] text-3xl font-bold">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {faq.map((f) => (
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
          </section>

          {/* CTA */}
          <section className="mt-16 rounded-3xl bg-[#7A002A] text-white px-6 py-10 text-center">
            <h2 className="font-['Cinzel'] text-3xl font-bold">See it before you pay for it</h2>
            <p className="mt-3 text-white/90 max-w-xl mx-auto leading-relaxed">
              Try the live demos — open the 3D envelope, hear the music and confirm by SMS,
              exactly like your guests will.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/demo"
                className="px-7 py-3.5 rounded-full bg-white text-[#7A002A] font-bold text-sm hover:bg-[#F5EDDA] transition"
              >
                View live demos
              </Link>
              <a
                href={PHONE_TEL}
                className="px-7 py-3.5 rounded-full border border-white/50 font-bold text-sm hover:bg-white/10 transition"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-5 text-sm text-white/70">
              <Link href="/es/precios" className="underline underline-offset-4 hover:text-white">
                Ver precios en español →
              </Link>
            </p>
          </section>
        </main>
      </div>
      <SiteFooter lang="en" />
    </>
  );
}
