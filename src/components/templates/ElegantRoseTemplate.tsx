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
        {/* Switch de Idioma Superior Flotante */}
        <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-md px-5 py-2 flex justify-between items-center border-b border-white/10">
          <span className="font-['Cinzel'] text-[10px] tracking-widest text-rose-200 font-semibold">
            {data.titulo.toUpperCase()} • XV
          </span>

          <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full p-0.5 text-[9px] font-bold">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                isEn ? "bg-white/30 text-white shadow-xs" : "text-white/60 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                !isEn ? "bg-white/30 text-white shadow-xs" : "text-white/60 hover:text-white"
              }`}
            >
              ES
            </button>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════
            1. HERO SECTION: PORTADA SOBRE VESTIDO ROSA
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-top overflow-hidden"
          style={{ backgroundImage: `url(${heroPhotoUrl})` }}
        >
          {/* Columna Central Esmerilada */}
          <div className="w-full max-w-[340px] mx-auto bg-black/40 backdrop-blur-[8px] border-x border-white/20 px-4 pt-12 pb-14 flex flex-col items-center text-center">
            {/* Texto Arqueado "YOU ARE CORDIALLY" */}
            <div className="w-full flex justify-center -mb-2">
              <svg viewBox="0 0 300 50" className="w-60 h-10 overflow-visible">
                <path id="curve-hero" d="M 20 40 Q 150 12 280 40" fill="transparent" />
                <text className="text-[10px] uppercase font-bold tracking-[0.3em] fill-rose-100 font-['Cinzel']">
                  <textPath href="#curve-hero" startOffset="50%" textAnchor="middle">
                    YOU ARE CORDIALLY
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Corona Tiara Dorada */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ELEGANT_ROSE_ASSETS.crown}
              alt="Corona"
              className="w-10 h-auto my-1 drop-shadow"
            />

            {/* "Quinceañera" Cursiva */}
            <h1 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-white my-0.5 drop-shadow-md select-none">
              Quinceañera
            </h1>

            <p className="font-['Cinzel'] text-[9px] tracking-[0.25em] uppercase text-rose-100 font-semibold my-1">
              {isEn ? "OF THEIR DAUGHTER" : "DE SU HIJA"}
            </p>

            {/* Nombre */}
            <h2 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-rose-100 my-1 drop-shadow-md select-none">
              {data.titulo}
            </h2>

            {/* Bloque de Fecha Elegante */}
            <div className="my-5 border-y border-white/30 py-3 w-48">
              <p className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-rose-200">
                {isEn ? "SUNDAY" : "DOMINGO"}
              </p>
              <span className="block font-['Cinzel'] text-4xl font-bold text-white tracking-widest my-0.5 drop-shadow-sm">
                18
              </span>
              <p className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-rose-200">
                {isEn ? "JULY • 2026" : "JULIO • 2026"}
              </p>
            </div>

            <p className="font-['Cinzel'] text-[10px] tracking-widest text-white/90">
              4:00 PM • {data.ceremoniaNombre || "ST. MARY'S CHURCH"}
            </p>

            <a
              href={churchMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-white/20 border border-white/50 text-white font-['Cinzel'] text-[9px] tracking-[0.25em] uppercase py-2 px-6 rounded-full hover:bg-white/30 transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3 h-3" />
              <span>GOOGLE MAPS</span>
            </a>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            2. REPRODUCTOR DE MÚSICA CON FONDO DE ROSAS BLANCAS
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.rosesBg})` }}
        >
          <div className="w-full max-w-[340px] mx-auto bg-black/45 backdrop-blur-[8px] border-x border-white/20 px-4 py-8 flex flex-col items-center text-center">
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

              <p className="font-['Cinzel'] text-[10px] tracking-wider text-[#5A3E44] font-bold truncate">
                {data.musicaTitulo || "Photograph - Ed Sheeran"}
              </p>
              <p className="text-[9px] text-stone-500 font-light truncate">
                {isEn ? "Official Quince Song" : "Canción Oficial"}
              </p>

              {/* Barra de progreso */}
              <div className="w-full bg-stone-200 h-1 rounded-full my-2 overflow-hidden">
                <div
                  className={`bg-[#CE8486] h-full ${
                    isPlaying ? "w-2/3 animate-pulse" : "w-1/3"
                  } transition-all duration-500`}
                />
              </div>

              {/* Botones de control */}
              <div className="flex items-center justify-center gap-4 text-stone-600">
                <button type="button" className="hover:text-stone-900 transition cursor-pointer">
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-[#CE8486] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
                <button type="button" className="hover:text-stone-900 transition cursor-pointer">
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3. GROWING UP: CASTILLO & TIRAS DE PELÍCULA NEGATIVAS
        ══════════════════════════════════════════════════════════ */}
        <section
          id="growing-up"
          className="relative w-full bg-cover bg-top overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.castlePhoto})` }}
        >
          <div className="w-full max-w-[340px] mx-auto bg-black/45 backdrop-blur-[8px] border-x border-white/20 px-4 py-12 flex flex-col items-center text-center">
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
              className="w-8 h-auto my-2 opacity-90 drop-shadow"
            />

            {/* 5 Marcos de Tiras de Película Celuloide con Perforaciones */}
            <div className="space-y-10 w-full max-w-[270px] mt-6">
              {hitos.map((hito, idx) => (
                <div key={idx} className="text-center group">
                  {/* Marco Filmstrip */}
                  <div className="bg-black p-2 border-y-4 border-dashed border-white/60 shadow-2xl rounded-sm">
                    <div className="aspect-square w-full overflow-hidden bg-neutral-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={hito.foto}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={hito.titulo}
                      />
                    </div>
                  </div>

                  {/* Etiqueta y texto */}
                  <span className="inline-block font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase text-rose-200 font-semibold mt-3">
                    {hito.fecha} • {hito.titulo}
                  </span>
                  <p className="font-['Cinzel'] text-[9px] text-white/80 italic tracking-wider leading-relaxed mt-1 px-1">
                    {hito.texto}
                  </p>
                </div>
              ))}
            </div>

            {/* Frase Cierre Growing Up */}
            <div className="mt-10 border-t border-white/30 pt-4 w-full">
              <p className="font-['Cinzel'] text-[9px] tracking-[0.2em] uppercase text-rose-200 font-semibold leading-relaxed">
                Celebrating Fifteen Amazing Years — The Best Is Yet to Come.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. THE COUNTDOWN CON FONDO DE ROSAS BLANCAS
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.rosesBg})` }}
        >
          <div className="w-full max-w-[340px] mx-auto bg-black/45 backdrop-blur-[8px] border-x border-white/20 px-4 py-12 flex flex-col items-center text-center">
            <h3 className="font-['Alex_Brush'] text-5xl text-rose-100 select-none">
              The Countdown
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ELEGANT_ROSE_ASSETS.crown}
              alt="Corona"
              className="w-7 h-auto my-1.5 opacity-90 drop-shadow"
            />
            <p className="font-['Cinzel'] text-[9px] tracking-[0.25em] uppercase text-rose-200 font-semibold mb-6">
              TO SWEET QUINCE DAY HAS BEGUN!
            </p>

            {/* 4 Píldoras de Cuenta Regresiva */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-[280px]">
              <div className="bg-white/15 backdrop-blur-md rounded-xl py-3 border border-white/25 shadow-lg">
                <span className="block font-['Cinzel'] text-2xl font-bold text-white">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-rose-200 font-semibold">
                  {isEn ? "Days" : "Días"}
                </span>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-xl py-3 border border-white/25 shadow-lg">
                <span className="block font-['Cinzel'] text-2xl font-bold text-white">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-rose-200 font-semibold">
                  {isEn ? "Hours" : "Horas"}
                </span>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-xl py-3 border border-white/25 shadow-lg">
                <span className="block font-['Cinzel'] text-2xl font-bold text-white">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-rose-200 font-semibold">
                  {isEn ? "Mins" : "Min"}
                </span>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-xl py-3 border border-white/25 shadow-lg">
                <span className="block font-['Cinzel'] text-2xl font-bold text-white">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-rose-200 font-semibold">
                  {isEn ? "Secs" : "Seg"}
                </span>
              </div>
            </div>

            <p className="font-['Alex_Brush'] text-2xl text-rose-100 mt-6 select-none">
              {isEn ? "I can’t wait to celebrate with you!" : "¡No puedo esperar para celebrar contigo!"}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. THE BIG DAY / ITINERARIO SOBRE VESTIDO ROSA
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-bottom overflow-hidden"
          style={{ backgroundImage: `url(${heroPhotoUrl})` }}
        >
          <div className="w-full max-w-[340px] mx-auto bg-black/45 backdrop-blur-[8px] border-x border-white/20 px-4 py-12 flex flex-col items-center text-center">
            <h3 className="font-['Alex_Brush'] text-5xl text-white select-none">
              The Day
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ELEGANT_ROSE_ASSETS.crown}
              alt="Corona"
              className="w-7 h-auto my-1.5 opacity-90 drop-shadow"
            />
            <p className="font-['Cinzel'] text-[9px] tracking-[0.25em] uppercase text-rose-200 mb-8 font-semibold">
              {isEn ? "PROGRAM OF THE BIG DAY" : "PROGRAMA DEL EVENTO"}
            </p>

            <div className="space-y-6 w-full max-w-[280px]">
              {/* 4:00 PM Misa */}
              <div className="flex flex-col items-center">
                <span className="font-['Cinzel'] text-xs font-bold text-rose-200 tracking-wider">
                  4:00 PM
                </span>
                <div className="w-10 h-10 my-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ELEGANT_ROSE_ASSETS.churchIcon} alt="Church" className="w-full h-full object-contain filter invert brightness-200" />
                </div>
                <p className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-white font-semibold">
                  MASS
                </p>
                <p className="text-[9px] text-white/80 font-light">
                  {data.ceremoniaNombre || "St. Mary’s Church, your city, az"}
                </p>
                <a
                  href={churchMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 bg-white/20 border border-white/40 text-white font-['Cinzel'] text-[8px] tracking-[0.2em] uppercase py-1 px-4 rounded-full hover:bg-white/30 transition"
                >
                  GOOGLE MAPS
                </a>
              </div>

              {/* 5:00 PM Entrada / Recepción */}
              <div className="flex flex-col items-center pt-2">
                <span className="font-['Cinzel'] text-xs font-bold text-rose-200 tracking-wider">
                  5:00 PM
                </span>
                <div className="w-10 h-10 my-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ELEGANT_ROSE_ASSETS.dressIcon} alt="Entrance" className="w-full h-full object-contain filter invert brightness-200" />
                </div>
                <p className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-white font-semibold">
                  ENTRANCE
                </p>
                <p className="text-[9px] text-white/80 font-light">
                  {data.recepcionNombre || "Grand Ballroom, your city, az"}
                </p>
                <a
                  href={ballroomMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 bg-white/20 border border-white/40 text-white font-['Cinzel'] text-[8px] tracking-[0.2em] uppercase py-1 px-4 rounded-full hover:bg-white/30 transition"
                >
                  GOOGLE MAPS
                </a>
              </div>

              {/* 6:00 PM Vals */}
              <div className="flex flex-col items-center pt-2">
                <span className="font-['Cinzel'] text-xs font-bold text-rose-200 tracking-wider">
                  6:00 PM
                </span>
                <div className="w-10 h-10 my-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ELEGANT_ROSE_ASSETS.waltzIcon} alt="Waltz" className="w-full h-full object-contain filter invert brightness-200" />
                </div>
                <p className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-white font-semibold">
                  WALTZ
                </p>
              </div>

              {/* 7:00 PM Cena */}
              <div className="flex flex-col items-center pt-2">
                <span className="font-['Cinzel'] text-xs font-bold text-rose-200 tracking-wider">
                  7:00 PM
                </span>
                <div className="w-10 h-10 my-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ELEGANT_ROSE_ASSETS.ballroomIcon} alt="Dinner" className="w-full h-full object-contain filter invert brightness-200" />
                </div>
                <p className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-white font-semibold">
                  DINNER
                </p>
              </div>

              {/* 9:00 PM Fiesta */}
              <div className="flex flex-col items-center pt-2">
                <span className="font-['Cinzel'] text-xs font-bold text-rose-200 tracking-wider">
                  9:00 PM
                </span>
                <div className="w-10 h-10 my-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ELEGANT_ROSE_ASSETS.musicIcon} alt="Party" className="w-full h-full object-contain filter invert brightness-200" />
                </div>
                <p className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-white font-semibold">
                  PARTY
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. CORTE DE HONOR CON FONDO DE ROSAS CREMA
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.peachBg})` }}
        >
          <div className="w-full max-w-[340px] mx-auto bg-black/45 backdrop-blur-[8px] border-x border-white/20 px-4 py-12 flex flex-col items-center text-center">
            {/* Padrinos */}
            <h3 className="font-['Alex_Brush'] text-5xl text-rose-100 select-none">
              Padrinos
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ELEGANT_ROSE_ASSETS.crown} alt="Crown" className="w-6 h-auto my-1 drop-shadow" />
            <p className="font-['Cinzel'] text-xs uppercase tracking-widest text-white font-semibold mb-8">
              {corteHonor.padrinos?.join(" & ") || "Miguel & Daniela Herrera"}
            </p>

            {/* Quince Court */}
            <h3 className="font-['Alex_Brush'] text-5xl text-rose-100 select-none">
              Quince Court
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ELEGANT_ROSE_ASSETS.crown} alt="Crown" className="w-6 h-auto my-1 drop-shadow" />
            <p className="font-['Cinzel'] text-xs uppercase tracking-widest text-white font-semibold">
              {corteHonor.chambelan || "Emilio Salazar"}
            </p>
            <p className="font-['Cinzel'] text-[9px] tracking-widest uppercase text-rose-200 mb-6">
              CHAMBERLAIN OF HONOR
            </p>

            {/* Damas */}
            <p className="font-['Cinzel'] text-[11px] font-bold tracking-[0.2em] uppercase text-rose-200 mt-2 mb-2">
              DAMAS
            </p>
            <div className="space-y-0.5 text-xs font-['Cinzel'] tracking-wider text-white/90">
              {corteHonor.damas?.map((dama: string, i: number) => (
                <p key={i}>{dama}</p>
              ))}
            </div>

            {/* Chambelanes */}
            <p className="font-['Cinzel'] text-[11px] font-bold tracking-[0.2em] uppercase text-rose-200 mt-6 mb-2">
              CHAMBELANES
            </p>
            <div className="space-y-0.5 text-xs font-['Cinzel'] tracking-wider text-white/90">
              {corteHonor.chambelanes?.map((chambelan: string, i: number) => (
                <p key={i}>{chambelan}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            7. DETAILS CON FONDO DE BOUQUET DE ROSAS
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.bouquetBg})` }}
        >
          <div className="w-full max-w-[340px] mx-auto bg-black/45 backdrop-blur-[8px] border-x border-white/20 px-4 py-12 flex flex-col items-center text-center">
            <h3 className="font-['Alex_Brush'] text-5xl text-rose-100 select-none">
              Details
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ELEGANT_ROSE_ASSETS.crown} alt="Crown" className="w-6 h-auto my-1 drop-shadow" />

            {/* Dress Code */}
            <div className="mt-6 mb-6">
              <p className="font-['Cinzel'] text-xs font-bold tracking-[0.2em] uppercase text-rose-200">
                DRESS CODE
              </p>
              <div className="w-10 h-10 mx-auto my-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ELEGANT_ROSE_ASSETS.dressIcon} alt="Dress" className="w-full h-full object-contain filter invert brightness-200" />
              </div>
              <p className="font-['Cinzel'] text-[10px] tracking-wider uppercase text-white font-semibold">
                FORMAL & ELEGANT ATTIRE
              </p>
              <p className="text-[9px] text-white/80 font-light max-w-[260px] mx-auto leading-relaxed mt-1">
                We invite our guests to dress in elegant formal attire as we celebrate this special occasion together.
              </p>
            </div>

            {/* Gifts */}
            <div className="my-6">
              <p className="font-['Cinzel'] text-xs font-bold tracking-[0.2em] uppercase text-rose-200">
                GIFTS
              </p>
              <div className="w-10 h-10 mx-auto my-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ELEGANT_ROSE_ASSETS.giftIcon} alt="Gift" className="w-full h-full object-contain filter invert brightness-200" />
              </div>
              <p className="text-[9px] text-white/80 font-light max-w-[260px] mx-auto leading-relaxed">
                Your presence is the greatest gift we could ask for. If you’d like to celebrate with a gift, we invite you to browse our wishlist below.
              </p>
              {data.wishlistUrl && (
                <a
                  href={data.wishlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 bg-white/20 border border-white/40 text-white font-['Cinzel'] text-[8px] tracking-[0.2em] uppercase py-1.5 px-5 rounded-full hover:bg-white/30 transition"
                >
                  WISHLIST
                </a>
              )}
            </div>

            {/* Accommodation */}
            <div className="my-6">
              <p className="font-['Cinzel'] text-xs font-bold tracking-[0.2em] uppercase text-rose-200">
                ACCOMMODATION
              </p>
              <p className="text-[9px] text-white/80 font-light max-w-[260px] mx-auto leading-relaxed mt-1">
                A room block has been reserved for our guests. Please contact us for reservation details and booking information.
              </p>
            </div>

            {/* Thank you */}
            <div className="mt-6 pt-4 border-t border-white/30 w-full">
              <p className="font-['Cinzel'] text-[9px] tracking-widest uppercase text-white/80 mb-2">
                We can’t wait to celebrate with you!
              </p>
              <h4 className="font-['Alex_Brush'] text-4xl text-rose-100 select-none">
                Thank you!
              </h4>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            8. PLEASE RSVP CON FONDO DE PÉTALOS DE ROSA
        ══════════════════════════════════════════════════════════ */}
        <section
          id="rsvp"
          className="relative w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${ELEGANT_ROSE_ASSETS.petalsBg})` }}
        >
          <div className="w-full max-w-[340px] mx-auto bg-black/50 backdrop-blur-[8px] border-x border-white/20 px-4 py-12 flex flex-col items-center text-center">
            <h3 className="font-['Alex_Brush'] text-5xl text-rose-100 select-none">
              Please
            </h3>

            {/* Letras Doradas Gigantes RSVP */}
            <h2 className="font-['Cinzel'] text-6xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-300 my-1 drop-shadow-md">
              RSVP
            </h2>

            <p className="font-['Cinzel'] text-[9px] tracking-widest uppercase text-rose-200 mb-6 font-semibold">
              {data.rsvpFechaLimite || data.fechaLimiteRsvp || (isEn ? "BY JUNE 20TH" : "ANTES DEL 20 DE JUNIO")}
            </p>

            {rsvpSubmitted ? (
              <div className="bg-white/15 p-5 rounded-xl border border-white/30 animate-fade-in text-center w-full max-w-[270px]">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-['Cinzel'] text-xs font-bold text-white tracking-wider uppercase">
                  {isEn ? "Thank you for confirming!" : "¡Gracias por confirmar!"}
                </h4>
                <p className="font-['Cinzel'] text-[10px] text-rose-200/90 mt-1">
                  {isEn ? "Your response was sent via WhatsApp." : "Tu respuesta ha sido enviada por WhatsApp."}
                </p>
                <button
                  type="button"
                  onClick={() => setRsvpSubmitted(false)}
                  className="mt-3 text-[10px] uppercase font-['Cinzel'] tracking-wider text-rose-300 underline font-semibold cursor-pointer"
                >
                  {isEn ? "Modify confirmation" : "Modificar respuesta"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3 w-full max-w-[270px] text-left">
                <div>
                  <label className="block font-['Cinzel'] text-[8px] tracking-wider text-rose-200 uppercase mb-1 font-semibold">
                    {isEn ? "Full Name *" : "Nombre Completo *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpNombre}
                    onChange={(e) => setRsvpNombre(e.target.value)}
                    placeholder={isEn ? "e.g. Maria Perez" : "Ej. María Pérez"}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-rose-300"
                  />
                </div>

                <div>
                  <label className="block font-['Cinzel'] text-[8px] tracking-wider text-rose-200 uppercase mb-1 font-semibold">
                    {isEn ? "Mobile Phone *" : "Teléfono Móvil *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={rsvpTelefono}
                    onChange={(e) => setRsvpTelefono(e.target.value)}
                    placeholder={isEn ? "e.g. +1 818 123 4567" : "Ej. 818 123 4567"}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-rose-300"
                  />
                </div>

                <div>
                  <label className="block font-['Cinzel'] text-[8px] tracking-wider text-rose-200 uppercase mb-1 font-semibold">
                    {isEn ? "Confirmed Passes" : "Pases Confirmados"}
                  </label>
                  <select
                    value={rsvpPases}
                    onChange={(e) => setRsvpPases(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-300"
                  >
                    <option value="1">1 {isEn ? "Pass" : "Pase"}</option>
                    <option value="2">2 {isEn ? "Passes" : "Pases"}</option>
                    <option value="3">3 {isEn ? "Passes" : "Pases"}</option>
                    <option value="4">4 {isEn ? "Passes" : "Pases"}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white/20 hover:bg-white/30 border border-white/50 text-white font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase py-3 rounded-lg font-semibold shadow-lg transition-all mt-4 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEn ? "CONFIRM VIA WHATSAPP" : "CONFIRMAR POR WHATSAPP"}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
