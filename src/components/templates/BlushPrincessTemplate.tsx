"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, CheckCircle2, Sparkles, MessageCircle, Music, Pause, CalendarPlus, Phone, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { InvitationData } from "../invitation/InvitationMobileView";
import { getMapEmbedUrl, getMapDirectionsUrl } from "@/lib/maps";
import { BLUSH_ASSETS } from "@/lib/templates/blushPrincessAssets";
import { parseTemplateConfig, BlushPrincessConfig } from "@/types/templateConfigs";

export default function BlushPrincessTemplate({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const templateConfig = parseTemplateConfig<BlushPrincessConfig>(data.configPlantilla);
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
          colors: ["#9D2C4A", "#B08D3C", "#EFC3D0", "#FFFFFF"],
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

  // Itinerario dinámico con soporte de iconos ilustrados oficiales de Canva (93aa7fe30583ab72bdf167a2bce291e3)
  const getItineraryIcon = (item: any, idx: number) => {
    const iconType = (item?.tipoIcono || "").toLowerCase();
    const title = (item?.titulo || "").toLowerCase();

    if (
      iconType.includes("car") ||
      iconType.includes("arrival") ||
      iconType.includes("welcome") ||
      title.includes("llegada") ||
      title.includes("recep") ||
      title.includes("welcome")
    ) {
      return BLUSH_ASSETS.butterflyA;
    }
    if (
      iconType.includes("church") ||
      iconType.includes("entrance") ||
      title.includes("misa") ||
      title.includes("ceremonia") ||
      title.includes("entrada") ||
      title.includes("entrance")
    ) {
      return BLUSH_ASSETS.cross;
    }
    if (
      iconType.includes("wine") ||
      iconType.includes("dinner") ||
      iconType.includes("food") ||
      title.includes("cena") ||
      title.includes("brindis") ||
      title.includes("dinner")
    ) {
      return BLUSH_ASSETS.chandelier;
    }
    if (
      iconType.includes("crown") ||
      iconType.includes("waltz") ||
      title.includes("vals") ||
      title.includes("waltz")
    ) {
      return BLUSH_ASSETS.crown;
    }
    if (
      iconType.includes("music") ||
      iconType.includes("dance") ||
      iconType.includes("disco") ||
      title.includes("fiesta") ||
      title.includes("baile") ||
      title.includes("pista") ||
      title.includes("open dance")
    ) {
      return BLUSH_ASSETS.butterflyB;
    }
    if (
      iconType.includes("cake") ||
      title.includes("pastel") ||
      title.includes("torta") ||
      title.includes("cake")
    ) {
      return BLUSH_ASSETS.seal;
    }

    const fallbackIcons = [
      BLUSH_ASSETS.butterflyA,
      BLUSH_ASSETS.cross,
      BLUSH_ASSETS.chandelier,
      BLUSH_ASSETS.crown,
      BLUSH_ASSETS.butterflyB,
      BLUSH_ASSETS.seal,
    ];
    return fallbackIcons[idx % fallbackIcons.length];
  };

  const defaultBlushItinerary = isEn
    ? [
        { hora: "2:00 PM", titulo: "Religious Ceremony", tipoIcono: "church" },
        { hora: "5:00 PM", titulo: "Cocktail Hour", tipoIcono: "dinner" },
        { hora: "6:00 PM", titulo: "Dinner Reception", tipoIcono: "dinner" },
        { hora: "7:00 PM", titulo: "Grand Entrance", tipoIcono: "crown" },
        { hora: "7:30 PM", titulo: "First Dance & Celebration", tipoIcono: "disco" },
      ]
    : [
        { hora: "2:00 PM", titulo: "Ceremonia Religiosa", tipoIcono: "church" },
        { hora: "5:00 PM", titulo: "Cóctel", tipoIcono: "dinner" },
        { hora: "6:00 PM", titulo: "Recepción y Cena", tipoIcono: "dinner" },
        { hora: "7:00 PM", titulo: "Gran Entrada", tipoIcono: "crown" },
        { hora: "7:30 PM", titulo: "Primer Baile y Celebración", tipoIcono: "disco" },
      ];

  const rawItinerary =
    (Array.isArray(data.itinerario) && data.itinerario.length > 0)
      ? data.itinerario
      : (Array.isArray(data.itinerarioJson) && data.itinerarioJson.length > 0)
        ? data.itinerarioJson
        : defaultBlushItinerary;

  const itineraryList = rawItinerary.map((item: any, idx: number) => ({
    hora: item.hora || item.time || "",
    titulo: item.titulo || item.title || "",
    icon: item.icon ? item.icon : getItineraryIcon(item, idx),
  }));

  // Corte de honor dinámico
  const corte = data.corteHonorJson || null;

  // ===== Blush Princess: datos derivados =====
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
      : ["#EFC3D0", "#E7D3B3", "#B7A08C", "#B08D3C"];
  const handleReturnToEnvelope = () => {
    setIsEnvelopeOpen(false);
    setIsLetterOut(false);
    setIsEnvelopeExiting(false);
    setIsEnvelopeFading(false);
    setIsEnvelopeRemoved(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-screen font-sans-body text-[#4A3436] antialiased selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden bg-[#FDF8F4]">
      {/* Fondo general: seda blush */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BLUSH_ASSETS.silkA}
        alt=""
        className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none opacity-60"
      />

      {/* Audio en bucle */}
      <audio ref={audioRef} loop preload="none" src={defaultAudio} />

      {/* ========================================================= */}
      {/* INTRO: PORTADA DE IDIOMA + SOBRE (réplica Canva pág. 1)  */}
      {/* ========================================================= */}
      {!skipIntro && !isEnvelopeRemoved && (
        <aside
          id="envelopeOverlay"
          onClick={() => handleOpenEnvelope()}
          className={`fixed inset-0 z-50 select-none ${
            isEnvelopeExiting ? "pointer-events-none" : ""
          }`}
        >
          {/* Fondo floral acuarela (el mismo motivo de la invitación) */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-[#FBF1EA] bg-[url('/assets/template-blush/fondo-floral-ancho.webp')] bg-cover bg-center transition-opacity duration-200 ${
              isEnvelopeFading ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Grupo de la intro: sale en cortina al abrir */}
          <div
            className="relative z-10 flex h-full flex-col items-center justify-center p-4 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isEnvelopeExiting
                ? "translateY(-100vh)"
                : "translateY(0)",
            }}
          >
            {/* Título superior */}
            <div
              className={`text-center mb-5 sm:mb-7 transition-opacity duration-300 ${
                isEnvelopeOpen ? "opacity-0" : "opacity-100"
              }`}
            >
              <h2 className="font-script text-6xl sm:text-7xl md:text-8xl text-[#B08D3C] drop-shadow-sm font-normal">
                Mis Quince
              </h2>
              {guestRecipient && guestRecipient !== "Familia & Amigos" && (
                <p className="text-sm mt-1 text-[#9D2C4A] font-serif-roman italic tracking-wider">
                  {guestRecipient}
                </p>
              )}
            </div>

            {/* Escenario del sobre */}
            <div
              id="envelopeContainer"
              className={`relative w-[min(94vw,430px)] sm:w-[500px] aspect-[799/654] cursor-pointer ${
                isEnvelopeOpen ? "animate-envelope-pulse" : ""
              }`}
            >
              {/* Sobre ABIERTO (retrato, con su carta): entra al abrir */}
              <div
                className={`absolute left-1/2 top-1/2 z-10 w-[min(78vw,320px)] sm:w-[350px] aspect-[1404/1600] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isEnvelopeOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BLUSH_ASSETS.envelopeOpen}
                  alt="Sobre abierto"
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                />
                {/* Texto impreso sobre la carta del arte (zona medida) */}
                <div
                  className={`absolute left-[21%] right-[21%] top-[26%] text-center transition-opacity duration-500 ${
                    isLetterOut ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="font-serif-roman text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#B08D3C] font-semibold">
                    My Quinceañera
                  </p>
                  <h3 className="font-script text-3xl sm:text-4xl text-[#9D2C4A] leading-tight my-0.5">
                    {data.titulo}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-[#4A3436]/70 font-serif-roman tracking-wider uppercase">
                    {formalDateDisplay}
                  </p>
                </div>
              </div>

              {/* Sobre CERRADO: encima mientras está cerrado */}
              <div
                className={`absolute inset-0 z-40 pointer-events-none drop-shadow-xl transition-opacity duration-200 ${
                  isEnvelopeOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BLUSH_ASSETS.envelopeClosed}
                  alt="Sobre Cerrado"
                  className="w-full h-full object-contain"
                />
                {/* Tiara dorada descansando sobre el sobre (como en Canva) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BLUSH_ASSETS.crown}
                  alt=""
                  className="absolute -top-10 sm:-top-12 right-4 sm:right-8 w-24 sm:w-32 h-auto object-contain rotate-[10deg] drop-shadow-md"
                />
                {/* Mariposa rosa perchada */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BLUSH_ASSETS.butterflyB}
                  alt=""
                  className="absolute -bottom-5 -left-3 sm:-left-5 w-16 sm:w-20 h-auto object-contain rotate-[18deg] drop-shadow-md animate-flutter"
                />
              </div>

              {/* Mariposas que salen volando al abrir */}
              {isEnvelopeOpen && (
                <>
                  <div className="absolute left-[34%] top-[46%] z-50 w-9 sm:w-12 animate-butterfly-fly-left">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={BLUSH_ASSETS.butterflyA} alt="" className="w-full h-auto object-contain animate-flutter" />
                  </div>
                  <div className="absolute left-[48%] top-[38%] z-50 w-8 sm:w-10 animate-butterfly-fly-up">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={BLUSH_ASSETS.butterflyB} alt="" className="w-full h-auto object-contain animate-flutter" />
                  </div>
                  <div className="absolute left-[60%] top-[46%] z-50 w-9 sm:w-12 animate-butterfly-fly-right">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={BLUSH_ASSETS.butterflyA} alt="" className="w-full h-auto object-contain animate-flutter" />
                  </div>
                </>
              )}
            </div>

            {/* Selector de idioma / pista de toque */}
            {isBilingual ? (
              <div
                className={`mt-7 sm:mt-9 flex flex-col items-center gap-3 z-30 transition-opacity duration-300 ${
                  isEnvelopeOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <p className="font-serif-roman text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#4A3436] font-semibold">
                  Choose language / Elige tu idioma
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEnvelope("en");
                    }}
                    className="inline-flex items-center justify-center w-36 sm:w-44 h-12 sm:h-14 rounded-full bg-gradient-to-b from-[#DCC084] via-[#B08D3C] to-[#96762E] text-white font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase font-bold shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEnvelope("es");
                    }}
                    className="inline-flex items-center justify-center w-36 sm:w-44 h-12 sm:h-14 rounded-full bg-gradient-to-b from-[#DCC084] via-[#B08D3C] to-[#96762E] text-white font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase font-bold shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Español
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenEnvelope(isEn ? "en" : "es");
                }}
                className={`mt-7 sm:mt-9 flex flex-col items-center justify-center z-30 cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isEnvelopeOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <p className="font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase text-[#9D2C4A] font-semibold drop-shadow-sm flex items-center gap-2">
                  <span className="inline-block animate-bounce text-sm">✨</span>
                  {isEn ? "Tap the envelope to open" : "Toca el sobre para abrir"}
                  <span className="inline-block animate-bounce text-sm">✨</span>
                </p>
                <div className="w-16 h-0.5 bg-[#B08D3C]/60 mt-1.5 transition-all duration-300 group-hover:w-28 group-hover:bg-[#B08D3C]" />
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Selector flotante de idioma (solo eventos bilingües) */}
      {isBilingual && (
        <aside
          aria-label="Selector de idioma"
          className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-md border border-[#B08D3C]/60 rounded-full shadow-lg p-1 flex items-center gap-1 text-[11px] font-serif-roman tracking-wider"
        >
          <button
            type="button"
            onClick={() => setCurrentLang("es")}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold ${
              currentLang === "es"
                ? "bg-[#9D2C4A] text-white shadow-sm"
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
                ? "bg-[#9D2C4A] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            EN
          </button>
        </aside>
      )}

      <main className="relative z-10">
        {/* ======================================================= */}
        {/* SECCIÓN 1: HERO — música, monograma, polaroid, texto    */}
        {/* ======================================================= */}
        <section className="relative px-6 pt-14 pb-8 text-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BLUSH_ASSETS.bouquetB} alt="" className="absolute -top-4 -left-8 w-36 sm:w-44 opacity-80 pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BLUSH_ASSETS.bouquetC} alt="" className="absolute -top-4 -right-8 w-36 sm:w-44 opacity-80 pointer-events-none -scale-x-100" />

          {/* Música: texto circular girando (réplica Canva) */}
          <div className="relative w-32 h-32 mx-auto mb-2">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite]">
              <defs>
                <path id="blushSongCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-[#9D2C4A]" style={{ fontSize: "8.2px", letterSpacing: "2.6px", fontFamily: "serif" }}>
                <textPath href="#blushSongCircle">
                  {isEn ? "TAP TO PLAY MY SONG • TAP TO PLAY MY SONG • " : "TOCA PARA ESCUCHAR MI CANCIÓN • "}
                </textPath>
              </text>
            </svg>
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={isEn ? "Play my song" : "Escuchar mi canción"}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gradient-to-b from-[#DCC084] to-[#96762E] text-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Music className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-[10px] font-serif-roman tracking-[0.2em] uppercase text-[#B08D3C] font-semibold mb-8">
            {data.musicaTitulo || (isEn ? "My Song" : "Mi Canción")}
          </p>

          {/* Marco con monograma y corona */}
          <div className="relative w-56 sm:w-64 mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLUSH_ASSETS.crownFrame} alt="" className="w-full h-auto drop-shadow-md" />
            <div className="absolute inset-0 flex items-center justify-center pt-8">
              <span className="font-script text-6xl sm:text-7xl text-[#B08D3C]">{monograma}</span>
            </div>
          </div>

          {/* Polaroid principal */}
          <div className="relative w-60 sm:w-72 mx-auto mt-8 -rotate-3 bg-white p-2.5 pb-8 shadow-xl rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.fotoPortadaUrl} alt={data.titulo} className="w-full h-auto object-cover" />
            <p className="font-script text-2xl text-[#9D2C4A] mt-2">{data.titulo}</p>
          </div>

          {/* Texto de invitación */}
          <div className="max-w-md mx-auto mt-10 space-y-2">
            <p className="font-serif-roman text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#B08D3C] font-bold">
              {isEn ? "With love & gratitude" : "Con amor y gratitud"}
            </p>
            {familiaAnfitriona && (
              <p className="font-script text-4xl sm:text-5xl text-[#9D2C4A]">{familiaAnfitriona}</p>
            )}
            <p className="font-serif-roman text-xs sm:text-sm tracking-[0.2em] uppercase leading-relaxed text-[#4A3436]">
              {isEn
                ? "Proudly invites you to celebrate the Quinceañera of their beloved daughter"
                : "Tiene el honor de invitarte a celebrar los Quince Años de su querida hija"}
            </p>
            <h1 className="font-script text-6xl sm:text-7xl text-[#9D2C4A] leading-tight pt-1">{data.titulo}</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLUSH_ASSETS.divider} alt="" className="w-56 h-auto mx-auto pt-2 opacity-90" />
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 2: ESCENA DEL SOBRE + MIS XV                    */}
        {/* ======================================================= */}
        <section className="px-6 py-8 text-center">
          <div className="relative max-w-sm mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLUSH_ASSETS.envelopeOpen} alt="Sobre" className="w-full h-auto rounded-2xl shadow-xl" />
            <div
              className="absolute left-[21%] right-[21%] top-[24%] text-center"
            >
              <p className="font-script text-3xl sm:text-4xl text-[#9D2C4A] leading-tight">{data.titulo}</p>
            </div>
            {/* Marco óvalo Mis XV */}
            <div className="absolute -bottom-8 -right-3 sm:-right-6 w-28 sm:w-32 rotate-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BLUSH_ASSETS.ovalFrame} alt="" className="w-full h-auto drop-shadow-lg" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-script text-2xl sm:text-3xl text-[#B08D3C] leading-none">Mis</span>
                <span className="font-serif-roman text-xl sm:text-2xl tracking-[0.2em] text-[#9D2C4A] font-bold leading-none">XV</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 3: TARJETA DE FECHA + RSVP                      */}
        {/* ======================================================= */}
        <section className="px-6 py-10 text-center">
          <div className="relative max-w-sm mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLUSH_ASSETS.bowCard} alt="" className="w-full h-auto drop-shadow-xl" />
            <div className="absolute inset-x-8 top-[30%] bottom-[8%] flex flex-col items-center justify-center text-center px-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BLUSH_ASSETS.cross} alt="" className="w-8 h-auto mb-1 opacity-90" />
              <p className="font-serif-roman text-base sm:text-lg tracking-[0.18em] uppercase text-[#B08D3C] font-bold">
                {eventWeekday}, {eventMonth} {eventDay}
              </p>
              <p className="font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase text-[#4A3436] mt-0.5">
                {eventYear} · {eventTime}
              </p>
              <a
                href="#rsvp"
                className="mt-3 inline-flex flex-col items-center rounded-full bg-gradient-to-b from-[#DCC084] via-[#B08D3C] to-[#96762E] text-white px-7 py-2.5 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <span className="font-serif-roman text-xs tracking-[0.3em] uppercase font-bold leading-none">RSVP</span>
                <span className="text-[9px] tracking-[0.15em] uppercase opacity-90 leading-tight mt-0.5">
                  {isEn ? `Here · by ${deadlineMonthEn} ${deadlineDay}` : `Aquí · antes del ${deadlineDay} de ${deadlineMonthEs}`}
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 4: CEREMONIA Y RECEPCIÓN + THEN / NOW           */}
        {/* ======================================================= */}
        <section className="px-6 py-8">
          <h3 className="font-script text-5xl text-center text-[#9D2C4A] mb-6">
            {isEn ? "The Details" : "Los Detalles"}
          </h3>
          <div className="max-w-md mx-auto space-y-5">
            {data.ceremoniaNombre && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#B08D3C]/40 shadow-lg p-6 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BLUSH_ASSETS.cross} alt="" className="w-10 h-auto mx-auto mb-2" />
                <h4 className="font-serif-roman text-xs tracking-[0.3em] uppercase text-[#B08D3C] font-bold">
                  {isEn ? "Ceremony" : "Ceremonia"}
                </h4>
                <p className="font-serif-roman text-sm sm:text-base tracking-wide uppercase mt-2 text-[#4A3436] font-semibold">
                  {data.ceremoniaNombre}
                </p>
                <p className="text-xs text-[#4A3436]/70 mt-1">{eventTime}</p>
                {data.ceremoniaDireccion && (
                  <p className="text-xs text-[#4A3436]/70">{data.ceremoniaDireccion}</p>
                )}
                <a
                  href={getMapDirectionsUrl(data.ceremoniaMapUrl || undefined, data.ceremoniaNombre + ", " + (data.ceremoniaDireccion || ""))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#B08D3C] text-[#96762E] px-5 py-2 font-serif-roman text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-[#B08D3C] hover:text-white transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" /> {isEn ? "View Map" : "Ver Mapa"}
                </a>
              </div>
            )}

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#B08D3C]/40 shadow-lg p-6 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BLUSH_ASSETS.chandelier} alt="" className="w-14 h-auto mx-auto mb-1" />
              <h4 className="font-serif-roman text-xs tracking-[0.3em] uppercase text-[#B08D3C] font-bold">
                {isEn ? "Reception" : "Recepción"}
              </h4>
              <p className="font-serif-roman text-sm sm:text-base tracking-wide uppercase mt-2 text-[#4A3436] font-semibold">
                {data.recepcionNombre}
              </p>
              <p className="text-xs text-[#4A3436]/70 mt-1">{data.recepcionDireccion}</p>
              <a
                href={getMapDirectionsUrl(data.recepcionMapUrl || undefined, data.recepcionNombre + ", " + data.recepcionDireccion)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#B08D3C] text-[#96762E] px-5 py-2 font-serif-roman text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-[#B08D3C] hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" /> {isEn ? "View Map" : "Ver Mapa"}
              </a>
            </div>
          </div>

          {/* Then / Now */}
          {(data.fotoInfanciaUrl || data.fotoActualUrl) && (
            <div className="flex items-start justify-center gap-5 sm:gap-8 mt-10">
              {data.fotoInfanciaUrl && (
                <div className="w-36 sm:w-44 -rotate-4 bg-white p-2 pb-6 shadow-lg rounded-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.fotoInfanciaUrl} alt="" className="w-full h-auto object-cover" />
                  <p className="font-script text-xl text-[#9D2C4A] text-center mt-1.5">{isEn ? "Then" : "Antes"}</p>
                </div>
              )}
              {data.fotoActualUrl && (
                <div className="w-36 sm:w-44 rotate-3 bg-white p-2 pb-6 shadow-lg rounded-sm mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.fotoActualUrl} alt="" className="w-full h-auto object-cover" />
                  <p className="font-script text-xl text-[#9D2C4A] text-center mt-1.5">{isEn ? "Now" : "Ahora"}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 5: CORTE DE HONOR                               */}
        {/* ======================================================= */}
        {corte && (
          <section className="px-6 py-10 text-center relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLUSH_ASSETS.girlBack} alt="" className="w-28 sm:w-36 h-auto mx-auto mb-2 opacity-95" />
            <h3 className="font-script text-5xl text-[#9D2C4A]">
              {isEn ? "Court of Honor" : "Corte de Honor"}
            </h3>
            <p className="font-serif-roman text-[10px] tracking-[0.3em] uppercase text-[#B08D3C] font-bold mt-1">
              {isEn ? "The ones by my side" : "Quienes me acompañan"}
            </p>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-[#4A3436]/80 leading-relaxed mt-4 font-serif-roman">
              {corte.mensajeGratitud ||
                (isEn
                  ? "A Quinceañera is made even more meaningful by the love and support of those who stand beside me. I am honored to celebrate this unforgettable day with my amazing court."
                  : "Una Quinceañera es aún más especial gracias al amor y apoyo de quienes me acompañan. Me siento muy feliz de celebrar este momento inolvidable junto a mi querida corte de honor.")}
            </p>

            <div className="max-w-md mx-auto mt-7 space-y-6 text-sm">
              {corte.parents && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#B08D3C] font-bold mb-1.5">
                    {isEn ? "Parents" : "Padres"}
                  </h5>
                  <p className="font-serif-roman text-[#4A3436]">{corte.parents}</p>
                </div>
              )}
              {((Array.isArray(corte.damas) && corte.damas.length > 0) || (typeof corte.damas === "string" && corte.damas.trim())) && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#B08D3C] font-bold mb-1.5">
                    {isEn ? "Damas" : "Damas"}
                  </h5>
                  <p className="font-serif-roman text-[#4A3436] leading-relaxed">
                    {Array.isArray(corte.damas) ? corte.damas.join(" · ") : corte.damas}
                  </p>
                </div>
              )}
              {((Array.isArray(corte.chambelanes) && corte.chambelanes.length > 0) || (typeof corte.chambelanes === "string" && corte.chambelanes.trim())) && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#B08D3C] font-bold mb-1.5">
                    {isEn ? "Chambelanes" : "Chambelanes"}
                  </h5>
                  <p className="font-serif-roman text-[#4A3436] leading-relaxed">
                    {Array.isArray(corte.chambelanes) ? corte.chambelanes.join(" · ") : corte.chambelanes}
                  </p>
                </div>
              )}
              {corte.chambelan && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#B08D3C] font-bold mb-1.5">
                    {isEn ? "Chambelán de Honor" : "Chambelán de Honor"}
                  </h5>
                  <p className="font-serif-roman text-[#4A3436]">{corte.chambelan}</p>
                </div>
              )}
              {((Array.isArray(corte.padrinos) && corte.padrinos.length > 0) || (typeof corte.padrinos === "string" && corte.padrinos.trim())) && (
                <div>
                  <h5 className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#B08D3C] font-bold mb-1.5">
                    {isEn ? "Padrinos" : "Padrinos"}
                  </h5>
                  <div className="space-y-1">
                    {(Array.isArray(corte.padrinos) ? corte.padrinos : [corte.padrinos]).map((p: string, i: number) => (
                      <p key={i} className="font-serif-roman text-[#4A3436]">{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ======================================================= */}
        {/* SECCIÓN 6: SAVE THE DATE + CUENTA REGRESIVA             */}
        {/* ======================================================= */}
        <section className="relative py-10 px-6 text-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BLUSH_ASSETS.silkB} alt="" className="absolute inset-0 w-full h-full object-cover -z-0 opacity-70" />
          <div className="relative">
            <h3 className="font-script text-5xl sm:text-6xl text-[#9D2C4A]">
              {isEn ? "Save the Date!" : "¡Reserva la Fecha!"}
            </h3>
            <p className="font-serif-roman text-sm sm:text-base tracking-[0.3em] uppercase text-[#4A3436] font-bold mt-2">
              {eventMonth} {eventDay}, {eventYear}
            </p>
            <div className="flex items-stretch justify-center gap-2.5 sm:gap-3 mt-6">
              {[
                { v: timeLeft.days, l: isEn ? "Days" : "Días" },
                { v: timeLeft.hours, l: isEn ? "Hours" : "Horas" },
                { v: timeLeft.minutes, l: isEn ? "Min" : "Min" },
                { v: timeLeft.seconds, l: isEn ? "Sec" : "Seg" },
              ].map((u) => (
                <div key={u.l} className="w-16 sm:w-20 bg-white/90 backdrop-blur rounded-2xl border border-[#B08D3C]/50 shadow-md py-3">
                  <p className="font-serif-roman text-2xl sm:text-3xl font-bold text-[#9D2C4A] leading-none">{u.v}</p>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-[#B08D3C] font-bold mt-1.5">{u.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 7: ITINERARIO                                   */}
        {/* ======================================================= */}
        <section className="px-6 py-10">
          <h3 className="font-script text-5xl text-center text-[#9D2C4A] mb-2">
            {isEn ? "Celebration Timeline" : "Itinerario"}
          </h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BLUSH_ASSETS.divider} alt="" className="w-48 h-auto mx-auto mb-8 opacity-90" />
          <div className="max-w-sm mx-auto relative">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-[#B08D3C]/40" />
            <div className="space-y-6">
              {itineraryList.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 relative">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white border border-[#B08D3C]/60 shadow flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.icon} alt="" className="w-9 h-9 object-contain" />
                  </div>
                  <div>
                    <p className="font-serif-roman text-xs tracking-[0.2em] text-[#B08D3C] font-bold uppercase">{item.hora}</p>
                    <p className="font-serif-roman text-sm sm:text-base text-[#4A3436] font-semibold">{item.titulo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 8: CÓDIGO DE VESTIMENTA + PALETA                */}
        {/* ======================================================= */}
        {(data.mostrarDressCode !== false) && (
          <section className="px-6 py-10 text-center">
            <h3 className="font-script text-5xl text-[#9D2C4A]">
              {isEn ? (data.dressCodeTituloEn || "Dress Code") : (data.dressCodeTitulo || "Código de Vestimenta")}
            </h3>
            <p className="font-serif-roman text-xs tracking-[0.3em] uppercase text-[#B08D3C] font-bold mt-2">
              {isEn ? "Elegant Attire · Formal attire encouraged" : "Vestimenta Elegante · Se recomienda vestimenta formal"}
            </p>
            {(data.dressCodeNota || data.dressCodeNotaEn) && (
              <p className="max-w-md mx-auto text-xs sm:text-sm text-[#4A3436]/80 font-serif-roman leading-relaxed mt-3">
                {isEn ? (data.dressCodeNotaEn || data.dressCodeNota) : data.dressCodeNota}
              </p>
            )}
            <p className="font-serif-roman text-[10px] tracking-[0.3em] uppercase text-[#4A3436]/60 font-bold mt-7 mb-3">
              {isEn ? "Our color palette" : "Nuestra paleta de colores"}
            </p>
            <div className="flex items-center justify-center gap-3">
              {swatches.map((c: string, i: number) => (
                <span key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: c }} />
              ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLUSH_ASSETS.girlCorset} alt="" className="w-32 sm:w-40 h-auto mx-auto mt-8 opacity-95" />
          </section>
        )}

        {/* ======================================================= */}
        {/* SECCIÓN 9: MAPA, VIAJE Y HOSPEDAJE                      */}
        {/* ======================================================= */}
        <section className="px-6 py-10">
          <h3 className="font-script text-5xl text-center text-[#9D2C4A] mb-6">
            {isEn ? "The Location" : "Ubicación"}
          </h3>
          <div className="max-w-md mx-auto rounded-3xl overflow-hidden border border-[#B08D3C]/40 shadow-lg bg-white">
            <iframe
              title={isEn ? "Event map" : "Mapa del evento"}
              src={getMapEmbedUrl(data.recepcionMapUrl || undefined, data.recepcionNombre + ", " + data.recepcionDireccion) || ""}
              className="w-full h-64 border-0"
              loading="lazy"
            />
            <div className="p-5 text-center">
              <p className="font-serif-roman text-sm font-semibold uppercase tracking-wide text-[#4A3436]">{data.recepcionNombre}</p>
              <p className="text-xs text-[#4A3436]/70 mt-0.5">{data.recepcionDireccion}</p>
              <a
                href={getMapDirectionsUrl(data.recepcionMapUrl || undefined, data.recepcionNombre + ", " + data.recepcionDireccion)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#DCC084] via-[#B08D3C] to-[#96762E] text-white px-6 py-2.5 font-serif-roman text-[11px] tracking-[0.2em] uppercase font-bold shadow hover:scale-105 transition-transform"
              >
                <MapPin className="w-3.5 h-3.5" /> {isEn ? "Get Directions" : "Cómo Llegar"}
              </a>
            </div>
          </div>

          {(transporteTexto || hospedajeTexto) && (
            <div className="max-w-md mx-auto mt-6 space-y-5">
              {transporteTexto && (
                <div className="bg-white/90 rounded-3xl border border-[#B08D3C]/40 shadow p-6 text-center">
                  <h4 className="font-serif-roman text-xs tracking-[0.3em] uppercase text-[#B08D3C] font-bold mb-2">
                    {isEn ? "Travel & Transportation" : "Información de Viaje"}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A3436]/85 font-serif-roman leading-relaxed">{transporteTexto}</p>
                </div>
              )}
              {hospedajeTexto && (
                <div className="bg-white/90 rounded-3xl border border-[#B08D3C]/40 shadow p-6 text-center">
                  <h4 className="font-serif-roman text-xs tracking-[0.3em] uppercase text-[#B08D3C] font-bold mb-2">
                    {isEn ? "Accommodations" : "Hospedaje"}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A3436]/85 font-serif-roman leading-relaxed">{hospedajeTexto}</p>
                  {hotelLink && (
                    <a
                      href={hotelLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex rounded-full border border-[#B08D3C] text-[#96762E] px-5 py-2 font-serif-roman text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-[#B08D3C] hover:text-white transition-colors"
                    >
                      {isEn ? "View Hotel" : "Ver Hotel"}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 10: MESA DE REGALOS                             */}
        {/* ======================================================= */}
        {data.mostrarMesaRegalos !== false && (
          <section className="px-6 py-10 text-center relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLUSH_ASSETS.bouquetA} alt="" className="w-32 sm:w-40 h-auto mx-auto mb-1" />
            <h3 className="font-script text-5xl text-[#9D2C4A]">
              {isEn ? "Gift Registry" : "Mesa de Regalos"}
            </h3>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-[#4A3436]/85 font-serif-roman leading-relaxed mt-3">
              {(isEn ? data.regalosMensajeEn : data.regalosMensaje) ||
                data.mesaRegalosJson?.mensaje ||
                (isEn
                  ? "Your presence is the greatest gift we could ask for. If you'd like to celebrate with a gift, we've created a registry for your convenience."
                  : "Su presencia es el mejor regalo. Si desean obsequiar algo más, preparamos una mesa de regalos para su comodidad.")}
            </p>
            {plataformasRegalos.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
                {plataformasRegalos.map((p: string, i: number) => (
                  <a
                    key={i}
                    href={data.wishlistUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gradient-to-b from-[#DCC084] via-[#B08D3C] to-[#96762E] text-white px-7 py-2.5 font-serif-roman text-xs tracking-[0.25em] uppercase font-bold shadow hover:scale-105 transition-transform"
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
            {(data.regalosZelle || data.regalosCashApp) && (
              <div className="mt-5 space-y-1 text-xs font-serif-roman text-[#4A3436]/85">
                {data.regalosZelle && <p>Zelle: {data.regalosZelle}</p>}
                {data.regalosCashApp && <p>Cash App: {data.regalosCashApp}</p>}
              </div>
            )}
          </section>
        )}

{/* ======================================================= */}
        {/* SECCIÓN 10: CONFIRMACIÓN DE ASISTENCIA (RSVP)           */}
        {/* ======================================================= */}
        <section id="rsvp" className="px-4 py-6 z-20">
          <div className="relative w-full max-w-[390px] mx-auto -mb-9 z-20 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BLUSH_ASSETS.seal}
              alt="Sello RSVP"
              className="w-24 h-24 object-contain drop-shadow-xl"
            />
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 pt-10 rounded-3xl border border-[#D8B772]/60 shadow-xl text-center relative z-10">
            <h3 className="font-script text-4xl text-[#9D2C4A] my-1">
              {isEn ? "RSVP" : "Confirmar Asistencia"}
            </h3>
            <p className="text-[11px] text-slate-500 mb-5 uppercase tracking-wider font-serif-roman font-semibold">
              {rsvpDeadlinePhrase}
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
                  <h4 className="font-script text-3xl text-[#9D2C4A]">
                    {isEn ? "See You There!" : "¡Te Esperamos!"}
                  </h4>
                </div>
                <div className="bg-[#FDF3F5] border border-rose-100 rounded-2xl p-4 text-xs font-serif-roman text-slate-700 leading-relaxed max-w-sm mx-auto shadow-xs">
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
                    className="w-full bg-[#FDF3F5] border border-rose-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#9D2C4A]"
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
                    className="w-full bg-[#FDF3F5] border border-rose-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#9D2C4A]"
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
                            className="accent-[#9D2C4A]"
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
                  className="w-full bg-[#9D2C4A] hover:bg-[#7E2140] text-white py-3.5 px-4 rounded-xl font-serif-roman text-xs uppercase tracking-widest transition shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
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
        {/* SECCIÓN 12: GRACIAS, PREGUNTAS Y CIERRE                 */}
        {/* ======================================================= */}
        <section className="px-6 py-10 text-center relative">
          {data.fotoCierreUrl && (
            <div className="relative w-52 sm:w-60 mx-auto mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BLUSH_ASSETS.cameoFrame} alt="" className="w-full h-auto drop-shadow-lg" />
              <div className="absolute inset-[13%] overflow-hidden rounded-[45%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.fotoCierreUrl} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <h3 className="font-script text-5xl text-[#9D2C4A]">{isEn ? "Thank You" : "Gracias"}</h3>
          <p className="max-w-md mx-auto text-xs sm:text-sm text-[#4A3436]/85 font-serif-roman leading-relaxed mt-3">
            {data.mensajeDespedida ||
              (isEn
                ? "Your love and support mean the world to us, and we can't wait to celebrate together."
                : "Su cariño y apoyo significan muchísimo para nosotros, y estamos muy emocionados por celebrar juntos.")}
          </p>

          <div className="max-w-md mx-auto mt-9 bg-white/90 rounded-3xl border border-[#B08D3C]/40 shadow p-6">
            <h4 className="font-script text-4xl text-[#9D2C4A]">{isEn ? "Questions?" : "¿Tienes alguna pregunta?"}</h4>
            <p className="text-xs sm:text-sm text-[#4A3436]/85 font-serif-roman leading-relaxed mt-2">
              {isEn
                ? "If you have any questions before the big day, please don't hesitate to reach out. We'd love to hear from you!"
                : "Si tienes alguna pregunta antes del gran día, no dudes en comunicarte. ¡Nos encantará saber de ti!"}
            </p>
            <div className="mt-4 space-y-1.5 text-sm font-serif-roman text-[#4A3436]">
              {familiaAnfitriona && <p className="font-semibold">{familiaAnfitriona}</p>}
              {data.telefonoWhatsappRsvp && (
                <p className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-[#B08D3C]" /> {data.telefonoWhatsappRsvp}
                </p>
              )}
              {data.emailOrganizador && (
                <p className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-[#B08D3C]" /> {data.emailOrganizador}
                </p>
              )}
            </div>
          </div>

          {/* Añadir a calendario */}
          <div className="my-8">
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
              className="inline-flex items-center gap-2 rounded-full border border-[#B08D3C] text-[#96762E] px-6 py-2.5 font-serif-roman text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-[#B08D3C] hover:text-white transition-colors"
            >
              <CalendarPlus className="w-4 h-4" /> {isEn ? "Add to Calendar" : "Añadir a Calendario"}
            </a>
          </div>

          <button
            type="button"
            onClick={handleReturnToEnvelope}
            className="font-serif-roman text-[11px] tracking-[0.3em] uppercase text-[#B08D3C] font-bold hover:text-[#9D2C4A] transition-colors cursor-pointer"
          >
            {isEn ? "Return to Envelope" : "Volver al Sobre"}
          </button>

          <div className="mt-10 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BLUSH_ASSETS.divider} alt="" className="w-48 h-auto mx-auto opacity-90" />
            <p className="font-script text-4xl text-[#9D2C4A] mt-3">{data.titulo}</p>
            <p className="text-[10px] font-serif-roman tracking-[0.3em] uppercase text-[#4A3436]/50 mt-1">
              {formalDateDisplay}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
