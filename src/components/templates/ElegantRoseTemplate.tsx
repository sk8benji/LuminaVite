"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Send,
  Check,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { getTemplate } from "@/lib/templates";
import { getMapDirectionsUrl } from "@/lib/maps";
import { ELEGANT_ROSE_ASSETS } from "@/lib/templates/elegantRoseAssets";
import EnvelopeIntro from "../invitation/EnvelopeIntro";
import { InvitationData } from "../invitation/InvitationMobileView";

function WavyColumn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full max-w-[340px] mx-auto py-8 px-4 flex flex-col items-center text-center select-none ${className}`}
    >
      {/* Silueta negra original al 30% de transparencia (como pide el usuario) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ELEGANT_ROSE_ASSETS.frostedBlurStrip}
        onError={(e) => {
          (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.frostedBlurStrip;
        }}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-fill opacity-30 pointer-events-none select-none"
      />
      {/* Contenido en primer plano */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}

export default function ElegantRoseTemplate({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const [lang, setLang] = useState<"en" | "es">(data.idiomaDefault === "en" ? "en" : "es");
  const template = getTemplate("ELEGANT_ROSE");
  const isEn = lang === "en";

  useEffect(() => {
    if (data.idiomaDefault === "en") setLang("en");
    else if (data.idiomaDefault === "es") setLang("es");
  }, [data.idiomaDefault]);

  const handleEnvelopeOpen = (selectedLang?: "es" | "en") => {
    if (selectedLang) {
      setLang(selectedLang);
    }
  };

  // Reproductor de audio embebido sincronizado
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleAudioEvent = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener("luminavite:play-audio", handleAudioEvent);
    return () => window.removeEventListener("luminavite:play-audio", handleAudioEvent);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Cuenta regresiva calculada en tiempo real
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = data.fechaEvento
        ? new Date(data.fechaEvento).getTime()
        : new Date("2026-07-18T16:00:00").getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [data.fechaEvento]);

  // Formulario RSVP interactivo con WhatsApp
  const [rsvpNombre, setRsvpNombre] = useState("");
  const [rsvpTelefono, setRsvpTelefono] = useState("");
  const [rsvpPases, setRsvpPases] = useState("2");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpNombre.trim()) return;

    const phone = (data.telefonoWhatsappRsvp || "").replace(/[^0-9]/g, "");
    let text = `${isEn ? "Hello! RSVP Confirmation for" : "¡Hola! Confirmación de asistencia para"} ${data.titulo}:\n\n`;
    text += `👤 ${isEn ? "Name" : "Nombre"}: ${rsvpNombre.trim()}\n`;
    if (rsvpTelefono.trim()) {
      text += `📱 ${isEn ? "Phone" : "Teléfono"}: ${rsvpTelefono.trim()}\n`;
    }
    text += `🎟️ ${isEn ? "Confirmed Passes" : "Pases Confirmados"}: ${rsvpPases}\n`;

    setRsvpSubmitted(true);

    if (phone) {
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank");
    }
  };

  const heroPhotoUrl = data.fotoPortadaUrl || ELEGANT_ROSE_ASSETS.heroPhoto;

  const hitos = [
    {
      foto: ELEGANT_ROSE_ASSETS.growingBaby,
      fecha: "2011",
      titulo: isEn ? "Baby Girl" : "Primeros Pasos",
      texto: isEn
        ? "Every story has a beginning, and mine started with the love of family, the comfort of home, and countless little moments that became treasured memories."
        : "Toda historia tiene un comienzo, y la mía comenzó rodeada del amor de mi familia, la calidez de mi hogar y un sinfín de pequeños recuerdos.",
    },
    {
      foto: ELEGANT_ROSE_ASSETS.growingChild,
      fecha: "2016",
      titulo: isEn ? "First Steps" : "Nuevas Aventuras",
      texto: isEn
        ? "With each new adventure came exciting firsts, growing confidence, and friendships that would become an important part of my journey."
        : "Cada nueva aventura trajo consigo emocionantes primeras experiencias, una confianza creciente y amistades que se convirtieron en parte de mi camino.",
    },
    {
      foto: ELEGANT_ROSE_ASSETS.growingPreteen,
      fecha: "2019",
      titulo: isEn ? "Special Bonds" : "Momentos Inolvidables",
      texto: isEn
        ? "From laughter-filled days to unforgettable memories, these special people helped shape the person I am today."
        : "Entre días llenos de risas y recuerdos inolvidables, estas personas tan especiales me ayudaron a convertirme en la persona que soy hoy.",
    },
    {
      foto: ELEGANT_ROSE_ASSETS.growingCompanion,
      fecha: "2022",
      titulo: isEn ? "Loyal Companion" : "Compañero Fiel",
      texto: isEn
        ? "Along the way, I discovered the things that inspire me, bring me joy, and help me become the best version of myself."
        : "En el camino, descubrí las cosas que me inspiran, me dan alegría y me motivan a ser la mejor versión de mí misma.",
    },
    {
      foto: heroPhotoUrl,
      fecha: "2026",
      titulo: isEn ? "Sweet Fifteen" : "Mis Quince Años",
      texto: isEn
        ? "And through every chapter, celebrating fifteen amazing years with all my loved ones—the best is yet to come."
        : "Celebrando quince años de recuerdos, sueños y momentos inolvidables… lo mejor está por venir.",
    },
  ];

  const corteHonor = data.corteHonorJson || {
    padrinos: ["Miguel Herrera", "Daniela Herrera"],
    chambelan: "Emilio Salazar",
    damas: [
      "Isabella Cordero",
      "Valeria Morales",
      "Sofia Villanueva",
      "Emilia Rodriguez",
      "Camila Aguilar",
      "Maria Paz Leon",
      "Alondra Jimenez",
      "Regina Castro",
      "Natalia Sanchez",
    ],
    chambelanes: [
      "Diego Alvarez",
      "Santiago Lopez",
      "Francisco Ruiz",
      "Mateo Ramírez",
      "Alejandro Torres",
    ],
  };

  const churchMapUrl = getMapDirectionsUrl(
    data.ceremoniaMapUrl,
    `${data.ceremoniaNombre || "St. Mary's Church"} ${data.ceremoniaDireccion || "Any City, Any Street, AZ 12345"}`.trim()
  );

  const ballroomMapUrl = getMapDirectionsUrl(
    data.recepcionMapUrl,
    `${data.recepcionNombre || "Grand Ballroom"} ${data.recepcionDireccion || "Any City, Any Street, AZ 12345"}`.trim()
  );



  // Datos formateados de fecha para el bloque de la portada
  const eventDate = data.fechaEvento ? new Date(data.fechaEvento) : new Date("2026-07-18T16:00:00");
  const monthName = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString(isEn ? "en-US" : "es-ES", { month: "long" }).toUpperCase()
    : (isEn ? "JULY" : "JULIO");
  const dayName = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString(isEn ? "en-US" : "es-ES", { weekday: "long" }).toUpperCase()
    : (isEn ? "SUNDAY" : "DOMINGO");
  const dayNumber = !isNaN(eventDate.getTime())
    ? String(eventDate.getDate())
    : "18";
  const eventTime = data.fechaTextoPersonalizada?.includes(":")
    ? data.fechaTextoPersonalizada.match(/\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?/)?.[0] || "4:00 PM"
    : "4:00 PM";

  return (
    <div className="min-h-screen flex justify-center bg-[#150D11] selection:bg-rose-300/30 antialiased font-['Montserrat',sans-serif]">
      {/* Audio Real */}
      {data.musicaUrl && (
        <audio
          ref={audioRef}
          src={data.musicaUrl}
          preload="auto"
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Intro del Sobre */}
      {!skipIntro && (
        <EnvelopeIntro
          titulo={data.titulo}
          tipoEvento={data.tipoEvento}
          fechaTexto={data.fechaTextoPersonalizada || (isEn ? "SUNDAY, JULY 18 • 4:00 PM" : "DOMINGO 18 DE JULIO • 4:00 PM")}
          template={template}
          coverPhotoUrl={heroPhotoUrl}
          idiomaDefault={data.idiomaDefault || "bilingual"}
          onOpen={handleEnvelopeOpen}
        />
      )}

      {/* Contenedor Principal Móvil (430px) */}
      <main className="relative w-full max-w-[430px] mx-auto min-h-screen text-white select-none overflow-x-hidden font-['Montserrat',sans-serif] shadow-2xl bg-[#1C1016]">
        {/* ══════════════════════════════════════════════════════════
            1. HERO SECTION: PORTADA EXACTA (SOPHIE DESIGN STUDIO)
               Silueta curva ondulada desde el borde superior absoluto (top-0),
               sin barra en el top, con resplandor blanco en la cursiva.
        ══════════════════════════════════════════════════════════ */}
        <section className="relative isolate w-full max-w-[430px] min-h-screen mx-auto overflow-hidden flex flex-col items-center justify-center text-center select-none pt-4 pb-10 px-4">
          {/* Foto de Fondo Maestra (La Quinceañera en Cuerpo Completo) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroPhotoUrl}
            onError={(e) => {
              (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.heroPhoto;
            }}
            alt={data.titulo}
            className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          />

          {/* Capa de Contraste Suave */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {/* ======================================================== */}
          {/* SILUETA CENTRAL ONDULADA DESDE EL TOPE ABSOLUTO (top-0)   */}
          {/* ======================================================== */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[340px] pointer-events-none select-none z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ELEGANT_ROSE_ASSETS.frostedBlurStrip}
              onError={(e) => {
                (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.frostedBlurStrip;
              }}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-fill opacity-30"
            />
          </div>

          {/* Selector de Idioma Flotante Minimalista (Discreto y sin barra fija) */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-black/35 backdrop-blur-md border border-white/30 rounded-full p-0.5 text-[9px] font-bold shadow-lg">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                isEn ? "bg-white text-[#8A5155] shadow-xs" : "text-white/80 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                !isEn ? "bg-white text-[#8A5155] shadow-xs" : "text-white/80 hover:text-white"
              }`}
            >
              ES
            </button>
          </div>

          {/* Contenido en Primer Plano */}
          <div className="relative z-10 w-full max-w-[340px] mx-auto py-4 px-2 flex flex-col items-center text-center select-none my-auto">
            {/* 1. Texto en Arco Curvo Superior (SVG textPath) con espacio amplio */}
            <div className="w-full flex justify-center -mb-2">
              <svg viewBox="0 0 380 70" className="w-[310px] sm:w-[340px] h-[55px] overflow-visible">
                <path id="curvePath" d="M 15,55 Q 190,12 365,55" fill="transparent" />
                <text className="font-['Cinzel'] text-[13px] sm:text-[14px] font-bold tracking-[0.22em] fill-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  <textPath href="#curvePath" startOffset="50%" textAnchor="middle">
                    {data.autorBendicion || data.corteHonorJson?.parents || "MR & MRS RODRÍGUEZ"}
                  </textPath>
                </text>
              </svg>
            </div>

            {/* 2. Subtítulos Superiores */}
            <p className="font-['Cinzel'] text-xs sm:text-sm tracking-[0.28em] uppercase text-white font-bold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {isEn ? "WARMLY INVITE YOU" : "LE INVITAN CORDIALMENTE"}
            </p>
            <p className="font-['Cinzel'] text-xs sm:text-sm tracking-[0.28em] uppercase text-white font-extrabold mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {isEn ? "TO CELEBRATE THE" : "A CELEBRAR LOS"}
            </p>

            {/* 3. Quinceañera con Resplandor Blanco */}
            <h1
              className="font-['Alex_Brush'] text-6xl sm:text-7xl text-white my-1 leading-tight select-none"
              style={{
                filter:
                  "drop-shadow(0 0 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 22px rgba(255, 255, 255, 0.65)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
              }}
            >
              Quinceañera
            </h1>

            {/* 4. Subtítulo Central */}
            <p className="font-['Cinzel'] text-xs sm:text-sm tracking-[0.3em] uppercase text-white font-bold my-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {isEn ? "OF THEIR DAUGHTER" : "DE SU HIJA"}
            </p>

            {/* 5. Nombre con Resplandor Blanco */}
            <h2
              className="font-['Alex_Brush'] text-5xl sm:text-6xl text-white my-2 leading-tight select-none"
              style={{
                filter:
                  "drop-shadow(0 0 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 22px rgba(255, 255, 255, 0.65)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
              }}
            >
              {data.titulo}
            </h2>

            {/* 6. Bloque de Fecha Horizontal Elegante */}
            <div className="w-full max-w-[300px] mx-auto mt-4 pt-2">
              {/* Mes Arqueado */}
              <div className="w-full flex justify-center -mb-1">
                <svg viewBox="0 0 180 38" className="w-32 h-7 overflow-visible">
                  <path id="curveMonth" d="M 12,32 Q 90,8 168,32" fill="transparent" />
                  <text className="font-['Cinzel'] text-[15px] font-bold tracking-[0.35em] fill-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    <textPath href="#curveMonth" startOffset="50%" textAnchor="middle">
                      {monthName}
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Barra Central con Doble Línea: Día de la Semana | Número | Hora */}
              <div className="flex items-center justify-between w-full my-1">
                <div className="flex-1 flex flex-col justify-center items-center px-1">
                  <div className="w-full border-t border-white/70 mb-1" />
                  <span className="font-['Cinzel'] text-xs sm:text-sm tracking-[0.22em] uppercase text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center">
                    {dayName}
                  </span>
                  <div className="w-full border-b border-white/70 mt-1" />
                </div>

                <div className="px-3 flex flex-col items-center">
                  <span className="font-['Cinzel'] text-5xl sm:text-6xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-none">
                    {dayNumber}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center px-1">
                  <div className="w-full border-t border-white/70 mb-1" />
                  <span className="font-['Cinzel'] text-xs sm:text-sm tracking-[0.22em] uppercase text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center">
                    {eventTime}
                  </span>
                  <div className="w-full border-b border-white/70 mt-1" />
                </div>
              </div>

              {/* Dirección / Locación */}
              <p className="font-['Cinzel'] text-xs sm:text-sm tracking-[0.22em] uppercase text-white font-bold mt-3 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {data.recepcionNombre || data.ceremoniaNombre || "ANY CITY, ANY STREET, AZ 12345"}
              </p>
              {data.recepcionDireccion && (
                <p className="font-['Cinzel'] text-xs sm:text-[13px] tracking-[0.18em] uppercase text-white font-semibold mt-1 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {data.recepcionDireccion}
                </p>
              )}

              {/* Botón Google Maps elegante y legible a juego con Canva */}
              <a
                href={churchMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 bg-[#BE8A87] hover:bg-[#b07b78] text-white font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-1.5 px-6 rounded-full font-bold shadow-md transition inline-block drop-shadow active:scale-95 cursor-pointer"
              >
                GOOGLE MAPS
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            2. REPRODUCTOR DE MÚSICA CON FONDO DE ROSAS BLANCAS
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.rosesBg})` }}
        >
          <WavyColumn>
            {/* Tarjeta Álbum Polaroid con Mariposas */}
            <div className="w-52 bg-white/90 p-3 rounded-2xl shadow-2xl border border-white text-stone-800 text-center relative group">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-rose-50 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroPhotoUrl}
                  alt="Track"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-['Cinzel'] text-xs sm:text-sm tracking-wider text-[#5A3E44] font-bold truncate">
                {data.musicaTitulo || "Photograph - Ed Sheeran"}
              </p>
              <p className="text-xs text-stone-600 font-medium truncate">
                {isEn ? "Official Quince Song" : "Canción Oficial"}
              </p>

              {/* Barra de progreso */}
              <div className="w-full bg-stone-200 h-1.5 rounded-full my-2.5 overflow-hidden">
                <div
                  className={`bg-[#CE8486] h-full ${
                    isPlaying ? "w-2/3 animate-pulse" : "w-1/3"
                  } transition-all duration-500`}
                />
              </div>

              {/* Botones de control */}
              <div className="flex items-center justify-center gap-5 text-stone-700 py-1">
                <button type="button" className="hover:text-stone-900 transition cursor-pointer">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-[#CE8486] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button type="button" className="hover:text-stone-900 transition cursor-pointer">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          </WavyColumn>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3. GROWING UP: CASTILLO & TIRAS DE PELÍCULA NEGATIVAS
        ══════════════════════════════════════════════════════════ */}
        <section
          id="growing-up"
          className="relative w-full bg-cover bg-top overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.castlePhoto})` }}
        >
          <WavyColumn className="py-12">
            <h3 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-rose-100 drop-shadow-md select-none leading-none">
              Growing
            </h3>
            <p className="font-['Alex_Brush'] text-4xl sm:text-5xl text-rose-200 drop-shadow-md select-none -mt-2">
              Up
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ELEGANT_ROSE_ASSETS.crown}
              alt="Corona"
              className="w-9 h-auto my-2.5 opacity-95 drop-shadow-md"
            />

            {/* Marcos de Tiras de Película Celuloide con Perforaciones y Mariposas */}
            <div className="space-y-12 w-full max-w-[280px] mt-6">
              {hitos.map((hito, idx) => (
                <div key={idx} className="text-center group">
                  {/* Marco Filmstrip Auténtico con Foto Integrada */}
                  <div className="relative w-full aspect-square max-w-[270px] mx-auto">
                    {/* Foto recortada dentro de la ventana de celuloide */}
                    <div className="absolute top-[13.5%] bottom-[13.5%] left-[4.5%] right-[4.5%] overflow-hidden bg-black flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={hito.foto}
                        alt={hito.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Marco de película fotográfica auténtica overlay */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ELEGANT_ROSE_ASSETS.polaroidFrame}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.polaroidFrame;
                      }}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-2xl"
                    />

                    {/* Mariposas de acuarela en las esquinas inferiores como en Canva */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ELEGANT_ROSE_ASSETS.churchIcon}
                      alt=""
                      className="absolute -bottom-2 -left-2 w-10 h-10 object-contain drop-shadow-lg -rotate-12 pointer-events-none"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ELEGANT_ROSE_ASSETS.dressIcon}
                      alt=""
                      className="absolute -bottom-2 -right-2 w-10 h-10 object-contain drop-shadow-lg rotate-12 pointer-events-none"
                    />
                  </div>

                  {/* Fecha elegante en Bodoni Moda itálica */}
                  <p className="font-['Bodoni_Moda',serif] italic text-2xl sm:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] mt-3">
                    {hito.fecha === "2011" ? "10-8-2012" : hito.fecha}
                  </p>

                  {/* Descripción altamente legible */}
                  <p className="font-['Cormorant_Garamond',serif] text-sm sm:text-[15px] text-white font-medium leading-relaxed mt-1.5 px-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {hito.texto}
                  </p>
                </div>
              ))}
            </div>

            {/* Frase Cierre Growing Up */}
            <div className="mt-10 border-t border-white/30 pt-4 w-full">
              <p className="font-['Cinzel'] text-xs sm:text-[13px] tracking-[0.2em] uppercase text-rose-100 font-bold leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                {isEn
                  ? "Celebrating Fifteen Amazing Years — The Best Is Yet to Come."
                  : "Celebrando Quince Años Inolvidables — Lo Mejor Está Por Venir."}
              </p>
            </div>
          </WavyColumn>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. THE COUNTDOWN CON FONDO DE ROSAS BLANCAS
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.rosesBg})` }}
        >
          <WavyColumn className="py-12">
            <h3 className="font-['Alex_Brush'] text-5xl text-rose-100 select-none">
              The Countdown
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ELEGANT_ROSE_ASSETS.crown}
              alt="Corona"
              className="w-7 h-auto my-1.5 opacity-90 drop-shadow"
            />
            <p className="font-['Cinzel'] text-xs sm:text-[13px] tracking-[0.25em] uppercase text-rose-100 font-bold mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              {isEn ? "TO SWEET QUINCE DAY HAS BEGUN!" : "¡RUMBO A LOS QUINCE AÑOS!"}
            </p>

            {/* 4 Píldoras de Cuenta Regresiva */}
            <div className="grid grid-cols-4 gap-2.5 w-full max-w-[300px]">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl py-3.5 border border-white/40 shadow-xl text-center">
                <span className="block font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-200 font-bold drop-shadow-sm mt-1 block">
                  {isEn ? "Days" : "Días"}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl py-3.5 border border-white/40 shadow-xl text-center">
                <span className="block font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-200 font-bold drop-shadow-sm mt-1 block">
                  {isEn ? "Hours" : "Horas"}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl py-3.5 border border-white/40 shadow-xl text-center">
                <span className="block font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-200 font-bold drop-shadow-sm mt-1 block">
                  {isEn ? "Mins" : "Min"}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl py-3.5 border border-white/40 shadow-xl text-center">
                <span className="block font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-200 font-bold drop-shadow-sm mt-1 block">
                  {isEn ? "Secs" : "Seg"}
                </span>
              </div>
            </div>

            <p className="font-['Alex_Brush'] text-3xl sm:text-4xl text-rose-100 mt-8 select-none drop-shadow-md">
              {isEn ? "I can’t wait to celebrate with you!" : "¡No puedo esperar para celebrar contigo!"}
            </p>
          </WavyColumn>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. THE BIG DAY / ITINERARIO SOBRE VESTIDO ROSA
               Réplica exacta de Canva (media_1791270959870.png)
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-bottom overflow-hidden select-none"
          style={{ backgroundImage: `url(${heroPhotoUrl})` }}
        >
          <WavyColumn className="py-12">
            {/* Header: The Day + Corona + Sparkle Dust */}
            <div className="relative w-full flex items-center justify-center pt-2 pb-6">
              {/* Sparkle dust across the header */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ELEGANT_ROSE_ASSETS.sparkleDust}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.sparkleDust;
                }}
                alt=""
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-[340px] max-w-none h-auto pointer-events-none opacity-85 select-none"
              />
              <div className="relative flex items-center justify-center gap-2.5 z-10">
                <h3
                  className="font-['Alex_Brush'] text-5xl sm:text-6xl text-white select-none leading-none"
                  style={{
                    filter:
                      "drop-shadow(0 0 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 22px rgba(255, 255, 255, 0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
                  }}
                >
                  The Day
                </h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ELEGANT_ROSE_ASSETS.crownHeader}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.crownHeader;
                  }}
                  alt="Crown"
                  className="w-12 sm:w-14 h-auto object-contain -mt-3 drop-shadow-md select-none"
                />
              </div>
            </div>

            {/* Contenedor de Itinerario */}
            <div className="w-full max-w-[310px] space-y-6 mt-2">
              {/* ────────────────────────────────────────────────────────── */}
              {/* 1. MASS (4:PM) - Izquierda: Texto | Derecha: Iglesia SVG  */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="flex flex-col items-center w-full">
                <div className="grid grid-cols-2 items-center gap-2 w-full text-center">
                  {/* Columna Izquierda: Hora + Divisor Oro + Título + Lugar */}
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-['Bodoni_Moda',serif] text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      4:PM
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ELEGANT_ROSE_ASSETS.goldDividerLine}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.goldDividerLine;
                      }}
                      alt=""
                      className="w-28 sm:w-32 h-auto my-1 object-contain"
                    />
                    <span className="font-['Bodoni_Moda',serif] text-base sm:text-lg font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      {isEn ? "MASS" : "MISA"}
                    </span>
                    <span className="font-['Bodoni_Moda',serif] text-[11px] sm:text-xs uppercase text-white font-medium tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] mt-1 px-1">
                      {data.ceremoniaNombre || (isEn ? "ST. MARY’S CHURCH, YOUR CITY, AZ" : "IGLESIA SANTA MARÍA, TU CIUDAD, AZ")}
                    </span>
                  </div>

                  {/* Columna Derecha: Iglesia Line Art Blanca */}
                  <div className="flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ELEGANT_ROSE_ASSETS.churchLineArt}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.churchLineArt;
                      }}
                      alt="Church"
                      className="w-24 sm:w-28 h-auto object-contain mx-auto drop-shadow-xl"
                    />
                  </div>
                </div>

                {/* Botón Google Maps Centrado */}
                <a
                  href={churchMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 bg-[#BE8A87] hover:bg-[#b07b78] text-white font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-1.5 px-6 rounded-full font-bold shadow-md transition inline-block drop-shadow active:scale-95 cursor-pointer"
                >
                  GOOGLE MAPS
                </a>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* 2. ENTRANCE (5:PM) - Izquierda: Vestido | Derecha: Texto   */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="flex flex-col items-center w-full pt-2">
                <div className="grid grid-cols-2 items-center gap-2 w-full text-center">
                  {/* Columna Izquierda: Vestido Quinceañera Rosa Espalda */}
                  <div className="flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ELEGANT_ROSE_ASSETS.dressIllustration}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.dressIllustration;
                      }}
                      alt="Quinceañera Dress"
                      className="w-28 sm:w-32 h-auto object-contain mx-auto drop-shadow-2xl"
                    />
                  </div>

                  {/* Columna Derecha: Hora + Divisor Oro + Título + Lugar */}
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-['Bodoni_Moda',serif] text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      5:PM
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ELEGANT_ROSE_ASSETS.goldDividerLine}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.goldDividerLine;
                      }}
                      alt=""
                      className="w-28 sm:w-32 h-auto my-1 object-contain"
                    />
                    <span className="font-['Bodoni_Moda',serif] text-base sm:text-lg font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      {isEn ? "ENTRANCE" : "RECEPCIÓN"}
                    </span>
                    <span className="font-['Bodoni_Moda',serif] text-[11px] sm:text-xs uppercase text-white font-medium tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] mt-1 px-1">
                      {data.recepcionNombre || (isEn ? "GRAND BALLROOM, YOUR CITY, AZ" : "SALÓN PRINCIPAL, TU CIUDAD, AZ")}
                    </span>
                  </div>
                </div>

                {/* Botón Google Maps Centrado */}
                <a
                  href={ballroomMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 bg-[#BE8A87] hover:bg-[#b07b78] text-white font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-1.5 px-6 rounded-full font-bold shadow-md transition inline-block drop-shadow active:scale-95 cursor-pointer"
                >
                  GOOGLE MAPS
                </a>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* 3. WALTZ (6:00 PM) - Pareja | Divisor Vertical Oro | Texto */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="flex items-center justify-between w-full pt-4">
                {/* Pareja Bailando Vals Oro */}
                <div className="flex-1 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELEGANT_ROSE_ASSETS.coupleIcon}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.coupleIcon;
                    }}
                    alt="Waltz"
                    className="w-20 sm:w-24 h-auto object-contain mx-auto drop-shadow-xl"
                  />
                </div>

                {/* Divisor Vertical Dorado con Rombo Central */}
                <div className="flex flex-col items-center justify-center mx-2 h-20 select-none pointer-events-none">
                  <div className="w-[1.5px] h-8 bg-gradient-to-b from-transparent to-[#e8c872]" />
                  <div className="w-2.5 h-2.5 rotate-45 border border-[#f5db94] bg-[#cda052] shadow-sm my-0.5" />
                  <div className="w-[1.5px] h-8 bg-gradient-to-t from-transparent to-[#e8c872]" />
                </div>

                {/* Hora + Divisor Oro + Título */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <span className="font-['Bodoni_Moda',serif] text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    6:00 PM
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELEGANT_ROSE_ASSETS.goldDividerLine}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.goldDividerLine;
                    }}
                    alt=""
                    className="w-28 sm:w-32 h-auto my-1 object-contain"
                  />
                  <span className="font-['Bodoni_Moda',serif] text-base sm:text-lg font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {isEn ? "WALTZ" : "VALS"}
                  </span>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* 4. DINNER (7:00 PM) - Plato Floral Oro | Divisor | Texto   */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 items-center gap-2 w-full text-center pt-3">
                {/* Plato y Cubiertos con Flores en Oro */}
                <div className="flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELEGANT_ROSE_ASSETS.ballroomIcon}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.ballroomIcon;
                    }}
                    alt="Dinner"
                    className="w-24 sm:w-28 h-auto object-contain mx-auto drop-shadow-xl"
                  />
                </div>

                {/* Hora + Divisor Oro + Título */}
                <div className="flex flex-col items-center justify-center">
                  <span className="font-['Bodoni_Moda',serif] text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    7:00 PM
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELEGANT_ROSE_ASSETS.goldDividerLine}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.goldDividerLine;
                    }}
                    alt=""
                    className="w-28 sm:w-32 h-auto my-1 object-contain"
                  />
                  <span className="font-['Bodoni_Moda',serif] text-base sm:text-lg font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {isEn ? "DINNER" : "CENA"}
                  </span>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* 5. PARTY (9:00 PM) - Bola Disco Oro | Divisor | Texto     */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 items-center gap-2 w-full text-center pt-3 pb-2">
                {/* Bola Disco / Destellos en Oro */}
                <div className="flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELEGANT_ROSE_ASSETS.musicIcon}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.musicIcon;
                    }}
                    alt="Party"
                    className="w-20 sm:w-24 h-auto object-contain mx-auto drop-shadow-xl"
                  />
                </div>

                {/* Hora + Divisor Oro + Título */}
                <div className="flex flex-col items-center justify-center">
                  <span className="font-['Bodoni_Moda',serif] text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    9:00 PM
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELEGANT_ROSE_ASSETS.goldDividerLine}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ELEGANT_ROSE_ASSETS.s3.goldDividerLine;
                    }}
                    alt=""
                    className="w-28 sm:w-32 h-auto my-1 object-contain"
                  />
                  <span className="font-['Bodoni_Moda',serif] text-base sm:text-lg font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {isEn ? "PARTY" : "FIESTA"}
                  </span>
                </div>
              </div>
            </div>
          </WavyColumn>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. CORTE DE HONOR CON FONDO DE ROSAS CREMA
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.peachBg})` }}
        >
          <WavyColumn className="py-12">
            {/* Padrinos */}
            <h3 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-rose-100 select-none drop-shadow-md">
              Padrinos
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ELEGANT_ROSE_ASSETS.crown} alt="Crown" className="w-7 h-auto my-1.5 opacity-90 drop-shadow" />
            <p className="font-['Cinzel'] text-sm sm:text-base uppercase tracking-widest text-white font-bold mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              {corteHonor.padrinos?.join(" & ") || "Miguel & Daniela Herrera"}
            </p>

            {/* Quince Court */}
            <h3 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-rose-100 select-none drop-shadow-md">
              Quince Court
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ELEGANT_ROSE_ASSETS.crown} alt="Crown" className="w-7 h-auto my-1.5 opacity-90 drop-shadow" />
            <p className="font-['Cinzel'] text-sm sm:text-base uppercase tracking-widest text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              {corteHonor.chambelan || "Emilio Salazar"}
            </p>
            <p className="font-['Cinzel'] text-xs sm:text-[13px] tracking-widest uppercase text-rose-200 mb-6 font-semibold drop-shadow-sm">
              CHAMBERLAIN OF HONOR
            </p>

            {/* Damas */}
            <p className="font-['Cinzel'] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-rose-200 mt-3 mb-2 drop-shadow-sm">
              DAMAS
            </p>
            <div className="space-y-1 text-xs sm:text-sm font-['Cinzel'] tracking-wider text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              {corteHonor.damas?.map((dama: string, i: number) => (
                <p key={i}>{dama}</p>
              ))}
            </div>

            {/* Chambelanes */}
            <p className="font-['Cinzel'] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-rose-200 mt-6 mb-2 drop-shadow-sm">
              CHAMBELANES
            </p>
            <div className="space-y-1 text-xs sm:text-sm font-['Cinzel'] tracking-wider text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              {corteHonor.chambelanes?.map((chambelan: string, i: number) => (
                <p key={i}>{chambelan}</p>
              ))}
            </div>
          </WavyColumn>
        </section>

        {/* ══════════════════════════════════════════════════════════
            7. DETAILS CON FONDO DE BOUQUET DE ROSAS
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.bouquetBg})` }}
        >
          <WavyColumn className="py-12">
            <h3 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-rose-100 select-none drop-shadow-md">
              Details
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ELEGANT_ROSE_ASSETS.crown} alt="Crown" className="w-7 h-auto my-1.5 opacity-90 drop-shadow" />

            {/* Dress Code */}
            <div className="mt-6 mb-6">
              <p className="font-['Cinzel'] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-rose-200 drop-shadow-sm">
                DRESS CODE
              </p>
              <div className="w-24 h-auto mx-auto my-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ELEGANT_ROSE_ASSETS.dressIllustration}
                  alt="Dress Code"
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
              <p className="font-['Cinzel'] text-xs sm:text-sm tracking-wider uppercase text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                FORMAL & ELEGANT ATTIRE
              </p>
              <p className="text-xs sm:text-[13px] text-white font-medium max-w-[280px] mx-auto leading-relaxed mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                We invite our guests to dress in elegant formal attire as we celebrate this special occasion together.
              </p>
            </div>

            {/* Gifts */}
            <div className="my-6">
              <p className="font-['Cinzel'] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-rose-200 drop-shadow-sm">
                GIFTS
              </p>
              <div className="w-40 h-auto mx-auto my-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ELEGANT_ROSE_ASSETS.heartDivider}
                  alt="Gifts"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <p className="text-xs sm:text-[13px] text-white font-medium max-w-[280px] mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                Your presence is the greatest gift we could ask for. If you’d like to celebrate with a gift, we invite you to browse our wishlist below.
              </p>
              {data.wishlistUrl && (
                <a
                  href={data.wishlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3.5 bg-white/25 border border-white/60 text-white font-['Cinzel'] text-[10px] sm:text-xs tracking-[0.2em] uppercase py-2 px-6 rounded-full hover:bg-white/40 transition font-semibold shadow-md backdrop-blur-sm drop-shadow"
                >
                  WISHLIST
                </a>
              )}
            </div>

            {/* Accommodation */}
            <div className="my-6">
              <p className="font-['Cinzel'] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-rose-200 drop-shadow-sm">
                ACCOMMODATION
              </p>
              <p className="text-xs sm:text-[13px] text-white font-medium max-w-[280px] mx-auto leading-relaxed mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                A room block has been reserved for our guests. Please contact us for reservation details and booking information.
              </p>
            </div>

            {/* Thank you */}
            <div className="mt-8 pt-4 border-t border-white/30 w-full">
              <p className="font-['Cinzel'] text-xs sm:text-[13px] tracking-widest uppercase text-white/95 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-semibold">
                We can’t wait to celebrate with you!
              </p>
              <h4 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-rose-100 select-none drop-shadow-md">
                Thank you!
              </h4>
            </div>
          </WavyColumn>
        </section>

        {/* ══════════════════════════════════════════════════════════
            8. PLEASE RSVP CON FONDO DE PÉTALOS DE ROSA
        ══════════════════════════════════════════════════════════ */}
        <section
          id="rsvp"
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.petalsBg})` }}
        >
          <WavyColumn className="py-12">
            <h3 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-rose-100 select-none drop-shadow-md">
              Please
            </h3>

            {/* Letras Doradas Gigantes RSVP */}
            <h2 className="font-['Cinzel'] text-6xl sm:text-7xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-300 my-1 drop-shadow-lg">
              RSVP
            </h2>

            <p className="font-['Cinzel'] text-xs sm:text-[13px] tracking-widest uppercase text-rose-100 mb-6 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              {data.rsvpFechaLimite || data.fechaLimiteRsvp || (isEn ? "BY JUNE 20TH" : "ANTES DEL 20 DE JUNIO")}
            </p>

            {rsvpSubmitted ? (
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/40 animate-fade-in text-center w-full max-w-[280px] shadow-xl">
                <Check className="w-9 h-9 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-['Cinzel'] text-sm font-bold text-white tracking-wider uppercase drop-shadow-sm">
                  {isEn ? "Thank you for confirming!" : "¡Gracias por confirmar!"}
                </h4>
                <p className="font-['Cinzel'] text-xs text-rose-100 mt-1.5 drop-shadow-sm">
                  {isEn ? "Your response was sent via WhatsApp." : "Tu respuesta ha sido enviada por WhatsApp."}
                </p>
                <button
                  type="button"
                  onClick={() => setRsvpSubmitted(false)}
                  className="mt-3.5 text-xs uppercase font-['Cinzel'] tracking-wider text-rose-200 underline font-semibold cursor-pointer hover:text-white transition"
                >
                  {isEn ? "Modify confirmation" : "Modificar respuesta"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3.5 w-full max-w-[280px] text-left">
                <div>
                  <label className="block font-['Cinzel'] text-[10px] sm:text-xs tracking-wider text-rose-200 uppercase mb-1 font-bold drop-shadow-sm">
                    {isEn ? "Full Name *" : "Nombre Completo *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpNombre}
                    onChange={(e) => setRsvpNombre(e.target.value)}
                    placeholder={isEn ? "e.g. Maria Perez" : "Ej. María Pérez"}
                    className="w-full bg-black/40 border border-white/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:border-rose-300 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block font-['Cinzel'] text-[10px] sm:text-xs tracking-wider text-rose-200 uppercase mb-1 font-bold drop-shadow-sm">
                    {isEn ? "Mobile Phone *" : "Teléfono Móvil *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={rsvpTelefono}
                    onChange={(e) => setRsvpTelefono(e.target.value)}
                    placeholder={isEn ? "e.g. +1 818 123 4567" : "Ej. 818 123 4567"}
                    className="w-full bg-black/40 border border-white/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:border-rose-300 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block font-['Cinzel'] text-[10px] sm:text-xs tracking-wider text-rose-200 uppercase mb-1 font-bold drop-shadow-sm">
                    {isEn ? "Confirmed Passes" : "Pases Confirmados"}
                  </label>
                  <select
                    value={rsvpPases}
                    onChange={(e) => setRsvpPases(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-300"
                  >
                    <option value="1">1 {isEn ? "Pass" : "Pase"}</option>
                    <option value="2">2 {isEn ? "Passes" : "Pases"}</option>
                    <option value="3">3 {isEn ? "Passes" : "Pases"}</option>
                    <option value="4">4 {isEn ? "Passes" : "Pases"}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white/25 hover:bg-white/35 border border-white/60 text-white font-['Cinzel'] text-xs sm:text-[13px] tracking-[0.25em] uppercase py-3.5 rounded-xl font-bold shadow-xl transition-all mt-4 cursor-pointer flex items-center justify-center gap-2 drop-shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>{isEn ? "CONFIRM VIA WHATSAPP" : "CONFIRMAR POR WHATSAPP"}</span>
                </button>
              </form>
            )}
          </WavyColumn>
        </section>
      </main>
    </div>
  );
}
