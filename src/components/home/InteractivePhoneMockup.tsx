"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Volume2, CheckCircle2, ExternalLink, ArrowRight, Music, Heart } from "lucide-react";
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
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleOpenEnvelope = () => {
    if (isEnvelopeOpen) return;
    setIsEnvelopeOpen(true);
    setIsPlayingAudio(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#C5A059", "#EED3A1", "#FFFFFF", "#7FA2C6"],
      });
    } catch {
      // fallback
    }
  };

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

      {/* Floating Badges Superiores (Modo Claro de Lujo) */}
      <div className="hidden sm:flex absolute -top-5 -left-12 z-20 items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#E8E3D9] shadow-[0_10px_25px_rgba(44,31,27,0.08)] backdrop-blur-md animate-bounce [animation-duration:4s]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-['Montserrat'] text-[11px] font-semibold text-[#2C1F1B]">
          {lang === "es" ? "⚡ SMS vía Twilio • Confirmado" : "⚡ Twilio SMS • Confirmed"}
        </span>
      </div>

      <div className="hidden sm:flex absolute top-1/3 -right-14 z-20 items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#E8E3D9] shadow-[0_10px_25px_rgba(44,31,27,0.08)] backdrop-blur-md">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
        <span className="font-['Montserrat'] text-[11px] font-semibold text-[#2C1F1B]">
          {lang === "es" ? "RSVP 98% aforo en vivo" : "Live RSVP • 98% capacity"}
        </span>
      </div>

      <div className="hidden sm:flex absolute bottom-12 -left-10 z-20 items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#E8E3D9] shadow-[0_10px_25px_rgba(44,31,27,0.08)] backdrop-blur-md">
        <span className="text-[#C5A059] text-xs">🔒</span>
        <span className="font-['Montserrat'] text-[11px] font-semibold text-[#2C1F1B]">
          {lang === "es" ? "Cero contraseñas • 1 Clic" : "Zero passwords • 1 Click"}
        </span>
      </div>

      {/* Selector de Colección Rápido en Mockup */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#E8E3D9] rounded-full mb-4 shadow-[0_4px_20px_rgba(44,31,27,0.06)] backdrop-blur-md">
        <button
          onClick={() => {
            setActiveTab("butterfly");
            setIsEnvelopeOpen(false);
          }}
          className={`px-3.5 py-1.5 rounded-full text-[10px] font-['Cinzel'] tracking-wider uppercase transition-all ${
            activeTab === "butterfly"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          Butterfly XV
        </button>
        <button
          onClick={() => {
            setActiveTab("rose");
            setIsEnvelopeOpen(false);
          }}
          className={`px-3.5 py-1.5 rounded-full text-[10px] font-['Cinzel'] tracking-wider uppercase transition-all ${
            activeTab === "rose"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          Blush Rose
        </button>
        <button
          onClick={() => {
            setActiveTab("chateau");
            setIsEnvelopeOpen(false);
          }}
          className={`px-3.5 py-1.5 rounded-full text-[10px] font-['Cinzel'] tracking-wider uppercase transition-all ${
            activeTab === "chateau"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-bold shadow-sm"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
        >
          Ivory Boda
        </button>
      </div>

      {/* Marco de Smartphone Físico 9:16 con bisel de gala */}
      <div className="relative w-[310px] sm:w-[340px] h-[620px] sm:h-[680px] bg-[#0E0D12] rounded-[52px] p-3 shadow-[0_30px_90px_rgba(44,31,27,0.22),0_0_40px_rgba(197,160,89,0.35)] border-[5px] border-[#25212A] ring-2 ring-[#C5A059]/40 flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A1820]" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Volume2 className="w-2.5 h-2.5 text-[#C5A059]" />
          </div>
        </div>

        {/* Pantalla Interna Interactiva */}
        <div className="relative w-full h-full bg-[#0F0E11] rounded-[42px] overflow-hidden flex flex-col justify-between">
          {!isEnvelopeOpen ? (
            /* Vista del Sobre Virtual 3D sin abrir */
            <div className="relative w-full h-full flex flex-col items-center justify-between p-6 text-center bg-gradient-to-b from-[#1C1824] via-[#120F16] to-[#0A090D]">
              {/* Resplandor superior */}
              <div className="w-32 h-32 bg-[#C5A059]/20 rounded-full blur-2xl absolute top-6 pointer-events-none" />

              <div className="mt-8 flex flex-col items-center">
                <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-[#EED3A1]">
                  Click & Love Luxury
                </span>
                <span className="text-[9px] font-['Montserrat'] text-[#A89F91] mt-1">
                  {lang === "es" ? "Para: Familia & Amigos" : "To: Family & Friends"}
                </span>
              </div>

              {/* El Sobre Físico con Sello de Cera */}
              <div
                onClick={handleOpenEnvelope}
                className="group relative cursor-pointer my-auto flex flex-col items-center transform transition-transform hover:scale-105 active:scale-95"
              >
                {/* Ilustración de Sobre de Gala */}
                <div className="relative w-56 h-40 bg-gradient-to-b from-[#2A2433] to-[#18141F] rounded-2xl border border-[#C5A059]/40 shadow-2xl flex items-center justify-center overflow-hidden">
                  {/* Patrón de líneas y textura */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:12px_12px]" />

                  {/* Solapa triangular */}
                  <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#342D3F] to-[#201B27] border-b border-[#C5A059]/30 [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-md" />

                  {/* Sello de cera dorado */}
                  <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#EED3A1] via-[#C5A059] to-[#92702E] shadow-[0_4px_15px_rgba(197,160,89,0.5)] flex items-center justify-center border-2 border-[#FFF0D0] group-hover:rotate-6 transition-transform">
                    <span className="font-['Cinzel'] text-xs font-bold text-[#2A1F0D]">
                      {activeTab === "butterfly" ? "MM" : activeTab === "rose" ? "IR" : "E&L"}
                    </span>
                  </div>

                  {/* Cinta dorada inferior */}
                  <div className="absolute bottom-2 inset-x-4 flex justify-between items-center text-[8px] font-['Cinzel'] tracking-widest text-[#EED3A1]/70">
                    <span>★ EXCLUSIVO</span>
                    <span>9:16 VERTICAL ★</span>
                  </div>
                </div>

                {/* Llamado a la acción con brillo */}
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:brightness-110 transition-all">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === "es" ? "Toca para abrir el sobre" : "Tap to open envelope"}</span>
                </div>
              </div>

              {/* Indicador de audio */}
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-['Montserrat'] text-[#8C8479]">
                <Music className="w-3 h-3 text-[#C5A059]" />
                <span>{lang === "es" ? "Incluye música ambiental & confeti" : "Includes ambient music & confetti"}</span>
              </div>
            </div>
          ) : (
            /* Vista de la Invitación abierta con scroll interno */
            <div className="relative w-full h-full flex flex-col justify-between bg-[#120F16] text-white overflow-y-auto scrollbar-none animate-fadeIn">
              {/* Barra superior de reproducción */}
              <div className="sticky top-0 z-30 px-4 py-2.5 bg-[#120F16]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-['Cinzel'] text-[9px] tracking-widest uppercase text-[#EED3A1]">
                    {isPlayingAudio ? (lang === "es" ? "Música Reproduciéndose" : "Playing Music") : "Audio"}
                  </span>
                </div>
                <button
                  onClick={() => setIsEnvelopeOpen(false)}
                  className="text-[9px] font-['Montserrat'] text-[#A89F91] hover:text-white underline"
                >
                  {lang === "es" ? "Cerrar sobre" : "Close envelope"}
                </button>
              </div>

              {/* Contenido Editorial con fotos reales */}
              <div className="p-4 flex flex-col items-center text-center space-y-4">
                <div className="w-full relative h-48 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      activeTab === "butterfly"
                        ? "/assets/template-butterfly/foto-columpio-portada.png"
                        : activeTab === "rose"
                        ? "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png"
                        : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                    }
                    alt="Portada demo"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <div className="absolute bottom-3 inset-x-3 text-center">
                    <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#EED3A1]">
                      {activeTab === "butterfly"
                        ? "Mis Quince Años"
                        : activeTab === "rose"
                        ? "Fifteen Years of Magic"
                        : "Nuestra Boda"}
                    </span>
                    <h4 className="font-['Cinzel'] text-xl font-bold text-white tracking-wide">
                      {activeTab === "butterfly"
                        ? "Valeria Morales"
                        : activeTab === "rose"
                        ? "Isabella Cordero"
                        : "Emma & Lucas"}
                    </h4>
                  </div>
                </div>

                {/* Fecha y Contador */}
                <div className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-around">
                  <div className="text-center">
                    <div className="font-['Cinzel'] text-sm font-bold text-[#EED3A1]">18</div>
                    <div className="text-[8px] font-['Montserrat'] text-neutral-400 uppercase">Días</div>
                  </div>
                  <div className="text-center">
                    <div className="font-['Cinzel'] text-sm font-bold text-[#EED3A1]">04</div>
                    <div className="text-[8px] font-['Montserrat'] text-neutral-400 uppercase">Horas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-['Cinzel'] text-sm font-bold text-[#EED3A1]">22</div>
                    <div className="text-[8px] font-['Montserrat'] text-neutral-400 uppercase">Minutos</div>
                  </div>
                </div>

                {/* Itinerario Rápido */}
                <div className="w-full text-left space-y-2 py-1">
                  <div className="text-[9px] font-['Cinzel'] tracking-widest text-[#EED3A1] uppercase font-semibold">
                    {lang === "es" ? "Itinerario Oficial" : "Official Itinerary"}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                    <span className="text-[10px] font-['Cinzel'] text-[#C5A059]">04:00 PM</span>
                    <span className="text-[11px] font-['Montserrat']">Ceremonia Religiosa</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                    <span className="text-[10px] font-['Cinzel'] text-[#C5A059]">07:00 PM</span>
                    <span className="text-[11px] font-['Montserrat']">Recepción & Vals de Gala</span>
                  </div>
                </div>

                {/* Botón RSVP simulado */}
                <div className="w-full pt-2">
                  <button
                    onClick={() => onOpenModal(currentSlug)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-['Cinzel'] text-[11px] tracking-[0.2em] uppercase font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                  >
                    <span>{lang === "es" ? "Confirmar Asistencia (RSVP)" : "Confirm Attendance (RSVP)"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
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
