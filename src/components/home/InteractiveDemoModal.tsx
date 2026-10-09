"use client";

import React, { useState, useEffect } from "react";
import { X, ExternalLink, Sparkles, Smartphone, Volume2 } from "lucide-react";
import { Language } from "@/lib/home-translations";

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug?: string;
  lang: Language;
}

export default function InteractiveDemoModal({
  isOpen,
  onClose,
  initialSlug = "maydelin-mendez",
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn select-none">
      {/* Botón de Cierre Superior */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
        aria-label="Cerrar modal"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Contenedor Principal del Modal */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-[#120F16] border border-[#C5A059]/40 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.25)] flex flex-col lg:flex-row overflow-hidden">
        {/* Columna Izquierda: Panel de Control & Explicación de la Experiencia */}
        <div className="w-full lg:w-80 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-[#16131C]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-[#EED3A1] font-semibold">
                {lang === "es" ? "Demostración Activa" : "Active Demo"}
              </span>
            </div>

            <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-white tracking-wide mb-2">
              {lang === "es" ? "Experiencia del Invitado" : "Live Guest Experience"}
            </h3>

            <p className="font-['Montserrat'] text-xs text-[#A89F91] leading-relaxed mb-6">
              {lang === "es"
                ? "Estás interactuando con el flujo 100% real: apertura de sobre 3D, confeti, música envolvente y formulario RSVP con cálculo de pases."
                : "You are testing the 100% real flow: 3D envelope opening, confetti, immersive music, and smart RSVP with pass allocation."}
            </p>

            {/* Selector de Demos */}
            <div className="space-y-2 mb-6">
              <span className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-[#C5A059] font-semibold block">
                {lang === "es" ? "Selecciona una Colección:" : "Select a Collection:"}
              </span>

              <button
                onClick={() => setSelectedSlug("maydelin-mendez")}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedSlug === "maydelin-mendez"
                    ? "bg-[#C5A059]/20 border-[#C5A059] text-white"
                    : "bg-white/5 border-white/10 text-[#A89F91] hover:text-white"
                }`}
              >
                <div>
                  <div className="font-['Cinzel'] text-xs font-bold text-white">Maydelin Méndez</div>
                  <div className="font-['Montserrat'] text-[10px] text-[#A89F91]">
                    Blue Butterfly • 15 Años
                  </div>
                </div>
                {selectedSlug === "maydelin-mendez" && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={() => setSelectedSlug("isabella-xv")}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedSlug === "isabella-xv"
                    ? "bg-[#C5A059]/20 border-[#C5A059] text-white"
                    : "bg-white/5 border-white/10 text-[#A89F91] hover:text-white"
                }`}
              >
                <div>
                  <div className="font-['Cinzel'] text-xs font-bold text-white">Isabella Cordero</div>
                  <div className="font-['Montserrat'] text-[10px] text-[#A89F91]">
                    Blush Rose • Filmstrip Gala
                  </div>
                </div>
                {selectedSlug === "isabella-xv" && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={() => setSelectedSlug("emma-and-lucas")}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedSlug === "emma-and-lucas"
                    ? "bg-[#C5A059]/20 border-[#C5A059] text-white"
                    : "bg-white/5 border-white/10 text-[#A89F91] hover:text-white"
                }`}
              >
                <div>
                  <div className="font-['Cinzel'] text-xs font-bold text-white">Emma & Lucas</div>
                  <div className="font-['Montserrat'] text-[10px] text-[#A89F91]">
                    Elegant Ivory • Boda Château
                  </div>
                </div>
                {selectedSlug === "emma-and-lucas" && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <a
              href={`/${selectedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-black font-['Cinzel'] text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{lang === "es" ? "Abrir en Pantalla Completa" : "Open in Full Screen"}</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-white/20 text-[#D4CFC7] font-['Cinzel'] text-xs tracking-wider uppercase hover:bg-white/10 transition"
            >
              {lang === "es" ? "Regresar a la Página" : "Back to Website"}
            </button>
          </div>
        </div>

        {/* Columna Derecha: El Teléfono Físico con Iframe de la invitación en vivo */}
        <div className="flex-1 bg-[#09080B] flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden relative">
          {/* Resplandor */}
          <div className="absolute w-[400px] h-[400px] bg-[#C5A059]/15 rounded-full blur-[110px] pointer-events-none" />

          {/* Marco de Smartphone */}
          <div className="relative w-[320px] sm:w-[360px] h-[580px] sm:h-[720px] bg-black rounded-[50px] p-2.5 sm:p-3 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(197,160,89,0.3)] border-4 border-[#332E3D] ring-1 ring-[#C5A059]/30 flex flex-col">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
            </div>

            {/* Iframe interactivo en vivo */}
            <div className="w-full h-full rounded-[40px] overflow-hidden bg-black relative">
              <iframe
                src={`/${selectedSlug}?preview=1`}
                title="Invitación Interactiva"
                className="w-full h-full border-0 select-auto"
                allow="autoplay; clipboard-write"
              />
            </div>

            {/* Barra inferior */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
