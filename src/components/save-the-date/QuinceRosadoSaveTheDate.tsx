"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Calendar,
  Clock,
  Heart,
  Sparkles,
  MapPin,
  CheckCircle2,
  CalendarPlus,
  Volume2,
  VolumeX,
  Share2,
  Send,
  Loader2,
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import confetti from "canvas-confetti";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar-generator";

export interface SaveTheDateProps {
  data: {
    slug: string;
    titulo: string;
    subtitulo?: string | null;
    subtituloEn?: string | null;
    mensaje?: string | null;
    fechaEvento: string | Date;
    fechaTextoPersonalizada?: string | null;
    ciudad?: string | null;
    colorSobre?: string | null;
    colorSello?: string | null;
    fotoPortadaUrl: string;
    fotoSobreAbiertoUrl?: string | null; // 2ª foto del hero, se ve al abrir el sobre
    galeriaFotosUrls: string[];
    musicaUrl?: string | null;
    musicaTitulo?: string | null;
    mostrarSobre: boolean;
    mostrarGaleria: boolean;
    mostrarContador: boolean;
    mostrarCalendario: boolean;
    mostrarPreRsvp: boolean;
    textoPreRsvp?: string | null;
    telefonoWhatsapp?: string | null;
    // Títulos bilingües configurables desde el admin
    tituloCalendarioEs?: string | null;
    tituloCalendarioEn?: string | null;
    tituloContadorEs?: string | null;
    tituloContadorEn?: string | null;
    tituloRsvpEs?: string | null;
    tituloRsvpEn?: string | null;
    preguntaRsvpEs?: string | null;
    preguntaRsvpEn?: string | null;
  };
  skipIntro?: boolean;
}

export default function QuinceRosadoSaveTheDate({
  data,
  skipIntro = false,
}: SaveTheDateProps) {
  // Idioma activo (por defecto entra en inglés: 'EN')
  const [idioma, setIdioma] = useState<"EN" | "ES">("EN");

  // Estado del sobre (abierto o cerrado)
  const [sobreAbierto, setSobreAbierto] = useState(
    skipIntro || !data.mostrarSobre
  );
  const [animandoSobre, setAnimandoSobre] = useState(false);

  // Música
  const [reproduciendo, setReproduciendo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contenidoRef = useRef<HTMLDivElement | null>(null);

  // Fecha del evento
  const fechaObj = useMemo(() => new Date(data.fechaEvento), [data.fechaEvento]);

  // Cuenta regresiva: Si la fecha objetivo quedó en el pasado (como septiembre 2026 en demo),
  // calculamos hacia una fecha futura (18 de septiembre de 2027) para que el reloj corra en vivo
  const fechaCountdown = useMemo(() => {
    const raw = new Date(data.fechaEvento);
    if (raw.getTime() <= Date.now()) {
      const futura = new Date(raw);
      futura.setFullYear(2027);
      if (futura.getTime() <= Date.now()) {
        futura.setFullYear(new Date().getFullYear() + 1);
      }
      return futura;
    }
    return raw;
  }, [data.fechaEvento]);

  const [tiempo, setTiempo] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  // Formulario Pre-RSVP
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [respuesta, setRespuesta] = useState<"SI" | "TAL_VEZ" | "NO">("SI");
  const [pases, setPases] = useState(1);
  const [notas, setNotas] = useState("");
  const [enviandoRsvp, setEnviandoRsvp] = useState(false);
  const [rsvpCompletado, setRsvpCompletado] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  // Nombre de la niña (por defecto "Melissa")
  const nombreFestejada = data.titulo || "Melissa";
  const fotoPrincipal =
    data.fotoPortadaUrl || "/assets/save-the-date/principal.jpeg";

  // Actualizar cuenta regresiva en tiempo real
  useEffect(() => {
    const target = fechaCountdown.getTime();
    const calcular = () => {
      const ahora = Date.now();
      const diff = target - ahora;

      if (diff <= 0) {
        setTiempo((prev) => {
          if (prev.dias === 0 && prev.horas === 0 && prev.minutos === 0 && prev.segundos === 0) return prev;
          return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
        });
        return;
      }

      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutos = Math.floor((diff % (1000 * 60)) / (1000 * 60));
      const segundos = Math.floor((diff % (1000 * 60)) / 1000);

      setTiempo({ dias, horas, minutos, segundos });
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [fechaCountdown]);

  // Manejar audio
  const toggleMusica = () => {
    if (!audioRef.current) return;
    if (reproduciendo) {
      audioRef.current.pause();
      setReproduciendo(false);
    } else {
      audioRef.current
        .play()
        .then(() => setReproduciendo(true))
        .catch(() => {});
    }
  };

  const abrirSobre = () => {
    if (animandoSobre || sobreAbierto) return;
    setAnimandoSobre(true);

    if (data.musicaUrl && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setReproduciendo(true))
        .catch(() => {});
    }

    // Efecto de apertura con confeti dorado y rosa
    setTimeout(() => {
      setSobreAbierto(true);
      setAnimandoSobre(false);

      try {
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#C5A059", "#F8D7DA", "#FFFFFF", "#7A002A"],
        });
      } catch {}
    }, 400);
  };

  const scrollHaciaDetalles = () => {
    if (contenidoRef.current) {
      contenidoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Enviar Pre-RSVP
  const handleEnviarPreRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setEnviandoRsvp(true);
    setRsvpError(null);

    try {
      const res = await fetch(`/api/save-the-date/${data.slug}/pre-rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefono,
          email,
          respuesta,
          pasesTentativos: respuesta === "NO" ? 0 : pases,
          notas,
        }),
      });

      const resData = await res.json();
      if (!res.ok || resData.error) {
        throw new Error(resData.error || "No se pudo enviar la confirmación");
      }

      setRsvpCompletado(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C5A059", "#B87C82", "#FDF9F4", "#E8C8CB"],
        });
      } catch {}
    } catch (err: any) {
      setRsvpError(err.message || "Error al procesar la confirmación");
    } finally {
      setEnviandoRsvp(false);
    }
  };

  // Días y nombres del mes para el calendario bilingüe
  const anio = fechaObj.getFullYear();
  const mesIdx = fechaObj.getMonth();
  const diaEvento = fechaObj.getDate();

  const mesesEs = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const mesesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const nombreMes = idioma === "EN" ? (mesesEn[mesIdx] || "September") : (mesesEs[mesIdx] || "Septiembre");

  const diasSemanaHeaders = idioma === "EN"
    ? ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    : ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

  // Títulos bilingües solicitados configurables desde el admin
  const tituloCalendario = idioma === "EN"
    ? (data.tituloCalendarioEn || "SAVE THE DATE")
    : (data.tituloCalendarioEs || "RESERVA LA FECHA");

  const tituloContador = idioma === "EN"
    ? (data.tituloContadorEn || "Solo Faltan...")
    : (data.tituloContadorEs || "Solo Faltan...");

  const tituloRsvp = idioma === "EN"
    ? (data.tituloRsvpEn || "Early RSVP")
    : (data.tituloRsvpEs || "Confirmación Anticipada");

  const preguntaRsvp = idioma === "EN"
    ? (data.preguntaRsvpEn || "Will You Join Us?")
    : (data.preguntaRsvpEs || data.textoPreRsvp || "¿Podrás Acompañarnos?");

  const mensajeRsvp = idioma === "EN"
    ? "Please help us confirm your tentative attendance to reserve your spot in advance."
    : (data.textoPreRsvp || "Ayúdanos confirmando tu asistencia tentativa para apartar tu lugar con anticipación.");

  const subtituloTarjeta = idioma === "EN"
    ? (data.subtituloEn || "MY SWEET FIFTEEN")
    : (data.subtitulo || "MIS XV AÑOS");

  const labelDias = idioma === "EN" ? "Days" : "Días";
  const labelHoras = idioma === "EN" ? "Hours" : "Horas";
  const labelMin = idioma === "EN" ? "Mins" : "Min";
  const labelSeg = idioma === "EN" ? "Secs" : "Seg";

  // Generar cuadrícula del calendario iniciando en Domingo (DOM a SÁB)
  const primerDiaSemana = new Date(anio, mesIdx, 1).getDay(); // 0 = Domingo
  const diasEnMes = new Date(anio, mesIdx + 1, 0).getDate();
  const offsetDias = primerDiaSemana; // 0 = Domingo

  const matrizDias: (number | null)[] = [];
  for (let i = 0; i < offsetDias; i++) matrizDias.push(null);
  for (let d = 1; d <= diasEnMes; d++) matrizDias.push(d);

  return (
    <div
      className="min-h-screen text-[#2C1F1B] font-sans antialiased relative overflow-x-clip overflow-y-visible selection:bg-[#7A002A] selection:text-white pb-20"
      style={{
        backgroundImage: "url('/assets/save-the-date/background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflowX: "clip",
      }}
    >
      {/* Selector Flotante de Idioma Superior Derecho (EN | ES, por defecto EN) */}
      <aside
        aria-label="Selector de idioma"
        className="fixed top-3.5 right-3.5 sm:top-5 sm:right-5 z-50 flex items-center bg-white/90 backdrop-blur-md border border-[#C5A059]/45 rounded-full p-0.5 shadow-[0_4px_16px_rgba(90,60,45,0.18)] transition hover:shadow-lg"
      >
        <button
          type="button"
          onClick={() => setIdioma("EN")}
          className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            idioma === "EN"
              ? "bg-[#C5A059] text-white shadow-xs"
              : "text-[#7A5C32] hover:text-[#5C4538]"
          }`}
          title="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setIdioma("ES")}
          className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            idioma === "ES"
              ? "bg-[#C5A059] text-white shadow-xs"
              : "text-[#7A5C32] hover:text-[#5C4538]"
          }`}
          title="Cambiar a Español"
        >
          ES
        </button>
      </aside>
      {/* Capa de velo suave para unificar el fondo satinado */}
      <div className="fixed inset-0 bg-white/35 pointer-events-none backdrop-blur-[1px]" />

      {/* Audio Element Oculto */}
      {data.musicaUrl && (
        <audio ref={audioRef} src={data.musicaUrl} preload="auto" loop />
      )}


      {/* ============================================================== */}
      {/* 1. PRIMERA SECCIÓN: FOTO DE LA QUINCEAÑERA (60svh) + SOBRE COMPACTO (78%) */}
      {/* ============================================================== */}
      <section className="relative h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-0 pt-0 pb-4 overflow-hidden">
        {/* PARTE SUPERIOR: FOTO CON MÁS ALTURA (60svh) Y MÁSCARA AL 68% */}
        <div className="w-full max-w-md flex flex-col items-center relative pt-0">
          <div
            className="relative w-full h-[58svh] sm:h-[60svh] overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 68%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 68%, transparent 100%)",
            }}
          >
            {/* Foto 1: Estado Sobre Cerrado (principal.jpeg) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoPrincipal}
              alt={nombreFestejada}
              className={`w-full h-full object-cover object-[center_20%] absolute inset-0 transition-opacity duration-1000 ${
                sobreAbierto ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{
                filter: "contrast(1.06) saturate(1.08)",
              }}
            />

            {/* Foto 2: Estado Sobre Abierto (personalizada o la del demo) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoSobreAbiertoUrl || "/assets/save-the-date/f291897753a9fc56f20003d177749b21.webp"}
              alt={nombreFestejada}
              className={`w-full h-full object-cover object-[center_15%] absolute inset-0 transition-opacity duration-1000 ${
                sobreAbierto ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                filter: "contrast(1.06) saturate(1.08)",
              }}
            />
          </div>
        </div>

        {/* PARTE INFERIOR: TÍTULO Y SOBRE AGRUPADOS CON 10px DE AIRE EXACTO */}
        <div
          className="w-full flex flex-col items-center justify-end relative px-4 z-10 pb-4 sm:pb-6"
          style={{
            maxWidth: "78%",
            marginTop: "-18px",
          }}
        >
          {/* Caligrafía "Save the Date" SOLO EN SOBRE CERRADO CON 10px HACIA EL SOBRE */}
          {!sobreAbierto && (
            <div
              className="text-center relative px-4 animate-in fade-in duration-500"
              style={{
                marginBottom: "10px",
                zIndex: 12,
                textShadow: "0px 2px 10px rgba(255, 248, 240, 0.9)",
              }}
            >
              <h2
                className="text-[2.4rem] sm:text-[2.7rem] leading-none font-normal tracking-wide"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  color: "#4a3b32",
                }}
              >
                Save the Date
              </h2>
            </div>
          )}

          <div
            onClick={!sobreAbierto ? abrirSobre : undefined}
            className={`w-full relative transition-all duration-700 transform flex flex-col items-center ${
              !sobreAbierto ? "cursor-pointer hover:scale-102 active:scale-98" : ""
            } ${animandoSobre ? "scale-105 -translate-y-2" : ""}`}
          >
            {/* SOBRE CERRADO (COMPACTO) */}
            {!sobreAbierto ? (
              <div className="w-full relative flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Pulso brillante sobre el sello dorado */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                  style={{ top: "50%" }}
                >
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-300/80 shadow-md"></span>
                  </span>
                </div>

                {/* Sobre cerrado compacto */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/save-the-date/sobre-cerrado-plain.webp"
                  alt="Sobre cerrado"
                  className="w-full max-w-[260px] sm:max-w-[280px] max-h-[32svh] object-contain transition-all duration-500"
                  style={{
                    filter:
                      "contrast(1.06) drop-shadow(0 12px 20px rgba(90, 60, 45, 0.22))",
                  }}
                />
              </div>
            ) : (
              /* SOBRE ABIERTO CON LA TARJETA QUE DICE "MIS XV AÑOS - MELISSA" */
              <div className="w-full relative animate-in zoom-in-95 duration-500 flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/save-the-date/sobre-abierto.webp"
                  alt="Sobre abierto"
                  className="w-full max-w-[265px] sm:max-w-[285px] max-h-[35svh] object-contain"
                  style={{
                    filter:
                      "contrast(1.06) drop-shadow(0 12px 20px rgba(90, 60, 45, 0.22))",
                  }}
                />

                {/* TEXTO EXACTO DENTRO DE LA TARJETA */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-[62%] text-center pointer-events-none flex flex-col items-center justify-center"
                  style={{ top: "35%" }}
                >
                  <span className="font-serif text-[11px] sm:text-[13px] uppercase tracking-[0.24em] text-[#2A1B16] font-semibold block leading-tight">
                    {subtituloTarjeta}
                  </span>
                  <span
                    className="text-2xl sm:text-3xl text-[#3E2723] font-normal leading-tight mt-1"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    {nombreFestejada}
                  </span>
                </div>

                {/* Indicador discreto para deslizar hacia abajo una vez abierto */}
                <div className="mt-1 text-center animate-bounce">
                  <button
                    type="button"
                    onClick={scrollHaciaDetalles}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#7A002A] shadow-md border border-white/70 hover:bg-white cursor-pointer transition active:scale-95"
                  >
                    <span>{idioma === "EN" ? "View details" : "Ver detalles"}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. CONTENIDO COMPLETO REVELADO AL ABRIR EL SOBRE */}
      {/* ============================================================== */}
      {sobreAbierto && (
        <div
          ref={contenidoRef}
          className="w-full relative z-10 animate-in fade-in duration-700"
        >
          {/* ============================================================ */}
          {/* SECCIÓN 2: GALERÍA DE FOTOS + REPRODUCTOR + CORONA + FLORES */}
          {/* ============================================================ */}
          <section
            className="galeria-section relative w-full flex flex-col items-center overflow-visible"
            style={{
              paddingTop: "32px",
              paddingBottom: "16px",
              background:
                "linear-gradient(180deg, rgba(235, 206, 209, 0.45) 0%, rgba(232, 198, 202, 0.75) 45%, rgba(235, 206, 209, 0.4) 85%, transparent 100%)",
              borderTop: "1px solid rgba(197, 160, 89, 0.4)",
            }}
          >
            {/* 1. REPRODUCTOR DE MÚSICA SUPERIOR (JUSTO ENCIMA DE LA CORONA) */}
            <div className="w-full max-w-md mx-auto px-4 pb-4 flex flex-col items-center">
              {/* Controles de música con filigranas doradas */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
                {/* Filigrana izquierda */}
                <div className="flex items-center flex-1 justify-end">
                  <svg
                    className="w-16 sm:w-24 h-5 text-[#C5A059]"
                    viewBox="0 0 100 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M10 10h60M70 10c4 0 7-3 9-5s4-3 6-3 4 2 4 4-2 5-5 5c-3 0-5-2-6-4M70 10c4 0 7 3 9 5s4 3 6 3 4-2 4-4-2-5-5-5c-3 0-5 2-6 4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <circle cx="95" cy="10" r="2" fill="#C5A059" />
                    <circle cx="5" cy="10" r="1.5" fill="#C5A059" />
                  </svg>
                </div>

                {/* Botón Anterior */}
                <button
                  type="button"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      if (!reproduciendo) {
                        audioRef.current.play().then(() => setReproduciendo(true)).catch(() => {});
                      }
                    }
                  }}
                  className="p-1.5 text-[#B89356] hover:text-[#9A7432] active:scale-90 transition cursor-pointer"
                  title="Reiniciar canción"
                  aria-label="Canción anterior"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                {/* Botón Central Play / Pause (Dorado Metálico & Palo de Rosa Suave) */}
                <button
                  type="button"
                  onClick={toggleMusica}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative cursor-pointer shadow-[0_4px_14px_rgba(90,60,45,0.22)] transition transform hover:scale-105 active:scale-95 group"
                  style={{
                    background:
                      "linear-gradient(135deg, #E6C786 0%, #C5A059 45%, #B87C82 100%)",
                    boxShadow:
                      "0 0 0 2px rgba(255, 255, 255, 0.95), 0 0 0 3.5px #C5A059, 0 6px 16px rgba(197, 160, 89, 0.35)",
                  }}
                  title={reproduciendo ? "Pausar música" : "Reproducir música"}
                  aria-label="Play / Pausa"
                >
                  {reproduciendo ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current drop-shadow-sm" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current ml-0.5 drop-shadow-sm" />
                  )}
                </button>

                {/* Botón Siguiente */}
                <button
                  type="button"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      if (!reproduciendo) {
                        audioRef.current.play().then(() => setReproduciendo(true)).catch(() => {});
                      }
                    }
                  }}
                  className="p-1.5 text-[#B89356] hover:text-[#9A7432] active:scale-90 transition cursor-pointer"
                  title="Siguiente pista"
                  aria-label="Siguiente pista"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                {/* Filigrana derecha */}
                <div className="flex items-center flex-1 justify-start">
                  <svg
                    className="w-16 sm:w-24 h-5 text-[#C5A059] transform -scale-x-100"
                    viewBox="0 0 100 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M10 10h60M70 10c4 0 7-3 9-5s4-3 6-3 4 2 4 4-2 5-5 5c-3 0-5-2-6-4M70 10c4 0 7 3 9 5s4 3 6 3 4-2 4-4-2-5-5-5c-3 0-5 2-6 4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <circle cx="95" cy="10" r="2" fill="#C5A059" />
                    <circle cx="5" cy="10" r="1.5" fill="#C5A059" />
                  </svg>
                </div>
              </div>

              {/* Texto de llamada a la acción */}
              <p
                className="mt-2.5 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6B38] text-center"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {reproduciendo
                  ? (idioma === "EN" ? "MUSIC PLAYING" : "MÚSICA REPRODUCIENDO")
                  : (idioma === "EN" ? 'PRESS "PLAY"' : 'PRESIONA "PLAY"')}
              </p>
            </div>

            {/* 2. LA CORONA CENTRADA */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/save-the-date/corona.webp"
              alt="Corona Real"
              className="galeria-corona w-[120px] h-auto object-contain mb-3.5"
              style={{
                filter: "drop-shadow(0 4px 8px rgba(90, 60, 45, 0.18))",
              }}
            />

            {/* 3. GALERÍA: 2 FOTOS VISIBLES + DESLIZAMIENTO HORIZONTAL SI HAY MÁS */}
            {(() => {
              const fotos = (data.galeriaFotosUrls || []).filter(Boolean);
              const lista =
                fotos.length > 0
                  ? fotos
                  : [
                      "/assets/save-the-date/save1.webp",
                      "/assets/save-the-date/save2.webp",
                      "/assets/save-the-date/save3.webp",
                    ];
              return (
                <div
                  className="galeria-grid flex gap-[5px] w-[94%] max-w-[440px] mx-auto overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {lista.map((src, idx) => (
                    <div
                      key={`${idx}-${src}`}
                      className={`relative aspect-[3/5] overflow-hidden rounded-[2px] border border-[rgba(197,160,89,0.55)] shadow-[0_6px_14px_rgba(60,40,35,0.15)] group bg-white/40 shrink-0 snap-start basis-[calc(50%-2.5px)] ${
                        lista.length === 1 ? "mx-auto" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${nombreFestejada} - ${idx + 1}`}
                        className="galeria-foto w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* 4. CIERRE INFERIOR CON GUIRNALDA FLORAL DE BORDE A BORDE */}
            <div className="w-full overflow-hidden flex justify-center mt-3 sm:mt-4 -mb-6 sm:-mb-8 relative z-20 pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/save-the-date/flores.webp"
                alt="Divisor Floral"
                className="galeria-flores w-[104%] max-w-none -ml-[2%] block object-cover"
                style={{
                  filter: "drop-shadow(0 6px 12px rgba(60, 40, 35, 0.14))",
                }}
              />
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECCIONES POSTERIORES: CALENDARIO (SECCIÓN 3) -> COUNTDOWN -> RSVP */}
          {/* ============================================================ */}
          <div className="max-w-md mx-auto px-4 space-y-8 pt-8 sm:pt-10">
            {/* ============================================================ */}
            {/* SECCIÓN 3: CALENDARIO */}
            {/* ============================================================ */}
            {data.mostrarCalendario && (
              <section className="flex flex-col items-center">
                {/* 1. TÍTULO 'RESERVA LA FECHA' / 'SAVE THE DATE' FUERA Y ARRIBA DE CALENDARIO.PNG */}
                <div className="w-full text-center mb-3 sm:mb-4">
                  <h2
                    className="text-sm sm:text-base uppercase tracking-[0.22em] text-[#7A5C32] font-semibold"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {tituloCalendario}
                  </h2>
                </div>

                {/* 2. TARJETA CALENDARIO CON MARCO ELEGANTE (calendario.webp) */}
                <div className="relative w-full max-w-[340px] rounded-[30px] overflow-hidden shadow-xl p-6 sm:p-7 flex flex-col items-center">
                  {/* Marco gráfico de fondo decorativo */}
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      backgroundImage: "url('/assets/save-the-date/calendario.webp')",
                      backgroundSize: "100% 100%",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Mes en Great Vibes (3.5rem, color #7a5c32) */}
                  <span
                    className="text-[3rem] sm:text-[3.5rem] leading-none text-[#7A5C32] block -mt-1"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    {nombreMes}
                  </span>

                  {/* Año con líneas doradas a los lados */}
                  <div className="flex items-center justify-center gap-3 text-xs font-serif tracking-[0.25em] text-[#C5A059] font-medium mt-1 mb-3">
                    <span className="h-px w-7 bg-gradient-to-r from-transparent to-[#C5A059]" />
                    <span>{anio}</span>
                    <span className="h-px w-7 bg-gradient-to-l from-transparent to-[#C5A059]" />
                  </div>

                  {/* Cuadrícula interactiva del mes: Días de 3 letras */}
                  <div className="w-[86%] max-w-[250px] mx-auto">
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] sm:text-[10px] text-[#A68A68] tracking-wider mb-2 uppercase">
                      {diasSemanaHeaders.map((header) => (
                        <span key={header}>{header}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {matrizDias.map((dia, idx) => {
                        if (dia === null) {
                          return <div key={`empty-${idx}`} className="h-8" />;
                        }

                        const esElDia = dia === diaEvento;

                        return (
                          <div
                            key={`dia-${dia}`}
                            className={`h-8 flex items-center justify-center text-xs relative ${
                              esElDia
                                ? "text-[#7A5C32] font-bold"
                                : "text-[#5C4538] font-medium"
                            }`}
                          >
                            {/* Día 18: Contorno de corazón dorado/rosado en SVG */}
                            {esElDia && (
                              <svg
                                className="absolute inset-0 w-full h-full text-[#B87C82] pointer-events-none drop-shadow-xs"
                                viewBox="0 0 24 24"
                                fill="rgba(184, 124, 130, 0.12)"
                                stroke="#B87C82"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                              </svg>
                            )}
                            <span className="relative z-10">{dia}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. BOTONES DE CALENDARIO FUERA DE LA TARJETA + UBICACIÓN */}
                <div className="w-full max-w-[340px] mt-4 flex flex-col items-center gap-2.5">
                  {/* Ubicación */}
                  {data.ciudad && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#7A5C32] font-medium tracking-wide">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{data.ciudad}</span>
                    </div>
                  )}

                  {/* Botones translúcidos con borde dorado fino */}
                  <div className="flex flex-row items-center justify-center gap-2 w-full">
                    <a
                      href={generateGoogleCalendarUrl({
                        titulo: `Save the Date · ${nombreFestejada}`,
                        descripcion: `Reserva la fecha para los quince años de ${nombreFestejada}.`,
                        fechaInicio: fechaObj,
                        ciudad: data.ciudad || "Salón de Eventos",
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-white/70 backdrop-blur-md text-[#7A5C32] font-medium text-[11px] sm:text-xs border border-[#C5A059]/45 shadow-xs hover:bg-white/95 hover:border-[#C5A059] transition active:scale-95"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Google Calendar</span>
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        downloadIcsFile({
                          titulo: `Save the Date · ${nombreFestejada}`,
                          descripcion: `Reserva la fecha para los quince años de ${nombreFestejada}.`,
                          fechaInicio: fechaObj,
                          ciudad: data.ciudad || "Salón de Eventos",
                        })
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-white/70 backdrop-blur-md text-[#7A5C32] font-medium text-[11px] sm:text-xs border border-[#C5A059]/45 shadow-xs hover:bg-white/95 hover:border-[#C5A059] transition active:scale-95 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Apple / Outlook (.ics)</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* SECCIÓN CUENTA REGRESIVA (SIN BLOQUE SÓLIDO VINO) */}
            {/* 'Solo Faltan...' / 'Countdown...' en Great Vibes + números sobre satén champagne en #5c4538 */}
            {/* ============================================================ */}
            {data.mostrarContador && (
              <section className="text-center pt-2 pb-2 space-y-3">
                <h3
                  className="text-4xl sm:text-5xl text-[#7A5C32] leading-tight"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {tituloContador}
                </h3>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-[340px] mx-auto pt-1">
                  <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/40 backdrop-blur-xs border border-[#C5A059]/25 shadow-xs">
                    <span className="font-serif text-3xl sm:text-4xl font-normal text-[#5C4538] leading-none">
                      {tiempo.dias}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#8C6B38] font-medium mt-1.5">
                      {labelDias}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/40 backdrop-blur-xs border border-[#C5A059]/25 shadow-xs">
                    <span className="font-serif text-3xl sm:text-4xl font-normal text-[#5C4538] leading-none">
                      {tiempo.horas}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#8C6B38] font-medium mt-1.5">
                      {labelHoras}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/40 backdrop-blur-xs border border-[#C5A059]/25 shadow-xs">
                    <span className="font-serif text-3xl sm:text-4xl font-normal text-[#5C4538] leading-none">
                      {tiempo.minutos}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#8C6B38] font-medium mt-1.5">
                      {labelMin}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/40 backdrop-blur-xs border border-[#C5A059]/25 shadow-xs">
                    <span className="font-serif text-3xl sm:text-4xl font-normal text-[#5C4538] leading-none">
                      {tiempo.segundos}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#8C6B38] font-medium mt-1.5">
                      {labelSeg}
                    </span>
                  </div>
                </div>
              </section>
            )}


          {/* ============================================================ */}
          {/* SECCIÓN PRE-RSVP / CONFIRMACIÓN */}
          {/* ============================================================ */}
          {data.mostrarPreRsvp && (
            <section
              className="rounded-[32px] p-6 sm:p-7 shadow-xl space-y-5"
              style={{
                background: "rgba(253, 249, 244, 0.88)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(197, 160, 89, 0.45)",
              }}
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
                  {tituloRsvp}
                </span>
                <h3
                  className="text-[2.3rem] sm:text-[2.6rem] leading-tight text-[#7A5C32] block"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {preguntaRsvp}
                </h3>
                <p className="text-xs text-stone-600 px-2 leading-relaxed">
                  {mensajeRsvp}
                </p>
              </div>

              {rsvpCompletado ? (
                <div className="rounded-2xl bg-white/70 border border-[#C5A059]/40 p-5 text-center space-y-2 animate-in zoom-in-95">
                  <div className="w-12 h-12 bg-[#B87C82]/15 text-[#B87C82] rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#7A5C32]">
                    {idioma === "EN" ? "Thank you for responding!" : "¡Gracias por responder!"}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {idioma === "EN"
                      ? "We recorded your response. Very soon you will receive official invitation details."
                      : "Registramos tu respuesta. Muy pronto recibirás todos los detalles oficiales de la invitación."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnviarPreRsvp} className="space-y-4">
                  {rsvpError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                      {rsvpError}
                    </div>
                  )}

                  {/* Selector de respuesta con iconos SVG minimalistas y palo de rosa */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Opción 1: ¡Sí asistiré! */}
                    <button
                      type="button"
                      onClick={() => setRespuesta("SI")}
                      className={`py-3 px-2 rounded-2xl text-xs font-medium border text-center transition cursor-pointer flex flex-col items-center gap-1.5 shadow-xs ${
                        respuesta === "SI"
                          ? "bg-[#B87C82] text-white border-[#B87C82] shadow-sm"
                          : "bg-[#FDF9F4]/90 text-[#7A5C32] border-[rgba(197,160,89,0.35)] hover:border-[rgba(197,160,89,0.6)]"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{idioma === "EN" ? "Will Attend!" : "¡Sí asistiré!"}</span>
                    </button>

                    {/* Opción 2: Tal vez */}
                    <button
                      type="button"
                      onClick={() => setRespuesta("TAL_VEZ")}
                      className={`py-3 px-2 rounded-2xl text-xs font-medium border text-center transition cursor-pointer flex flex-col items-center gap-1.5 shadow-xs ${
                        respuesta === "TAL_VEZ"
                          ? "bg-[#B87C82] text-white border-[#B87C82] shadow-sm"
                          : "bg-[#FDF9F4]/90 text-[#7A5C32] border-[rgba(197,160,89,0.35)] hover:border-[rgba(197,160,89,0.6)]"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{idioma === "EN" ? "Maybe" : "Tal vez"}</span>
                    </button>

                    {/* Opción 3: No podré */}
                    <button
                      type="button"
                      onClick={() => setRespuesta("NO")}
                      className={`py-3 px-2 rounded-2xl text-xs font-medium border text-center transition cursor-pointer flex flex-col items-center gap-1.5 shadow-xs ${
                        respuesta === "NO"
                          ? "bg-[#B87C82] text-white border-[#B87C82] shadow-sm"
                          : "bg-[#FDF9F4]/90 text-[#7A5C32] border-[rgba(197,160,89,0.35)] hover:border-[rgba(197,160,89,0.6)]"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span>{idioma === "EN" ? "Can't Make It" : "No podré"}</span>
                    </button>
                  </div>

                  {/* Campos de contacto */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A5C32] mb-1">
                        {idioma === "EN" ? "Full Name *" : "Tu Nombre Completo *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder={idioma === "EN" ? "e.g. The Rodriguez Family or Name" : "Ej. Familia Rodríguez o Nombre"}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(197,160,89,0.35)] text-xs focus:ring-2 focus:ring-[#B87C82] focus:border-transparent outline-none bg-white/95 text-[#5C4538]"
                      />
                    </div>

                    {/* Teléfono y Pases (Pases se oculta si seleccionó "No podré") */}
                    <div className={`grid ${respuesta === "NO" ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                      <div className={respuesta === "NO" ? "col-span-1" : ""}>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A5C32] mb-1">
                          {idioma === "EN" ? "Phone / WhatsApp" : "Teléfono / WhatsApp"}
                        </label>
                        <input
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2.5 rounded-xl border border-[rgba(197,160,89,0.35)] text-xs focus:ring-2 focus:ring-[#B87C82] outline-none bg-white/95 text-[#5C4538]"
                        />
                      </div>

                      {respuesta !== "NO" && (
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A5C32] mb-1">
                            {idioma === "EN" ? "Estimated Guests" : "Pases Estimados"}
                          </label>
                          <select
                            value={pases}
                            onChange={(e) => setPases(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl border border-[rgba(197,160,89,0.35)] text-xs focus:ring-2 focus:ring-[#B87C82] outline-none bg-white/95 text-[#5C4538]"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <option key={num} value={num}>
                                {num} {idioma === "EN" ? (num === 1 ? "guest" : "guests") : (num === 1 ? "pase" : "pases")}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A5C32] mb-1">
                        {idioma === "EN" ? `Note or message for ${nombreFestejada}` : `Nota o mensaje para ${nombreFestejada}`}
                      </label>
                      <textarea
                        rows={2}
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder={idioma === "EN" ? "Congratulations, we love you!" : "¡Felicidades, te queremos mucho!"}
                        className="w-full px-3.5 py-2 rounded-xl border border-[rgba(197,160,89,0.35)] text-xs focus:ring-2 focus:ring-[#B87C82] outline-none bg-white/95 text-[#5C4538]"
                      />
                    </div>
                  </div>

                  {/* Botón con degradado dorado elegante */}
                  <button
                    type="submit"
                    disabled={enviandoRsvp}
                    className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-xs uppercase tracking-[0.18em] shadow-md hover:brightness-105 active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #c5a059 0%, #a88340 100%)",
                      boxShadow: "0 4px 14px rgba(197, 160, 89, 0.3)",
                    }}
                  >
                    {enviandoRsvp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{idioma === "EN" ? "Sending RSVP..." : "Enviando respuesta..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{idioma === "EN" ? "Confirm Early RSVP" : "Confirmar Pre-Registro"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </section>
          )}

          {/* Pie de página con Branding Elegante Click & Love */}
          <footer className="w-full pt-7 pb-12 px-5 flex flex-col items-center text-center">
            <p
              className="font-serif font-semibold text-[0.85rem] tracking-[0.22em] uppercase"
              style={{ color: "#6e5641" }}
            >
              {nombreFestejada} · {idioma === "EN" ? (data.subtituloEn || "MY SWEET FIFTEEN").toUpperCase() : (data.subtitulo || "MIS QUINCE AÑOS").toUpperCase()}
            </p>

            <div
              className="w-12 h-px my-3"
              style={{ backgroundColor: "rgba(197, 160, 89, 0.55)" }}
            />

            <a
              href="https://clickandlove.app?utm_source=invitacion&utm_medium=footer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: "rgba(253, 249, 244, 0.75)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(197, 160, 89, 0.35)",
                boxShadow: "0 4px 14px rgba(110, 86, 65, 0.08)",
              }}
              aria-label={idioma === "EN" ? "Craft digital invitation at Click and Love" : "Crear invitación digital en Click and Love"}
            >
              <span
                className="text-[0.68rem] tracking-wider uppercase font-medium"
                style={{ color: "#8a735c" }}
              >
                {idioma === "EN" ? "Digital invitation crafted by" : "Invitación digital creada por"}
              </span>
              <img
                src="/assets/logo-lockup.png"
                alt="Click and Love - Interactive Website Invitations"
                className="w-[140px] max-w-[145px] h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </footer>
        </div>
        </div>
      )}
    </div>
  );
}
