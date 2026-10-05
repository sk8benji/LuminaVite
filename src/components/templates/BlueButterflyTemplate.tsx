"use client";

import React from "react";
import {
  MapPin,
  Gift,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  Music,
  Share2,
} from "lucide-react";
import { getTemplate } from "@/lib/templates";
import AudioPlayer from "../invitation/AudioPlayer";
import CountdownTimer from "../invitation/CountdownTimer";
import RsvpSection from "../invitation/RsvpSection";
import TimelineSection from "../invitation/TimelineSection";
import AddToCalendarButton from "../invitation/AddToCalendarButton";
import EnvelopeIntro from "../invitation/EnvelopeIntro";
import { InvitationData } from "../invitation/InvitationMobileView";

export default function BlueButterflyTemplate({ data }: { data: InvitationData }) {
  const template = getTemplate("BLUE_BUTTERFLY");

  return (
    <div className="min-h-screen flex justify-center bg-[#F4F7FB] selection:bg-sky-200 antialiased relative overflow-hidden">
      {/* Intro del Sobre 3D */}
      <EnvelopeIntro
        titulo={data.titulo}
        tipoEvento="QUINCEANERA"
        fechaTexto={data.fechaTextoPersonalizada || "OCTOBER 15 • 5:00 PM"}
        template={template}
      />

      <main className="w-full max-w-[440px] min-h-screen shadow-2xl relative overflow-hidden flex flex-col pb-16 bg-[#F4F7FB] text-[#1E3A5F]">
        {/* Mariposas flotantes animadas en CSS de fondo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-70">
          <span className="absolute top-24 left-6 text-2xl animate-float">🦋</span>
          <span className="absolute top-72 right-8 text-xl animate-float" style={{ animationDelay: "1.5s" }}>🦋</span>
          <span className="absolute top-[600px] left-10 text-lg animate-float" style={{ animationDelay: "2.5s" }}>🦋</span>
          <span className="absolute top-[1100px] right-6 text-2xl animate-float" style={{ animationDelay: "0.8s" }}>🦋</span>
          <span className="absolute top-[1700px] left-8 text-xl animate-float" style={{ animationDelay: "3s" }}>🦋</span>
        </div>

        {/* Audio flotante */}
        <AudioPlayer audioUrl={data.musicaUrl} template={template} />

        {/* 1. Portada Jardín de Mariposas con Arco Celestial */}
        <section className="px-6 pt-12 pb-6 text-center flex flex-col items-center relative z-20">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7FA2C6] font-semibold mb-2 font-serif">
            <Sparkles className="w-4 h-4 text-[#7FA2C6]" />
            <span>THIS ENCHANTED EVENING</span>
            <Sparkles className="w-4 h-4 text-[#7FA2C6]" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif text-[#1E3A5F] font-normal my-2 leading-tight">
            Blue Butterfly Garden
          </h1>

          <p className="text-xs text-[#4E6688] italic font-serif max-w-xs mb-6">
            With grateful hearts, we request the honor of your presence to celebrate this magical milestone.
          </p>

          {/* Marco Celestial con Foto de Quinceañera */}
          <div className="w-72 h-96 rounded-t-full rounded-b-3xl overflow-hidden border-4 border-white shadow-2xl relative bg-sky-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoPortadaUrl}
              alt={data.titulo}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <p className="text-xs tracking-widest uppercase text-stone-400 mt-6 font-serif">
            CELEBRATE THE QUINCEAÑERA OF
          </p>

          <h2 className="text-6xl font-script text-[#2B4C7E] -mt-1">{data.titulo}</h2>

          {/* Fecha estilizada en arco */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-[1px] w-12 bg-[#7FA2C6]" />
            <p className="text-xs tracking-widest font-bold text-[#1E3A5F] font-serif">
              {data.fechaTextoPersonalizada || "OCTOBER 15, 2026 AT 5:00 PM"}
            </p>
            <span className="h-[1px] w-12 bg-[#7FA2C6]" />
          </div>
        </section>

        {/* 2. Cuenta Regresiva */}
        <CountdownTimer
          targetDate={data.fechaEvento}
          template={template}
          titulo="COUNTDOWN TO THE ENCHANTED NIGHT"
        />

        {/* 3. Carta Emotiva de los Padres (Canva Template 3 feature) */}
        <section className="px-6 py-6 text-center z-20">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#BD9FC5]/40 shadow-sm">
            <span className="text-3xl mb-1 block">✨</span>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#2B4C7E] font-serif">
              A Special Message
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed font-light">
              &ldquo;As she spreads her wings like a butterfly and begins this beautiful new chapter, we thank you for being a part of her life and sharing this unforgettable evening with our family.&rdquo;
            </p>
            <p className="text-[11px] font-bold text-[#7FA2C6] mt-3 uppercase tracking-wider font-serif">
              With Love, Her Family
            </p>
          </div>
        </section>

        {/* 4. Ubicación con Mapa */}
        <section className="px-6 py-6 space-y-4 z-20">
          <div className="text-center mb-2">
            <span className="text-2xl">📍</span>
            <h3 className="text-sm uppercase tracking-widest font-bold text-[#1E3A5F] font-serif">
              THE LOCATION
            </h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm text-center">
            <h4 className="text-sm font-bold text-[#1E3A5F] font-serif">
              {data.recepcionNombre}
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              {data.recepcionDireccion}
            </p>

            <a
              href={data.recepcionMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-semibold bg-[#2B4C7E] text-white hover:bg-[#1f375c] transition shadow-md font-serif"
            >
              <MapPin className="w-3.5 h-3.5" />
              View on Google Maps
            </a>
          </div>
        </section>

        {/* 5. Itinerario Encantado */}
        <TimelineSection items={data.itinerarioJson} template={template} />

        {/* 6. Dress Code */}
        <section className="px-6 py-4 z-20">
          <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm text-center">
            <span className="text-2xl">👗</span>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#2B4C7E] font-serif mt-1">
              DRESS CODE
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed font-light">
              Guests are invited to wear their finest formal attire to celebrate this enchanting evening.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <span className="w-5 h-5 rounded-full bg-[#7FA2C6] border border-stone-300" title="Sky Blue" />
              <span className="w-5 h-5 rounded-full bg-[#2B4C7E] border border-stone-300" title="Royal Blue" />
              <span className="w-5 h-5 rounded-full bg-[#BD9FC5] border border-stone-300" title="Lavender" />
              <span className="w-5 h-5 rounded-full bg-[#FFFFFF] border border-stone-300" title="White" />
            </div>
          </div>
        </section>

        {/* 7. Gift Card & Registry */}
        <section className="px-6 py-4 z-20">
          <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm text-center">
            <Gift className="w-6 h-6 mx-auto text-[#7FA2C6]" />
            <h3 className="text-xs uppercase tracking-widest font-bold mt-2 text-[#2B4C7E] font-serif">
              GIFTS & WISHES
            </h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed font-light">
              Celebrating this special moment is the greatest gift we could ask for. Should you wish to honor the quinceañera, a monetary contribution or gift card would be warmly appreciated.
            </p>
          </div>
        </section>

        {/* 8. Formulario RSVP con WhatsApp */}
        <RsvpSection
          eventoId={data.id}
          eventoTitulo={data.titulo}
          telefonoWhatsapp={data.telefonoWhatsappRsvp}
          maxPases={data.maxPasesPorInvitado || 4}
          fechaLimite={data.fechaLimiteRsvp}
          template={template}
        />

        {/* 9. Despedida y Agendar */}
        <footer className="px-6 pt-6 pb-12 text-center z-20">
          <Heart className="w-6 h-6 mx-auto mb-2 text-[#7FA2C6] animate-pulse" />
          <h3 className="text-3xl font-serif text-[#1E3A5F]">Thank You!</h3>
          <p className="text-xs tracking-widest uppercase text-stone-500 mt-1 mb-6 font-serif">
            WITH GRATITUDE, {data.titulo}
          </p>

          <AddToCalendarButton
            titulo={`Quinceañera: ${data.titulo}`}
            descripcion={`Blue Butterfly Garden celebration of ${data.titulo}.`}
            ubicacion={`${data.recepcionNombre}, ${data.recepcionDireccion}`}
            fechaEvento={data.fechaEvento}
            template={template}
          />
        </footer>
      </main>
    </div>
  );
}
