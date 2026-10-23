"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, CheckCircle2, Sparkles, MessageCircle, Music, Pause, CalendarPlus, Phone, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { InvitationData } from "../invitation/InvitationMobileView";
import { getMapEmbedUrl, getMapDirectionsUrl } from "@/lib/maps";
import { BABY_BLUE_ASSETS } from "@/lib/templates/babyBlueAssets";
import { parseTemplateConfig, BabyBlueConfig } from "@/types/templateConfigs";

export default function BabyBlueTemplate({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const templateConfig = parseTemplateConfig<BabyBlueConfig>(data.configPlantilla);
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
          colors: ["#5B8DB8", "#A9C8E2", "#F2C4CE", "#FFFFFF"],
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

    if (iconType.includes("mass") || iconType.includes("church") || title.includes("misa") || title.includes("mass")) return BABY_BLUE_ASSETS.quinceGirl;
    if (iconType.includes("entrance") || title.includes("entrada") || title.includes("entrance")) return BABY_BLUE_ASSETS.mansion;
    if (iconType.includes("waltz") || iconType.includes("dance") || title.includes("vals") || title.includes("waltz")) return BABY_BLUE_ASSETS.fatherDance;
    if (iconType.includes("dinner") || title.includes("cena") || title.includes("dinner")) return BABY_BLUE_ASSETS.plate;
    if (iconType.includes("party") || iconType.includes("disco") || title.includes("fiesta") || title.includes("party") || title.includes("baile")) return BABY_BLUE_ASSETS.discoBall;

    const fallbackIcons = [
      BABY_BLUE_ASSETS.quinceGirl,
      BABY_BLUE_ASSETS.mansion,
      BABY_BLUE_ASSETS.fatherDance,
      BABY_BLUE_ASSETS.plate,
      BABY_BLUE_ASSETS.discoBall,
    ];
    return fallbackIcons[idx % fallbackIcons.length];
  };

  const defaultBabyBlueItinerary = isEn
    ? [
        { hora: "3:00 PM", titulo: "Mass", tipoIcono: "mass", descripcion: "St. Andrew's Church" },
        { hora: "4:00 PM", titulo: "Entrance", tipoIcono: "entrance", descripcion: "Heaven Banquet Room" },
        { hora: "5:15 PM", titulo: "Waltz", tipoIcono: "waltz" },
        { hora: "5:45 PM", titulo: "Dinner", tipoIcono: "dinner" },
        { hora: "6:45 PM", titulo: "Dance Party", tipoIcono: "party" },
      ]
    : [
        { hora: "3:00 PM", titulo: "Misa", tipoIcono: "mass", descripcion: "St. Andrew's Church" },
        { hora: "4:00 PM", titulo: "Entrada", tipoIcono: "entrance", descripcion: "Heaven Banquet Room" },
        { hora: "5:15 PM", titulo: "Vals", tipoIcono: "waltz" },
        { hora: "5:45 PM", titulo: "Cena", tipoIcono: "dinner" },
        { hora: "6:45 PM", titulo: "Fiesta", tipoIcono: "party" },
      ];

  const rawItinerary =
    (Array.isArray(data.itinerario) && data.itinerario.length > 0)
      ? data.itinerario
      : (Array.isArray(data.itinerarioJson) && data.itinerarioJson.length > 0)
        ? data.itinerarioJson
        : defaultBabyBlueItinerary;

  const itineraryList = rawItinerary.map((item: any, idx: number) => ({
    hora: item.hora || item.time || "",
    titulo: item.titulo || item.title || "",
    descripcion: item.descripcion || item.description || "",
    tipoIcono: (item.tipoIcono || item.tipo || "").toLowerCase(),
    icon: item.icon ? item.icon : getItineraryIcon(item, idx),
  }));

  // Corte de honor dinámico
  const corte = data.corteHonorJson || null;
  // ===== Baby Blue: datos derivados =====
  const familiaAnfitriona = isEn
    ? templateConfig.familiaAnfitrionaEn || templateConfig.familiaAnfitriona
    : templateConfig.familiaAnfitriona;
  const nombrePartes = (data.titulo || "").trim().split(/\s+/).filter(Boolean);
  const cartaTexto = isEn
    ? templateConfig.cartaTextoEn || templateConfig.cartaTexto
    : templateConfig.cartaTexto;
  const contactoNombre = templateConfig.contactoNombre || "";
  const ceremoniaHora = templateConfig.ceremoniaHora || "3:00 PM";
  const handleReturnToEnvelope = () => {
    setIsEnvelopeOpen(false);
    setIsLetterOut(false);
    setIsEnvelopeExiting(false);
    setIsEnvelopeFading(false);
    setIsEnvelopeRemoved(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-screen font-sans-body text-[#22344A] antialiased selection:bg-sky-200 selection:text-sky-900 overflow-x-hidden bg-[#FDFCF8]">
      {/* Audio en bucle (solo si el evento define música y el invitado la activa) */}
      <audio ref={audioRef} loop preload="none" src={defaultAudio} />

      {/* ========================================================= */}
      {/* PORTADA: SOBRE (réplica Canva pág. 1)                     */}
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
            className={`absolute inset-0 transition-opacity duration-200 ${
              isEnvelopeFading ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backgroundImage: `url(${BABY_BLUE_ASSETS.blueTexture})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-white/72" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.blueBouquet} alt="" className="absolute -top-4 -left-4 w-32 sm:w-40 opacity-90 pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.blueBouquet} alt="" className="absolute -top-4 -right-4 w-32 sm:w-40 opacity-90 pointer-events-none -scale-x-100" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.dove} alt="" className="absolute bottom-24 right-2 sm:right-8 w-28 sm:w-36 pointer-events-none" />
          </div>

          <div
            className="relative z-10 flex h-full flex-col items-center justify-center p-4 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isEnvelopeExiting ? "translateY(-100vh)" : "translateY(0)",
            }}
          >
            <div
              className={`text-center transition-opacity duration-300 ${
                isEnvelopeOpen ? "opacity-0" : "opacity-100"
              }`}
            >
              <p className="font-serif-roman text-xs sm:text-sm tracking-[0.45em] uppercase text-[#7FA8C9] font-bold">
                {isEn ? "You're invited to" : "Estás invitado a"}
              </p>
              <p className="font-script text-6xl sm:text-7xl text-[#5B8DB8] leading-tight mt-2">
                {nombrePartes[0]}
                {isEn ? "'s" : ""}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BABY_BLUE_ASSETS.scriptQuinceanera} alt="Quinceañera" className="w-60 sm:w-72 h-auto mx-auto -mt-1" />
              <p className="font-script text-4xl text-[#5B8DB8] mt-1">{formalDateDisplay}</p>
              {guestRecipient && guestRecipient !== "Familia & Amigos" && (
                <p className="text-sm mt-2 text-[#7FA8C9] font-serif-roman italic tracking-wider">{guestRecipient}</p>
              )}
            </div>

            <div
              className={`relative w-[min(78vw,300px)] mt-4 transition-all duration-500 ${
                isEnvelopeOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BABY_BLUE_ASSETS.envelopeClosed} alt="Sobre" className="w-full h-auto object-contain drop-shadow-2xl" />
            </div>

            {isBilingual ? (
              <div
                className={`mt-5 flex items-center justify-center gap-3 sm:gap-5 z-30 transition-opacity duration-300 ${
                  isEnvelopeOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEnvelope("en");
                  }}
                  className="inline-flex items-center justify-center w-36 sm:w-44 h-12 rounded-full bg-white/85 border border-[#A9C8E2] text-[#2E5A88] font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase font-bold shadow transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEnvelope("es");
                  }}
                  className="inline-flex items-center justify-center w-36 sm:w-44 h-12 rounded-full bg-white/85 border border-[#A9C8E2] text-[#2E5A88] font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase font-bold shadow transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Español
                </button>
              </div>
            ) : (
              <p
                className={`mt-5 font-script text-3xl sm:text-4xl text-[#2E5A88] z-30 transition-opacity duration-300 ${
                  isEnvelopeOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                {isEn ? "Tap to open your envelope" : "Toca para abrir tu sobre"}
              </p>
            )}
          </div>
        </aside>
      )}

      {isBilingual && (
        <aside
          aria-label="Selector de idioma"
          className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-md border border-[#A9C8E2] rounded-full shadow-lg p-1 flex items-center gap-1 text-[11px] font-serif-roman tracking-wider"
        >
          <button
            type="button"
            onClick={() => setCurrentLang("es")}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold ${
              currentLang === "es" ? "bg-[#2E5A88] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ES
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setCurrentLang("en")}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold ${
              currentLang === "en" ? "bg-[#2E5A88] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            EN
          </button>
        </aside>
      )}

      <main className="relative z-10">
        {/* ======================================================= */}
        {/* HERO: MARCO ÓVALO DE PLATA CON FOTO                     */}
        {/* ======================================================= */}
        <section className="relative px-6 pt-12 pb-4 text-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BABY_BLUE_ASSETS.blueBouquet} alt="" className="absolute -top-2 -left-6 w-28 opacity-80 pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BABY_BLUE_ASSETS.blueBouquet} alt="" className="absolute -top-2 -right-6 w-28 opacity-80 pointer-events-none -scale-x-100" />
          <div className="relative w-[min(88vw,380px)] aspect-square mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoPortadaUrl}
              alt={data.titulo}
              className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 w-[63%] aspect-[3/4] object-cover rounded-[50%] shadow-inner"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.ovalFrame} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.stardust} alt="" className="absolute -left-8 top-6 w-16 opacity-80 pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.stardust} alt="" className="absolute -right-8 bottom-10 w-16 opacity-80 pointer-events-none -scale-x-100" />
          </div>
        </section>

        {/* ======================================================= */}
        {/* INVITACIÓN + CUENTA REGRESIVA                           */}
        {/* ======================================================= */}
        <section className="px-6 py-8 text-center">
          {familiaAnfitriona && (
            <p className="font-serif-roman text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#7FA8C9] font-bold">
              {familiaAnfitriona} {isEn ? "happily invite you to the" : "te invita con alegría a la"}
            </p>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BABY_BLUE_ASSETS.scriptQuinceanera} alt="Quinceañera" className="w-64 sm:w-80 h-auto mx-auto mt-2" />
          <p className="font-serif-roman text-xs tracking-[0.5em] uppercase text-[#7FA8C9] font-bold mt-1">
            {isEn ? "Celebration" : "Celebración"}
          </p>
          <p className="font-serif-roman text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#22344A] mt-4">
            {isEn ? "In honor of their daughter" : "En honor de su hija"}
          </p>
          <h1 className="font-script text-6xl sm:text-7xl text-[#5B8DB8] leading-tight mt-1">{data.titulo}</h1>
          <p className="font-serif-roman text-sm sm:text-base tracking-[0.2em] uppercase text-[#22344A] font-semibold mt-3">
            {formalDateDisplay}
            {eventTime ? ` | ${eventTime}` : ""}
          </p>
          <p className="font-serif-roman text-xs tracking-[0.2em] uppercase text-[#22344A]/70 mt-1">{data.recepcionDireccion}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BABY_BLUE_ASSETS.wave} alt="" className="w-52 h-auto mx-auto mt-5 opacity-80" />

          <div className="flex items-stretch justify-center gap-2.5 sm:gap-3 mt-7">
            {[
              { v: timeLeft.days, l: isEn ? "Days" : "Días" },
              { v: timeLeft.hours, l: isEn ? "Hours" : "Horas" },
              { v: timeLeft.minutes, l: isEn ? "Mins" : "Min" },
              { v: timeLeft.seconds, l: isEn ? "Secs" : "Seg" },
            ].map((u) => (
              <div key={u.l} className="w-16 sm:w-20 bg-white rounded-2xl border border-[#D6E6F2] shadow-md py-3">
                <p className="font-serif-roman text-2xl sm:text-3xl font-bold text-[#1F3A5F] leading-none">{u.v}</p>
                <p className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#7FA8C9] font-bold mt-1.5">{u.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================= */}
        {/* MASS VENUE: POSTAL                                      */}
        {/* ======================================================= */}
        {data.ceremoniaNombre && (
          <section className="px-6 py-10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.envelopeOpen} alt="" className="w-64 sm:w-72 h-auto mx-auto" />
            <h3 className="font-script text-5xl sm:text-6xl text-[#5B8DB8] leading-tight mt-2">
              {isEn ? "Mass Venue" : "Lugar de la Misa"}
            </h3>
            <div className="relative max-w-sm mx-auto mt-5 bg-white p-3 pb-5 shadow-2xl -rotate-2 rounded-md border border-[#E4EEF6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BABY_BLUE_ASSETS.castlePhoto} alt="" className="w-full h-auto rounded-sm" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BABY_BLUE_ASSETS.script15} alt="15" className="absolute top-5 right-5 w-14 h-auto drop-shadow-[0_1px_3px_rgba(31,58,95,0.6)]" />
              <p className="font-serif-roman text-sm sm:text-base tracking-[0.18em] uppercase font-bold text-[#22344A] mt-4">
                {data.ceremoniaNombre}
                {data.ceremoniaDireccion ? `, ${data.ceremoniaDireccion}` : ""}
              </p>
              <a
                href={getMapDirectionsUrl(data.ceremoniaMapUrl || undefined, data.ceremoniaNombre + ", " + (data.ceremoniaDireccion || ""))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-script text-3xl text-[#2E5A88] mt-1 hover:text-[#5B8DB8] transition-colors"
              >
                {isEn ? "Tap to get here" : "Toca para llegar"}
              </a>
              <p className="font-serif-roman text-xs tracking-[0.3em] uppercase text-[#7FA8C9] font-bold mt-1">
                {isEn ? "At" : "A las"} {ceremoniaHora}
              </p>
            </div>
            <div className="flex items-end justify-center gap-6 mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BABY_BLUE_ASSETS.lavenderButterflies} alt="" className="w-20 h-auto" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BABY_BLUE_ASSETS.glassSlipper} alt="" className="w-24 h-auto" />
            </div>
          </section>
        )}

        {/* ======================================================= */}
        {/* SCHEDULE OF EVENTS                                      */}
        {/* ======================================================= */}
        <section className="px-6 py-10">
          <h3 className="font-script text-5xl sm:text-6xl text-[#5B8DB8] leading-tight text-center">
            {isEn ? "Schedule of events" : "Programa del evento"}
          </h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BABY_BLUE_ASSETS.wave} alt="" className="w-52 h-auto mx-auto mt-3 opacity-80" />

          <div className="max-w-sm mx-auto mt-8 relative text-left">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-[#A9C8E2]/60" />
            <div className="space-y-7">
              {itineraryList.map((item: any, i: number) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-white border border-[#A9C8E2] shadow flex items-center justify-center overflow-hidden z-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.icon} alt="" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <p className="font-serif-roman text-xs tracking-[0.2em] text-[#2E5A88] font-bold uppercase">{item.hora}</p>
                      <p className="font-serif-roman text-base sm:text-lg tracking-[0.12em] uppercase text-[#22344A] font-semibold">{item.titulo}</p>
                      {item.descripcion && (
                        <p className="font-serif-roman text-[11px] tracking-[0.12em] uppercase text-[#22344A]/65 mt-0.5">{item.descripcion}</p>
                      )}
                    </div>
                  </div>
                  {(item.tipoIcono === "mass" || item.tipoIcono === "entrance") && (
                    <div className="ml-[4.5rem] mt-2">
                      <a
                        href={getMapDirectionsUrl(
                          item.tipoIcono === "mass" ? data.ceremoniaMapUrl || undefined : data.recepcionMapUrl || undefined,
                          item.tipoIcono === "mass"
                            ? (data.ceremoniaNombre || "") + ", " + (data.ceremoniaDireccion || "")
                            : data.recepcionNombre + ", " + data.recepcionDireccion
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full border border-[#2E5A88] px-5 py-1.5 font-serif-roman text-[10px] tracking-[0.25em] uppercase font-bold text-[#2E5A88] hover:bg-[#2E5A88] hover:text-white transition-colors"
                      >
                        {isEn ? "Check Location" : "Ver ubicación"}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* REGALOS / WISH LIST                                     */}
        {/* ======================================================= */}
        {data.mostrarMesaRegalos !== false && (
          <section className="px-6 py-10">
            <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-xl border border-[#E4EEF6] px-7 py-8 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BABY_BLUE_ASSETS.glassSlipper} alt="" className="w-28 h-auto mx-auto" />
              <p className="text-sm text-[#22344A]/85 leading-relaxed font-serif-roman mt-4">
                {(isEn ? data.regalosMensajeEn : data.regalosMensaje) ||
                  (isEn
                    ? "Your presence is the greatest gift of all. If you wish to give something extra, a small registry has been thoughtfully prepared."
                    : "Tu presencia es el regalo más grande. Si deseas dar algo extra, preparamos una pequeña lista de regalos.")}
              </p>
              <h4 className="font-script text-4xl text-[#5B8DB8] mt-6">Wish List</h4>
              <a
                href={data.wishlistUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex rounded-full bg-[#2E5A88] text-white px-7 py-3 font-serif-roman text-[11px] tracking-[0.25em] uppercase font-bold shadow-lg hover:bg-[#5B8DB8] transition-colors"
              >
                {isEn ? "Click here to view my wishlist" : "Ver mi lista de deseos"}
              </a>
              {data.emailOrganizador && (
                <p className="text-[11px] font-serif-roman tracking-[0.12em] uppercase text-[#22344A]/60 mt-4">
                  {isEn ? "Or email us at" : "O escríbenos a"} {data.emailOrganizador}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ======================================================= */}
        {/* RSVP                                                    */}
        {/* ======================================================= */}
        <section className="px-6 pt-10 pb-2 text-center">
          <div className="flex items-end justify-center gap-3 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.babyPhoto} alt="" className="w-24 sm:w-28 h-auto bg-white p-1.5 pb-4 shadow-xl -rotate-6 rounded-sm" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.certificatePhoto} alt="" className="w-24 sm:w-28 h-auto bg-white p-1.5 pb-4 shadow-xl rotate-2 rounded-sm" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.cameraPhoto} alt="" className="w-24 sm:w-28 h-auto bg-white p-1.5 pb-4 shadow-xl rotate-6 rounded-sm" />
          </div>
          <p className="font-serif-roman text-xs tracking-[0.3em] uppercase text-[#22344A] font-semibold mt-7">
            {isEn ? "Please RSVP" : "Confirma"}
            {data.fechaLimiteRsvp ? ` ${isEn ? "by" : "antes del"} ${data.fechaLimiteRsvp}` : ""}
          </p>
          <p className="font-script text-6xl sm:text-7xl text-[#5B8DB8] leading-tight">RSVP</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BABY_BLUE_ASSETS.blueButterflies} alt="" className="w-20 h-auto mx-auto mt-1" />
        </section>

{/* ======================================================= */}
        {/* SECCIÓN 10: CONFIRMACIÓN DE ASISTENCIA (RSVP)           */}
        {/* ======================================================= */}
        <section id="rsvp" className="px-4 py-6 z-20">
          <div className="relative w-full max-w-[390px] mx-auto -mb-9 z-20 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BABY_BLUE_ASSETS.silverSeal}
              alt="Sello RSVP"
              className="w-24 h-24 object-contain drop-shadow-xl"
            />
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 pt-10 rounded-3xl border border-[#D8B772]/60 shadow-xl text-center relative z-10">
            <h3 className="font-script text-4xl text-[#2E5A88] my-1">
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
                    ? "bg-sky-50 text-sky-800 border-sky-300 shadow-sm"
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
                  <h4 className="font-script text-3xl text-[#2E5A88]">
                    {isEn ? "See You There!" : "¡Te Esperamos!"}
                  </h4>
                </div>
                <div className="bg-[#EEF4FA] border border-sky-200 rounded-2xl p-4 text-xs font-serif-roman text-slate-700 leading-relaxed max-w-sm mx-auto shadow-xs">
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
                    className="w-full bg-[#EEF4FA] border border-sky-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2E5A88]"
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
                    className="w-full bg-[#EEF4FA] border border-sky-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2E5A88]"
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
                            className="accent-[#2E5A88]"
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
                  className="w-full bg-[#2E5A88] hover:bg-[#1F3A5F] text-white py-3.5 px-4 rounded-xl font-serif-roman text-xs uppercase tracking-widest transition shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
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
        {/* CARTA: A SPECIAL CHAPTER BEGINS                         */}
        {/* ======================================================= */}
        <section className="px-6 py-12 text-center">
          <h3 className="font-script text-5xl sm:text-6xl text-[#5B8DB8] leading-tight">
            {isEn ? "A Special Chapter Begins" : "Comienza un Capítulo Especial"}
          </h3>
          {data.fotoCierreUrl && (
            <div className="relative w-[min(78vw,320px)] aspect-square mx-auto mt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.fotoCierreUrl}
                alt=""
                className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 w-[63%] aspect-[3/4] object-cover rounded-[50%]"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BABY_BLUE_ASSETS.ovalFrame} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            </div>
          )}
          <p className="max-w-md mx-auto font-serif-roman text-sm leading-relaxed text-[#22344A]/85 mt-6">
            {cartaTexto ||
              (isEn
                ? "A special chapter begins as I step into my fifteenth year, surrounded by the love and laughter of the people who mean the most to me. To my family — thank you for your unconditional love, your encouragement, and for always believing in me."
                : "Comienza un capítulo especial al llegar a mis quince años, rodeada del amor y la alegría de las personas que más quiero. A mi familia: gracias por su amor incondicional, su apoyo y por siempre creer en mí.")}
          </p>
          <p className="font-script text-4xl text-[#5B8DB8] mt-4">
            {isEn ? "Love," : "Con amor,"} {nombrePartes[0]} xoxo
          </p>
        </section>

        {/* ======================================================= */}
        {/* CONTACTO                                                */}
        {/* ======================================================= */}
        <section className="px-6 py-8 text-center">
          <h3 className="font-script text-5xl sm:text-6xl text-[#5B8DB8] leading-tight">
            {isEn ? "Get in touch" : "Contacto"}
          </h3>
          {contactoNombre && (
            <p className="font-serif-roman text-base tracking-[0.15em] uppercase font-semibold mt-4">{contactoNombre}</p>
          )}
          {data.telefonoWhatsappRsvp && (
            <p className="flex items-center justify-center gap-2 font-serif-roman text-sm text-[#22344A]/85 mt-2">
              <Phone className="w-4 h-4 text-[#2E5A88]" /> {data.telefonoWhatsappRsvp}
            </p>
          )}
          {data.emailOrganizador && (
            <p className="flex items-center justify-center gap-2 font-serif-roman text-sm text-[#22344A]/85 mt-1.5">
              <Mail className="w-4 h-4 text-[#2E5A88]" /> {data.emailOrganizador}
            </p>
          )}
        </section>

        {/* ======================================================= */}
        {/* FAQ                                                     */}
        {/* ======================================================= */}
        <section className="px-6 py-10">
          <h3 className="font-script text-5xl sm:text-6xl text-[#5B8DB8] leading-tight text-center">
            {isEn ? "Frequently Asked Questions" : "Preguntas Frecuentes"}
          </h3>
          <div className="max-w-md mx-auto mt-7 space-y-4">
            {[
              {
                n: "01",
                q: isEn ? "What is the dress code?" : "¿Cuál es el código de vestimenta?",
                a:
                  (isEn ? data.dressCodeNotaEn : data.dressCodeNota) ||
                  (isEn
                    ? "Guests are encouraged to dress in formal attire in harmony with the event's theme."
                    : "Se invita a los invitados a vestir formal, en armonía con el tema del evento."),
              },
              {
                n: "02",
                q: isEn ? "Can I bring a guest?" : "¿Puedo llevar un acompañante?",
                a: isEn
                  ? "Due to limited space, this celebration is by invitation only. We kindly ask that only those listed on the invitation attend."
                  : "Por el espacio limitado, esta celebración es solo con invitación. Pedimos amablemente que asistan solo las personas indicadas en la invitación.",
              },
              {
                n: "03",
                q: isEn ? "Are gifts required?" : "¿Es obligatorio llevar regalo?",
                a: isEn
                  ? "Your presence is the greatest gift of all. If you wish to give something extra, registry details are provided above."
                  : "Tu presencia es el regalo más grande. Si deseas dar algo extra, arriba están los detalles del registro.",
              },
            ].map((f) => (
              <div key={f.n} className="bg-white rounded-3xl border border-[#E4EEF6] shadow-md px-6 py-5 text-left">
                <p className="font-serif-roman text-[10px] tracking-[0.3em] text-[#7FA8C9] font-bold">{f.n}</p>
                <h5 className="font-serif-roman text-sm sm:text-base font-bold text-[#22344A] mt-1">{f.q}</h5>
                <p className="text-sm text-[#22344A]/80 leading-relaxed mt-1.5 font-serif-roman">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 pb-4">
            <button
              type="button"
              onClick={handleReturnToEnvelope}
              className="font-script text-3xl text-[#2E5A88] hover:text-[#5B8DB8] transition-colors cursor-pointer"
            >
              {isEn ? "Close the envelope" : "Cerrar el sobre"}
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BABY_BLUE_ASSETS.wave} alt="" className="w-52 h-auto mx-auto mt-5 opacity-80" />
            <p className="font-script text-4xl text-[#5B8DB8] mt-3">{data.titulo}</p>
            <p className="text-[10px] font-serif-roman tracking-[0.3em] uppercase text-[#22344A]/50 mt-1">{formalDateDisplay}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
