"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar,
  Sparkles,
  Music,
  Share2,
} from "lucide-react";
import { InvitationData } from "../invitation/InvitationMobileView";

export default function BlueButterflyTemplate({ data }: { data: InvitationData }) {
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

    // Reproducir música tras el gesto táctil del usuario
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
    <div className="bg-stone-200 flex justify-center min-h-screen font-sans-body text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Elemento de Audio en bucle */}
      <audio ref={audioRef} loop preload="none" src={defaultAudio} />

      {/* ========================================================= */}
      {/* 1. INTRO 3D REAL: SOBRE AZUL CON SELLO DE CERA Y MARIPOSA */}
      {/* ========================================================= */}
      {!isEnvelopeRemoved && (
        <aside
          id="envelopeOverlay"
          onClick={handleOpenEnvelope}
          className={`fixed inset-0 z-50 bg-[#162534] flex flex-col items-center justify-center p-4 transition-opacity duration-700 select-none ${
            isEnvelopeFading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-center mb-8 text-blue-100 font-serif-roman">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059]">
              Tienes una invitación especial
            </p>
            <p className="text-sm mt-1.5 italic text-blue-200/90 font-cormorant">
              {guestRecipient}
            </p>
            <p className="text-xs mt-1 text-blue-300/70 font-cormorant">
              Toca el sello para abrir tu invitación
            </p>
          </div>

          {/* Contenedor del Sobre Físico 3D */}
          <div
            id="envelopeContainer"
            className="relative w-80 h-52 bg-[#CFDFEC] rounded-b-2xl shadow-2xl cursor-pointer group"
            style={{ perspective: "1000px" }}
          >
            {/* Fondo interno del sobre */}
            <div className="absolute inset-0 bg-[#ABC7DE] rounded-b-2xl" />

            {/* Tarjeta interior que sale deslizándose */}
            <div
              id="innerCard"
              className={`absolute left-4 right-4 top-4 bottom-4 bg-[#FFFEFC] rounded-xl p-5 shadow-md flex flex-col items-center justify-center text-center transform transition-transform duration-700 ease-out border border-[#D8B772]/40 ${
                isLetterOut
                  ? "-translate-y-28 scale-105 z-25 shadow-2xl"
                  : "z-10 translate-y-0"
              }`}
            >
              <span className="text-blue-400 text-base">🦋</span>
              <p className="font-serif-roman text-[10px] tracking-[0.25em] uppercase text-[#C5A059] mt-1">
                My Quinceañera
              </p>
              <h3 className="font-script text-4xl text-[#2F5A84] my-1">
                {data.titulo}
              </h3>
              <p className="text-[10px] text-slate-500 font-serif-roman tracking-wider">
                {data.fechaTextoPersonalizada || "14 • Noviembre • 2026"}
              </p>
            </div>

            {/* Solapas frontales estáticas (laterales y fondo inferior) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="w-full h-full border-t-[104px] border-t-transparent border-x-[160px] border-x-transparent border-b-[104px] border-b-[#BBD5E8] rounded-b-2xl" />
            </div>

            {/* Solapa superior triangular 3D (rota hacia arriba) */}
            <div
              id="topFlap"
              className="absolute top-0 left-0 w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-t-[104px] border-t-[#A5C3D9] origin-top transition-transform duration-500 z-30"
              style={{
                transform: isEnvelopeOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                zIndex: isEnvelopeOpen ? 10 : 30,
              }}
            />

            {/* Sello central de cera interactivo */}
            {!isEnvelopeOpen && (
              <div
                id="waxSeal"
                className="absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-[#C5A059] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 border-[#E7CD91] text-lg transition-transform duration-300 group-hover:scale-110"
              >
                🦋
              </div>
            )}
          </div>

          {/* Botón / Guía táctil */}
          <button
            type="button"
            className="mt-8 text-[11px] font-serif-roman tracking-[0.25em] uppercase text-[#E7CD91] bg-white/10 px-6 py-2.5 rounded-full border border-[#C5A059]/40 hover:bg-white/20 transition cursor-pointer"
          >
            Toca el sobre para abrir
          </button>
        </aside>
      )}

      {/* ========================================================= */}
      {/* 2. PLANTILLA PRINCIPAL: BLUE BUTTERFLY GARDEN (9:16)      */}
      {/* ========================================================= */}
      <main className="w-full max-w-[430px] garden-bg min-h-screen shadow-2xl relative flex flex-col pb-16 overflow-hidden">
        {/* Mariposas flotantes en CSS de fondo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-70">
          <span className="absolute top-24 left-6 text-2xl animate-float">🦋</span>
          <span
            className="absolute top-72 right-8 text-xl animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            🦋
          </span>
          <span
            className="absolute top-[650px] left-8 text-lg animate-float"
            style={{ animationDelay: "2.5s" }}
          >
            🦋
          </span>
          <span
            className="absolute top-[1250px] right-6 text-2xl animate-float"
            style={{ animationDelay: "0.8s" }}
          >
            🦋
          </span>
          <span
            className="absolute top-[1850px] left-6 text-xl animate-float"
            style={{ animationDelay: "3s" }}
          >
            🦋
          </span>
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
              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition ${
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

        {/* Sección 1: Portada con Efecto Papel Rasgado y Título */}
        <section id="welcome" className="pt-8 text-center relative flex flex-col items-center z-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🦋</span>
            <h1 className="font-script text-5xl text-[#2F5A84]">My Quinceañera</h1>
            <span className="text-sm">🦋</span>
          </div>

          {/* Foto 1 (Con efecto de papel rasgado en la base) */}
          <div className="w-full px-4 mt-2">
            <div className="relative w-full h-[380px] rounded-t-3xl overflow-hidden shadow-lg border-2 border-white/80 bg-slate-200 torn-mask">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.fotoPortadaUrl}
                alt={data.titulo}
                className="w-full h-full object-cover"
              />
              {/* Cartela con nombre superpuesta */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-[#D8B772]/60 px-6 py-3 rounded-lg shadow-md text-center min-w-[200px]">
                <p className="font-serif-roman text-[10px] tracking-[0.2em] uppercase text-[#C5A059]">
                  {data.titulo}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2: Tocadiscos / Vinilo y Foto Secundaria */}
        <section className="px-6 py-8 text-center relative z-20">
          <div className="relative max-w-[320px] mx-auto flex items-center justify-center">
            {/* Vinilo decorativo detrás */}
            <div
              className="absolute -left-3 w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-800 shadow-xl flex items-center justify-center animate-spin"
              style={{ animationDuration: "10s" }}
            >
              <div className="w-12 h-12 rounded-full bg-[#ABC7DE] border-2 border-white flex items-center justify-center text-[10px]">
                🎶
              </div>
            </div>
            {/* Foto 2 con marco floral */}
            <div className="relative z-10 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl ml-16 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.fotoInfanciaUrl || data.fotoPortadaUrl}
                alt="Sesión Quinceañera"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Sección 3: Palabras Emotivas y Bendición */}
        <section className="px-8 py-6 text-center z-20">
          <p className="font-cormorant italic text-base leading-relaxed text-slate-700">
            {data.frasePersonalizada ||
              "“Doy gracias a Dios por concederme la dicha de celebrar mis quince primaveras, y a mis padres por guiar cada uno de mis pasos con amor incondicional.”"}
          </p>
          <div className="flex justify-center items-center gap-3 my-4">
            <span className="h-[1px] w-12 bg-[#D8B772]" />
            <span className="text-[#D8B772] text-xs">❦</span>
            <span className="h-[1px] w-12 bg-[#D8B772]" />
          </div>
        </section>

        {/* Sección 4: Cuenta Regresiva Estilo Pergamino */}
        <section className="px-6 py-6 z-20">
          <div className="bg-white/90 border border-[#D8B772]/60 rounded-3xl p-6 shadow-sm text-center relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F4F8FC] px-4 font-serif-roman text-[10px] tracking-[0.25em] uppercase text-[#2F5A84] border border-[#D8B772]/40 rounded-full">
              Save The Date
            </span>

            <div className="grid grid-cols-4 gap-2 font-serif-roman text-[#2F5A84] mt-2">
              <div className="bg-[#F4F9FD] p-2.5 rounded-xl border border-blue-100">
                <span className="text-2xl font-bold">{timeLeft.days}</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">Días</p>
              </div>
              <div className="bg-[#F4F9FD] p-2.5 rounded-xl border border-blue-100">
                <span className="text-2xl font-bold">{timeLeft.hours}</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">Horas</p>
              </div>
              <div className="bg-[#F4F9FD] p-2.5 rounded-xl border border-blue-100">
                <span className="text-2xl font-bold">{timeLeft.minutes}</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">Min</p>
              </div>
              <div className="bg-[#F4F9FD] p-2.5 rounded-xl border border-blue-100">
                <span className="text-2xl font-bold">{timeLeft.seconds}</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">Seg</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 5: Retrato de Gala de Cuerpo Entero */}
        <section className="px-6 py-6 text-center z-20">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 w-full h-[460px] torn-mask-both">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoActualUrl || data.fotoPortadaUrl}
              alt="Vestido de Gala"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-6">
            <p className="font-serif-roman text-xs tracking-[0.2em] text-[#C5A059] uppercase">
              Sábado
            </p>
            <h2 className="font-serif-roman text-2xl font-bold text-[#2F5A84] my-1">
              {data.fechaTextoPersonalizada || "14 NOVIEMBRE 2026"}
            </h2>
            <p className="font-serif-roman text-xs tracking-[0.2em] text-slate-500 uppercase">
              5:00 PM
            </p>
          </div>
        </section>

        {/* Sección 6: Itinerario Ilustrado (The Program) */}
        <section className="px-8 py-8 z-20">
          <h3 className="font-serif-roman text-sm tracking-[0.25em] text-[#2F5A84] uppercase text-center mb-8">
            Itinerario
          </h3>
          <div className="border-l-2 border-[#D8B772]/50 ml-6 space-y-7 relative text-xs">
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#2F5A84] border-2 border-white" />
              <span className="font-bold text-[#2F5A84] font-serif-roman tracking-wider">
                04:30 PM
              </span>
              <p className="text-slate-600 mt-0.5 font-medium">Recepción de Invitados 🕊️</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#C5A059] border-2 border-white" />
              <span className="font-bold text-[#2F5A84] font-serif-roman tracking-wider">
                05:30 PM
              </span>
              <p className="text-slate-600 mt-0.5 font-medium">Ceremonia de Acción de Gracias ⛪</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#C5A059] border-2 border-white" />
              <span className="font-bold text-[#2F5A84] font-serif-roman tracking-wider">
                07:00 PM
              </span>
              <p className="text-slate-600 mt-0.5 font-medium">Brindis & Cena de Gala 🥂</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#2F5A84] border-2 border-white" />
              <span className="font-bold text-[#2F5A84] font-serif-roman tracking-wider">
                08:30 PM
              </span>
              <p className="text-slate-600 mt-0.5 font-medium">Vals de Quinceañera y Fiesta 👑</p>
            </div>
          </div>
        </section>

        {/* Sección 7: Código de Vestimenta (Dress Code) */}
        <section className="px-6 py-6 text-center z-20">
          <div className="bg-white/90 border border-blue-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-serif-roman text-xs tracking-[0.2em] text-[#2F5A84] uppercase mb-2">
              Código de Vestimenta
            </h3>
            <p className="font-medium text-slate-800 text-sm">
              {data.dressCodeTitulo || "Formal & Rigurosa Etiqueta"}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              {data.dressCodeNota || (
                <>
                  Agradecemos reservar los tonos{" "}
                  <span className="font-semibold text-[#2F5A84]">azul celeste y blanco</span>{" "}
                  exclusivamente para la quinceañera.
                </>
              )}
            </p>
          </div>
        </section>

        {/* Sección 8: Ubicación (The Location) */}
        <section className="px-6 py-6 text-center z-20">
          <h3 className="font-serif-roman text-xs tracking-[0.25em] text-[#2F5A84] uppercase mb-2">
            Ubicación
          </h3>
          <p className="text-sm font-semibold text-slate-800">{data.recepcionNombre}</p>
          <p className="text-xs text-slate-500 mb-4">{data.recepcionDireccion}</p>
          <a
            href={data.recepcionMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-[#2F5A84] text-white py-3.5 rounded-xl font-serif-roman text-xs uppercase tracking-widest hover:bg-[#203e5c] transition shadow-md"
          >
            Ver en Google Maps
          </a>
        </section>

        {/* Sección 9: Formulario RSVP Conectado a WhatsApp */}
        <section id="rsvp" className="px-6 py-6 z-20">
          <div className="bg-white p-6 rounded-3xl border border-[#D8B772]/60 shadow-md text-center">
            <h3 className="font-script text-4xl text-[#2F5A84] my-1">Confirmar Asistencia</h3>
            <p className="text-[11px] text-slate-400 mb-5 uppercase tracking-wider">
              Favor de confirmar antes del {data.fechaLimiteRsvp || "20 de Octubre"}
            </p>

            <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
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
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
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

        {/* Footer de Agradecimiento */}
        <footer className="px-6 pt-6 pb-6 text-center z-20">
          <p className="font-cormorant italic text-base text-slate-600">
            Esperamos contar con tu valiosa presencia.
          </p>
          <h3 className="font-script text-5xl text-[#2F5A84] mt-2">{data.titulo}</h3>
        </footer>
      </main>
    </div>
  );
}
