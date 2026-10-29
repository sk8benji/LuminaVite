"use client";

import React, { useState } from "react";
import {
  Palette,
  Sparkles,
  Check,
  Eye,
  Crown,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TEMPLATES, TemplateId } from "@/lib/templates";

export interface TemplatePickerItem {
  id: TemplateId;
  name: string;
  categoria: "QUINCEANERA" | "BODA" | "CUMPLEANOS" | "UNIVERSAL";
  badgeLabel: string;
  thumbnail: string;
  description: string;
  demoSlug: string;
  dots: string[];
  features: string[];
  destacada?: boolean;
}

export const TEMPLATE_CATALOG: TemplatePickerItem[] = [
  {
    id: "QUINCE_ROSADO",
    name: "Quince Rosado (Magdalena)",
    categoria: "QUINCEANERA",
    badgeLabel: "Más Popular",
    thumbnail: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.webp",
    description: "Sobre 3D interactivo con lazo de seda y rosas, arco floral de princesa, medallón formal de fecha y 14 bloques modulares.",
    demoSlug: "quince-rosado",
    dots: ["#FFF9F9", "#E8A598", "#7A002A"],
    features: ["Sobre 3D con Lazo", "Música de Fondo", "Línea de Tiempo", "Dress Code", "RSVP en Vivo"],
    destacada: true,
  },
  {
    id: "BLUE_BUTTERFLY",
    name: "Jardín de Mariposas Celestes",
    categoria: "QUINCEANERA",
    badgeLabel: "Efecto Mariposas",
    thumbnail: "/assets/template-butterfly/foto-columpio-portada.webp",
    description: "Animación de mariposas celestiales flotantes en CSS, sobre 3D azul noche con sello dorado, carta emotiva e itinerario de cuento.",
    demoSlug: "mariposas-xv",
    dots: ["#F0F8FF", "#87CEEB", "#1E3A5F"],
    features: ["Mariposas Flotantes", "Sobre 3D Azul Noche", "Vals en Piano", "Bilingüe interactivo"],
    destacada: true,
  },
  {
    id: "BABY_BLUE",
    name: "Baby Blue (Azul Bebé y Plata)",
    categoria: "QUINCEANERA",
    badgeLabel: "Nuevo - Replica Canva",
    thumbnail: "/assets/template-baby-blue/foto-gazebo.webp",
    description: "Replica del Baby Blue Quinceañera de Studio Eburnean: portada con sobre azul y paloma, marco ovalo de plata, cuenta regresiva azul marino, postal de la misa, programa, wish list, carta, contacto y preguntas frecuentes.",
    demoSlug: "baby-blue-xv",
    dots: ["#FDFCF8", "#A9C8E2", "#2E5A88"],
    features: ["Portada con Sobre", "Marco de Plata", "Postal de la Misa", "Carta y FAQ"],
    destacada: true,
  },
  {
    id: "MISS_15",
    name: "Miss 15 Años (Crema y Cobre)",
    categoria: "QUINCEANERA",
    badgeLabel: "Nuevo - Replica Canva",
    thumbnail: "/assets/template-miss15/foto-columpio.webp",
    description: "Replica del Miss 15 Años de Canva: abre directo en la tarjeta sobre la foto del columpio, reproductor de musica, corte de honor completa con fotos, programa con iconos y RSVP en letras outline con mono.",
    demoSlug: "miss-15-xv",
    dots: ["#F6EEE1", "#C9A24B", "#2B2118"],
    features: ["Sin Sobre - Directa", "Reproductor de Musica", "Corte de Honor", "Letras Outline RSVP"],
    destacada: true,
  },
  {
    id: "QUINCE_ERA_PINK",
    name: "Quince Era Pink (Rosa Pastel)",
    categoria: "QUINCEANERA",
    badgeLabel: "Nuevo - Replica Canva",
    thumbnail: "/assets/template-era-pink/foto-retrato.webp",
    description: "Replica del 8 Quinceañera Pink de The Hanger PH: portada simple con sello, hero a foto completa al atardecer, programa con iconos ilustrados, detalles con paleta pastel y botones de borde punteado.",
    demoSlug: "era-pink-xv",
    dots: ["#F9E7EA", "#D98CA6", "#A63D57"],
    features: ["Hero a Foto Completa", "Programa Ilustrado", "Botones Punteados", "Save the Date"],
    destacada: true,
  },
  {
    id: "BLUSH_PRINCESS",
    name: "Blush Princess (Princesa Rosa y Oro)",
    categoria: "QUINCEANERA",
    badgeLabel: "Nuevo - Replica Canva",
    thumbnail: "/assets/template-blush/foto-1.webp",
    description: "Replica del Blush Quinceañera de CouCou: sobre rosa con mono y sello de corona, marco de monograma dorado, polaroids Then/Now, corte de honor completa y cuenta regresiva.",
    demoSlug: "blush-princess-xv",
    dots: ["#FDF3F5", "#EFC3D0", "#B08D3C"],
    features: ["Sobre con Mono y Sello", "Musica Circular", "Corte de Honor", "Bilingue interactivo"],
    destacada: true,
  },
  {
    id: "ELEGANT_ROSE",
    name: "Elegant Rose (Isabella)",
    categoria: "QUINCEANERA",
    badgeLabel: "Bilingüe (EN/ES)",
    thumbnail: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
    description: "Diseño cinematográfico bilingüe inglés/español, video embed YouTube, línea de tiempo 'Growing Up' con fotos de cada año y wishlist.",
    demoSlug: "isabella-xv",
    dots: ["#FFF5F6", "#DDA7A5", "#5A3E44"],
    features: ["Bilingüe EN / ES", "Video YouTube", "Timeline Fotos por Año", "Wishlist Externa"],
    destacada: true,
  },
  {
    id: "FAIRYTALE_CHATEAU",
    name: "Fairytale Château (Boda Real)",
    categoria: "BODA",
    badgeLabel: "Boda de Ensueño",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    description: "Boda de lujo en castillo europeo, sobre verde esmeralda con sello de cera dorado, suites de hotel, shuttle y registro de mesa.",
    demoSlug: "emma-and-lucas",
    dots: ["#FBF5EB", "#D4AF37", "#19223D"],
    features: ["Sello de Cera Dorado", "Hospedaje de Hotel", "Servicio Shuttle", "Mesa de Regalos"],
    destacada: true,
  },
  {
    id: "PRINCESA_ROSA",
    name: "Princesa Rosa (Clásica Elsy)",
    categoria: "QUINCEANERA",
    badgeLabel: "Clásica XV",
    thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    description: "Réplica clásica con sobre 3D rosa pastel, cuenta regresiva, placa de fecha, 13 bloques modulares completos y RSVP interactivo.",
    demoSlug: "elsy-xv",
    dots: ["#FFF9FA", "#D4A59A", "#5A3E44"],
    features: ["Sobre Rosa Pastel", "Cuenta Regresiva", "13 Secciones", "Lluvia de Sobres"],
  },
  {
    id: "CORALINE_MYSTICAL",
    name: "El Otro Mundo Místico (Coraline)",
    categoria: "CUMPLEANOS",
    badgeLabel: "Temática Especial",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    description: "Atmósfera mágica y gótica con sobre azul noche, puerta secreta, llave dorada, botón de nácar y animación de misterio.",
    demoSlug: "coraline-party",
    dots: ["#0A1956", "#FFD700", "#3A0443"],
    features: ["Puerta Secreta", "Efectos Góticos", "Llave Dorada", "Playlist Mística"],
  },
  {
    id: "CLASICA_IMPERIAL",
    name: "Clásica Imperial (Bodas & Galas)",
    categoria: "BODA",
    badgeLabel: "Bodas de Gala",
    thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    description: "Diseño sobrio y señorial con tipografía romana clásica, acentos en oro pulido y fondo aperlado minimalista para bodas y galas.",
    demoSlug: "sofia-y-alejandro",
    dots: ["#FBFBF9", "#BFA15F", "#1A1A1A"],
    features: ["Oro Pulido", "Tipografía Romana", "Diseño Sobrio", "RSVP Estricto"],
  },
  {
    id: "ESMERALDA_ROYAL",
    name: "Esmeralda Royal (Etiqueta Rigurosa)",
    categoria: "UNIVERSAL",
    badgeLabel: "Gala Nocturna",
    thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    description: "Elegancia nocturna con fondo verde esmeralda oscuro, detalles en oro brillante y acabados de lujo para recepciones de gala.",
    demoSlug: "esmeralda-royal",
    dots: ["#061A10", "#E5C158", "#143C28"],
    features: ["Verde Esmeralda", "Fondo Nocturno", "Dress Code Black Tie", "Música de Gala"],
  },
  {
    id: "JARDIN_BOTANICA",
    name: "Jardín Botánica (Boho Chic)",
    categoria: "UNIVERSAL",
    badgeLabel: "Romántica / Boho",
    thumbnail: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
    description: "Hojas de eucalipto, tonos salvia y diseño campestre elegante para celebraciones al aire libre y bodas de jardín.",
    demoSlug: "jardin-botanica",
    dots: ["#F7F6F2", "#8A9A86", "#4E614C"],
    features: ["Botánica & Hojas", "Estilo Boho Chic", "Tonos Salvia", "Recepción Jardín"],
  },
  {
    id: "MINIMALISTA_EDITORIAL",
    name: "Minimalista Editorial (Vogue)",
    categoria: "UNIVERSAL",
    badgeLabel: "Modern Editorial",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    description: "Estética contemporánea en blanco y negro con tipografía de revista de moda, espaciado generoso y fotografía protagonista.",
    demoSlug: "minimalista-editorial",
    dots: ["#FFFFFF", "#222222", "#666666"],
    features: ["Blanco & Negro", "Estilo Revista", "Fotos Verticales", "Minimalismo Puro"],
  },
];

interface TemplatePickerGridProps {
  currentTemplateId: string;
  onSelectTemplate: (templateId: TemplateId) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}

// La foto va ARRIBA y el nombre SIEMPRE como título debajo (nunca superpuesto),
// así la plantilla se identifica aunque la foto falle. Si la foto no carga,
// se muestra un bloque con el nombre en grande en vez de una imagen rota.
function TemplateCardImage({ tpl }: { tpl: TemplatePickerItem }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="h-52 bg-gradient-to-br from-[#3D0A1C] via-[#7A002A] to-[#3D0A1C] flex flex-col items-center justify-center text-white p-4 text-center">
        <span className="font-serif font-bold text-lg leading-snug">{tpl.name}</span>
        <span className="text-[11px] text-white/70 mt-2">Vista previa no disponible</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tpl.thumbnail}
      alt={tpl.name}
      loading="lazy"
      decoding="async"
      className="w-full h-52 object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function TemplatePickerGrid({
  currentTemplateId,
  onSelectTemplate,
  expanded,
  onToggleExpanded,
}: TemplatePickerGridProps) {
  const [filter, setFilter] = useState<"ALL" | "QUINCEANERA" | "BODA" | "CUMPLEANOS">("ALL");

  const counts = {
    QUINCEANERA: TEMPLATE_CATALOG.filter((t) => t.categoria === "QUINCEANERA").length,
    BODA: TEMPLATE_CATALOG.filter((t) => t.categoria === "BODA").length,
    CUMPLEANOS: TEMPLATE_CATALOG.filter(
      (t) => t.categoria === "CUMPLEANOS" || t.categoria === "UNIVERSAL"
    ).length,
  };

  const filteredTemplates = TEMPLATE_CATALOG.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "QUINCEANERA") return item.categoria === "QUINCEANERA";
    if (filter === "BODA") return item.categoria === "BODA";
    if (filter === "CUMPLEANOS") return item.categoria === "CUMPLEANOS" || item.categoria === "UNIVERSAL";
    return true;
  });

  const current = TEMPLATE_CATALOG.find((t) => t.id === currentTemplateId);

  return (
    <section className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Barra siempre visible: plantilla actual + mostrar/ocultar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-[#3D0A1C] to-stone-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold font-serif tracking-tight flex items-center gap-2 flex-wrap">
              <span>Elige la plantilla de tu invitación</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                {TEMPLATE_CATALOG.length} Diseños
              </span>
            </h2>
            <p className="text-xs text-stone-300 mt-0.5 truncate">
              Plantilla actual: <strong className="text-white">{current?.name || currentTemplateId}</strong>
              <span className="text-stone-400"> · Puedes cambiarla en cualquier momento sin perder tus datos.</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleExpanded}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer shrink-0"
        >
          {expanded ? (
            <>
              Ocultar plantillas <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Cambiar plantilla <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {expanded && (
        <>
          {/* Filtros por categoría */}
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                filter === "ALL"
                  ? "bg-[#7A002A] text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-200/60 border border-stone-200"
              }`}
            >
              ✨ Todas ({TEMPLATE_CATALOG.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("QUINCEANERA")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filter === "QUINCEANERA"
                  ? "bg-[#7A002A] text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-200/60 border border-stone-200"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Mis XV Años ({counts.QUINCEANERA})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter("BODA")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filter === "BODA"
                  ? "bg-[#7A002A] text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-200/60 border border-stone-200"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Bodas & Matrimonios ({counts.BODA})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter("CUMPLEANOS")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filter === "CUMPLEANOS"
                  ? "bg-[#7A002A] text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-200/60 border border-stone-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Temáticas & Galas ({counts.CUMPLEANOS})</span>
            </button>
            <span className="text-xs text-stone-400 font-medium ml-auto hidden sm:inline">
              Haz clic en <strong>&quot;Elegir esta Plantilla&quot;</strong> para aplicarla
            </span>
          </div>

          {/* Grid de plantillas (sin popup, sin scroll interno) */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTemplates.map((tpl) => {
              const isCurrent = currentTemplateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  className={`rounded-2xl border-2 transition-all flex flex-col overflow-hidden bg-white ${
                    isCurrent
                      ? "border-[#7A002A] ring-2 ring-[#7A002A]/20 shadow-lg"
                      : "border-stone-200 hover:border-stone-300 hover:shadow-md"
                  }`}
                >
                  <TemplateCardImage tpl={tpl} />

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-base leading-snug text-stone-900">
                        {tpl.name}
                      </h3>
                      {isCurrent && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7A002A] text-white flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Activa
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-stone-100 text-stone-700 border border-stone-200">
                        {tpl.categoria === "QUINCEANERA"
                          ? "👑 XV Años"
                          : tpl.categoria === "BODA"
                          ? "💍 Boda"
                          : "✨ Temática"}
                      </span>
                      {tpl.badgeLabel && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7A002A]/10 text-[#7A002A] border border-[#7A002A]/20">
                          {tpl.badgeLabel}
                        </span>
                      )}
                      {tpl.dots.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mt-2 line-clamp-2">
                      {tpl.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tpl.features.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                      <a
                        href={`https://clickandlove.app/demo/${tpl.demoSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition flex items-center gap-1 cursor-pointer"
                        title="Ver invitación en vivo"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Demo</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onSelectTemplate(tpl.id)}
                        className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isCurrent
                            ? "bg-stone-900 hover:bg-stone-800 text-white"
                            : "bg-[#7A002A] hover:bg-[#5e0020] text-white"
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Plantilla Seleccionada</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Elegir esta Plantilla</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="px-5 pb-5 text-xs text-stone-500">
            ¿No estás segura? Puedes cambiar de plantilla en cualquier momento sin perder los datos que hayas llenado.
          </p>
        </>
      )}
    </section>
  );
}
