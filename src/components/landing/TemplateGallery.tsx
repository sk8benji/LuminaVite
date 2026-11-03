import Image from "next/image";
import Link from "next/link";
import { Eye, Users } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const TEMPLATES = [
  {
    name: "The Beverly Modern",
    subtitle: "Minimalist Black Tie Wedding",
    image: "/assets/landing/beverly-modern.png",
    tags: ["Wedding", "Black Tie"],
    capacity: "Up to 350 guests",
    href: "/demo/emma-and-lucas",
  },
  {
    name: "Royal Butterfly Gala",
    subtitle: "Blush & Gold Quinceañera",
    image: "/assets/landing/royal-butterfly.png",
    tags: ["Quinceañera", "Blush & Gold"],
    capacity: "Up to 300 guests",
    href: "/demo/mariposas-xv",
  },
  {
    name: "Midnight Velvet",
    subtitle: "Sophisticated Celebration",
    image: "/assets/landing/midnight-velvet.png",
    tags: ["Gala", "Anniversary"],
    capacity: "Up to 200 guests",
    href: "/demo",
  },
];

export function TemplateGallery() {
  return (
    <section aria-labelledby="templates-title" className="border-y border-charcoal/5 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="templates-title"
          eyebrow="Live Previews"
          title="Interactive Template Previews"
          description="Open any design on your phone and experience exactly what your guests will see."
        />

        <ul className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {TEMPLATES.map((t) => (
            <li key={t.name} className="flex flex-col">
              <div className="rounded-[2.25rem] bg-charcoal p-2 shadow-[0_30px_60px_-30px_rgba(35,32,30,0.5)]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.8rem] bg-ivory">
                  <Image
                    src={t.image}
                    alt={`${t.name} invitation preview: ${t.subtitle}`}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover"
                  />
                  <ul className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal backdrop-blur"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4 px-1">
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-charcoal">{t.name}</h3>
                  <p className="mt-0.5 text-sm text-charcoal/60">{t.subtitle}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-charcoal/60">
                    <Users className="h-3.5 w-3.5 text-champagne" aria-hidden />
                    {t.capacity}
                  </p>
                </div>
                <Link
                  href={t.href}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-wine/20 px-4 py-2 text-xs font-semibold text-wine transition-colors hover:bg-wine hover:text-white"
                  aria-label={`Preview demo of ${t.name}`}
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden />
                  Preview Demo
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
