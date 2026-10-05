"use client";

import React from "react";
import {
  MapPin,
  Gift,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  Hotel,
  Bus,
  Wine,
  Camera,
  Music,
  PartyPopper,
  Check,
} from "lucide-react";
import { getTemplate } from "@/lib/templates";
import AudioPlayer from "../invitation/AudioPlayer";
import CountdownTimer from "../invitation/CountdownTimer";
import RsvpSection from "../invitation/RsvpSection";
import AddToCalendarButton from "../invitation/AddToCalendarButton";
import EnvelopeIntro from "../invitation/EnvelopeIntro";
import { InvitationData } from "../invitation/InvitationMobileView";

export default function FairytaleWeddingTemplate({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const template = getTemplate("FAIRYTALE_CHATEAU");

  const weddingItinerary = [
    { time: "3:30 PM", title: "Wedding Ceremony", icon: "church" },
    { time: "4:30 PM", title: "Cocktail Hour", icon: "wine" },
    { time: "5:00 PM", title: "Photo Session", icon: "camera" },
    { time: "6:30 PM", title: "Dinner Reception", icon: "dinner" },
    { time: "8:00 PM", title: "Dance Party", icon: "party" },
  ];

  return (
    <div className="min-h-screen flex justify-center bg-[#FBF5EB] selection:bg-amber-200 antialiased">
      {/* Intro del Sobre 3D */}
      {!skipIntro && (
        <EnvelopeIntro
          titulo={data.titulo}
          tipoEvento="BODA"
          fechaTexto={data.fechaTextoPersonalizada || "SATURDAY, JULY 22 • 3:30 PM"}
          template={template}
        />
      )}

      <main className="w-full max-w-[440px] min-h-screen shadow-2xl relative overflow-hidden flex flex-col pb-16 bg-[#FBF5EB] text-[#19223D]">
        {/* Audio flotante */}
        <AudioPlayer audioUrl={data.musicaUrl} template={template} />

        {/* 1. Portada Monograma & Invitación de Boda */}
        <section className="px-6 pt-12 pb-8 text-center flex flex-col items-center relative">
          <span className="text-3xl mb-2">🕊️</span>
          <p className="text-[11px] tracking-widest uppercase text-[#AF936A] font-serif font-bold">
            TOGETHER WITH THEIR FAMILIES
          </p>

          <h1 className="text-5xl font-serif text-[#19223D] my-3 leading-tight tracking-wide font-normal">
            {data.titulo || "Emma & Lucas"}
          </h1>

          <p className="text-xs tracking-widest uppercase text-stone-500 font-serif mb-6">
            INVITE YOU TO THEIR WEDDING CELEBRATION
          </p>

          {/* Fotografía de los novios con marco elegante en tonos dorados */}
          <div className="w-72 h-96 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoPortadaUrl}
              alt={data.titulo}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="h-[1px] w-12 bg-[#AF936A]" />
            <p className="text-xs font-serif tracking-widest font-bold text-[#AF936A]">
              {data.fechaTextoPersonalizada || "SATURDAY, JULY 22, 2030 AT 3:30 PM"}
            </p>
            <span className="h-[1px] w-12 bg-[#AF936A]" />
          </div>

          <p className="text-xs text-stone-500 mt-2 font-serif">
            {data.recepcionDireccion || "8221 Sunset Blvd, West Hollywood"}
          </p>
        </section>

        {/* 2. Cuenta Regresiva "Countdown to Forever" */}
        <CountdownTimer
          targetDate={data.fechaEvento}
          template={template}
          titulo="THE COUNTDOWN TO FOREVER HAS BEGUN..."
        />

        {/* 3. The Venue (El Castillo / Château) */}
        <section className="px-6 py-6 text-center">
          <div className="bg-white p-6 rounded-3xl border border-[#EFD2A6] shadow-sm">
            <span className="text-2xl">🏰</span>
            <h3 className="text-xs uppercase tracking-widest font-bold mt-1 text-[#AF936A] font-serif">
              THE VENUE
            </h3>
            <h4 className="text-lg font-serif font-bold text-[#19223D] mt-1">
              {data.recepcionNombre || "Oheka Castle"}
            </h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed font-light">
              Experience a real-life fairytale at this iconic French-style château, nestled on Long Island’s Gold Coast.
            </p>

            <a
              href={data.recepcionMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-semibold bg-[#19223D] text-white hover:bg-[#2b3a67] transition shadow-md font-serif"
            >
              <MapPin className="w-3.5 h-3.5" />
              View Location on Google Maps
            </a>
          </div>
        </section>

        {/* 4. Hotel Accommodation Card (Canva Template 2 feature) */}
        <section className="px-6 py-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EFD2A6] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#AF936A] uppercase tracking-wider mb-2">
              <Hotel className="w-4 h-4" />
              <span>STAY AT OHEKA CASTLE</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-light mb-4">
              We have arranged special accommodation options for our guests to enjoy this special weekend together.
            </p>

            <div className="space-y-2 text-xs text-stone-700 bg-[#FBF5EB] p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#AF936A]" />
                <span>Accommodation for up to 42 guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#AF936A]" />
                <span>Elegant, luxury private suites</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#AF936A]" />
                <span>Buffet breakfast, pool & garden access included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#AF936A]" />
                <span>Special wedding rates from $250 per night</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 italic mt-3">
              Limited availability – please RSVP and contact us early to secure your spot.
            </p>
          </div>
        </section>

        {/* 5. Transporte & Shuttles */}
        <section className="px-6 py-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EFD2A6] shadow-sm text-center">
            <Bus className="w-6 h-6 mx-auto text-[#AF936A]" />
            <h3 className="text-xs uppercase tracking-widest font-bold mt-2 text-[#AF936A] font-serif">
              TRANSPORTATION
            </h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed font-light">
              Shuttles will be available to transport guests from the ceremony to the reception. Shuttles will depart right after the ceremony.
            </p>
          </div>
        </section>

        {/* 6. Itinerario de Boda */}
        <section className="px-6 py-8">
          <div className="text-center mb-6">
            <span className="text-2xl">💍</span>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#AF936A] font-serif mt-1">
              THE WEDDING PROGRAM
            </h3>
            <p className="text-[11px] text-stone-500 italic">A day full of magical moments</p>
          </div>

          <div className="space-y-4">
            {weddingItinerary.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-[#EFD2A6] shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FBF5EB] border border-[#EFD2A6] flex items-center justify-center text-[#AF936A]">
                    {item.icon === "wine" ? (
                      <Wine className="w-4 h-4" />
                    ) : item.icon === "camera" ? (
                      <Camera className="w-4 h-4" />
                    ) : item.icon === "party" ? (
                      <PartyPopper className="w-4 h-4" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-serif text-[#19223D]">{item.title}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                      Order of events
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#AF936A] font-serif">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Dress Code Semi-Formal */}
        <section className="px-6 py-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EFD2A6] shadow-sm text-center">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#AF936A] font-serif">
              DRESS CODE
            </h3>
            <p className="text-sm font-serif font-bold text-[#19223D] mt-1">
              Semi-Formal and Elegant
            </p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed font-light">
              Feel free to add a touch of pastel to match our theme and celebration.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <span className="w-5 h-5 rounded-full bg-[#EFD2A6] border border-stone-300" title="Champagne" />
              <span className="w-5 h-5 rounded-full bg-[#FBF5EB] border border-stone-300" title="Ivory" />
              <span className="w-5 h-5 rounded-full bg-[#698DC9] border border-stone-300" title="Pastel Blue" />
              <span className="w-5 h-5 rounded-full bg-[#D5C398] border border-stone-300" title="Gold" />
            </div>
          </div>
        </section>

        {/* 8. Wedding Registry */}
        <section className="px-6 py-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EFD2A6] shadow-sm text-center">
            <Gift className="w-6 h-6 mx-auto text-[#AF936A]" />
            <h3 className="text-xs uppercase tracking-widest font-bold mt-2 text-[#AF936A] font-serif">
              WEDDING REGISTRY
            </h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed font-light">
              Your presence is the greatest gift of all. Should you wish to honor us with a present, you can find our wedding registry below.
            </p>
            {data.wishlistUrl && (
              <a
                href={data.wishlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#FBF5EB] text-[#19223D] border border-[#EFD2A6] hover:bg-[#efd2a6]/40 transition"
              >
                Access Registry
              </a>
            )}
          </div>
        </section>

        {/* 9. Formulario RSVP con WhatsApp */}
        <RsvpSection
          eventoId={data.id}
          eventoTitulo={data.titulo}
          telefonoWhatsapp={data.telefonoWhatsappRsvp}
          maxPases={data.maxPasesPorInvitado || 2}
          fechaLimite={data.fechaLimiteRsvp || "July 15"}
          template={template}
        />

        {/* 10. Despedida y Agendar */}
        <footer className="px-6 pt-6 pb-12 text-center">
          <Heart className="w-6 h-6 mx-auto mb-2 text-[#AF936A] animate-pulse" />
          <h3 className="text-3xl font-serif text-[#19223D]">See You There!</h3>
          <p className="text-xs tracking-widest uppercase text-stone-500 mt-1 mb-6 font-serif">
            WITH LOVE, {data.titulo}
          </p>

          <AddToCalendarButton
            titulo={`Wedding: ${data.titulo}`}
            descripcion={`Wedding celebration of ${data.titulo} at ${data.recepcionNombre}.`}
            ubicacion={`${data.recepcionNombre}, ${data.recepcionDireccion}`}
            fechaEvento={data.fechaEvento}
            template={template}
          />
        </footer>
      </main>
    </div>
  );
}
