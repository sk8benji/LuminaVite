import Link from "next/link";
import { ArrowUpRight, Cake, Crown, Heart } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const PILLARS = [
  {
    icon: Heart,
    title: "Weddings",
    description:
      "Elegant registry links, meal selection, formal dress code guides, and wedding party highlights.",
    href: "/wedding-invitations-los-angeles",
    cta: "Explore Wedding Invitations",
    tags: ["Registry", "Meal choice", "Dress code"],
  },
  {
    icon: Crown,
    title: "Quinceañeras",
    description:
      "Church mass details, reception timeline, padrinos de honor list, and family pass tracking.",
    href: "/quince-invitations",
    cta: "Explore Quinceañera Invitations",
    tags: ["Misa", "Padrinos", "Family passes"],
  },
  {
    icon: Cake,
    title: "Milestone Birthdays & Anniversaries",
    description:
      "Sweet 16, adult galas, and VIP celebrations with custom party music and private guest lists.",
    href: "/demo",
    cta: "Explore Celebration Invitations",
    tags: ["Sweet 16", "Galas", "Private lists"],
  },
];

export function CelebrationPillars() {
  return (
    <section
      id="celebrations"
      aria-labelledby="celebrations-title"
      className="scroll-mt-20 border-y border-charcoal/5 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="celebrations-title"
          eyebrow="Celebrations"
          title="Choose Your Celebration"
          description="Purpose-built invitation experiences for the moments Southern California families care about most."
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, ...p }) => (
            <li key={p.title}>
              <Link
                href={p.href}
                className="group flex h-full flex-col rounded-3xl border border-charcoal/5 bg-ivory p-7 transition-all hover:-translate-y-1 hover:border-champagne/40 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wine text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 font-playfair text-2xl font-semibold text-charcoal">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/65">{p.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${p.title} highlights`}>
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-charcoal/70">
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold text-wine">
                  {p.cta}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
