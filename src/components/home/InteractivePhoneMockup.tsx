"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, ExternalLink, Volume2, VolumeX, Play } from "lucide-react";
import { Language } from "@/lib/home-translations";

type EventTab = "quince" | "boda" | "cumple";

const VIDEOS: Record<EventTab, string> = {
  quince: "https://luminavite-storage.s3.us-east-1.amazonaws.com/video/WhatsApp+Video+2026-10-14+at+9.50.53+AM.mp4",
  boda: "https://luminavite-storage.s3.us-east-1.amazonaws.com/video/WhatsApp+Video+2026-10-14+at+10.26.04+AM.mp4",
  cumple: "https://luminavite-storage.s3.us-east-1.amazonaws.com/video/WhatsApp+Video+2026-10-14+at+10.25.57+AM.mp4",
};

const SLUGS: Record<EventTab, string> = {
  quince: "mariposas-xv",
  boda: "emma-and-lucas",
  cumple: "isabella-xv",
};

interface InteractivePhoneMockupProps {
  lang: Language;
  onOpenModal: (slug: string) => void;
}

export default function InteractivePhoneMockup({
  lang,
  onOpenModal,
}: InteractivePhoneMockupProps) {
  const [activeTab, setActiveTab] = useState<EventTab>("quince");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Al cambiar de categoría, reiniciar y reproducir automáticamente el video correspondiente
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [activeTab]);

  const handleVideoToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMutedState = !videoRef.current.muted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const currentSlug = SLUGS[activeTab];

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[440px] mx-auto">
      {/* Resplandor ambiental cálido detrás del mockup */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/25 via-[#EED3A1]/15 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Badge de Prueba Social Local */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#C5A059]/40 shadow-[0_4px_16px_rgba(44,31,27,0.06)] backdrop-blur-md mb-4 text-center max-w-full">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
        <span className="font-['Montserrat'] text-[11px] font-semibold text-[#2C1F1B]">
          {lang === "es"
            ? "Más de 1,200 familias confirmadas este mes en Los Ángeles y San Fernando Valley"
            : "Over 1,200 families confirmed this month across Los Angeles & San Fernando Valley"}
        </span>
      </div>

      {/* Floating Badges Laterales (Solo en pantallas grandes) */}
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

      {/* Selector de Colección Rápido en Mockup: XV Quinceaños | Boda | Cumpleaños */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#E8E3D9] rounded-full mb-3 shadow-[0_4px_20px_rgba(44,31,27,0.06)] backdrop-blur-md">
        <button
          onClick={() => setActiveTab("quince")}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-['Cinzel'] tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === "quince"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          {lang === "es" ? "XV Quinceaños" : "XV Quinceaños"}
        </button>
        <button
          onClick={() => setActiveTab("boda")}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-['Cinzel'] tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === "boda"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          {lang === "es" ? "Boda" : "Wedding"}
        </button>
        <button
          onClick={() => setActiveTab("cumple")}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-['Cinzel'] tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === "cumple"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          {lang === "es" ? "Cumpleaños" : "Birthday"}
        </button>
      </div>

      {/* Marco de Smartphone Físico 9:16 con bisel de gala */}
      <div className="relative w-[300px] sm:w-[330px] h-[580px] sm:h-[630px] bg-[#0E0D12] rounded-[48px] p-2.5 sm:p-3 shadow-[0_25px_80px_rgba(44,31,27,0.2),0_0_35px_rgba(197,160,89,0.3)] border-[4px] sm:border-[5px] border-[#25212A] ring-2 ring-[#C5A059]/40 flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A1820]" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Volume2 className="w-2.5 h-2.5 text-[#C5A059]" />
          </div>
        </div>

        {/* Pantalla Interna: Video Real de Demostración */}
        <div
          onClick={handleVideoToggle}
          className="relative w-full h-full bg-black rounded-[42px] overflow-hidden flex items-center justify-center cursor-pointer group select-none"
        >
          <video
            ref={videoRef}
            key={activeTab}
            src={VIDEOS[activeTab]}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />

          {/* Botón discreto de audio (Mute/Unmute) en la esquina superior */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            className="absolute top-7 right-3.5 z-30 p-2 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-[#C5A059]/40 text-[#EED3A1] transition-transform active:scale-95 shadow-md cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-zinc-300" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#EED3A1]" />
            )}
          </button>

          {/* Indicador de Play si el video está pausado */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center pointer-events-none transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] transform scale-100 hover:scale-105 transition-transform">
                <Play className="w-7 h-7 ml-1 fill-current" />
              </div>
            </div>
          )}
        </div>

        {/* Barra de inicio inferior de iOS */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full pointer-events-none" />
      </div>

      {/* Botón debajo del teléfono para probar a pantalla completa */}
      <button
        onClick={() => onOpenModal(currentSlug)}
        className="mt-4 inline-flex items-center gap-2 text-xs font-['Cinzel'] tracking-widest uppercase text-[#C5A059] hover:text-[#AA8643] transition-colors font-bold"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span>
          {lang === "es"
            ? `Probar Invitación de ${activeTab === "quince" ? "XV Quinceaños" : activeTab === "boda" ? "Boda" : "Cumpleaños"} en Vivo`
            : `Test ${activeTab === "quince" ? "XV Quinceaños" : activeTab === "boda" ? "Wedding" : "Birthday"} Live Demo`}
        </span>
      </button>
    </div>
  );
}
