import Link from "next/link";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Catálogo de Colecciones Interactivas | Click & Love",
  description: "Explora nuestras 8+ colecciones interactivas con sobre virtual 3D, música y confirmación RSVP.",
};

const DEMO_CARDS = [
  // Fila 1
  {
    slug: "mariposas-xv",
    title: "Jardín de Mariposas Celestes",
    name: "Valeria Morales",
    tag: "XV Años & Gala",
    badge: "Más Solicitada",
    desc: "Efecto de mariposas 3D, sobre virtual con sello lacrado y tonos celestes con detalles dorados.",
    image: "/assets/template-butterfly/foto-columpio-portada.webp",
  },
  {
    slug: "baby-blue-xv",
    title: "Baby Blue - Azul Bebé y Plata",
    tag: "XV Años & Gala",
    desc: "Portada con sobre azul y paloma, marco ovalo de plata con foto, cuenta regresiva azul marino, postal de la misa, carta y preguntas frecuentes.",
    image: "/assets/template-baby-blue/foto-gazebo.webp",
    badge: "Baby Blue T7",
  },
  {
    slug: "miss-15-xv",
    title: "Miss 15 Años - Crema y Cobre",
    tag: "XV Años & Gala",
    desc: "Directa sin sobre: tarjeta sobre la foto del columpio, reproductor de musica, corte de honor completa y RSVP en letras outline con mono.",
    image: "/assets/template-miss15/foto-columpio.webp",
    badge: "Miss 15 T8",
  },
  {
    slug: "era-pink-xv",
    title: "Quince Era Pink - Rosa Pastel",
    tag: "XV Años & Gala",
    desc: "Portada simple con sello de cera, hero a foto completa al atardecer, programa ilustrado y detalles en rosa pastel con botones punteados.",
    image: "/assets/template-era-pink/foto-retrato.webp",
    badge: "The Hanger T6",
  },
  {
    slug: "blush-princess-xv",
    title: "Blush Princess - Princesa Rosa y Oro",
    name: "Isabella Sofia",
    tag: "XV Años & Gala",
    badge: "Nueva",
    desc: "Replica del diseno Canva de CouCou: sobre rosa con mono y sello de corona, monograma dorado, fotos Then/Now y corte de honor completa.",
    image: "/assets/template-blush/foto-1.webp",
  },
  {
    slug: "isabella-xv",
    title: "Romance Vintage en Película",
    name: "Isabella Cordero",
    tag: "Alta Costura XV",
    badge: "Galería Film",
    desc: "Galería interactiva estilo tira de fotos, tonos rosa empolvado y cronograma detallado del evento.",
    image: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
  },
  {
    slug: "emma-and-lucas",
    title: "Castillo de Cuento de Hadas",
    name: "Emma & Lucas",
    tag: "Bodas de Gala",
    badge: "Boda Imperial",
    desc: "Monogramas personalizados para los novios, tonos marfil perla y diseño para bodas de etiqueta.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "quince-rosado",
    title: "Dulces Quince en Rosa",
    name: "Magdalena",
    tag: "XV Años Princesa",
    badge: "Edición Floral",
    desc: "Diseño floral romántico, presentación de corte de honor y sección especial para el vals familiar.",
    image: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.webp",
  },

  // Fila 2
  {
    slug: "elsy-xv",
    title: "Corona Real Rosa",
    name: "Elsy",
    tag: "XV Años Clásica",
    badge: "Princesa Real",
    desc: "Apertura de sobre virtual interactivo, cuenta regresiva en vivo y formulario de confirmación automática.",
    image: "/assets/template-rose/722d78548334333072ad7200e4f8233e.webp",
  },
  {
    slug: "coraline-party",
    title: "Noche Secreta de Coraline",
    name: "Valeria's Secret",
    tag: "Temática de Autor",
    badge: "Mística & Misterio",
    desc: "Animación de puerta secreta con llave dorada, código de vestimenta guiado y música temática de fondo.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "esmeralda-royal",
    title: "Gala Verde Esmeralda",
    name: "Renata Villarreal",
    tag: "Gala Nocturna",
    badge: "Esmeralda & Oro",
    desc: "Fondo verde esmeralda con acabados en pan de oro, ideal para recepciones nocturnas y cenas de gala.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "sofia-y-alejandro",
    title: "Boda Imperial en Hacienda",
    name: "Sofía & Alejandro",
    tag: "Boda Tradicional",
    badge: "Hacienda Romance",
    desc: "Ubicación satelital con navegación directa al recinto, itinerario de recepción y control de mesas.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
];

export default function DemosIndexPageEs() {
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
              href="/es"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7A002A]/40 bg-white mb-0 text-[#7A002A] font-['Cinzel'] text-xs font-bold uppercase tracking-widest hover:brightness-105"
            >
              ← Volver a Click & Love
            </Link>
            <Link
              href="/demo"
              className="text-xs font-['Montserrat'] font-bold text-[#7A002A] underline-offset-2 hover:underline"
            >
              View catalog in English →
            </Link>
          </div>
          <h1 className="font-['Cinzel'] text-4xl sm:text-5xl font-bold tracking-tight text-[#2B0A18] mb-3">
            Catálogo de Colecciones Interactivas
          </h1>
          <p className="text-xs sm:text-sm text-[#5E534C] leading-relaxed max-w-xl mx-auto">
            Prueba la experiencia real de cada diseño: apertura de sobre virtual, música ambiental sincronizada,
            cuenta regresiva y confirmación de asistencia en tiempo real.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEMO_CARDS.map((card) => (
            <div
              key={card.slug}
              className="bg-white border border-[#E7DCC8] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(44,31,27,0.06)] hover:border-[#7A002A] flex flex-col justify-between transition-all duration-300 group"
            >
              {/* Imagen con badge homogéneo */}
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

              {/* Contenido descriptivo en español neutro */}
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

                {/* Botón CRO: Ver ejemplo interactivo */}
                <Link
                  href={`/demo/${card.slug}`}
                  target="_blank"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#7A002A] hover:brightness-110 active:scale-95 text-white font-['Cinzel'] text-[10px] tracking-wider uppercase font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Ver ejemplo interactivo</span>
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
