"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { InvitationData } from "../invitation/InvitationMobileView";

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
  const [selectedSeats, setSelectedSeats] = useState("2");

  // Destinatario personalizado desde la URL (?para=Familia+Perez)
  const [guestRecipient, setGuestRecipient] = useState("Familia & Amigos");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const name = params.get("para") || params.get("invitado") || params.get("guest");
      if (name) setGuestRecipient(name);
    }
  }, []);

  // Apertura del sobre 3D
  const handleOpenEnvelope = () => {
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

  // Envío a WhatsApp
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = data.telefonoWhatsappRsvp.replace(/[^0-9]/g, "");
    const text =
      `*Confirmación de Asistencia - Mis XV Años ${data.titulo}*%0A` +
      `*Invitado:* ${encodeURIComponent(guestName)}%0A` +
      `*Pases confirmados:* ${encodeURIComponent(selectedSeats)}%0A` +
      `¡Será un honor acompañarte en tu gran día! 🦋✨`;

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, "_blank");
  };

  const defaultAudio =
    data.musicaUrl ||
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3";

  return (
    <div className="relative min-h-screen font-sans-body text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* 1. Fondo General Acuarela Fijo en el Viewport */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/template-butterfly/fondo-cielo-acuarela.jpg"
        alt="Fondo Acuarela"
        className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none"
      />

      {/* Audio en bucle */}
      <audio ref={audioRef} loop preload="none" src={defaultAudio} />

      {/* ========================================================= */}
      {/* INTRO 3D REAL: SOBRE CON SELLO DE CERA Y MARIPOSA CON ALETEO 3D */}
      {/* ========================================================= */}
      {!skipIntro && !isEnvelopeRemoved && (
        <aside
          id="envelopeOverlay"
          onClick={handleOpenEnvelope}
          className={`fixed inset-0 z-50 bg-[#142333]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-opacity duration-700 select-none ${
            isEnvelopeFading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-center mb-6 text-blue-100 font-serif-roman">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#D8B772]">
              Tienes una invitación especial
            </p>
            <p className="text-base mt-1.5 italic text-blue-200 font-cormorant">
              {guestRecipient}
            </p>
            <p className="text-xs mt-1 text-blue-300/80 font-cormorant">
              Toca el sello para abrir tu invitación
            </p>
          </div>

          {/* Contenedor del Sobre Físico 3D con Assets Originales */}
          <div
            id="envelopeContainer"
            className="relative w-80 sm:w-96 h-56 sm:h-64 cursor-pointer group"
            style={{ perspective: "1000px" }}
          >
            {/* Fondo / Solapa trasera interna */}
            <div className="absolute inset-0 bg-[#E8D9CD] rounded-2xl shadow-2xl" />

            {/* Tarjeta interior que sale deslizándose con borde dorado */}
            <div
              id="innerCard"
              className={`absolute left-5 right-5 top-5 bottom-5 bg-[#FFFEFC] rounded-xl p-5 shadow-lg flex flex-col items-center justify-center text-center transform transition-transform duration-700 ease-out border border-[#D8B772]/60 ${
                isLetterOut
                  ? "-translate-y-32 scale-105 z-25 shadow-2xl"
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
              <p className="text-[10px] text-slate-500 font-serif-roman tracking-wider">
                {data.fechaTextoPersonalizada || "14 • Noviembre • 2026"}
              </p>
            </div>

            {/* Si está cerrado: Sobre beige original con flores en esquinas */}
            {!isEnvelopeOpen ? (
              <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/template-butterfly/sobre-cerrado.png"
                  alt="Sobre Cerrado"
                  className="w-full h-full object-contain"
                />

                {/* Mariposa aleteando en 3D sobre el sello */}
                <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/template-butterfly/mariposa-azul.png"
                    alt="Mariposa viva"
                    className="w-12 h-auto object-contain animate-flutter drop-shadow-md"
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

          {/* Botón táctil con brillo */}
          <button
            type="button"
            className="mt-8 text-[11px] font-serif-roman tracking-[0.25em] uppercase text-[#E7CD91] bg-white/10 px-6 py-2.5 rounded-full border border-[#C5A059]/40 hover:bg-white/20 transition cursor-pointer"
          >
            Toca el sobre para abrir
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

        {/* Navbar superior minimalista */}
        <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-blue-100/80 px-6 py-3 flex justify-between items-center text-xs tracking-widest uppercase font-serif-roman text-[#2F5A84]">
          <a href="#welcome" className="hover:text-[#C5A059] transition font-bold">
            Inicio
          </a>
          <div className="flex items-center gap-4">
            <a href="#rsvp" className="hover:text-[#C5A059] transition font-semibold">
              RSVP
            </a>
            <button
              type="button"
              onClick={toggleMusic}
              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition cursor-pointer ${
                isPlaying
                  ? "bg-blue-200 border-blue-400 text-[#2F5A84] animate-pulse"
                  : "bg-blue-50 border-blue-200 text-[#2F5A84]"
              }`}
              title={isPlaying ? "Pausar música" : "Reproducir música"}
            >
              🎵
            </button>
          </div>
        </nav>

        {/* ======================================================= */}
        {/* SECCIÓN 1: Portada con Efecto Papel Rasgado y Título    */}
        {/* ======================================================= */}
        <section id="welcome" className="pt-8 text-center relative flex flex-col items-center z-20">
          <div className="flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/mariposa-azul.png"
              alt="Mariposa"
              className="w-5 h-auto object-contain animate-flutter"
            />
            <h1 className="font-script text-5xl text-[#2F5A84]">My Quinceañera</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/mariposa-azul.png"
              alt="Mariposa"
              className="w-5 h-auto object-contain animate-flutter"
            />
          </div>

          {/* Foto 1 (Con efecto de papel rasgado orgánico en la base) */}
          <div className="w-full px-4 mt-2">
            <div className="relative w-full h-[390px] rounded-t-3xl overflow-hidden shadow-xl border-2 border-white/90 bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.fotoPortadaUrl || "/assets/template-butterfly/foto-columpio-portada.png"}
                alt={data.titulo}
                className="w-full h-full object-cover select-none"
              />

              {/* Rasgado inferior de papel orgánico */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/template-butterfly/torn-paper-bottom.png"
                alt="Rasgado inferior"
                className="absolute -bottom-1 left-0 w-full pointer-events-none z-10 select-none"
              />

              {/* Cartela superpuesta con el nombre del anfitrión */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-[#D8B772]/70 px-6 py-3 rounded-xl shadow-lg text-center min-w-[210px] z-20">
                <p className="font-serif-roman text-[11px] tracking-[0.25em] uppercase text-[#C5A059] font-bold">
                  {data.titulo}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN REPRODUCTOR DE MÚSICA / DÍPTICO (CANVA REPLICA) */}
        {/* ======================================================== */}
        <section className="relative w-full py-10 px-4 flex justify-center items-center overflow-visible select-none z-20">
          {/* Contenedor Maestro con dimensiones fijas para anclar los elementos */}
          <div className="relative w-full max-w-[390px] h-[340px] flex items-center justify-center">
            {/* 1. TEXTO EN ARCO Y NOTAS MUSICALES (Arriba a la izquierda) */}
            <div className="absolute -top-3 left-2 z-20 pointer-events-none">
              <span className="block font-serif-roman text-[10px] tracking-[0.25em] text-slate-500 uppercase -rotate-12 translate-x-3 translate-y-2 font-semibold">
                Click to Play Music
              </span>
              <span className="block text-2xl text-slate-700 font-serif translate-x-20 -translate-y-2 rotate-12">
                𝄞 𝅘𝅥𝅯 𝅘𝅥𝅮
              </span>
            </div>

            {/* 2. DISCO DE VINILO (Asomando detrás a la izquierda) */}
            <div
              id="vinylRecord"
              onClick={toggleMusic}
              className={`absolute -top-1 left-2 w-36 h-36 rounded-full bg-[#111] border-[3px] border-slate-700 shadow-2xl flex items-center justify-center z-10 cursor-pointer transition-transform duration-500 hover:scale-105 ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "4s" }}
              title={isPlaying ? "Pausar música" : "Reproducir música"}
            >
              {/* Surcos del vinilo */}
              <div className="w-28 h-28 rounded-full border border-neutral-700/60 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-neutral-700/50 flex items-center justify-center">
                  {/* Centro celeste / Botón Play */}
                  <div className="w-12 h-12 rounded-full bg-[#ABC7DE] border-2 border-white shadow-inner flex items-center justify-center text-white text-base pl-0.5">
                    {isPlaying ? "❚❚" : "▶"}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DÍPTICO FOTOGRÁFICO (Doble foto central estilo libro abierto) */}
            <div className="relative z-20 w-[290px] h-[200px] bg-white p-2 rounded-sm shadow-[0_12px_30px_rgba(0,0,0,0.18)] border border-slate-200/80 flex gap-1 transform rotate-[-1deg] translate-x-4 translate-y-3">
              {/* Foto izquierda (Quinceañera soplando beso) */}
              <div className="w-1/2 h-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    data.fotoInfanciaUrl ||
                    "/assets/template-butterfly/foto-sesion-1.jpg"
                  }
                  alt="Sesión Quinceañera 1"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Foto derecha (Quinceañera con caballo) */}
              <div className="w-1/2 h-full overflow-hidden bg-slate-100 border-l border-white/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    data.fotoActualUrl ||
                    "/assets/template-butterfly/foto-sesion-2.jpg"
                  }
                  alt="Sesión Quinceañera 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 4. RAMILLETE FLORAL INFERIOR IZQUIERDO (PNG transparente) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/flores-azules-esquina-izq.png"
              alt="Flores Azules Izquierda"
              className="absolute -bottom-6 -left-3 w-36 h-auto z-30 pointer-events-none drop-shadow-md"
            />

            {/* 5. RAMILLETE FLORAL INFERIOR DERECHO (PNG transparente) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/flores-azules-esquina-der.png"
              alt="Flores Azules Derecha"
              className="absolute -bottom-4 right-1 w-24 h-auto z-30 pointer-events-none drop-shadow-sm"
            />

            {/* 6. MARIPOSA AZUL CON ALETEO 3D (Esquina superior derecha del álbum) */}
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
        {/* SECCIÓN 3: Palabras Emotivas y Separador Floral Dorado  */}
        {/* ======================================================= */}
        <section className="px-8 py-4 text-center z-20">
          <p className="font-cormorant italic text-base leading-relaxed text-slate-700">
            {data.frasePersonalizada ||
              "“Doy gracias a Dios por concederme la dicha de celebrar mis quince primaveras, y a mis padres por guiar cada uno de mis pasos con amor incondicional.”"}
          </p>

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
        {/* SECCIÓN 4: PLACA DE FECHA Y LUGAR + FOTO CON BORDES RASGADOS */}
        {/* ======================================================== */}
        <section className="relative w-full py-8 px-4 flex flex-col items-center overflow-visible select-none z-20">
          {/* 1. PLACA DE FECHA Y LUGAR (PERGAMINO CON FLORES) */}
          <div className="relative w-full max-w-[340px] mb-8">
            {/* Marco de fondo con flores y rosas (Asset PNG transparente) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/assets/template-butterfly/marco-fecha-pergamino.png" 
              alt="Marco Fecha" 
              className="w-full h-auto drop-shadow-sm select-none"
            />

            {/* Contenido tipográfico centrado dentro del marco */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-3 text-center pointer-events-none">
              <p className="font-serif-roman text-xs tracking-[0.25em] text-[#C5A059] uppercase font-bold">
                OCTOBER
              </p>
              
              {/* Línea divisoria con día y hora */}
              <div className="flex items-center gap-3 my-1 border-t border-b border-[#D8B772]/60 py-0.5 px-3">
                <span className="font-serif-roman text-[10px] tracking-widest text-slate-500 uppercase">SATURDAY</span>
                <span className="font-serif-roman text-sm font-bold text-[#2F5A84]">24</span>
                <span className="font-serif-roman text-[10px] tracking-widest text-slate-500 uppercase">AT 3 PM</span>
              </div>

              <p className="font-serif-roman text-[10px] tracking-widest text-slate-400">
                2026
              </p>
              
              <div className="mt-1">
                <p className="font-serif-roman text-[9px] tracking-[0.15em] uppercase text-slate-600 font-semibold">
                  {data.recepcionNombre || "QUINCE PALACE"}
                </p>
                <p className="text-[8px] text-slate-400">
                  {data.recepcionDireccion || "123 QUINCE ST, CITY, ST ZIP"}
                </p>
              </div>
            </div>

            {/* Mariposa azul superpuesta en la esquina inferior izquierda con aleteo 3D */}
            <div 
              className="absolute -bottom-4 -left-3 w-16 z-20 pointer-events-none"
              style={{ perspective: "500px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/assets/template-butterfly/mariposa-fecha.png" 
                alt="Mariposa" 
                className="w-full h-auto drop-shadow-md animate-flutter"
              />
            </div>
          </div>

          {/* 2. FOTO PRINCIPAL CON RASGADO ORGÁNICO REAL */}
          <div className="relative w-full max-w-[390px] h-[480px] overflow-hidden my-2 shadow-xl bg-slate-200">
            {/* Foto de la Quinceañera (Llenando el contenedor) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={data.fotoActualUrl || "/assets/template-butterfly/foto-gala-vestido.jpg"} 
              alt="Quinceañera" 
              className="w-full h-full object-cover select-none"
            />

            {/* Capa superior: Rasgado de papel blanco/acuarela (PNG transparente) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/assets/template-butterfly/torn-paper-top.png" 
              alt="Rasgado superior" 
              className="absolute top-0 left-0 w-full pointer-events-none z-10 select-none"
            />

            {/* Capa inferior: Rasgado de papel blanco/acuarela (PNG transparente) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/assets/template-butterfly/torn-paper-bottom.png" 
              alt="Rasgado inferior" 
              className="absolute bottom-0 left-0 w-full pointer-events-none z-10 select-none"
            />
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 6: Itinerario con Guirnalda Vertical Original   */}
        {/* ======================================================= */}
        <section className="px-6 py-8 z-20">
          {/* Título enmarcado con la nube acuarela */}
          <div className="relative w-48 h-12 mx-auto flex items-center justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/nube-acuarela.png"
              alt="Nube Acuarela"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <h3 className="relative z-10 font-serif-roman text-xs tracking-[0.25em] text-[#2F5A84] uppercase font-bold">
              Itinerario
            </h3>
          </div>

          {/* Timeline conectada por la guirnalda vertical original */}
          <div className="relative max-w-[340px] mx-auto py-4">
            {/* Guirnalda floral vertical original centrada */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-12 pointer-events-none z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/template-butterfly/guirnalda-itinerario.png"
                alt="Guirnalda"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Eventos distribuidos a los lados de la guirnalda */}
            <div className="space-y-12 relative z-20">
              <div className="grid grid-cols-2 gap-8 items-center">
                <div className="text-right pr-4">
                  <span className="font-serif-roman text-xs font-bold text-[#2F5A84]">04:30 PM</span>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Llegada & Recepción 🕊️</p>
                </div>
                <div className="pl-4 text-left">
                  <span className="text-xs text-[#C5A059] font-serif-roman italic">Bienvenida</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 items-center">
                <div className="text-right pr-4">
                  <span className="text-xs text-[#C5A059] font-serif-roman italic">Misa Solemne</span>
                </div>
                <div className="pl-4 text-left">
                  <span className="font-serif-roman text-xs font-bold text-[#2F5A84]">05:30 PM</span>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Acción de Gracias ⛪</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 items-center">
                <div className="text-right pr-4">
                  <span className="font-serif-roman text-xs font-bold text-[#2F5A84]">07:00 PM</span>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Cena & Brindis 🥂</p>
                </div>
                <div className="pl-4 text-left">
                  <span className="text-xs text-[#C5A059] font-serif-roman italic">Banquete Real</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 items-center">
                <div className="text-right pr-4">
                  <span className="text-xs text-[#C5A059] font-serif-roman italic">Vals de Gala</span>
                </div>
                <div className="pl-4 text-left">
                  <span className="font-serif-roman text-xs font-bold text-[#2F5A84]">08:30 PM</span>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Vals & Pista de Baile 👑</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 7: Código de Vestimenta con Marco Barroco Oval  */}
        {/* ======================================================= */}
        <section className="px-6 py-6 text-center z-20">
          <h3 className="font-serif-roman text-xs tracking-[0.2em] text-[#2F5A84] uppercase mb-2 font-bold">
            Código de Vestimenta
          </h3>

          {/* Marco barroco ovalado con rosas (marco-dress-code.png) */}
          <div className="relative w-64 h-64 mx-auto my-3 flex items-center justify-center">
            {/* Foto en z-10 */}
            <div className="w-[176px] h-[176px] rounded-full overflow-hidden z-10 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  data.fotoCierreUrl ||
                  "/assets/template-butterfly/foto-zapatilla-original.png"
                }
                alt="Zapatilla de Gala"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Marco barroco en capa superior absoluta z-20 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/marco-dress-code.png"
              alt="Marco Barroco"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-xl"
            />
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            {/* Traje de gala masculino */}
            <div className="w-16 h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/template-butterfly/traje-gala.png"
                alt="Traje Masculino"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="text-left max-w-[200px]">
              <p className="font-bold text-[#2F5A84] font-serif-roman text-xs">
                {data.dressCodeTitulo || "Formal & Rigurosa Etiqueta"}
              </p>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {data.dressCodeNota ||
                  "Agradecemos reservar los tonos azul celeste y blanco exclusivamente para la quinceañera."}
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 8: Ubicación (The Location)                     */}
        {/* ======================================================= */}
        <section className="px-6 py-6 text-center z-20">
          <h3 className="font-serif-roman text-xs tracking-[0.25em] text-[#2F5A84] uppercase mb-2 font-bold">
            Ubicación
          </h3>
          <p className="text-sm font-semibold text-slate-800">{data.recepcionNombre}</p>
          <p className="text-xs text-slate-500 mb-4">{data.recepcionDireccion}</p>
          <a
            href={data.recepcionMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#2F5A84] text-white py-3.5 rounded-xl font-serif-roman text-xs uppercase tracking-widest hover:bg-[#203e5c] transition shadow-md"
          >
            <MapPin className="w-3.5 h-3.5" />
            Ver en Google Maps
          </a>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 9: Mesa de Regalos / Lluvia de Sobres           */}
        {/* ======================================================= */}
        <section className="px-6 py-6 text-center z-20">
          {/* Cofre de regalos original */}
          <div className="w-44 h-44 mx-auto mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/caja-regalos.png"
              alt="Cofre de Regalos"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          <h3 className="font-serif-roman text-xs tracking-[0.2em] text-[#2F5A84] uppercase font-bold">
            Lluvia de Sobres
          </h3>
          <p className="font-cormorant italic text-sm text-slate-600 max-w-xs mx-auto mt-1">
            “Tu presencia es nuestro mayor regalo. Si deseas tener un detalle con la quinceañera, dispondremos de un cofre en la recepción.”
          </p>
        </section>

        {/* ======================================================= */}
        {/* SECCIÓN 10: Formulario RSVP con Gráfico Heráldico       */}
        {/* ======================================================= */}
        <section id="rsvp" className="px-4 py-6 z-20">
          {/* Gráfico heráldico sobre-rsvp.png montado en la cabecera */}
          <div className="relative w-full max-w-[390px] mx-auto -mb-6 z-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/sobre-rsvp.png"
              alt="RSVP Encabezado"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Tarjeta de Formulario por debajo del escudo */}
          <div className="bg-white/95 backdrop-blur-sm p-6 pt-10 rounded-3xl border border-[#D8B772]/60 shadow-xl text-center relative z-10">
            <h3 className="font-script text-4xl text-[#2F5A84] my-1">Confirmar Asistencia</h3>
            <p className="text-[11px] text-slate-400 mb-5 uppercase tracking-wider font-serif-roman">
              Favor de confirmar antes del {data.fechaLimiteRsvp || "20 de Octubre"}
            </p>

            <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-serif-roman">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#F4F9FD] border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2F5A84]"
                  placeholder="Ej. Familia Morales"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 font-serif-roman">
                  Pases Confirmados
                </label>
                <div className="flex gap-4 pt-1 text-xs text-slate-600">
                  {["1", "2", "3+"].map((seat) => (
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
                className="w-full bg-[#2F5A84] text-white py-3.5 rounded-xl font-serif-roman text-xs uppercase tracking-widest hover:bg-[#203e5c] transition shadow-md cursor-pointer"
              >
                Enviar por WhatsApp
              </button>
            </form>
          </div>
        </section>

        {/* ======================================================= */}
        {/* FOOTER: Carta de Agradecimiento y Ramillete de Flores   */}
        {/* ======================================================= */}
        <footer className="px-6 pt-6 pb-6 text-center z-20">
          {/* Ramillete de flores original */}
          <div className="w-36 h-36 mx-auto mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/template-butterfly/ramo-flores.png"
              alt="Ramillete de Flores"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          <p className="font-cormorant italic text-base text-slate-600">
            Esperamos contar con tu valiosa presencia.
          </p>
          <h3 className="font-script text-5xl text-[#2F5A84] mt-2">{data.titulo}</h3>
        </footer>
      </main>
    </div>
  );
}
