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
    mensaje?: string | null;
    fechaEvento: string | Date;
    fechaTextoPersonalizada?: string | null;
    ciudad?: string | null;
    colorSobre?: string | null;
    colorSello?: string | null;
    fotoPortadaUrl: string;
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
  };
  skipIntro?: boolean;
}

export default function QuinceRosadoSaveTheDate({
  data,
  skipIntro = false,
}: SaveTheDateProps) {
  // Estado del sobre (abierto o cerrado)
  const [sobreAbierto, setSobreAbierto] = useState(
    skipIntro || !data.mostrarSobre
  );
  const [animandoSobre, setAnimandoSobre] = useState(false);

  // Música
  const [reproduciendo, setReproduciendo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contenidoRef = useRef<HTMLDivElement | null>(null);

  // Cuenta regresiva
  const fechaObj = useMemo(() => new Date(data.fechaEvento), [data.fechaEvento]);
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
    const target = fechaObj.getTime();
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
  }, [fechaObj]);

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
          pasesTentativos: pases,
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
          colors: ["#7A002A", "#C5A059", "#25D366"],
        });
      } catch {}
    } catch (err: any) {
      setRsvpError(err.message || "Error al procesar la confirmación");
    } finally {
      setEnviandoRsvp(false);
    }
  };

  // Días y nombres del mes para el calendario
  const anio = fechaObj.getFullYear();
  const mesIdx = fechaObj.getMonth();
  const diaEvento = fechaObj.getDate();

  const mesesNombres = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];
  const nombreMes = mesesNombres[mesIdx];

  // Generar cuadrícula del calendario (Lunes = 0)
  const primerDiaSemana = new Date(anio, mesIdx, 1).getDay(); // 0 = Domingo
  const diasEnMes = new Date(anio, mesIdx + 1, 0).getDate();
  const offsetDias = (primerDiaSemana + 6) % 7; // Ajuste a semana iniciando en Lunes

  const matrizDias: (number | null)[] = [];
  for (let i = 0; i < offsetDias; i++) matrizDias.push(null);
  for (let d = 1; d <= diasEnMes; d++) matrizDias.push(d);

  return (
    <div
      className="min-h-screen text-[#2C1F1B] font-sans antialiased relative overflow-x-hidden selection:bg-[#7A002A] selection:text-white pb-20"
      style={{
        backgroundImage: "url('/assets/save-the-date/background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Capa de velo suave para unificar el fondo satinado */}
      <div className="fixed inset-0 bg-white/35 pointer-events-none backdrop-blur-[1px]" />

      {/* Audio Element Oculto */}
      {data.musicaUrl && (
        <audio ref={audioRef} src={data.musicaUrl} preload="auto" loop />
      )}

      {/* Botón flotante de música */}
      {data.musicaUrl && sobreAbierto && (
        <button
          onClick={toggleMusica}
          className="fixed top-4 right-4 z-40 p-3 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-pink-200 text-[#7A002A] hover:scale-105 active:scale-95 transition cursor-pointer"
          title={reproduciendo ? "Pausar música" : "Reproducir música"}
          aria-label="Control de música"
        >
          {reproduciendo ? (
            <Volume2 className="w-5 h-5 animate-pulse text-[#7A002A]" />
          ) : (
            <VolumeX className="w-5 h-5 text-stone-400" />
          )}
        </button>
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

            {/* Foto 2: Estado Sobre Abierto (f291897753a9fc56f20003d177749b21.webp) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/save-the-date/f291897753a9fc56f20003d177749b21.webp"
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
                    MIS XV AÑOS
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
                    <span>Ver detalles</span>
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
          className="w-full relative z-10 animate-in fade-in duration-700 space-y-4"
        >
          {/* ============================================================ */}
          {/* REPRODUCTOR DE MÚSICA SUPERIOR (SATÉN CONTINUO) */}
          {/* ============================================================ */}
          <div className="w-full max-w-md mx-auto px-4 pt-6 pb-2 flex flex-col items-center">
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

              {/* Botón Central Play / Pause */}
              <button
                type="button"
                onClick={toggleMusica}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative cursor-pointer shadow-[0_4px_14px_rgba(90,60,45,0.25)] transition transform hover:scale-105 active:scale-95 group"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #8F1437 0%, #5E0820 60%, #380413 100%)",
                  boxShadow:
                    "0 0 0 2px rgba(255, 255, 255, 0.9), 0 0 0 3.5px #C5A059, 0 6px 16px rgba(60, 20, 30, 0.35)",
                }}
                title={reproduciendo ? "Pausar música" : "Reproducir música"}
                aria-label="Play / Pausa"
              >
                {reproduciendo ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-[#F9E8B2] fill-current" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-[#F9E8B2] fill-current ml-0.5" />
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
              {reproduciendo ? "MÚSICA REPRODUCIENDO" : 'PRESIONA "PLAY"'}
            </p>
          </div>

          {/* ============================================================ */}
          {/* SECCIÓN 2: GALERÍA DE FOTOS + CORONA + DIVISOR FLORAL */}
          {/* ============================================================ */}
          <section
            className="galeria-section relative w-full flex flex-col items-center py-7 sm:py-8"
            style={{
              background:
                "linear-gradient(180deg, rgba(235, 206, 209, 0.45) 0%, rgba(232, 198, 202, 0.75) 50%, rgba(235, 206, 209, 0.45) 100%)",
              borderTop: "1px solid rgba(197, 160, 89, 0.4)",
              borderBottom: "1px solid rgba(197, 160, 89, 0.4)",
            }}
          >
            {/* La Corona Centrada */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/save-the-date/corona.webp"
              alt="Corona Real"
              className="galeria-corona w-[120px] h-auto object-contain mb-3.5"
              style={{
                filter: "drop-shadow(0 4px 8px rgba(90, 60, 45, 0.18))",
              }}
            />

            {/* Grid de 3 Fotos Verticales */}
            <div className="galeria-grid grid grid-cols-3 gap-[5px] w-[94%] max-w-[440px] mx-auto">
              <div className="relative aspect-[3/5] overflow-hidden rounded-[2px] border border-[rgba(197,160,89,0.55)] shadow-[0_6px_14px_rgba(60,40,35,0.15)] group bg-white/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/save-the-date/save1.webp"
                  alt={`${nombreFestejada} - 1`}
                  className="galeria-foto w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="relative aspect-[3/5] overflow-hidden rounded-[2px] border border-[rgba(197,160,89,0.55)] shadow-[0_6px_14px_rgba(60,40,35,0.15)] group bg-white/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/save-the-date/save2.webp"
                  alt={`${nombreFestejada} - 2`}
                  className="galeria-foto w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="relative aspect-[3/5] overflow-hidden rounded-[2px] border border-[rgba(197,160,89,0.55)] shadow-[0_6px_14px_rgba(60,40,35,0.15)] group bg-white/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/save-the-date/save3.webp"
                  alt={`${nombreFestejada} - 3`}
                  className="galeria-foto w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Cierre inferior con guirnalda floral de borde a borde */}
            <div className="w-[94%] max-w-[440px] mx-auto flex justify-center mt-3.5 sm:mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/save-the-date/flores.webp"
                alt="Divisor Floral"
                className="w-full h-auto object-contain opacity-95 drop-shadow-sm"
              />
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECCIONES POSTERIORES (CUENTA REGRESIVA, CALENDARIO, PRE-RSVP) */}
          {/* ============================================================ */}
          <div className="max-w-md mx-auto px-4 space-y-10 pt-4">

          {/* ============================================================ */}
          {/* SECCIÓN CUENTA REGRESIVA */}
          {/* ============================================================ */}
          {data.mostrarContador && (
            <section className="bg-gradient-to-br from-[#7A002A] to-[#4A0319] text-white rounded-[32px] p-6 shadow-xl text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">
                  Tiempo Restante
                </span>
                <h3 className="font-serif text-2xl font-bold text-pink-50">
                  La Cuenta Regresiva
                </h3>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15">
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-amber-200">
                    {tiempo.dias}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-pink-100">
                    Días
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15">
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-amber-200">
                    {tiempo.horas}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-pink-100">
                    Horas
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15">
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-amber-200">
                    {tiempo.minutos}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-pink-100">
                    Min
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15">
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-amber-200">
                    {tiempo.segundos}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-pink-100">
                    Seg
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECCIÓN CALENDARIO CON MARCO ELEGANTE (calendario.png) */}
          {/* ============================================================ */}
          {data.mostrarCalendario && (
            <section className="relative rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col items-center">
              {/* Marco gráfico de fondo decorativo */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  backgroundImage: "url('/assets/save-the-date/calendario.webp')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                }}
              />

              <div className="w-full text-center space-y-1 pt-2">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block">
                  Reserva La Fecha
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#7A002A]">
                  {nombreMes} {anio}
                </h3>
              </div>

              {/* Cuadrícula interactiva del mes */}
              <div className="w-full max-w-[300px] mt-4">
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-stone-500 mb-2 uppercase">
                  <span>L</span>
                  <span>M</span>
                  <span>M</span>
                  <span>J</span>
                  <span>V</span>
                  <span>S</span>
                  <span>D</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                  {matrizDias.map((dia, idx) => {
                    if (dia === null) {
                      return <div key={`empty-${idx}`} className="h-8" />;
                    }

                    const esElDia = dia === diaEvento;

                    return (
                      <div
                        key={`dia-${dia}`}
                        className={`h-8 flex items-center justify-center rounded-full text-xs font-semibold transition relative ${
                          esElDia
                            ? "bg-[#7A002A] text-white shadow-md ring-2 ring-[#C5A059] font-bold scale-110"
                            : "text-stone-700 hover:bg-stone-100/60"
                        }`}
                      >
                        {dia}
                        {esElDia && (
                          <span className="absolute -top-1 -right-1 text-[10px]">
                            👑
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botones de acción: Agregar a Google / Apple Calendar */}
              <div className="w-full max-w-[300px] pt-6 flex flex-col gap-2.5">
                <a
                  href={generateGoogleCalendarUrl({
                    titulo: `Save the Date · ${nombreFestejada}`,
                    descripcion: `Reserva la fecha para los quince años de ${nombreFestejada}.`,
                    fechaInicio: fechaObj,
                    ciudad: data.ciudad || "Salón de Eventos",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7A002A] text-white font-semibold text-xs shadow-md hover:bg-[#5E0020] transition active:scale-95"
                >
                  <CalendarPlus className="w-4 h-4 text-amber-200" />
                  <span>Agregar a Google Calendar</span>
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
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/90 text-stone-700 font-medium text-xs border border-stone-200 shadow-xs hover:bg-white transition active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Apple / Outlook Calendar (.ics)</span>
                </button>
              </div>
            </section>
          )}


          {/* ============================================================ */}
          {/* SECCIÓN PRE-RSVP / CONFIRMACIÓN */}
          {/* ============================================================ */}
          {data.mostrarPreRsvp && (
            <section className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 shadow-xl border border-white space-y-5">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
                  Confirmación Anticipada
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#7A002A]">
                  ¿Podrás Acompañarnos?
                </h3>
                <p className="text-xs text-stone-600 px-2 leading-relaxed">
                  {data.textoPreRsvp ||
                    "Ayúdanos confirmando tu asistencia tentativa para apartar tu lugar con anticipación."}
                </p>
              </div>

              {rsvpCompletado ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2 animate-in zoom-in-95">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-emerald-900">
                    ¡Gracias por responder!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Registramos tu respuesta. Muy pronto recibirás todos los
                    detalles oficiales de la invitación.
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
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRespuesta("SI")}
                      className={`py-3 px-2 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        respuesta === "SI"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-base">✨</span>
                      <span>¡Sí asistiré!</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRespuesta("TAL_VEZ")}
                      className={`py-3 px-2 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        respuesta === "TAL_VEZ"
                          ? "bg-amber-600 text-white border-amber-600 shadow-md"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-base">⏳</span>
                      <span>Tal vez</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRespuesta("NO")}
                      className={`py-3 px-2 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        respuesta === "NO"
                          ? "bg-stone-700 text-white border-stone-700 shadow-md"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-base">💌</span>
                      <span>No podré</span>
                    </button>
                  </div>

                  {/* Campos de contacto */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Familia Rodríguez o Nombre"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#7A002A] focus:border-transparent outline-none bg-white/95"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Teléfono / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#7A002A] outline-none bg-white/95"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Pases Estimados
                        </label>
                        <select
                          value={pases}
                          onChange={(e) => setPases(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#7A002A] outline-none bg-white/95"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "pase" : "pases"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Nota o mensaje para {nombreFestejada}
                      </label>
                      <textarea
                        rows={2}
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder="¡Felicidades, te queremos mucho!"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#7A002A] outline-none bg-white/95"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={enviandoRsvp}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7A002A] to-[#990F3D] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {enviandoRsvp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando respuesta...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirmar Pre-Registro</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </section>
          )}

          {/* Pie de página sutil */}
          <footer className="text-center pb-8 pt-4 space-y-1 text-stone-500">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-stone-600">
              {nombreFestejada} · Mis Quince Años
            </p>
            <p className="text-[10px]">
              Invitación creada con amor en Click & Love
            </p>
          </footer>
        </div>
        </div>
      )}
    </div>
  );
}
