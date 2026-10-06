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
  onOpen?: (selectedLang?: "es" | "en") => void;
  destinatarioInicial?: string;
  idiomaDefault?: "es" | "en" | "bilingual" | string;
  coverPhotoUrl?: string;
}

export default function EnvelopeIntro({
  titulo,
  tipoEvento = "QUINCEANERA",
  fechaTexto,
  template,
  onOpen,
  destinatarioInicial = "Familia & Amigos",
  idiomaDefault = "es",
  coverPhotoUrl,
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

  const handleOpen = (chosenLang?: "es" | "en") => {
    if (isOpen) return;
    setIsOpen(true);

    // 1. Activar audio inmediatamente en la interacción táctil (desbloquea autoplay en iOS/Android)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("luminavite:play-audio"));
    }
    if (onOpen) {
      onOpen(chosenLang);
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

  if (template.id === "ELEGANT_ROSE") {
    const isEnDefault = idiomaDefault === "en";
    const heroBg = coverPhotoUrl || "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png";

    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 transition-all duration-700 select-none overflow-hidden ${
          isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {/* Foto de fondo pantalla completa de la quinceañera */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroBg}
          alt="Quinceañera"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
        />
        {/* Degradado y velo translúcido rosa suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/60 backdrop-blur-[1.5px]" />

        {/* Destinatario si viene personalizado */}
        {guestName && (
          <div className="relative z-10 mb-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-lg animate-fade-in text-center">
            <span className="text-xs uppercase tracking-widest text-pink-100 font-serif">
              Para: <strong className="font-semibold text-white ml-1">{guestName}</strong>
            </span>
          </div>
        )}

        {/* Panel central de cristal esmerilado réplica fiel de Canva */}
        <div
          onClick={() => handleOpen()}
          className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center shadow-2xl cursor-pointer group transition-all duration-300 hover:shadow-pink-900/30 border border-white/60"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35), inset 0 0 15px rgba(255, 255, 255, 0.5)",
          }}
        >
          {/* Texto arqueado "YOU ARE CORDIALLY" */}
          <div className="w-full flex justify-center -mb-2">
            <svg viewBox="0 0 300 55" className="w-64 h-12 overflow-visible">
              <path id="curve" d="M 15 45 Q 150 15 285 45" fill="transparent" />
              <text className="text-[12px] uppercase font-bold tracking-[0.3em] fill-[#5A3E44]">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                  YOU ARE CORDIALLY
                </textPath>
              </text>
            </svg>
          </div>

          {/* Corona Tiara Dorada */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/template-rose/ba47feef59edd928b7c840eae54838b3.png"
            alt="Corona"
            className="w-12 h-auto my-1 drop-shadow transition-transform duration-300 group-hover:scale-110"
          />

          {/* "invited!" Cursiva elegante */}
          <h2
            className="text-5xl sm:text-6xl text-[#5A3E44] -mt-1 mb-3 select-none"
            style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
          >
            invited!
          </h2>

          {/* Sobre Rosa de Terciopelo con sello de corona */}
          <div className="relative my-2 w-48 sm:w-52 transition-transform duration-500 group-hover:scale-105 active:scale-95">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-rose/cb257414402ef9963727de1a6d13bd5c.png"
              alt="Sobre Quinceañera"
              className={`w-full h-auto drop-shadow-2xl transition-all duration-500 ${
                isOpen ? "scale-110 -translate-y-4 opacity-80" : ""
              }`}
            />
          </div>

          {/* Selector de idioma o botón de apertura */}
          {idiomaDefault === "bilingual" ? (
            <div className="mt-4 flex flex-col items-center gap-2.5 w-full" onClick={(e) => e.stopPropagation()}>
              <p
                className="text-[11px] uppercase tracking-widest text-[#5A3E44]/90 font-serif leading-tight"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Select your language<br />
                <span className="text-[10px] opacity-80">Selecciona tu idioma</span>
              </p>
              <div className="flex items-center justify-center gap-3 w-full pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen("en");
                  }}
                  className="flex-1 py-2 px-3 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-200 border border-white/60 bg-white/50 hover:bg-white/80 text-[#5A3E44] shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  ENGLISH
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen("es");
                  }}
                  className="flex-1 py-2 px-3 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-200 border border-white/60 bg-white/50 hover:bg-white/80 text-[#5A3E44] shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  ESPAÑOL
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 w-full flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleOpen(isEnDefault ? "en" : "es")}
                disabled={isOpen}
                className="w-full py-2.5 px-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border border-white/80 bg-white/60 hover:bg-white/90 text-[#5A3E44] shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 animate-pulse cursor-pointer"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <span>{isEnDefault ? "Tap envelope to open" : "Toca el sobre para abrir"}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#CE8486]" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

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
        onClick={() => handleOpen()}
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

      {/* Botones e indicación interactiva inferior */}
      {idiomaDefault === "bilingual" ? (
        <div
          className={`mt-8 flex items-center justify-center gap-3 transition-all duration-300 z-30 ${
            isOpen ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen("es");
            }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 text-pink-100 bg-white/10 hover:bg-white/20 border-pink-200/40 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            style={{ fontFamily: template.fontSubheading }}
          >
            <span>🇲🇽</span>
            <span>Español</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen("en");
            }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 text-pink-100 bg-white/10 hover:bg-white/20 border-pink-200/40 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            style={{ fontFamily: template.fontSubheading }}
          >
            <span>🇺🇸</span>
            <span>English</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => handleOpen(idiomaDefault === "en" ? "en" : "es")}
          disabled={isOpen}
          className={`mt-10 px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 border flex items-center gap-2 ${
            isOpen
              ? "opacity-0 scale-95"
              : "text-pink-100 bg-white/10 hover:bg-white/20 border-pink-200/30 shadow-lg animate-pulse"
          }`}
          style={{ fontFamily: template.fontSubheading }}
        >
          <span>{idiomaDefault === "en" ? "Tap envelope to open" : "Toca el sobre para abrir"}</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
        </button>
      )}

      <p className="text-[10px] text-pink-200/40 mt-3 tracking-wider">
        {idiomaDefault === "en" ? "Audio and interactive animation" : "Audio y animación interactiva"}
      </p>
    </div>
  );
}
