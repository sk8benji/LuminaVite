"use client";

import React, { useState, useEffect } from "react";
import { X, ExternalLink, Sparkles, ArrowRight, Check } from "lucide-react";
import { Language } from "@/lib/home-translations";

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug?: string;
  lang: Language;
}

interface DemoItem {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  icon: string;
}

const DEMO_ITEMS: DemoItem[] = [
  {
    slug: "mariposas-xv",
    title: "Jardín de Mariposas Celestes",
    shortTitle: "Mariposas Celestes",
    category: "XV Años & Gala",
    icon: "🦋",
  },
  {
    slug: "blush-princess-xv",
    title: "Blush Princess - Princesa Rosa y Oro",
    shortTitle: "Blush Princess",
    category: "XV Años & Gala",
    icon: "\U0001F451",
  },
  {
    slug: "isabella-xv",
    title: "Romance Vintage en Película",
    shortTitle: "Romance Vintage",
    category: "Alta Costura XV",
    icon: "🎞️",
  },
  {
    slug: "emma-and-lucas",
    title: "Castillo de Cuento de Hadas",
    shortTitle: "Castillo de Hadas",
    category: "Bodas Exclusivas",
    icon: "🏰",
  },
  {
    slug: "quince-rosado",
    title: "Cuento de Princesa",
    shortTitle: "Cuento de Princesa",
    category: "Quinceañera Clásica",
    icon: "👑",
  },
  {
    slug: "coraline-party",
    title: "Mundo Fantasía & Misterio",
    shortTitle: "Mundo Fantasía",
    category: "Fiesta Temática",
    icon: "🗝️",
  },
];

export default function InteractiveDemoModal({
  isOpen,
  onClose,
  initialSlug = "mariposas-xv",
  lang,
}: InteractiveDemoModalProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  // Bloquear scroll del fondo cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Redirigir a precios cerrando el modal
  const handleSelectPlan = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById("precios");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  const activeDemo = DEMO_ITEMS.find((d) => d.slug === selectedSlug) || DEMO_ITEMS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/75 backdrop-blur-xl animate-fadeIn select-none">
      {/* Botón de Cierre Superior Flotante */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2C1F1B] transition-all border border-[#E8E3D9] shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Cerrar modal"
      >
        <X className="w-5 h-5 text-[#2C1F1B]" />
      </button>

      {/* Contenedor Principal del Modal (Adaptativo Desktop / Mobile) */}
      <div className="relative w-full max-w-5xl h-[96vh] sm:h-[92vh] max-h-[880px] bg-[#FAF8F5] border border-[#E8E3D9] rounded-3xl shadow-[0_25px_80px_rgba(44,31,27,0.3)] flex flex-col lg:flex-row overflow-hidden">
        
        {/* ============================================================== */}
        {/* HEADER MÓVIL (Visible únicamente en pantallas < lg) */}
        {/* ============================================================== */}
        <div className="lg:hidden p-3.5 bg-white border-b border-[#E8E3D9] flex flex-col gap-2.5 shrink-0">
          <div className="flex items-center justify-between pr-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-1">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span className="font-['Cinzel'] text-[9px] tracking-wider uppercase text-[#2C1F1B] font-bold">
                  {lang === "es" ? "Muestra Interactiva" : "Live Demo"}
                </span>
              </div>
              <h3 className="font-serif-roman text-base sm:text-lg font-bold text-[#2C1F1B] leading-tight">
                {lang === "es" ? "Así lo verán tus invitados" : "How your guests will see it"}
              </h3>
            </div>
          </div>

          {/* Carrusel Horizontal de Colecciones con Swipe Táctil */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-3.5 px-3.5">
            {DEMO_ITEMS.map((item) => {
              const isSelected = selectedSlug === item.slug;
              return (
                <button
                  key={item.slug}
                  onClick={() => setSelectedSlug(item.slug)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs font-['Montserrat'] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] border-[#C5A059] shadow-xs font-bold"
                      : "bg-[#FAF8F5] border-[#E8E3D9] text-[#5E534C] hover:text-[#2C1F1B]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="whitespace-nowrap">{item.shortTitle}</span>
                  {isSelected && <Check className="w-3 h-3 text-[#2C1F1B]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* PANEL LATERAL DESKTOP (Visible en lg y superior) */}
        {/* ============================================================== */}
        <div className="hidden lg:flex w-84 p-6 flex-col justify-between border-r border-[#E8E3D9] bg-white shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-[#2C1F1B] font-bold">
                {lang === "es" ? "Muestra Interactiva" : "Live Demo"}
              </span>
            </div>

            <h3 className="font-serif-roman text-2xl font-bold text-[#2C1F1B] tracking-tight mb-2 leading-tight">
              {lang === "es" ? "Así lo verán tus invitados" : "How your guests will see it"}
            </h3>

            <p className="font-['Montserrat'] text-xs text-[#5E534C] leading-relaxed mb-5 font-normal">
              {lang === "es"
                ? "Toca el sobre en la pantalla para abrir la invitación. Incluye música, mapa GPS y confirmación de pases."
                : "Tap the envelope to open the invitation. Includes music, GPS navigation, and guest RSVPs."}
            </p>

            {/* Lista Vertical de Colecciones con Nombres Comerciales Limpios */}
            <div className="space-y-2 mb-4">
              <span className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-[#8C6D2D] font-bold block mb-1.5">
                {lang === "es" ? "Selecciona un Diseño:" : "Select a Design:"}
              </span>

              {DEMO_ITEMS.map((item) => {
                const isSelected = selectedSlug === item.slug;
                return (
                  <button
                    key={item.slug}
                    onClick={() => setSelectedSlug(item.slug)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#F5EFE4] border-[#C5A059] text-[#2C1F1B] shadow-xs ring-1 ring-[#C5A059]/40"
                        : "bg-[#FAF8F5] border-[#E8E3D9] text-[#5E534C] hover:border-[#C5A059]/60 hover:text-[#2C1F1B]"
                    }`}
                  >
                    <div>
                      <div className="font-serif-roman text-sm font-bold text-[#2C1F1B] flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                      <div className="font-['Montserrat'] text-[10px] text-[#8C8077] pl-5 mt-0.5">
                        {item.category}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] shadow-xs shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Enlace al Catálogo Completo */}
            <div>
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-['Cinzel'] text-[#8C6D2D] hover:text-[#2C1F1B] font-bold flex items-center gap-1 transition-colors"
              >
                <span>{lang === "es" ? "✦ Explorar las 8+ colecciones en el catálogo" : "✦ View all 8+ collections in catalog"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Botones de Conversión en Desktop */}
          <div className="pt-4 border-t border-[#E8E3D9] space-y-2.5">
            {/* BOTÓN PRINCIPAL DORADO SÓLIDO */}
            <button
              onClick={handleSelectPlan}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#B38D40] text-[#1A1A1A] font-['Cinzel'] text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition shadow-[0_8px_20px_rgba(197,160,89,0.35)] cursor-pointer"
            >
              <span>{lang === "es" ? "Quiero esta invitación ($99)" : "I want this invitation ($99)"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
            </button>

            {/* BOTÓN SECUNDARIO SUTIL */}
            <a
              href={`/demo/${selectedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-[#5E534C] hover:text-[#2C1F1B] font-['Cinzel'] text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-1.5 transition hover:bg-stone-100/70"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{lang === "es" ? "Ver en pantalla completa ↗" : "Open in full screen ↗"}</span>
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ÁREA CENTRAL: LA INVITACIÓN INTERACTIVA (MÓVIL & DESKTOP) */}
        {/* ============================================================== */}
        <div className="flex-1 bg-[#F5EFE4] flex flex-col items-center justify-center p-2 sm:p-5 overflow-hidden relative min-h-0">
          {/* Resplandor cálido de fondo */}
          <div className="absolute w-[450px] h-[450px] bg-[#C5A059]/15 rounded-full blur-[110px] pointer-events-none" />

          {/* 
            Contenedor de la Invitación:
            - En móviles (< sm): Contenedor fluido sin cascarón grueso que maximiza el área útil
            - En tablets / desktop (sm y superior): Marco estilizado de smartphone de lujo
          */}
          <div className="relative w-full h-full sm:w-[340px] md:w-[360px] sm:h-[620px] md:h-[680px] max-h-full bg-black rounded-2xl sm:rounded-[46px] p-0 sm:p-2.5 shadow-[0_20px_60px_rgba(44,31,27,0.35),0_0_40px_rgba(197,160,89,0.25)] sm:border-4 sm:border-[#332E3D] sm:ring-1 sm:ring-[#C5A059]/40 flex flex-col overflow-hidden">
            
            {/* Dynamic Island (Solo visible en simulación con marco) */}
            <div className="hidden sm:flex absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-stone-900 border border-stone-800" />
            </div>

            {/* Iframe interactivo en vivo sin barras de scroll antiestéticas */}
            <div className="w-full h-full rounded-2xl sm:rounded-[38px] overflow-hidden bg-black relative">
              <iframe
                src={`/demo/${selectedSlug}?preview=1`}
                title="Invitación Interactiva"
                className="w-full h-full border-0 select-auto no-scrollbar"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                allow="autoplay; clipboard-write"
              />

              {/* Indicación Flotante Pulsante: TOCA EL SOBRE PARA ABRIR (pointer-events-none para permitir clic directo) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-max max-w-[90%]">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2C1F1B]/90 backdrop-blur-md border border-[#C5A059]/60 text-[#FAF8F5] text-[10px] sm:text-xs font-['Cinzel'] tracking-wider uppercase font-bold shadow-lg animate-pulse whitespace-nowrap">
                  <span>✨</span>
                  <span>{lang === "es" ? "Toca el sobre para abrir" : "Tap envelope to open"}</span>
                  <span>👆</span>
                </div>
              </div>
            </div>

            {/* Barra inferior del iPhone (Solo visible con marco) */}
            <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* BARRA INFERIOR DE CONVERSIÓN MÓVIL (Visible solo en < lg) */}
        {/* ============================================================== */}
        <div className="lg:hidden p-3 bg-white border-t border-[#E8E3D9] flex items-center gap-2 shrink-0">
          <button
            onClick={handleSelectPlan}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#B38D40] text-[#1A1A1A] font-['Cinzel'] text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
          >
            <span>{lang === "es" ? "Quiero esta invitación ($99)" : "I want this invitation ($99)"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
          </button>

          <a
            href={`/demo/${selectedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-[#E8E3D9] text-[#5E534C] hover:text-[#2C1F1B] hover:bg-stone-100 transition shrink-0"
            title={lang === "es" ? "Ver en pantalla completa" : "Open in full screen"}
          >
            <ExternalLink className="w-4 h-4 text-[#8C6D2D]" />
          </a>
        </div>

      </div>
    </div>
  );
}
