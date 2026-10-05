"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";
import { TemplateConfig } from "@/lib/templates";

interface EnvelopeIntroProps {
  titulo: string;
  tipoEvento?: "QUINCEANERA" | "BODA" | "CUMPLEANOS";
  fechaTexto: string;
  template: TemplateConfig;
  onOpen?: () => void;
  destinatarioInicial?: string;
}

export default function EnvelopeIntro({
  titulo,
  tipoEvento = "QUINCEANERA",
  fechaTexto,
  template,
  onOpen,
  destinatarioInicial = "Familia & Amigos",
}: EnvelopeIntroProps) {
  const [guestName, setGuestName] = useState(destinatarioInicial);
  const [isOpen, setIsOpen] = useState(false);
  const [isLetterOut, setIsLetterOut] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  // Leer destinatario desde la URL en el cliente sin requerir Suspense boundary
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const customName =
        params.get("para") || params.get("invitado") || params.get("guest");
      if (customName) {
        setGuestName(customName);
      }
    }
  }, []);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    // 1. Activar audio inmediatamente en la interacción táctil (desbloquea autoplay en iOS/Android)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("luminavite:play-audio"));
    }
    if (onOpen) {
      onOpen();
    }

    // 2. Extraer la carta tras 350ms (cuando la solapa haya rotado en 3D)
    setTimeout(() => {
      setIsLetterOut(true);

      // Disparar confeti suave
      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 },
          colors: [template.accentColor, "#FFFFFF", "#FCECEE", "#E5C158"],
        });
      } catch {}
    }, 350);

    // 3. Fundido (fade-out) tras 1.6s
    setTimeout(() => {
      setIsFading(true);
      // 4. Remover completamente del DOM tras la transición
      setTimeout(() => {
        setIsRemoved(true);
      }, 700);
    }, 1600);
  };

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 transition-opacity duration-700 select-none overflow-hidden ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#1F1215",
        backgroundImage: "radial-gradient(ellipse at center, #351C22 0%, #150A0D 100%)",
      }}
    >
      {/* Texto superior: Destinatario */}
      <div className="text-center mb-8 px-4 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-pink-200/20 text-[10px] tracking-widest uppercase text-pink-200 mb-2 font-serif">
          <Sparkles className="w-3 h-3 text-pink-300" />
          <span>Tienes una invitación especial</span>
        </div>
        <p
          className="text-base sm:text-lg italic font-serif"
          style={{ color: "#FCECEE" }}
        >
          {guestName}
        </p>
      </div>

      {/* Contenedor con Perspectiva 3D */}
      <div
        onClick={handleOpen}
        className="relative w-72 sm:w-80 h-48 sm:h-52 rounded-b-2xl shadow-2xl cursor-pointer group transform transition-transform hover:scale-102"
        style={{
          perspective: "1200px",
          backgroundColor: "#F4D9DE",
        }}
      >
        {/* Fondo interior del sobre */}
        <div
          className="absolute inset-0 rounded-b-2xl shadow-inner"
          style={{ backgroundColor: "#E4B8C1" }}
        />

        {/* Tarjeta interna (Carta que se desliza en 3D) */}
        <div
          className={`absolute left-3 right-3 top-3 bottom-3 rounded-xl p-4 shadow-lg flex flex-col items-center justify-center text-center transition-all duration-700 ease-out ${
            isLetterOut
              ? "-translate-y-24 sm:-translate-y-28 scale-105 shadow-2xl z-25"
              : "z-10"
          }`}
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: template.borderSoft,
            borderWidth: "1px",
          }}
        >
          <p
            className="text-[9px] tracking-widest uppercase font-semibold opacity-70 mb-1"
            style={{ fontFamily: template.fontSubheading, color: template.textSecondary }}
          >
            {tipoEvento === "QUINCEANERA"
              ? "Mis XV Años"
              : tipoEvento === "BODA"
              ? "Nuestra Boda"
              : "Fiesta de Cumpleaños"}
          </p>

          <h3
            className="text-3xl sm:text-4xl my-0.5 tracking-wide"
            style={{
              fontFamily: template.fontHeading,
              color: template.textPrimary,
            }}
          >
            {titulo}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="h-[1px] w-6 bg-pink-200" />
            <p
              className="text-[10px] font-medium tracking-wider"
              style={{ fontFamily: template.fontSubheading, color: template.textPrimary }}
            >
              {fechaTexto}
            </p>
            <span className="h-[1px] w-6 bg-pink-200" />
          </div>
        </div>

        {/* Bolsillo Frontal y Lateral del Sobre */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div
            className="w-full h-full rounded-b-2xl"
            style={{
              backgroundColor: "#EBB5BF",
              clipPath: "polygon(0% 0%, 50% 55%, 100% 0%, 100% 100%, 0% 100%)",
              boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
            }}
          />
        </div>

        {/* Solapa Superior en 3D (Rota 180deg en el eje X) */}
        <div
          className="absolute top-0 left-0 w-full h-28 origin-top transition-transform duration-600 ease-in-out"
          style={{
            transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
            transformStyle: "preserve-3d",
            zIndex: isOpen ? 5 : 30,
          }}
        >
          <div
            className="w-full h-full shadow-md"
            style={{
              backgroundColor: "#D99FA9",
              clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
            }}
          />
        </div>

        {/* Sello de Lazo Central */}
        <div
          className={`absolute top-24 sm:top-26 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-xl border-2 border-pink-200 transition-all duration-300 ${
            isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100 group-hover:scale-110"
          }`}
          style={{
            backgroundColor: "#5A3E44",
            color: "#FFFFFF",
          }}
        >
          <span className="text-base animate-bounce">🎀</span>
        </div>
      </div>

      {/* Botón e indicación interactiva inferior */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={isOpen}
        className={`mt-10 px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 border flex items-center gap-2 ${
          isOpen
            ? "opacity-0 scale-95"
            : "text-pink-100 bg-white/10 hover:bg-white/20 border-pink-200/30 shadow-lg animate-pulse"
        }`}
        style={{ fontFamily: template.fontSubheading }}
      >
        <span>Toca el sobre para abrir</span>
        <Sparkles className="w-3.5 h-3.5 text-pink-300" />
      </button>

      <p className="text-[10px] text-pink-200/40 mt-3 tracking-wider">
        Audio y animación interactiva
      </p>
    </div>
  );
}
