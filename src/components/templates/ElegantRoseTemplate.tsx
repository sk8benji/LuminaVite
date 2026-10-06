"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Gift,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  Play,
  Pause,
  Music,
  Hotel,
  Share2,
  Users,
  Check,
  Send,
} from "lucide-react";
import { getTemplate } from "@/lib/templates";
import { getMapEmbedUrl, getMapDirectionsUrl } from "@/lib/maps";
import { ELEGANT_ROSE_ASSETS } from "@/lib/templates/elegantRoseAssets";
import AudioPlayer from "../invitation/AudioPlayer";
import AddToCalendarButton from "../invitation/AddToCalendarButton";
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

  // Sincronizar idioma si cambia idiomaDefault
  useEffect(() => {
    if (data.idiomaDefault === "en") setLang("en");
    else if (data.idiomaDefault === "es") setLang("es");
  }, [data.idiomaDefault]);

  // Manejador de apertura del sobre con selección de idioma
  const handleEnvelopeOpen = (selectedLang?: "es" | "en") => {
    if (selectedLang) {
      setLang(selectedLang);
    }
  };

  // Cuenta regresiva en tiempo real
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = data.fechaEvento ? new Date(data.fechaEvento).getTime() : new Date("2026-07-18T16:00:00").getTime();
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

  // Estado del formulario RSVP interactivo
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState<"yes" | "no" | null>("yes");
  const [rsvpAdults, setRsvpAdults] = useState(1);
  const [rsvpKids, setRsvpKids] = useState(0);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Enviar confirmación por WhatsApp
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    const phone = (data.telefonoWhatsappRsvp || "").replace(/[^0-9]/g, "");
    const statusText = rsvpAttending === "yes" 
      ? (isEn ? "✅ Yes, I will attend with joy!" : "✅ ¡Sí, asistiré con gusto!")
      : (isEn ? "❌ Sadly I cannot attend, but I send my best wishes." : "❌ Lamentablemente no podré asistir, pero les envío un fuerte abrazo.");
    
    let text = `${isEn ? "Hello! RSVP for" : "¡Hola! Confirmación para"} ${data.titulo}:\n\n`;
    text += `👤 ${isEn ? "Name" : "Nombre"}: ${rsvpName.trim()}\n`;
    text += `✨ ${isEn ? "Attendance" : "Asistencia"}: ${statusText}\n`;
    if (rsvpAttending === "yes") {
      text += `👥 ${isEn ? "Adults" : "Adultos"}: ${rsvpAdults}\n`;
      if (rsvpKids > 0) text += `🧒 ${isEn ? "Children" : "Niños"}: ${rsvpKids}\n`;
    }
    if (rsvpMessage.trim()) {
      text += `💌 ${isEn ? "Message" : "Mensaje"}: "${rsvpMessage.trim()}"\n`;
    }

    setRsvpSubmitted(true);

    if (phone) {
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank");
    }
  };

  // Hitos de la historia (Growing Up) con fotos y textos de Canva
  const defaultHitos = [
    {
      foto: ELEGANT_ROSE_ASSETS.growingBaby,
      fecha: "2011",
      titulo: isEn ? "First Steps" : "Primeros Pasos",
      texto: isEn
        ? "Every story has a beginning, and mine started with the love of family, the comfort of home, and countless little moments that became treasured memories."
        : "Toda historia tiene un comienzo, y la mía comenzó rodeada del amor de mi familia, la calidez de mi hogar y un sinfín de pequeños momentos que se convirtieron en recuerdos inolvidables.",
    },
    {
      foto: ELEGANT_ROSE_ASSETS.growingChild,
      fecha: "2016",
      titulo: isEn ? "New Adventures" : "Nuevas Aventuras",
      texto: isEn
        ? "With each new adventure came exciting firsts, growing confidence, and friendships that would become an important part of my journey."
        : "Cada nueva aventura trajo consigo emocionantes primeras experiencias, una confianza creciente y amistades que se convirtieron en parte fundamental de mi camino.",
    },
    {
      foto: ELEGANT_ROSE_ASSETS.growingPreteen,
      fecha: "2020",
      titulo: isEn ? "Treasured Memories" : "Momentos Especiales",
      texto: isEn
        ? "From laughter-filled days to unforgettable memories, these special people helped shape the person I am today."
        : "Entre días llenos de risas y recuerdos inolvidables, estas personas tan especiales me ayudaron a convertirme en la persona que soy hoy.",
    },
    {
      foto: ELEGANT_ROSE_ASSETS.growingCompanion,
      fecha: "2024",
      titulo: isEn ? "Loyal Companion" : "Compañero Fiel",
      texto: isEn
        ? "And through every chapter, there was one loyal companion by my side—sharing the cuddles, the adventures, and all of life's happiest moments."
        : "Y a lo largo de cada capítulo, siempre hubo momentos compartidos, aventuras y la felicidad de estar rodeada de quienes más amo.",
    },
  ];

  const hitos = (data.historiaHitosJson as any[]) && (data.historiaHitosJson as any[]).length > 0
    ? (data.historiaHitosJson as any[])
    : defaultHitos;

  // Itinerario del día (The Big Day)
  const defaultItinerario = [
    {
      hora: "4:00 PM",
      titulo: isEn ? "Mass Ceremony" : "Misa de Acción de Gracias",
      lugar: data.ceremoniaNombre || (isEn ? "St. Mary's Church" : "Iglesia de Santa María"),
      icono: ELEGANT_ROSE_ASSETS.churchIcon,
    },
    {
      hora: "5:00 PM",
      titulo: isEn ? "Grand Entrance" : "Entrada Triunfal",
      lugar: data.recepcionNombre || (isEn ? "Grand Ballroom" : "Gran Salón de Baile"),
      icono: ELEGANT_ROSE_ASSETS.ballroomIcon,
    },
    {
      hora: "6:00 PM",
      titulo: isEn ? "The Waltz" : "Vals de Honor",
      lugar: isEn ? "With Parents & Court" : "Con Padres y Chambelanes",
      icono: ELEGANT_ROSE_ASSETS.waltzIcon,
    },
    {
      hora: "7:00 PM",
      titulo: isEn ? "Dinner" : "Cena de Gala",
      lugar: isEn ? "Formal banquet & toast" : "Banquete y brindis",
      icono: ELEGANT_ROSE_ASSETS.ballroomIcon,
    },
    {
      hora: "9:00 PM",
      titulo: isEn ? "Party & Dance" : "Gran Fiesta & Baile",
      lugar: isEn ? "Celebrating all night!" : "¡A celebrar toda la noche!",
      icono: ELEGANT_ROSE_ASSETS.musicIcon,
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

  const heroPhotoUrl = data.fotoPortadaUrl || ELEGANT_ROSE_ASSETS.heroPhoto;

  return (
    <div className="min-h-screen flex justify-center bg-[#FFF5F6] selection:bg-rose-200 antialiased font-sans">
      {/* 1. Intro del Sobre Interactivo fiel a Canva */}
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

      {/* Contenedor Móvil Vertical Estilo Canva */}
      <main className="w-full max-w-[440px] min-h-screen shadow-2xl relative overflow-hidden flex flex-col pb-16 bg-[#FFF5F6] text-[#5A3E44]">
        {/* Audio flotante */}
        <AudioPlayer audioUrl={data.musicaUrl} template={template} />

        {/* Barra superior con switcher de idioma */}
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md px-5 py-2.5 flex justify-between items-center border-b border-rose-100 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] tracking-widest text-[#CE8486] font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
            <span>{data.titulo.toUpperCase()} • XV</span>
          </div>

          <div className="flex items-center gap-1 bg-rose-50/80 border border-rose-200/60 rounded-full p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                isEn ? "bg-[#CE8486] text-white shadow-sm" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                !isEn ? "bg-[#CE8486] text-white shadow-sm" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              ES
            </button>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 1: PORTADA HERO (PAGE 1 CANVA)
        ══════════════════════════════════════════════════════════ */}
        <section className="px-6 pt-10 pb-8 text-center flex flex-col items-center relative overflow-hidden">
          {/* Corona decorativa */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ELEGANT_ROSE_ASSETS.crown}
            alt="Corona"
            className="w-11 h-auto mb-2 drop-shadow-sm opacity-90"
          />

          <p
            className="text-[11px] uppercase tracking-[0.25em] text-[#CE8486] font-semibold mb-1"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {isEn ? "You are cordially" : "Le invitamos cordialmente"}
          </p>

          <h1
            className="text-6xl sm:text-7xl text-[#5A3E44] my-0 leading-none select-none"
            style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
          >
            {isEn ? "invited!" : "¡a celebrar!"}
          </h1>

          {/* Marco tipo Arco con la foto principal de la quinceañera */}
          <div className="mt-7 w-72 h-[380px] rounded-t-full rounded-b-3xl overflow-hidden border-[6px] border-white shadow-2xl relative bg-rose-100 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroPhotoUrl}
              alt={data.titulo}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Invitación de los padres y Nombre */}
          <div className="mt-8 px-4 text-center">
            <p
              className="text-[11px] tracking-widest uppercase text-stone-500 font-serif leading-relaxed"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {isEn
                ? "Mr & Mrs Rodríguez warmly invite you to celebrate the Quinceañera of their daughter"
                : "El señor y la señora Rodríguez le invitan cordialmente a celebrar la Quinceañera de su hija"}
            </p>

            <h2
              className="text-6xl sm:text-7xl text-[#5A3E44] my-2 select-none"
              style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
            >
              {data.titulo}
            </h2>

            {/* Ornamento divisor dorado */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ELEGANT_ROSE_ASSETS.ornamentDivider}
              alt="Divisor"
              className="w-24 h-auto mx-auto my-3 opacity-75"
            />

            {/* Placa de fecha destacada */}
            <div className="inline-flex flex-col items-center justify-center px-6 py-2.5 rounded-full bg-white/80 border border-rose-200/80 shadow-md my-2">
              <span
                className="text-[12px] uppercase font-bold tracking-[0.2em] text-[#CE8486]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {data.fechaTextoPersonalizada || (isEn ? "SUNDAY • JULY 18, 2026 • 4:00 PM" : "DOMINGO • 18 DE JULIO, 2026 • 4:00 PM")}
              </span>
            </div>

            {/* Ubicación y botón de Google Maps */}
            <p className="text-xs text-stone-600 mt-3 font-light">
              {data.ceremoniaNombre || "St. Mary's Church, any city, any street, az 12345"}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full max-w-xs mx-auto">
              <a
                href={getMapDirectionsUrl(data.ceremoniaMapUrl, data.ceremoniaNombre || data.ceremoniaDireccion)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 px-4 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#CE8486] text-white hover:bg-[#b86f71] transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>GOOGLE MAPS</span>
              </a>

              <div className="w-full sm:flex-1">
                <AddToCalendarButton
                  titulo={`XV Años: ${data.titulo}`}
                  descripcion={`Acompáñanos a celebrar los XV años de ${data.titulo}.`}
                  ubicacion={`${data.recepcionNombre || data.ceremoniaNombre}, ${data.recepcionDireccion || data.ceremoniaDireccion}`}
                  fechaEvento={data.fechaEvento}
                  template={template}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 2: REPRODUCTOR MUSICAL CON FONDO FLORAL DE ROSAS
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative px-6 py-10 text-center text-white bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(90, 62, 68, 0.85), rgba(90, 62, 68, 0.85)), url(${ELEGANT_ROSE_ASSETS.rosesBg})`,
          }}
        >
          <div className="relative z-10 max-w-xs mx-auto flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ELEGANT_ROSE_ASSETS.musicIcon}
              alt="Música"
              className="w-12 h-12 mb-3 animate-pulse drop-shadow"
            />
            <p
              className="text-[11px] uppercase tracking-[0.25em] text-pink-200 font-semibold mb-1"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {isEn ? "The Soundtrack" : "Música Especial"}
            </p>
            <h3
              className="text-3xl text-white my-1"
              style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
            >
              {data.musicaTitulo || "Photograph - Ed Sheeran"}
            </h3>
            <p className="text-[11px] text-pink-100/80 mt-1 font-light italic">
              {isEn ? "Tap the audio button to play our theme" : "Toca el botón flotante para escuchar la canción"}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 3: "GROWING UP" (TIMELINE DE HITOS CON POLAROIDS)
            Fondo: Quinceañera en columnas del palacio
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative px-6 py-12 text-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 245, 246, 0.88), rgba(255, 245, 246, 0.94)), url(${ELEGANT_ROSE_ASSETS.castlePhoto})`,
          }}
        >
          <div className="relative z-10 flex flex-col items-center">
            <h3
              className="text-6xl sm:text-7xl text-[#5A3E44] my-0 leading-none select-none"
              style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
            >
              {isEn ? "Growing" : "Mi Historia"}
            </h3>
            <p
              className="text-xs uppercase tracking-[0.3em] font-bold text-[#CE8486] -mt-1 mb-3"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {isEn ? "UP" : "A TRAVÉS DE LOS AÑOS"}
            </p>

            <p
              className="text-xs text-stone-600 max-w-xs mx-auto italic mb-8 font-serif leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {isEn
                ? "Celebrating Fifteen Amazing Years — The Best Is Yet to Come."
                : "Celebrando quince años de recuerdos, sueños y momentos inolvidables… lo mejor está por venir."}
            </p>

            {/* Cuadrícula de fotos Polaroid auténticas de Canva */}
            <div className="space-y-8 w-full max-w-sm">
              {hitos.map((hito, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-rose-100 flex flex-col items-center transition-transform hover:-translate-y-1 duration-300"
                >
                  {/* Marco Polaroid con pines */}
                  <div className="w-56 h-56 rounded-xl overflow-hidden shadow-inner border-2 border-stone-100 relative bg-rose-50 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hito.foto || ELEGANT_ROSE_ASSETS.growingBaby}
                      alt={hito.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {hito.fecha && (
                    <span
                      className="text-[10px] uppercase font-bold tracking-widest text-[#CE8486] px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-1.5"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {hito.fecha}
                    </span>
                  )}

                  <h4
                    className="text-2xl text-[#5A3E44] my-0.5"
                    style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
                  >
                    {hito.titulo}
                  </h4>

                  <p className="text-xs text-stone-600 font-light leading-relaxed px-2 text-center mt-1">
                    {hito.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 4: "THE COUNTDOWN" (CUENTA REGRESIVA CON ROSAS)
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative px-6 py-12 text-center text-white bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(90, 62, 68, 0.90), rgba(90, 62, 68, 0.90)), url(${ELEGANT_ROSE_ASSETS.rosesBg})`,
          }}
        >
          <div className="relative z-10 flex flex-col items-center">
            <h3
              className="text-6xl text-white my-0 leading-none select-none"
              style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
            >
              {isEn ? "The" : "La"}
            </h3>
            <p
              className="text-sm uppercase tracking-[0.3em] font-bold text-pink-200 -mt-1 mb-2"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {isEn ? "COUNTDOWN" : "CUENTA REGRESIVA"}
            </p>

            <p
              className="text-[11px] uppercase tracking-widest text-pink-100/90 font-serif mb-6"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {isEn ? "TO SWEET QUINCE DAY HAS BEGUN!" : "¡EL GRAN DÍA ESTÁ CADA VEZ MÁS CERCA!"}
            </p>

            {/* 4 Bloques de cuenta regresiva estilo píldora de Canva */}
            <div className="grid grid-cols-4 gap-2.5 w-full max-w-xs mb-6">
              {[
                { label: isEn ? "DAYS" : "DÍAS", value: timeLeft.days },
                { label: isEn ? "HOURS" : "HORAS", value: timeLeft.hours },
                { label: isEn ? "MIN" : "MIN", value: timeLeft.minutes },
                { label: isEn ? "SEC" : "SEG", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/15 backdrop-blur-md rounded-2xl py-3 px-1 border border-pink-200/30 flex flex-col items-center shadow-lg"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-wider font-serif">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[9px] uppercase tracking-widest text-pink-200 mt-1 font-semibold"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="text-xs text-pink-100 italic font-serif"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {isEn
                ? "I can’t wait to celebrate with you!"
                : "¡No puedo esperar para celebrar este día tan especial contigo!"}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 5: "THE BIG DAY" (ITINERARIO CON ICONOS ORIGINALES)
        ══════════════════════════════════════════════════════════ */}
        <section className="px-6 py-12 text-center bg-[#FFF5F6] relative">
          <h3
            className="text-6xl text-[#5A3E44] my-0 leading-none select-none"
            style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
          >
            {isEn ? "The" : "El"}
          </h3>
          <p
            className="text-sm uppercase tracking-[0.3em] font-bold text-[#CE8486] -mt-1 mb-8"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {isEn ? "BIG DAY" : "PROGRAMA DEL DÍA"}
          </p>

          <div className="space-y-4 max-w-xs mx-auto">
            {defaultItinerario.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl shadow-sm border border-rose-100 flex items-center gap-4 text-left hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100 p-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.icono}
                    alt={item.titulo}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider text-[#CE8486]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.hora}
                  </span>
                  <h4 className="text-sm font-semibold text-stone-800 font-serif leading-tight">
                    {item.titulo}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-light truncate mt-0.5">
                    {item.lugar}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 6: "QUINCE COURT" (CORTE DE HONOR)
        ══════════════════════════════════════════════════════════ */}
        <section className="px-6 py-10 bg-white/70 border-y border-rose-100 text-center">
          <h3
            className="text-5xl text-[#5A3E44] my-0 select-none"
            style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
          >
            {isEn ? "Quince Court" : "Corte de Honor"}
          </h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ELEGANT_ROSE_ASSETS.ornamentDivider}
            alt="Divisor"
            className="w-20 h-auto mx-auto my-2 opacity-75"
          />

          <div className="max-w-xs mx-auto space-y-6 mt-6">
            {/* Padrinos */}
            {corteHonor.padrinos && corteHonor.padrinos.length > 0 && (
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                <p
                  className="text-[11px] uppercase tracking-widest text-[#CE8486] font-bold"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {isEn ? "Padrinos de Honor" : "Padrinos de Honor"}
                </p>
                <p className="text-sm font-serif font-semibold text-[#5A3E44] mt-1">
                  {corteHonor.padrinos.join(" & ")}
                </p>
              </div>
            )}

            {/* Chambelán de Honor */}
            {corteHonor.chambelan && (
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                <p
                  className="text-[11px] uppercase tracking-widest text-[#CE8486] font-bold"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {isEn ? "Chamberlain of Honor" : "Chambelán de Honor"}
                </p>
                <p className="text-sm font-serif font-semibold text-[#5A3E44] mt-1">
                  {corteHonor.chambelan}
                </p>
              </div>
            )}

            {/* Damas de Honor */}
            {corteHonor.damas && corteHonor.damas.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
                <p
                  className="text-[11px] uppercase tracking-widest text-[#CE8486] font-bold mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {isEn ? "Damas" : "Damas de Honor"}
                </p>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {corteHonor.damas.join(" • ")}
                </p>
              </div>
            )}

            {/* Chambelanes */}
            {corteHonor.chambelanes && corteHonor.chambelanes.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
                <p
                  className="text-[11px] uppercase tracking-widest text-[#CE8486] font-bold mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {isEn ? "Chambelanes" : "Chambelanes"}
                </p>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {corteHonor.chambelanes.join(" • ")}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 7: "DETAILS" (DRESS CODE, GIFTS & ACCOMMODATION)
        ══════════════════════════════════════════════════════════ */}
        <section className="px-6 py-12 text-center bg-[#FFF5F6]">
          <p
            className="text-xs uppercase tracking-[0.3em] font-bold text-[#CE8486] mb-1"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {isEn ? "IMPORTANT" : "INFORMACIÓN"}
          </p>
          <h3
            className="text-6xl text-[#5A3E44] my-0 leading-none select-none mb-8"
            style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
          >
            {isEn ? "Details" : "Detalles"}
          </h3>

          <div className="space-y-6 max-w-xs mx-auto">
            {/* Código de vestimenta */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ELEGANT_ROSE_ASSETS.dressIcon}
                alt="Vestimenta"
                className="w-12 h-12 mb-3 object-contain"
              />
              <h4
                className="text-xs uppercase tracking-widest font-bold text-[#5A3E44]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isEn ? "Dress Code" : "Código de Vestimenta"}
              </h4>
              <p className="text-xs font-semibold text-[#CE8486] mt-1 font-serif">
                {isEn ? "Formal & Elegant Attire" : "Vestimenta Formal y Elegante"}
              </p>
              <p className="text-[11px] text-stone-500 font-light mt-2 leading-relaxed">
                {isEn
                  ? "We invite our guests to dress in elegant formal attire as we celebrate this special occasion together. Reserved color: Blush pink for the Quinceañera."
                  : "Invitamos a nuestros invitados a vestir de manera elegante y formal para celebrar juntos. Color reservado: Rosa pastel para la Quinceañera."}
              </p>
            </div>

            {/* Regalos / Wishlist */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ELEGANT_ROSE_ASSETS.giftIcon}
                alt="Regalos"
                className="w-12 h-12 mb-3 object-contain"
              />
              <h4
                className="text-xs uppercase tracking-widest font-bold text-[#5A3E44]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isEn ? "Gifts" : "Mesa de Regalos"}
              </h4>
              <p className="text-[11px] text-stone-500 font-light mt-2 leading-relaxed">
                {isEn
                  ? "Your presence is the greatest gift we could ask for. If you'd like to celebrate with a gift, we invite you to browse our wishlist or contribute to our envelope box."
                  : "Su presencia es el mejor regalo que podríamos recibir. Si desea celebrar con un obsequio, le invitamos a consultar nuestra lista de deseos o lluvia de sobres."}
              </p>
              {data.wishlistUrl && (
                <a
                  href={data.wishlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block py-2 px-5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-rose-50 text-[#CE8486] border border-rose-200 hover:bg-rose-100 transition"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {isEn ? "WISHLIST" : "LISTA DE DESEOS"}
                </a>
              )}
            </div>

            {/* Alojamiento */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex flex-col items-center">
              <Hotel className="w-10 h-10 text-[#CE8486] mb-2 stroke-[1.5]" />
              <h4
                className="text-xs uppercase tracking-widest font-bold text-[#5A3E44]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isEn ? "Accommodation" : "Alojamiento"}
              </h4>
              <p className="text-[11px] text-stone-500 font-light mt-2 leading-relaxed">
                {isEn
                  ? "A room block has been reserved for our guests. Please contact us for reservation details and special booking information."
                  : "Hemos reservado un bloque de habitaciones para nuestros huéspedes. Para obtener más información sobre la reserva, póngase en contacto con nosotros."}
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 8: "PLEASE RSVP" (CONFIRMACIÓN INTERACTIVA & WA)
        ══════════════════════════════════════════════════════════ */}
        <section className="px-6 py-12 text-center bg-white/80 border-t border-rose-100">
          <h3
            className="text-6xl text-[#5A3E44] my-0 leading-none select-none"
            style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
          >
            {isEn ? "Please" : "Por Favor"}
          </h3>
          <p
            className="text-sm uppercase tracking-[0.3em] font-bold text-[#CE8486] -mt-1 mb-2"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            RSVP
          </p>

          {/* Fecha límite */}
          <div className="inline-block px-4 py-1 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-bold tracking-widest text-[#CE8486] uppercase mb-6 font-serif">
            {isEn ? "BY JUNE 20TH" : "ANTES DEL 20 DE JUNIO"}
          </div>

          {rsvpSubmitted ? (
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 max-w-xs mx-auto animate-fade-in">
              <Check className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-serif font-bold text-[#5A3E44]">
                {isEn ? "Thank you for confirming!" : "¡Gracias por confirmar!"}
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                {isEn
                  ? "Your response has been registered. We look forward to celebrating with you!"
                  : "Tu respuesta ha sido registrada con éxito. ¡Nos vemos en la fiesta!"}
              </p>
              <button
                type="button"
                onClick={() => setRsvpSubmitted(false)}
                className="mt-4 text-[11px] uppercase tracking-wider text-[#CE8486] underline font-semibold cursor-pointer"
              >
                {isEn ? "Modify confirmation" : "Modificar confirmación"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="bg-white p-6 rounded-3xl shadow-md border border-rose-100 max-w-xs mx-auto text-left space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#5A3E44] mb-1 font-serif">
                  {isEn ? "Full Name" : "Nombre Completo"} *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder={isEn ? "e.g. Maria Perez" : "Ej. María Pérez"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-[#CE8486] focus:outline-none bg-rose-50/30"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#5A3E44] mb-2 font-serif">
                  {isEn ? "Will you attend?" : "¿Asistirás al evento?"} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending("yes")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      rsvpAttending === "yes"
                        ? "bg-[#CE8486] text-white border-[#CE8486] shadow-xs"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-rose-50"
                    }`}
                  >
                    {isEn ? "Yes, I will attend" : "Sí, asistiré"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending("no")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      rsvpAttending === "no"
                        ? "bg-stone-700 text-white border-stone-700 shadow-xs"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {isEn ? "Cannot attend" : "No podré asistir"}
                  </button>
                </div>
              </div>

              {rsvpAttending === "yes" && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      {isEn ? "Adults" : "Adultos"}
                    </label>
                    <select
                      value={rsvpAdults}
                      onChange={(e) => setRsvpAdults(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-[#CE8486] bg-rose-50/30"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      {isEn ? "Children" : "Niños"}
                    </label>
                    <select
                      value={rsvpKids}
                      onChange={(e) => setRsvpKids(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-[#CE8486] bg-rose-50/30"
                    >
                      {[0, 1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                  {isEn ? "Special Message / Diet" : "Mensaje para la Quinceañera"}
                </label>
                <textarea
                  rows={2}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder={isEn ? "Dietary restrictions or congratulations..." : "Restricciones alimenticias o felicitaciones..."}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-[#CE8486] bg-rose-50/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold tracking-widest uppercase bg-[#CE8486] text-white hover:bg-[#b86f71] transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEn ? "CONFIRM VIA WHATSAPP" : "CONFIRMAR POR WHATSAPP"}</span>
              </button>
            </form>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 9: CIERRE Y AGRADECIMIENTOS
        ══════════════════════════════════════════════════════════ */}
        <footer className="px-6 pt-10 pb-12 text-center bg-[#FFF5F6]">
          <Heart className="w-7 h-7 mx-auto mb-2 text-[#CE8486] fill-current animate-pulse opacity-90" />
          <h3
            className="text-5xl text-[#5A3E44] my-0 select-none"
            style={{ fontFamily: "'Alex Brush', 'Pinyon Script', cursive" }}
          >
            {isEn ? "Thank you!" : "¡Gracias!"}
          </h3>
          <p
            className="text-[11px] tracking-widest uppercase text-stone-500 mt-2 font-serif"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {isEn ? "We can’t wait to celebrate with you!" : "¡No puedo esperar para celebrar este día tan especial contigo!"}
          </p>
        </footer>
      </main>
    </div>
  );
}
