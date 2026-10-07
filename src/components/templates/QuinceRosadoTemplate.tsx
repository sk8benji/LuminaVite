"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Play,
  Pause,
  Check,
  Heart,
  Sparkles,
  Clock,
  Gift,
  Send,
  Users,
  Compass,
} from "lucide-react";
import { QUINCE_ROSADO_ASSETS } from "@/lib/templates/quinceRosadoAssets";
import { getMapDirectionsUrl } from "@/lib/maps";
import { InvitationData } from "../invitation/InvitationMobileView";

interface QuinceRosadoTemplateProps {
  data: InvitationData;
  skipIntro?: boolean;
}

const MONTH_NAMES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAY_NAMES_ES = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
];

function parseEventDate(fechaEvento?: string | Date | null) {
  if (!fechaEvento) {
    return { year: 2027, month: 4, day: 15 }; // Mayo 15, 2027 por defecto
  }
  if (fechaEvento instanceof Date) {
    return {
      year: fechaEvento.getFullYear(),
      month: fechaEvento.getMonth(),
      day: fechaEvento.getDate(),
    };
  }
  const str = String(fechaEvento);
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return {
      year: parseInt(match[1], 10),
      month: parseInt(match[2], 10) - 1,
      day: parseInt(match[3], 10),
    };
  }
  const d = new Date(fechaEvento);
  if (!isNaN(d.getTime())) {
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
    };
  }
  return { year: 2027, month: 4, day: 15 };
}

export default function QuinceRosadoTemplate({
  data,
  skipIntro = false,
}: QuinceRosadoTemplateProps) {
  // ── CÁLCULO DINÁMICO DE FECHA PARA CALENDARIO Y MEDALLÓN ─────────────
  const eventDateInfo = parseEventDate(data.fechaEvento);
  const eventYear = eventDateInfo.year;
  const eventMonth = eventDateInfo.month; // 0..11
  const eventDay = eventDateInfo.day;
  const eventMonthName = MONTH_NAMES_ES[eventMonth] || "Mayo";
  const eventDayOfWeek = WEEKDAY_NAMES_ES[new Date(eventYear, eventMonth, eventDay).getDay()];

  // Total de días del mes y desplazamiento del día 1 (0 = Domingo)
  const totalDaysInMonth = new Date(eventYear, eventMonth + 1, 0).getDate();
  const firstDayOfMonthIndex = new Date(eventYear, eventMonth, 1).getDay();
  const calendarBlanks = Array.from({ length: firstDayOfMonthIndex });
  const calendarDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // Parámetros dinámicos para Google Calendar
  const padTwo = (n: number) => String(n).padStart(2, "0");
  const gcalStart = `${eventYear}${padTwo(eventMonth + 1)}${padTwo(eventDay)}T220000Z`;
  const gcalEnd = `${eventYear}${padTwo(eventMonth + 1)}${padTwo(Math.min(eventDay + 1, totalDaysInMonth))}T040000Z`;

  // ── ESTADO DEL SOBRE INTRO ──────────────────────────────────────────
  const [introOpen, setIntroOpen] = useState(skipIntro);
  const [animatingOpen, setAnimatingOpen] = useState(false);

  // ── REPRODUCTOR DE AUDIO ─────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleOpenEnvelope = () => {
    if (animatingOpen || introOpen) return;
    setAnimatingOpen(true);
    if (data.reproducirMusicaAlAbrir !== false) {
      startMusic();
    }
    setTimeout(() => {
      setIntroOpen(true);
    }, 900);
  };

  // ── CUENTA REGRESIVA EN TIEMPO REAL ──────────────────────────────────
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
        : new Date("2027-05-15T16:00:00").getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [data.fechaEvento]);

  // ── FORMULARIO RSVP WHATSAPP ─────────────────────────────────────────
  const [rsvpNombre, setRsvpNombre] = useState("");
  const [rsvpPases, setRsvpPases] = useState("2");
  const [rsvpTelefono, setRsvpTelefono] = useState("");
  const [rsvpConfirmado, setRsvpConfirmado] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpNombre.trim()) return;

    const phone = (data.telefonoWhatsappRsvp || "").replace(/[^0-9]/g, "");
    let text = `¡Hola! Confirmación de asistencia para los Quince de ${data.titulo}:\n\n`;
    text += `👤 Nombre: ${rsvpNombre.trim()}\n`;
    if (rsvpTelefono.trim()) {
      text += `📱 Teléfono: ${rsvpTelefono.trim()}\n`;
    }
    text += `🎟️ Pases Confirmados: ${rsvpPases}\n`;
    text += `✨ ¡Muchísimas gracias por la invitación!`;

    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    setRsvpConfirmado(true);
    window.open(waUrl, "_blank");
  };

  // Google Maps links
  const churchMapUrl = getMapDirectionsUrl(
    data.ceremoniaMapUrl,
    `${data.ceremoniaNombre || ""} ${data.ceremoniaDireccion || ""}`.trim()
  );
  const hallMapUrl = getMapDirectionsUrl(
    data.recepcionMapUrl,
    `${data.recepcionNombre || ""} ${data.recepcionDireccion || ""}`.trim()
  );

  // Fallbacks de fotos y textos exactos de Canva
  const isDefaultOrReplicaPhoto =
    !data.fotoPortadaUrl ||
    data.fotoPortadaUrl.includes("unsplash") ||
    data.fotoPortadaUrl.includes("90043c428c5ec72c7adb26dce69dedd2") ||
    data.fotoPortadaUrl.includes("da616fa36a10f18a133b2dc0383a07d0") ||
    data.fotoPortadaUrl.includes("d0a18f8a869419b00c0c5185dc620397") ||
    data.fotoPortadaUrl.includes("template-quince-rosado");

  const heroPhotoUrl =
    !isDefaultOrReplicaPhoto && data.fotoPortadaUrl
      ? data.fotoPortadaUrl
      : QUINCE_ROSADO_ASSETS.heroHorseCutout;

  const photoChildhood =
    data.fotoInfanciaUrl && !data.fotoInfanciaUrl.includes("unsplash")
      ? data.fotoInfanciaUrl
      : QUINCE_ROSADO_ASSETS.polaroidDeNina;

  const photoLady =
    data.fotoActualUrl && !data.fotoActualUrl.includes("unsplash")
      ? data.fotoActualUrl
      : QUINCE_ROSADO_ASSETS.polaroidASenorita;

  // Itinerario default exacto de Canva si no viene personalizado
  const itinerario =
    data.itinerarioJson && data.itinerarioJson.length > 0
      ? data.itinerarioJson
      : [
          { hora: "11:00 am", titulo: "Ceremonia de la iglesia", tipoIcono: "church" },
          { hora: "12:00 am", titulo: "Llegada en carruaje", tipoIcono: "carriage" },
          { hora: "1:00 pm", titulo: "Llegada al salón", tipoIcono: "hall" },
          { hora: "3:00 pm", titulo: "Se servira la comida", tipoIcono: "dinner" },
          { hora: "4:00 pm", titulo: "Vals, Baile Sorpresa", tipoIcono: "waltz" },
          { hora: "5:00 pm", titulo: "Vals de padre e hija", tipoIcono: "father_dance" },
          { hora: "6:00 pm", titulo: "Padrinos de honor", tipoIcono: "crown" },
          { hora: "7:00 pm", titulo: "Hora de bailar", tipoIcono: "party" },
        ];

  return (
    <div className="relative min-h-screen bg-[#FDF9FA] text-[#7A002A] select-none font-['Lora',serif] antialiased">
      {/* ── AUDIO EMBEBIDO ────────────────────────────────────────── */}
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

      {/* ══════════════════════════════════════════════════════════════
          1. INTRO ENVELOPE (DEMOROSADO) - EXACTA RÉPLICA DE CANVA
      ══════════════════════════════════════════════════════════════ */}
      {!introOpen && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-white overflow-hidden transition-all duration-700 select-none ${
            animatingOpen ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Destellos de Brillo Superior */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QUINCE_ROSADO_ASSETS.introGlitter}
            onError={(e) => {
              (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.introGlitter;
            }}
            alt=""
            className="absolute top-0 inset-x-0 w-full h-auto object-cover pointer-events-none opacity-85 select-none"
          />

          {/* TÍTULO SUPERIOR INTRO */}
          <div className="relative z-10 pt-10 text-center px-4">
            <div className="inline-flex items-center justify-center gap-2">
              <h1 className="font-['Great_Vibes',cursive] text-6xl sm:text-7xl text-[#7A002A] leading-none drop-shadow-sm">
                {data.titulo || "Magdalena"}
              </h1>
              {/* Rosa 3D en la cabecera */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.introRoseFlower}
                alt="Rosa"
                className="w-14 h-14 object-contain -mt-3 drop-shadow-md"
              />
            </div>
            <p className="font-['Cinzel',serif] text-xl sm:text-2xl tracking-[0.35em] uppercase text-[#7A002A] font-bold mt-1">
              QUINCE
            </p>
          </div>

          {/* SOBRE ROSA 3D CON POLAROIDS Y LAZO (CLICABLE EN TODA EL ÁREA) */}
          <div
            onClick={handleOpenEnvelope}
            className="relative w-full max-w-[360px] mx-auto my-auto flex flex-col items-center px-2 cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* POLAROIDS QUE SALEN DEL SOBRE */}
            <div className="relative w-full h-52 -mb-28 z-0 pointer-events-none">
              {/* Polaroid Izquierda: MAYO 2027 (Rotada -14deg) */}
              <div
                className={`absolute left-3 top-0 w-[170px] bg-white p-2 pb-5 shadow-2xl rounded-sm transform -rotate-12 transition-transform duration-700 border border-pink-100 ${
                  animatingOpen ? "-translate-y-16 -rotate-16" : ""
                }`}
              >
                <div className="w-full aspect-square overflow-hidden bg-rose-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoChildhood}
                    alt="Mayo 2027"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-['Cinzel',serif] text-[10px] tracking-[0.25em] uppercase text-[#B74F5F] font-bold text-center mt-2.5">
                  {data.fechaPlacaMes || `${eventMonthName.toUpperCase()} ${eventYear}`}
                </p>
              </div>

              {/* Polaroid Derecha: Dinámico (Día y Número) */}
              <div
                className={`absolute right-3 top-2 w-[170px] bg-white p-2 pb-5 shadow-2xl rounded-sm transform rotate-8 transition-transform duration-700 border border-pink-100 ${
                  animatingOpen ? "-translate-y-16 rotate-12" : ""
                }`}
              >
                <div className="w-full aspect-square overflow-hidden bg-rose-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoLady}
                    alt={`${eventDayOfWeek} ${eventDay}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-['Cinzel',serif] text-[10px] tracking-[0.25em] uppercase text-[#B74F5F] font-bold text-center mt-2.5">
                  {`${eventDayOfWeek} ${eventDay}`}
                </p>
              </div>
            </div>

            {/* BASE DEL SOBRE ROSADO ABIERTO */}
            <div className="relative w-full z-10 cursor-pointer">
              {/* Lecho de Rosas dentro del sobre */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.introRosesBed}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.introRosesBed;
                }}
                alt=""
                className="absolute top-2 inset-x-8 w-4/5 h-20 object-cover rounded-t-full pointer-events-none opacity-90"
              />

              {/* Cuerpo del Sobre Rosado */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.introEnvelope}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.introEnvelope;
                }}
                alt="Sobre"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />

              {/* Lazo Gigante de Seda Rosa */}
              <div className="absolute top-[44%] inset-x-0 flex items-center justify-center pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={QUINCE_ROSADO_ASSETS.introBowRibbon}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.introBowRibbon;
                  }}
                  alt="Lazo"
                  className="w-[280px] h-auto object-contain drop-shadow-xl"
                />
              </div>

              {/* Sello Interactivo: Más grande y con efecto visual destacado */}
              <div
                aria-label="Abrir invitación"
                className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-110 active:scale-95 focus:outline-none z-20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={QUINCE_ROSADO_ASSETS.introSeal}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.introSeal;
                  }}
                  alt="Toca para abrir"
                  className="w-full h-full object-contain drop-shadow-xl animate-pulse"
                />
              </div>
            </div>
          </div>

          {/* TEXTO INFERIOR INTRO */}
          <div
            onClick={handleOpenEnvelope}
            className="relative z-10 pb-8 text-center px-4 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <h2 className="font-['Great_Vibes',cursive] text-5xl sm:text-6xl text-[#7A002A] leading-tight drop-shadow-sm">
              ¡Estás invitado!
            </h2>
            <p className="font-['Cinzel',serif] text-xs tracking-[0.25em] uppercase text-[#B74F5F] font-semibold mt-1">
              Toca el sobre para abrir
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CONTENEDOR PRINCIPAL MÓVIL (430px)
      ══════════════════════════════════════════════════════════════ */}
      <main className="relative w-full max-w-[430px] mx-auto min-h-screen bg-white shadow-2xl overflow-x-hidden text-[#7A002A]">
        {/* BOTÓN REPRODUCTOR FLOTANTE DISCRETO */}
        {data.musicaUrl && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Reproducir o pausar música"
            className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[#7A002A] text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-2 border-pink-200"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        )}

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 1: HERO PORTADA ARCO & CABALLO BLANCO
        ══════════════════════════════════════════════════════════════ */}
        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 1: HERO PORTADA ARCO & CABALLO BLANCO (RÉPLICA CANVA)
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative w-full flex flex-col items-center pt-6 pb-10 px-4 overflow-hidden select-none">
          {/* Fondo de Nubes Rosadas (90043c428c5ec72c7adb26dce69dedd2.png) */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={QUINCE_ROSADO_ASSETS.heroCloudsBg}
              onError={(e) => {
                (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.heroCloudsBg;
              }}
              alt=""
              className="w-full h-full object-cover object-top"
            />
            {/* Difuminado suave hacia el blanco inferior */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/80 to-transparent" />
          </div>

          {/* Encabezado: "CON Amor LE INVITAMOS" */}
          <div className="relative w-full max-w-[340px] mx-auto text-center mb-2 z-10">
            {/* "CON" */}
            <p className="font-['Libre_Baskerville',serif] text-sm sm:text-base tracking-[0.35em] uppercase text-[#7A002A] font-bold">
              CON
            </p>

            {/* "Amor" */}
            <h2 className="font-['Alex_Brush',cursive] text-7xl sm:text-8xl text-[#7A002A] leading-[0.8] -mt-1 drop-shadow-sm select-none">
              Amor
            </h2>

            {/* "LE INVITAMOS" (Alineado a la derecha debajo de "Amor") */}
            <div className="w-full flex justify-end pr-3 sm:pr-4 -mt-1 sm:-mt-2">
              <p className="font-['Libre_Baskerville',serif] text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#7A002A] font-bold">
                LE INVITAMOS
              </p>
            </div>
          </div>

          {/* Marco de Arco 3D con Pop-Out de Quinceañera & Caballo Blanco */}
          <div className="relative w-full max-w-[335px] sm:max-w-[350px] mx-auto my-3 z-10">
            {/* 1. Marco de Arco Base con el Fondo del Jardín (d0a18f8a869419b00c0c5185dc620397.png) */}
            <div className="relative w-full aspect-[52/64] rounded-t-[175px] border-[4.5px] border-white shadow-[0_15px_35px_rgba(122,0,42,0.18)] overflow-hidden bg-pink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.heroGardenBg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.heroGardenBg;
                }}
                alt="Jardín Quinceañera"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* 2. Capa Pop-Out 3D: Chica con el Caballo (da616fa36a10f18a133b2dc0383a07d0.png) */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  isDefaultOrReplicaPhoto
                    ? QUINCE_ROSADO_ASSETS.heroHorseCutout
                    : heroPhotoUrl
                }
                onError={(e) => {
                  (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.heroHorseCutout;
                }}
                alt={data.titulo}
                className="w-full h-full object-cover object-center scale-[1.01] translate-x-[-1%] translate-y-[2%]"
              />
            </div>
          </div>

          {/* Nombre & Quinceañera */}
          <div className="relative z-10 text-center mt-2 mb-6">
            <h1 className="font-['Alex_Brush',cursive] text-6xl sm:text-7xl text-[#7A002A] leading-none drop-shadow-sm">
              {data.titulo || "Magdalena"}
            </h1>
            <p className="font-['Libre_Baskerville',serif] text-xs sm:text-sm tracking-[0.45em] uppercase text-[#7A002A] font-bold mt-2">
              {data.subtitulo || "LA QUINCEAÑERA"}
            </p>
          </div>

          {/* Medallón de Fecha Circular con Cinta */}
          <div className="relative z-10 flex items-center justify-center gap-4 w-full max-w-[290px] mx-auto py-2">
            {/* Medallón circular dusty rose */}
            <div className="relative w-24 h-24 rounded-full bg-[#A55B64] text-white flex flex-col items-center justify-center shadow-lg border-2 border-white">
              <span className="font-['Great_Vibes',cursive] text-3xl leading-none">15</span>
              <span className="font-['Cinzel',serif] text-[9px] tracking-widest uppercase font-bold -mt-0.5">
                AÑOS
              </span>
            </div>

            {/* Bloque de Fecha */}
            <div className="flex flex-col text-left">
              <span className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase font-bold text-[#7A002A]">
                {eventDayOfWeek}
              </span>
              <span className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase font-bold text-[#7A002A]">
                {data.fechaPlacaMes || eventMonthName.toUpperCase()}
              </span>
              <span className="font-['Great_Vibes',cursive] text-4xl text-[#B74F5F] leading-none my-0.5">
                {eventDay}
              </span>
              <span className="font-['Cinzel',serif] text-[10px] tracking-wider text-[#7A002A] font-medium">
                {data.fechaPlacaHora || `A las 4:00 PM ${eventYear}`}
              </span>
            </div>

            {/* Rosa pequeña decorativa */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={QUINCE_ROSADO_ASSETS.heroRoseAccent}
              alt=""
              className="w-10 h-10 object-contain self-start -ml-2"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 2: DEDICATORIA & POLAROIDS ("DE NIÑA A SEÑORITA")
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-12 px-5 bg-white overflow-hidden text-center">
          {/* Fondo de brillo suave */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QUINCE_ROSADO_ASSETS.dedicationGlitter}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 select-none"
          />

          <div className="relative z-10 max-w-[350px] mx-auto">
            {/* Texto emotivo de la niña */}
            <p className="font-['Lora',serif] text-xs sm:text-[13px] leading-relaxed text-[#722927] italic text-justify px-2 mb-10">
              {data.frasePersonalizada ||
                "Desde que era una niña, Magdalena ha soñado con este mismo momento: un día lleno de amor, belleza y recuerdos inolvidables. Hoy, ese sueño se hace realidad mientras celebra su quinceañera, marcando la hermosa transición de una niña a una señorita elegante. Rodeada de familia, tradición y aquellos que la han guiado a lo largo del camino, este día representa no solo una celebración, sino un hito de crecimiento, fuerza y nuevos comienzos. Con un corazón lleno de gratitud y emoción por el futuro, Magdalena te invita a ser parte de este momento único en la vida mientras entra en un nuevo capítulo de su vida."}
            </p>

            {/* Polaroid 1: "De niña" */}
            <div className="relative w-[210px] mx-auto bg-white p-2.5 pb-6 shadow-2xl rounded-sm transform -rotate-6 border border-pink-100 mb-10">
              {/* Rosa en la esquina */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.heroRoseAccent}
                alt=""
                className="absolute -top-3 -left-3 w-8 h-8 object-contain z-10"
              />
              <div className="w-full aspect-square overflow-hidden bg-pink-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoChildhood}
                  alt="De niña"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-['Great_Vibes',cursive] text-2xl text-[#B74F5F] text-center mt-3">
                De niña
              </p>
            </div>

            {/* Polaroid 2: "A señorita" */}
            <div className="relative w-[210px] mx-auto bg-white p-2.5 pb-6 shadow-2xl rounded-sm transform rotate-4 border border-pink-100">
              {/* Rosa en la esquina */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.heroRoseAccent}
                alt=""
                className="absolute -top-3 -right-3 w-8 h-8 object-contain z-10"
              />
              <div className="w-full aspect-square overflow-hidden bg-pink-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoLady}
                  alt="A señorita"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-['Great_Vibes',cursive] text-2xl text-[#B74F5F] text-center mt-3">
                A señorita
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 3: RSVP, UBICACIONES, DRESS CODE & REGALOS
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-12 px-5 bg-gradient-to-b from-pink-50/50 to-white">
          <div className="max-w-[360px] mx-auto">
            {/* Tarjeta de Confirmación de Asistencia */}
            <div className="bg-white/90 p-6 rounded-3xl shadow-xl border border-pink-200 text-center mb-8">
              <h3 className="font-['Cinzel',serif] text-sm tracking-[0.25em] uppercase text-[#7A002A] font-bold mb-2">
                ¿SERÁS PARTE DE
              </h3>
              <h2 className="font-['Great_Vibes',cursive] text-4xl text-[#7A002A] mb-4">
                Mi Celebración?
              </h2>

              <p className="font-['Cinzel',serif] text-[11px] tracking-wider uppercase text-[#7A002A] font-bold mb-6">
                {data.rsvpFechaLimite || "POR FAVOR, CONFIRMA TU ASISTENCIA ANTES DEL 20 DE OCTUBRE DE 2026."}
              </p>

              {rsvpConfirmado ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <Check className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                  <p className="font-bold">¡Gracias por confirmar!</p>
                  <p className="mt-1">Te esperamos con mucha emoción.</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider uppercase text-[#7A002A] font-bold mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpNombre}
                      onChange={(e) => setRsvpNombre(e.target.value)}
                      placeholder="Ej. Familia Rodríguez"
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-[#7A002A] focus:outline-none focus:border-[#7A002A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider uppercase text-[#7A002A] font-bold mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={rsvpTelefono}
                      onChange={(e) => setRsvpTelefono(e.target.value)}
                      placeholder="Ej. +1 (818) 555-0123"
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-[#7A002A] focus:outline-none focus:border-[#7A002A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider uppercase text-[#7A002A] font-bold mb-1">
                      Número de Pases Confirmados
                    </label>
                    <select
                      value={rsvpPases}
                      onChange={(e) => setRsvpPases(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#7A002A] focus:outline-none focus:border-[#7A002A]"
                    >
                      <option value="1">1 Pase</option>
                      <option value="2">2 Pases</option>
                      <option value="3">3 Pases</option>
                      <option value="4">4 Pases</option>
                      <option value="5">5 Pases</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-[#7A002A] hover:bg-[#600021] text-white py-2.5 rounded-full font-['Cinzel',serif] text-xs tracking-widest uppercase font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>CONFIRMAR POR WHATSAPP</span>
                  </button>
                </form>
              )}
            </div>

            {/* Foto de Pareja / Arco Chambelán */}
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-8 bg-pink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.archCouplePhoto}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.archCouplePhoto;
                }}
                alt="Quinceañera y Chambelán"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Ubicaciones de Iglesia y Salón */}
            <div className="space-y-4 mb-8">
              {/* Iglesia */}
              <div className="bg-white p-4 rounded-2xl shadow-md border border-pink-100 text-center">
                <h4 className="font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#7A002A] font-bold">
                  CEREMONIA RELIGIOSA
                </h4>
                <p className="text-xs text-[#7A002A] font-semibold mt-1">
                  {data.ceremoniaNombre || "St. Mary’s Church"}
                </p>
                {data.ceremoniaDireccion && (
                  <p className="text-[11px] text-[#A55B64] mt-0.5">
                    {data.ceremoniaDireccion}
                  </p>
                )}
                <a
                  href={churchMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 bg-[#7A002A] text-white px-5 py-1.5 rounded-full font-['Cinzel',serif] text-[10px] tracking-wider uppercase font-bold shadow hover:bg-[#600021] transition"
                >
                  <MapPin className="w-3 h-3" />
                  <span>VER MAPA</span>
                </a>
              </div>

              {/* Salón de Recepción */}
              <div className="bg-white p-4 rounded-2xl shadow-md border border-pink-100 text-center">
                <h4 className="font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#7A002A] font-bold">
                  RECEPCIÓN & FIESTA
                </h4>
                <p className="text-xs text-[#7A002A] font-semibold mt-1">
                  {data.recepcionNombre || "Grand Ballroom Palace"}
                </p>
                {data.recepcionDireccion && (
                  <p className="text-[11px] text-[#A55B64] mt-0.5">
                    {data.recepcionDireccion}
                  </p>
                )}
                <a
                  href={hallMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 bg-[#7A002A] text-white px-5 py-1.5 rounded-full font-['Cinzel',serif] text-[10px] tracking-wider uppercase font-bold shadow hover:bg-[#600021] transition"
                >
                  <MapPin className="w-3 h-3" />
                  <span>VER MAPA</span>
                </a>
              </div>
            </div>

            {/* Código de Vestimenta */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-pink-100 text-center mb-8">
              <h3 className="font-['Cinzel',serif] text-sm tracking-[0.25em] uppercase text-[#7A002A] font-bold mb-2">
                DRESS CODE
              </h3>
              <h4 className="font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#B74F5F] font-bold mb-3">
                ELEGANTE Y FORMAL
              </h4>
              <p className="text-xs leading-relaxed text-[#722927]">
                Acompáñanos en esta hermosa celebración y luce tu mejor atuendo para impresionar a la quinceañera. Se invita a los invitados a vestir elegantemente.{" "}
                <strong className="text-[#7A002A]">Por favor, NO usar atuendos ROSADOS ni BLANCOS</strong>, creando así una celebración tan hermosa y atemporal como este día tan especial.
              </p>
            </div>

            {/* Mesa de Regalos */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-pink-100 text-center">
              <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#7A002A] mb-1">
                Lista de Regalos
              </h3>
              <p className="text-xs leading-relaxed text-[#722927] mb-4">
                Celebrar contigo es el mejor regalo de todos. Para quienes deseen tener un detalle o traer una contribución, será recibida con mucho cariño.
              </p>

              {/* Botones de Métodos de Contribución */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-center">
                  <span className="font-['Cinzel',serif] text-[10px] font-bold text-[#7A002A]">
                    PAYPAL
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-center">
                  <span className="font-['Cinzel',serif] text-[10px] font-bold text-[#7A002A]">
                    VENMO
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-center">
                  <span className="font-['Cinzel',serif] text-[10px] font-bold text-[#7A002A]">
                    ZELLE
                  </span>
                </div>
              </div>

              {data.wishlistUrl && (
                <a
                  href={data.wishlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block bg-[#7A002A] text-white px-6 py-2 rounded-full font-['Cinzel',serif] text-xs tracking-wider uppercase font-bold shadow hover:bg-[#600021] transition"
                >
                  VER LISTA COMPLETA
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 4: EL PLAN DE LA FIESTA (TIMELINE ITINERARIO)
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-12 px-5 bg-white text-center">
          <div className="max-w-[360px] mx-auto">
            {/* Cabecera Itinerario */}
            <div className="mb-8">
              <h3 className="font-['Alex_Brush',cursive] text-4xl text-[#7A002A]">
                El
              </h3>
              <h2 className="font-['Cinzel',serif] text-2xl tracking-[0.2em] uppercase text-[#7A002A] font-bold -mt-1">
                Plan de la Fiesta
              </h2>
            </div>

            {/* Línea de Tiempo Vertical con Rosas */}
            <div className="relative border-l-2 border-pink-200 ml-6 pl-6 space-y-7 text-left">
              {itinerario.map((item: { hora: string; titulo: string }, idx: number) => (
                <div key={idx} className="relative group">
                  {/* Rosa en cada hito */}
                  <div className="absolute -left-[35px] top-0 w-5 h-5 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={QUINCE_ROSADO_ASSETS.timelineRose}
                      alt=""
                      className="w-5 h-5 object-contain"
                    />
                  </div>

                  <span className="font-['Cinzel',serif] text-xs font-bold text-[#B74F5F] tracking-wider block">
                    {item.hora}
                  </span>
                  <p className="font-['Libre_Baskerville',serif] text-sm text-[#7A002A] font-bold mt-0.5">
                    {item.titulo}
                  </p>
                </div>
              ))}
            </div>

            {/* Foto de las Damas y Quinceañera con Mariposa y Zapato */}
            <div className="mt-12 mb-8 relative">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-pink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={QUINCE_ROSADO_ASSETS.courtGroupPhoto}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.courtGroupPhoto;
                  }}
                  alt="Damas de Honor"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-['Great_Vibes',cursive] text-3xl text-[#7A002A] text-center mt-4">
                No puedo celebrar sin ti
              </p>
            </div>

            {/* Aviso: Para Nuestros Niños */}
            <div className="bg-pink-50/70 p-5 rounded-2xl border border-pink-200 text-center">
              <h4 className="font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#A55B64] font-bold mb-2">
                PARA NUESTROS NIÑOS
              </h4>
              <p className="text-xs leading-relaxed text-[#CE2962] font-medium">
                Nuestros pequeños invitados son una parte muy especial de esta celebración. Les pedimos amablemente que permanezcan sentados y acompañados por padre o tutor durante los bailes especiales y las presentaciones.
              </p>
              <p className="text-[11px] text-[#CE2962] font-semibold mt-2">
                Gracias por ayudarnos a mantener estos momentos hermosos para todos.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 5: LA CORTE DE HONOR & AGRADECIMIENTO
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-12 px-5 bg-gradient-to-b from-white to-pink-50/60 text-center">
          <div className="max-w-[360px] mx-auto">
            {/* Título Corte */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.crownIcon}
                alt="Corona"
                className="w-6 h-6 object-contain"
              />
              <h2 className="font-['Cinzel',serif] text-xl tracking-[0.2em] uppercase text-[#7A002A] font-bold">
                LA CORTE DE HONOR
              </h2>
            </div>

            {/* Integrantes de la Corte */}
            <div className="space-y-4 text-xs text-[#7A002A] mb-8">
              <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                    Quinceañera
                  </p>
                  <p className="font-medium mt-0.5">{data.titulo || "Magdalena"}</p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                    Mini Quinceañera
                  </p>
                  <p className="font-medium mt-0.5">Elsy</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                    Chambelán Principal
                  </p>
                  <p className="font-medium mt-0.5">{data.corteHonorJson?.chambelan || "Jeremiah"}</p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                    Mini Chambelán
                  </p>
                  <p className="font-medium mt-0.5">Jose</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F] mb-1">
                  Damiselas de Honor
                </p>
                <p className="font-medium leading-relaxed">
                  Violeta • Zoe • Elsy Magdalena • Tania • Yani
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F] mb-1">
                  Damitas de Hojitas
                </p>
                <p className="font-medium leading-relaxed">Violet • Zoe • Green</p>
              </div>
            </div>

            {/* Padres y Padrinos */}
            <div className="bg-white p-5 rounded-2xl shadow-md border border-pink-100 text-center mb-8">
              <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                Mis Padres
              </p>
              <p className="text-sm font-semibold text-[#7A002A] mt-0.5 mb-3">
                {data.corteHonorJson?.parents || "Magdalena & Adrian"}
              </p>

              <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                Padrinos de Honor
              </p>
              <p className="text-sm font-semibold text-[#7A002A] mt-0.5">
                {data.corteHonorJson?.padrinos?.join(" & ") || "Tania & Carl"}
              </p>
            </div>

            {/* Agradecimiento Especial */}
            <div className="text-center px-3">
              <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#7A002A] mb-2">
                Un agradecimiento especial
              </h3>
              <p className="text-xs italic leading-relaxed text-[#722927]">
                Con infinita gratitud por su amor, apoyo y generosidad al dar vida a este hermoso sueño. Su presencia, orientación y amabilidad han hecho que esta celebración sea verdaderamente inolvidable.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 6: CUENTA REGRESIVA, CALENDARIO & CIERRE
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-12 px-5 bg-white text-center">
          <div className="max-w-[360px] mx-auto">
            {/* Encabezado Cierre */}
            <p className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase text-[#CE2962] font-bold">
              NO PUEDO ESPERAR PARA PODER
            </p>
            <h2 className="font-['Cinzel',serif] text-2xl tracking-[0.15em] uppercase text-[#CE2962] font-black mt-1 mb-6">
              ¡CELEBRAR CONTIGO!
            </h2>

            {/* Contador en Vivo */}
            <div className="grid grid-cols-4 gap-2 max-w-[280px] mx-auto mb-8">
              <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                <span className="font-['Cinzel',serif] text-2xl font-bold text-[#7A002A] block leading-none">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#A55B64] font-bold mt-1 block">
                  Días
                </span>
              </div>
              <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                <span className="font-['Cinzel',serif] text-2xl font-bold text-[#7A002A] block leading-none">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#A55B64] font-bold mt-1 block">
                  Horas
                </span>
              </div>
              <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                <span className="font-['Cinzel',serif] text-2xl font-bold text-[#7A002A] block leading-none">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#A55B64] font-bold mt-1 block">
                  Min
                </span>
              </div>
              <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                <span className="font-['Cinzel',serif] text-2xl font-bold text-[#7A002A] block leading-none">
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#A55B64] font-bold mt-1 block">
                  Seg
                </span>
              </div>
            </div>

            {/* Calendario Dinámico del Evento */}
            <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-200 max-w-[320px] mx-auto mb-8 shadow-sm">
              <h4 className="font-['Alex_Brush',cursive] text-5xl sm:text-6xl text-[#7A002A] leading-tight drop-shadow-sm">
                {eventMonthName}
              </h4>
              <p className="font-['Libre_Baskerville',serif] text-sm font-bold text-[#7A002A] tracking-[0.45em] uppercase mt-1 mb-2">
                {eventYear}
              </p>

              {/* Lazo divisor horizontal idéntico a Canva */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.calendarRibbonDivider}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.calendarRibbonDivider;
                }}
                alt=""
                className="w-full max-w-[260px] h-auto my-3 mx-auto object-contain"
              />

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-1 text-center font-['Libre_Baskerville',serif] font-bold text-[#7A002A] text-xs sm:text-sm tracking-wider mb-2">
                <span>D</span>
                <span>L</span>
                <span>M</span>
                <span>M</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
              </div>

              {/* Días del mes con Lazo en el día del evento */}
              <div className="grid grid-cols-7 gap-1 text-center font-['Libre_Baskerville',serif] text-xs sm:text-sm text-[#7A002A] font-medium items-center">
                {calendarBlanks.map((_, i) => (
                  <span key={`blank-${i}`} />
                ))}

                {calendarDays.map((dayNum) => {
                  const isEventDay = dayNum === eventDay;
                  return (
                    <div
                      key={`day-${dayNum}`}
                      className="relative flex items-center justify-center aspect-square font-bold"
                    >
                      {isEventDay && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={QUINCE_ROSADO_ASSETS.calendarBowDay}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.calendarBowDay;
                          }}
                          alt="Día especial"
                          className="absolute inset-0 m-auto w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-md pointer-events-none select-none z-10 scale-125"
                        />
                      )}
                      <span
                        className={`relative z-0 font-['Libre_Baskerville',serif] text-xs sm:text-sm font-bold ${
                          isEventDay
                            ? "text-[#7A002A] font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
                            : ""
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Enlace para añadir a Google Calendar */}
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  "Quinceañera de " + (data.titulo || "Magdalena")
                )}&dates=${gcalStart}/${gcalEnd}&details=${encodeURIComponent(
                  "Celebración de Quince Años"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-5 font-['Cinzel',serif] text-[10px] tracking-widest uppercase text-[#7A002A] font-bold hover:underline"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>AÑADIR AL CALENDARIO...</span>
              </a>
            </div>

            {/* Video de YouTube Embebido */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white mb-8 bg-black">
              <iframe
                src="https://www.youtube.com/embed/o_1aF54DO60?rel=0"
                title="Quinceañera Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Retrato Final de Despedida */}
            <div className="relative w-[240px] aspect-[3/4] mx-auto rounded-t-[120px] overflow-hidden shadow-2xl border-4 border-white mb-4 bg-pink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoLady}
                alt="Despedida"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="font-['Cinzel',serif] text-xs tracking-wider uppercase text-[#7A002A] font-semibold mt-6 mb-2">
              Con amor y gratitud... te estaré esperando
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
