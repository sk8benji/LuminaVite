"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar,
  Send,
  Check,
  Play,
  Pause,
  Music,
} from "lucide-react";
import { getTemplate } from "@/lib/templates";
import { getMapDirectionsUrl } from "@/lib/maps";
import { ELEGANT_ROSE_ASSETS } from "@/lib/templates/elegantRoseAssets";
import AudioPlayer from "../invitation/AudioPlayer";
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
        : new Date("2026-10-18T16:00:00").getTime();
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
  const fotoInfancia = data.fotoInfanciaUrl || ELEGANT_ROSE_ASSETS.growingBaby;
  const fotoNinez = data.fotoActualUrl || ELEGANT_ROSE_ASSETS.growingChild;
  const fotoActual = data.fotoCierreUrl || ELEGANT_ROSE_ASSETS.castlePhoto;

  const itinerarioList =
    Array.isArray(data.itinerarioJson) && data.itinerarioJson.length > 0
      ? data.itinerarioJson
      : [
          { hora: "4:00 PM", titulo: isEn ? "Mass Ceremony" : "Misa de Acción de Gracias" },
          { hora: "5:00 PM", titulo: isEn ? "Grand Entrance" : "Entrada al Salón" },
          { hora: "6:00 PM", titulo: isEn ? "The Waltz" : "Vals de Honor" },
          { hora: "7:00 PM", titulo: isEn ? "Dinner" : "Cena de Gala" },
          { hora: "9:00 PM", titulo: isEn ? "Party & Dance" : "Fiesta y Baile" },
        ];

  return (
    <div className="min-h-screen flex justify-center bg-[#150D11] selection:bg-rose-300/30 antialiased font-['Montserrat',sans-serif]">
      {/* Elemento de Audio Real */}
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

      {/* Contenedor Principal (430px) */}
      <main className="relative w-full max-w-[430px] mx-auto min-h-screen text-white select-none overflow-x-hidden font-['Montserrat',sans-serif] shadow-2xl bg-[#1C1016]">
        {/* Switch de Idioma Superior Flotante */}
        <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md px-5 py-2 flex justify-between items-center border-b border-white/10">
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

        {/* ======================================================== */}
        {/* 1. HERO SECTION: PORTADA SOBRE VESTIDO ROSA             */}
        {/* ======================================================== */}
        <section className="relative min-h-[580px] flex flex-col items-center justify-center text-center px-4 py-12">
          {/* Fondo Foto Portada (Vestido Rosa) con viñeta oscura suave */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroPhotoUrl}
            alt="Portada Quinceañera"
            className="absolute inset-0 w-full h-full object-cover -z-20 filter brightness-95"
          />
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] -z-10" />

          {/* Columna Central Glassmorphism */}
          <div className="w-full max-w-[320px] bg-white/20 border border-white/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
            <p className="font-['Cinzel'] text-[9px] tracking-[0.3em] uppercase text-rose-100 font-semibold mb-1">
              {isEn ? "We Are Delighted To Invite You" : "Nos Complace Invitarle"}
            </p>
            <p className="font-['Cinzel'] text-[11px] tracking-[0.25em] uppercase text-white font-bold mb-1">
              {isEn ? "To Celebrate The" : "A Celebrar La"}
            </p>

            {/* Título Quinceañera */}
            <h1 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-white my-1 drop-shadow-md select-none">
              Quinceañera
            </h1>

            <p className="font-['Cinzel'] text-[9px] tracking-[0.25em] uppercase text-rose-100 font-semibold">
              {isEn ? "Of" : "De"}
            </p>

            {/* Nombre */}
            <h2 className="font-['Alex_Brush'] text-4xl sm:text-5xl text-rose-100 my-2 drop-shadow-md select-none">
              {data.titulo}
            </h2>

            {/* Separador Corona / Fecha */}
            <div className="my-4 border-t border-white/40 pt-3">
              <p className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase text-rose-200">
                {isEn ? "Saturday" : "Sábado"}
              </p>
              <span className="block font-['Cinzel'] text-3xl font-bold text-white tracking-widest my-0.5">
                18
              </span>
              <p className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase text-rose-200">
                {isEn ? "October • 2026" : "Octubre • 2026"}
              </p>
            </div>

            {/* Botón de apertura */}
            <a
              href="#growing-up"
              className="inline-block mt-2 bg-white/30 border border-white/60 text-white font-['Cinzel'] text-[9px] tracking-[0.25em] uppercase py-2 px-6 rounded-full hover:bg-white/40 transition-all cursor-pointer"
            >
              {isEn ? "Open Invite" : "Ver Invitación"}
            </a>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. REPRODUCTOR DE MÚSICA MINIMALISTA                     */}
        {/* ======================================================== */}
        <section className="bg-[#2D1B22]/90 py-4 px-6 border-y border-white/10 flex items-center justify-center">
          <div className="w-full max-w-[320px] bg-white/10 border border-white/20 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
            {/* Miniatura Foto */}
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/40 shrink-0 bg-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroPhotoUrl}
                className="w-full h-full object-cover"
                alt="Canción"
              />
            </div>

            {/* Info y Controles */}
            <div className="flex-1 min-w-0">
              <p className="font-['Cinzel'] text-[10px] tracking-wider text-rose-200 truncate">
                {data.musicaTitulo || "Photograph - Ed Sheeran"}
              </p>
              <p className="text-[9px] text-white/60 truncate">
                {isEn ? "Official Song" : "Música Oficial"}
              </p>
              {/* Barra de progreso simulada */}
              <div className="w-full bg-white/20 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className={`bg-rose-300 h-full ${
                    isPlaying ? "w-2/3 animate-pulse" : "w-1/3"
                  } transition-all duration-500`}
                />
              </div>
            </div>

            {/* Botón Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white text-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. SECCIÓN GROWING UP (FILMSTRIP / NEGATIVO)              */}
        {/* ======================================================== */}
        <section id="growing-up" className="relative py-12 px-4 flex flex-col items-center">
          {/* Fondo Rosas Oscuras / Foto difuminada */}
          <div className="absolute inset-0 bg-[#25161C] -z-20" />

          <div className="text-center mb-8">
            <h3 className="font-['Alex_Brush'] text-5xl text-rose-200 drop-shadow-md select-none">
              Growing Up
            </h3>
            <span className="text-xs text-[#D8B772] block mt-1">👑</span>
          </div>

          {/* Contenedor Central de Tiras de Fotos */}
          <div className="w-full max-w-[300px] space-y-8">
            {/* Hito 1 */}
            <div className="text-center">
              {/* Marco Filmstrip (Negativo de película negro con borde punteado) */}
              <div className="bg-black p-2 border-y-4 border-dashed border-white/30 shadow-2xl rounded-sm">
                <div className="aspect-square w-full overflow-hidden bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoInfancia}
                    className="w-full h-full object-cover"
                    alt="Baby"
                  />
                </div>
              </div>
              <p className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase text-rose-300 font-semibold mt-3">
                Baby Girl
              </p>
              <p className="font-['Cinzel'] text-[9px] text-white/70 italic tracking-wider mt-0.5">
                {isEn ? "The beginning of my journey" : "El comienzo de mi camino"}
              </p>
            </div>

            {/* Hito 2 */}
            <div className="text-center">
              <div className="bg-black p-2 border-y-4 border-dashed border-white/30 shadow-2xl rounded-sm">
                <div className="aspect-square w-full overflow-hidden bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoNinez}
                    className="w-full h-full object-cover"
                    alt="Niñez"
                  />
                </div>
              </div>
              <p className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase text-rose-300 font-semibold mt-3">
                First Steps
              </p>
              <p className="font-['Cinzel'] text-[9px] text-white/70 italic tracking-wider mt-0.5">
                {isEn ? "Growing through laughter" : "Creciendo entre risas"}
              </p>
            </div>

            {/* Hito 3 */}
            <div className="text-center">
              <div className="bg-black p-2 border-y-4 border-dashed border-white/30 shadow-2xl rounded-sm">
                <div className="aspect-square w-full overflow-hidden bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoActual}
                    className="w-full h-full object-cover"
                    alt="Quinceañera"
                  />
                </div>
              </div>
              <p className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase text-rose-300 font-semibold mt-3">
                Sweet Fifteen
              </p>
              <p className="font-['Cinzel'] text-[9px] text-white/70 italic tracking-wider mt-0.5">
                {isEn ? "Today stepping into womanhood" : "Hoy convertida en señorita"}
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. CUENTA REGRESIVA ELEGANTE                             */}
        {/* ======================================================== */}
        <section className="relative py-12 px-4 text-center border-t border-white/10">
          <div className="w-full max-w-[320px] mx-auto bg-black/40 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="font-['Alex_Brush'] text-4xl text-rose-200 mb-1 select-none">
              The Countdown
            </h3>
            <p className="font-['Cinzel'] text-[9px] tracking-[0.2em] uppercase text-white/70 mb-4">
              {isEn ? "I can't wait to celebrate with you!" : "¡No puedo esperar para celebrar contigo!"}
            </p>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/10 rounded-lg py-2 border border-white/10">
                <span className="block font-['Cinzel'] text-xl font-bold text-white">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-rose-200">
                  {isEn ? "Days" : "Días"}
                </span>
              </div>
              <div className="bg-white/10 rounded-lg py-2 border border-white/10">
                <span className="block font-['Cinzel'] text-xl font-bold text-white">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-rose-200">
                  {isEn ? "Hours" : "Horas"}
                </span>
              </div>
              <div className="bg-white/10 rounded-lg py-2 border border-white/10">
                <span className="block font-['Cinzel'] text-xl font-bold text-white">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-rose-200">
                  {isEn ? "Mins" : "Min"}
                </span>
              </div>
              <div className="bg-white/10 rounded-lg py-2 border border-white/10">
                <span className="block font-['Cinzel'] text-xl font-bold text-white">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-rose-200">
                  {isEn ? "Secs" : "Seg"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. ITINERARIO VERTICAL EN CRISTAL                        */}
        {/* ======================================================== */}
        <section className="py-12 px-4 flex flex-col items-center">
          <div className="w-full max-w-[320px] bg-white/20 border border-white/30 rounded-2xl p-6 backdrop-blur-md">
            <div className="text-center mb-6">
              <h3 className="font-['Alex_Brush'] text-4xl text-white select-none">The Day</h3>
              <p className="font-['Cinzel'] text-[9px] tracking-[0.2em] uppercase text-rose-200">
                {isEn ? "Event Itinerary" : "Itinerario del Evento"}
              </p>
            </div>

            <div className="space-y-4">
              {itinerarioList.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-white/20 pb-2 text-center"
                >
                  <span className="font-['Cinzel'] text-[11px] font-semibold text-rose-200 tracking-wider">
                    {item.hora}
                  </span>
                  <span className="font-['Cinzel'] text-xs text-white tracking-widest uppercase">
                    {item.titulo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. RSVP GLASSMORPHISM FINAL                              */}
        {/* ======================================================== */}
        <section className="py-12 px-4 pb-20 flex flex-col items-center">
          <div className="w-full max-w-[320px] bg-white/20 border border-white/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-center">
            <h3 className="font-['Alex_Brush'] text-3xl text-rose-200 select-none">
              {isEn ? "Please" : "Por Favor"}
            </h3>
            <h2 className="font-['Cinzel'] text-2xl font-bold tracking-[0.25em] text-white mb-1">
              RSVP
            </h2>
            <p className="font-['Cinzel'] text-[9px] tracking-widest uppercase text-rose-100 mb-6 font-semibold">
              {data.rsvpFechaLimite || data.fechaLimiteRsvp || (isEn ? "Please confirm by October 1st" : "Favor de confirmar antes del 1 de Octubre")}
            </p>

            {rsvpSubmitted ? (
              <div className="bg-white/10 p-5 rounded-xl border border-white/20 animate-fade-in text-center">
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
              <form onSubmit={handleRsvpSubmit} className="space-y-3 text-left">
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
                    className="w-full bg-neutral-900/80 border border-white/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-300"
                  >
                    <option value="1">1 {isEn ? "Pass" : "Pase"}</option>
                    <option value="2">2 {isEn ? "Passes" : "Pases"}</option>
                    <option value="3">3 {isEn ? "Passes" : "Pases"}</option>
                    <option value="4">4 {isEn ? "Passes" : "Pases"}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white/30 hover:bg-white/40 border border-white/60 text-white font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase py-3 rounded-lg font-semibold shadow-lg transition-all mt-4 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEn ? "Confirm Attendance" : "Confirmar Asistencia"}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
