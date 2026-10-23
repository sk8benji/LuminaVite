"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, CheckCircle2, Sparkles, MessageCircle, Music, Pause, CalendarPlus, Phone, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { InvitationData } from "../invitation/InvitationMobileView";
import { getMapEmbedUrl, getMapDirectionsUrl } from "@/lib/maps";
import { ERA_ASSETS } from "@/lib/templates/eraPinkAssets";
import { parseTemplateConfig, QuinceEraPinkConfig } from "@/types/templateConfigs";

export default function QuinceEraPinkTemplate({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const templateConfig = parseTemplateConfig<QuinceEraPinkConfig>(data.configPlantilla);
  // Estado para la Intro 3D del Sobre
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isEnvelopeFading, setIsEnvelopeFading] = useState(false);
  const [isEnvelopeRemoved, setIsEnvelopeRemoved] = useState(false);
  const [isLetterOut, setIsLetterOut] = useState(false);
  const [isEnvelopeExiting, setIsEnvelopeExiting] = useState(false);

  // Audio de fondo
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Cuenta regresiva
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Formulario RSVP
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedSeats, setSelectedSeats] = useState("2");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccessData, setRsvpSuccessData] = useState<{
    guestName: string;
    seats: number;
    message: string;
  } | null>(null);
  const [rsvpFeedback, setRsvpFeedback] = useState<{
    msg: string;
    isUpdate: boolean;
    isError?: boolean;
  } | null>(null);

  // Destinatario general de cortesía
  const [guestRecipient, setGuestRecipient] = useState("Familia & Amigos");

  // Idioma (es | en | bilingual)
  const isBilingual = data.idiomaDefault === "bilingual";
  // Idioma por defecto de la intro: solo los eventos en español puro nacen
  // en español; en inglés o bilingües el defecto es inglés. Tocar el sello
  // abre con este idioma si no se escogió uno explícito en los botones.
  const [currentLang, setCurrentLang] = useState<"es" | "en">(
    data.idiomaDefault === "es" ? "es" : "en"
  );
  const isEn = currentLang === "en";
  const isSmsEnabled =
    data.permiteSms ??
    (!data.tipoPlan || !data.tipoPlan.toLowerCase().includes("basic"));

  // Apertura del sobre 3D con selección de idioma
  const handleOpenEnvelope = (chosenLang?: "es" | "en") => {
    if (chosenLang) {
      setCurrentLang(chosenLang);
    }
    if (isEnvelopeOpen) return;
    setIsEnvelopeOpen(true);

    // Reproducir música tras el gesto táctil del usuario si está habilitado
    if (data.reproducirMusicaAlAbrir !== false && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }

    // Deslizar carta interna (~280ms, tras el pulso y el crossfade del sobre)
    setTimeout(() => {
      setIsLetterOut(true);
    }, 280);

    // Salida en cortina (~1500ms): el grupo carta+sobre sube y sale de la
    // pantalla; solo la capa de fondo se desvanece en los últimos ~200ms
    // (el fondo acuarela es el mismo de la invitación, que ya está detrás).
    setTimeout(() => {
      setIsEnvelopeExiting(true);
      setTimeout(() => {
        setIsEnvelopeFading(true);
      }, 400);
      setTimeout(() => {
        setIsEnvelopeRemoved(true);
      }, 600);
    }, 1500);
  };

  // Toggle de música
  const toggleMusic = () => {
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

  // Cronómetro regresivo
  useEffect(() => {
    const target = new Date(data.fechaEvento).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        setTimeLeft({
          days: String(d).padStart(2, "0"),
          hours: String(h).padStart(2, "0"),
          minutes: String(m).padStart(2, "0"),
          seconds: String(s).padStart(2, "0"),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [data.fechaEvento]);

  // Envío de confirmación RSVP a la API interna (/api/rsvp)
  // Guarda/actualiza en BD (UPSERT), dispara SMS Twilio y alerta por correo AWS SES al anfitrión
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmittingRsvp(true);
    setRsvpFeedback(null);

    const seatCount = Number(selectedSeats) || 1;
    const contactVal = guestPhone.trim();

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventoId: data.id || `slug-${data.slug}`,
          slug: data.slug,
          nombreInvitado: guestName.trim(),
          telefono: isSmsEnabled ? contactVal || undefined : undefined,
          email: !isSmsEnabled ? contactVal || undefined : undefined,
          asistira: true,
          pases: seatCount,
        }),
      });

      const resJson = await res.json();

      if (!res.ok) {
        setRsvpFeedback({
          msg:
            resJson.error ||
            (isEn
              ? "This invitation has already been confirmed or could not be processed."
              : "Esta invitación ya fue confirmada previamente o no se pudo procesar."),
          isUpdate: false,
          isError: true,
        });
        return;
      }

      // Efecto festivo de confeti
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#A63D57", "#C4667D", "#F3D9DE", "#FFFFFF"],
        });
      } catch {}

      const successMsg =
        resJson.message ||
        (isEn
          ? isSmsEnabled
            ? `Thank you, ${guestName}! Your RSVP for ${seatCount} guest(s) has been successfully confirmed. Details have been sent via SMS.`
            : `Thank you, ${guestName}! Your RSVP for ${seatCount} guest(s) has been successfully confirmed. Details have been sent via email.`
          : isSmsEnabled
            ? `¡Gracias, ${guestName}! Tu confirmación para ${seatCount} ${
                seatCount === 1 ? "pase" : "pases"
              } ha sido registrada exitosamente. Te enviamos los detalles por SMS.`
            : `¡Gracias, ${guestName}! Tu confirmación para ${seatCount} ${
                seatCount === 1 ? "pase" : "pases"
              } ha sido registrada exitosamente. Te enviamos los detalles por correo.`);

      setRsvpSuccessData({
        guestName: guestName.trim(),
        seats: seatCount,
        message: successMsg,
      });

      setRsvpFeedback({
        msg: successMsg,
        isUpdate: Boolean(resJson.isUpdate),
      });
    } catch (err) {
      console.error(err);
      const fallbackMsg = isEn
        ? `Thank you, ${guestName}! Your RSVP for ${seatCount} guest(s) has been successfully confirmed.`
        : `¡Gracias, ${guestName}! Tu confirmación para ${seatCount} ${
            seatCount === 1 ? "pase" : "pases"
          } ha sido registrada exitosamente.`;

      setRsvpSuccessData({
        guestName: guestName.trim(),
        seats: seatCount,
        message: fallbackMsg,
      });
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const defaultAudio =
    data.musicaUrl ||
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3";

  // Desglose de fecha dinámica (adaptado al idioma activo)
  const eventDate = new Date(data.fechaEvento);
  const eventLocale = isEn ? "en-US" : "es-ES";
  const eventMonth = eventDate
    .toLocaleDateString(eventLocale, { month: "long" })
    .toUpperCase();
  const eventWeekday = eventDate
    .toLocaleDateString(eventLocale, { weekday: "long" })
    .toUpperCase();
  const eventDay = eventDate.getDate();
  const eventYear = eventDate.getFullYear();
  const eventTime = eventDate
    .toLocaleTimeString(eventLocale, { hour: "numeric", minute: "2-digit", hour12: true })
    .toUpperCase();

  // Fecha formal formateada automáticamente según el idioma activo (es o en)
  const formalDateDisplay = isEn
    ? `${eventWeekday}, ${eventMonth} ${eventDay}, ${eventYear}`
    : (data.fechaTextoPersonalizada || `${eventWeekday} ${eventDay} DE ${eventMonth}, ${eventYear}`);

  // Cálculo dinámico de fecha límite RSVP bilingüe fija (días antes del evento)
  const diasAntesRsvp =
    typeof data.rsvpDiasAntes === "number" && data.rsvpDiasAntes > 0
      ? data.rsvpDiasAntes
      : 15;
  const deadlineBaseTime = !isNaN(eventDate.getTime()) ? eventDate.getTime() : Date.now();
  const deadlineDate = new Date(deadlineBaseTime - diasAntesRsvp * 24 * 60 * 60 * 1000);
  const deadlineDay = deadlineDate.getDate();
  const rawMonthEs = deadlineDate.toLocaleDateString("es-ES", { month: "long" });
  const rawMonthEn = deadlineDate.toLocaleDateString("en-US", { month: "long" });
  const deadlineMonthEs = rawMonthEs.charAt(0).toUpperCase() + rawMonthEs.slice(1);
  const deadlineMonthEn = rawMonthEn.charAt(0).toUpperCase() + rawMonthEn.slice(1);

  const rsvpDeadlinePhrase = isEn
    ? `Please confirm before ${deadlineMonthEn} ${deadlineDay}`
    : `Favor de confirmar antes del ${deadlineDay} de ${deadlineMonthEs}`;

  // Itinerario dinámico con los iconos ilustrados del set Era Pink
  const getItineraryIcon = (item: any, idx: number) => {
    const iconType = (item?.tipoIcono || "").toLowerCase();
    const title = (item?.titulo || "").toLowerCase();

    if (
      iconType.includes("cocktail") || iconType.includes("welcome") ||
      title.includes("cóctel") || title.includes("coctel") || title.includes("cocktail") ||
      title.includes("welcome") || title.includes("bienvenida")
    ) return ERA_ASSETS.cocktailIcon;
    if (
      iconType.includes("entrance") || iconType.includes("court") ||
      title.includes("entrada") || title.includes("entrance") || title.includes("corte")
    ) return ERA_ASSETS.tiara;
    if (iconType.includes("cotillion") || title.includes("cotill")) return ERA_ASSETS.bowGirl;
    if (
      iconType.includes("dinner") || iconType.includes("wine") ||
      title.includes("cena") || title.includes("dinner")
    ) return ERA_ASSETS.dinnerIcon;
    if (
      iconType.includes("gift") || iconType.includes("candle") ||
      title.includes("vela") || title.includes("regalo") || title.includes("gift") || title.includes("candle")
    ) return ERA_ASSETS.giftsIcon;
    if (
      iconType.includes("dance") || iconType.includes("waltz") ||
      title.includes("baile") || title.includes("dance") || title.includes("vals")
    ) return ERA_ASSETS.dancingCouple;
    if (iconType.includes("rose") || title.includes("rosa") || title.includes("rose")) return ERA_ASSETS.flowers;
    if (
      iconType.includes("party") || iconType.includes("disco") ||
      title.includes("fiesta") || title.includes("party")
    ) return ERA_ASSETS.discoBall;

    const fallbackIcons = [
      ERA_ASSETS.cocktailIcon,
      ERA_ASSETS.tiara,
      ERA_ASSETS.bowGirl,
      ERA_ASSETS.dinnerIcon,
      ERA_ASSETS.giftsIcon,
      ERA_ASSETS.dancingCouple,
      ERA_ASSETS.flowers,
      ERA_ASSETS.discoBall,
    ];
    return fallbackIcons[idx % fallbackIcons.length];
  };

  const defaultEraItinerary = isEn
    ? [
        { hora: "5:30 PM", titulo: "Welcome / Cocktail Hour", tipoIcono: "cocktail" },
        { hora: "6:00 PM", titulo: "Court Entrance", tipoIcono: "entrance" },
        { hora: "6:30 PM", titulo: "Cotillion de Honor", tipoIcono: "cotillion" },
        { hora: "7:00 PM", titulo: "Dinner", tipoIcono: "dinner" },
        { hora: "7:30 PM", titulo: "Candle and Gift Ceremony", tipoIcono: "gift" },
        { hora: "8:00 PM", titulo: "Father and Daughter Dance", tipoIcono: "dance" },
        { hora: "8:30 PM", titulo: "18 Roses", tipoIcono: "roses" },
        { hora: "9:00 - 11:00 PM", titulo: "Party", tipoIcono: "party" },
      ]
    : [
        { hora: "5:30 PM", titulo: "Bienvenida / Hora de Cóctel", tipoIcono: "cocktail" },
        { hora: "6:00 PM", titulo: "Entrada de la Corte", tipoIcono: "entrance" },
        { hora: "6:30 PM", titulo: "Cotillón de Honor", tipoIcono: "cotillion" },
        { hora: "7:00 PM", titulo: "Cena", tipoIcono: "dinner" },
        { hora: "7:30 PM", titulo: "Ceremonia de Velas y Regalos", tipoIcono: "gift" },
        { hora: "8:00 PM", titulo: "Baile de Padre e Hija", tipoIcono: "dance" },
        { hora: "8:30 PM", titulo: "18 Rosas", tipoIcono: "roses" },
        { hora: "9:00 - 11:00 PM", titulo: "Fiesta", tipoIcono: "party" },
      ];

  const rawItinerary =
    (Array.isArray(data.itinerario) && data.itinerario.length > 0)
      ? data.itinerario
      : (Array.isArray(data.itinerarioJson) && data.itinerarioJson.length > 0)
        ? data.itinerarioJson
        : defaultEraItinerary;

  const itineraryList = rawItinerary.map((item: any, idx: number) => ({
    hora: item.hora || item.time || "",
    titulo: item.titulo || item.title || "",
    icon: item.icon ? item.icon : getItineraryIcon(item, idx),
  }));

  // Corte de honor dinámico
  const corte = data.corteHonorJson || null;

  // ===== Quince Era Pink: datos derivados =====
  const familiaAnfitriona = isEn
    ? templateConfig.familiaAnfitrionaEn || templateConfig.familiaAnfitriona
    : templateConfig.familiaAnfitriona;
  const nombrePartes = (data.titulo || "").trim().split(/\s+/).filter(Boolean);
  const monograma =
    nombrePartes.length > 1
      ? `${nombrePartes[0][0]} ${nombrePartes[nombrePartes.length - 1][0]}`.toUpperCase()
      : (nombrePartes[0]?.slice(0, 2) || "XV").toUpperCase();
  const textoDe = (v: any): string => {
    if (!v) return "";
    if (typeof v === "string") return v;
    return v.mensaje || v.texto || v.descripcion || v.info || v.detalle || "";
  };
  const hospedajeTexto = textoDe(data.hospedajeJson);
  const transporteTexto = textoDe(data.transporteJson);
  const hotelLink =
    data.hospedajeJson && typeof data.hospedajeJson === "object"
      ? data.hospedajeJson.link || data.hospedajeJson.url || ""
      : "";
  const plataformasRegalos: string[] = Array.isArray(data.mesaRegalosJson?.plataformas)
    ? data.mesaRegalosJson.plataformas
    : [];
  const swatches: string[] =
    Array.isArray(data.coloresReservados) && data.coloresReservados.length > 0
      ? data.coloresReservados
      : ["#D98CA6", "#F3D9DE", "#B98A94"];
  const ceremoniaHora = templateConfig.ceremoniaHora || "3:00 PM";
  const recepcionHora = templateConfig.recepcionHora || "4:30 PM";
  const handleReturnToEnvelope = () => {
    setIsEnvelopeOpen(false);
    setIsLetterOut(false);
    setIsEnvelopeExiting(false);
    setIsEnvelopeFading(false);
    setIsEnvelopeRemoved(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-screen font-sans-body text-[#3E2A2E] antialiased selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden bg-[#F9E7EA]">
      {/* Audio en bucle */}
      <audio ref={audioRef} loop preload="none" src={defaultAudio} />

      {/* ========================================================= */}
      {/* INTRO: PORTADA SIMPLE (réplica Canva pág. 1)              */}
      {/* ========================================================= */}
      {!skipIntro && !isEnvelopeRemoved && (
        <aside
          id="envelopeOverlay"
          onClick={() => handleOpenEnvelope()}
          className={`fixed inset-0 z-50 select-none ${
            isEnvelopeExiting ? "pointer-events-none" : ""
          }`}
        >
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-[#F7DCE1] transition-opacity duration-200 ${
              isEnvelopeFading ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.flowers} alt="" className="absolute -top-6 -left-8 w-44 opacity-70 pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.flowers} alt="" className="absolute -bottom-6 -right-8 w-44 opacity-70 pointer-events-none -scale-x-100" />
          </div>

          <div
            className="relative z-10 flex h-full flex-col items-center justify-center p-4 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isEnvelopeExiting
                ? "translateY(-100vh)"
                : "translateY(0)",
            }}
          >
            <div
              className={`text-center mb-6 transition-opacity duration-300 ${
                isEnvelopeOpen ? "opacity-0" : "opacity-100"
              }`}
            >
              <h2 className="font-script text-6xl sm:text-7xl text-[#A63D57] drop-shadow-sm font-normal">
                {isEn ? "You're Invited!" : "¡Estás invitado!"}
              </h2>
              {guestRecipient && guestRecipient !== "Familia & Amigos" && (
                <p className="text-sm mt-1 text-[#C4667D] font-serif-roman italic tracking-wider">
                  {guestRecipient}
                </p>
              )}
            </div>

            {/* Sobre rosa con sello */}
            <div
              id="envelopeContainer"
              className={`relative w-[min(92vw,430px)] sm:w-[500px] aspect-[550/394] cursor-pointer ${
                isEnvelopeOpen ? "animate-envelope-pulse" : ""
              }`}
            >
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  isEnvelopeOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ERA_ASSETS.envelope}
                  alt="Sobre"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
                {/* Sello de cera con monograma */}
                <div
                  className={`absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-300 ${
                    isLetterOut ? "scale-125 opacity-0" : "scale-100 opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ERA_ASSETS.seal} alt="Sello" className="w-full h-full object-contain drop-shadow-lg" />
                  <span className="absolute inset-0 flex items-center justify-center font-serif-roman font-bold text-[#7E2140] text-lg sm:text-xl tracking-widest pt-0.5">
                    {monograma.replace(" ", "")}
                  </span>
                </div>
              </div>

              {/* Flores que flotan al abrir */}
              {isEnvelopeOpen && (
                <>
                  <div className="absolute left-[30%] top-[40%] z-50 w-14 sm:w-16 animate-butterfly-fly-left">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ERA_ASSETS.flowers} alt="" className="w-full h-auto object-contain" />
                  </div>
                  <div className="absolute left-[58%] top-[40%] z-50 w-14 sm:w-16 animate-butterfly-fly-right">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ERA_ASSETS.flowers} alt="" className="w-full h-auto object-contain" />
                  </div>
                </>
              )}
            </div>

            {isBilingual ? (
              <div
                className={`mt-8 flex items-center justify-center gap-3 sm:gap-5 z-30 transition-opacity duration-300 ${
                  isEnvelopeOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEnvelope("en");
                  }}
                  className="inline-flex items-center justify-center w-36 sm:w-44 h-12 rounded-full border-2 border-dashed border-[#C4667D] bg-white/70 text-[#A63D57] font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase font-bold shadow transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEnvelope("es");
                  }}
                  className="inline-flex items-center justify-center w-36 sm:w-44 h-12 rounded-full border-2 border-dashed border-[#C4667D] bg-white/70 text-[#A63D57] font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase font-bold shadow transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Español
                </button>
              </div>
            ) : (
              <div
                className={`mt-8 text-center z-30 transition-opacity duration-300 ${
                  isEnvelopeOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                <p className="font-serif-roman text-xs sm:text-sm tracking-[0.4em] uppercase text-[#3E2A2E] font-semibold">
                  {isEn ? "Click to open" : "Toca para abrir"}
                </p>
                <div className="w-16 h-0.5 bg-[#C4667D]/60 mt-2 mx-auto" />
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Selector flotante de idioma (solo eventos bilingües) */}
      {isBilingual && (
        <aside
          aria-label="Selector de idioma"
          className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-md border border-[#C4667D]/60 rounded-full shadow-lg p-1 flex items-center gap-1 text-[11px] font-serif-roman tracking-wider"
        >
          <button
            type="button"
            onClick={() => setCurrentLang("es")}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold ${
              currentLang === "es"
                ? "bg-[#A63D57] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ES
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setCurrentLang("en")}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold ${
              currentLang === "en"
                ? "bg-[#A63D57] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            EN
          </button>
        </aside>
      )}

      <main className="relative z-10">
        {/* ======================================================= */}
        {/* SECCIÓN 1: HERO A FOTO COMPLETA                         */}
        {/* ======================================================= */}
        <section className="relative text-center">
          <div className="relative h-[88vh] min-h-[540px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.fotoPortadaUrl} alt={data.titulo} className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F9E7EA]/55 via-transparent to-[#F9E7EA]" />
            <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10 px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ERA_ASSETS.tiara} alt="" className="w-36 sm:w-44 h-auto mb-1 drop-shadow-md" />
              {familiaAnfitriona && (
                <p className="font-serif-roman text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#3E2A2E] font-bold">
                  {familiaAnfitriona}{" "}
                  {isEn ? "invite you to celebrate the" : "te invita a celebrar la"}
                </p>
              )}
              <h1 className="font-serif-roman text-5xl sm:text-7xl tracking-[0.06em] uppercase text-[#3E2A2E] font-bold leading-none mt-1">
                {isEn ? "Quinceañera" : "Quinceañera"}
              </h1>
              <p className="font-serif-roman text-[11px] sm:text-xs tracking-[0.4em] uppercase text-[#3E2A2E] mt-2">
                {isEn ? "of their daughter" : "de su hija"}
              </p>
              <p className="font-script text-6xl sm:text-7xl text-[#A63D57] leading-tight mt-1">{data.titulo}</p>

              <div className="mt-4">
                <p className="font-serif-roman text-xs tracking-[0.5em] uppercase text-[#3E2A2E] font-bold">{eventMonth}</p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1">
                  <span className="font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase text-[#3E2A2E] font-semibold">{eventWeekday}</span>
                  <span className="w-8 sm:w-12 h-px bg-[#A63D57]/70" />
                  <span className="font-serif-roman text-6xl sm:text-7xl font-bold text-[#3E2A2E] leading-none">{eventDay}</span>
                  <span className="w-8 sm:w-12 h-px bg-[#A63D57]/70" />
                  <span className="font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase text-[#3E2A2E] font-semibold">
                    {isEn ? "At" : "A las"} {eventTime}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleMusic}
                className="mt-6 inline-flex items-center gap-2.5 rounded-full border-2 border-dashed border-[#C4667D] bg-white/75 backdrop-blur px-7 py-3 font-serif-roman text-xs tracking-[0.3em] uppercase font-bold text-[#A63D57] shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                {isEn ? "Play me" : "Escuchar"}
              </button>
              <p className="text-[10px] font-serif-roman tracking-[0.2em] uppercase text-[#3E2A2E]/70 font-semibold mt-2">
                {data.musicaTitulo || (isEn ? "My Song" : "Mi Canción")}
              </p>
            </div>
          </div>

          {/* Frase con foto */}
          <div className="px-6 py-10">
            {data.fotoInfanciaUrl && (
              <div className="max-w-xs mx-auto rounded-t-[10rem] rounded-b-3xl overflow-hidden border-4 border-white shadow-xl rotate-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.fotoInfanciaUrl} alt="" className="w-full h-auto object-cover" />
              </div>
            )}
            <p className="font-script text-4xl sm:text-5xl text-[#A63D57] max-w-md mx-auto leading-snug mt-7">
              {data.frasePersonalizada ||
                (isEn
                  ? "I'm excited to share this special day with you."
                  : "Me emociona compartir este día tan especial contigo.")}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.divider} alt="" className="w-56 h-auto mx-auto mt-7 opacity-70" />
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 2: THE COUNTDOWN                                */}
        {/* ======================================================= */}
        <section className="relative px-6 py-12 text-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ERA_ASSETS.flowers} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none" />
          <div className="relative">
            <div className="flex items-end justify-center gap-2.5">
              <span className="font-script text-4xl sm:text-5xl text-[#C4667D] leading-none">The</span>
              <h3 className="font-serif-roman text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#3E2A2E] font-bold leading-none">
                Countdown
              </h3>
            </div>
            <div className="flex items-stretch justify-center gap-2.5 sm:gap-3 mt-7">
              {[
                { v: timeLeft.days, l: isEn ? "Days" : "Días" },
                { v: timeLeft.hours, l: isEn ? "Hours" : "Horas" },
                { v: timeLeft.minutes, l: isEn ? "Minutes" : "Minutos" },
                { v: timeLeft.seconds, l: isEn ? "Seconds" : "Segundos" },
              ].map((u) => (
                <div key={u.l} className="w-16 sm:w-20 bg-white/90 backdrop-blur rounded-2xl border-2 border-dashed border-[#C4667D]/70 shadow-md py-3">
                  <p className="font-serif-roman text-2xl sm:text-3xl font-bold text-[#A63D57] leading-none">{u.v}</p>
                  <p className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#3E2A2E]/60 font-bold mt-1.5">{u.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 3: THE VENUE                                    */}
        {/* ======================================================= */}
        <section className="px-6 py-10">
          <div className="flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.letterV} alt="V" className="w-12 sm:w-14 h-auto" />
            <div className="flex items-end gap-2.5">
              <span className="font-script text-4xl sm:text-5xl text-[#C4667D] leading-none">The</span>
              <h3 className="font-serif-roman text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#3E2A2E] font-bold leading-none">Venue</h3>
            </div>
          </div>

          <div className="max-w-md mx-auto mt-8 space-y-6">
            {data.ceremoniaNombre && (
              <div className="bg-[#F6D3DA] rounded-[2rem] shadow-lg p-7 text-center border border-white/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ERA_ASSETS.photoChurch} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
                <p className="font-serif-roman text-3xl font-bold text-[#3E2A2E] mt-4">{ceremoniaHora}</p>
                <p className="font-serif-roman text-sm sm:text-base tracking-[0.15em] uppercase font-bold text-[#3E2A2E] mt-1">{data.ceremoniaNombre}</p>
                {data.ceremoniaDireccion && (
                  <p className="font-serif-roman text-[11px] tracking-[0.15em] uppercase text-[#3E2A2E]/70 mt-1">{data.ceremoniaDireccion}</p>
                )}
                <a
                  href={getMapDirectionsUrl(data.ceremoniaMapUrl || undefined, data.ceremoniaNombre + ", " + (data.ceremoniaDireccion || ""))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-[#C4667D] bg-white/70 px-6 py-2.5 font-serif-roman text-[11px] tracking-[0.25em] uppercase font-bold text-[#A63D57] hover:bg-[#C4667D] hover:text-white transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" /> Google Maps
                </a>
              </div>
            )}

            <div className="bg-[#F6D3DA] rounded-[2rem] shadow-lg p-7 text-center border border-white/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ERA_ASSETS.photoVenue} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
              <p className="font-serif-roman text-3xl font-bold text-[#3E2A2E] mt-4">{recepcionHora}</p>
              <p className="font-serif-roman text-sm sm:text-base tracking-[0.15em] uppercase font-bold text-[#3E2A2E] mt-1">{data.recepcionNombre}</p>
              <p className="font-serif-roman text-[11px] tracking-[0.15em] uppercase text-[#3E2A2E]/70 mt-1">{data.recepcionDireccion}</p>
              <a
                href={getMapDirectionsUrl(data.recepcionMapUrl || undefined, data.recepcionNombre + ", " + data.recepcionDireccion)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-[#C4667D] bg-white/70 px-6 py-2.5 font-serif-roman text-[11px] tracking-[0.25em] uppercase font-bold text-[#A63D57] hover:bg-[#C4667D] hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" /> Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 4: THE PROGRAM                                  */}
        {/* ======================================================= */}
        <section className="px-6 py-10">
          <div className="flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.letterP} alt="P" className="w-12 sm:w-14 h-auto" />
            <div className="flex items-end gap-2.5">
              <span className="font-script text-4xl sm:text-5xl text-[#C4667D] leading-none">The</span>
              <h3 className="font-serif-roman text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#3E2A2E] font-bold leading-none">Program</h3>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ERA_ASSETS.divider} alt="" className="w-56 h-auto mx-auto mt-5 opacity-70" />

          <div className="max-w-sm mx-auto mt-8 relative">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-[#C4667D]/40" />
            <div className="space-y-6">
              {itineraryList.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 relative">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white border-2 border-dashed border-[#C4667D]/70 shadow flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.icon} alt="" className="w-10 h-10 object-contain" />
                  </div>
                  <div>
                    <p className="font-serif-roman text-xs tracking-[0.2em] text-[#A63D57] font-bold uppercase">{item.hora}</p>
                    <p className="font-serif-roman text-sm sm:text-base text-[#3E2A2E] font-semibold">{item.titulo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 5: THE DETAILS                                  */}
        {/* ======================================================= */}
        <section className="px-6 py-10 text-center">
          {data.fotoCierreUrl && (
            <div className="max-w-xs mx-auto mb-8 rounded-t-[10rem] rounded-b-3xl overflow-hidden border-4 border-white shadow-xl -rotate-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.fotoCierreUrl} alt="" className="w-full h-auto object-cover" />
            </div>
          )}
          <div className="flex items-end justify-center gap-2.5">
            <span className="font-script text-4xl sm:text-5xl text-[#C4667D] leading-none">The</span>
            <h3 className="font-serif-roman text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#3E2A2E] font-bold leading-none">Details</h3>
          </div>

          <div className="max-w-md mx-auto mt-8 space-y-9">
            <div>
              <h4 className="font-serif-roman text-sm tracking-[0.35em] uppercase text-[#C4667D] font-bold">
                {isEn ? "Dress Code" : "Código de Vestimenta"}
              </h4>
              <p className="font-serif-roman text-xs sm:text-sm tracking-[0.2em] uppercase text-[#3E2A2E] mt-2 leading-relaxed">
                {(isEn ? data.dressCodeNotaEn : data.dressCodeNota) ||
                  (isEn ? "Soft pastels & semi-formal elegant" : "Pasteles suaves y semiformal elegante")}
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                {swatches.map((c: string, i: number) => (
                  <span key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {transporteTexto && (
              <div>
                <h4 className="font-serif-roman text-sm tracking-[0.35em] uppercase text-[#C4667D] font-bold">
                  {isEn ? "Transportation" : "Transporte"}
                </h4>
                <p className="font-serif-roman text-xs sm:text-sm tracking-[0.2em] uppercase text-[#3E2A2E] mt-2 leading-relaxed">{transporteTexto}</p>
              </div>
            )}

            {data.mostrarMesaRegalos !== false && (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ERA_ASSETS.gifts} alt="" className="w-36 h-auto mx-auto mb-3" />
                <p className="font-script text-3xl sm:text-4xl text-[#A63D57] leading-snug max-w-sm mx-auto">
                  {(isEn ? data.regalosMensajeEn : data.regalosMensaje) ||
                    (isEn
                      ? "We're simply grateful to celebrate with you. Gifts aren't required, but you may visit our Amazon Registry if you wish."
                      : "Estamos muy agradecidos de celebrar contigo. Los regalos no son necesarios, pero puedes visitar nuestro registro de Amazon si lo deseas.")}
                </p>
                <a
                  href={data.wishlistUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex rounded-full border-2 border-dashed border-[#C4667D] bg-white/70 px-8 py-3 font-serif-roman text-xs tracking-[0.3em] uppercase font-bold text-[#A63D57] hover:bg-[#C4667D] hover:text-white transition-colors"
                >
                  {isEn ? "Gift Registry" : "Mesa de Regalos"}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 6: CORTE DE HONOR (si el evento la define)      */}
        {/* ======================================================= */}
        {corte && (
          <section className="px-6 py-10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.bowGirl} alt="" className="w-32 sm:w-40 h-auto mx-auto mb-2" />
            <div className="flex items-end justify-center gap-2.5">
              <span className="font-script text-4xl sm:text-5xl text-[#C4667D] leading-none">The</span>
              <h3 className="font-serif-roman text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#3E2A2E] font-bold leading-none">
                {isEn ? "Court of Honor" : "Corte de Honor"}
              </h3>
            </div>
            <div className="max-w-md mx-auto mt-7 space-y-6 text-sm">
              {corte.parents && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#A63D57] font-bold mb-1.5">{isEn ? "Parents" : "Padres"}</h5>
                  <p className="font-serif-roman text-[#3E2A2E]">{corte.parents}</p>
                </div>
              )}
              {((Array.isArray(corte.damas) && corte.damas.length > 0) || (typeof corte.damas === "string" && corte.damas.trim())) && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#A63D57] font-bold mb-1.5">Damas</h5>
                  <p className="font-serif-roman text-[#3E2A2E] leading-relaxed">{Array.isArray(corte.damas) ? corte.damas.join(" · ") : corte.damas}</p>
                </div>
              )}
              {((Array.isArray(corte.chambelanes) && corte.chambelanes.length > 0) || (typeof corte.chambelanes === "string" && corte.chambelanes.trim())) && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#A63D57] font-bold mb-1.5">Chambelanes</h5>
                  <p className="font-serif-roman text-[#3E2A2E] leading-relaxed">{Array.isArray(corte.chambelanes) ? corte.chambelanes.join(" · ") : corte.chambelanes}</p>
                </div>
              )}
              {((Array.isArray(corte.padrinos) && corte.padrinos.length > 0) || (typeof corte.padrinos === "string" && corte.padrinos.trim())) && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#A63D57] font-bold mb-1.5">Padrinos</h5>
                  <div className="space-y-1">
                    {(Array.isArray(corte.padrinos) ? corte.padrinos : [corte.padrinos]).map((p: string, i: number) => (
                      <p key={i} className="font-serif-roman text-[#3E2A2E]">{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ======================================================= */}
        {/* SECCIÓN 7: THE RSVP                                     */}
        {/* ======================================================= */}
        <section className="px-6 pt-10 pb-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ERA_ASSETS.ladyIllustration} alt="" className="w-24 sm:w-28 h-auto mx-auto mb-2" />
          <div className="flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.letterR} alt="R" className="w-12 sm:w-14 h-auto" />
            <div className="flex items-end gap-2.5">
              <span className="font-script text-4xl sm:text-5xl text-[#C4667D] leading-none">The</span>
              <h3 className="font-serif-roman text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#3E2A2E] font-bold leading-none">RSVP</h3>
            </div>
          </div>
          {data.fechaLimiteRsvp && (
            <p className="font-serif-roman text-xs tracking-[0.4em] uppercase text-[#3E2A2E] font-bold mt-3">
              {isEn ? "By" : "Antes del"} {data.fechaLimiteRsvp}
            </p>
          )}
          <p className="font-serif-roman italic text-sm text-[#3E2A2E]/80 mt-3">
            {isEn
              ? "Ready to celebrate with us? Tap below to confirm your attendance."
              : "¿Lista para celebrar con nosotros? Toca abajo para confirmar tu asistencia."}
          </p>
        </section>

{/* ======================================================= */}
        {/* SECCIÓN 10: CONFIRMACIÓN DE ASISTENCIA (RSVP)           */}
        {/* ======================================================= */}
        <section id="rsvp" className="px-4 py-6 z-20">
          <div className="relative w-full max-w-[390px] mx-auto -mb-9 z-20 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ERA_ASSETS.seal}
              alt="Sello RSVP"
              className="w-24 h-24 object-contain drop-shadow-xl"
            />
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 pt-10 rounded-3xl border border-[#D8B772]/60 shadow-xl text-center relative z-10">
            <h3 className="font-script text-4xl text-[#A63D57] my-1">
              {isEn ? "RSVP" : "Confirmar Asistencia"}
            </h3>
            <p className="text-[11px] text-slate-500 mb-5 uppercase tracking-wider font-serif-roman font-semibold">
              {(data.fechaLimiteRsvp && isEn) ? `Please confirm by ${data.fechaLimiteRsvp}` : rsvpDeadlinePhrase}
            </p>

            {/* Alerta de confirmación previa / actualización de pases */}
            {rsvpFeedback && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-serif-roman border text-center transition ${
                  rsvpFeedback.isError
                    ? "bg-rose-50 text-rose-800 border-rose-300 shadow-sm"
                    : rsvpFeedback.isUpdate
                    ? "bg-amber-50 text-amber-900 border-amber-200"
                    : "bg-emerald-50 text-emerald-900 border-emerald-200"
                }`}
              >
                <p className="font-semibold">{rsvpFeedback.msg}</p>
              </div>
            )}

            {rsvpSuccessData ? (
              <div className="py-4 px-2 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <span className="font-serif-roman text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
                    {isEn ? "RSVP Confirmed" : "Confirmación Registrada"}
                  </span>
                  <h4 className="font-script text-3xl text-[#A63D57]">
                    {isEn ? "See You There!" : "¡Te Esperamos!"}
                  </h4>
                </div>
                <div className="bg-[#FBEFF1] border border-rose-200 rounded-2xl p-4 text-xs font-serif-roman text-slate-700 leading-relaxed max-w-sm mx-auto shadow-xs">
                  <p className="font-semibold text-slate-900 mb-1">
                    «¡Gracias, {rsvpSuccessData.guestName}!»
                  </p>
                  <p>
                    {isEn
                      ? `Your confirmation for ${rsvpSuccessData.seats} guest(s) has been successfully recorded. We sent you the details via SMS.`
                      : `Tu confirmación para ${rsvpSuccessData.seats} ${
                          rsvpSuccessData.seats === 1 ? "pase" : "pases"
                        } ha sido registrada exitosamente. Te enviamos los detalles por SMS.`}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setRsvpSuccessData(null)}
                    className="text-xs font-serif-roman text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    {isEn ? "Modify passes or guest information" : "Modificar pases o actualizar datos"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-serif-roman">
                    {isEn ? "Full Name *" : "Nombre Completo *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#FBEFF1] border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#A63D57]"
                    placeholder={isEn ? "e.g. The Morales Family" : "Ej. Familia Morales"}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-serif-roman">
                    {isSmsEnabled
                      ? isEn
                        ? "MOBILE NUMBER TO RECEIVE YOUR PASSES VIA SMS:"
                        : "MÓVIL PARA RECIBIR TUS PASES POR SMS:"
                      : isEn
                      ? "EMAIL TO RECEIVE YOUR PASSES:"
                      : "CORREO ELECTRÓNICO PARA RECIBIR TUS PASES:"}
                  </label>
                  <input
                    type={isSmsEnabled ? "tel" : "email"}
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-[#FBEFF1] border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#A63D57]"
                    placeholder={
                      isSmsEnabled
                        ? "(818) 555-0123"
                        : isEn
                        ? "name@example.com"
                        : "nombre@ejemplo.com"
                    }
                  />
                  <p className="text-xs text-neutral-500 mt-1 text-left">
                    {isSmsEnabled
                      ? isEn
                        ? "We'll send your access details and location via text message."
                        : "Te enviaremos los detalles de tu acceso y ubicación por mensaje de texto."
                      : isEn
                      ? "We'll send your access details and location via email."
                      : "Te enviaremos los detalles de tu acceso y ubicación por email."}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-serif-roman">
                    {isEn ? "Confirmed Guests" : "Pases Confirmados"}
                  </label>
                  {/* CONVENCIÓN: maxPasesPorInvitado === 0 = SIN LÍMITE → campo
                      numérico con −/+ (tope de sanidad 200). Con límite, radios 1..N. */}
                  {data.maxPasesPorInvitado === 0 ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        aria-label={isEn ? "One less guest" : "Un invitado menos"}
                        onClick={() => setSelectedSeats(String(Math.max(1, (Number(selectedSeats) || 1) - 1)))}
                        className="w-9 h-9 shrink-0 rounded-lg border border-slate-300 bg-white text-base font-bold text-slate-600 flex items-center justify-center"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={200}
                        value={selectedSeats}
                        onChange={(e) => setSelectedSeats(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-20 px-2 py-2 text-xs text-center rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label={isEn ? "One more guest" : "Un invitado más"}
                        onClick={() => setSelectedSeats(String(Math.min(200, (Number(selectedSeats) || 1) + 1)))}
                        className="w-9 h-9 shrink-0 rounded-lg border border-slate-300 bg-white text-base font-bold text-slate-600 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-600">
                      {Array.from(
                        { length: Math.max(1, data.maxPasesPorInvitado ?? 4) },
                        (_, i) => String(i + 1)
                      ).map((seat) => (
                        <label key={seat} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="seats"
                            value={seat}
                            checked={selectedSeats === seat}
                            onChange={() => setSelectedSeats(seat)}
                            className="accent-[#A63D57]"
                          />
                          {seat}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="w-full bg-[#A63D57] hover:bg-[#84304A] text-white py-3.5 px-4 rounded-xl font-serif-roman text-xs uppercase tracking-widest transition shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmittingRsvp ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{isEn ? "CONFIRMING..." : "CONFIRMANDO ASISTENCIA..."}</span>
                    </>
                  ) : (
                    <span>{isEn ? "CONFIRM RSVP" : "CONFIRMAR ASISTENCIA"}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 8: SAVE THE DATE + CIERRE                       */}
        {/* ======================================================= */}
        <section className="px-6 py-10 text-center">
          <div className="flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.letterS} alt="S" className="w-12 sm:w-14 h-auto" />
            <div className="flex items-end gap-2">
              <span className="font-script text-4xl sm:text-5xl text-[#C4667D] leading-none">Save</span>
              <span className="font-serif-roman text-lg sm:text-xl tracking-[0.3em] uppercase text-[#3E2A2E] font-bold leading-none pb-0.5">the</span>
              <span className="font-script text-4xl sm:text-5xl text-[#C4667D] leading-none">Date</span>
            </div>
          </div>

          {data.fotoActualUrl && (
            <div className="max-w-xs mx-auto mt-7 rounded-t-[10rem] rounded-b-3xl overflow-hidden border-4 border-white shadow-xl rotate-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.fotoActualUrl} alt="" className="w-full h-auto object-cover" />
            </div>
          )}

          <p className="max-w-md mx-auto text-xs sm:text-sm text-[#3E2A2E]/85 font-serif-roman leading-relaxed mt-7">
            {isEn
              ? "Add our special day to your Google Calendar so you won't miss a moment of the celebration."
              : "Agrega nuestro día especial a tu Google Calendar para que no te pierdas ni un momento de la celebración."}
          </p>
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              (isEn ? "Sweet 15 " : "Mis XV Años ") + data.titulo
            )}&dates=${eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(
              eventDate.getTime() + 6 * 3600 * 1000
            )
              .toISOString()
              .replace(/-|:|\.\d\d\d/g, "")}&location=${encodeURIComponent(
              data.recepcionNombre + ", " + data.recepcionDireccion
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[#C4667D] bg-white/70 px-7 py-3 font-serif-roman text-[11px] tracking-[0.25em] uppercase font-bold text-[#A63D57] hover:bg-[#C4667D] hover:text-white transition-colors"
          >
            <CalendarPlus className="w-4 h-4" /> {isEn ? "Add to Calendar" : "Añadir a Calendario"}
          </a>

          <div className="mt-12 pb-4">
            <button
              type="button"
              onClick={handleReturnToEnvelope}
              className="font-serif-roman text-[11px] tracking-[0.3em] uppercase text-[#A63D57] font-bold hover:text-[#C4667D] transition-colors cursor-pointer"
            >
              {isEn ? "Return to Envelope" : "Volver al Sobre"}
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ERA_ASSETS.divider} alt="" className="w-56 h-auto mx-auto mt-6 opacity-70" />
            <p className="font-script text-4xl text-[#A63D57] mt-4">{data.titulo}</p>
            <p className="text-[10px] font-serif-roman tracking-[0.3em] uppercase text-[#3E2A2E]/50 mt-1">{formalDateDisplay}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
