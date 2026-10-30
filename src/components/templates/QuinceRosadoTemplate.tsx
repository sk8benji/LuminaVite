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
import DynamicRsvpForm from "../invitation/DynamicRsvpForm";
import { parseTemplateConfig, QuinceRosadoConfig } from "@/types/templateConfigs";
import { isSectionEnabledInEvent, SeccionId } from "@/config/templateSections";
import { sanitizeUrl } from "@/lib/url-safety";

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

const MONTH_NAMES_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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

const WEEKDAY_NAMES_EN = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function parseEventDate(fechaEvento?: string | Date | null) {
  if (!fechaEvento) {
    return { year: 2027, month: 4, day: 15, hours: 16, minutes: 0 }; // Mayo 15, 2027 por defecto
  }
  if (fechaEvento instanceof Date) {
    return {
      year: fechaEvento.getFullYear(),
      month: fechaEvento.getMonth(),
      day: fechaEvento.getDate(),
      hours: fechaEvento.getHours(),
      minutes: fechaEvento.getMinutes(),
    };
  }
  const str = String(fechaEvento);
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  if (match) {
    return {
      year: parseInt(match[1], 10),
      month: parseInt(match[2], 10) - 1,
      day: parseInt(match[3], 10),
      hours: match[4] ? parseInt(match[4], 10) : 16,
      minutes: match[5] ? parseInt(match[5], 10) : 0,
    };
  }
  const d = new Date(fechaEvento);
  if (!isNaN(d.getTime())) {
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
      hours: d.getHours(),
      minutes: d.getMinutes(),
    };
  }
  return { year: 2027, month: 4, day: 15, hours: 16, minutes: 0 };
}

function parseVideoEmbed(rawUrl?: string | null): { type: "youtube" | "video"; src: string } | null {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();

  // YouTube standard, embed o youtu.be enlaces cortos
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
    };
  }

  // Archivos directos de video (MP4, WebM, etc.)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
    return {
      type: "video",
      src: url,
    };
  }

  if (url.startsWith("https://") || url.startsWith("http://")) {
    return {
      type: "youtube",
      src: url,
    };
  }

  return null;
}

export default function QuinceRosadoTemplate({
  data,
  skipIntro = false,
}: QuinceRosadoTemplateProps) {
  // ── IDIOMA (es | en | bilingual) ────────────────────────────────────
  const isBilingual = data.idiomaDefault === "bilingual";
  const [currentLang, setCurrentLang] = useState<"es" | "en">(
    data.idiomaDefault === "en" ? "en" : "es"
  );
  const isEn = currentLang === "en";

  // ── CÁLCULO DINÁMICO DE FECHA PARA CALENDARIO Y MEDALLÓN ─────────────
  const eventDateInfo = parseEventDate(data.fechaEvento);
  const eventYear = eventDateInfo.year;
  const eventMonth = eventDateInfo.month; // 0..11
  const eventDay = eventDateInfo.day;
  const eventMonthName = isEn
    ? MONTH_NAMES_EN[eventMonth] || "May"
    : MONTH_NAMES_ES[eventMonth] || "Mayo";
  const eventDayOfWeek = isEn
    ? WEEKDAY_NAMES_EN[new Date(eventYear, eventMonth, eventDay).getDay()]
    : WEEKDAY_NAMES_ES[new Date(eventYear, eventMonth, eventDay).getDay()];

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

  const handleOpenEnvelope = (chosenLang?: "es" | "en") => {
    if (chosenLang) {
      setCurrentLang(chosenLang);
    }
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
    data.fotoPortadaUrl.includes("90043c428c5ec72c7adb26dce69dedd2") ||
    data.fotoPortadaUrl.includes("da616fa36a10f18a133b2dc0383a07d0") ||
    data.fotoPortadaUrl.includes("d0a18f8a869419b00c0c5185dc620397");

  const heroPhotoUrl =
    !isDefaultOrReplicaPhoto && data.fotoPortadaUrl
      ? data.fotoPortadaUrl
      : QUINCE_ROSADO_ASSETS.heroHorseCutout;

  const photoChildhood =
    data.fotoInfanciaUrl && !data.fotoInfanciaUrl.includes("083dc0c793669d4a4d4a782851e93f65")
      ? data.fotoInfanciaUrl
      : QUINCE_ROSADO_ASSETS.polaroidDeNina;

  const photoLady =
    data.fotoActualUrl && !data.fotoActualUrl.includes("c0ec302539da1389b4c6b7d0b122ddd7")
      ? data.fotoActualUrl
      : QUINCE_ROSADO_ASSETS.polaroidASenorita;

  const photoFarewell =
    data.fotoCierreUrl &&
    !data.fotoCierreUrl.includes("90043c428c5ec72c7adb26dce69dedd2") &&
    !data.fotoCierreUrl.includes("4046b1a7e943f6186c4bd79419897578")
      ? data.fotoCierreUrl
      : photoLady;

  // Configuración dinámica por plantilla (JSONB: configPlantilla) con fallback en cascada
  const templateConfig = parseTemplateConfig<QuinceRosadoConfig>(data.configPlantilla);

  const photoShoe1 =
    templateConfig.cambioZapatillas?.fotoZapato1Url ||
    data.fotoZapato1Url ||
    QUINCE_ROSADO_ASSETS.archCouplePhoto;

  const photoShoe2 =
    templateConfig.cambioZapatillas?.fotoZapato2Url ||
    data.fotoZapato2Url ||
    QUINCE_ROSADO_ASSETS.courtGroupPhoto;

  // Itinerario default exacto de Canva si no viene personalizado
  const itinerario =
    data.itinerarioJson && data.itinerarioJson.length > 0
      ? data.itinerarioJson
      : [
          { hora: "11:00 am", titulo: "Ceremonia de la iglesia", tituloEn: "Church Ceremony", tipoIcono: "church" },
          { hora: "12:00 am", titulo: "Llegada en carruaje", tituloEn: "Carriage Arrival", tipoIcono: "carriage" },
          { hora: "1:00 pm", titulo: "Llegada al salón", tituloEn: "Banquet Hall Arrival", tipoIcono: "hall" },
          { hora: "3:00 pm", titulo: "Se servira la comida", tituloEn: "Dinner Service", tipoIcono: "dinner" },
          { hora: "4:00 pm", titulo: "Vals, Baile Sorpresa", tituloEn: "Waltz & Surprise Dance", tipoIcono: "waltz" },
          { hora: "5:00 pm", titulo: "Vals de padre e hija", tituloEn: "Father & Daughter Waltz", tipoIcono: "father_dance" },
          { hora: "6:00 pm", titulo: "Padrinos de honor", tituloEn: "Court of Honor Presentation", tipoIcono: "crown" },
          { hora: "7:00 pm", titulo: "Hora de bailar", tituloEn: "Party Time & Open Dance", tipoIcono: "party" },
        ];

  const isSectionActive = (sectionId: SeccionId): boolean => {
    return isSectionEnabledInEvent(sectionId, data.configPlantilla, {
      mostrarFrasePersonalizada: data.mostrarFrasePersonalizada,
      mostrarFechaPlacaHora: data.mostrarFechaPlacaHora,
      mostrarDressCode: data.mostrarDressCode,
      mostrarMesaRegalos: data.mostrarMesaRegalos,
      permitirConfirmacionTelefono: data.permitirConfirmacionTelefono,
    });
  };

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
          {(() => {
            const rawTitle = (data.titulo || "Magdalena").trim();
            let line1 = rawTitle;
            let line2 = "";

            if (rawTitle.includes("\n")) {
              const parts = rawTitle.split("\n");
              line1 = parts[0].trim();
              line2 = parts.slice(1).join(" ").trim();
            } else {
              const words = rawTitle.split(/\s+/);
              if (words.length >= 2) {
                line1 = words[0];
                line2 = words.slice(1).join(" ");
              }
            }

            return (
              <div className="relative z-10 pt-4 sm:pt-6 text-center px-4 shrink-0">
                {line2 ? (
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="font-['Great_Vibes',cursive] text-5xl sm:text-6xl md:text-7xl text-[#7A002A] leading-[1.05] drop-shadow-sm text-center">
                      <span className="block">{line1}</span>
                      <span className="inline-flex items-center justify-center gap-1.5 mt-0.5">
                        <span>{line2}</span>
                        {/* Rosa 3D en la cabecera */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={QUINCE_ROSADO_ASSETS.introRoseFlower}
                          alt="Rosa"
                          className="w-8 h-8 sm:w-10 sm:h-10 object-contain -mt-1 drop-shadow-md shrink-0"
                        />
                      </span>
                    </h1>
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center gap-1.5 max-w-full">
                    <h1 className="font-['Great_Vibes',cursive] text-5xl sm:text-6xl md:text-7xl text-[#7A002A] leading-tight drop-shadow-sm">
                      {line1}
                    </h1>
                    {/* Rosa 3D en la cabecera */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={QUINCE_ROSADO_ASSETS.introRoseFlower}
                      alt="Rosa"
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain -mt-1 drop-shadow-md shrink-0"
                    />
                  </div>
                )}
                <p className="font-['Cinzel',serif] text-sm sm:text-base tracking-[0.32em] uppercase text-[#7A002A] font-bold mt-1">
                  QUINCE
                </p>
              </div>
            );
          })()}

          {/* SOBRE ROSA 3D CON POLAROIDS Y LAZO (CLICABLE EN TODA EL ÁREA) */}
          <div
            onClick={() => handleOpenEnvelope()}
            className="relative w-full max-w-[320px] sm:max-w-[340px] mx-auto my-auto flex flex-col items-center px-2 cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] shrink"
          >
            {/* POLAROIDS QUE SALEN DEL SOBRE */}
            <div className="relative w-full h-44 sm:h-48 -mb-24 sm:-mb-26 z-0 pointer-events-none">
              {/* Polaroid Izquierda: MAYO 2027 (Rotada -14deg) */}
              <div
                className={`absolute left-3 top-0 w-[145px] sm:w-[160px] bg-white p-1.5 pb-4 shadow-2xl rounded-sm transform -rotate-12 transition-transform duration-700 border border-pink-100 ${
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
                <p className="font-['Cinzel',serif] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#B74F5F] font-bold text-center mt-2">
                  {`${eventMonthName.toUpperCase()} ${eventYear}`}
                </p>
              </div>

              {/* Polaroid Derecha: Dinámico (Día y Número) */}
              <div
                className={`absolute right-3 top-2 w-[145px] sm:w-[160px] bg-white p-1.5 pb-4 shadow-2xl rounded-sm transform rotate-8 transition-transform duration-700 border border-pink-100 ${
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
                <p className="font-['Cinzel',serif] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#B74F5F] font-bold text-center mt-2">
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
                className="absolute top-2 inset-x-8 w-4/5 h-16 sm:h-20 object-cover rounded-t-full pointer-events-none opacity-90"
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
                  className="w-[240px] sm:w-[270px] h-auto object-contain drop-shadow-xl"
                />
              </div>

              {/* Sello Interactivo: Más grande y con efecto visual destacado */}
              <div
                aria-label="Abrir invitación"
                className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-110 active:scale-95 focus:outline-none z-20"
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
          {isBilingual ? (
            <div className="relative z-10 pb-5 sm:pb-7 text-center px-3 shrink-0">
              <h2 className="font-['Great_Vibes',cursive] text-2xl sm:text-3xl md:text-4xl text-[#7A002A] leading-tight drop-shadow-sm mb-1 whitespace-nowrap">
                ¡Estás invitado! • You’re Invited!
              </h2>
              <p className="font-['Cinzel',serif] text-[9.5px] sm:text-[11px] tracking-[0.15em] uppercase text-[#B74F5F] font-semibold mb-2.5 whitespace-nowrap">
                Selecciona tu idioma - Choose Your language
              </p>
              <div className="flex items-center justify-center gap-2.5 sm:gap-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEnvelope("es");
                  }}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#7A002A] text-white hover:bg-[#600021] border border-pink-200 shadow-lg font-['Cinzel',serif] text-[11px] sm:text-xs tracking-[0.12em] uppercase font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>🇲🇽</span>
                  <span>ESPAÑOL</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEnvelope("en");
                  }}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#7A002A] text-white hover:bg-[#600021] border border-pink-200 shadow-lg font-['Cinzel',serif] text-[11px] sm:text-xs tracking-[0.12em] uppercase font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>🇺🇸</span>
                  <span>ENGLISH</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleOpenEnvelope(isEn ? "en" : "es")}
              className="relative z-10 pb-8 text-center px-4 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <h2 className="font-['Great_Vibes',cursive] text-5xl sm:text-6xl text-[#7A002A] leading-tight drop-shadow-sm">
                {isEn ? "You’re Invited!" : "¡Estás invitado!"}
              </h2>
              <p className="font-['Cinzel',serif] text-xs tracking-[0.25em] uppercase text-[#B74F5F] font-semibold mt-1">
                {isEn ? "Tap the envelope to open" : "Toca el sobre para abrir"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CONTENEDOR PRINCIPAL MÓVIL (430px)
      ══════════════════════════════════════════════════════════════ */}
      <main className="relative w-full max-w-[430px] mx-auto min-h-screen bg-white shadow-2xl overflow-x-hidden text-[#7A002A]">
        {/* SELECTOR DE IDIOMA FLOTANTE (Solo si la invitación es Bilingüe) */}
        {isBilingual && (
          <aside
            aria-label="Selector de idioma"
            className="fixed top-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-pink-200 rounded-full shadow-lg p-1 flex items-center gap-1 text-[11px] font-['Cinzel',serif] tracking-wider"
          >
            <button
              type="button"
              onClick={() => setCurrentLang("es")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold ${
                currentLang === "es"
                  ? "bg-[#7A002A] text-white shadow-sm"
                  : "text-[#B74F5F] hover:text-[#7A002A]"
              }`}
            >
              ES
            </button>
            <span className="text-pink-200">|</span>
            <button
              type="button"
              onClick={() => setCurrentLang("en")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold ${
                currentLang === "en"
                  ? "bg-[#7A002A] text-white shadow-sm"
                  : "text-[#B74F5F] hover:text-[#7A002A]"
              }`}
            >
              EN
            </button>
          </aside>
        )}
        {/* BOTÓN REPRODUCTOR FLOTANTE DISCRETO */}
        {data.musicaUrl && isSectionActive("musica") && (
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
        <section className="relative w-full flex flex-col items-center pt-14 sm:pt-16 pb-10 px-4 overflow-hidden select-none">
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
          <div className="relative w-full max-w-[340px] mx-auto text-center mb-3 pt-2 z-10">
            {/* "CON" */}
            <p className="font-['Libre_Baskerville',serif] text-sm sm:text-base tracking-[0.35em] uppercase text-[#7A002A] font-bold">
              {isEn ? "WITH" : "CON"}
            </p>

            {/* "Amor" */}
            <h2 className="font-['Alex_Brush',cursive] text-7xl sm:text-8xl text-[#7A002A] leading-[0.85] my-0.5 drop-shadow-sm select-none">
              {isEn ? "Love" : "Amor"}
            </h2>

            {/* "LE INVITAMOS" (Alineado a la derecha debajo de "Amor") */}
            <div className="w-full flex justify-end pr-3 sm:pr-4 pt-0.5">
              <p className="font-['Libre_Baskerville',serif] text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#7A002A] font-bold">
                {isEn ? "YOU ARE INVITED" : "LE INVITAMOS"}
              </p>
            </div>
          </div>

          {/* Marco de Arco Quinceañera (Réplica Canva con soporte de Foto Personalizada) */}
          <div className="relative w-full max-w-[335px] sm:max-w-[350px] mx-auto my-3 z-10">
            {isDefaultOrReplicaPhoto ? (
              <>
                {/* 1. Marco de Arco Base con el Fondo del Jardín (Demo) */}
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

                {/* 2. Capa Pop-Out 3D: Chica con el Caballo (Demo) */}
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={QUINCE_ROSADO_ASSETS.heroHorseCutout}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.heroHorseCutout;
                    }}
                    alt={data.titulo}
                    className="w-full h-full object-cover object-center scale-[1.01] translate-x-[-1%] translate-y-[2%]"
                  />
                </div>
              </>
            ) : (
              /* Foto Personalizada del Cliente: DENTRO del arco con su borde blanco y sombra suave */
              <div className="relative w-full aspect-[52/64] rounded-t-[175px] border-[4.5px] border-white shadow-[0_15px_35px_rgba(122,0,42,0.18)] overflow-hidden bg-gradient-to-b from-rose-100 via-pink-50 to-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroPhotoUrl}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.heroGardenBg;
                  }}
                  alt={data.titulo || "Foto de portada"}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}
          </div>

          {/* Nombre & Quinceañera */}
          <div className="relative z-10 text-center mt-2 mb-6">
            <h1 className="font-['Alex_Brush',cursive] text-6xl sm:text-7xl text-[#7A002A] leading-none drop-shadow-sm">
              {data.titulo || "Magdalena"}
            </h1>
            <p className="font-['Libre_Baskerville',serif] text-xs sm:text-sm tracking-[0.45em] uppercase text-[#7A002A] font-bold mt-2">
              {data.subtitulo || (isEn ? "MY QUINCEAÑERA" : "LA QUINCEAÑERA")}
            </p>
          </div>

          {/* Medallón de Fecha Circular con Cinta */}
          {isSectionActive("medallonFecha") && (
            <div data-preview-section="medallonFecha" className="relative z-10 flex items-center justify-center gap-4 w-full max-w-[290px] mx-auto py-2">
              {/* Medallón circular dusty rose */}
              <div className="relative w-24 h-24 rounded-full bg-[#A55B64] text-white flex flex-col items-center justify-center shadow-lg border-2 border-white">
                <span className="font-['Great_Vibes',cursive] text-3xl leading-none">15</span>
                <span className="font-['Cinzel',serif] text-[9px] tracking-widest uppercase font-bold -mt-0.5">
                  {isEn ? "YEARS" : "AÑOS"}
                </span>
              </div>

              {/* Bloque de Fecha */}
              <div className="flex flex-col text-left">
                <span className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase font-bold text-[#7A002A]">
                  {eventDayOfWeek}
                </span>
                <span className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase font-bold text-[#7A002A]">
                  {eventMonthName.toUpperCase()}
                </span>
                <span className="font-['Great_Vibes',cursive] text-4xl text-[#B74F5F] leading-none my-0.5">
                  {eventDay}
                </span>
                {data.mostrarFechaPlacaHora !== false && (
                  <span className="font-['Cinzel',serif] text-[10px] tracking-wider text-[#7A002A] font-medium">
                    {(() => {
                      const h = eventDateInfo.hours;
                      const m = eventDateInfo.minutes;
                      const ampm = h >= 12 ? "PM" : "AM";
                      const h12 = h % 12 || 12;
                      const mStr = m ? `:${String(m).padStart(2, "0")}` : ":00";
                      return isEn ? `AT ${h12}${mStr} ${ampm}` : `A las ${h12}${mStr} ${ampm}`;
                    })()}
                  </span>
                )}
              </div>

              {/* Rosa pequeña decorativa */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QUINCE_ROSADO_ASSETS.heroRoseAccent}
                alt=""
                className="w-10 h-10 object-contain self-start -ml-2"
              />
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 2: DEDICATORIA & POLAROIDS ("DE NIÑA A SEÑORITA")
        ══════════════════════════════════════════════════════════════ */}
        {isSectionActive("dedicatoria") && (
          <section data-preview-section="dedicatoria" className="relative w-full py-12 px-5 bg-white overflow-hidden text-center">
            {/* Fondo de brillo suave */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={QUINCE_ROSADO_ASSETS.dedicationGlitter}
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 select-none"
            />

            <div className="relative z-10 max-w-[350px] mx-auto">
              {/* Texto emotivo de la niña */}
              {data.mostrarFrasePersonalizada !== false && (
                <p className="font-['Lora',serif] text-xs sm:text-[13px] leading-relaxed text-[#722927] italic text-justify px-2 mb-10">
                  {(() => {
                    if (isEn) {
                      if (data.frasePersonalizadaEn) return data.frasePersonalizadaEn;
                      const frase = (data.frasePersonalizada || "").toLowerCase();
                      if (frase.includes("hoy comienzo a escribir") || frase.includes("nuevo capítulo") || frase.includes("convertirme en mujer")) {
                        return "Today I begin to write a new chapter as I leave childhood behind to become a young woman. On this special day, surrounded by the love of those I cherish most, it would be an honor to have your presence to celebrate a moment I will keep in my heart forever.";
                      }
                      if (frase.includes("desde que era una niña") || frase.includes("magdalena")) {
                        return "Ever since she was a little girl, Magdalena has dreamed of this very moment: a day filled with love, beauty, and unforgettable memories. Today, that dream comes true as she celebrates her quinceañera, marking the beautiful transition from a young girl to an elegant young lady. Surrounded by family, tradition, and all who have guided her along the way, this milestone represents growth, faith, and new beginnings. With a heart full of gratitude, Magdalena invites you to be part of this once-in-a-lifetime celebration.";
                      }
                      if (frase.includes("bendición de dios") || frase.includes("honor de invitarte")) {
                        return "With God's blessing and the love of my family, I have the honor of inviting you to celebrate this long-awaited day with us.";
                      }
                      return data.frasePersonalizada || "Today I begin to write a new chapter as I leave childhood behind to become a young woman. On this special day, surrounded by the love of those I cherish most, it would be an honor to have your presence to celebrate a moment I will keep in my heart forever.";
                    }
                    return data.frasePersonalizada || "Hoy comienzo a escribir un nuevo capítulo al dejar atrás mi niñez para convertirme en mujer. En este día tan especial, rodeada del cariño de quienes más quiero, sería un honor contar con tu presencia para celebrar un momento que guardaré por siempre en mi corazón.";
                  })()}
                </p>
              )}

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
                  {isEn ? "Childhood" : "De niña"}
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
                    alt={isEn ? "Sweet 15" : "A señorita"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-['Great_Vibes',cursive] text-2xl text-[#B74F5F] text-center mt-3">
                  {isEn ? "Sweet 15" : "A señorita"}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 3: RSVP, UBICACIONES, DRESS CODE & REGALOS
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-12 px-5 bg-gradient-to-b from-pink-50/50 to-white">
          <div className="max-w-[360px] mx-auto">
            {/* Tarjeta de Confirmación de Asistencia Dinámica con Búsqueda de Invitados */}
            {isSectionActive("rsvp") && (
              <div className="mb-8">
                <DynamicRsvpForm
                  slug={data.slug || "demo"}
                  eventTitle={data.titulo}
                  eventDate={data.fechaEvento}
                  ceremoniaMapUrl={churchMapUrl}
                  recepcionMapUrl={hallMapUrl}
                  telefonoWhatsapp={data.telefonoWhatsappRsvp}
                  primaryColor="#7A002A"
                  accentBgColor="bg-white/95"
                  deadlineText={data.rsvpFechaLimite || (isEn ? "PLEASE CONFIRM YOUR ATTENDANCE BEFORE NOVEMBER 15." : "POR FAVOR, CONFIRMA TU ASISTENCIA ANTES DEL 20 DE OCTUBRE.")}
                  lang={currentLang}
                  permiteSms={data.permiteSms}
                  tipoPlan={data.tipoPlan}
                  modalidadRsvp={data.modalidadRsvp || undefined}
                  maxPasesPorInvitado={data.maxPasesPorInvitado}
                  permitirConfirmacionTelefono={data.permitirConfirmacionTelefono !== false}
                />
              </div>
            )}

            {/* Foto de Zapatos 1 (Zapatilla de Cristal / Decorativa Ceremonia) */}
            {isSectionActive("fotoZapatos1") && (
              <div data-preview-section="fotoZapatos1" className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-8 bg-pink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoShoe1}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.archCouplePhoto;
                  }}
                  alt="Zapatos Quinceañera 1"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Ubicaciones de Iglesia y Salón */}
            {isSectionActive("ubicaciones") && (
              <div data-preview-section="ubicaciones" className="space-y-4 mb-8">
                {/* Iglesia */}
                <div className="bg-white p-4 rounded-2xl shadow-md border border-pink-100 text-center">
                  <h4 className="font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#7A002A] font-bold">
                    {isEn ? "RELIGIOUS CEREMONY" : "CEREMONIA RELIGIOSA"}
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
                    <span>{isEn ? "VIEW MAP" : "VER MAPA"}</span>
                  </a>
                </div>

                {/* Salón de Recepción */}
                <div className="bg-white p-4 rounded-2xl shadow-md border border-pink-100 text-center">
                  <h4 className="font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#7A002A] font-bold">
                    {isEn ? "RECEPTION & PARTY" : "RECEPCIÓN & FIESTA"}
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
                    <span>{isEn ? "VIEW MAP" : "VER MAPA"}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Código de Vestimenta */}
            {isSectionActive("dressCode") && (
              <div data-preview-section="dressCode" className="bg-white p-6 rounded-3xl shadow-xl border border-pink-100 text-center mb-8">
                <h3 className="font-['Cinzel',serif] text-sm tracking-[0.25em] uppercase text-[#7A002A] font-bold mb-2">
                  {isEn ? "DRESS CODE" : "CÓDIGO DE VESTIMENTA"}
                </h3>
                <h4 className="font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#B74F5F] font-bold mb-3">
                  {isEn
                    ? (data.dressCodeTituloEn || (data.dressCodeTitulo === "ELEGANTE Y FORMAL" || !data.dressCodeTitulo ? "ELEGANT & FORMAL" : data.dressCodeTitulo))
                    : (data.dressCodeTitulo || "ELEGANTE Y FORMAL")}
                </h4>
                <p className="text-xs leading-relaxed text-[#722927]">
                  {(() => {
                    if (isEn) {
                      if (data.dressCodeNotaEn) return data.dressCodeNotaEn;
                      const note = (data.dressCodeNota || "").toLowerCase();
                      if (note.includes("rosa") || note.includes("rosado") || note.includes("quinceañera")) {
                        return "Blush pink tones reserved exclusively for the quinceañera. Guests are encouraged to wear elegant formal attire.";
                      }
                      if (note.includes("azul")) {
                        return "Blue tones reserved exclusively for the quinceañera. Guests are encouraged to wear elegant formal attire.";
                      }
                      return data.dressCodeNota || "Join us in this wonderful celebration dressed in your best attire. Guests are encouraged to wear elegant formal clothes.";
                    }
                    return data.dressCodeNota || "Acompáñanos en esta hermosa celebración y luce tu mejor atuendo para impresionar a la quinceañera. Se invita a los invitados a vestir elegantemente. Por favor, NO usar atuendos ROSADOS ni BLANCOS, creando así una celebración tan hermosa y atemporal como este día tan especial.";
                  })()}
                </p>
              </div>
            )}

            {/* Mesa de Regalos */}
            {isSectionActive("mesaRegalos") && (
              <div data-preview-section="mesaRegalos" className="bg-white p-6 rounded-3xl shadow-xl border border-pink-100 text-center">
                <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#7A002A] mb-1">
                  {isEn ? "Gift Registry" : "Lista de Regalos"}
                </h3>
                <p className="text-xs leading-relaxed text-[#722927] mb-4">
                  {(() => {
                    if (isEn) {
                      if (data.regalosMensajeEn) return data.regalosMensajeEn;
                      const msg = (data.regalosMensaje || "").toLowerCase();
                      if (msg.includes("cofre") || msg.includes("mayor regalo")) {
                        return "Your presence is our greatest gift. A gift box will be available at the reception.";
                      }
                      if (msg.includes("celebrar contigo") || msg.includes("contribución")) {
                        return "Celebrating with you is the greatest gift of all. For those wishing to bring a contribution or detail, it will be received with love.";
                      }
                      return data.regalosMensaje || "Your presence is our greatest gift. A gift box will be available at the reception.";
                    }
                    return data.regalosMensaje || "Tu presencia es nuestro mayor regalo. Disponemos de un cofre en la recepción.";
                  })()}
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

                {sanitizeUrl(data.wishlistUrl) && (
                  <a
                    href={sanitizeUrl(data.wishlistUrl) as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block bg-[#7A002A] text-white px-6 py-2 rounded-full font-['Cinzel',serif] text-xs tracking-wider uppercase font-bold shadow hover:bg-[#600021] transition"
                  >
                    {isEn ? "VIEW FULL REGISTRY" : "VER LISTA COMPLETA"}
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 4: EL PLAN DE LA FIESTA (TIMELINE ITINERARIO)
        ══════════════════════════════════════════════════════════════ */}
        {(isSectionActive("itinerario") || isSectionActive("fotoZapatos2")) && (
          <section className="relative w-full py-12 px-5 bg-white text-center">
            <div className="max-w-[360px] mx-auto">
              {isSectionActive("itinerario") && (
                <>
                  {/* Cabecera Itinerario */}
                  <div data-preview-section="itinerario" className="mb-8">
                    <h3 className="font-['Alex_Brush',cursive] text-4xl text-[#7A002A]">
                      {isEn ? "The" : "El"}
                    </h3>
                    <h2 className="font-['Cinzel',serif] text-2xl tracking-[0.2em] uppercase text-[#7A002A] font-bold -mt-1">
                      {isEn ? "Party Timeline" : "Plan de la Fiesta"}
                    </h2>
                  </div>

                  {/* Línea de Tiempo Vertical con Rosas */}
                  <div className="relative border-l-2 border-pink-200 ml-6 pl-6 space-y-7 text-left">
                    {itinerario.map((item: { hora: string; titulo: string; tituloEn?: string }, idx: number) => (
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
                          {(() => {
                            if (!isEn) return item.titulo;
                            if (item.tituloEn) return item.tituloEn;
                            const lower = (item.titulo || "").toLowerCase().trim();
                            if (lower.includes("ceremonia") || lower.includes("iglesia") || lower.includes("misa")) {
                              if (lower.includes("san josé") || lower.includes("san jose")) {
                                return "Religious Ceremony at St. Joseph the Worker Church";
                              }
                              return "Religious Ceremony";
                            }
                            if (lower.includes("llegada") && lower.includes("invitados")) return "Guest Arrival";
                            if (lower.includes("llegada") && lower.includes("salón")) return "Arrival at Banquet Hall";
                            if (lower.includes("llegada") && lower.includes("carruaje")) return "Carriage Arrival";
                            if (lower.includes("cena") && lower.includes("brindis")) return "Dinner & Toast";
                            if (lower.includes("cena") || lower.includes("comida")) return "Dinner Service";
                            if (lower.includes("vals") && (lower.includes("fiesta") || lower.includes("baile"))) return "Waltz & Celebration";
                            if (lower.includes("vals") && lower.includes("padre")) return "Father & Daughter Waltz";
                            if (lower.includes("vals")) return "The Waltz";
                            if (lower.includes("padrinos")) return "Court of Honor Presentation";
                            if (lower.includes("bailar") || lower.includes("baile") || lower.includes("fiesta")) return "Party Time & Open Dance";
                            return item.titulo;
                          })()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Foto de Zapatos 2 (Zapatilla en Cojín / Corte de Honor y Damas) & Aviso Niños */}
              {isSectionActive("fotoZapatos2") && (
                <>
                  <div data-preview-section="fotoZapatos2" className="mt-12 mb-8 relative">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-pink-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoShoe2}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = QUINCE_ROSADO_ASSETS.s3.courtGroupPhoto;
                        }}
                        alt="Zapatos Quinceañera 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-['Great_Vibes',cursive] text-3xl text-[#7A002A] text-center mt-4">
                      {data.mensajeDespedida || (isEn ? "I can’t celebrate without you" : "No puedo celebrar sin ti")}
                    </p>
                  </div>

                  {/* Aviso: Para Nuestros Niños */}
                  <div className="bg-pink-50/70 p-5 rounded-2xl border border-pink-200 text-center">
                    <h4 className="font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#A55B64] font-bold mb-2">
                      {isEn ? "FOR OUR LITTLE GUESTS" : "PARA NUESTROS NIÑOS"}
                    </h4>
                    <p className="text-xs leading-relaxed text-[#CE2962] font-medium">
                      {isEn
                        ? "Our little guests are a very special part of this celebration. We kindly ask that they remain seated and accompanied by a parent or guardian during special dances and presentations."
                        : "Nuestros pequeños invitados son una parte muy especial de esta celebración. Les pedimos amablemente que permanezcan sentados y acompañados por padre o tutor durante los bailes especiales y las presentaciones."}
                    </p>
                    <p className="text-[11px] text-[#CE2962] font-semibold mt-2">
                      {isEn
                        ? "Thank you for helping us keep these moments beautiful for everyone."
                        : "Gracias por ayudarnos a mantener estos momentos hermosos para todos."}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 5: LA CORTE DE HONOR & AGRADECIMIENTO
        ══════════════════════════════════════════════════════════════ */}
        {(() => {
          const corte = data.corteHonorJson || {};

          const isRoleShown = (showFlag: any, val: any) => {
            if (showFlag === false) return false;
            if (showFlag === true) return true;
            if (Array.isArray(val)) return val.length > 0;
            return Boolean(val);
          };

          const quinceaneraName = corte.quinceanera || data.titulo || "Magdalena";
          const showQuinceanera = corte.showQuinceanera !== false;
          const miniQuinceaneraName = corte.miniQuinceanera || "";
          const showMiniQuinceanera = isRoleShown(corte.showMiniQuinceanera, miniQuinceaneraName) && Boolean(miniQuinceaneraName);

          const chambelanName = corte.chambelan || "";
          const showChambelan = isRoleShown(corte.showChambelan, chambelanName) && Boolean(chambelanName);
          const miniChambelanName = corte.miniChambelan || "";
          const showMiniChambelan = isRoleShown(corte.showMiniChambelan, miniChambelanName) && Boolean(miniChambelanName);

          const damasArr: string[] = Array.isArray(corte.damas)
            ? corte.damas
            : typeof corte.damas === "string"
            ? corte.damas.split(/[,•]+/).map((s: string) => s.trim()).filter(Boolean)
            : [];
          const showDamas = isRoleShown(corte.showDamas, damasArr) && damasArr.length > 0;

          const damitasArr: string[] = Array.isArray(corte.damitasHojitas)
            ? corte.damitasHojitas
            : typeof corte.damitasHojitas === "string"
            ? corte.damitasHojitas.split(/[,•]+/).map((s: string) => s.trim()).filter(Boolean)
            : [];
          const showDamitasHojitas = isRoleShown(corte.showDamitasHojitas, damitasArr) && damitasArr.length > 0;

          const parentsName = corte.parents || "";
          const showParents = isRoleShown(corte.showParents, parentsName) && Boolean(parentsName);

          const padrinosArr: string[] = Array.isArray(corte.padrinos)
            ? corte.padrinos
            : typeof corte.padrinos === "string"
            ? corte.padrinos.split(/[,•]+/).map((s: string) => s.trim()).filter(Boolean)
            : [];
          const showPadrinos = isRoleShown(corte.showPadrinos, padrinosArr) && padrinosArr.length > 0;

          const hasAnyCorteCards =
            showQuinceanera ||
            showMiniQuinceanera ||
            showChambelan ||
            showMiniChambelan ||
            showDamas ||
            showDamitasHojitas ||
            showParents ||
            showPadrinos;

          if (!isSectionActive("corteHonor")) return null;

          return (
            <section data-preview-section="corteHonor" className="relative w-full py-12 px-5 bg-gradient-to-b from-white to-pink-50/60 text-center">
              <div className="max-w-[360px] mx-auto">
                {hasAnyCorteCards && (
                  <>
                    {/* Título Corte */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={QUINCE_ROSADO_ASSETS.crownIcon}
                        alt="Corona"
                        className="w-6 h-6 object-contain"
                      />
                      <h2 className="font-['Cinzel',serif] text-xl tracking-[0.2em] uppercase text-[#7A002A] font-bold">
                        {isEn ? "THE COURT OF HONOR" : "LA CORTE DE HONOR"}
                      </h2>
                    </div>

                    {/* Integrantes de la Corte */}
                    <div className="space-y-4 text-xs text-[#7A002A] mb-8">
                      {/* 1. Quinceañera y/o Mini Quinceañera */}
                      {showQuinceanera && showMiniQuinceanera ? (
                        <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                          <div>
                            <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                              {isEn ? "Quinceañera" : "Quinceañera"}
                            </p>
                            <p className="font-medium mt-0.5">{quinceaneraName}</p>
                          </div>
                          <div>
                            <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                              {isEn ? "Junior Quinceañera" : "Mini Quinceañera"}
                            </p>
                            <p className="font-medium mt-0.5">{miniQuinceaneraName}</p>
                          </div>
                        </div>
                      ) : showQuinceanera ? (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                          <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                            {isEn ? "Quinceañera" : "Quinceañera"}
                          </p>
                          <p className="font-medium mt-0.5">{quinceaneraName}</p>
                        </div>
                      ) : showMiniQuinceanera ? (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                          <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                            {isEn ? "Junior Quinceañera" : "Mini Quinceañera"}
                          </p>
                          <p className="font-medium mt-0.5">{miniQuinceaneraName}</p>
                        </div>
                      ) : null}

                      {/* 2. Chambelán Principal y/o Mini Chambelán */}
                      {showChambelan && showMiniChambelan ? (
                        <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                          <div>
                            <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                              {isEn ? "Main Escort" : "Chambelán Principal"}
                            </p>
                            <p className="font-medium mt-0.5">{chambelanName}</p>
                          </div>
                          <div>
                            <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                              {isEn ? "Junior Escort" : "Mini Chambelán"}
                            </p>
                            <p className="font-medium mt-0.5">{miniChambelanName}</p>
                          </div>
                        </div>
                      ) : showChambelan ? (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                          <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                            {isEn ? "Main Escort" : "Chambelán Principal"}
                          </p>
                          <p className="font-medium mt-0.5">{chambelanName}</p>
                        </div>
                      ) : showMiniChambelan ? (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                          <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                            {isEn ? "Junior Escort" : "Mini Chambelán"}
                          </p>
                          <p className="font-medium mt-0.5">{miniChambelanName}</p>
                        </div>
                      ) : null}

                      {/* 3. Damiselas de Honor */}
                      {showDamas && (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                          <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F] mb-1">
                            {isEn ? "Maids of Honor" : "Damiselas de Honor"}
                          </p>
                          <p className="font-medium leading-relaxed">
                            {damasArr.join(" • ")}
                          </p>
                        </div>
                      )}

                      {/* 4. Damitas de Hojitas */}
                      {showDamitasHojitas && (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 text-center">
                          <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F] mb-1">
                            {isEn ? "Flower Girls" : "Damitas de Hojitas"}
                          </p>
                          <p className="font-medium leading-relaxed">
                            {damitasArr.join(" • ")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Padres y Padrinos */}
                    {(showParents || showPadrinos) && (
                      <div className="bg-white p-5 rounded-2xl shadow-md border border-pink-100 text-center mb-8">
                        {showParents && (
                          <div className={showPadrinos ? "mb-3" : ""}>
                            <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                              {isEn ? "My Parents" : "Mis Padres"}
                            </p>
                            <p className="text-sm font-semibold text-[#7A002A] mt-0.5">
                              {parentsName}
                            </p>
                          </div>
                        )}

                        {showPadrinos && (
                          <div>
                            <p className="font-bold uppercase tracking-wider text-[10px] text-[#B74F5F]">
                              {isEn ? "Honor Godparents" : "Padrinos de Honor"}
                            </p>
                            <p className="text-sm font-semibold text-[#7A002A] mt-0.5">
                              {padrinosArr.join(" & ")}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Agradecimiento Especial */}
                <div className="text-center px-3">
                  <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#7A002A] mb-2">
                    {isEn ? "A special thank you" : "Un agradecimiento especial"}
                  </h3>
                  <p className="text-xs italic leading-relaxed text-[#722927]">
                    {corte.mensajeGratitud ||
                      (isEn
                        ? "With endless gratitude for your love, support, and generosity in bringing this beautiful dream to life. Your presence, guidance, and kindness have made this celebration truly unforgettable."
                        : "Con infinita gratitud por su amor, apoyo y generosidad al dar vida a este hermoso sueño. Su presencia, orientación y amabilidad han hecho que esta celebración sea verdaderamente inolvidable.")}
                  </p>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN 6: CUENTA REGRESIVA, CALENDARIO & CIERRE
        ══════════════════════════════════════════════════════════════ */}
        {(isSectionActive("cuentaRegresiva") || isSectionActive("videoDespedida")) && (
          <section className="relative w-full py-12 px-5 bg-white text-center">
            <div className="max-w-[360px] mx-auto">
              {isSectionActive("cuentaRegresiva") && (
                <>
                  {/* Encabezado Cierre */}
                  <p data-preview-section="cuentaRegresiva" className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase text-[#CE2962] font-bold">
                    {isEn ? "I CANNOT WAIT TO" : "NO PUEDO ESPERAR PARA PODER"}
                  </p>
                  <h2 className="font-['Cinzel',serif] text-2xl tracking-[0.15em] uppercase text-[#CE2962] font-black mt-1 mb-6">
                    {isEn ? "CELEBRATE WITH YOU!" : "¡CELEBRAR CONTIGO!"}
                  </h2>

                  {/* Contador en Vivo */}
                  <div className="grid grid-cols-4 gap-2 max-w-[280px] mx-auto mb-8">
                    <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                      <span className="font-['Cinzel',serif] text-2xl font-bold text-[#7A002A] block leading-none">
                        {timeLeft.days}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#A55B64] font-bold mt-1 block">
                        {isEn ? "Days" : "Días"}
                      </span>
                    </div>
                    <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                      <span className="font-['Cinzel',serif] text-2xl font-bold text-[#7A002A] block leading-none">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#A55B64] font-bold mt-1 block">
                        {isEn ? "Hours" : "Horas"}
                      </span>
                    </div>
                    <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                      <span className="font-['Cinzel',serif] text-2xl font-bold text-[#7A002A] block leading-none">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#A55B64] font-bold mt-1 block">
                        {isEn ? "Min" : "Min"}
                      </span>
                    </div>
                    <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200">
                      <span className="font-['Cinzel',serif] text-2xl font-bold text-[#7A002A] block leading-none">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#A55B64] font-bold mt-1 block">
                        {isEn ? "Sec" : "Seg"}
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
                      {isEn ? (
                        <>
                          <span>S</span>
                          <span>M</span>
                          <span>T</span>
                          <span>W</span>
                          <span>T</span>
                          <span>F</span>
                          <span>S</span>
                        </>
                      ) : (
                        <>
                          <span>D</span>
                          <span>L</span>
                          <span>M</span>
                          <span>M</span>
                          <span>J</span>
                          <span>V</span>
                          <span>S</span>
                        </>
                      )}
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
                        (isEn ? "Quinceañera of " : "Quinceañera de ") + (data.titulo || "Magdalena")
                      )}&dates=${gcalStart}/${gcalEnd}&details=${encodeURIComponent(
                        isEn ? "Sweet 15 Celebration" : "Celebración de Quince Años"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-5 font-['Cinzel',serif] text-[10px] tracking-widest uppercase text-[#7A002A] font-bold hover:underline"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{isEn ? "ADD TO CALENDAR..." : "AÑADIR AL CALENDARIO..."}</span>
                    </a>
                  </div>
                </>
              )}

              {/* Video de Agradecimiento y Retrato Final de Despedida */}
              {isSectionActive("videoDespedida") && (
                <>
                  {/* Video de Agradecimiento o Sesión Previa */}
                  {(() => {
                    const videoEmbed = parseVideoEmbed(data.videoUrl);
                    if (!videoEmbed) return null;

                    return (
                      <div data-preview-section="videoDespedida" className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white mb-8 bg-black">
                        {videoEmbed.type === "youtube" ? (
                          <iframe
                            src={videoEmbed.src}
                            title="Quinceañera Video"
                            // Sandbox restrictivo: el iframe no puede navegar el top ni abrir popups
                            sandbox="allow-scripts allow-same-origin allow-presentation"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        ) : (
                          <video
                            src={videoEmbed.src}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    );
                  })()}

                  {/* Retrato Final de Despedida */}
                  <div data-preview-section="videoDespedida" className="relative w-[240px] aspect-[3/4] mx-auto rounded-t-[120px] overflow-hidden shadow-2xl border-4 border-white mb-4 bg-pink-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoFarewell}
                      alt="Despedida"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="font-['Cinzel',serif] text-xs tracking-wider uppercase text-[#7A002A] font-semibold mt-6 mb-2">
                    {isEn
                      ? "With love and gratitude... I’ll be waiting for you"
                      : "Con amor y gratitud... te estaré esperando"}
                  </p>
                </>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
