import Link from "next/link";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { ALL_SYSTEM_DEMOS } from "@/lib/demo-data";

export const metadata = {
  title: "Catálogo de Demos Interactivas | Click & Love",
  description: "Explora nuestras 8+ colecciones interactivas con sobre 3D, música y confirmación RSVP.",
};

const DEMO_CARDS = [
  {
    slug: "mariposas-xv",
    title: "Blue Butterfly Garden",
    name: "Valeria Morales",
    tag: "XV Años & Gala",
    badge: "Más Solicitada",
    desc: "Acuarela celeste, mariposas etéreas 3D, destellos de oro y sobre con sello azul.",
    image: "/assets/template-butterfly/foto-columpio-portada.png",
  },
  {
    slug: "isabella-xv",
    title: "Blush Rose Filmstrip",
    name: "Isabella Cordero",
    tag: "Alta Costura XV",
    badge: "Canva T1",
    desc: "Rosa empolvado, oro champán, tira fotográfica de celuloide e itinerario por fases.",
    image: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
  },
  {
    slug: "emma-and-lucas",
    title: "Fairytale Château",
    name: "Emma & Lucas",
    tag: "Bodas de Gala",
    badge: "Canva T2",
    desc: "Boda en castillo, estética marfil perla, monogramas entrelazados y suites.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "quince-rosado",
    title: "Quince Rosado",
    name: "Magdalena",
    tag: "XV Años Princesa",
    badge: "Canva Réplica",
    desc: "Arco floral con princesa a caballo, vestido rosa de gala, corte de honor y vals.",
    image: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
  },
  {
    slug: "elsy-xv",
    title: "Princesa Rosa Clásica",
    name: "Elsy",
    tag: "XV Años Clásica",
    badge: "Clásica Imperial",
    desc: "Sobre 3D tradicional, cuenta regresiva, protocolo familiar y confirmación.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "coraline-party",
    title: "Coraline Other World",
    name: "Valeria's Secret",
    tag: "Temática de Autor",
    badge: "Canva T4",
    desc: "Mística exclusiva con puerta secreta, llave dorada y dress code amarillo/azul.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "esmeralda-royal",
    title: "Esmeralda Royal",
    name: "Renata Villarreal",
    tag: "Gala Nocturna",
    badge: "Alta Gala",
    desc: "Verde esmeralda y oro real profundo para celebraciones de noche de etiqueta.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "sofia-y-alejandro",
    title: "Clásica Imperial",
    name: "Sofía & Alejandro",
    tag: "Boda Tradicional",
    badge: "Hacienda Romance",
    desc: "Gala nupcial en hacienda tradicional con itinerario, mapa y vals de honor.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
];

export default function DemosIndexPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1F1B] py-16 px-4 font-['Montserrat']">
      <div className="max-w-6xl mx-auto">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-4 text-[#2C1F1B] font-['Cinzel'] text-xs font-bold uppercase tracking-widest hover:brightness-105"
          >
            ← Volver a Click & Love
          </Link>
          <h1 className="font-['Cinzel'] text-4xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
            Catálogo de Demos Interactivas
          </h1>
          <p className="text-xs sm:text-sm text-[#5E534C] leading-relaxed max-w-xl mx-auto">
            Prueba el flujo completo de cada plantilla: apertura de sobre 3D, música envolvente,
            cuenta regresiva y confirmación digital en tiempo real.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEMO_CARDS.map((card) => (
            <div
              key={card.slug}
              className="bg-white border border-[#E8E3D9] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(44,31,27,0.06)] hover:border-[#C5A059] flex flex-col justify-between transition-all duration-300 group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-['Cinzel'] uppercase tracking-wider bg-white/95 text-[#2C1F1B] font-bold shadow-sm border border-[#E8E3D9]">
                    {card.tag}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Cinzel'] text-base font-bold text-[#2C1F1B] mb-0.5">
                    {card.title}
                  </h3>
                  <div className="text-[11px] font-['Montserrat'] text-[#C5A059] font-semibold mb-2">
                    {card.name}
                  </div>
                  <p className="text-xs text-[#5E534C] leading-relaxed mb-4">
                    {card.desc}
                  </p>
                </div>

                <Link
                  href={`/demo/${card.slug}`}
                  target="_blank"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-['Cinzel'] text-[10px] tracking-wider uppercase font-bold hover:brightness-105 active:scale-95 transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Probar Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
