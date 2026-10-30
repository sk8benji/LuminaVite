import Link from "next/link";
import TrackLink from "@/components/analytics/TrackLink";

// Shared layout for the transactional landing pages (content strategy 2026-10-30).
// Every page passes its own copy; this component only renders structure, CTAs and JSON-LD.
// Provider is inlined (the home JSON-LD declares no @id to reference).

export type LandingSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LandingFaq = {
  q: string;
  a: string;
};

type LandingPageProps = {
  lang: "en" | "es";
  canonical: string;
  homeUrl: string;
  pageSlug: string;
  h1: string;
  intro: string;
  sections: LandingSection[];
  faqs: LandingFaq[];
  faqTitle: string;
  serviceName: string;
  serviceDescription: string;
  packagesTitle: string;
  assistedName: string;
  assistedText: string;
  vipName: string;
  vipText: string;
  zelleNote: string;
  demosTitle: string;
  demosText: string;
  demoCatalogUrl: string;
  demoCatalogLabel: string;
  finalTitle: string;
  finalText: string;
  callLabel: string;
  smsLabel: string;
  smsBody: string;
  pricingLabel: string;
  pricingUrl: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
};

const PHONE_DISPLAY = "(818) 299-4882";
const PHONE_TEL = "tel:+18182994882";
const PHONE_SMS = "sms:+18182994882";

const AREA_SERVED = [
  { "@type": "City", name: "Los Angeles" },
  { "@type": "City", name: "Glendale" },
  { "@type": "City", name: "Burbank" },
  { "@type": "City", name: "Pasadena" },
  { "@type": "AdministrativeArea", name: "San Fernando Valley" },
];

export default function LandingPage(props: LandingPageProps) {
  const {
    lang,
    canonical,
    homeUrl,
    pageSlug,
    h1,
    intro,
    sections,
    faqs,
    faqTitle,
    serviceName,
    serviceDescription,
    packagesTitle,
    assistedName,
    assistedText,
    vipName,
    vipText,
    zelleNote,
    demosTitle,
    demosText,
    demoCatalogUrl,
    demoCatalogLabel,
    finalTitle,
    finalText,
    callLabel,
    smsLabel,
    smsBody,
    pricingLabel,
    pricingUrl,
    breadcrumbHome,
    breadcrumbCurrent,
  } = props;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: h1,
        description: serviceDescription,
        inLanguage: lang,
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: serviceName,
        serviceType: serviceName,
        description: serviceDescription,
        provider: {
          "@type": "ProfessionalService",
          name: "Click & Love",
          url: "https://clickandlove.app/",
          telephone: "+1-818-299-4882",
          priceRange: "$99 - $199",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Los Angeles",
            addressRegion: "CA",
            addressCountry: "US",
          },
          areaServed: AREA_SERVED,
          knowsLanguage: ["en", "es"],
        },
        areaServed: AREA_SERVED,
        offers: [
          { "@type": "Offer", name: "Assisted", price: "99", priceCurrency: "USD" },
          { "@type": "Offer", name: "VIP", price: "199", priceCurrency: "USD" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: breadcrumbHome, item: homeUrl },
          { "@type": "ListItem", position: 2, name: breadcrumbCurrent, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="bg-[#7A002A] text-white">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="text-sm tracking-widest uppercase text-[#FFD166] font-bold">
            Click &amp; Love · Los Angeles
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">{h1}</h1>
          <p className="mt-4 text-lg leading-relaxed text-white/90">{intro}</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-2xl font-bold text-[#7A002A]">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-3 space-y-2 list-disc pl-5 leading-relaxed">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <section>
          <h2 className="text-2xl font-bold text-[#7A002A]">{packagesTitle}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#7A002A]/20 bg-white p-5">
              <p className="font-bold text-lg">
                {assistedName} · $99
              </p>
              <p className="mt-2 leading-relaxed">{assistedText}</p>
            </div>
            <div className="rounded-2xl border border-[#7A002A]/20 bg-white p-5">
              <p className="font-bold text-lg">
                {vipName} · $199
              </p>
              <p className="mt-2 leading-relaxed">{vipText}</p>
            </div>
          </div>
          <p className="mt-3 leading-relaxed">{zelleNote}</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#7A002A]">{demosTitle}</h2>
          <p className="mt-3 leading-relaxed">{demosText}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={demoCatalogUrl}
              className="inline-flex px-5 py-3 rounded-xl bg-[#7A002A] text-white font-bold"
            >
              {demoCatalogLabel}
            </Link>
            <Link
              href={`${demoCatalogUrl}/isabella-xv`}
              className="inline-flex px-5 py-3 rounded-xl border border-[#7A002A] text-[#7A002A] font-bold"
            >
              Elegant Rose
            </Link>
            <Link
              href={`${demoCatalogUrl}/beauty-quince-xv`}
              className="inline-flex px-5 py-3 rounded-xl border border-[#7A002A] text-[#7A002A] font-bold"
            >
              Beauty Quince
            </Link>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#7A002A]">{faqTitle}</h2>
          <div className="mt-4 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold text-lg">{f.q}</h3>
                <p className="mt-1 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-[#7A002A] text-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold">{finalTitle}</h2>
          <p className="mt-3 leading-relaxed text-white/90">{finalText}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <TrackLink
              href={PHONE_TEL}
              event="click_llamar"
              eventParams={{ origen: "landing", pagina: pageSlug }}
              className="inline-flex px-5 py-3 rounded-xl bg-[#FFD166] text-[#7A002A] font-extrabold"
            >
              📞 {callLabel}
            </TrackLink>
            <TrackLink
              href={`${PHONE_SMS}?&body=${encodeURIComponent(smsBody)}`}
              event="click_sms"
              eventParams={{ origen: "landing", pagina: pageSlug }}
              className="inline-flex px-5 py-3 rounded-xl bg-white text-[#7A002A] font-extrabold"
            >
              {smsLabel}
            </TrackLink>
            <Link
              href={pricingUrl}
              className="inline-flex px-5 py-3 rounded-xl border border-white font-extrabold"
            >
              {pricingLabel}
            </Link>
          </div>
          <p className="mt-4 text-white/80">{PHONE_DISPLAY}</p>
        </section>
        <p className="text-center">
          <Link href={homeUrl} className="text-[#7A002A] font-bold underline">
            Click &amp; Love
          </Link>
        </p>
      </main>
    </>
  );
}
