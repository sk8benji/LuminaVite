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
  reproducirMusicaAlAbrir?: boolean;
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
  reproducirMusicaAlAbrir = true,
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

    // 1. Activar audio inmediatamente en la interacción táctil si está habilitado
    if (typeof window !== "undefined" && reproducirMusicaAlAbrir !== false) {
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
          particleCount: 75,
          spread: 70,
          origin: { y: 0.55 },
          colors: [template.accentColor, "#E5C158", "#FFFFFF", "#FCECEE", "#8EB3CF"],
        });
      } catch {}
    }, 350);

    // 3. Fundido (fade-out) tras 2.2s para apreciar la carta
    setTimeout(() => {
      setIsFading(true);
      // 4. Remover completamente del DOM tras la transición
      setTimeout(() => {
        setIsRemoved(true);
      }, 800);
    }, 2200);
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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 transition-all duration-700 select-none overflow-hidden ${
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#160C10",
        backgroundImage: "radial-gradient(ellipse at center, #2C171E 0%, #100609 100%)",
      }}
    >
      {/* Texto superior: Destinatario */}
      <div className={`text-center mb-6 px-4 transition-all duration-500 ${isOpen ? "opacity-0 -translate-y-4" : "opacity-100"}`}>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-pink-200/20 text-[10px] tracking-widest uppercase text-pink-200 mb-2 font-serif shadow-sm">
          <Sparkles className="w-3 h-3 text-pink-300" />
          <span>Tienes una invitación especial</span>
        </div>
        <p
          className="text-lg sm:text-xl italic font-serif tracking-wide"
          style={{ color: "#FCECEE" }}
        >
          {guestName}
        </p>
      </div>

      {/* Contenedor del Sobre 3D Hiperrealista */}
      <div
        onClick={() => handleOpen()}
        className="relative w-[320px] sm:w-[350px] h-[244px] sm:h-[267px] cursor-pointer group transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
        style={{
          perspective: "1200px",
        }}
      >
        {/* Capa 1: Fondo / Interior del sobre con textura de papel y profundidad */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/sobre-rosa/fondo-interior.png"
          alt="Interior del sobre"
          className="absolute inset-0 w-full h-full object-fill rounded-xl shadow-2xl"
          style={{
            zIndex: 1,
            filter: "brightness(0.92) contrast(1.05)",
          }}
        />

        {/* Capa 2: Tarjeta interior de gala que se desliza suavemente en 3D */}
        <div
          className={`absolute left-4 right-4 top-3.5 bottom-3.5 rounded-xl px-5 py-4 shadow-xl flex flex-col items-center justify-center text-center transition-all duration-800 ease-out border border-[#E8D0CB] ${
            isLetterOut
              ? "-translate-y-28 sm:-translate-y-32 scale-102 shadow-2xl z-25"
              : "z-10"
          }`}
          style={{
            backgroundColor: "#FFFDF9",
            boxShadow: isLetterOut
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 20px rgba(229, 193, 88, 0.2)"
              : "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Filete dorado perimetral */}
          <div className="absolute inset-1.5 border border-[#E5C158]/40 rounded-lg pointer-events-none" />

          <p
            className="text-[9px] tracking-[0.25em] uppercase font-bold opacity-80 mb-1"
            style={{ fontFamily: template.fontSubheading, color: template.textSecondary }}
          >
            {tipoEvento === "QUINCEANERA"
              ? "Mis XV Años"
              : tipoEvento === "BODA"
              ? "Nuestra Boda"
              : "Invitación de Gala"}
          </p>

          <h3
            className="text-2xl sm:text-3xl my-1 tracking-wide font-normal"
            style={{
              fontFamily: template.fontHeading,
              color: template.textPrimary,
            }}
          >
            {titulo}
          </h3>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="h-[1px] w-6 bg-[#E5C158]/50" />
            <p
              className="text-[10px] font-medium tracking-widest uppercase"
              style={{ fontFamily: template.fontSubheading, color: template.textPrimary }}
            >
              {fechaTexto}
            </p>
            <span className="h-[1px] w-6 bg-[#E5C158]/50" />
          </div>
        </div>

        {/* Capa 3: Bolsillo Frontal aislado con bordes florales dorados y textura */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/sobre-rosa/bolsillo-frontal.png"
          alt="Bolsillo frontal del sobre"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          style={{
            zIndex: 20,
            filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.35))",
          }}
        />

        {/* Capa 4: Solapa Superior Móvil en 3D (Rota 180deg alrededor del borde superior) */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none select-none transition-transform"
          style={{
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
            transition: "transform 0.82s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: isOpen ? 5 : 30,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/sobre-rosa/solapa.png"
            alt="Solapa del sobre"
            className="absolute top-0 left-[1.25%] w-[97.5%] h-auto select-none"
            style={{
              filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.22))",
              backfaceVisibility: "visible",
            }}
          />
        </div>

        {/* Capa 5: Sello de Cera Azul Celeste con Mariposa en Relieve */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-35 pointer-events-none transition-all duration-350 ease-out ${
            isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 group-hover:scale-105"
          }`}
          style={{
            top: "62%",
            width: "66px",
            height: "66px",
            filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/sobre-rosa/sello-azul.png"
            alt="Sello de cera con mariposa"
            className="w-full h-full object-contain select-none animate-pulse"
          />
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
