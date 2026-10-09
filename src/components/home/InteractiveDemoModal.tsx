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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xl animate-fadeIn select-none">
      {/* Botón de Cierre Superior */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#2C1F1B] transition-all border border-[#E8E3D9] shadow-lg"
        aria-label="Cerrar modal"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Contenedor Principal del Modal */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-[#FAF8F5] border border-[#E8E3D9] rounded-3xl shadow-[0_20px_70px_rgba(44,31,27,0.2)] flex flex-col lg:flex-row overflow-hidden">
        {/* Columna Izquierda: Panel de Control & Explicación de la Experiencia */}
        <div className="w-full lg:w-80 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E8E3D9] bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-[#2C1F1B] font-bold">
                {lang === "es" ? "Demostración Activa" : "Active Demo"}
              </span>
            </div>

            <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#2C1F1B] tracking-wide mb-2">
              {lang === "es" ? "Experiencia del Invitado" : "Live Guest Experience"}
            </h3>

            <p className="font-['Montserrat'] text-xs text-[#5E534C] leading-relaxed mb-6">
              {lang === "es"
                ? "Estás interactuando con el flujo 100% real: apertura de sobre 3D, confeti, música envolvente y formulario RSVP con cálculo de pases."
                : "You are testing the 100% real flow: 3D envelope opening, confetti, immersive music, and smart RSVP with pass allocation."}
            </p>

            {/* Selector de Demos */}
            <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-1">
              <span className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-[#C5A059] font-bold block">
                {lang === "es" ? "Selecciona una Colección:" : "Select a Collection:"}
              </span>

              <button
                onClick={() => setSelectedSlug("mariposas-xv")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedSlug === "mariposas-xv"
                    ? "bg-[#F5EFE4] border-[#C5A059] text-[#2C1F1B]"
                    : "bg-[#FAF8F5] border-[#E8E3D9] text-[#5E534C] hover:text-[#2C1F1B]"
                }`}
              >
                <div>
                  <div className="font-['Cinzel'] text-xs font-bold text-[#2C1F1B]">Valeria Morales</div>
                  <div className="font-['Montserrat'] text-[10px] text-[#8C8077]">
                    Blue Butterfly • 15 Años
                  </div>
                </div>
                {selectedSlug === "mariposas-xv" && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={() => setSelectedSlug("isabella-xv")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedSlug === "isabella-xv"
                    ? "bg-[#F5EFE4] border-[#C5A059] text-[#2C1F1B]"
                    : "bg-[#FAF8F5] border-[#E8E3D9] text-[#5E534C] hover:text-[#2C1F1B]"
                }`}
              >
                <div>
                  <div className="font-['Cinzel'] text-xs font-bold text-[#2C1F1B]">Isabella Cordero</div>
                  <div className="font-['Montserrat'] text-[10px] text-[#8C8077]">
                    Blush Rose • Filmstrip Gala
                  </div>
                </div>
                {selectedSlug === "isabella-xv" && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={() => setSelectedSlug("emma-and-lucas")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedSlug === "emma-and-lucas"
                    ? "bg-[#F5EFE4] border-[#C5A059] text-[#2C1F1B]"
                    : "bg-[#FAF8F5] border-[#E8E3D9] text-[#5E534C] hover:text-[#2C1F1B]"
                }`}
              >
                <div>
                  <div className="font-['Cinzel'] text-xs font-bold text-[#2C1F1B]">Emma & Lucas</div>
                  <div className="font-['Montserrat'] text-[10px] text-[#8C8077]">
                    Elegant Ivory • Boda Château
                  </div>
                </div>
                {selectedSlug === "emma-and-lucas" && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={() => setSelectedSlug("quince-rosado")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedSlug === "quince-rosado"
                    ? "bg-[#F5EFE4] border-[#C5A059] text-[#2C1F1B]"
                    : "bg-[#FAF8F5] border-[#E8E3D9] text-[#5E534C] hover:text-[#2C1F1B]"
                }`}
              >
                <div>
                  <div className="font-['Cinzel'] text-xs font-bold text-[#2C1F1B]">Quince Rosado</div>
                  <div className="font-['Montserrat'] text-[10px] text-[#8C8077]">
                    Princesa a Caballo • 15 Años
                  </div>
                </div>
                {selectedSlug === "quince-rosado" && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={() => setSelectedSlug("coraline-party")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedSlug === "coraline-party"
                    ? "bg-[#F5EFE4] border-[#C5A059] text-[#2C1F1B]"
                    : "bg-[#FAF8F5] border-[#E8E3D9] text-[#5E534C] hover:text-[#2C1F1B]"
                }`}
              >
                <div>
                  <div className="font-['Cinzel'] text-xs font-bold text-[#2C1F1B]">Coraline World</div>
                  <div className="font-['Montserrat'] text-[10px] text-[#8C8077]">
                    Mística • Puerta Secreta
                  </div>
                </div>
                {selectedSlug === "coraline-party" && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>
            </div>

            {/* Enlace al Catálogo Completo */}
            <div className="mb-4">
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-['Cinzel'] text-[#C5A059] hover:underline font-bold flex items-center gap-1"
              >
                <span>{lang === "es" ? "✦ Ver las 8+ demos en el catálogo" : "✦ View all 8+ demos in catalog"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8E3D9] space-y-2.5">
            <a
              href={`/demo/${selectedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-['Cinzel'] text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{lang === "es" ? "Abrir en Pantalla Completa" : "Open in Full Screen"}</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl border border-[#E8E3D9] text-[#5E534C] font-['Cinzel'] text-xs tracking-wider uppercase hover:bg-neutral-100 transition font-semibold"
            >
              {lang === "es" ? "Regresar a la Página" : "Back to Website"}
            </button>
          </div>
        </div>

        {/* Columna Derecha: El Teléfono Físico con Iframe de la invitación en vivo */}
        <div className="flex-1 bg-[#F5EFE4] flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden relative">
          {/* Resplandor cálido */}
          <div className="absolute w-[400px] h-[400px] bg-[#C5A059]/15 rounded-full blur-[110px] pointer-events-none" />

          {/* Marco de Smartphone */}
          <div className="relative w-[320px] sm:w-[360px] h-[580px] sm:h-[720px] bg-black rounded-[50px] p-2.5 sm:p-3 shadow-[0_20px_60px_rgba(44,31,27,0.35),0_0_40px_rgba(197,160,89,0.3)] border-4 border-[#332E3D] ring-1 ring-[#C5A059]/40 flex flex-col">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
            </div>

            {/* Iframe interactivo en vivo */}
            <div className="w-full h-full rounded-[40px] overflow-hidden bg-black relative">
              <iframe
                src={`/demo/${selectedSlug}?preview=1`}
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
