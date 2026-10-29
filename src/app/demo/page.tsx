import Link from "next/link";
import { Sparkles, ArrowRight, ExternalLink, MessageSquare } from "lucide-react";
import prisma from "@/lib/db";
import { ALL_SYSTEM_DEMOS } from "@/lib/demo-data";
import { INITIAL_MASTER_TEMPLATES } from "@/lib/templates-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Interactive Collections Catalog | Click & Love",
  description: "Explore our 8+ interactive collections with 3D virtual envelope, music, and RSVP confirmation.",
};

const DEMO_CARDS = [
  // Row 1
  {
    slug: "mariposas-xv",
    title: "Celestial Butterfly",
    name: "Valeria Morales",
    tag: "Quinceañera & Gala",
    badge: "Most Requested",
    desc: "3D butterfly effect, virtual envelope with wax seal, and sky-blue tones with gold details.",
    image: "/assets/template-butterfly/foto-columpio-portada.webp",
  },
  {
    slug: "baby-blue-xv",
    title: "Garden Baby Blue",
    tag: "Quinceañera & Gala",
    desc: "Blue envelope cover with dove, silver oval photo frame, navy countdown, mass postcard, letter, and FAQs.",
    image: "/assets/template-baby-blue/foto-gazebo.webp",
    badge: "Baby Blue T7",
  },
  {
    slug: "miss-15-xv",
    title: "Mis 15 Cream & Gold",
    tag: "Quinceañera & Gala",
    desc: "Straight to the point, no envelope: card over the swing photo, music player, full court of honor, and RSVP in outline letters with monogram.",
    image: "/assets/template-miss15/foto-columpio.webp",
    badge: "Miss 15 T8",
  },
  {
    slug: "era-pink-xv",
    title: "Quince Pink",
    tag: "Quinceañera & Gala",
    desc: "Simple cover with wax seal, full-photo sunset hero, illustrated program, and pastel pink details with dotted buttons.",
    image: "/assets/template-era-pink/foto-sentada.webp",
    badge: "The Hanger T6",
  },
  {
    slug: "beauty-quince-xv",
    title: "Beauty Quince",
    name: "Jasmine",
    tag: "Quinceañera & Gala",
    badge: "New",
    desc: "Replica of the Canva Beauty Quince Invitation: blue envelope with rose wax seal, moonlit castle, enchanted rose, music disc, Party Plan, Kids Policy, registry and RSVP. Art replaceable piece by piece from the admin.",
    image: "/assets/template-beauty-quince/foto-carroza-atardecer.webp",
  },
  {
    slug: "blush-princess-xv",
    title: "Blush Princess",
    name: "Isabella Sofia",
    tag: "Quinceañera & Gala",
    badge: "New",
    desc: "Replica of the CouCou Canva design: pink envelope with monogram and crown seal, gold monogram, Then/Now photos, and full court of honor.",
    image: "/assets/template-blush/foto-1.webp",
  },
  {
    slug: "isabella-xv",
    title: "Vintage Quinceanera",
    name: "Isabella Cordero",
    tag: "Haute Couture XV",
    badge: "Film Gallery",
    desc: "Interactive photo-strip-style gallery, dusty pink tones, and detailed event timeline.",
    image: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
  },
  {
    slug: "emma-and-lucas",
    title: "Fairytale Castle",
    name: "Emma & Lucas",
    tag: "Gala Weddings",
    badge: "Imperial Wedding",
    desc: "Custom monograms for the couple, pearl ivory tones, and black-tie wedding design.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "quince-rosado",
    title: "Sweet Fifteen in Pink",
    name: "Magdalena",
    tag: "Princess Quinceañera",
    badge: "Floral Edition",
    desc: "Romantic floral design, court of honor presentation, and special section for the family waltz.",
    image: "/assets/template-quince-rosado/da616fa36a10f18a133b2dc0383a07d0.webp",
  },

  // Row 2
  {
    slug: "elsy-xv",
    title: "Royal Pink",
    name: "Elsy",
    tag: "Classic Quinceañera",
    badge: "Royal Princess",
    desc: "Interactive virtual envelope opening, live countdown, and automatic confirmation form.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "sofia-y-alejandro",
    title: "Our Wedding",
    name: "Sofía & Alejandro",
    tag: "Traditional Wedding",
    badge: "Hacienda Romance",
    desc: "Satellite location with direct navigation to the venue, reception itinerary, and table management.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
];

export default async function DemosIndexPage() {
  // La portada elegida en el editor (DB) es la que se muestra en el catálogo.
  // Sin DB o sin fila: se usa la imagen fija de cada tarjeta.
  let cards = DEMO_CARDS;
  try {
    const rows: any[] = await (prisma as any).masterTemplate.findMany({
      select: { slug: true, fotoPortadaUrl: true },
    });
    const bySlug = new Map(rows.map((r) => [r.slug, r.fotoPortadaUrl]));
    cards = DEMO_CARDS.map((card) => {
      const base: any = (ALL_SYSTEM_DEMOS as any)[card.slug];
      const initial = base
        ? INITIAL_MASTER_TEMPLATES.find((t) => t.estiloPlantilla === base.estiloPlantilla)
        : undefined;
      const portada = initial ? bySlug.get(initial.slug) : undefined;
      return portada ? { ...card, image: portada } : card;
    });
  } catch {}
  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#2B0A18] py-16 px-4 font-['Montserrat']">
      <div className="max-w-6xl mx-auto">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Click and Love" className="w-11 h-11 object-contain" />
            <span className="flex items-baseline whitespace-nowrap">
              <span className="font-['Montserrat'] font-extrabold text-[22px] tracking-tight text-[#2B0A18]">
                Click
              </span>
              <span className="font-vibes text-[30px] leading-none text-[#C2185B] ml-1.5">and Love</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7A002A]/40 bg-white mb-0 text-[#7A002A] font-['Cinzel'] text-xs font-bold uppercase tracking-widest hover:brightness-105"
            >
              ← Back to Click & Love
            </Link>
            <Link
              href="/es/demo"
              className="text-xs font-['Montserrat'] font-bold text-[#7A002A] underline-offset-2 hover:underline"
            >
              Ver catálogo en español →
            </Link>
          </div>
          <h1 className="font-['Cinzel'] text-4xl sm:text-5xl font-bold tracking-tight text-[#2B0A18] mb-3">
            Interactive Collections Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#5E534C] leading-relaxed max-w-xl mx-auto">
            Try the real experience of each design: virtual envelope opening, synchronized ambient music,
            countdown, and real-time RSVP confirmation.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.slug}
              className="bg-white border border-[#E7DCC8] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(44,31,27,0.06)] hover:border-[#7A002A] flex flex-col justify-between transition-all duration-300 group"
            >
              {/* Image with uniform badge */}
              <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-[9px] font-['Cinzel'] uppercase tracking-wider bg-white/95 text-[#7A002A] font-bold shadow-xs border border-[#E7DCC8] backdrop-blur-md">
                    {card.tag}
                  </span>
                </div>
              </div>

              {/* Descriptive content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Cinzel'] text-base font-bold text-[#2B0A18] mb-1 line-clamp-1">
                    {card.title}
                  </h3>
                  <div className="text-[11px] font-['Montserrat'] text-[#C2185B] font-semibold mb-2">
                    {card.name}
                  </div>
                  <p className="text-xs text-[#5E534C] leading-relaxed mb-5 min-h-[48px]">
                    {card.desc}
                  </p>
                </div>

                {/* CRO button: View interactive example */}
                <Link
                  href={`/demo/${card.slug}`}
                  target="_blank"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#7A002A] hover:brightness-110 active:scale-95 text-white font-['Cinzel'] text-[10px] tracking-wider uppercase font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>View interactive example</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                {/* Semana 2: contacto directo desde el catálogo */}
                <Link
                  href={`sms:+18182994882?&body=${encodeURIComponent(`Hi, I saw the ${card.title} template and I want it for my event`)}`}
                  className="w-full mt-2 py-2.5 px-3 rounded-xl border border-[#7A002A] bg-white text-[#7A002A] hover:brightness-105 active:scale-95 font-['Cinzel'] text-[10px] tracking-wider uppercase font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>I want this template</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
