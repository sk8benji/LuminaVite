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
  ChevronRight,
  Play,
  Pause,
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

export default function CoquettePinkSaveTheDate({
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

  // Nombre de la niña (por defecto "Melissa Cardenas")
  const nombreFestejada = data.titulo || "Melissa Cardenas";
  const fotoPrincipal =
    data.fotoPortadaUrl || "/assets/save-the-date/coquette-pink/principal2.jpeg";

  // Seguimiento de tiempo de audio para el reproductor en Section 1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Progreso de scroll horizontal en la galería
  const galleryScrollRef = useRef<HTMLDivElement | null>(null);
  const [galleryProgress, setGalleryProgress] = useState(0);

  const handleGalleryScroll = () => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setGalleryProgress(0);
      return;
    }
    setGalleryProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
  };

  // Scroll suave para efecto parallax sutil en la galería
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const formatAudioTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
      className={`min-h-screen text-[#FAF6F0] antialiased relative overflow-x-clip overflow-y-visible selection:bg-[#E8B4C4] selection:text-[#121013] ${
        sobreAbierto ? "pb-24" : "pb-0"
      }`}
      style={{
        backgroundColor: sobreAbierto ? "#121013" : "#F9EEF0",
        overflowX: "clip",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      {/* Selector Flotante de Idioma Superior Derecho (EN | ES, por defecto EN) */}
      <aside
        aria-label="Selector de idioma"
        className="fixed top-3.5 right-3.5 sm:top-5 sm:right-5 z-50 flex items-center bg-white/90 backdrop-blur-md border border-[#D4A39A]/60 ring-1 ring-[#C9958C]/30 rounded-full p-0.5 shadow-[0_4px_16px_rgba(184,122,132,0.16)] transition hover:shadow-lg"
      >
        <button
          type="button"
          onClick={() => setIdioma("EN")}
          className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            idioma === "EN"
              ? "bg-[#B87A84] text-white shadow-xs"
              : "text-[#5A4648] hover:text-[#B87A84]"
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
              ? "bg-[#B87A84] text-white shadow-xs"
              : "text-[#5A4648] hover:text-[#B87A84]"
          }`}
          title="Cambiar a Español"
        >
          ES
        </button>
      </aside>
      {/* Audio Element Oculto */}
      {data.musicaUrl && (
        <audio ref={audioRef} src={data.musicaUrl} preload="auto" loop />
      )}


      {/* ============================================================== */}
      {/* 1. PRIMERA SECCIÓN: HERO FULL-BLEED + SOBRE CERRADO / HERO REVELADO */}
      {/* ============================================================== */}
      <section className="relative h-[100dvh] max-h-[100dvh] flex flex-col justify-end items-center px-0 pt-0 pb-4 overflow-hidden">
        {/* FOTO FULL-BLEED A PANTALLA COMPLETA */}
        <div className={`absolute inset-0 w-full ${sobreAbierto ? "h-full" : "h-[68svh] sm:h-[72svh]"} transition-all duration-1000 overflow-hidden z-0`}>
          {/* Foto 1: Estado Sobre Cerrado (principal.jpeg) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoPrincipal}
            alt={nombreFestejada}
            className={`w-full h-full object-cover object-[center_20%] absolute inset-0 transition-opacity duration-1000 ${
              sobreAbierto ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{
              filter: "contrast(1.05) saturate(1.06)",
            }}
          />

          {/* Foto 2: Estado Sobre Abierto (main.jpg) - Centrado en sujeto para móviles */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.fotoSobreAbiertoUrl || "/assets/save-the-date/coquette-pink/main.jpg"}
            alt={nombreFestejada}
            className={`w-full h-full object-cover object-[center_15%] sm:object-[center_20%] absolute inset-0 transition-opacity duration-1000 ${
              sobreAbierto ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              filter: "contrast(1.05) saturate(1.06)",
            }}
          />

          {/* Difuminado cuando el sobre está CERRADO (hacia el fondo #F9EEF0) */}
          {!sobreAbierto && (
            <div
              className="absolute inset-x-0 bottom-0 h-32 sm:h-44 pointer-events-none transition-opacity duration-700"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(249, 238, 240, 0) 0%, rgba(249, 238, 240, 0.6) 55%, rgba(249, 238, 240, 0.95) 85%, #F9EEF0 100%)",
              }}
            />
          )}

          {/* Degradado oscuro inferior cuando el sobre está ABIERTO (estilo referencia sample-coquette-pink-xv) */}
          {sobreAbierto && (
            <div
              className="absolute inset-x-0 bottom-0 h-64 sm:h-72 pointer-events-none animate-in fade-in duration-700"
              style={{
                background:
                  "linear-gradient(to top, rgba(15, 10, 12, 0.9) 0%, rgba(20, 12, 16, 0.65) 45%, rgba(25, 15, 20, 0.2) 75%, transparent 100%)",
              }}
            />
          )}
        </div>

        {/* PARTE INFERIOR: ESTADO CERRADO (SOBRE) vs ESTADO ABIERTO (TÍTULO + NOMBRE + AUDIO PLAYER) */}
        {!sobreAbierto ? (
          <div
            className="w-full flex flex-col items-center justify-end relative px-4 z-10 pb-4 sm:pb-6 mt-auto"
            style={{
              maxWidth: "82%",
            }}
          >
            {/* Caligrafía "Save the Date" SOLO EN SOBRE CERRADO CON 10px HACIA EL SOBRE */}
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
                  fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
                  color: "#5A4648",
                  fontSize: "2.8rem",
                }}
              >
                Save the Date
              </h2>
            </div>

            {/* SOBRE CERRADO CLICABLE */}
            <div
              onClick={abrirSobre}
              className={`w-full relative transition-all duration-700 transform flex flex-col items-center cursor-pointer hover:scale-102 active:scale-98 ${
                animandoSobre ? "scale-105 -translate-y-2 opacity-50" : ""
              }`}
            >
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
                  src="/assets/save-the-date/coquette-pink/sobre-cerrado-2.png"
                  alt="Sobre cerrado"
                  className="w-full max-w-[260px] sm:max-w-[280px] max-h-[32svh] object-contain transition-all duration-500"
                  style={{
                    filter:
                      "contrast(1.06) drop-shadow(0 12px 20px rgba(90, 60, 45, 0.22))",
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* ESTADO ABIERTO: SIN SOBRE, CON TÍTULO "JOIN US TO CELEBRATE", NOMBRE "MELISSA CARDENAS" Y REPRODUCTOR */
          <div className="w-full flex flex-col items-center justify-end relative px-4 z-20 pb-5 sm:pb-7 animate-in fade-in duration-700">
            {/* Título: "join us to celebrate" */}
            <p className="text-[11.5px] sm:text-[13px] uppercase tracking-[0.28em] text-white/90 font-medium text-center font-sans">
              {idioma === "EN" ? "JOIN US TO CELEBRATE" : "ACOMPÁÑANOS A CELEBRAR"}
            </p>

            {/* Nombre: "Melissa Cardenas" */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-tight text-center mt-1 mb-3 drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]"
              style={{ fontFamily: "'Pinyon Script', 'Alex Brush', cursive" }}
            >
              ✦ {nombreFestejada} ✦
            </h1>

            {/* Reproductor de audio waveform estilo referencia */}
            {data.musicaUrl && (
              <div className="w-full max-w-[310px] sm:max-w-[340px] bg-black/45 backdrop-blur-md rounded-full px-3.5 py-1.5 border border-white/20 flex items-center gap-2.5 shadow-2xl mb-2.5">
                {/* Botón Play / Pause */}
                <button
                  type="button"
                  onClick={toggleMusica}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-stone-900 flex items-center justify-center shrink-0 transition active:scale-95 shadow-xs cursor-pointer"
                  aria-label={reproduciendo ? "Pausar música" : "Reproducir música"}
                >
                  {reproduciendo ? (
                    <Pause className="w-3.5 h-3.5 fill-current text-[#4A3E40]" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current text-[#4A3E40] ml-0.5" />
                  )}
                </button>

                {/* Waveform animado */}
                <div className="flex-1 flex items-center justify-between gap-[2px] h-4 px-1 overflow-hidden">
                  {[14, 22, 16, 26, 30, 18, 28, 14, 24, 28, 20, 16, 26, 32, 18, 24, 14, 20].map((h, i) => (
                    <span
                      key={i}
                      className={`w-[2px] sm:w-[2.5px] rounded-full transition-all duration-300 ${
                        reproduciendo ? "bg-white animate-pulse" : "bg-white/45"
                      }`}
                      style={{
                        height: reproduciendo ? `${Math.max(5, (h * ((i % 3) + 1)) % 18 + 4)}px` : "5px",
                        animationDelay: `${i * 70}ms`,
                      }}
                    />
                  ))}
                </div>

                {/* Contador de tiempo */}
                <span className="text-[10px] text-white/80 tabular-nums font-mono shrink-0">
                  {formatAudioTime(currentTime)} / {formatAudioTime(duration || 287)}
                </span>
              </div>
            )}

            {/* Botón para deslizar a detalles */}
            <div className="mt-1 animate-bounce">
              <button
                type="button"
                onClick={scrollHaciaDetalles}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[11px] font-medium text-white/95 border border-white/25 cursor-pointer transition active:scale-95 shadow-sm"
              >
                <span>{idioma === "EN" ? "View details" : "Ver detalles"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/90" />
              </button>
            </div>
          </div>
        )}
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
          {/* SECCIÓN 2: GALERÍA EDITORIAL NEGRO & BLUSH (CAPTURED MOMENTS) */}
          {/* ============================================================ */}
          {(() => {
            const lista = (data.galeriaFotosUrls || []).filter(Boolean);
            if (!data.mostrarGaleria || lista.length === 0) return null;

            return (
              <section
                className="galeria-section relative w-full flex flex-col items-center py-12 sm:py-16 overflow-hidden"
                style={{
                  backgroundColor: "#121013",
                }}
              >
                {/* HEADER: Corona blanca + Título ivory + subtítulo blush pink con flecha */}
                <div className="w-full max-w-5xl mx-auto px-5 text-center mb-8 sm:mb-10 flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/save-the-date/coquette-pink/corona-white.png"
                    alt="Corona"
                    className="w-24 sm:w-28 h-auto object-contain mx-auto mb-2.5"
                    style={{
                      filter: "drop-shadow(0 4px 12px rgba(197, 160, 89, 0.25))",
                    }}
                  />
                  <h2
                    className="text-3xl sm:text-4xl italic font-normal leading-tight"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: "#FAF6F0",
                    }}
                  >
                    {idioma === "EN" ? "Captured Moments" : "Momentos Capturados"}
                  </h2>

                  <div
                    className="inline-flex items-center justify-center gap-1 mt-2.5 text-[10px] sm:text-[11px] uppercase font-medium"
                    style={{
                      color: "#E8B4C4",
                      letterSpacing: "0.26em",
                    }}
                  >
                    <span>
                      {idioma === "EN" ? "SWIPE FOR MORE" : "DESLIZA PARA VER MÁS"}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: "#E8B4C4" }} />
                  </div>
                </div>

                {/* PHOTOS — ARCH SHAPE (999px 999px 0 0), 3:4, object-top, 1.5px solid #C5A059 */}
                <div className="w-full max-w-3xl mx-auto">
                  <div
                    ref={galleryScrollRef}
                    onScroll={handleGalleryScroll}
                    className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 sm:px-6 pb-3"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {lista.map((src, idx) => (
                      <div
                        key={`${idx}-${src}`}
                        className={`relative aspect-[3/4] w-[42vw] max-w-[170px] shrink-0 snap-start overflow-hidden group ${
                          lista.length === 1 ? "mx-auto" : ""
                        }`}
                        style={{
                          borderRadius: "999px 999px 0 0",
                          border: "1.5px solid #C5A059",
                          boxShadow:
                            "0 14px 32px rgba(0, 0, 0, 0.5), 0 4px 14px rgba(197, 160, 89, 0.14)",
                          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${nombreFestejada} - ${idx + 1}`}
                          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Thin scroll progress line under the strip */}
                  {lista.length > 2 && (
                    <div
                      className="w-28 sm:w-36 h-[2px] rounded-full overflow-hidden mx-auto mt-6"
                      style={{ backgroundColor: "rgba(237, 230, 221, 0.16)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-150"
                        style={{
                          backgroundColor: "#C5A059",
                          width: `${28 + galleryProgress * 72}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* DIVIDER BELOW THE GALLERY: SAVE THE DATE en ivory con líneas doradas */}
                <div className="w-full max-w-[360px] sm:max-w-[440px] mx-auto px-6 mt-10 sm:mt-12 flex items-center justify-center gap-4">
                  <span
                    className="flex-1 h-px"
                    style={{ backgroundColor: "rgba(197, 160, 89, 0.55)" }}
                  />
                  <span
                    className="text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.3em] font-medium shrink-0"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: "#FAF6F0",
                    }}
                  >
                    SAVE THE DATE
                  </span>
                  <span
                    className="flex-1 h-px"
                    style={{ backgroundColor: "rgba(197, 160, 89, 0.55)" }}
                  />
                </div>
              </section>
            );
          })()}

          {/* ============================================================ */}
          {/* SECCIONES POSTERIORES: CALENDARIO (SECCIÓN 3) -> COUNTDOWN -> RSVP */}
          {/* ============================================================ */}
          <div className="max-w-md mx-auto px-4 space-y-10 pt-10 sm:pt-12">
            {/* ============================================================ */}
            {/* SECCIÓN 3: CALENDARIO (TARJETA IVORY FLOTANDO EN #121013) */}
            {/* ============================================================ */}
            {data.mostrarCalendario && (
              <section className="flex flex-col items-center">
                {/* TARJETA CALENDARIO ÚNICA (max-w 340px, rounded 24px, border 1px #C5A059) */}
                <div
                  className="relative w-full max-w-[340px] rounded-[24px] overflow-hidden p-6 sm:p-7 pt-6 pb-8 flex flex-col items-center"
                  style={{
                    backgroundColor: "#FAF6F0",
                    border: "1px solid #C5A059",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {/* Textura sutil de seda rosa a muy baja opacidad */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.14]"
                    style={{
                      backgroundImage: "url('/assets/save-the-date/coquette-pink/bg-rose-silk.jpeg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Mes en script grande, negro cálido #1A1216 */}
                  <span
                    className="relative z-10 text-[3.1rem] sm:text-[3.5rem] leading-none block mt-1"
                    style={{
                      fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
                      color: "#1A1216",
                    }}
                  >
                    {nombreMes}
                  </span>

                  {/* Año en small caps dorado #C5A059 con espaciado */}
                  <span
                    className="relative z-10 text-sm sm:text-base uppercase font-medium tracking-[0.28em] mt-1.5 mb-5"
                    style={{ color: "#C5A059" }}
                  >
                    {anio}
                  </span>

                  {/* Cuadrícula del mes */}
                  <div className="relative z-10 w-[88%] max-w-[260px] mx-auto">
                    <div
                      className="grid grid-cols-7 gap-1 text-center font-semibold text-[9px] sm:text-[10px] tracking-wider mb-2 uppercase"
                      style={{ color: "#9A8A90" }}
                    >
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
                              esElDia ? "font-bold" : "font-medium"
                            }`}
                            style={{ color: "#1A1216" }}
                          >
                            {/* Día del evento con contorno de corazón rosa #E8B4C4 */}
                            {esElDia && (
                              <svg
                                className="absolute inset-0 w-full h-full pointer-events-none"
                                viewBox="0 0 24 24"
                                fill="rgba(232, 180, 196, 0.16)"
                                stroke="#E8B4C4"
                                strokeWidth="1.6"
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

                  {/* Objeto decorativo 3: Pequeño detalle floral solo en la esquina inferior a baja opacidad */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/save-the-date/coquette-pink/flores.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute -bottom-2 -right-3 w-28 h-auto object-contain opacity-30 pointer-events-none select-none z-0"
                  />
                </div>

                {/* DEBAJO DE LA TARJETA (SOBRE EL FONDO NEGRO #121013) */}
                <div className="w-full max-w-[340px] mt-6 flex flex-col items-center gap-3.5">
                  {/* Ubicación en ivory #FAF6F0 con pin dorado #C5A059 */}
                  {data.ciudad && (
                    <div
                      className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide"
                      style={{ color: "#FAF6F0" }}
                    >
                      <MapPin className="w-3.5 h-3.5" style={{ color: "#C5A059" }} />
                      <span>{data.ciudad}</span>
                    </div>
                  )}

                  {/* Dos botones lado a lado: fondo transparente, borde 1px dorado #C5A059, texto ivory #FAF6F0 */}
                  <div className="flex flex-row items-center justify-center gap-2.5 w-full">
                    <a
                      href={generateGoogleCalendarUrl({
                        titulo: `Save the Date · ${nombreFestejada}`,
                        descripcion: `Reserva la fecha para los quince años de ${nombreFestejada}.`,
                        fechaInicio: fechaObj,
                        ciudad: data.ciudad || "Salón de Eventos",
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-transparent font-medium text-[11px] sm:text-xs transition hover:bg-white/5 active:scale-95"
                      style={{
                        border: "1px solid #C5A059",
                        color: "#FAF6F0",
                      }}
                    >
                      <CalendarPlus className="w-3.5 h-3.5" style={{ color: "#C5A059" }} />
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
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-transparent font-medium text-[11px] sm:text-xs transition hover:bg-white/5 active:scale-95 cursor-pointer"
                      style={{
                        border: "1px solid #C5A059",
                        color: "#FAF6F0",
                      }}
                    >
                      <Calendar className="w-3.5 h-3.5" style={{ color: "#C5A059" }} />
                      <span>Apple / Outlook (.ics)</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* SECCIÓN CUENTA REGRESIVA (TEXTO IVORY SOBRE FONDO NEGRO #121013) */}
            {/* ============================================================ */}
            {data.mostrarContador && (
              <section className="text-center pt-2 pb-2 space-y-4">
                <h3
                  className="text-4xl sm:text-5xl leading-tight"
                  style={{
                    fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
                    color: "#FAF6F0",
                  }}
                >
                  {tituloContador}
                </h3>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-[340px] mx-auto pt-1">
                  <div
                    className="flex flex-col items-center justify-center py-3.5 px-1 rounded-2xl"
                    style={{
                      backgroundColor: "rgba(250, 246, 240, 0.04)",
                      border: "1px solid rgba(197, 160, 89, 0.45)",
                    }}
                  >
                    <span
                      className="text-3xl sm:text-4xl font-normal leading-none"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FAF6F0" }}
                    >
                      {tiempo.dias}
                    </span>
                    <span
                      className="text-[9.5px] uppercase tracking-widest font-semibold mt-1.5"
                      style={{ color: "#E8B4C4" }}
                    >
                      {labelDias}
                    </span>
                  </div>

                  <div
                    className="flex flex-col items-center justify-center py-3.5 px-1 rounded-2xl"
                    style={{
                      backgroundColor: "rgba(250, 246, 240, 0.04)",
                      border: "1px solid rgba(197, 160, 89, 0.45)",
                    }}
                  >
                    <span
                      className="text-3xl sm:text-4xl font-normal leading-none"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FAF6F0" }}
                    >
                      {tiempo.horas}
                    </span>
                    <span
                      className="text-[9.5px] uppercase tracking-widest font-semibold mt-1.5"
                      style={{ color: "#E8B4C4" }}
                    >
                      {labelHoras}
                    </span>
                  </div>

                  <div
                    className="flex flex-col items-center justify-center py-3.5 px-1 rounded-2xl"
                    style={{
                      backgroundColor: "rgba(250, 246, 240, 0.04)",
                      border: "1px solid rgba(197, 160, 89, 0.45)",
                    }}
                  >
                    <span
                      className="text-3xl sm:text-4xl font-normal leading-none"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FAF6F0" }}
                    >
                      {tiempo.minutos}
                    </span>
                    <span
                      className="text-[9.5px] uppercase tracking-widest font-semibold mt-1.5"
                      style={{ color: "#E8B4C4" }}
                    >
                      {labelMin}
                    </span>
                  </div>

                  <div
                    className="flex flex-col items-center justify-center py-3.5 px-1 rounded-2xl"
                    style={{
                      backgroundColor: "rgba(250, 246, 240, 0.04)",
                      border: "1px solid rgba(197, 160, 89, 0.45)",
                    }}
                  >
                    <span
                      className="text-3xl sm:text-4xl font-normal leading-none"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FAF6F0" }}
                    >
                      {tiempo.segundos}
                    </span>
                    <span
                      className="text-[9.5px] uppercase tracking-widest font-semibold mt-1.5"
                      style={{ color: "#E8B4C4" }}
                    >
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
              className="w-full max-w-[340px] mx-auto rounded-[24px] p-6 sm:p-7 pt-6 pb-7 space-y-5"
              style={{
                backgroundColor: "#FAF6F0",
                border: "1px solid #C5A059",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="text-center flex flex-col items-center space-y-1">
                {/* Moño rosa pequeño (73.png), ~48px ancho */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/save-the-date/coquette-pink/73.png"
                  alt="Lazo rosa"
                  className="w-12 h-auto object-contain mb-1.5"
                />
                <span
                  className="text-[10.5px] uppercase font-bold tracking-[0.25em] block"
                  style={{ color: "#E8B4C4" }}
                >
                  {idioma === "EN" ? (data.tituloRsvpEn || "EARLY RSVP") : "CONFIRMA ANTICIPADA"}
                </span>
                <h3
                  className="text-[2.5rem] sm:text-[2.8rem] leading-tight block"
                  style={{
                    fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
                    color: "#1A1216",
                  }}
                >
                  {idioma === "EN" ? (data.preguntaRsvpEn || "Will You Join Us?") : "¿Nos Acompañas?"}
                </h3>
                <p className="text-xs px-1 leading-relaxed" style={{ color: "#6B5B60" }}>
                  {mensajeRsvp}
                </p>
              </div>

              {rsvpCompletado ? (
                <div className="py-5 px-3 text-center space-y-2.5">
                  <div className="flex items-center justify-center mx-auto">
                    <Heart
                      className="w-6 h-6"
                      style={{ color: "#E8B4C4", fill: "rgba(232, 180, 196, 0.2)" }}
                    />
                  </div>
                  <h4
                    className="text-4xl font-normal leading-none"
                    style={{
                      fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
                      color: "#1A1216",
                    }}
                  >
                    {idioma === "EN" ? "Thank You!" : "¡Gracias!"}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#6B5B60" }}>
                    {idioma === "EN"
                      ? "Your spot is reserved. We will share official details soon."
                      : "Tu lugar está reservado. Muy pronto te compartiremos los detalles oficiales."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnviarPreRsvp} className="space-y-4">
                  {rsvpError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                      {rsvpError}
                    </div>
                  )}

                  {/* Selector de respuesta */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Opción 1: Will Attend! */}
                    <button
                      type="button"
                      onClick={() => setRespuesta("SI")}
                      className={`py-2.5 px-2 rounded-full text-[11px] font-medium border text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                        respuesta === "SI"
                          ? "bg-[#D98A9E] text-white border-[#D98A9E]"
                          : "bg-transparent text-[#1A1216] border-[#D9C7A7] hover:border-[#C5A059]"
                      }`}
                    >
                      {respuesta === "SI" && (
                        <svg
                          className="w-3 h-3 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      <span className="truncate">{idioma === "EN" ? "Will Attend!" : "¡Sí asistiré!"}</span>
                    </button>

                    {/* Opción 2: Maybe */}
                    <button
                      type="button"
                      onClick={() => setRespuesta("TAL_VEZ")}
                      className={`py-2.5 px-2 rounded-full text-[11px] font-medium border text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                        respuesta === "TAL_VEZ"
                          ? "bg-[#D98A9E] text-white border-[#D98A9E]"
                          : "bg-transparent text-[#1A1216] border-[#D9C7A7] hover:border-[#C5A059]"
                      }`}
                    >
                      {respuesta === "TAL_VEZ" && (
                        <svg
                          className="w-3 h-3 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      <span className="truncate">{idioma === "EN" ? "Maybe" : "Tal vez"}</span>
                    </button>

                    {/* Opción 3: Can't Make It */}
                    <button
                      type="button"
                      onClick={() => setRespuesta("NO")}
                      className={`py-2.5 px-2 rounded-full text-[11px] font-medium border text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                        respuesta === "NO"
                          ? "bg-[#D98A9E] text-white border-[#D98A9E]"
                          : "bg-transparent text-[#1A1216] border-[#D9C7A7] hover:border-[#C5A059]"
                      }`}
                    >
                      {respuesta === "NO" && (
                        <svg
                          className="w-3 h-3 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      <span className="truncate">{idioma === "EN" ? "Can't Make It" : "No podré"}</span>
                    </button>
                  </div>

                  {/* Campos de contacto */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label
                        className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1"
                        style={{ color: "#1A1216" }}
                      >
                        {idioma === "EN" ? "Full Name *" : "Tu Nombre Completo *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder={idioma === "EN" ? "e.g. The Rodriguez Family or Name" : "Ej. Familia Rodríguez o Nombre"}
                        className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#D9C7A7] text-xs bg-white text-[#1A1216] placeholder:text-[#A89A9E] focus:border-[1.5px] focus:border-[#C5A059] focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>

                    {/* Teléfono y Pases (Pases se oculta si seleccionó "No podré") */}
                    <div className={`grid ${respuesta === "NO" ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                      <div className={respuesta === "NO" ? "col-span-1" : ""}>
                        <label
                          className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1"
                          style={{ color: "#1A1216" }}
                        >
                          {idioma === "EN" ? "Phone / WhatsApp" : "Teléfono / WhatsApp"}
                        </label>
                        <input
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2.5 rounded-[12px] border border-[#D9C7A7] text-xs bg-white text-[#1A1216] placeholder:text-[#A89A9E] focus:border-[1.5px] focus:border-[#C5A059] focus:outline-none focus:ring-0 transition-colors"
                        />
                      </div>

                      {respuesta !== "NO" && (
                        <div>
                          <label
                            className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1"
                            style={{ color: "#1A1216" }}
                          >
                            {idioma === "EN" ? "Estimated Guests" : "Pases Estimados"}
                          </label>
                          <select
                            value={pases}
                            onChange={(e) => setPases(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-[12px] border border-[#D9C7A7] text-xs bg-white text-[#1A1216] focus:border-[1.5px] focus:border-[#C5A059] focus:outline-none focus:ring-0 transition-colors"
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
                      <label
                        className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1"
                        style={{ color: "#1A1216" }}
                      >
                        {idioma === "EN" ? `Note or message for ${nombreFestejada}` : `Nota o mensaje para ${nombreFestejada}`}
                      </label>
                      <textarea
                        rows={2}
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder={idioma === "EN" ? "Congratulations, we love you!" : "Felicidades, te queremos mucho"}
                        className="w-full px-3.5 py-2 rounded-[12px] border border-[#D9C7A7] text-xs bg-white text-[#1A1216] placeholder:text-[#A89A9E] focus:border-[1.5px] focus:border-[#C5A059] focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Botón dorado #C5A059 con texto oscuro #1A1216 */}
                  <button
                    type="submit"
                    disabled={enviandoRsvp}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-[0.18em] shadow-sm hover:brightness-105 active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      backgroundColor: "#C5A059",
                      color: "#1A1216",
                    }}
                  >
                    {enviandoRsvp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{idioma === "EN" ? "SENDING RSVP..." : "ENVIANDO RESPUESTA..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{idioma === "EN" ? "CONFIRM EARLY RSVP" : "CONFIRMAR PRE-REGISTRO"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </section>
          )}

          {/* Pie de página con Branding Elegante Click & Love */}
          <footer className="w-full pt-8 pb-12 px-5 flex flex-col items-center text-center">
            <div
              className="w-12 h-px my-3"
              style={{ backgroundColor: "rgba(197, 160, 89, 0.7)" }}
            />

            <p
              className="text-3xl sm:text-[2.1rem] leading-tight mb-20"
              style={{
                fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
                color: "#FAF6F0",
              }}
            >
              {idioma === "EN"
                ? "We can't wait to celebrate with you"
                : "No podemos esperar para celebrar contigo"}
            </p>

            <a
              href="https://clickandlove.app?utm_source=invitacion&utm_medium=footer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: "#FAF6F0",
                border: "1px solid rgba(197, 160, 89, 0.45)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
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
