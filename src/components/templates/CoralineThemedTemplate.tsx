"use client";

import React, { useState } from "react";
import {
  MapPin,
  Gift,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  Key,
  ShieldAlert,
} from "lucide-react";
import { getTemplate } from "@/lib/templates";
import AudioPlayer from "../invitation/AudioPlayer";
import CountdownTimer from "../invitation/CountdownTimer";
import RsvpSection from "../invitation/RsvpSection";
import TimelineSection from "../invitation/TimelineSection";
import AddToCalendarButton from "../invitation/AddToCalendarButton";
import EnvelopeIntro from "../invitation/EnvelopeIntro";
import { InvitationData } from "../invitation/InvitationMobileView";

export default function CoralineThemedTemplate({ data }: { data: InvitationData }) {
  const template = getTemplate("CORALINE_MYSTICAL");
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-screen flex justify-center bg-[#070E2C] selection:bg-yellow-400 selection:text-black antialiased relative overflow-hidden">
      {/* Intro del Sobre 3D Místico */}
      <EnvelopeIntro
        titulo={data.titulo}
        tipoEvento="CUMPLEANOS"
        fechaTexto={data.fechaTextoPersonalizada || "OCTOBER 31 • 6:00 PM"}
        template={template}
      />

      <main className="w-full max-w-[440px] min-h-screen shadow-2xl relative overflow-hidden flex flex-col pb-16 bg-[#0A1956] text-[#F5F2EB]">
        {/* Estrellas místicas de fondo */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Audio flotante */}
        <AudioPlayer audioUrl={data.musicaUrl} template={template} />

        {/* 1. Portada del Mundo Secreto de Coraline */}
        <section className="px-6 pt-12 pb-8 text-center flex flex-col items-center relative z-20">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-yellow-400/40 text-[10px] uppercase tracking-widest text-[#FFD700] mb-3">
            <Key className="w-3.5 h-3.5" />
            <span>YOU HAVE FOUND THE SECRET DOOR</span>
          </div>

          <h1 className="text-4xl font-serif text-[#FFD700] my-2 tracking-wide">
            {data.titulo || "Coraline's Birthday"}
          </h1>

          <p className="text-xs text-stone-300 italic max-w-xs mb-6">
            Be careful what you wish for... An unforgettable adventure in the Other World awaits you!
          </p>

          {/* Gráfico temático: Puerta Secreta Arqueada */}
          <div className="relative w-72 h-96 rounded-t-full border-4 border-yellow-400/80 shadow-[0_0_30px_rgba(255,215,0,0.2)] overflow-hidden bg-[#121A42] flex flex-col items-center justify-center p-3">
            {/* Foto de la cumpleañera enmarcada */}
            <div className="w-full h-full rounded-t-full overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.fotoPortadaUrl}
                alt={data.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1956] via-transparent to-transparent opacity-80" />
            </div>

            {/* Iconos temáticos flotantes */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xl">
              <span title="Gato Negro">🐈‍⬛</span>
              <span className="text-sm bg-black/70 px-2 py-1 rounded-full text-yellow-300 border border-yellow-400/30">
                🗝️ 15th Mystery
              </span>
              <span title="Botón Negro">🔘</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="h-[1px] w-12 bg-yellow-400/60" />
            <p className="text-xs tracking-widest font-bold text-[#FFD700] font-serif uppercase">
              {data.fechaTextoPersonalizada || "OCTOBER 31, 2026 • 6:00 PM"}
            </p>
            <span className="h-[1px] w-12 bg-yellow-400/60" />
          </div>
        </section>

        {/* 2. Cuenta Regresiva Mística */}
        <CountdownTimer
          targetDate={data.fechaEvento}
          template={template}
          titulo="THE CLOCK IS TICKING DOWN..."
        />

        {/* 3. El Secreto / Dinámica del Libro de Dedicatorias (Canva T4 feature) */}
        <section className="px-6 py-6 text-center z-20">
          <div className="bg-[#121A42] p-6 rounded-3xl border border-yellow-400/30 shadow-lg">
            <BookOpen className="w-8 h-8 mx-auto text-[#FFD700] mb-2" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#FFD700] font-serif">
              BRING A BOOK FOR HER LIBRARY
            </h3>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed font-light">
              In place of a traditional card, we kindly ask you to bring a favorite book with a personal message written inside for the birthday girl to cherish forever!
            </p>
          </div>
        </section>

        {/* 4. Ubicación de la Puerta Secreta */}
        <section className="px-6 py-6 space-y-4 z-20">
          <div className="text-center mb-2">
            <span className="text-2xl">🚪</span>
            <h3 className="text-sm uppercase tracking-widest font-bold text-[#FFD700] font-serif">
              THE PORTAL LOCATION
            </h3>
          </div>

          <div className="bg-[#121A42] p-6 rounded-3xl border border-yellow-400/30 shadow-sm text-center">
            <h4 className="text-sm font-bold text-white font-serif">
              {data.recepcionNombre || "The Pink Palace Apartments"}
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              {data.recepcionDireccion || "123 Oregon Fall Way, Ashland, OR"}
            </p>

            <a
              href={data.recepcionMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-bold bg-[#FFD700] text-[#0A1956] hover:bg-yellow-300 transition shadow-lg font-serif"
            >
              <MapPin className="w-3.5 h-3.5" />
              Unlock Map Route
            </a>
          </div>
        </section>

        {/* 5. Itinerario Místico */}
        <TimelineSection items={data.itinerarioJson} template={template} />

        {/* 6. Dress Code Temático (Amarillo & Azul) */}
        <section className="px-6 py-4 z-20">
          <div className="bg-[#121A42] p-6 rounded-3xl border border-yellow-400/30 shadow-sm text-center">
            <span className="text-2xl">🧥</span>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#FFD700] font-serif mt-1">
              DRESS CODE
            </h3>
            <p className="text-xs text-stone-200 mt-1 leading-relaxed">
              Guests are encouraged to wear their best shades of yellow, deep blue, or whimsical vintage attire!
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <span className="w-6 h-6 rounded-full bg-[#FFD700] border border-white" title="Coraline Yellow" />
              <span className="w-6 h-6 rounded-full bg-[#0A1956] border border-white" title="Deep Blue" />
              <span className="w-6 h-6 rounded-full bg-[#3A0443] border border-white" title="Other World Plum" />
              <span className="w-6 h-6 rounded-full bg-[#000000] border border-white" title="Button Black" />
            </div>
          </div>
        </section>

        {/* 7. Formulario RSVP con WhatsApp */}
        <RsvpSection
          eventoId={data.id}
          eventoTitulo={data.titulo}
          telefonoWhatsapp={data.telefonoWhatsappRsvp}
          maxPases={data.maxPasesPorInvitado || 2}
          fechaLimite={data.fechaLimiteRsvp}
          template={template}
        />

        {/* 8. Despedida y Agendar */}
        <footer className="px-6 pt-6 pb-12 text-center z-20">
          <Heart className="w-6 h-6 mx-auto mb-2 text-[#FFD700] animate-pulse" />
          <h3 className="text-3xl font-serif text-[#FFD700]">See You in the Other World!</h3>
          <p className="text-xs tracking-widest uppercase text-stone-400 mt-1 mb-6 font-serif">
            WITH MYSTERY & LOVE, {data.titulo}
          </p>

          <AddToCalendarButton
            titulo={`Birthday Adventure: ${data.titulo}`}
            descripcion={`Coraline themed birthday celebration of ${data.titulo}.`}
            ubicacion={`${data.recepcionNombre}, ${data.recepcionDireccion}`}
            fechaEvento={data.fechaEvento}
            template={template}
          />
        </footer>
      </main>
    </div>
  );
}
