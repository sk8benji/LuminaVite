"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Gift,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  Send,
  Check,
} from "lucide-react";
import { getTemplate } from "@/lib/templates";
import { getMapDirectionsUrl } from "@/lib/maps";
import { ELEGANT_ROSE_ASSETS } from "@/lib/templates/elegantRoseAssets";
import AudioPlayer from "../invitation/AudioPlayer";
import EnvelopeIntro from "../invitation/EnvelopeIntro";
import { InvitationData } from "../invitation/InvitationMobileView";

export default function ElegantRoseTemplate({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const [lang, setLang] = useState<"en" | "es">(data.idiomaDefault === "en" ? "en" : "es");
  const template = getTemplate("ELEGANT_ROSE");
  const isEn = lang === "en";

  useEffect(() => {
    if (data.idiomaDefault === "en") setLang("en");
    else if (data.idiomaDefault === "es") setLang("es");
  }, [data.idiomaDefault]);

  const handleEnvelopeOpen = (selectedLang?: "es" | "en") => {
    if (selectedLang) {
      setLang(selectedLang);
    }
  };

  // Contador regresivo en tiempo real con Bodoni Moda
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = data.fechaEvento
        ? new Date(data.fechaEvento).getTime()
        : new Date("2026-07-18T16:00:00").getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [data.fechaEvento]);

  // Formulario RSVP interactivo con WhatsApp
  const [rsvpNombre, setRsvpNombre] = useState("");
  const [rsvpTelefono, setRsvpTelefono] = useState("");
  const [rsvpPases, setRsvpPases] = useState("2");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpNombre.trim()) return;

    const phone = (data.telefonoWhatsappRsvp || "").replace(/[^0-9]/g, "");
    let text = `${isEn ? "Hello! RSVP Confirmation for" : "¡Hola! Confirmación de asistencia para"} ${data.titulo}:\n\n`;
    text += `👤 ${isEn ? "Name" : "Nombre"}: ${rsvpNombre.trim()}\n`;
    if (rsvpTelefono.trim()) {
      text += `📱 ${isEn ? "Phone" : "Teléfono"}: ${rsvpTelefono.trim()}\n`;
    }
    text += `🎟️ ${isEn ? "Confirmed Passes" : "Pases Confirmados"}: ${rsvpPases}\n`;

    setRsvpSubmitted(true);

    if (phone) {
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank");
    }
  };

  const heroPhotoUrl = data.fotoPortadaUrl || ELEGANT_ROSE_ASSETS.heroPhoto;
  const fotoInfancia = data.fotoInfanciaUrl || ELEGANT_ROSE_ASSETS.growingBaby;
  const fotoNinez = data.fotoActualUrl || ELEGANT_ROSE_ASSETS.growingChild;
  const fotoActual = data.fotoCierreUrl || ELEGANT_ROSE_ASSETS.castlePhoto;

  const itinerarioList =
    Array.isArray(data.itinerarioJson) && data.itinerarioJson.length > 0
      ? data.itinerarioJson
      : [
          { hora: "4:00 PM", titulo: isEn ? "Mass Ceremony" : "Misa de Acción de Gracias" },
          { hora: "5:00 PM", titulo: isEn ? "Grand Entrance" : "Entrada al Salón" },
          { hora: "6:00 PM", titulo: isEn ? "The Waltz" : "Vals de Honor" },
          { hora: "7:00 PM", titulo: isEn ? "Dinner" : "Cena de Gala" },
          { hora: "9:00 PM", titulo: isEn ? "Party & Dance" : "Fiesta y Baile" },
        ];

  const locationUrl = getMapDirectionsUrl(
    data.ceremoniaMapUrl || data.recepcionMapUrl,
    `${data.recepcionNombre || data.ceremoniaNombre || ""} ${data.recepcionDireccion || data.ceremoniaDireccion || ""}`.trim()
  );

  return (
    <div className="min-h-screen flex justify-center bg-[#FAF5F3] selection:bg-[#C2847A]/30 antialiased font-['Montserrat',sans-serif]">
      {/* Intro del Sobre */}
      {!skipIntro && (
        <EnvelopeIntro
          titulo={data.titulo}
          tipoEvento={data.tipoEvento}
          fechaTexto={data.fechaTextoPersonalizada || (isEn ? "SUNDAY, JULY 18 • 4:00 PM" : "DOMINGO 18 DE JULIO • 4:00 PM")}
          template={template}
          coverPhotoUrl={heroPhotoUrl}
          idiomaDefault={data.idiomaDefault || "bilingual"}
          onOpen={handleEnvelopeOpen}
        />
      )}

      {/* Contenedor Principal (430px) */}
      <main className="w-full max-w-[430px] mx-auto bg-[#FAF5F3] text-[#4A3E3D] shadow-2xl min-h-screen relative overflow-hidden flex flex-col pb-12">
        {/* Audio flotante */}
        <AudioPlayer audioUrl={data.musicaUrl} template={template} />

        {/* Switch de Idioma Superior Discreto */}
        <header className="sticky top-0 z-40 bg-[#FAF5F3]/90 backdrop-blur-md px-5 py-2 flex justify-between items-center border-b border-rose-100">
          <span className="font-['Cinzel'] text-[10px] tracking-widest text-[#C2847A] font-semibold">
            {data.titulo.toUpperCase()} • XV
          </span>

          <div className="flex items-center gap-1 bg-white border border-[#C2847A]/30 rounded-full p-0.5 text-[9px] font-bold">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                isEn ? "bg-[#C2847A] text-white shadow-xs" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                !isEn ? "bg-[#C2847A] text-white shadow-xs" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              ES
            </button>
          </div>
        </header>

        {/* ========================================== */}
        {/* 1. PORTADA: ARCO ROMANO Y NOMBRE           */}
        {/* ========================================== */}
        <section className="pt-10 pb-8 px-6 text-center">
          <p className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#C2847A] font-semibold mb-1">
            {isEn ? "You are invited to" : "Le invitamos cordialmente a"}
          </p>
          <h1 className="font-['Alex_Brush'] text-5xl sm:text-6xl text-[#C2847A] mb-6 select-none">
            {isEn ? "celebrate!" : "¡celebrar!"}
          </h1>

          {/* Foto con Marco de Arco Romano Exacto */}
          <div className="w-[240px] h-[340px] mx-auto rounded-t-[120px] rounded-b-none overflow-hidden border-4 border-white shadow-[0_15px_30px_rgba(194,132,122,0.25)] relative mb-6 bg-rose-50 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroPhotoUrl}
              alt="Quinceañera"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <p className="font-['Cormorant_Garamond'] italic text-sm text-[#7D6E6D] mb-1">
            {isEn ? "the 15th birthday of" : "los quince años de"}
          </p>
          <h2 className="font-['Alex_Brush'] text-4xl sm:text-5xl text-[#3D2329] mb-1 select-none">
            {data.titulo}
          </h2>

          <div className="flex items-center justify-center gap-2 my-4">
            <span className="h-[1px] w-12 bg-[#C2847A]/40" />
            <span className="text-[#C2847A] text-xs">❦</span>
            <span className="h-[1px] w-12 bg-[#C2847A]/40" />
          </div>

          {/* Fecha y Botones de Acción Rápida */}
          <p className="font-['Cinzel'] text-xs tracking-[0.2em] text-[#3D2329] font-semibold mb-6">
            {data.fechaTextoPersonalizada || (isEn ? "SUNDAY, JULY 18, 2026 • 4:00 PM" : "DOMINGO 18 DE JULIO, 2026 • 4:00 PM")}
          </p>

          <div className="flex justify-center gap-3">
            <a
              href="#rsvp"
              className="bg-[#C2847A] text-white text-[10px] font-['Cinzel'] tracking-widest py-2.5 px-6 rounded-md shadow-sm uppercase font-semibold hover:bg-[#a86f66] transition-colors"
            >
              RSVP
            </a>
            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="location"
              className="bg-white border border-[#C2847A] text-[#C2847A] text-[10px] font-['Cinzel'] tracking-widest py-2.5 px-6 rounded-md shadow-sm uppercase font-semibold hover:bg-[#FAF5F3] transition-colors inline-flex items-center gap-1.5"
            >
              <MapPin className="w-3 h-3" />
              <span>{isEn ? "Location" : "Ubicación"}</span>
            </a>
          </div>
        </section>

        {/* ========================================== */}
        {/* 2. FRANJA VINO DE PADRES                   */}
        {/* ========================================== */}
        <section className="bg-[#3D2329] text-white py-8 px-6 text-center">
          <span className="text-xs text-[#C5A059] block mb-2">❦</span>
          <p className="font-['Cormorant_Garamond'] italic text-sm text-rose-100/90 leading-relaxed max-w-[320px] mx-auto">
            &ldquo;{data.frasePersonalizada || (isEn ? "With God's blessing and the love of my family, I celebrate this unforgettable day." : "Con la bendición de Dios y el amor de mis padres, celebro este día inolvidable.")}&rdquo;
          </p>
          <p className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-[#C5A059] mt-3 font-semibold">
            {isEn ? "My Parents & Family" : "Mis Padres"}
          </p>
        </section>

        {/* ========================================== */}
        {/* 3. LÍNEA DE TIEMPO (GROWING UP)            */}
        {/* ========================================== */}
        <section className="py-12 px-6">
          <div className="text-center mb-8">
            <h3 className="font-['Alex_Brush'] text-4xl sm:text-5xl text-[#C2847A]">Growing Up</h3>
            <p className="font-['Cinzel'] text-[9px] tracking-[0.25em] uppercase text-[#7D6E6D] mt-1 font-semibold">
              {isEn ? "Treasured Moments" : "Momentos Inolvidables"}
            </p>
          </div>

          {/* Tarjetas de Fotos Polaroids/Verticales */}
          <div className="space-y-6">
            {/* Hito Infancia */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100 text-center">
              <div className="w-full h-48 rounded-lg overflow-hidden mb-3 bg-rose-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoInfancia}
                  className="w-full h-full object-cover"
                  alt="Baby"
                />
              </div>
              <p className="font-['Cinzel'] text-[10px] tracking-widest text-[#C2847A] font-semibold uppercase">
                2011
              </p>
              <p className="font-['Cormorant_Garamond'] italic text-sm text-[#4A3E3D] mt-0.5">
                {isEn ? "Every story has a beginning" : "El comienzo de mi historia"}
              </p>
            </div>

            {/* Hito Niñez */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100 text-center">
              <div className="w-full h-48 rounded-lg overflow-hidden mb-3 bg-rose-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoNinez}
                  className="w-full h-full object-cover"
                  alt="Niñez"
                />
              </div>
              <p className="font-['Cinzel'] text-[10px] tracking-widest text-[#C2847A] font-semibold uppercase">
                2018
              </p>
              <p className="font-['Cormorant_Garamond'] italic text-sm text-[#4A3E3D] mt-0.5">
                {isEn ? "Years of laughter and learning" : "Años de risas y aprendizaje"}
              </p>
            </div>

            {/* Hito Actual */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100 text-center">
              <div className="w-full h-48 rounded-lg overflow-hidden mb-3 bg-rose-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoActual}
                  className="w-full h-full object-cover"
                  alt="Quinceañera"
                />
              </div>
              <p className="font-['Cinzel'] text-[10px] tracking-widest text-[#C2847A] font-semibold uppercase">
                2026
              </p>
              <p className="font-['Cormorant_Garamond'] italic text-sm text-[#4A3E3D] mt-0.5">
                {isEn ? "Today, ready for my sweet 15" : "Hoy, lista para mis XV"}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 4. CONTADOR REGRESIVO (FRANJA VINO)        */}
        {/* ========================================== */}
        <section className="bg-[#3D2329] text-white py-10 px-6 text-center">
          <h3 className="font-['Alex_Brush'] text-3xl sm:text-4xl text-rose-200 mb-2 select-none">
            The Countdown
          </h3>
          <div className="grid grid-cols-4 gap-2 max-w-[280px] mx-auto mt-4">
            <div className="bg-white/10 rounded-lg py-2">
              <span className="block font-['Bodoni_Moda'] text-2xl font-bold">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-rose-200 font-semibold font-['Cinzel']">
                {isEn ? "Days" : "Días"}
              </span>
            </div>
            <div className="bg-white/10 rounded-lg py-2">
              <span className="block font-['Bodoni_Moda'] text-2xl font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-rose-200 font-semibold font-['Cinzel']">
                {isEn ? "Hours" : "Horas"}
              </span>
            </div>
            <div className="bg-white/10 rounded-lg py-2">
              <span className="block font-['Bodoni_Moda'] text-2xl font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-rose-200 font-semibold font-['Cinzel']">
                {isEn ? "Min" : "Min"}
              </span>
            </div>
            <div className="bg-white/10 rounded-lg py-2">
              <span className="block font-['Bodoni_Moda'] text-2xl font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-rose-200 font-semibold font-['Cinzel']">
                {isEn ? "Sec" : "Seg"}
              </span>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 5. ITINERARIO VERTICAL ELEGANTE            */}
        {/* ========================================== */}
        <section className="py-12 px-6">
          <div className="text-center mb-8">
            <h3 className="font-['Alex_Brush'] text-4xl sm:text-5xl text-[#C2847A]">Itinerary</h3>
            <p className="font-['Cinzel'] text-[9px] tracking-[0.25em] uppercase text-[#7D6E6D] mt-1 font-semibold">
              {isEn ? "Event Schedule" : "Programa del Evento"}
            </p>
          </div>

          <div className="space-y-3">
            {itinerarioList.map((item: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-3.5 border border-rose-100 flex items-center justify-between shadow-xs hover:shadow-sm transition"
              >
                <span className="font-['Cinzel'] text-xs font-semibold text-[#C2847A] tracking-wider">
                  {item.hora}
                </span>
                <span className="font-['Cormorant_Garamond'] text-sm text-[#4A3E3D] font-medium">
                  {item.titulo}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* 6. DRESS CODE & REGALOS                    */}
        {/* ========================================== */}
        <section className="py-8 px-6 text-center bg-white border-y border-rose-100">
          <h3 className="font-['Alex_Brush'] text-3xl text-[#C2847A] mb-1">Dress Code</h3>
          <p className="font-['Cinzel'] text-[10px] tracking-widest uppercase text-[#3D2329] font-semibold mb-2">
            {data.dressCodeTitulo || data.dressCodeEtiqueta || (isEn ? "Formal Attire" : "Vestimenta Formal")}
          </p>
          <p className="font-['Cormorant_Garamond'] italic text-xs text-[#7D6E6D] max-w-[280px] mx-auto leading-relaxed">
            {data.dressCodeNota || data.dressCodeColoresReservados || (isEn ? "We kindly ask to reserve white and blush pink exclusively for the Quinceañera." : "Agradecemos reservar los tonos blanco y palo de rosa exclusivamente para la festejada.")}
          </p>

          <div className="my-6 border-t border-rose-100 w-32 mx-auto" />

          <h3 className="font-['Alex_Brush'] text-3xl text-[#C2847A] mb-1">
            {isEn ? "Gift Registry" : "Lluvia de Sobres"}
          </h3>
          <p className="font-['Cormorant_Garamond'] italic text-xs text-[#7D6E6D] max-w-[280px] mx-auto leading-relaxed">
            {data.regalosMensaje || (isEn ? "Your presence is our greatest gift. A card box will be available at the reception." : "Tu presencia es nuestro mayor regalo. Dispondremos de un cofre en la recepción.")}
          </p>
        </section>

        {/* ========================================== */}
        {/* 7. FORMULARIO RSVP INTEGRADO               */}
        {/* ========================================== */}
        <section id="rsvp" className="py-12 px-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-rose-100 text-center">
            <h3 className="font-['Alex_Brush'] text-4xl text-[#C2847A] mb-1">
              {isEn ? "RSVP" : "Confirmación"}
            </h3>
            <p className="font-['Cinzel'] text-[9px] tracking-widest uppercase text-[#7D6E6D] mb-6 font-semibold">
              {data.rsvpFechaLimite || data.fechaLimiteRsvp || (isEn ? "Please confirm by June 20th" : "Favor de confirmar asistencia")}
            </p>

            {rsvpSubmitted ? (
              <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 animate-fade-in text-center">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-['Cinzel'] text-xs font-bold text-[#3D2329] tracking-wider uppercase">
                  {isEn ? "Thank you for confirming!" : "¡Gracias por confirmar!"}
                </h4>
                <p className="font-['Cormorant_Garamond'] italic text-xs text-[#7D6E6D] mt-1">
                  {isEn ? "Your response was sent via WhatsApp." : "Tu respuesta ha sido enviada por WhatsApp."}
                </p>
                <button
                  type="button"
                  onClick={() => setRsvpSubmitted(false)}
                  className="mt-3 text-[10px] uppercase font-['Cinzel'] tracking-wider text-[#C2847A] underline font-semibold cursor-pointer"
                >
                  {isEn ? "Modify confirmation" : "Modificar respuesta"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block font-['Cinzel'] text-[9px] tracking-wider text-[#7D6E6D] uppercase mb-1 font-semibold">
                    {isEn ? "Full Name *" : "Nombre Completo *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpNombre}
                    onChange={(e) => setRsvpNombre(e.target.value)}
                    placeholder={isEn ? "e.g. Maria Perez" : "Ej. María Pérez"}
                    className="w-full bg-[#FAF5F3] border border-rose-200 rounded-md px-3 py-2 text-sm text-[#4A3E3D] focus:outline-none focus:border-[#C2847A]"
                  />
                </div>

                <div>
                  <label className="block font-['Cinzel'] text-[9px] tracking-wider text-[#7D6E6D] uppercase mb-1 font-semibold">
                    {isEn ? "Mobile Phone *" : "Teléfono Móvil *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={rsvpTelefono}
                    onChange={(e) => setRsvpTelefono(e.target.value)}
                    placeholder={isEn ? "e.g. +1 818 123 4567" : "Ej. 818 123 4567"}
                    className="w-full bg-[#FAF5F3] border border-rose-200 rounded-md px-3 py-2 text-sm text-[#4A3E3D] focus:outline-none focus:border-[#C2847A]"
                  />
                </div>

                <div>
                  <label className="block font-['Cinzel'] text-[9px] tracking-wider text-[#7D6E6D] uppercase mb-1 font-semibold">
                    {isEn ? "Confirmed Passes" : "Pases Confirmados"}
                  </label>
                  <select
                    value={rsvpPases}
                    onChange={(e) => setRsvpPases(e.target.value)}
                    className="w-full bg-[#FAF5F3] border border-rose-200 rounded-md px-3 py-2 text-sm text-[#4A3E3D] focus:outline-none focus:border-[#C2847A]"
                  >
                    <option value="1">1 {isEn ? "Pass" : "Pase"}</option>
                    <option value="2">2 {isEn ? "Passes" : "Pases"}</option>
                    <option value="3">3 {isEn ? "Passes" : "Pases"}</option>
                    <option value="4">4 {isEn ? "Passes" : "Pases"}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C2847A] text-white font-['Cinzel'] text-xs tracking-widest uppercase py-3 rounded-md font-semibold shadow-md hover:bg-[#a86f66] transition-colors mt-2 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEn ? "Confirm Attendance" : "Confirmar Asistencia"}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Pie y Agradecimiento */}
        <footer className="text-center pt-2 pb-6 px-6">
          <span className="text-xs text-[#C2847A] block mb-1">❦</span>
          <h4 className="font-['Alex_Brush'] text-3xl text-[#3D2329]">Thank you!</h4>
          <p className="font-['Cormorant_Garamond'] italic text-xs text-[#7D6E6D] mt-1">
            {isEn ? "We can't wait to celebrate with you!" : "¡Esperamos contar con tu presencia!"}
          </p>
        </footer>
      </main>
    </div>
  );
}
