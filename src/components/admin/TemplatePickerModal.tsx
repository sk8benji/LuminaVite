"use client";

import React, { useState } from "react";
import {
  X,
  Palette,
  Sparkles,
  Check,
  ExternalLink,
  Crown,
  Heart,
  Music,
  Eye,
  Filter,
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
    thumbnail: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
    description: "Sobre 3D interactivo con lazo de seda y rosas, arco floral de princesa, medallón formal de fecha y 14 bloques modulares.",
    demoSlug: "mariposas-xv",
    dots: ["#FFF9F9", "#E8A598", "#7A002A"],
    features: ["Sobre 3D con Lazo", "Música de Fondo", "Línea de Tiempo", "Dress Code", "RSVP en Vivo"],
    destacada: true,
  },
  {
    id: "BLUE_BUTTERFLY",
    name: "Jardín de Mariposas Celestes",
    categoria: "QUINCEANERA",
    badgeLabel: "Efecto Mariposas",
    thumbnail: "/assets/template-butterfly/foto-columpio-portada.png",
    description: "Animación de mariposas celestiales flotantes en CSS, sobre 3D azul noche con sello dorado, carta emotiva e itinerario de cuento.",
    demoSlug: "mariposas-xv",
    dots: ["#F0F8FF", "#87CEEB", "#1E3A5F"],
    features: ["Mariposas Flotantes", "Sobre 3D Azul Noche", "Vals en Piano", "Bilingüe interactivo"],
    destacada: true,
  },
  {
    id: "ELEGANT_ROSE",
    name: "Elegant Rose (Isabella)",
    categoria: "QUINCEANERA",
    badgeLabel: "Bilingüe (EN/ES)",
    thumbnail: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
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
    thumbnail: "/assets/template-chateau/castle-facade.jpg",
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
    demoSlug: "coraline-mystical",
    dots: ["#0A1956", "#FFD700", "#3A0443"],
    features: ["Puerta Secreta", "Efectos Góticos", "Llave Dorada", "Playlist Mística"],
  },
  {
    id: "CLASICA_IMPERIAL",
    name: "Clásica Imperial (Bodas & Galas)",
    categoria: "BODA",
    badgeLabel: "Bodas de Gala",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    description: "Diseño sobrio y señorial con tipografía romana clásica, acentos en oro pulido y fondo aperlado minimalista para bodas y galas.",
    demoSlug: "emma-and-lucas",
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
    demoSlug: "mariposas-xv",
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
    demoSlug: "isabella-xv",
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
    demoSlug: "elsy-xv",
    dots: ["#FFFFFF", "#222222", "#666666"],
    features: ["Blanco & Negro", "Estilo Revista", "Fotos Verticales", "Minimalismo Puro"],
  },
];

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onSelectTemplate: (templateId: TemplateId) => void;
  isInitialSelection?: boolean;
}

export default function TemplatePickerModal({
  isOpen,
  onClose,
  currentTemplateId,
  onSelectTemplate,
  isInitialSelection = false,
}: TemplatePickerModalProps) {
  const [filter, setFilter] = useState<"ALL" | "QUINCEANERA" | "BODA" | "CUMPLEANOS">("ALL");

  if (!isOpen) return null;

  const filteredTemplates = TEMPLATE_CATALOG.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "QUINCEANERA") return item.categoria === "QUINCEANERA";
    if (filter === "BODA") return item.categoria === "BODA";
    if (filter === "CUMPLEANOS") return item.categoria === "CUMPLEANOS" || item.categoria === "UNIVERSAL";
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isInitialSelection) {
          onClose();
        }
      }}
    >
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-[#3D0A1C] to-stone-900 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-300">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif tracking-tight flex items-center gap-2">
                <span>Elige la Plantilla de tu Invitación</span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  {TEMPLATE_CATALOG.length} Diseños
                </span>
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                Selecciona el estilo visual que mejor se adapte a tu evento. Puedes cambiar de plantilla en cualquier momento.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Filtros por Categoría */}
        <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
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
              <Crown className="w-3.5 h-3.5 text-pink-500" />
              <span>Mis XV Años (4)</span>
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
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Bodas & Matrimonios (2)</span>
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
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Temáticas & Galas (4)</span>
            </button>
          </div>

          <span className="text-xs text-stone-400 font-medium hidden sm:inline">
            Haz clic en <strong>&quot;Elegir Plantilla&quot;</strong> para cargarla en el editor
          </span>
        </div>

        {/* Grid de Plantillas con Scroll */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => {
            const isCurrent = currentTemplateId === tpl.id;

            return (
              <div
                key={tpl.id}
                className={`group rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden bg-white ${
                  isCurrent
                    ? "border-[#7A002A] ring-2 ring-[#7A002A]/20 shadow-lg"
                    : "border-stone-200 hover:border-pink-300 hover:shadow-md"
                }`}
              >
                {/* Portada / Thumbnail */}
                <div className="relative h-48 bg-stone-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Badges superiores */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 text-stone-900 shadow-xs">
                      {tpl.categoria === "QUINCEANERA"
                        ? "👑 XV Años"
                        : tpl.categoria === "BODA"
                        ? "💍 Boda"
                        : "✨ Temática"}
                    </span>
                    {tpl.badgeLabel && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7A002A] text-white shadow-xs">
                        {tpl.badgeLabel}
                      </span>
                    )}
                  </div>

                  {isCurrent && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3" />
                      <span>Activa</span>
                    </div>
                  )}

                  {/* Título sobre el thumbnail */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif font-bold text-base leading-snug drop-shadow-md">
                      {tpl.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {tpl.dots.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contenido / Descripción y Features */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>

                    {/* Chips de características */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tpl.features.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                    <a
                      href={`/demo/${tpl.demoSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition flex items-center gap-1 cursor-pointer"
                      title="Ver invitación en vivo con música"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Demo</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectTemplate(tpl.id);
                        onClose();
                      }}
                      className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        isCurrent
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
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
                          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
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

        {/* Footer del Modal */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-stone-500">
            ¿No estás segura? Puedes cambiar de plantilla en cualquier momento sin perder los datos que hayas llenado.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200 transition cursor-pointer"
          >
            Continuar editando
          </button>
        </div>
      </div>
    </div>
  );
}
