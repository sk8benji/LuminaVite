"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, ExternalLink, Volume2 } from "lucide-react";
import { Language } from "@/lib/home-translations";

interface InteractivePhoneMockupProps {
  lang: Language;
  onOpenModal: (slug: string) => void;
}

export default function InteractivePhoneMockup({
  lang,
  onOpenModal,
}: InteractivePhoneMockupProps) {
  const [activeTab, setActiveTab] = useState<"butterfly" | "rose" | "chateau">("butterfly");

  const currentSlug =
    activeTab === "butterfly"
      ? "mariposas-xv"
      : activeTab === "rose"
      ? "isabella-xv"
      : "emma-and-lucas";

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[440px] mx-auto">
      {/* Resplandor ambiental cálido detrás del mockup */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/25 via-[#EED3A1]/15 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Badge de Prueba Social Local (En el flujo normal con espaciado limpio, sin sobreponerse en PC ni móviles) */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#C5A059]/40 shadow-[0_4px_16px_rgba(44,31,27,0.06)] backdrop-blur-md mb-4 text-center max-w-full">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
        <span className="font-['Montserrat'] text-[11px] font-semibold text-[#2C1F1B]">
          {lang === "es"
            ? "Más de 1,200 familias confirmadas este mes en Los Ángeles y San Fernando Valley"
            : "Over 1,200 families confirmed this month across Los Angeles & San Fernando Valley"}
        </span>
      </div>

      {/* Floating Badges Laterales (Solo en pantallas grandes para evitar solapamiento) */}
      <div className="hidden lg:flex absolute top-1/3 -right-20 z-20 items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#E8E3D9] shadow-[0_10px_25px_rgba(44,31,27,0.08)] backdrop-blur-md">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
        <span className="font-['Montserrat'] text-[11px] font-semibold text-[#2C1F1B]">
          {lang === "es" ? "RSVP 98% aforo en vivo" : "Live RSVP • 98% capacity"}
        </span>
      </div>

      <div className="hidden lg:flex absolute bottom-16 -left-16 z-20 items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#E8E3D9] shadow-[0_10px_25px_rgba(44,31,27,0.08)] backdrop-blur-md">
        <span className="text-[#C5A059] text-xs">🔒</span>
        <span className="font-['Montserrat'] text-[11px] font-semibold text-[#2C1F1B]">
          {lang === "es" ? "Cero contraseñas • 1 Clic" : "Zero passwords • 1 Click"}
        </span>
      </div>

      {/* Selector de Colección Rápido en Mockup (Accesible y Visible en el Pliegue) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#E8E3D9] rounded-full mb-3 shadow-[0_4px_20px_rgba(44,31,27,0.06)] backdrop-blur-md">
        <button
          onClick={() => setActiveTab("butterfly")}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-['Cinzel'] tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === "butterfly"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          Butterfly XV
        </button>
        <button
          onClick={() => setActiveTab("rose")}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-['Cinzel'] tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === "rose"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          Blush Rose
        </button>
        <button
          onClick={() => setActiveTab("chateau")}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-['Cinzel'] tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === "chateau"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          Ivory Boda
        </button>
      </div>

      {/* Marco de Smartphone Físico 9:16 con bisel de gala (Ajustado para pliegue óptimo) */}
      <div className="relative w-[300px] sm:w-[330px] h-[580px] sm:h-[630px] bg-[#0E0D12] rounded-[48px] p-2.5 sm:p-3 shadow-[0_25px_80px_rgba(44,31,27,0.2),0_0_35px_rgba(197,160,89,0.3)] border-[4px] sm:border-[5px] border-[#25212A] ring-2 ring-[#C5A059]/40 flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A1820]" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Volume2 className="w-2.5 h-2.5 text-[#C5A059]" />
          </div>
        </div>

        {/* Pantalla Interna: Video Real de Demostración en Loop Automático */}
        <div
          onClick={() => onOpenModal(currentSlug)}
          className="relative w-full h-full bg-black rounded-[42px] overflow-hidden flex items-center justify-center cursor-pointer group"
        >
          <video
            src="https://luminavite-storage.s3.us-east-1.amazonaws.com/video/WhatsApp+Video+2026-10-14+at+9.50.53+AM.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Overlay interactivo con badges de gala al pasar el cursor o tocar */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex flex-col items-center justify-between p-4 pointer-events-none">
            {/* Badge superior dentro del video */}
            <div className="w-full flex justify-end">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C5A059]/50 text-[#EED3A1] text-[9px] font-['Cinzel'] tracking-wider uppercase font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Demo en Vivo</span>
              </span>
            </div>

            {/* Llamado a la acción central al pasar el mouse o tocar */}
            <div className="transform translate-y-1 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-['Cinzel'] text-[10px] tracking-wider uppercase font-extrabold shadow-[0_8px_25px_rgba(197,160,89,0.5)] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#2C1F1B] animate-pulse" />
                <span>{lang === "es" ? "Toca para Probar en Vivo" : "Tap to Test Live Demo"}</span>
              </div>
            </div>

            {/* Espaciador inferior */}
            <div />
          </div>
        </div>

        {/* Barra de inicio inferior de iOS */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full" />
      </div>

      {/* Botón debajo del teléfono para probar a pantalla completa */}
      <button
        onClick={() => onOpenModal(currentSlug)}
        className="mt-4 inline-flex items-center gap-2 text-xs font-['Cinzel'] tracking-widest uppercase text-[#C5A059] hover:text-[#AA8643] transition-colors font-bold"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span>
          {lang === "es"
            ? `Probar ${activeTab === "butterfly" ? "Valeria (Butterfly)" : activeTab === "rose" ? "Isabella" : "Emma & Lucas"} en Vivo`
            : `Test ${activeTab === "butterfly" ? "Valeria (Butterfly)" : activeTab === "rose" ? "Isabella" : "Emma & Lucas"} Live`}
        </span>
      </button>
    </div>
  );
}
