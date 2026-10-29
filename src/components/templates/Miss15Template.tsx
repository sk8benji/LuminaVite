"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, CheckCircle2, Sparkles, MessageCircle, Music, Play, Pause, SkipBack, SkipForward, CalendarPlus, Phone, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { InvitationData } from "../invitation/InvitationMobileView";
import { getMapEmbedUrl, getMapDirectionsUrl } from "@/lib/maps";
import { MISS15_ASSETS } from "@/lib/templates/miss15Assets";
import { parseTemplateConfig, Miss15Config } from "@/types/templateConfigs";

export default function Miss15Template({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const templateConfig = parseTemplateConfig<Miss15Config>(data.configPlantilla);
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
          colors: ["#B0703C", "#C9A24B", "#E8D5B5", "#FFFFFF"],
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

    if (iconType.includes("mass") || iconType.includes("church") || title.includes("misa") || title.includes("mass") || title.includes("ceremonia")) return MISS15_ASSETS.churchIcon;
    if (iconType.includes("entrance") || title.includes("entrada") || title.includes("entrance")) return MISS15_ASSETS.gownIllustration;
    if (iconType.includes("waltz") || iconType.includes("dance") || title.includes("vals") || title.includes("baile") || title.includes("waltz") || title.includes("dance")) return MISS15_ASSETS.coupleIcon;
    if (iconType.includes("dinner") || title.includes("cena") || title.includes("dinner")) return MISS15_ASSETS.dinnerIcon;
    if (iconType.includes("party") || iconType.includes("disco") || title.includes("fiesta") || title.includes("party")) return MISS15_ASSETS.discoIcon;

    const fallbackIcons = [
      MISS15_ASSETS.churchIcon,
      MISS15_ASSETS.gownIllustration,
      MISS15_ASSETS.coupleIcon,
      MISS15_ASSETS.dinnerIcon,
      MISS15_ASSETS.discoIcon,
    ];
    return fallbackIcons[idx % fallbackIcons.length];
  };

  const defaultMiss15Itinerary = isEn
    ? [
        { hora: "3:00 PM", titulo: "Mass", tipoIcono: "mass", descripcion: "St. Mary's Church, San Antonio, TX" },
        { hora: "4:30 PM", titulo: "Entrance", tipoIcono: "entrance", descripcion: "Grand Ballroom, San Antonio" },
        { hora: "5:00 PM", titulo: "Waltz", tipoIcono: "waltz" },
        { hora: "6:00 PM", titulo: "Dinner", tipoIcono: "dinner" },
        { hora: "8:00 PM", titulo: "Party", tipoIcono: "party" },
      ]
    : [
        { hora: "3:00 PM", titulo: "Misa", tipoIcono: "mass", descripcion: "St. Mary's Church, San Antonio, TX" },
        { hora: "4:30 PM", titulo: "Entrada", tipoIcono: "entrance", descripcion: "Grand Ballroom, San Antonio" },
        { hora: "5:00 PM", titulo: "Vals", tipoIcono: "waltz" },
        { hora: "6:00 PM", titulo: "Cena", tipoIcono: "dinner" },
        { hora: "8:00 PM", titulo: "Fiesta", tipoIcono: "party" },
      ];

  const rawItinerary =
    (Array.isArray(data.itinerario) && data.itinerario.length > 0)
      ? data.itinerario
      : (Array.isArray(data.itinerarioJson) && data.itinerarioJson.length > 0)
        ? data.itinerarioJson
        : defaultMiss15Itinerary;

  const itineraryList = rawItinerary.map((item: any, idx: number) => ({
    hora: item.hora || item.time || "",
    titulo: item.titulo || item.title || "",
    descripcion: item.descripcion || item.description || "",
    tipoIcono: (item.tipoIcono || item.tipo || "").toLowerCase(),
    icon: item.icon ? item.icon : getItineraryIcon(item, idx),
  }));

  // Corte de honor dinámico
  const corte = data.corteHonorJson || null;
  // ===== Miss 15: datos derivados =====
  const nombrePartes = (data.titulo || "").trim().split(/\s+/).filter(Boolean);
  const textoDe = (v: any): string => {
    if (!v) return "";
    if (typeof v === "string") return v;
    return v.mensaje || v.texto || v.descripcion || v.info || v.detalle || "";
  };
  const hospedajeTexto = textoDe(data.hospedajeJson);
  const chambelanHonor = (corte as any)?.chambelanHonor || "";
  const mensajeGratitud = corte?.mensajeGratitud || "";

  return (
    <div className="relative min-h-screen font-sans-body text-[#2B2118] antialiased selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden bg-gradient-to-b from-[#F9F2E4] via-[#F6EEE1] to-[#FCF7ED]">
      {/* Audio en bucle */}
      <audio ref={audioRef} loop preload="none" src={defaultAudio} />

      {/* Selector de idioma flotante (solo si la invitación es bilingüe) */}
      {isBilingual && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-black/35 backdrop-blur-md border border-white/30 rounded-full p-0.5 text-[9px] font-bold shadow-lg">
          <button
            onClick={() => setCurrentLang("en")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              isEn ? "bg-white text-[#8C5A2B] shadow-xs" : "text-white/80 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setCurrentLang("es")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              !isEn ? "bg-white text-[#8C5A2B] shadow-xs" : "text-white/80 hover:text-white"
            }`}
          >
            ES
          </button>
        </div>
      )}

      <main className="relative z-10">
        {/* ======================================================= */}
        {/* HERO: FOTO COLUMPIO + TARJETA + REPRODUCTOR             */}
        {/* ======================================================= */}
        <section className="relative text-center">
          <div className="relative h-[68vh] min-h-[440px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.fotoPortadaUrl} alt={data.titulo} className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#F6EEE1]" />
            <p className="absolute top-8 left-6 sm:left-10 font-script text-6xl sm:text-7xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] -rotate-6">
              mis 15
            </p>
          </div>

          <div className="px-5 -mt-24 relative z-10">
            <div className="max-w-md mx-auto bg-[#FDF9F0] rounded-[2rem] shadow-2xl border border-[#E3D3AC] px-7 py-8">
              <p className="font-serif-roman text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#2B2118] font-semibold">
                {isEn ? "Join us to celebrate" : "Acompáñanos a celebrar"}
              </p>
              <h1 className="font-script text-5xl sm:text-6xl text-[#8C5A2B] leading-tight mt-2">
                {nombrePartes[0]}
                {isEn ? "'s Quinceañera" : " — Mis Quince Años"}
              </h1>

              <div className="mt-5">
                <p className="font-serif-roman text-xs tracking-[0.5em] uppercase text-[#2B2118] font-bold">{eventMonth}</p>
                <div className="flex items-center justify-center gap-3 mt-1.5">
                  <span className="font-serif-roman text-xs tracking-[0.25em] uppercase font-semibold">{eventWeekday}</span>
                  <span className="w-8 h-px bg-[#B0703C]/70" />
                  <span className="font-serif-roman text-6xl font-bold text-[#B0703C] leading-none">{eventDay}</span>
                  <span className="w-8 h-px bg-[#B0703C]/70" />
                  <span className="font-serif-roman text-xs tracking-[0.25em] uppercase font-semibold">{eventTime}</span>
                </div>
                <p className="font-serif-roman text-sm tracking-[0.4em] text-[#2B2118] mt-1.5">{eventYear}</p>
              </div>

              <p className="font-serif-roman text-[11px] tracking-[0.2em] uppercase text-[#2B2118]/70 mt-4">
                {data.recepcionNombre} · {data.recepcionDireccion}
              </p>
              <a
                href={getMapDirectionsUrl(data.recepcionMapUrl || undefined, data.recepcionNombre + ", " + data.recepcionDireccion)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2B2118] text-[#F3E7CE] px-7 py-3 font-serif-roman text-[11px] tracking-[0.3em] uppercase font-bold shadow-lg hover:bg-[#8C5A2B] transition-colors"
              >
                <MapPin className="w-4 h-4" /> Google Maps
              </a>

              {/* Reproductor de música */}
              <div className="mt-6 flex items-center gap-2.5 bg-[#2B2118] rounded-full pl-1.5 pr-4 py-1.5 shadow-lg text-left">
                <button
                  type="button"
                  onClick={toggleMusic}
                  className="w-10 h-10 shrink-0 rounded-full bg-[#B0703C] text-white flex items-center justify-center hover:bg-[#8C5A2B] transition-colors cursor-pointer"
                  aria-label={isEn ? "Play my song" : "Reproducir mi canción"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-[#F3E7CE] text-xs font-serif-roman truncate">
                    {data.musicaTitulo || (isEn ? "My Song" : "Mi Canción")}
                  </p>
                  <div className="h-1 rounded-full bg-white/20 mt-1 overflow-hidden">
                    <div className={`h-full bg-[#C9A24B] rounded-full ${isPlaying ? "w-2/3" : "w-1/6"} transition-all duration-700`} />
                  </div>
                </div>
                <SkipBack className="w-4 h-4 text-[#F3E7CE]/50 shrink-0" />
                <SkipForward className="w-4 h-4 text-[#F3E7CE]/50 shrink-0" />
              </div>
            </div>

            <p className="font-serif-roman text-[6rem] sm:text-[8rem] leading-none font-bold text-[#B0703C]/15 select-none -mt-2">15</p>
          </div>
        </section>

        {/* ======================================================= */}
        {/* CORTE DE HONOR                                          */}
        {/* ======================================================= */}
        {corte && (
          <section className="px-6 py-10 text-center">
            <p className="font-script text-4xl text-[#8C5A2B] leading-none">{isEn ? "Our" : "Nuestra"}</p>
            <h3 className="font-script text-5xl sm:text-6xl text-[#2B2118] leading-tight">
              {isEn ? "Quince Court" : "Corte de Quince"}
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MISS15_ASSETS.crownDivider} alt="" className="w-52 h-14 object-contain mx-auto mt-1" />

            {data.fotoCierreUrl && (
              <div className="w-44 sm:w-52 mx-auto mt-5 rounded-t-[8rem] rounded-b-3xl overflow-hidden border-4 border-white shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.fotoCierreUrl} alt="" className="w-full h-auto object-cover" />
              </div>
            )}

            {corte.parents && (
              <div className="mt-7">
                <h5 className="font-serif-roman text-[11px] tracking-[0.3em] uppercase text-[#B0703C] font-bold">{isEn ? "Parents" : "Padres"}</h5>
                <p className="font-serif-roman text-base sm:text-lg tracking-[0.12em] uppercase mt-1">{corte.parents}</p>
              </div>
            )}

            {Array.isArray(corte.damas) && corte.damas.length > 0 && (
              <div className="mt-7 max-w-md mx-auto">
                <h5 className="font-serif-roman text-[11px] tracking-[0.3em] uppercase text-[#B0703C] font-bold">Damas</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5">
                  {corte.damas.map((n: string, i: number) => (
                    <p key={i} className="font-serif-roman text-xs sm:text-sm tracking-[0.12em] uppercase">{n}</p>
                  ))}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MISS15_ASSETS.damasPhoto} alt="Damas" className="w-56 sm:w-64 h-auto rounded-3xl shadow-lg border-4 border-white mx-auto mt-5" />
              </div>
            )}

            {chambelanHonor && (
              <div className="mt-8">
                <h5 className="font-serif-roman text-[11px] tracking-[0.3em] uppercase text-[#B0703C] font-bold">
                  {isEn ? "Chambelán de Honor" : "Chambelán de Honor"}
                </h5>
                <p className="font-serif-roman text-base sm:text-lg tracking-[0.12em] uppercase mt-1">{chambelanHonor}</p>
              </div>
            )}

            {Array.isArray(corte.chambelanes) && corte.chambelanes.length > 0 && (
              <div className="mt-7 max-w-md mx-auto">
                <h5 className="font-serif-roman text-[11px] tracking-[0.3em] uppercase text-[#B0703C] font-bold">Chambelanes</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5">
                  {corte.chambelanes.map((n: string, i: number) => (
                    <p key={i} className="font-serif-roman text-xs sm:text-sm tracking-[0.12em] uppercase">{n}</p>
                  ))}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MISS15_ASSETS.chambelanesPhoto} alt="Chambelanes" className="w-48 sm:w-56 h-auto rounded-3xl shadow-lg border-4 border-white mx-auto mt-5" />
              </div>
            )}
          </section>
        )}

        {/* ======================================================= */}
        {/* CUENTA REGRESIVA                                        */}
        {/* ======================================================= */}
        <section className="relative px-6 py-14 text-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.fotoActualUrl || MISS15_ASSETS.swingPhotoAlt} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#F6EEE1]/55" />
          <div className="relative">
            <h3 className="font-script text-5xl sm:text-6xl text-[#2B2118] leading-tight drop-shadow-sm">
              {isEn ? "I can't wait" : "No puedo esperar"}
            </h3>
            <p className="font-script text-4xl sm:text-5xl text-[#8C5A2B] leading-tight">
              {isEn ? "to celebrate with you!" : "¡para celebrar contigo!"}
            </p>
            <div className="flex items-stretch justify-center gap-2.5 sm:gap-3 mt-7">
              {[
                { v: timeLeft.days, l: isEn ? "Days" : "Días" },
                { v: timeLeft.hours, l: isEn ? "Hours" : "Horas" },
                { v: timeLeft.minutes, l: isEn ? "Minutes" : "Minutos" },
                { v: timeLeft.seconds, l: isEn ? "Seconds" : "Segundos" },
              ].map((u) => (
                <div key={u.l} className="w-16 sm:w-20 bg-[#FDF9F0]/95 rounded-2xl border border-[#E3D3AC] shadow-md py-3">
                  <p className="font-serif-roman text-2xl sm:text-3xl font-bold text-[#2B2118] leading-none">{u.v}</p>
                  <p className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#B0703C] font-bold mt-1.5">{u.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* PROGRAMA                                                */}
        {/* ======================================================= */}
        <section className="px-6 py-12 text-center">
          <h3 className="font-script text-5xl sm:text-6xl text-[#2B2118] leading-tight">Program</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MISS15_ASSETS.crown} alt="" className="w-14 h-auto mx-auto mt-1" />

          <div className="max-w-sm mx-auto mt-8 relative text-left">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-[#B0703C]/30" />
            <div className="space-y-7">
              {itineraryList.map((item: any, i: number) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-[#FDF9F0] border border-[#C9A24B]/60 shadow flex items-center justify-center overflow-hidden z-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.icon} alt="" className="w-9 h-9 object-contain" />
                    </div>
                    <div>
                      <p className="font-serif-roman text-xs tracking-[0.2em] text-[#B0703C] font-bold uppercase">{item.hora}</p>
                      <p className="font-serif-roman text-base sm:text-lg tracking-[0.1em] uppercase text-[#2B2118] font-semibold">{item.titulo}</p>
                      {item.descripcion && (
                        <p className="font-serif-roman text-[11px] tracking-[0.12em] uppercase text-[#2B2118]/65 mt-0.5">{item.descripcion}</p>
                      )}
                    </div>
                  </div>
                  {(item.tipoIcono === "mass" || item.tipoIcono === "entrance") && (
                    <div className="ml-[4.5rem] mt-2.5">
                      <a
                        href={getMapDirectionsUrl(
                          item.tipoIcono === "mass" ? data.ceremoniaMapUrl || undefined : data.recepcionMapUrl || undefined,
                          item.tipoIcono === "mass"
                            ? (data.ceremoniaNombre || "") + ", " + (data.ceremoniaDireccion || "")
                            : data.recepcionNombre + ", " + data.recepcionDireccion
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full border border-[#2B2118] px-5 py-1.5 font-serif-roman text-[10px] tracking-[0.25em] uppercase font-bold text-[#2B2118] hover:bg-[#2B2118] hover:text-[#F3E7CE] transition-colors"
                      >
                        {item.tipoIcono === "mass" ? (isEn ? "Mass venue" : "Lugar de la misa") : (isEn ? "Main venue" : "Lugar principal")}
                      </a>
                    </div>
                  )}
                  {i < itineraryList.length - 1 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={MISS15_ASSETS.heartsDivider} alt="" className="w-40 h-auto ml-[4.5rem] mt-4 opacity-70" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* DETALLES                                                */}
        {/* ======================================================= */}
        <section className="px-6 py-10 text-center">
          <h3 className="font-script text-5xl sm:text-6xl text-[#2B2118] leading-tight">Details</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MISS15_ASSETS.crown} alt="" className="w-14 h-auto mx-auto mt-1" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MISS15_ASSETS.gownIllustration} alt="" className="w-40 sm:w-48 h-auto mx-auto mt-3" />

          <div className="max-w-md mx-auto mt-6 space-y-9">
            <div>
              <h4 className="font-serif-roman text-sm tracking-[0.35em] uppercase text-[#B0703C] font-bold">
                {isEn ? "Dress Code" : "Código de Vestimenta"}
              </h4>
              <p className="text-sm text-[#2B2118]/85 leading-relaxed mt-2 font-serif-roman">
                {(isEn ? data.dressCodeNotaEn : data.dressCodeNota) ||
                  (isEn
                    ? "Elegant & Semi-Formal. Guests are encouraged to wear pastel or soft colors to match the theme."
                    : "Elegante y semiformal. Se invita a los invitados a usar colores pastel o suaves a tono con el tema.")}
              </p>
            </div>

            {data.mostrarMesaRegalos !== false && (
              <div>
                <h4 className="font-serif-roman text-sm tracking-[0.35em] uppercase text-[#B0703C] font-bold">
                  {isEn ? "Gifts" : "Regalos"}
                </h4>
                <p className="text-sm text-[#2B2118]/85 leading-relaxed mt-2 font-serif-roman">
                  {(isEn ? data.regalosMensajeEn : data.regalosMensaje) ||
                    (isEn
                      ? "Your presence is the best gift of all! But if you'd like to bring something, feel free to check the wishlist below."
                      : "¡Tu presencia es el mejor regalo! Pero si quieres traer algo, revisa la lista de deseos.")}
                </p>
                <a
                  href={data.wishlistUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full border border-[#2B2118] px-7 py-2.5 font-serif-roman text-[11px] tracking-[0.3em] uppercase font-bold text-[#2B2118] hover:bg-[#2B2118] hover:text-[#F3E7CE] transition-colors"
                >
                  Wishlist
                </a>
              </div>
            )}

            {hospedajeTexto && (
              <div>
                <h4 className="font-serif-roman text-sm tracking-[0.35em] uppercase text-[#B0703C] font-bold">
                  {isEn ? "Accommodation" : "Hospedaje"}
                </h4>
                <p className="text-sm text-[#2B2118]/85 leading-relaxed mt-2 font-serif-roman">{hospedajeTexto}</p>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================= */}
        {/* RSVP                                                    */}
        {/* ======================================================= */}
        <section className="px-6 pt-10 pb-2 text-center">
          <p className="font-script text-4xl text-[#8C5A2B] leading-none">please</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MISS15_ASSETS.crown} alt="" className="w-14 h-auto mx-auto mt-1.5" />
          <div className="relative inline-block mt-3">
            <span
              className="font-serif-roman font-bold text-[5rem] sm:text-[7rem] leading-none text-transparent select-none"
              style={{ WebkitTextStroke: "2.5px #2B2118" }}
            >
              RSVP
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MISS15_ASSETS.bow} alt="" className="absolute -right-7 sm:-right-9 top-1 w-12 sm:w-16 h-auto rotate-12" />
          </div>
          {data.fechaLimiteRsvp && (
            <p className="font-serif-roman text-lg sm:text-xl tracking-[0.3em] uppercase text-[#B0703C] font-bold mt-3">
              {isEn ? "By" : "Antes del"} {data.fechaLimiteRsvp}
            </p>
          )}
          <p className="font-serif-roman text-xs sm:text-sm tracking-[0.15em] uppercase text-[#2B2118]/75 mt-3 max-w-sm mx-auto leading-relaxed">
            {isEn
              ? "Don't miss the adventure! Please confirm and kindly let us know if you can make it."
              : "¡No te pierdas la aventura! Confirma y avísanos si puedes acompañarnos."}
          </p>
        </section>

{/* ======================================================= */}
        {/* SECCIÓN 10: CONFIRMACIÓN DE ASISTENCIA (RSVP)           */}
        {/* ======================================================= */}
        <section id="rsvp" className="px-4 py-6 z-20">
          <div className="relative w-full max-w-[390px] mx-auto -mb-9 z-20 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MISS15_ASSETS.goldSeal}
              alt="Sello RSVP"
              className="w-24 h-24 object-contain drop-shadow-xl"
            />
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 pt-10 rounded-3xl border border-[#D8B772]/60 shadow-xl text-center relative z-10">
            <h3 className="font-script text-4xl text-[#9A6A30] my-1">
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
                    ? "bg-amber-50 text-amber-800 border-amber-300 shadow-sm"
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
                  <h4 className="font-script text-3xl text-[#9A6A30]">
                    {isEn ? "See You There!" : "¡Te Esperamos!"}
                  </h4>
                </div>
                <div className="bg-[#FAF1DE] border border-amber-200 rounded-2xl p-4 text-xs font-serif-roman text-slate-700 leading-relaxed max-w-sm mx-auto shadow-xs">
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
                    className="w-full bg-[#FAF1DE] border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#9A6A30]"
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
                    className="w-full bg-[#FAF1DE] border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#9A6A30]"
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
                            className="accent-[#9A6A30]"
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
                  className="w-full bg-[#9A6A30] hover:bg-[#7A5525] text-white py-3.5 px-4 rounded-xl font-serif-roman text-xs uppercase tracking-widest transition shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
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
        {/* GRACIAS / SAVE THE DATE                                 */}
        {/* ======================================================= */}
        <section className="px-6 py-12 text-center">
          <h3 className="font-script text-5xl sm:text-6xl text-[#2B2118] leading-tight">Thank you</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MISS15_ASSETS.cloudCard} alt="" className="w-40 sm:w-48 h-auto mx-auto mt-4 rounded-2xl shadow-lg border-4 border-white -rotate-1" />

          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="font-script text-3xl text-[#8C5A2B] [writing-mode:vertical-rl] rotate-180 leading-none">
              save the date
            </span>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={MISS15_ASSETS.crown} alt="" className="w-12 h-auto mx-auto mb-1" />
              <p className="font-serif-roman text-3xl sm:text-4xl tracking-[0.15em] uppercase text-[#B0703C] font-bold">
                {eventMonth} {eventDay}
              </p>
              <p className="font-serif-roman text-xl tracking-[0.5em] text-[#B0703C] mt-0.5">{eventYear}</p>
            </div>
          </div>

          <p className="max-w-md mx-auto font-serif-roman text-xs sm:text-sm tracking-[0.12em] uppercase leading-loose text-[#2B2118]/85 mt-7">
            {mensajeGratitud ||
              (isEn
                ? "I can't wait to celebrate my quinceañera with you! Thank you so much for being part of this unforgettable moment. Your hugs, your love, and your smiles mean so much to me!"
                : "¡No puedo esperar para celebrar mis quince contigo! Gracias por ser parte de este momento inolvidable. ¡Tus abrazos, tu cariño y tus sonrisas significan muchísimo para mí!")}
          </p>
          <p className="font-script text-5xl text-[#8C5A2B] mt-5">{nombrePartes[0]}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MISS15_ASSETS.crownDivider} alt="" className="w-52 h-14 object-contain mx-auto mt-3" />
        </section>
      </main>
    </div>
  );
}
