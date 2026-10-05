"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, CheckCircle2, Sparkles, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { InvitationData } from "../invitation/InvitationMobileView";
import { getMapEmbedUrl, getMapDirectionsUrl } from "@/lib/maps";

export default function BlueButterflyTemplate({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  // Estado para la Intro 3D del Sobre
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isEnvelopeFading, setIsEnvelopeFading] = useState(false);
  const [isEnvelopeRemoved, setIsEnvelopeRemoved] = useState(false);
  const [isLetterOut, setIsLetterOut] = useState(false);

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
  } | null>(null);

  // Destinatario general de cortesía
  const [guestRecipient, setGuestRecipient] = useState("Familia & Amigos");

  // Idioma (es | en | bilingual)
  const isBilingual = data.idiomaDefault === "bilingual";
  const [currentLang, setCurrentLang] = useState<"es" | "en">(
    data.idiomaDefault === "en" ? "en" : "es"
  );
  const isEn = currentLang === "en";

  // Apertura del sobre 3D con selección de idioma
  const handleOpenEnvelope = (chosenLang?: "es" | "en") => {
    if (chosenLang) {
      setCurrentLang(chosenLang);
    }
    if (isEnvelopeOpen) return;
    setIsEnvelopeOpen(true);

    // Reproducir música tras el gesto táctil del usuario (desbloquea autoplay)
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }

    // Deslizar carta interna
    setTimeout(() => {
      setIsLetterOut(true);
    }, 280);

    // Fundido y remoción del overlay
    setTimeout(() => {
      setIsEnvelopeFading(true);
      setTimeout(() => {
        setIsEnvelopeRemoved(true);
      }, 700);
    }, 1400);
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

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventoId: data.id || `slug-${data.slug}`,
          slug: data.slug,
          nombreInvitado: guestName.trim(),
          telefono: guestPhone.trim() || undefined,
          asistira: true,
          pases: seatCount,
        }),
      });

      const resJson = await res.json();

      // Efecto festivo de confeti
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#2F5A84", "#D8B772", "#ABC7DE", "#FFFFFF"],
        });
      } catch {}

      const successMsg =
        resJson.message ||
        (isEn
          ? `Thank you, ${guestName}! Your RSVP for ${seatCount} guest(s) has been successfully confirmed. Details have been sent via SMS.`
          : `¡Gracias, ${guestName}! Tu confirmación para ${seatCount} ${
              seatCount === 1 ? "pase" : "pases"
            } ha sido registrada exitosamente. Te enviamos los detalles por SMS.`);

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
      return "/assets/template-butterfly/itinerario-welcome.png";
    }
    if (
      iconType.includes("church") ||
      iconType.includes("entrance") ||
      title.includes("misa") ||
      title.includes("ceremonia") ||
      title.includes("entrada") ||
      title.includes("entrance")
    ) {
      return "/assets/template-butterfly/itinerario-entrance.png";
    }
    if (
      iconType.includes("wine") ||
      iconType.includes("dinner") ||
      iconType.includes("food") ||
      title.includes("cena") ||
      title.includes("brindis") ||
      title.includes("dinner")
    ) {
      return "/assets/template-butterfly/itinerario-dinner.png";
    }
    if (
      iconType.includes("crown") ||
      iconType.includes("waltz") ||
      title.includes("vals") ||
      title.includes("waltz")
    ) {
      return "/assets/template-butterfly/itinerario-waltz.png";
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
      return "/assets/template-butterfly/itinerario-disco.png";
    }
    if (
      iconType.includes("cake") ||
      title.includes("pastel") ||
      title.includes("torta") ||
      title.includes("cake")
    ) {
      return "/assets/template-butterfly/itinerario-cake.png";
    }

    const fallbackIcons = [
      "/assets/template-butterfly/itinerario-welcome.png",
      "/assets/template-butterfly/itinerario-entrance.png",
      "/assets/template-butterfly/itinerario-dinner.png",
      "/assets/template-butterfly/itinerario-waltz.png",
      "/assets/template-butterfly/itinerario-disco.png",
      "/assets/template-butterfly/itinerario-cake.png",
    ];
    return fallbackIcons[idx % fallbackIcons.length];
  };

  const defaultButterflyItinerary = isEn
    ? [
        { hora: "3:00 PM", titulo: "Guest arrival", tipoIcono: "welcome" },
        { hora: "4:30 PM", titulo: "Grand entrance", tipoIcono: "entrance" },
        { hora: "5:00 - 6:30 PM", titulo: "Dinner", tipoIcono: "dinner" },
        { hora: "6:30 - 7:30 PM", titulo: "Waltz", tipoIcono: "waltz" },
        { hora: "7:30 - 12:00 AM", titulo: "Open Dance", tipoIcono: "disco" },
        { hora: "10:00 PM", titulo: "Cake cutting", tipoIcono: "cake" },
      ]
    : [
        { hora: "3:00 PM", titulo: "Recepción de Invitados", tipoIcono: "welcome" },
        { hora: "4:30 PM", titulo: "Entrada Triunfal", tipoIcono: "entrance" },
        { hora: "5:00 - 6:30 PM", titulo: "Cena de Gala", tipoIcono: "dinner" },
        { hora: "6:30 - 7:30 PM", titulo: "Vals Principal", tipoIcono: "waltz" },
        { hora: "7:30 - 12:00 AM", titulo: "Fiesta y Baile", tipoIcono: "disco" },
        { hora: "10:00 PM", titulo: "Corte del Pastel", tipoIcono: "cake" },
      ];

  const rawItinerary =
    (Array.isArray(data.itinerario) && data.itinerario.length > 0)
      ? data.itinerario
      : (Array.isArray(data.itinerarioJson) && data.itinerarioJson.length > 0)
        ? data.itinerarioJson
        : defaultButterflyItinerary;

  const itineraryList = rawItinerary.map((item: any, idx: number) => ({
    hora: item.hora || item.time || "",
    titulo: item.titulo || item.title || "",
    icon: item.icon ? item.icon : getItineraryIcon(item, idx),
  }));

  // Corte de honor dinámico
  const corte = data.corteHonorJson || null;

  return (
    <div className="relative min-h-screen font-sans-body text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* 1. Fondo General Acuarela Contenido en el Viewport/Simulador */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/template-butterfly/fondo-cielo-acuarela.jpg"
        alt="Fondo Acuarela"
        className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none"
      />

      {/* Audio en bucle */}
      <audio ref={audioRef} loop preload="none" src={defaultAudio} />

      {/* ========================================================= */}
      {/* INTRO 3D REAL: SOBRE CON SELLO DE CERA Y MARIPOSA CON ALETEO 3D */}
      {/* ========================================================= */}
      {!skipIntro && !isEnvelopeRemoved && (
        <aside
          id="envelopeOverlay"
          onClick={() => handleOpenEnvelope()}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 transition-opacity duration-700 select-none bg-[#EBF3FA] bg-[url('/assets/template-butterfly/fondo-cielo-acuarela.png')] bg-cover bg-center ${
            isEnvelopeFading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Título Superior Cursivo */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="font-script text-5xl sm:text-6xl md:text-7xl text-[#6B9AC4] drop-shadow-sm font-normal">
              You&apos;ve been invited
            </h2>
            {guestRecipient && guestRecipient !== "Familia & Amigos" && (
              <p className="text-sm mt-1 text-[#7A9BBF] font-serif-roman italic tracking-wider">
                {guestRecipient}
              </p>
            )}
          </div>

          {/* Contenedor del Sobre Físico 3D */}
          <div
            id="envelopeContainer"
            className="relative w-[310px] sm:w-[410px] md:w-[460px] aspect-[5/4] cursor-pointer group"
            style={{ perspective: "1000px" }}
          >
            {/* Tarjeta interior que sale deslizándose con borde dorado */}
            <div
              id="innerCard"
              className={`absolute left-4 right-4 top-4 bottom-4 bg-[#FFFEFC] rounded-xl p-5 shadow-lg flex flex-col items-center justify-center text-center transform transition-transform duration-700 ease-out border border-[#D8B772]/60 ${
                isLetterOut
                  ? "-translate-y-28 sm:-translate-y-36 scale-105 z-25 shadow-2xl"
                  : "z-10 translate-y-0"
              }`}
            >
              {/* Mariposa con aleteo 3D en la tarjeta */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/template-butterfly/mariposa-azul.png"
                alt="Mariposa"
                className="w-10 h-auto object-contain animate-flutter mb-1"
              />
              <p className="font-serif-roman text-[10px] tracking-[0.25em] uppercase text-[#C5A059]">
                My Quinceañera
              </p>
              <h3 className="font-script text-4xl text-[#2F5A84] my-0.5">
                {data.titulo}
              </h3>
              <p className="text-[10px] text-slate-500 font-serif-roman tracking-wider uppercase">
                {formalDateDisplay}
              </p>
            </div>

            {/* Si está cerrado: Sobre beige con sello celeste y mariposa perchada aleteando */}
            {!isEnvelopeOpen ? (
              <div className="absolute inset-0 z-20 pointer-events-none drop-shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/template-butterfly/sobre-cerrado.png"
                  alt="Sobre Cerrado"
                  className="w-full h-full object-contain"
                />

                {/* Mariposa aleteando en 3D perchada en la esquina inferior izquierda (como en la foto de referencia) */}
                <div className="absolute -bottom-3 -left-4 sm:-bottom-4 sm:-left-6 z-30 pointer-events-none rotate-[22deg] drop-shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/template-butterfly/mariposa-perchada.png"
                    alt="Mariposa viva"
                    className="w-16 sm:w-20 md:w-24 h-auto object-contain animate-flutter"
                  />
                </div>
              </div>
            ) : (
              /* Si está abierto: Solapa abierta con rosas y flores base */
              <div className="absolute inset-0 z-20 pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/template-butterfly/sobre-carta-base.png"
                  alt="Bolsillo del sobre"
                  className="absolute inset-0 w-full h-full object-contain z-30"
                />
              </div>
            )}
          </div>

          {/* Botones de Selección de Idioma con Marco Ornamental de la Foto */}
          {isBilingual ? (
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-5 z-30">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenEnvelope("en");
                }}
                className="relative inline-flex items-center justify-center w-36 sm:w-44 h-14 sm:h-16 group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/template-butterfly/boton-idioma-marco.png"
                  alt="English"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm group-hover:drop-shadow-md transition-all"
                />
                <span className="relative z-10 font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase text-[#7A9BBF] font-semibold pt-0.5">
                  ENGLISH
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenEnvelope("es");
                }}
                className="relative inline-flex items-center justify-center w-36 sm:w-44 h-14 sm:h-16 group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/template-butterfly/boton-idioma-marco.png"
                  alt="Español"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm group-hover:drop-shadow-md transition-all"
                />
                <span className="relative z-10 font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase text-[#7A9BBF] font-semibold pt-0.5">
                  ESPAÑOL
                </span>
              </button>
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 flex items-center justify-center z-30">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenEnvelope(isEn ? "en" : "es");
                }}
                className="relative inline-flex items-center justify-center w-40 sm:w-48 h-14 sm:h-16 group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/template-butterfly/boton-idioma-marco.png"
                  alt={isEn ? "English" : "Español"}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm group-hover:drop-shadow-md transition-all"
                />
                <span className="relative z-10 font-serif-roman text-xs sm:text-sm tracking-[0.25em] uppercase text-[#7A9BBF] font-semibold pt-0.5">
                  {isEn ? "ENGLISH" : "ESPAÑOL"}
                </span>
              </button>
            </div>
          )}
        </aside>
      )}

      {/* Floating Language Switcher Pill (solo si el evento es bilingüe) */}
      {isBilingual && (
        <aside
          aria-label="Selector de idioma"
          className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-md border border-[#D8B772]/60 rounded-full shadow-lg p-1 flex items-center gap-1 text-[11px] font-serif-roman tracking-wider"
        >
          <button
            type="button"
            onClick={() => setCurrentLang("es")}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold ${
              currentLang === "es"
                ? "bg-[#2F5A84] text-white shadow-sm"
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
                ? "bg-[#2F5A84] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            EN
          </button>
        </aside>
      )}

      {/* ========================================================= */}
      {/* CONTENEDOR PRINCIPAL FIJO: BLUE BUTTERFLY GARDEN (9:16)   */}
      {/* ========================================================= */}
      <main className="w-full max-w-[430px] mx-auto relative min-h-screen shadow-2xl flex flex-col pb-16 overflow-hidden">
        {/* Mariposas flotantes en CSS de fondo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-75">
          <div className="absolute top-28 left-4 w-7 animate-float">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/mariposa-azul.png"
              alt="Mariposa flotante"
              className="w-full h-auto animate-flutter"
            />
          </div>
          <div
            className="absolute top-80 right-4 w-6 animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/mariposa-azul.png"
              alt="Mariposa flotante"
              className="w-full h-auto animate-flutter"
            />
          </div>
          <div
            className="absolute top-[800px] left-6 w-6 animate-float"
            style={{ animationDelay: "2.5s" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/mariposa-azul.png"
              alt="Mariposa flotante"
              className="w-full h-auto animate-flutter"
            />
          </div>
          <div
            className="absolute top-[1600px] right-6 w-8 animate-float"
            style={{ animationDelay: "0.8s" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/mariposa-azul.png"
              alt="Mariposa flotante"
              className="w-full h-auto animate-flutter"
            />
          </div>
        </div>


        {/* ======================================================== */}
        {/* DEFINICIÓN DEL CLIPPATH VECTORIAL EXACTO DE CANVA        */}
        {/* ======================================================== */}
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="canvaTornClip" clipPathUnits="objectBoundingBox" transform="scale(0.0019959, 0.0020833)">
              <path d="M501.0220410706303,424.5189393939394C500.7539714927434,304.57260101010104 497.5371365581005,142.41729797979798 497.5371365581005,22.77462121212121C497.5371365581005,20.952651515151516 497.80520613598736,19.130681818181817 497.80520613598736,17.612373737373733C497.5371365581005,17.30871212121212 497.26906698021355,17.30871212121212 497.0009974023266,17.0050505050505C497.0009974023266,17.0050505050505 496.7329278244397,17.308712121212118 496.7329278244397,17.612373737373733C496.19678866866593,19.130681818181817 495.12451035711825,19.130681818181817 494.05223204557063,19.130681818181817C492.7118841561361,18.8270202020202 491.3715362667016,17.30871212121212 489.7631187993801,17.916035353535353C489.22697964360634,18.219696969696965 488.1547013320587,17.612373737373733 487.8866317541718,17.0050505050505C487.08242302051104,15.790404040404038 486.0101447089635,15.790404040404038 484.9378663974158,16.39772727272727C484.401727241642,16.701388888888886 483.8655880858682,16.39772727272727 483.32944893009443,16.39772727272727C482.52524019643363,16.39772727272727 481.4529618848861,16.094065656565657 480.6487531512253,15.790404040404038C480.38068357333844,15.790404040404038 479.8445444175646,15.486742424242422 479.5764748396777,15.486742424242422C478.7722661060169,15.183080808080808 477.96805737235627,14.272095959595957 477.1638486386955,15.486742424242422C477.1638486386955,15.486742424242422 476.6277094829217,15.486742424242422 476.3596399050347,15.183080808080808C476.09157032714785,14.575757575757574 475.823500749261,13.664772727272727 475.555431171374,13.057449494949493C475.0192920156002,12.146464646464645 475.0192920156002,10.628156565656566 474.2150832819394,10.020833333333332C473.6789441261657,9.717171717171714 473.41087454827874,9.413510101010099 473.1428049703918,8.806186868686867C473.1428049703918,8.50252525252525 472.606665814618,8.198863636363635 472.606665814618,7.895202020202021L471.80245708095725,6.984217171717173C471.5343875030704,6.3768939393939394 471.26631792518344,5.465909090909092 470.7301787694096,5.162247474747475C469.657900457862,4.251262626262626 469.3898308799751,3.036616161616162 469.9259700357489,1.5183080808080813C469.12176130208815,1.2146464646464652 468.58562214631434,0.6073232323232329 467.7814134126536,0.6073232323232329C464.5645784780107,0.9109848484848492 461.0796739654809,1.5183080808080813 457.862839030838,1.8219696969696977C457.32669987506426,1.8219696969696977 456.52249114140346,2.125631313131314 456.2544215635166,2.42929292929293C454.1098649404213,3.947601010101011 451.9653083173261,2.7329545454545463 449.82075169423075,2.42929292929293C448.2123342269094,2.42929292929293 446.60391675958795,1.5183080808080813 444.99549929226646,1.2146464646464652C443.11901224705815,0.9109848484848492 441.5105947797366,1.2146464646464652 439.6341077345283,0.9109848484848492C439.3660381566414,0.9109848484848492 439.0979685787545,0.607323232323233 438.82989900086756,0.30366161616161697C438.29375984509375,-0.20031665534929477 437.22148153354607,-0.10015832767464738 436.6853423777722,0C435.8811336441115,0.607323232323233 435.6130640662246,1.5183080808080813 435.0769249104508,2.42929292929293C433.7365770210162,2.7329545454545463 431.8600899758079,3.036616161616162 430.5197420863734,3.947601010101011C429.44746377482574,4.554924242424243 428.911324619052,4.858585858585859 428.1071158853912,4.251262626262627L427.83904630750436,4.554924242424244C428.3751854632781,5.162247474747476 428.64325504116505,6.073232323232324 429.17939419693886,6.680555555555556C428.3751854632781,6.984217171717173 427.30290715173055,7.591540404040404 426.7667679959567,7.287878787878788C425.42642010652213,6.984217171717173 424.8902809507484,7.591540404040405 423.8180026392007,8.198863636363637C422.7457243276531,9.109848484848484 421.4053764382185,9.717171717171716 420.3330981266709,10.32449494949495C420.06502854878397,10.32449494949495 419.7969589708971,10.32449494949495 419.5288893930101,10.020833333333334C419.2608198151232,10.020833333333334 418.99275023723635,9.717171717171716 418.99275023723635,9.717171717171716C417.6524023478018,10.32449494949495 416.31205445836724,10.931818181818182 414.97170656893275,10.32449494949495C414.70363699104587,10.32449494949495 414.70363699104587,10.628156565656568 414.43556741315894,10.628156565656568C412.82714994583756,11.2354797979798 411.7548716342899,13.361111111111112 409.6103150111946,13.361111111111112C408.00189754387316,13.361111111111112 406.3934800765517,14.879419191919194 404.78506260923024,14.879419191919194C402.9085755640219,15.183080808080808 401.3001580967004,15.790404040404042 399.69174062937896,16.70138888888889C399.15560147360515,17.0050505050505 398.61946231783133,17.0050505050505 398.3513927399444,17.0050505050505C397.0110448505099,16.39772727272727 396.20683611684916,17.308712121212118 395.67069696107535,18.21969696969697C394.33034907164085,20.345328282828284 392.1857924485455,20.952651515151516 390.3093054033372,21.559974747474747C387.896679202355,22.16729797979798 385.4840530013728,22.47095959595959 383.0714268003907,22.77462121212121C382.80335722250385,22.77462121212121 382.5352876446169,23.68560606060606 381.9991484888431,23.989267676767675C381.73107891095617,23.989267676767675 381.4630093330693,23.685606060606062 381.4630093330693,23.685606060606062C380.1226614436348,25.507575757575758 379.318452709974,28.240530303030305 376.63775693110495,27.936868686868692L376.369687353218,27.936868686868692C374.2251307301227,29.455176767676768 372.08057410702753,28.84785353535354 370.20408706181917,28.240530303030305C369.66794790604536,28.240530303030305 368.86373917238456,27.633207070707073 368.5956695944977,27.025883838383837C367.791460860837,25.203914141414142 365.6469042377417,24.59659090909091 364.0384867704203,25.203914141414142C362.69813888098577,25.81123737373737 361.3577909915512,26.114898989898993 360.01744310211666,26.722222222222225C357.8728864790214,27.329545454545453 355.9963994338131,27.633207070707073 353.85184281071776,26.41856060606061C351.7072861876225,25.203914141414142 350.0988687203011,26.114898989898993 349.0265904087534,28.84785353535354C348.22238167509266,30.669823232323235 346.0778250519974,30.973484848484848 344.73747716256287,29.455176767676768C343.9332684289022,28.54419191919192 343.39712927312837,28.84785353535354 342.5929205394677,29.455176767676768L340.9845030721462,31.277146464646464C340.7164334942593,31.580808080808083 340.1802943384855,31.580808080808083 339.9122247605986,31.580808080808083L338.30380729327715,31.580808080808083C337.23152898172947,31.580808080808083 336.15925067018185,31.277146464646464 335.0869723586343,30.973484848484848C333.7466244691997,30.669823232323235 332.67434615765205,29.758838383838388 331.33399826821756,29.455176767676768C329.18944164512226,29.151515151515152 328.65330248934845,27.025883838383837 327.84909375568776,25.507575757575758C327.3129545999139,24.59659090909091 326.2406762883663,23.381944444444443 325.1683979768187,23.685606060606062C324.09611966527103,24.29292929292929 323.0238413537234,23.685606060606062 322.2196326200627,23.381944444444446C321.9515630421758,23.381944444444446 321.415423886402,23.078282828282834 321.14735430851505,23.078282828282834C319.2708672633067,22.4709595959596 317.93051937387213,23.685606060606066 316.59017148443763,25.203914141414142L315.51789317288996,26.41856060606061C315.2498235950031,26.722222222222225 315.2498235950031,27.329545454545457 314.98175401711615,27.633207070707073C313.37333654979466,29.151515151515152 311.7649190824732,28.544191919191924 309.88843203726486,27.633207070707073C308.28001456994343,26.722222222222225 306.40352752473507,27.633207070707073 305.86738836896126,29.455176767676768C305.5993187910744,30.669823232323235 305.3312492131874,31.580808080808083 303.9909013237529,32.18813131313132C302.65055343431834,33.099116161616166 301.04213596699697,33.7064393939394 300.77406638911,35.83207070707071C300.77406638911,36.135732323232325 300.50599681122316,36.43939393939394 300.23792723333617,36.43939393939394C299.4337184996755,36.74305555555556 298.89757934390167,37.04671717171717 298.0933706102409,37.35037878787879L295.68074440925875,37.35037878787879C294.0723269419373,37.04671717171718 292.4639094746159,36.43939393939394 290.8554920072944,36.135732323232325C288.97900496208604,35.83207070707071 287.3705874947646,37.04671717171718 285.49410044955624,37.35037878787879L285.22603087166937,37.6540404040404C284.68989171589556,38.56502525252525 283.88568298223487,38.26136363636363 283.349543826461,37.6540404040404C282.2772655149134,36.43939393939394 280.400778469705,36.135732323232325 279.0604305802705,36.74305555555556C277.4520131129491,37.6540404040404 275.8435956456276,38.26136363636363 274.23517817830617,38.86868686868686C273.69903902253236,38.86868686868686 273.1628998667585,38.565025252525245 272.8948302888717,38.565025252525245C272.3586911330978,38.565025252525245 271.5544823994371,38.26136363636363 271.2864128215502,38.565025252525245C269.14185619845495,40.38699494949495 266.9972995753597,39.779671717171716 265.12081253015134,38.565025252525245C264.0485342186037,37.957702020202014 262.4401167512823,37.35037878787878 261.9039775955084,35.528409090909086C261.63590801762155,34.31376262626262 260.5636297060739,33.09911616161616 259.75942097241324,32.188131313131315C258.4190730829786,30.66982323232323 257.0787251935441,28.54419191919192 254.66609899256193,28.54419191919192C254.12995983678812,28.54419191919192 253.59382068101428,27.329545454545453 253.32575110312737,27.633207070707066C252.25347279157975,27.936868686868685 252.25347279157975,27.329545454545453 251.71733363580597,26.722222222222218C251.1811944800322,26.114898989898983 250.37698574637142,25.50757575757575 249.8408465905976,24.59659090909091C249.0366378569369,23.381944444444443 248.23242912327618,21.86363636363636 247.4282203896154,20.648989898989896C246.6240116559547,19.434343434343432 246.08787250018088,17.916035353535353 245.28366376652016,16.70138888888889C245.0155941886333,16.397727272727273 244.21138545497251,16.094065656565657 243.94331587708564,16.397727272727273L240.72648094244275,18.21969696969697C240.1903417866689,18.523358585858585 239.922272208782,19.130681818181817 239.65420263089507,19.738005050505052L239.3861330530082,19.434343434343432C239.65420263089507,18.52335858585859 239.922272208782,17.612373737373737 240.1903417866689,17.30871212121212L236.97350685202602,16.397727272727273C236.1692981183653,16.09406565656566 234.82895022893078,16.09406565656566 234.29281107315694,16.09406565656566L230.00369782696643,16.09406565656566C228.395280359645,16.09406565656566 227.05493247021045,15.790404040404043 225.446515002889,16.09406565656566C224.37423669134137,16.397727272727273 223.57002795768062,15.790404040404043 222.7658192240199,15.18308080808081C220.62126260092467,13.361111111111114 218.47670597782943,11.2354797979798 215.5279406210734,12.146464646464649C215.2598710431865,12.146464646464649 214.72373188741267,11.842803030303033 214.45566230952576,11.539141414141417C213.65145357586505,11.2354797979798 213.1153144200912,10.62815656565657 212.0430361085436,10.020833333333336C212.0430361085436,10.931818181818183 212.0430361085436,11.2354797979798 212.31110568643047,11.842803030303033C211.77496653065666,12.450126262626265 211.50689695276975,12.146464646464649 211.23882737488282,11.842803030303033C210.9707577969959,12.146464646464649 210.70268821910898,12.75378787878788 210.43461864122213,12.75378787878788C209.09427075178758,13.361111111111114 207.75392286235302,13.664772727272728 206.4135749729185,14.272095959595962C205.8774358171447,14.575757575757576 205.34129666137085,14.879419191919196 205.07322708348394,15.18308080808081C204.00094877193632,16.09406565656566 203.1967400382756,17.612373737373737 201.32025299306724,17.30871212121212C201.05218341518034,17.30871212121212 200.5160442594065,17.916035353535356 199.97990510363272,17.916035353535356C199.44376594785888,18.219696969696972 198.63955721419816,18.219696969696972 198.10341805842435,18.52335858585859L197.56727890265051,18.52335858585859C195.95886143532908,19.13068181818182 194.61851354589453,19.738005050505055 193.01009607857307,20.04166666666667L191.9378177670254,20.04166666666667C190.5974698775909,20.04166666666667 189.52519156604325,19.738005050505055 188.1848436766087,19.738005050505055C186.84449578717417,19.738005050505055 185.50414789773964,20.345328282828287 184.1638000083051,20.345328282828287C182.55538254098366,20.345328282828287 180.6788954957753,20.345328282828287 179.33854760634077,19.13068181818182C179.07047802845386,18.827020202020208 178.26626929479312,18.827020202020208 177.73013013901934,19.13068181818182C175.853643093811,19.434343434343436 173.9771560486026,19.738005050505055 172.36873858128118,20.345328282828287C170.76032111395975,20.95265151515152 169.956112380299,20.345328282828287 169.4199732245252,18.827020202020208C169.1519036466383,18.219696969696976 168.61576449086448,17.61237373737374 168.07962533509064,17.005050505050512C167.27541660142995,16.39772727272728 166.4712078677692,15.48674242424243 165.66699913410852,15.48674242424243C163.79051208890013,15.48674242424243 162.7182337773525,14.272095959595966 161.37788588791798,13.361111111111118C159.23332926482271,11.842803030303036 157.35684221961438,10.02083333333334 154.67614644074527,10.324494949494955L154.67614644074527,8.806186868686874C155.2122855965191,8.806186868686874 155.7484247522929,8.806186868686874 156.28456390806673,8.502525252525258C155.48035517440601,7.895202020202026 155.48035517440601,6.984217171717178 154.9442160186322,6.376893939393946C153.87193770708456,5.465909090909098 152.79965939553693,5.162247474747482 151.7273810839893,4.554924242424249C150.9231723503286,4.2512626262626325 149.85089403878092,4.2512626262626325 150.38703319455476,5.769570707070714C149.04668530512023,6.07323232323233 147.9744069935726,6.07323232323233 147.43826783779878,6.680555555555562C146.36598952625116,7.591540404040409 145.29371121470354,6.984217171717178 144.4895024810428,6.376893939393945C143.95336332526895,6.073232323232328 143.41722416949514,5.769570707070713 142.88108501372133,6.073232323232328C139.6642500790784,7.895202020202026 136.44741514443555,6.984217171717177 133.23058020979263,6.984217171717177C132.69444105401885,6.984217171717177 132.15830189824504,6.68055555555556 131.35409316458427,6.68055555555556C130.28181485303668,6.376893939393943 129.47760611937593,5.769570707070711 128.40532780782831,5.465909090909095C127.33304949628068,5.162247474747479 125.99270160684614,4.858585858585863 124.92042329529852,4.5549242424242475L124.1162145616378,4.5549242424242475C122.23972751642944,4.5549242424242475 120.3632404712211,4.858585858585863 118.75482300389965,4.858585858585863C117.41447511446512,4.858585858585863 116.07412722503058,4.251262626262631 114.46570975770912,3.947601010101015C114.19764017982222,1.5183080808080853 112.05308355672696,2.125631313131318 110.71273566729242,0.9109848484848533C110.4446660894055,0.6073232323232371 109.9085269336317,0.9109848484848533 109.6404573557448,0.9109848484848533C108.03203988842336,0.6073232323232371 106.95976157687572,1.5183080808080853 106.4236224211019,3.036616161616166C105.61941368744118,4.5549242424242475 103.47485706434591,5.162247474747479 104.27906579800664,7.591540404040409C104.54713537589356,7.895202020202026 105.08327453166737,8.198863636363642 105.35134410955426,8.806186868686872C105.35134410955426,9.71717171717172 105.08327453166737,10.324494949494953 104.27906579800664,10.020833333333337C104.01099622011974,10.020833333333337 103.74292664223282,10.628156565656571 103.47485706434593,10.931818181818185C103.20678748645905,11.2354797979798 103.20678748645902,11.842803030303033 102.93871790857212,11.842803030303033C101.33030044125066,12.450126262626267 100.25802212970302,13.968434343434348 98.38153508449467,13.664772727272728L97.84539592872085,13.664772727272728C96.23697846139939,15.18308080808081 94.62856099407794,14.879419191919196 92.75207394886961,14.575757575757576C91.94786521520889,14.272095959595962 90.87558690366126,14.575757575757576 89.80330859211362,14.575757575757576C88.9990998584529,14.575757575757576 88.19489112479216,14.575757575757576 87.39068239113145,13.968434343434346C86.31840407958383,13.361111111111112 85.2461257680362,12.450126262626265 84.17384745648856,11.842803030303031C83.10156914494094,11.235479797979798 81.76122125550641,11.235479797979798 81.76122125550641,9.109848484848486C81.76122125550641,8.806186868686869 81.22508209973259,8.502525252525253 81.22508209973259,8.198863636363638C79.34859505452424,10.020833333333336 77.7401775872028,11.539141414141417 76.13176011988135,13.057449494949497C75.32755138622062,13.968434343434346 74.255273074673,15.18308080808081 74.79141223044681,16.701388888888893C74.79141223044681,17.005050505050505 74.5233426525599,17.30871212121212 74.5233426525599,17.612373737373737C74.25527307467298,18.219696969696972 73.98720349678608,18.827020202020204 73.45106434101228,19.13068181818182C72.91492518523846,20.041666666666668 72.37878602946465,20.952651515151516 71.84264687369082,22.16729797979798L70.23422940636938,23.989267676767675C69.69809025059556,24.90025252525253 69.16195109482175,25.81123737373737 68.35774236116103,26.41856060606061C66.48125531595268,28.240530303030305 64.60476827074432,30.0625 62.46021164764906,31.884469696969703C61.38793333610143,33.099116161616166 60.04758544666689,34.01010101010101 58.97530713511926,35.224747474747474C57.09882008991091,37.04671717171718 54.95426346681565,38.56502525252525 53.88198515526802,41.2979797979798C53.88198515526802,41.60164141414141 53.3458459994942,41.90530303030303 53.0777764216073,42.20896464646465C51.73742853217276,43.42361111111112 49.59287190907749,43.42361111111112 49.59287190907749,45.85290404040405C47.44831528598223,45.85290404040405 46.376036974434605,47.67487373737374 45.30375866288697,49.19318181818183C44.49954992922624,50.407828282828284 43.69534119556552,51.92613636363636 42.62306288401789,52.83712121212122C41.550784572470256,53.44444444444445 40.210436683035724,53.14078282828284 38.870088793601184,53.14078282828284C38.333949637827374,53.14078282828284 37.797810482053556,53.14078282828284 37.797810482053556,53.44444444444446C36.72553217050592,54.659090909090914 35.38518428107138,55.570075757575765 34.58097554741067,57.08838383838385C33.77676681374995,58.606691919191924 32.97255808008922,59.51767676767678 31.632210190654682,59.821338383838395C30.291862301220146,60.125 28.951514411785606,61.64330808080809 27.075027366577253,60.73232323232324C25.46660989925581,60.125 23.590122854047454,60.73232323232324 22.517844542499827,59.51767676767678C20.373287919404568,59.8213383838384 18.76487045208312,60.428661616161634 16.88838340687477,60.73232323232324C14.743826783779511,61.33964646464647 12.331200582797342,61.03598484848486 10.454713537588988,62.857954545454554C8.846296070267542,64.37626262626264 7.505948180833005,65.89457070707071 5.0933219798508365,65.5909090909091C5.361391557737744,67.4128787878788 5.629461135624653,68.93118686868686 5.89753071351156,70.75315656565655C6.433669869285374,75.61174242424242 6.969809025059189,80.47032828282828 7.237878602946097,85.32891414141415C8.042087336606818,91.40214646464648 8.310156914493726,97.17171717171716 7.774017758719912,102.94128787878786C7.237878602946097,111.14015151515152 4.825252401963929,391.7234848484848 2.412626200981761,399.31502525252523L0,405.69191919191917C-0.20031665534929477,407.2102272727272 0.26806957788650015,408.1212121212121 1.608417467321038,408.4248737373737C3.216834934642483,408.72853535353534 3.7529740904162985,409.9431818181818 4.289113246190114,411.4614898989899C4.825252401963929,413.89078282828285 4.021043668303206,416.3200757575757 5.0933219798508365,418.74936868686865C5.629461135624653,419.9640151515151 5.0933219798508365,422.0896464646464 4.825252401963929,423.91161616161617C4.557182824077022,426.3409090909091 5.0933219798508365,428.77020202020196 5.89753071351156,430.89583333333337C7.7740177587199115,434.5397727272727 8.04208733660682,438.79103535353534 8.04208733660682,442.7386363636364C8.04208733660682,443.6496212121213 8.310156914493728,444.56060606060606 8.578226492380635,445.16792929292933C9.114365648154452,445.77525252525254 10.186643959702083,446.3825757575758 11.25892227124971,446.6862373737374L17.692592140535492,450.33017676767673C20.641357497291477,452.1521464646465 23.053983698273644,451.8484848484849 25.734679477142723,449.7228535353536C26.00274905502963,449.41919191919203 26.80695778869035,449.11553030303037 27.07502736657726,449.11553030303037C28.95151441178561,449.41919191919203 30.82800145699397,449.41919191919203 32.43641892431541,451.24116161616166C34.31290596952376,453.06313131313135 36.993601748392834,454.2777777777778 39.1381583714881,455.7960858585859C40.478506260922636,456.7070707070708 42.08692372824408,457.9217171717172 42.89113246190481,459.1363636363637C43.42727161767863,459.74368686868684 43.96341077345244,460.35101010101016 44.49954992922625,460.6546717171717C47.44831528598224,461.8693181818182 49.05673275330368,464.9059343434344 50.933219798512035,467.33522727272725C52.54163726583348,469.46085858585855 54.68619388892873,470.675505050505 57.09882008991091,470.97916666666663C59.77951586877998,471.58648989898984 62.46021164764906,471.8901515151515 65.14090742651814,472.4974747474747C66.21318573806576,472.8011363636363 67.5535336275003,473.1047979797979 68.62581193904792,473.7121212121212C69.96615982848247,474.3194444444444 71.30650771791701,474.3194444444444 72.37878602946464,475.2304292929293C73.98720349678608,476.74873737373736 75.59562096410752,477.65972222222223 77.7401775872028,477.0523989898989C78.54438632086352,476.74873737373736 79.61666463241114,477.35606060606057 80.42087336607186,477.6597222222222C80.68894294395878,477.6597222222222 80.95701252184567,477.9633838383837 81.22508209973259,477.9633838383837C84.17384745648857,478.2670454545453 86.85454323535765,477.6597222222222 89.53523901422673,477.05239898989885C90.60751732577435,476.74873737373724 91.67979563732199,476.4450757575757 92.75207394886964,475.83775252525237C95.70083930562562,474.3194444444443 98.6496046623816,472.80113636363626 101.33030044125067,470.9791666666665C103.20678748645905,469.76452020202004 105.08327453166739,468.54987373737356 107.22783115476265,469.76452020202004L108.30010946631027,469.76452020202004C110.17659651151864,469.76452020202004 112.05308355672699,469.4608585858585 113.66150102404842,469.1571969696969C113.92957060193534,469.1571969696969 114.46570975770913,469.1571969696969 114.46570975770913,468.8535353535352C115.26991849136986,467.63888888888874 116.61026638080439,467.63888888888874 117.95061427023893,467.3352272727272C120.09517089333418,467.0315656565656 122.23972751642947,467.0315656565656 123.84814498375091,465.51325757575745C125.45656245107236,464.298611111111 127.0649799183938,463.9949494949494 128.94146696360215,463.6912878787878C129.20953654148906,463.6912878787878 129.74567569726287,463.38762626262627 130.01374527514977,463.38762626262627C131.3540931645843,463.0839646464646 132.69444105401885,462.1729797979798 133.76671936556647,462.47664141414134C136.17934556654865,463.0839646464645 137.2516238780963,462.1729797979798 138.86004134541773,459.7436868686868C139.12811092330463,459.13636363636357 139.93231965696535,458.8327020202019 140.46845881273916,458.52904040404024C141.8088067021737,458.2253787878787 143.14915459160827,458.52904040404024 144.4895024810428,458.2253787878787C145.2937112147035,458.2253787878787 146.09791994836422,457.31439393939377 146.63405910413803,457.31439393939377C148.7786157272333,457.61805555555543 151.19124192821548,456.7070707070706 153.0677289734238,458.2253787878787C153.33579855131075,458.52904040404024 153.87193770708453,458.52904040404024 154.40807686285834,458.52904040404024C157.89298137538813,458.8327020202019 160.84174673214414,460.0473484848484 163.2543729331263,462.47664141414134C164.058581666787,463.38762626262627 165.13085997833466,463.9949494949494 165.93506871199537,464.60227272727263C166.73927744565609,465.2095959595958 167.8115557572037,465.2095959595958 168.61576449086445,465.51325757575745C169.41997322452517,465.8169191919192 169.95611238029898,466.1205808080807 170.7603211139597,466.1205808080807C172.10066900339424,466.1205808080807 173.17294731494187,466.72790404040387 173.97715604860255,467.9425505050504C174.24522562648946,468.246212121212 174.5132952043764,468.54987373737356 174.7813647822633,469.1571969696969C174.5132952043764,470.0681818181817 176.12171267169782,472.4974747474746 177.19399098324547,472.4974747474746C179.07047802845383,472.4974747474746 180.9469650736622,473.1047979797978 182.55538254098363,474.6231060606059C182.8234521188705,474.92676767676755 183.35959127464434,474.92676767676755 183.89573043041818,474.6231060606059C184.69993916407887,474.3194444444443 185.2360783198527,474.3194444444443 185.77221747562655,475.2304292929291C186.04028705351342,475.5340909090907 187.11256536506107,475.5340909090907 187.64870452083488,475.5340909090907C188.9890524102694,475.5340909090907 190.59746987759084,475.2304292929291 191.9378177670254,475.5340909090907C194.35044396800757,475.83775252525226 196.4950005911028,476.1414141414139 198.90762679208498,476.7487373737372C199.4437659478588,476.7487373737372 199.97990510363263,477.05239898989873 200.24797468151954,477.3560606060604C200.78411383729332,478.8743686868685 202.12446172672787,478.8743686868685 202.9286704603886,479.17803030303C203.7328791940493,479.48169191919163 204.80515750559695,479.7853535353533 205.34129666137076,479.7853535353533C205.60936623925767,479.48169191919163 206.1455053950315,479.17803030303 206.6816445508053,478.5707070707068C205.60936623925767,478.5707070707068 205.07322708348389,478.87436868686837 204.53708792771005,478.87436868686837C205.6093662392577,477.35606060606034 206.6816445508053,477.0523989898987 208.02199244023984,477.9633838383835C209.63040990756127,479.4816919191915 210.9707577969958,479.4816919191915 212.84724484220416,477.9633838383835L214.45566230952562,477.05239898989856L214.45566230952562,475.53409090909054C215.2598710431863,475.8377525252521 216.06407977684705,476.4450757575754 216.60021893262086,476.4450757575754C218.2086363999423,475.53409090909054 219.81705386726375,474.6231060606057 221.15740175669828,473.40845959595924C222.7658192240197,472.19381313131277 224.10616711345426,470.6755050505047 225.4465150028888,469.4608585858582C225.7145845807757,469.4608585858582 225.7145845807757,469.15719696969666 225.98265415866263,469.15719696969666C227.859141203871,468.5498737373734 229.46755867119242,468.2462121212117 231.34404571640076,467.6388888888885C232.41632402794843,467.3352272727269 233.22053276160912,466.7279040404036 234.29281107315674,466.42424242424204C235.09701980681746,466.12058080808043 235.63315896259127,466.12058080808043 236.437367696252,465.8169191919189L239.11806347512106,465.8169191919189C239.6542026308949,465.8169191919189 240.45841136455562,465.8169191919189 240.99455052032945,465.5132575757572C241.2626200982163,464.90593434343407 241.79875925399014,463.99494949494914 242.06682883187707,463.99494949494914C242.87103756553782,463.99494949494914 243.4071767213116,464.6022727272724 244.21138545497234,464.90593434343407C244.47945503285922,464.90593434343407 244.47945503285922,465.2095959595956 244.47945503285922,465.5132575757572C245.55173334440687,466.7279040404037 246.35594207806759,468.24621212121184 247.42822038961518,469.4608585858583C248.76856827904973,470.97916666666634 250.10891616848426,470.97916666666634 250.913124902145,470.0681818181815C252.25347279157953,468.853535353535 253.32575110312715,467.94255050505024 255.2022381483355,468.5498737373734C255.47030772622236,468.5498737373734 256.0064468819962,468.853535353535 256.27451645988316,468.5498737373734C257.61486434931766,467.94255050505024 259.22328181663914,467.3352272727269 260.56362970607364,466.4242424242421C261.3678384397343,466.12058080808055 262.440116751282,466.12058080808055 262.7081863291689,465.5132575757572C263.5123950628296,463.6912878787876 264.8527429522642,462.78030303030266 266.1930908416987,461.5656565656562C266.99729957535936,460.6546717171713 267.8015083090201,459.4400252525249 268.60571704268085,459.1363636363632C270.4822040878892,458.52904040404 271.82255197732377,456.7070707070703 273.4309694446452,455.4924242424239C274.77131733407975,454.581439393939 275.57552606774044,452.7594696969693 276.91587395717494,452.4558080808077C279.06043058027024,451.84848484848453 280.6688480475917,450.3301767676764 282.5453350928001,448.81186868686837C283.61761340434765,447.90088383838344 284.9579612937822,447.2935606060603 286.29830918321676,447.5972222222219C287.1025179168775,447.90088383838344 288.1747962284251,447.5972222222219 288.710935384199,447.2935606060603C289.78321369574655,446.6862373737371 290.8554920072942,445.77525252525214 291.92777031884185,445.167929292929C292.73197905250254,444.5606060606058 293.5361877861632,443.9532828282825 294.340396519824,443.9532828282825C297.0210922986931,443.64962121212096 299.1656489217883,443.04229797979764 300.50599681122293,440.0056818181814C301.04213596699674,438.79103535353494 303.7228317458658,437.2727272727269 304.7951100574134,437.88005050505024C306.6715971026218,438.79103535353505 308.0119449920563,438.1837121212118 309.08422330360395,436.3617424242421C309.88843203726464,435.4507575757573 310.9607103488123,435.75441919191894 311.764919082473,436.3617424242421C312.3010582382468,436.9690656565653 312.8371973940206,437.27272727272697 313.3733365497944,437.27272727272697C315.2498235950028,437.5763888888886 317.39438021809804,437.27272727272697 319.2708672633064,437.5763888888886C320.87928473062783,437.88005050505024 322.48770219794926,437.27272727272697 323.5599805094969,436.0580808080805C324.6322588210445,434.843434343434 325.43646755470525,434.843434343434 327.0448850220267,435.45075757575734C328.38523291146123,436.0580808080805 329.4575112230089,437.5763888888886 331.3339982682172,437.27272727272697C332.9424157355386,436.9690656565654 334.81890278074695,437.88005050505024 336.6953898259553,436.9690656565654L337.767668137503,436.9690656565654C339.3760856048244,437.5763888888886 340.98450307214586,437.8800505050503 342.3248509615804,439.3983585858584C343.93326842890184,440.9166666666664 344.2013380067887,429.6811868686867 345.80975547411026,430.8958333333331C348.22238167509244,432.7178030303027 347.68624251931857,430.8958333333331 350.09886872030074,432.41414141414117C351.97535576550905,433.32512626262604 351.1711470318484,429.9848484848482 353.3157036549436,430.5921717171714C353.58377323283054,430.5921717171714 356.80060816747346,433.02146464646444 356.80060816747346,432.7178030303027C358.14095605690795,431.80681818181785 359.4813039463425,422.6969696969694 360.82165183577706,423.00063131313107C363.50234761464617,423.911616161616 365.91497381562834,423.30429292929267 368.32760001661046,422.0896464646462C369.6679479060451,421.48232323232304 371.8125045291403,419.35669191919163 372.88478284068793,420.26767676767656C374.76126988589624,421.7859848484846 376.6377569311046,422.39330808080774 378.7823135541998,422.6969696969695C379.0503831320867,422.6969696969695 379.3184527099736,423.00063131313107 379.5865222878606,423.30429292929267C380.39073102152133,424.51893939393915 384.143705111938,421.1786616161614 384.9479138455987,422.39330808080774C386.02019215714637,424.2152777777775 387.09247046869405,426.0372474747471 388.1647487802416,427.55555555555526C388.70088793601536,428.1628787878784 389.50509666967616,428.46654040404013 389.77316624756304,429.0738636363633C390.0412358254499,430.59217171717137 390.5773749812237,431.1994949494946 391.91772287065834,431.1994949494946C392.7219316043191,431.1994949494946 393.5261403379797,431.5031565656562 394.0622794937536,432.1104797979795C395.40262738318813,433.0214646464643 396.4749056947358,433.93244949494914 397.54718400628343,434.843434343434C398.887531895718,435.75441919191894 400.2278797851525,436.66540404040376 400.7640189409263,438.1837121212118C401.03208851881317,438.79103535353494 401.3001580967001,439.0946969696967 401.56822767458704,439.39835858585826C402.6405059861347,440.61300505050474 403.71278429768233,441.52398989898956 404.78506260922995,442.73863636363603C406.3934800765513,444.2569444444441 407.7338279659859,446.0789141414138 409.3422454333073,447.5972222222219C409.8783845890811,447.90088383838344 410.414523744855,448.50820707070676 410.95066290062874,448.81186868686837C412.02294121217636,449.4191919191916 413.09521952372404,450.02651515151484 413.89942825738467,450.93749999999966C414.7036369910454,451.8484848484845 418.45661108146214,446.3825757575754 418.992750237236,447.5972222222219C418.992750237236,447.90088383838344 419.2608198151229,447.90088383838344 419.5288893930097,447.90088383838344C421.1373068603312,449.4191919191916 422.7457243276526,448.81186868686837 424.3541417949741,448.2045454545451C424.8902809507479,447.90088383838344 425.4264201065218,447.5972222222219 425.69448968440867,447.90088383838344C427.570976729617,448.81186868686837 428.9113246190515,450.93749999999966 431.3239508200337,451.2411616161612C431.3239508200337,451.2411616161612 431.5920203979206,451.2411616161612 431.5920203979206,451.5448232323228C432.1281595536944,453.3667929292925 433.7365770210159,453.3667929292925 435.07692491045043,453.6704545454541C435.8811336441112,453.6704545454541 436.68534237777186,453.97411616161565 437.2214815335457,454.2777777777773C438.82989900086716,455.1887626262622 440.4383164681886,456.4034090909086 442.31480351339695,457.0107323232319C444.7274297143791,457.92171717171675 447.14005591536136,458.5290404040399 449.01654296056967,460.04734848484804C449.2846125384566,460.04734848484804 449.5526821163435,460.04734848484804 449.5526821163435,460.35101010100965C450.35689085000416,460.95833333333286 451.6972387394387,461.2619949494945 452.2333778952125,462.17297979797934C453.03758662887327,463.99494949494897 455.1821432519685,463.6912878787874 456.25442156351613,465.20959595959545L456.522491141403,465.20959595959545C457.5947694529507,465.20959595959545 458.66704776449836,465.51325757575705 460.00739565393286,465.51325757575705C460.54353480970667,465.20959595959545 461.3477435433674,464.60227272727224 461.88388269914117,464.60227272727224C464.2965089001234,465.51325757575705 466.7091351011056,465.51325757575705 468.31755256842695,463.0839646464641C468.5856221463139,462.7803030303025 469.12176130208775,462.7803030303025 469.65790045786156,462.7803030303025L471.8024570809568,462.7803030303025C474.215083281939,462.17297979797934 476.35963990503416,461.565656565656 478.7722661060164,461.26199494949446C479.844544417564,460.95833333333286 481.18489230699856,461.565656565656 482.25717061854624,461.8693181818176C483.32944893009386,462.1729797979792 484.4017272416415,462.1729797979792 485.47400555318904,462.1729797979792C486.8143534426236,462.1729797979792 487.8866317541713,461.565656565656 489.2269796436058,461.565656565656C490.29925795515345,461.26199494949446 491.63960584458795,461.26199494949446 492.7118841561356,460.95833333333286C495.1245103571178,460.35101010100965 497.26906698021304,459.7436868686863 499.6816931811952,459.4400252525247C501.29011064851665,449.11553030302974 501.0220410706297,436.96906565656514 501.0220410706297,424.51893939393887Z" fill="#000"></path>
            </clipPath>
            {/* clipPath normalizado: scale(1/672, 1/816.1266) */}
            <clipPath id="canvaGalaClip" clipPathUnits="objectBoundingBox" transform="scale(0.0014881, 0.0012253)">
              <path d="M672,146.1084193145638C671.5892420537897,146.1084193145638 671.1784841075795,146.1084193145638 670.7677261613691,145.63557653361053C668.7139364303176,145.16273375265723 666.2493887530561,145.63557653361053 665.0171149144253,143.27136262884412C664.6063569682151,142.32567706693757 663.3740831295842,141.379991505031 662.5525672371638,140.90714872407773C660.9095354523226,139.0157776002646 658.8557457212712,137.12440647645144 656.8019559902199,135.23303535263835L653.1051344743275,130.97745032405885C652.6943765281172,130.50460754310552 652.6943765281172,130.03176476215228 652.6943765281172,129.55892198119898C651.8728606356967,128.6132364192924 650.6405867970658,127.66755085738586 649.408312958435,127.66755085738586C647.3545232273837,127.19470807643256 645.3007334963323,127.19470807643256 643.246943765281,126.7218652954793L641.6039119804399,126.7218652954793C639.5501222493886,125.77617973357275 637.9070904645474,125.30333695261946 635.8533007334961,125.77617973357275C635.0317848410756,125.77617973357275 634.210268948655,125.77617973357275 633.7995110024448,124.83049417166619C633.3887530562346,123.88480860975962 632.567237163814,123.41196582880634 632.1564792176038,122.93912304785306C631.3349633251831,121.99343748594652 630.1026894865523,121.52059470499321 629.2811735941318,121.04775192403996C627.6381418092907,119.6292235811801 626.40586797066,118.21069523832026 624.3520782396087,118.21069523832026C622.7090464547676,118.21069523832026 621.0660146699264,117.73785245736697 619.4229828850854,117.2650096764137C619.0122249388752,117.2650096764137 619.0122249388752,117.2650096764137 619.0122249388752,116.79216689546041C617.7799511002444,114.9007957716473 615.726161369193,114.42795299069401 613.6723716381417,114.42795299069401C612.8508557457211,114.42795299069401 612.0293398533005,113.95511020974072 612.0293398533005,113.48226742878745C611.6185819070903,112.06373908592761 610.7970660146697,111.59089630497432 609.9755501222492,111.59089630497432C608.7432762836183,111.59089630497432 607.5110024449876,111.11805352402105 606.689486552567,111.59089630497432C603.4034229828848,113.00942464783418 600.9388753056232,110.17236796211449 598.0635696821514,109.69952518116122L597.6528117359412,109.22668240020792C596.8312958435207,106.86246849544152 594.7775061124694,106.86246849544152 592.723716381418,106.38962571448823C592.723716381418,105.91678293353495 593.1344743276281,105.91678293353495 593.1344743276281,105.44394015258167C592.723716381418,105.44394015258167 592.3129584352077,105.91678293353496 591.4914425427871,105.91678293353496C591.0806845965768,105.91678293353496 590.2591687041563,106.38962571448825 589.848410757946,105.91678293353496C589.0268948655255,104.49825459067512 587.7946210268947,103.07972624781527 587.7946210268947,101.66119790495544C587.7946210268947,100.24266956209561 586.5623471882639,100.24266956209559 586.1515892420537,99.76982678114233L585.3300733496332,99.76982678114233C583.6870415647919,97.8784556573292 582.0440097799509,97.40561287637593 579.9902200488996,98.82414121923577C579.5794621026893,97.40561287637593 580.4009779951098,95.51424175256281 578.7579462102688,95.04139897160951L578.7579462102688,94.56855619065618C579.5794621026891,92.20434228588978 578.3471882640584,90.78581394302995 576.7041564792174,89.84012838112339C575.4718826405865,88.89444281921682 575.0611246943762,87.94875725731026 575.0611246943762,86.53022891445042L575.0611246943762,84.6388577906373C573.4180929095351,84.16601500968402 572.5965770171147,82.2746438858709 571.775061124694,80.85611554301104C571.3643031784837,78.96474441919793 570.5427872860632,77.54621607633808 569.7212713936427,76.12768773347825C568.8997555012222,74.7091593906184 567.2567237163812,73.76347382871184 567.2567237163812,71.39925992394544C567.2567237163812,69.98073158108558 566.8459657701709,68.56220323822575 566.4352078239607,67.1436748953659C565.6136919315402,65.25230377155277 564.7921760391195,63.83377542869294 563.5599022004888,61.94240430487981C564.3814180929093,60.523875962019964 565.2029339853299,59.578190400113414 563.970660146699,58.15966205725356L563.970660146699,57.213976495347005C563.970660146699,56.741133714393726 563.5599022004888,56.26829093344044 563.5599022004888,55.795448152487154C563.1491442542786,55.322605371533875 562.3276283618579,54.849762590580596 561.9168704156476,54.37691980962731C560.6845965770168,52.958391466767466 559.8630806845964,51.06702034295435 557.8092909535451,52.01270590486091C556.9877750611246,50.12133478104778 556.5770171149142,48.229963657234656 556.166259168704,46.33859253342154C555.7555012224936,44.920064190561696 555.3447432762833,43.97437862865513 554.933985330073,42.55585028579529L554.933985330073,42.08300750484201C555.7555012224935,40.191636381028886 554.5232273838627,38.77310803816904 554.5232273838627,37.3545796953092C554.5232273838627,36.40889413340264 553.7017114914423,35.46320857149607 553.2909535452319,34.51752300958952C552.8801955990217,33.098994666729666 551.6479217603909,32.15330910482311 551.6479217603909,30.734780761963265L551.6479217603909,23.16929626671077C551.2371638141806,20.332239580991086 550.41564792176,18.91371123813124 547.5403422982882,18.44086845717796C547.1295843520779,18.44086845717796 546.7188264058677,18.44086845717796 546.7188264058677,17.968025676224677C545.8973105134471,16.549497333364833 544.6650366748163,16.076654552411554 543.0220048899752,15.603811771458274C541.7897310513443,15.603811771458274 540.9682151589238,15.603811771458274 540.1466992665034,16.076654552411554C538.0929095354521,17.495182895271395 536.0391198044007,18.91371123813124 534.3960880195596,20.80508236194436C532.3422982885082,22.69645348575749 530.6992665036672,24.11498182861733 528.2347188264056,22.69645348575749L527.4132029339851,22.69645348575749C526.5916870415646,22.22361070480421 525.3594132029338,21.750767923850926 524.5378973105131,21.277925142897647C524.1271393643029,21.750767923850926 523.7163814180926,22.22361070480421 522.4841075794618,21.750767923850926C520.0195599022003,21.277925142897647 517.9657701711488,20.80508236194436 515.9119804400975,18.913711238131242C515.5012224938873,18.440868457177963 514.6797066014667,18.440868457177963 514.2689486552564,18.440868457177963C512.6259168704154,17.968025676224677 510.572127139364,17.495182895271398 508.5183374083127,16.549497333364837C510.16136919315375,15.130968990504996 509.7506112469434,14.185283428598433 508.92909535452293,13.23959786669187C507.6968215158921,11.348226742878747 506.053789731051,11.348226742878747 504.8215158924202,12.293912304785307C501.94621026894833,13.712440647645149 499.07090464547645,15.603811771458275 495.7848410757943,17.02234011431812C494.5525672371635,17.968025676224677 492.9095354523224,18.44086845717796 491.26650366748135,18.913711238131242C490.0342298288506,19.38655401908452 488.80195599021977,18.913711238131242 487.56968215158895,19.38655401908452C486.3374083129581,19.859396800037803 485.1051344743273,20.332239580991086 483.46210268948624,19.859396800037803C483.051344743276,19.859396800037803 482.2298288508554,20.332239580991082 481.8190709046451,20.332239580991082C480.99755501222455,20.805082361944358 480.58679706601436,21.277925142897644 479.7652811735938,20.805082361944358C478.1222493887527,20.805082361944358 477.30073349633216,21.750767923850923 476.47921760391165,22.696453485757488C475.6577017114911,23.642139047664045 474.8361858190706,25.53351017147717 474.0146699266501,26.006352952430454C472.78239608801925,26.479195733383733 471.9608801955987,27.424881295290295 471.1393643031782,28.37056685719686C470.3178484107576,29.31625241910342 469.49633251833706,29.789095200056703 468.6748166259166,30.261937981009982C467.4425427872858,31.207623542916547 466.21026894865497,31.680466323869826 464.97799511002415,32.62615188577639C463.74572127139334,34.04468022863623 462.1026894865522,34.99036579054279 460.4596577017112,34.99036579054279C458.8166259168701,35.46320857149607 456.76283618581874,35.46320857149607 455.1198044009777,36.88173691435592C455.1198044009777,36.88173691435592 454.7090464547675,37.3545796953092 454.29828850855716,37.3545796953092C452.65525672371604,37.3545796953092 451.012224938875,36.88173691435592 449.36919315403395,36.88173691435592C448.13691931540313,36.88173691435592 446.0831295843518,36.40889413340264 445.26161369193125,38.77310803816904C445.26161369193125,38.77310803816904 444.850855745721,39.24595081912233 444.44009779951074,39.24595081912233C443.20782396087986,39.71879360007561 441.9755501222491,40.66447916198217 440.74327628361823,41.13732194293545C440.74327628361823,42.08300750484201 439.5110024449874,42.555850285795294 438.6894865525669,42.555850285795294C434.9926650366745,42.08300750484202 431.7066014669923,42.08300750484202 428.0097799510999,40.66447916198217C426.36674816625884,40.19163638102889 424.7237163814178,39.24595081912233 422.66992665036645,38.30026525721576C422.2591687041562,38.30026525721576 421.8484107579459,37.827422476262484 421.4376528117357,37.827422476262484C418.56234718826374,37.827422476262484 415.68704156479185,38.30026525721576 412.4009779951097,38.30026525721576L411.9902200488995,38.30026525721576C410.34718826405833,37.354579695309205 408.29339853300706,37.827422476262484 406.650366748166,39.24595081912233C406.23960880195574,39.71879360007561 405.4180929095352,40.191636381028886 405.00733496332487,40.191636381028886C402.95354523227354,39.71879360007561 401.3105134474324,39.24595081912233 399.2567237163811,38.773108038169035C397.20293398532976,38.30026525721575 395.55990220048864,37.82742247626247 393.5061124694373,37.82742247626247C391.8630806845962,37.82742247626247 390.22004889975517,37.3545796953092 388.5770171149141,36.40889413340263C386.93398533007297,35.46320857149607 385.29095354523196,34.99036579054279 383.64792176039083,34.04468022863623C382.8264058679703,33.57183744768295 381.5941320293395,33.57183744768295 380.3618581907087,33.09899466672966C380.3618581907087,31.680466323869823 380.77261613691894,30.734780761963258 380.77261613691894,29.789095200056696C378.7188264058676,30.734780761963258 377.4865525672368,30.261937981009975 376.254278728606,29.316252419103417C375.4327628361855,28.84340963815014 374.20048899755466,28.84340963815014 373.37897310513415,28.370566857196856L372.14669926650333,28.370566857196856C370.5036674816622,27.42488129529029 368.4498777506109,27.42488129529029 366.39608801955956,27.42488129529029C363.931540342298,27.42488129529029 361.05623471882603,26.952038514337012 358.5916870415644,25.060667390523886C356.5378973105131,23.642139047664042 354.07334963325144,22.696453485757484 351.6088019559898,23.16929626671076C350.37652811735904,23.64213904766404 349.1442542787282,24.587824609570603 347.91198044009735,25.060667390523886C345.858190709046,26.00635295243045 344.2151589242049,27.89772407624357 342.1613691931536,28.843409638150135C340.10757946210225,29.789095200056696 337.6430317848407,30.734780761963258 335.17848410757904,31.68046632386982C333.9462102689482,32.153309104823094 332.7139364303174,33.09899466672966 331.4816625916866,33.571837447682945C329.4278728606352,34.5175230095895 327.78484107579413,34.99036579054278 325.7310513447428,35.93605135244935C324.49877750611194,36.40889413340263 322.85574572127086,37.82742247626247 321.6234718826401,38.30026525721575C319.15892420537847,39.24595081912231 316.6943765281169,40.66447916198215 313.81907090464495,41.13732194293543C312.5867970660142,41.61016472388871 312.1760391198039,42.55585028579528 311.35452322738337,43.02869306674856L307.6577017114909,44.4472214096084C305.19315403422934,45.39290697151497 303.139364303178,46.33859253342153 300.6748166259163,46.811435314374805C299.44254278728556,47.284278095328084 297.79951100244443,47.75712087628136 296.5672371638136,48.229963657234656C296.15647921760336,48.229963657234656 296.15647921760336,48.702806438187935 295.7457212713931,48.702806438187935C294.92420537897254,49.64849200009449 294.102689486552,50.59417756200106 292.8704156479212,51.06702034295434C290.81662591686984,52.0127059048609 288.7628361858185,52.958391466767466 286.70904645476713,53.43123424772074C285.8875305623466,53.904077028674024 284.6552567237158,53.904077028674024 283.8337408312953,53.904077028674024C281.36919315403367,54.3769198096273 278.90464547677203,55.79544815248715 276.44009779951045,56.74113371439371C274.38630806845913,57.68681927630027 272.33251833740775,58.159662057253556 270.6894865525667,59.105347619160106C268.22493887530504,60.05103318106667 265.7603911980434,60.996718742973236 264.52811735941265,63.833775428692924C264.52811735941265,64.3066182096462 263.706601466992,64.3066182096462 263.706601466992,64.3066182096462C262.47432762836127,64.77946099059949 260.8312958435202,65.25230377155276 259.5990220048894,65.72514655250605C259.1882640586791,66.19798933345932 258.7775061124688,65.72514655250605 258.7775061124688,65.25230377155276C258.36674816625856,63.360932647739645 258.36674816625856,60.996718742973236 255.90220048899695,60.05103318106668L255.49144254278664,59.57819040011341C255.49144254278664,57.213976495347 253.8484107579456,56.26829093344043 252.20537897310453,55.32260537153387C250.56234718826343,54.3769198096273 249.33007334963264,53.904077028674024 248.09779951100182,52.01270590486091C247.2762836185813,50.59417756200106 245.63325183374022,49.6484920000945 244.40097799510943,48.229963657234656C243.1687041564786,47.28427809532809 241.52567237163754,46.811435314374805 240.704156479217,44.920064190561696C240.29339853300672,43.97437862865513 239.47188264058622,43.501535847701845 238.65036674816565,42.55585028579529C239.06112469437596,42.55585028579529 238.23960880195537,42.55585028579529 237.82885085574512,42.08300750484201C237.41809290953483,41.61016472388872 237.00733496332458,41.61016472388872 236.59657701711433,41.13732194293545C236.18581907090405,40.19163638102889 235.77506112469376,39.24595081912233 234.54278728606297,39.24595081912233C234.13202933985272,39.24595081912233 233.7212713936424,38.77310803816904 233.31051344743219,38.30026525721576C232.8997555012219,38.30026525721576 232.48899755501162,37.827422476262484 231.6674816625911,37.827422476262484L226.73838630806785,34.9903657905428C225.50611246943708,34.04468022863624 224.27383863080624,32.626151885776395 222.6308068459652,32.153309104823116C220.16625916870356,31.207623542916558 218.1124694376522,29.789095200056714 216.46943765281114,27.42488129529031C214.82640586797007,25.060667390523903 212.77261613691874,23.64213904766406 210.3080684596571,22.22361070480422C209.07579462102632,21.277925142897658 207.84352078239547,20.805082361944375 207.02200488997497,20.332239580991093C205.3789731051339,18.913711238131253 203.32518337408257,17.968025676224688 201.27139364303122,17.022340114318126C202.09290953545175,15.603811771458284 201.6821515892415,15.603811771458284 200.86063569682096,15.130968990505002C200.03911980440037,14.658126209551721 199.21760391197986,14.658126209551721 198.8068459657696,14.18528342859844C198.3960880195593,12.766755085738598 197.16381418092854,12.766755085738598 196.34229828850798,11.821069523832033C195.1100244498772,10.402541180972191 193.46699266503606,8.984012838112347 192.2347188264053,7.565484495252506C191.82396088019502,7.0926417142992255 191.41320293398476,6.619798933345945 191.00244498777448,6.619798933345945C187.71638141809234,6.146956152392663 185.25183374083073,3.782742247626259 182.37652811735884,2.364213904766416C181.96577017114856,1.891371123813135 181.14425427872803,1.4185283428598539 180.73349633251777,1.4185283428598539C179.09046454767667,1.4185283428598539 177.44743276283563,1.891371123813135 175.39364303178428,1.891371123813135C173.7506112469432,1.891371123813135 171.69682151589186,1.4185283428598543 170.0537897310508,0.945685561906573C168.41075794620974,0.4728427809532919 166.76772616136864,0.472842780953292 165.12469437652754,-0.10009839564441697C163.4816625916865,-0.20019679128883394 162.24938875305565,0 161.01711491442487,-0.10009839564441697C160.1955990220043,0 158.14180929095298,0.945685561906573 156.9095354523222,1.891371123813135C155.26650366748112,2.837056685719697 153.62347188264005,4.2555850285795405 151.98044009779895,5.674113371439383C149.9266503667476,7.092641714299226 147.462102689486,8.51117005715907 144.99755501222435,9.929698400018912C144.5867970660141,10.402541180972191 143.76528117359356,10.402541180972191 142.943765281173,9.929698400018912C142.12224938875246,9.45685561906563 141.30073349633193,9.929698400018912 140.4792176039114,10.402541180972191C139.2469437652806,11.348226742878756 137.6039119804395,11.821069523832033 136.3716381418087,12.766755085738598C134.31784841075736,14.658126209551721 132.26405867970604,17.022340114318126 129.38875305623412,17.495182895271405C127.74572127139307,17.495182895271405 126.10268948655198,18.913711238131253 124.45965770171092,18.913711238131253C123.2273838630801,18.913711238131253 122.40586797065957,18.913711238131253 121.17359413202877,19.386554019084528C119.5305623471877,19.85939680003781 117.8875305623466,20.805082361944372 115.83374083129526,20.805082361944372C113.36919315403364,20.805082361944372 111.3154034229823,22.223610704804212 108.8508557457207,23.169296266710777C106.38630806845907,24.58782460957062 104.33251833740773,26.00635295243046 101.86797066014613,27.42488129529031C100.22493887530506,28.370566857196874 98.58190709046397,28.370566857196874 96.52811735941262,27.897724076243588C95.29584352078182,27.897724076243588 94.47432762836128,27.42488129529031 93.65281173594074,28.370566857196867L89.95599022004834,31.20762354291655C88.31295843520726,32.62615188577639 87.08068459657645,34.51752300958952 85.84841075794564,35.936051352449354C84.20537897310457,38.30026525721576 83.38386308068402,41.13732194293545 80.91931540342242,42.555850285795294C80.50855745721215,43.02869306674857 80.09779951100188,43.97437862865514 79.68704156479161,44.9200641905617C79.27628361858135,45.39290697151498 79.27628361858135,45.86574975246826 78.86552567237106,46.33859253342155C77.63325183374026,47.75712087628139 76.40097799510946,49.17564921914123 75.57946210268892,51.06702034295436C74.75794621026839,52.95839146676748 72.70415647921703,53.43123424772076 71.8826405867965,54.84976259058061C70.6503667481657,56.74113371439373 68.18581907090409,57.68681927630029 66.542787286063,58.632504838206856C64.0782396088014,60.05103318106671 62.02444987775005,61.94240430487982 60.79217603911924,64.77946099059952C60.79217603911924,65.25230377155279 60.79217603911924,65.25230377155279 60.38141809290897,65.72514655250608C57.5061124694371,67.61651767631919 54.63080684596521,69.03504601917903 51.75550122249333,70.92641714299216C49.70171149144198,72.34494548585201 47.23716381418037,72.34494548585201 45.183374083129024,74.23631660966512C44.361858190708496,75.18200217157168 43.129584352077686,75.65484495252497 41.89731051344687,76.12768773347825C39.432762836185255,77.54621607633808 36.96821515892365,78.01905885729136 35.32518337408257,80.38327276205777C33.271393643031224,83.22032944777744 30.396088019559343,84.16601500968402 28.342298288507997,86.05738613349713C25.466992665036116,88.42160003826353 22.591687041564235,90.78581394302995 19.716381418092347,93.62287062874964C18.073349633251272,94.56855619065618 16.430317848410198,95.04139897160948 14.787286063569121,94.09571340970292C13.965770171148582,93.62287062874964 13.144254278728045,93.15002784779637 12.733496332517776,93.62287062874964C11.090464547676701,95.04139897160948 9.036674816625357,95.51424175256274 6.982885085574012,95.98708453351604C6.572127139363743,95.98708453351604 6.161369193153474,96.45992731446933 5.750611246943206,96.45992731446933C4.929095354523226,150.83684712409664 2.875305623471882,205.68660971467725 0.8215158924205379,260.06352952430456C-0.30029518693325086,318.6960343625114 2.0537897310513444,369.7630547054657 1.6430317848410758,428.39555954367256C1.2322738386308068,487.5009071628327 -0.6005903738665017,552.7532109343854 2.0537897310513444,611.3857157725923C6.161369193154034,669.545377829846 11.090464547677263,727.7050398870995 15.19804400977995,785.8647019443531L15.60880195599022,785.8647019443531C17.251833740831295,785.3918591633998 18.894865525672373,785.3918591633998 20.94865525672372,785.3918591633998C23.41320293398533,784.9190163824466 25.466992665036678,783.9733308205399 27.931540342298288,783.9733308205399C30.806845965770172,783.9733308205399 33.68215158924206,784.4461736014932 36.557457212713935,784.4461736014932C39.43276283618581,784.4461736014932 42.3080684596577,784.9190163824464 44.77261613691931,785.3918591633997C47.23716381418093,785.864701944353 49.29095354523227,785.864701944353 51.34474327628361,784.4461736014932L51.75550122249388,784.4461736014932C54.22004889975549,783.9733308205399 56.6845965770171,783.5004880395866 59.55990220048899,783.0276452586332C60.38141809290953,783.0276452586332 61.61369193154034,783.0276452586332 62.024449877750605,783.5004880395865C63.66748166259168,785.3918591633997 65.31051344743275,784.9190163824464 67.3643031784841,784.4461736014931C69.41809290953543,783.9733308205397 70.65036674816625,784.4461736014931 72.29339853300732,785.3918591633995C73.11491442542786,785.8647019443528 73.93643031784839,785.8647019443528 74.75794621026894,785.8647019443528L80.09779951100244,785.8647019443528C81.33007334963324,785.8647019443528 82.56234718826406,786.8103875062593 83.79462102689486,786.8103875062593C85.43765281173593,787.2832302872125 87.49144254278727,787.2832302872125 89.13447432762835,787.2832302872125C89.95599022004889,787.2832302872125 90.77750611246941,788.2289158491191 91.1882640586797,788.7017586300724C94.88508557457212,790.1202869729323 98.17114914425427,789.1746014110256 101.8679706601467,789.1746014110256C102.68948655256722,789.1746014110256 103.51100244498777,788.2289158491192 104.33251833740832,788.2289158491192C107.20782396088019,787.756073068166 109.67237163814181,788.2289158491192 112.13691931540342,789.647444191979C113.36919315403422,790.1202869729323 115.01222493887529,790.1202869729323 116.65525672371638,790.1202869729323L117.88753056234718,790.1202869729323C119.53056234718827,790.5931297538856 120.76283618581907,791.5388153157922 122.40586797066015,791.0659725348389C124.4596577017115,790.5931297538856 126.51344743276283,790.5931297538856 128.97799511002447,790.1202869729323C131.0317848410758,789.647444191979 133.08557457212714,790.1202869729323 135.1393643031785,790.5931297538856C135.55012224938878,790.5931297538856 135.96088019559903,791.0659725348389 136.37163814180929,790.5931297538856C138.42542787286064,790.1202869729323 140.0684596577017,789.1746014110256 142.12224938875306,789.647444191979C143.7652811735941,790.1202869729323 144.99755501222495,790.5931297538856 146.64058679706602,791.065972534839C148.28361858190706,791.5388153157924 149.5158924205379,792.0116580967455 151.15892420537898,792.4845008776989C153.2127139364303,792.9573436586521 155.26650366748166,792.9573436586521 156.90953545232273,793.4301864396053C158.96332518337408,793.9030292205587 160.19559902200487,795.7944003443718 162.24938875305622,795.7944003443718C164.30317848410758,795.7944003443718 165.94621026894865,797.2129286872317 168,798.1586142491382C168.82151589242054,798.6314570300915 169.64303178484104,798.6314570300915 170.8753056234719,799.1042998110447C173.3398533007335,799.5771425919979 175.39364303178485,799.5771425919979 177.85819070904645,800.0499853729513C179.9119804400978,800.5228281539045 181.96577017114916,801.4685137158111 184.01955990220048,800.9956709348577C187.30562347188263,800.5228281539045 189.77017114914426,801.4685137158109 192.64547677261615,802.4141992777176C194.6992665036675,802.8870420586708 196.34229828850857,804.3055704015308 198.3960880195599,804.3055704015308C200.86063569682153,804.7784131824841 203.32518337408317,805.2512559634373 204.9682151589242,807.1426270872504C205.37897310513446,806.6697843062972 205.78973105134477,806.6697843062972 205.78973105134477,806.6697843062972C207.02200488997556,807.1426270872504 208.66503667481666,807.1426270872504 209.89731051344745,807.6154698682036C212.36185819070906,808.0883126491569 214.4156479217604,809.0339982110635 216.46943765281176,809.5068409920168C217.70171149144255,809.9796837729701 218.93398533007337,809.9796837729701 219.75550122249388,810.9253693348768C220.9877750611247,811.8710548967832 222.22004889975554,812.3438976777367 223.4523227383863,811.8710548967832C224.68459657701712,811.8710548967832 225.50611246943765,811.39821211583 226.73838630806844,811.8710548967832C229.20293398533005,812.3438976777365 231.2567237163814,813.7624260205964 233.72127139364304,814.2352688015496C234.5427872860636,814.7081115825029 235.77506112469436,814.7081115825029 237.00733496332518,814.2352688015496C240.29339853300732,813.2895832396431 243.5794621026895,813.2895832396431 246.86552567237163,814.2352688015496C248.91931540342298,814.7081115825029 251.3838630806846,816.1266399253627 253.43765281173594,815.1809543634561C255.080684596577,814.7081115825029 256.3129584352078,814.7081115825029 257.5452322738386,814.7081115825029C258.36674816625913,814.7081115825029 259.1882640586797,815.1809543634561 259.59902200489,814.7081115825029C261.6528117359413,812.3438976777365 264.1173594132029,813.289583239643 266.58190709046454,813.289583239643C268.2249388753056,813.7624260205962 270.278728606357,813.7624260205962 271.921760391198,812.8167404586898L272.74327628361857,812.8167404586898C275.2078239608802,812.8167404586898 277.6723716381418,813.289583239643 280.1369193154034,813.289583239643L280.958435207824,813.289583239643C282.60146699266505,812.8167404586898 283.83374083129587,811.8710548967831 285.4767726161369,811.3982121158299C287.9413202933985,810.4525265539233 290.40586797066015,809.97968377297 292.87041564792173,809.5068409920167C294.92420537897306,809.0339982110634 296.5672371638141,809.5068409920167 298.6210268948655,809.0339982110634C299.03178484107576,809.0339982110634 299.4425427872861,809.0339982110634 299.8533007334963,808.5611554301101C301.0855745721271,807.6154698682036 303.13936430317847,808.5611554301101 303.5501222493888,806.6697843062971L303.960880195599,806.6697843062971C304.78239608801954,806.6697843062971 306.0146699266503,806.6697843062971 306.8361858190709,805.7240987443905C308.479217603912,804.3055704015306 309.71149144254275,804.7784131824841 311.3545232273839,805.2512559634373C313.40831295843515,805.7240987443905 315.46210268948647,806.1969415253437 317.10513447432766,805.7240987443905C319.1589242053789,805.2512559634373 321.62347188264056,804.3055704015306 323.6772616136919,803.8327276205774C324.08801955990214,803.8327276205774 324.49877750611245,803.3598848396242 324.90953545232264,802.8870420586708C326.1418092909535,801.9413564967643 326.963325183374,800.5228281539045 328.19559902200484,799.5771425919979C328.19559902200484,799.5771425919979 328.60635696821504,799.1042998110447 329.01711491442535,799.1042998110447C331.07090464547673,800.0499853729513 331.8924205378973,797.6857714681848 333.12469437652805,796.7400859062783C334.7677261613691,795.7944003443718 335.5892420537897,792.957343658652 338.0537897310513,793.4301864396053L338.4645476772615,793.4301864396053C340.10757946210265,792.4845008776989 341.7506112469437,791.065972534839 342.9828850855745,790.1202869729324C343.39364303178473,789.6474441919792 343.80440097799504,789.174601411026 343.80440097799504,788.7017586300725C344.21515892420524,788.2289158491193 344.6259168704156,787.2832302872126 345.4474327628362,786.8103875062594C348.322738386308,784.4461736014931 351.19804400977995,782.5548024776798 354.0733496332517,780.1905885729135C355.30562347188254,779.244903011007 357.35941320293387,778.2992174491003 357.35941320293387,775.4621607633807C357.35941320293387,772.625104077661 359.8239608801955,771.6794185157544 361.46699266503657,770.733732953848C362.6992665036674,769.7880473919413 364.3422982885085,769.7880473919413 365.98533007334953,769.315204610988C366.80684596577004,769.315204610988 367.2176039119803,768.8423618300346 368.03911980440085,768.8423618300346C368.8606356968214,768.8423618300346 369.682151589242,768.8423618300346 370.09290953545224,767.8966762681282C370.50366748166243,767.4238334871749 370.91442542787274,767.4238334871749 371.325183374083,766.9509907062217C372.14669926650356,766.4781479252684 372.96821515892407,766.0053051443152 373.3789731051344,765.5324623633618L375.84352078239596,765.5324623633618C377.486552567237,766.4781479252683 378.71882640586784,767.4238334871749 379.9511002444986,767.8966762681282C379.9511002444986,767.8966762681282 380.36185819070886,767.4238334871749 380.77261613691917,767.4238334871749C379.9511002444986,766.9509907062217 379.5403422982884,766.4781479252684 378.71882640586784,766.005305144315C378.71882640586784,765.0596195824086 378.71882640586784,764.5867768014551 379.1295843520781,763.6410912395486C379.9511002444986,764.1139340205018 381.1833740831294,764.5867768014551 380.77261613691917,762.695405677642L381.1833740831294,762.2225628966888C382.00488997554993,761.2768773347824 382.82640586797055,760.3311917728757 384.0586797066013,760.804034553829C384.0586797066013,760.804034553829 384.46943765281156,760.3311917728757 384.8801955990219,760.3311917728757L387.34474327628345,761.7497201157356C387.34474327628345,761.2768773347824 387.34474327628345,760.8040345538291 386.9339853300732,760.8040345538291L387.34474327628345,760.8040345538291C387.7555012224937,761.2768773347824 388.166259168704,761.2768773347824 388.9877750611246,761.7497201157356C388.9877750611246,760.8040345538291 391.0415647921759,759.3855062109692 391.4523227383861,759.8583489919225L391.86308068459635,759.8583489919225C392.27383863080667,761.2768773347824 393.09535452322723,762.2225628966888 393.5061124694375,763.6410912395487C394.32762836185805,763.1682484585955 395.1491442542786,762.2225628966888 395.97066014669906,761.7497201157356C396.3814180929093,762.695405677642 396.3814180929093,763.6410912395487 396.7921760391196,765.0596195824086C397.6136919315402,764.1139340205019 398.02444987775044,763.6410912395486 398.02444987775044,763.1682484585954C399.2567237163812,763.6410912395486 400.488997555012,763.6410912395486 401.3105134474325,764.1139340205018C402.5427872860634,765.0596195824085 403.77506112469416,765.0596195824085 405.007334963325,764.5867768014551C405.82885085574554,764.1139340205018 406.2396088019558,763.6410912395486 407.06112469437636,763.1682484585951C407.4718826405866,764.1139340205017 407.8826405867969,764.5867768014551 408.70415647921743,765.0596195824085C408.29339853300723,765.0596195824085 407.8826405867969,765.5324623633617 407.47188264058667,765.5324623633617C406.6503667481661,766.0053051443149 406.23960880195585,766.4781479252682 405.82885085574554,767.4238334871748C405.41809290953523,768.3695190490814 405.4180929095353,769.315204610988 404.5965770171148,769.7880473919412C403.7750611246942,770.2608901728944 403.7750611246942,769.315204610988 402.95354523227365,769.315204610988C403.7750611246942,768.8423618300346 404.1858190709045,768.8423618300346 404.5965770171148,768.8423618300346L404.5965770171148,767.8966762681282C402.1320293398532,768.8423618300346 399.6674816625915,767.4238334871749 396.7921760391196,767.8966762681282C398.43520782396075,768.8423618300346 400.07823960880177,769.3152046109881 401.7212713936429,769.7880473919413L400.8997555012223,770.733732953848C401.7212713936429,771.2065757348012 402.54278728606346,771.2065757348012 403.3643031784839,771.2065757348012L403.3643031784839,771.6794185157544C402.5427872860634,771.6794185157544 402.13202933985315,772.1522612967076 401.3105134474325,772.1522612967076L401.3105134474325,772.6251040776609L405.007334963325,772.6251040776609C405.82885085574554,770.2608901728944 408.2933985330072,771.206575734801 409.52567237163794,769.7880473919412L410.3471882640585,769.7880473919412L409.1149144254277,771.2065757348012C409.52567237163794,771.6794185157544 409.93643031784825,771.6794185157544 410.3471882640585,772.1522612967076C410.7579462102687,772.6251040776609 411.16870415647907,772.6251040776609 411.5794621026893,773.0979468586141C412.4009779951098,772.6251040776609 412.8117359413201,772.6251040776609 413.63325183374064,772.1522612967076C413.2224938875304,773.0979468586141 413.2224938875304,773.5707896395675 413.2224938875304,774.0436324205208L415.2762836185817,774.0436324205208L415.2762836185817,772.6251040776609C415.2762836185817,771.206575734801 416.09779951100234,771.206575734801 416.91931540342284,771.6794185157544C418.1515892420536,772.6251040776609 418.97310513447417,772.1522612967076 420.2053789731049,771.6794185157544C421.4376528117358,771.6794185157544 422.2591687041563,770.733732953848 422.66992665036656,769.315204610988L421.0268948655255,769.315204610988C421.0268948655255,768.8423618300346 421.43765281173575,768.3695190490814 421.43765281173575,767.8966762681281L421.43765281173575,766.0053051443149L421.84841075794594,766.0053051443149C421.84841075794594,766.9509907062214 422.2591687041562,767.4238334871748 422.2591687041562,768.3695190490813C423.08068459657676,767.8966762681281 424.3129584352075,767.8966762681281 425.54523227383834,767.4238334871748L425.54523227383834,768.8423618300346C426.77750611246915,769.315204610988 428.0097799510999,770.2608901728945 428.8312958435205,772.1522612967076C428.8312958435205,772.1522612967076 429.24205378973073,772.6251040776609 429.24205378973073,772.1522612967076L432.9388753056232,770.7337329538477C434.58190709046426,770.2608901728944 435.8141809290951,769.7880473919412 437.4572127139361,769.3152046109877C438.27872860635665,769.3152046109877 438.6894865525669,770.2608901728943 439.9217603911977,771.206575734801C441.1540342298285,771.206575734801 445.2616136919312,772.1522612967075 446.90464547677226,773.5707896395674C447.3154034229825,774.0436324205206 448.1369193154031,773.5707896395674 448.54767726161333,773.5707896395674C449.7799511002442,773.0979468586141 451.01222493887497,773.0979468586141 452.2444987775058,772.6251040776609L452.65525672371604,773.0979468586141C453.0660146699263,774.0436324205206 453.0660146699263,774.9893179824272 453.0660146699263,775.9350035443338C454.2982885085571,777.3535318871938 455.5305623471879,778.7720602300535 457.173594132029,776.407846325287C457.173594132029,776.8806891062402 456.76283618581874,777.3535318871936 456.76283618581874,777.826374668147C457.173594132029,777.826374668147 457.173594132029,778.2992174491002 457.5843520782393,778.2992174491002C458.4058679706598,778.7720602300535 460.87041564792145,779.2449030110067 461.28117359413176,778.2992174491002C461.691931540342,776.8806891062402 462.5134474327625,777.3535318871938 462.92420537897283,777.3535318871938C463.3349633251831,777.826374668147 463.3349633251831,778.7720602300536 463.7457212713934,779.71774579196L463.7457212713934,776.4078463252871C464.56723716381396,777.3535318871938 464.9779951100242,777.8263746681471 465.3887530562345,778.7720602300536C465.7995110024447,779.2449030110068 465.7995110024447,779.71774579196 465.7995110024447,780.1905885729135C465.3887530562345,780.1905885729135 464.9779951100242,780.1905885729135 464.56723716381396,780.6634313538667L463.33496332518314,780.6634313538667C464.56723716381396,781.6091169157733 464.1564792176037,783.9733308205397 465.7995110024447,783.0276452586331C466.21026894865497,782.5548024776798 466.6210268948653,781.6091169157733 467.03178484107553,781.1362741348199C467.03178484107553,781.6091169157733 467.4425427872858,782.5548024776798 467.4425427872858,783.0276452586331C467.853300733496,783.0276452586331 468.26405867970635,783.0276452586331 468.6748166259166,783.5004880395863C469.4963325183371,784.9190163824463 470.72860635696793,784.4461736014929 471.9608801955987,784.9190163824463C472.78239608801925,784.9190163824463 473.1931540342295,785.8647019443528 473.6039119804398,786.3375447253062C474.0146699266501,787.2832302872126 474.4254278728604,788.2289158491193 475.65770171149114,788.2289158491193C476.4792176039117,788.2289158491193 477.3007334963322,789.1746014110258 478.1222493887528,790.1202869729324C479.35452322738354,791.065972534839 480.58679706601436,792.9573436586521 481.8190709046452,793.9030292205588C483.87286063569655,795.3215575634187 485.9266503667479,797.2129286872317 488.3911980440095,796.7400859062785C489.6234718826403,796.7400859062785 490.85574572127103,797.685771468185 492.08801955990197,797.685771468185C493.3202933985328,797.685771468185 494.9633251833738,797.685771468185 496.6063569682148,797.2129286872317C496.6063569682148,798.6314570300916 496.6063569682148,799.1042998110448 497.8386308068457,799.1042998110448C498.6601466992662,799.1042998110448 499.48166259168676,799.1042998110448 500.3031784841072,799.577142591998C502.76772616136884,799.577142591998 504.82151589242017,800.9956709348579 507.28606356968186,800.5228281539046C508.10757946210236,800.5228281539046 508.92909535452293,800.9956709348578 509.7506112469434,801.4685137158111C512.215158924205,802.4141992777176 513.8581907090461,804.7784131824841 516.7334963325179,804.3055704015308C517.1442542787282,804.3055704015308 517.9657701711487,804.3055704015308 518.3765281173592,804.7784131824841C519.1980440097797,805.7240987443905 519.60880195599,805.2512559634373 520.0195599022002,804.7784131824841C520.8410757946208,804.3055704015308 521.6625916870413,803.8327276205775 522.0733496332515,804.3055704015308C523.7163814180926,804.7784131824841 525.770171149144,805.2512559634373 527.4132029339851,805.7240987443906L529.0562347188262,805.7240987443906C530.288508557457,805.2512559634374 531.931540342298,804.7784131824842 533.1638141809289,804.7784131824842C535.2176039119802,804.305570401531 537.2713936430316,804.305570401531 539.3251833740829,804.305570401531L540.1466992665034,804.305570401531C543.0220048899752,803.3598848396244 546.3080684596574,802.4141992777177 549.1833740831293,801.4685137158112C551.2371638141806,800.9956709348579 553.2909535452319,800.5228281539047 555.7555012224935,800.0499853729514C558.2200488997552,799.5771425919979 560.2738386308065,798.6314570300915 562.738386308068,798.1586142491382C563.5599022004885,798.1586142491382 564.3814180929091,798.1586142491382 565.61369193154,797.685771468185C568.8997555012221,797.2129286872317 572.1858190709041,795.7944003443718 575.4718826405864,797.685771468185L580.4009779951095,799.1042998110448C582.4547677261609,799.577142591998 584.097799511002,800.9956709348579 586.1515892420534,800.9956709348579C586.5623471882636,800.9956709348579 587.3838630806843,801.4685137158112 587.7946210268944,801.4685137158112C590.259168704156,802.4141992777177 592.3129584352073,804.7784131824842 595.1882640586794,803.8327276205777C596.4205378973102,803.3598848396244 598.4743276283615,804.305570401531 599.7066014669923,804.7784131824842C600.938875305623,805.2512559634374 602.1711491442538,805.2512559634374 603.4034229828846,805.7240987443906L603.4034229828846,806.6697843062972C605.8679706601463,806.6697843062972 608.3325183374079,807.1426270872504 610.7970660146696,805.7240987443906C611.6185819070901,805.2512559634374 612.0293398533004,804.7784131824842 612.8508557457209,804.7784131824842C614.4938875305621,804.305570401531 616.5476772616134,804.305570401531 618.1907090464545,805.2512559634374C619.4229828850853,805.7240987443906 621.4767726161366,805.2512559634374 622.7090464547674,804.305570401531C624.3520782396085,803.3598848396244 626.4058679706599,803.8327276205777 628.048899755501,803.8327276205777C629.691931540342,803.8327276205777 630.9242053789727,804.305570401531 632.567237163814,803.8327276205777C636.2640586797063,803.3598848396244 639.5501222493884,801.9413564967645 643.6577017114911,802.4141992777177C645.3007334963322,802.4141992777177 646.9437652811733,802.887042058671 648.5867970660142,802.4141992777177C651.8728606356965,801.9413564967645 654.3374083129581,803.3598848396243 656.8019559902197,805.2512559634374C658.855745721271,807.1426270872505 661.3202933985326,808.5611554301103 663.7848410757942,809.9796837729702C665.4278728606353,810.9253693348768 667.8924205378969,809.0339982110637 667.8924205378969,806.6697843062973L667.8924205378969,802.4141992777177C667.8924205378969,790.1202869729324 667.8924205378969,778.2992174491005 668.3031784841071,766.0053051443152C668.3031784841071,757.494135087156 668.7139364303173,748.9829650299971 668.7139364303173,739.9989521918848C668.7139364303173,730.5420965728191 668.3031784841071,165.49497333364835 668.3031784841071,156.0381177145827C670.7677261613687,151.78253268600318 669.9462102689482,148.47263321933022 672,146.1084193145638ZM406.23960880195597,763.1682484585955C407.06112469437653,760.8040345538291 408.70415647921754,761.2768773347824 409.9364303178484,761.7497201157356C409.11491442542786,763.6410912395487 407.47188264058684,762.695405677642 406.23960880195597,763.1682484585955ZM409.9364303178484,765.5324623633619C410.3471882640587,764.5867768014555 410.3471882640587,763.1682484585955 411.57946210268955,763.1682484585955C411.9902200488998,763.1682484585955 412.8117359413203,763.6410912395487 413.2224938875306,763.6410912395487C412.81173594132036,764.5867768014554 412.4009779951101,765.0596195824087 411.99022004889986,766.0053051443152C411.5794621026896,766.0053051443152 410.757946210269,766.0053051443152 409.9364303178485,765.5324623633619ZM411.57946210268955,770.2608901728946C412.4009779951101,769.7880473919414 412.8117359413203,768.8423618300347 413.63325183374087,768.3695190490815C414.0440097799511,768.3695190490815 414.4547677261614,768.8423618300347 414.86552567237163,768.8423618300347C414.86552567237163,770.7337329538481 413.22249388753056,771.2065757348013 411.57946210268955,770.2608901728946ZM413.2224938875306,755.1299211823898C413.63325183374087,755.602763963343 413.63325183374087,756.0756067442962 414.4547677261614,756.5484495252497L410.7579462102689,756.5484495252497C410.7579462102689,756.0756067442964 410.7579462102689,755.6027639633431 411.16870415647924,755.1299211823898C412.8117359413203,755.1299211823898 413.22249388753056,755.1299211823898 413.22249388753056,753.2385500585766C414.4547677261613,753.7113928395299 416.0977995110025,752.2928644966702 416.5085574572127,754.6570784014365C415.2762836185819,755.1299211823898 414.4547677261613,755.1299211823898 413.22249388753056,755.1299211823898Z" fill="#000"></path>
            </clipPath>
          </defs>
        </svg>

        {/* ======================================================= */}
        {/* SECCIÓN 1: Portada con Hero y Título                    */}
        {/* ======================================================= */}
        <section id="welcome" className="pt-8 text-center relative flex flex-col items-center z-20">
          <div className="flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/mariposa-azul.png"
              alt="Mariposa"
              className="w-5 h-auto object-contain animate-flutter"
            />
            <h1 className="font-script text-5xl text-[#2F5A84]">
              {data.subtitulo || "My Quinceañera"}
            </h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/mariposa-azul.png"
              alt="Mariposa"
              className="w-5 h-auto object-contain animate-flutter"
            />
          </div>

          {/* CONTENEDOR DE LA FOTO DE PORTADA CON CLIP-PATH OFICIAL DE CANVA (100% SIN PADDING) */}
          <div className="w-full mt-2">
            <div className="relative w-full max-w-[430px] h-[520px] sm:h-[560px] mx-auto overflow-hidden bg-transparent">
              {/* Foto aplicando el clipPath oficial */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.fotoPortadaUrl || "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blue-butterfly/foto-columpio-portada.png"}
                alt={data.titulo}
                onError={(e) => {
                  e.currentTarget.src = "/assets/template-butterfly/foto-columpio-portada.png";
                }}
                className="w-full h-full object-cover clip-canva-torn select-none"
              />

              {/* TARJETA FORMAL DE PRESENTACIÓN (HERO CARD) */}
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[84%] max-w-[310px] bg-[#FFFDF9]/95 border border-[#D8B772]/70 rounded-2xl p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.15)] text-center backdrop-blur-md pointer-events-none">
                {/* Icono decorativo */}
                <span className="text-sm text-[#2F5A84] block mb-1">🦋</span>

                {/* Subtítulo / Encabezado */}
                <p className="font-serif-roman text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-semibold">
                  {data.subtitulo || (isEn ? "My Sweet Fifteen" : "Mis Quince Años")}
                </p>

                {/* Nombre Principal */}
                <h2 className="font-script text-4xl text-[#2F5A84] my-1 leading-tight">
                  {data.titulo}
                </h2>

                {/* Frase emotiva */}
                <p className="font-cormorant italic text-[13px] text-slate-600 my-2 leading-relaxed">
                  {data.frasePersonalizada ||
                    (isEn
                      ? "“I thank God for this special day and invite you to share this magical night with me.”"
                      : "“Doy gracias a Dios por este día tan especial y te invito a compartir conmigo esta noche mágica.”")}
                </p>

                {/* Divisor ornamental sutil */}
                <div className="flex items-center justify-center gap-2 my-2">
                  <span className="h-[1px] w-8 bg-[#D8B772]/50"></span>
                  <span className="text-[#D8B772] text-[10px]">❦</span>
                  <span className="h-[1px] w-8 bg-[#D8B772]/50"></span>
                </div>

                {/* Fecha Formal */}
                <p className="font-serif-roman text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-medium">
                  {formalDateDisplay}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 2: MÓDULO MUSICAL (DÍPTICO & DISCO DE VINILO)    */}
        {/* ======================================================== */}
        <section className="relative w-full py-10 px-4 flex justify-center items-center overflow-visible select-none z-20">
          <div className="relative w-full max-w-[390px] h-[340px] flex items-center justify-center">
            {/* 1. TEXTO EN ARCO Y NOTAS MUSICALES */}
            <div className="absolute -top-3 left-2 z-20 pointer-events-none">
              <span className="block font-serif-roman text-[10px] tracking-[0.25em] text-slate-500 uppercase -rotate-12 translate-x-3 translate-y-2 font-semibold">
                {data.textoDisco || (isEn ? "Click to Play Music" : "Toca para Escuchar Música")}
              </span>
              <span className="block text-2xl text-slate-700 font-serif translate-x-20 -translate-y-2 rotate-12">
                𝄞 𝅘𝅥𝅯 𝅘𝅥𝅮
              </span>
            </div>

            {/* 2. DISCO DE VINILO */}
            <div
              id="vinylRecord"
              onClick={toggleMusic}
              className={`absolute -top-1 left-2 w-36 h-36 rounded-full bg-[#111] border-[3px] border-slate-700 shadow-2xl flex items-center justify-center z-10 cursor-pointer transition-transform duration-500 hover:scale-105 ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "4s" }}
              title={isPlaying ? (isEn ? "Pause music" : "Pausar música") : (isEn ? "Play music" : "Reproducir música")}
            >
              <div className="w-28 h-28 rounded-full border border-neutral-700/60 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-neutral-700/50 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#ABC7DE] border-2 border-white shadow-inner flex items-center justify-center text-white text-base pl-0.5">
                    {isPlaying ? "❚❚" : "▶"}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DÍPTICO FOTOGRÁFICO */}
            <div className="relative z-20 w-[290px] h-[200px] bg-white p-2 rounded-sm shadow-[0_12px_30px_rgba(0,0,0,0.18)] border border-slate-200/80 flex gap-1 transform rotate-[-1deg] translate-x-4 translate-y-3">
              <div className="w-1/2 h-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.fotoInfanciaUrl || "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blue-butterfly/foto-sesion-1.jpg"}
                  alt="Sesión Foto 1"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/template-butterfly/foto-sesion-1.jpg";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/2 h-full overflow-hidden bg-slate-100 border-l border-white/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.fotoActualUrl || "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blue-butterfly/foto-sesion-2.jpg"}
                  alt="Sesión Foto 2"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/template-butterfly/foto-sesion-2.jpg";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 4. FLORES ESQUINAS */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/flores-azules-esquina-izq.png"
              alt="Flores Azules Izquierda"
              className="absolute -bottom-6 -left-3 w-36 h-auto z-30 pointer-events-none drop-shadow-md"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/flores-azules-esquina-der.png"
              alt="Flores Azules Derecha"
              className="absolute -bottom-4 right-1 w-24 h-auto z-30 pointer-events-none drop-shadow-sm"
            />

            {/* 5. MARIPOSA PERCHADA 3D */}
            <div
              className="absolute top-4 -right-1 z-30 pointer-events-none"
              style={{ perspective: "500px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/template-butterfly/mariposa-perchada.png"
                alt="Blue Butterfly"
                className="w-20 h-auto animate-flutter drop-shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 3: MENSAJE EMOTIVO / BENDICIÓN                  */}
        {/* ======================================================= */}
        <section className="px-8 py-4 text-center z-20">
          <p className="font-cormorant italic text-base leading-relaxed text-slate-700">
            {data.frasePersonalizada ||
              (isEn
                ? "“I thank God for granting me the blessing of celebrating my sweet fifteen, and my parents for guiding every step of my journey with unconditional love.”"
                : "“Doy gracias a Dios por concederme la dicha de celebrar mis quince primaveras, y a mis padres por guiar cada uno de mis pasos con amor incondicional.”")}
          </p>
          {data.autorBendicion && (
            <p className="font-serif-roman text-[10px] tracking-[0.2em] text-[#C5A059] uppercase mt-2 font-semibold">
              {data.autorBendicion}
            </p>
          )}

          {/* Separador de flores doradas original */}
          <div className="w-full max-w-[280px] mx-auto my-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/separador-flores.png"
              alt="Separador Floral"
              className="w-full h-auto object-contain"
            />
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 4: TARJETA DE FECHA Y LUGAR + RETRATO CON RASGADO */}
        {/* ======================================================== */}
        <section className="relative w-full py-6 px-4 flex flex-col items-center overflow-visible select-none z-20">
          {/* 1. PLACA DE FECHA Y LUGAR */}
          <div className="relative w-full max-w-[340px] mb-8">
            {/* Marco de fondo de pergamino con flores */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/assets/template-butterfly/marco-fecha-pergamino.png" 
              alt="Marco Fecha" 
              className="w-full h-auto drop-shadow-sm select-none"
            />

            {/* Contenido dinámico centrado */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-3 text-center pointer-events-none">
              <p className="font-serif-roman text-xs tracking-[0.25em] text-[#C5A059] uppercase font-bold">
                {isEn ? eventMonth : (data.fechaPlacaMes || eventMonth)}
              </p>
              
              <div className="flex items-center gap-3 my-1 border-t border-b border-[#D8B772]/60 py-0.5 px-3">
                <span className="font-serif-roman text-[10px] tracking-widest text-slate-500 uppercase">
                  {eventWeekday}
                </span>
                <span className="font-serif-roman text-sm font-bold text-[#2F5A84]">
                  {eventDay}
                </span>
                <span className="font-serif-roman text-[10px] tracking-widest text-slate-500 uppercase">
                  {isEn ? `AT ${eventTime}` : (data.fechaPlacaHora || `A LAS ${eventTime}`)}
                </span>
              </div>

              <p className="font-serif-roman text-[10px] tracking-widest text-slate-400">
                {eventYear}
              </p>
              
              <div className="mt-1">
                <p className="font-serif-roman text-[9px] tracking-[0.15em] uppercase text-slate-600 font-semibold">
                  {data.fechaPlacaLugar || data.recepcionNombre || "QUINCE PALACE"}
                </p>
                <p className="text-[8px] text-slate-400">
                  {data.recepcionDireccion || "123 Quince St, City, ST 90210"}
                </p>
              </div>
            </div>

            {/* Mariposa con aleteo en la esquina inferior izquierda */}
            <div 
              className="absolute -bottom-4 -left-3 w-16 z-20 pointer-events-none"
              style={{ perspective: "500px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/assets/template-butterfly/mariposa-azul.png" 
                alt="Mariposa" 
                className="w-full h-auto drop-shadow-md animate-flutter"
              />
            </div>
          </div>

          {/* 2. RETRATO DE GALA CON RECORTE OFICIAL DE CANVA */}
          <div className="relative w-full max-w-[390px] h-[480px] sm:h-[520px] mx-auto overflow-hidden bg-slate-100 shadow-xl my-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={data.fotoCierreUrl || "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blue-butterfly/foto-gala-vestido.jpg"} 
              alt="Quinceañera Gala" 
              onError={(e) => {
                e.currentTarget.src = "/assets/template-butterfly/foto-gala-vestido.jpg";
              }}
              className="w-full h-full object-cover clip-canva-gala select-none"
            />
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 5: CONTADOR REGRESIVO (COUNTDOWN)               */}
        {/* ======================================================= */}
        <section className="px-4 py-6 z-20">
          <div className="relative w-full aspect-[1536/1024] max-w-[390px] mx-auto flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/pergamino-countdown.png"
              alt="Pergamino de Cuenta Regresiva"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 drop-shadow-md"
            />

            <div className="relative z-20 flex flex-col items-center justify-center text-center px-8 pt-2">
              <span className="font-serif-roman text-[10px] tracking-[0.25em] uppercase text-[#2F5A84] font-semibold mb-2">
                {data.countdownEncabezado || (isEn ? "Save The Date" : "Faltan sólo...")}
              </span>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 font-serif-roman text-[#2F5A84]">
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-bold">{timeLeft.days}</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 mt-0.5">
                    {isEn ? "Days" : "Días"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-bold">{timeLeft.hours}</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 mt-0.5">
                    {isEn ? "Hours" : "Horas"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-bold">{timeLeft.minutes}</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 mt-0.5">
                    {isEn ? "Min" : "Min"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-bold">{timeLeft.seconds}</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 mt-0.5">
                    {isEn ? "Sec" : "Seg"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 6: ITINERARIO (RÉPLICA EXACTA DE CANVA)          */}
        {/* ======================================================== */}
        <section className="relative w-full py-10 px-2 select-none z-20">
          {/* Título con mancha de acuarela */}
          <div className="text-center mb-8 relative">
            <span className="inline-block bg-[#D3E3F0]/60 text-[#2F5A84] font-serif-roman text-xs tracking-[0.3em] uppercase py-1.5 px-6 rounded-full border border-blue-100 shadow-xs">
              {isEn ? "The Program" : "Itinerario"}
            </span>
          </div>

          {/* Contenedor Maestro: Grid de 3 columnas (Izquierda - Eje Floral - Derecha) */}
          {(() => {
            const leftItems = itineraryList.filter((_: any, idx: number) => idx % 2 === 0);
            const rightItems = itineraryList.filter((_: any, idx: number) => idx % 2 === 1);
            return (
              <div className="relative w-full max-w-[390px] mx-auto flex justify-center">
                {/* COLUMNA 1: Eventos del lado Izquierdo */}
                <div className="w-[42%] flex flex-col justify-between py-2 pr-1">
                  {leftItems.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={`text-center relative ${idx < leftItems.length - 1 ? "pb-10" : ""}`}
                    >
                      <div className="w-16 h-16 mx-auto mb-1 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.icon || "/assets/template-butterfly/itinerario-welcome.png"}
                          alt={item.titulo}
                          className="max-h-full object-contain drop-shadow-sm select-none"
                        />
                      </div>
                      <p className="font-serif-roman text-[11px] font-semibold text-[#8C7A5B] tracking-wider">
                        {item.hora}
                      </p>
                      <p className="font-script text-2xl text-[#8C7A5B] leading-none mt-0.5">
                        {item.titulo}
                      </p>
                      {/* Conector horizontal hacia la guirnalda central */}
                      <span className="absolute -right-3.5 top-8 w-4 h-[1px] bg-[#D8B772]/70" />
                    </div>
                  ))}
                </div>

                {/* COLUMNA 2: Eje Central Floral (Guirnalda Vertical Completa) */}
                <div className="w-[16%] flex justify-center relative">
                  {/* Imagen de la guirnalda continua estirada a todo el alto */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/template-butterfly/guirnalda-itinerario-eje.png"
                    alt="Eje Floral"
                    className="w-full h-full object-fill pointer-events-none select-none drop-shadow-xs"
                  />
                </div>

                {/* COLUMNA 3: Eventos del lado Derecho */}
                <div className="w-[42%] flex flex-col justify-between py-2 pl-1 pt-16">
                  {rightItems.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={`text-center relative ${idx < rightItems.length - 1 ? "pb-10" : ""}`}
                    >
                      {/* Conector horizontal desde la guirnalda */}
                      <span className="absolute -left-3.5 top-8 w-4 h-[1px] bg-[#D8B772]/70" />
                      <div className="w-16 h-16 mx-auto mb-1 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.icon || "/assets/template-butterfly/itinerario-entrance.png"}
                          alt={item.titulo}
                          className="max-h-full object-contain drop-shadow-sm select-none"
                        />
                      </div>
                      <p className="font-serif-roman text-[11px] font-semibold text-[#8C7A5B] tracking-wider">
                        {item.hora}
                      </p>
                      <p className="font-script text-2xl text-[#8C7A5B] leading-none mt-0.5">
                        {item.titulo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 7: CÓDIGO DE VESTIMENTA (DRESS CODE)            */}
        {/* ======================================================= */}
        <section className="px-4 sm:px-6 py-6 text-center z-20">
          <h3 className="font-serif-roman text-xs tracking-[0.2em] text-[#2F5A84] uppercase mb-2 font-bold">
            {isEn ? "Dress Code" : "Código de Vestimenta"}
          </h3>

          {/* Marco barroco ovalado con retrato */}
          <div className="relative w-64 h-64 mx-auto my-2 flex items-center justify-center">
            {/* Foto en z-10 */}
            <div className="w-[176px] h-[176px] rounded-full overflow-hidden z-10 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.fotoActualUrl || "/assets/template-butterfly/foto-sesion-2.jpg"}
                alt="Retrato de Gala"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Marco barroco en z-20 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/marco-dress-code.png"
              alt="Marco Barroco"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-xl"
            />
          </div>

          {/* Tríptico de Etiqueta Oficial de Canva: Vestido Maniquí - Texto - Traje Maniquí */}
          <div className="relative w-full max-w-[370px] mx-auto mt-4 flex items-center justify-between px-2">
            {/* 1. Maniquí Vestido de Gala Femenino (Izquierda) */}
            <div className="h-32 sm:h-36 w-20 sm:w-24 flex-shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/template-butterfly/vestido-maniqui.png"
                alt="Vestido Formal de Dama"
                className="h-full w-auto object-contain drop-shadow-md select-none"
              />
            </div>

            {/* 2. Textos Centrales Protocolarios */}
            <div className="flex-1 text-center px-1">
              <p className="font-script text-3xl sm:text-4xl text-[#AF936A] leading-tight">
                {isEn ? "Dress Code" : "Código de Vestir"}
              </p>
              <p className="font-serif-roman text-xs sm:text-[13px] font-bold text-[#2F5A84] tracking-[0.15em] uppercase mt-1">
                {data.dressCodeEtiqueta || data.dressCodeTitulo || (isEn ? "Formal Attire" : "Formal & Rigurosa Etiqueta")}
              </p>
              <p className="font-cormorant italic text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-2 max-w-[175px] mx-auto">
                {data.dressCodeColoresReservados ||
                  data.dressCodeNota ||
                  (isEn
                    ? "Please join us in your finest formal attire. Shades of sky blue and white are exclusively reserved for the quinceañera."
                    : "Acompáñanos luciendo tu mejor atuendo formal. Tonos azul celeste y blanco reservados exclusivamente para la quinceañera.")}
              </p>
            </div>

            {/* 3. Maniquí Traje Formal Masculino (Derecha - Proporción equilibrada) */}
            <div className="h-32 sm:h-36 w-16 sm:w-20 flex-shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/template-butterfly/traje-maniqui.png"
                alt="Traje Formal de Caballero"
                className="h-full w-auto object-contain drop-shadow-md select-none"
              />
            </div>
          </div>

          {/* Separador Floral Ornamental Inferior */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto mt-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/separador-flores.png"
              alt="Separador Floral"
              className="w-full h-auto object-contain drop-shadow-xs"
            />
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 8: MAPA Y NAVEGACIÓN (THE LOCATION)             */}
        {/* ======================================================= */}
        <section className="px-6 py-6 text-center z-20">
          <h3 className="font-serif-roman text-xs tracking-[0.25em] text-[#2F5A84] uppercase mb-2 font-bold">
            {isEn ? "Reception & Location" : "Recepción & Ubicación"}
          </h3>
          <p className="text-sm font-semibold text-slate-800">{data.recepcionNombre}</p>
          <p className="text-xs text-slate-500 mb-3">{data.recepcionDireccion}</p>

          {/* MAPA EMBEBIDO INTERACTIVO */}
          {(() => {
            const fullAddress = `${data.recepcionNombre || ""} ${data.recepcionDireccion || ""}`.trim();
            const embedUrl = getMapEmbedUrl(data.recepcionMapUrl, fullAddress);
            return embedUrl ? (
              <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden shadow-md border border-[#D8B772]/50 my-4 bg-slate-100 relative">
                <iframe
                  title={`Ubicación - ${data.recepcionNombre}`}
                  src={embedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : null;
          })()}

          <a
            href={getMapDirectionsUrl(
              data.recepcionMapUrl,
              `${data.recepcionNombre || ""} ${data.recepcionDireccion || ""}`.trim()
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#2F5A84] text-white py-3.5 rounded-xl font-serif-roman text-xs uppercase tracking-widest hover:bg-[#203e5c] transition shadow-md"
          >
            <MapPin className="w-3.5 h-3.5" />
            {isEn ? "Directions / View Map" : "Cómo Llegar / Ver en Mapa"}
          </a>

          {/* CEREMONIA RELIGIOSA (SI EXISTE) */}
          {data.ceremoniaNombre && (
            <div className="mt-8 pt-6 border-t border-[#D8B772]/30 text-center">
              <span className="font-serif-roman text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-bold block mb-1">
                {isEn ? "Religious Ceremony / Church" : "Ceremonia Religiosa / Iglesia"}
              </span>
              <p className="text-sm font-semibold text-slate-800">{data.ceremoniaNombre}</p>
              {data.ceremoniaDireccion && (
                <p className="text-xs text-slate-500 mb-3">{data.ceremoniaDireccion}</p>
              )}

              {(() => {
                const fullCeremonyAddress = `${data.ceremoniaNombre || ""} ${data.ceremoniaDireccion || ""}`.trim();
                const ceremonyEmbedUrl = getMapEmbedUrl(data.ceremoniaMapUrl, fullCeremonyAddress);
                return ceremonyEmbedUrl ? (
                  <div className="w-full h-48 rounded-2xl overflow-hidden shadow-md border border-[#D8B772]/40 my-3 bg-slate-100 relative">
                    <iframe
                      title={`Ceremonia - ${data.ceremoniaNombre}`}
                      src={ceremonyEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                ) : null;
              })()}

              <a
                href={getMapDirectionsUrl(
                  data.ceremoniaMapUrl,
                  `${data.ceremoniaNombre || ""} ${data.ceremoniaDireccion || ""}`.trim()
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-white border border-[#2F5A84] text-[#2F5A84] py-3 rounded-xl font-serif-roman text-xs uppercase tracking-widest hover:bg-slate-50 transition shadow-sm mt-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                {isEn ? "View Church on Map" : "Ver Iglesia en Mapa"}
              </a>
            </div>
          )}
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 9: MESA DE REGALOS / LLUVIA DE SOBRES           */}
        {/* ======================================================= */}
        <section className="px-6 py-6 text-center z-20">
          <div className="w-44 h-44 mx-auto mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/caja-regalos.png"
              alt="Cofre de Regalos"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          <h3 className="font-serif-roman text-xs tracking-[0.2em] text-[#2F5A84] uppercase font-bold">
            {isEn ? "Gift Table / Wishing Well" : "Lluvia de Sobres"}
          </h3>
          <p className="font-cormorant italic text-sm text-slate-600 max-w-xs mx-auto mt-1">
            {data.regalosMensaje ||
              (isEn
                ? "“Your presence is our greatest gift. Should you wish to honor the quinceañera with a token of affection, a wishing well will be available at the reception.”"
                : "“Tu presencia es nuestro mayor regalo. Si deseas tener un detalle con la quinceañera, dispondremos de un cofre en la recepción.”")}
          </p>

          {(data.regalosZelle || data.regalosCashApp) && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-serif-roman">
              {data.regalosZelle && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D8B772]/60 text-slate-700 rounded-full text-[11px] shadow-2xs">
                  <span className="font-bold text-[#7414CA]">Zelle:</span> {data.regalosZelle}
                </span>
              )}
              {data.regalosCashApp && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D8B772]/60 text-slate-700 rounded-full text-[11px] shadow-2xs">
                  <span className="font-bold text-[#00D632]">Cash App:</span> {data.regalosCashApp}
                </span>
              )}
            </div>
          )}
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 10: CONFIRMACIÓN DE ASISTENCIA (RSVP)           */}
        {/* ======================================================= */}
        <section id="rsvp" className="px-4 py-6 z-20">
          <div className="relative w-full max-w-[390px] mx-auto -mb-6 z-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/sobre-rsvp.png"
              alt="RSVP Encabezado"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 pt-10 rounded-3xl border border-[#D8B772]/60 shadow-xl text-center relative z-10">
            <h3 className="font-script text-4xl text-[#2F5A84] my-1">
              {isEn ? "RSVP" : "Confirmar Asistencia"}
            </h3>
            <p className="text-[11px] text-slate-400 mb-5 uppercase tracking-wider font-serif-roman">
              {data.rsvpFechaLimite ? (
                data.rsvpFechaLimite
              ) : (
                <>
                  {isEn ? "Please confirm by " : "Favor de confirmar antes del "}
                  {data.fechaLimiteRsvp || (isEn ? "October 20th" : "20 de Octubre")}
                </>
              )}
            </p>

            {/* Alerta de confirmación previa / actualización de pases */}
            {rsvpFeedback && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-serif-roman border text-center transition ${
                  rsvpFeedback.isUpdate
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
                  <h4 className="font-script text-3xl text-[#2F5A84]">
                    {isEn ? "See You There!" : "¡Te Esperamos!"}
                  </h4>
                </div>
                <div className="bg-[#F4F9FD] border border-blue-100 rounded-2xl p-4 text-xs font-serif-roman text-slate-700 leading-relaxed max-w-sm mx-auto shadow-xs">
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
                    className="w-full bg-[#F4F9FD] border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2F5A84]"
                    placeholder={isEn ? "e.g. The Morales Family" : "Ej. Familia Morales"}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-serif-roman">
                    {isEn ? "Phone Number (For SMS Confirmation & Location)" : "Teléfono Móvil (Para confirmación y mapa por SMS)"}
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-[#F4F9FD] border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2F5A84]"
                    placeholder={isEn ? "e.g. 555-123-4567" : "Ej. 55 1234 5678"}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-serif-roman">
                    {isEn ? "Confirmed Guests" : "Pases Confirmados"}
                  </label>
                  <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-600">
                    {Array.from(
                      { length: Math.max(1, data.maxPasesPorInvitado || 4) },
                      (_, i) => String(i + 1)
                    ).map((seat) => (
                      <label key={seat} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="seats"
                          value={seat}
                          checked={selectedSeats === seat}
                          onChange={() => setSelectedSeats(seat)}
                          className="accent-[#2F5A84]"
                        />
                        {seat}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="w-full bg-[#2F5A84] hover:bg-[#203e5c] text-white py-3.5 px-4 rounded-xl font-serif-roman text-xs uppercase tracking-widest transition shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
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
        {/* SECCIÓN 11: CORTE DE HONOR, PADRINOS Y CARTA DE CIERRE */}
        {/* ======================================================= */}
        <section className="px-6 py-6 text-center z-20">
          {corte && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-100 mb-6 shadow-sm">
              <h4 className="font-serif-roman text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-4">
                {isEn ? "Court of Honor" : "Corte de Honor"}
              </h4>
              <div className="space-y-3 text-xs text-slate-700">
                {corte.chambelan && (
                  <p>
                    <strong className="text-[#2F5A84]">
                      {isEn ? "Chamberlain of Honor:" : "Chambelán de Honor:"}
                    </strong>{" "}
                    {corte.chambelan}
                  </p>
                )}
                {corte.damas && corte.damas.length > 0 && (
                  <p>
                    <strong className="text-[#2F5A84]">
                      {isEn ? "Ladies of Honor / Damas:" : "Damitas:"}
                    </strong>{" "}
                    {corte.damas.join(", ")}
                  </p>
                )}
                {corte.parents && (
                  <p>
                    <strong className="text-[#2F5A84]">{isEn ? "Parents:" : "Padres:"}</strong>{" "}
                    {corte.parents}
                  </p>
                )}
                {corte.padrinos && corte.padrinos.length > 0 && (
                  <p>
                    <strong className="text-[#2F5A84]">
                      {isEn ? "Godparents / Padrinos:" : "Padrinos:"}
                    </strong>{" "}
                    {corte.padrinos.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Botón Añadir a Calendario */}
          <div className="my-4">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#C5A059]/60 text-[#2F5A84] font-serif-roman text-xs uppercase tracking-widest hover:bg-white/60 transition shadow-sm"
            >
              📅 {isEn ? "Add to Calendar" : "Añadir al Calendario"}
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 pt-2 pb-6 text-center z-20">
          <div className="w-36 h-36 mx-auto mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/ramo-flores.png"
              alt="Ramillete de Flores"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          <p className="font-cormorant italic text-base text-slate-600">
            {data.mensajeDespedida ||
              (isEn
                ? "We look forward to celebrating this unforgettable milestone with you."
                : "Esperamos contar con tu valiosa presencia.")}
          </p>
          <h3 className="font-script text-5xl text-[#2F5A84] mt-2">{data.titulo}</h3>
        </footer>
      </main>
    </div>
  );
}
