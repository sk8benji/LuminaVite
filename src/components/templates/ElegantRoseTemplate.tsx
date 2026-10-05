"use client";

import React, { useState } from "react";
import {
  MapPin,
  Gift,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  Play,
  Hotel,
  Globe,
  Share2,
  Users,
} from "lucide-react";
import { getTemplate } from "@/lib/templates";
import { getMapEmbedUrl, getMapDirectionsUrl } from "@/lib/maps";
import AudioPlayer from "../invitation/AudioPlayer";
import CountdownTimer from "../invitation/CountdownTimer";
import RsvpSection from "../invitation/RsvpSection";
import TimelineSection from "../invitation/TimelineSection";
import AddToCalendarButton from "../invitation/AddToCalendarButton";
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

  // Función para transformar URL de YouTube a embed si aplica
  const getEmbedVideoUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const embedUrl = getEmbedVideoUrl(data.videoUrl || "https://www.youtube.com/embed/0ZVsGVE1qCg");

  // Hitos por defecto de la plantilla de Canva (Isabella - Growing Up)
  const defaultHitos = [
    {
      fecha: "10.8.2012",
      titulo: isEn ? "First Steps" : "Primeros Pasos",
      texto: isEn
        ? "Every story has a beginning, and mine started with the love of family, the comfort of home, and countless little moments that became treasured memories."
        : "Toda historia tiene un comienzo, y la mía comenzó rodeada del amor de mi familia, la calidez de mi hogar y un sinfín de pequeños momentos que se convirtieron en recuerdos inolvidables.",
      foto: data.fotoInfanciaUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
    },
    {
      fecha: "10.9.2017",
      titulo: isEn ? "New Adventures" : "Nuevas Aventuras",
      texto: isEn
        ? "With each new adventure came exciting firsts, growing confidence, and friendships that would become an important part of my journey."
        : "Cada nueva aventura trajo consigo emocionantes primeras experiencias, una confianza creciente y amistades que se convirtieron en parte fundamental de mi camino.",
      foto: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    },
    {
      fecha: "5.2.2019",
      titulo: isEn ? "Special Bonds" : "Lazos Especiales",
      texto: isEn
        ? "From laughter-filled days to unforgettable memories, these special people helped shape the person I am today."
        : "Entre días llenos de risas y recuerdos inolvidables, estas personas tan especiales me ayudaron a convertirme en la persona que soy hoy.",
      foto: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80",
    },
    {
      fecha: "10.8.2023",
      titulo: isEn ? "Loyal Companion" : "Compañero Fiel",
      texto: isEn
        ? "And through every chapter, there was one loyal companion by my side—sharing the cuddles, the adventures, and all of life's happiest moments."
        : "Y a lo largo de cada capítulo, siempre hubo momentos compartidos, aventuras y la felicidad de estar rodeada de quienes más amo.",
      foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const hitos = (data.historiaHitosJson as any[]) || defaultHitos;

  return (
    <div className="min-h-screen flex justify-center bg-[#FFF5F6] selection:bg-rose-200 antialiased">
      {/* Intro del Sobre 3D */}
      {!skipIntro && (
        <EnvelopeIntro
          titulo={data.titulo}
          tipoEvento={data.tipoEvento}
          fechaTexto={data.fechaTextoPersonalizada || "JULY 18 • 4:00 PM"}
          template={template}
        />
      )}

      <main className="w-full max-w-[440px] min-h-screen shadow-2xl relative overflow-hidden flex flex-col pb-16 bg-[#FFF5F6] text-[#5A3E44]">
        {/* Audio flotante */}
        <AudioPlayer audioUrl={data.musicaUrl} template={template} />

        {/* Switch de Idioma Flotante Superior */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-3 flex justify-between items-center border-b border-rose-100">
          <div className="flex items-center gap-1.5 text-xs font-serif tracking-widest text-[#CE8486]">
            <span>ISABELLA • XV</span>
          </div>

          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-full p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-0.5 rounded-full transition ${
                isEn ? "bg-[#CE8486] text-white shadow-sm" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-2.5 py-0.5 rounded-full transition ${
                !isEn ? "bg-[#CE8486] text-white shadow-sm" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              ES
            </button>
          </div>
        </header>

        {/* 1. Portada con arco floral de rosas */}
        <section className="px-6 pt-10 pb-6 text-center flex flex-col items-center relative">
          <p className="text-xs uppercase tracking-widest text-[#CE8486] font-semibold mb-2 font-serif">
            {isEn ? "You are cordially" : "Le invitamos cordialmente"}
          </p>
          <h1 className="text-6xl font-normal font-script text-[#5A3E44] my-1">
            {isEn ? "invited!" : "¡A celebrar!"}
          </h1>

          <p className="text-[11px] tracking-widest uppercase text-stone-500 mt-2 font-serif">
            {isEn ? "Select your language below" : "Disfruta de este día especial"}
          </p>

          {/* Marco tipo Arco Ovalado con foto de quinceañera */}
          <div className="mt-6 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-xl w-72 h-96 relative bg-rose-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoPortadaUrl}
              alt={data.titulo}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <p className="text-xs tracking-widest uppercase text-stone-400 mt-6 font-serif">
            {isEn ? "Warmly invite you to celebrate the" : "A celebrar los quince años de su hija"}
          </p>
          <h2 className="text-6xl font-script text-[#5A3E44] -mt-1">{data.titulo}</h2>

          {/* Fecha destacada */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-[1px] w-12 bg-rose-200" />
            <p className="text-xs tracking-widest font-semibold font-serif text-[#CE8486]">
              {data.fechaTextoPersonalizada || "SUNDAY, JULY 18 • 4:00 PM"}
            </p>
            <span className="h-[1px] w-12 bg-rose-200" />
          </div>
        </section>

        {/* 2. Reproductor de Video Showcase (Vals / Sesión previa) */}
        {embedUrl && (
          <section className="px-6 py-6 text-center">
            <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3 text-xs font-serif font-bold text-[#CE8486] uppercase tracking-wider">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isEn ? "Pre-Quince Video Session" : "Video Sesión Especial"}</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-inner aspect-video bg-black relative">
                <iframe
                  src={embedUrl}
                  title="Quinceañera Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* 3. Cuenta Regresiva Digital */}
        <CountdownTimer
          targetDate={data.fechaEvento}
          template={template}
          titulo={isEn ? "THE COUNTDOWN HAS BEGUN!" : "¡LA CUENTA REGRESIVA HA COMENZADO!"}
        />

        {/* 4. Módulo "Growing Up" (Hitos Cronológicos con Fotos) */}
        <section className="px-6 py-8">
          <div className="text-center mb-6">
            <span className="text-2xl">🌸</span>
            <h3 className="text-sm uppercase tracking-widest font-bold mt-1 text-[#5A3E44] font-serif">
              {isEn ? "Growing Up" : "Mi Historia"}
            </h3>
            <p className="text-[11px] text-stone-500 italic mt-0.5">
              {isEn
                ? "Celebrating Fifteen Amazing Years—The Best Is Yet to Come"
                : "Celebrando quince años de recuerdos y sueños inolvidables"}
            </p>
          </div>

          <div className="space-y-6">
            {hitos.map((h, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center"
              >
                {h.foto && (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-rose-100 shrink-0 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.foto} alt={h.titulo} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-[#CE8486]">
                    {h.fecha}
                  </span>
                  <h4 className="text-xs font-bold text-stone-800 mt-1 font-serif">{h.titulo}</h4>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed font-light">
                    {h.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Ubicaciones (Misa & Salón) */}
        <section className="px-6 py-6 space-y-4">
          <div className="text-center mb-2">
            <span className="text-2xl">⛪</span>
            <h3 className="text-sm uppercase tracking-widest font-bold text-[#5A3E44] font-serif">
              {isEn ? "The Location" : "Ubicación del Evento"}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm text-center">
            <h4 className="text-sm font-bold text-stone-800 font-serif">
              {data.recepcionNombre || "St. Mary's Church & Grand Ballroom"}
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              {data.recepcionDireccion || "Any City, Any Street, AZ 12345"}
            </p>

            {/* MAPA EMBEBIDO INTERACTIVO */}
            {(() => {
              const fullAddress = `${data.recepcionNombre || ""} ${data.recepcionDireccion || ""}`.trim();
              const embedUrl = getMapEmbedUrl(data.recepcionMapUrl, fullAddress);
              return embedUrl ? (
                <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-rose-100 my-4 bg-stone-50 relative">
                  <iframe
                    title="Ubicación"
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
              className="mt-2 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-semibold bg-[#CE8486] text-white hover:bg-[#b86f71] transition shadow-md"
            >
              <MapPin className="w-3.5 h-3.5" />
              {isEn ? "View on Google Maps" : "Ver en Google Maps"}
            </a>
          </div>
        </section>

        {/* 6. Itinerario (The Day) */}
        <TimelineSection items={data.itinerarioJson} template={template} />

        {/* 7. Corte de Honor (The Quince Court) */}
        <section className="px-6 py-6">
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm text-center">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#5A3E44] font-serif mb-4">
              {isEn ? "The Quince Court" : "Corte de Honor"}
            </h3>

            {/* Padrinos */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-[#CE8486] font-bold">
                {isEn ? "Padrinos de Honor" : "Padrinos de Honor"}
              </p>
              <p className="text-xs font-bold text-stone-800 mt-0.5">
                {data.corteHonorJson?.padrinos?.join(" • ") || "Miguel & Daniela Herrera"}
              </p>
            </div>

            {/* Chambelán de Honor */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-[#CE8486] font-bold">
                {isEn ? "Chamberlain of Honor" : "Chambelán de Honor"}
              </p>
              <p className="text-xs font-bold text-stone-800 mt-0.5">
                {data.corteHonorJson?.chambelan || "Emilio Salazar"}
              </p>
            </div>

            {/* Damas */}
            {data.corteHonorJson?.damas && (
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider text-[#CE8486] font-bold">
                  {isEn ? "Damas" : "Damas de Honor"}
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  {data.corteHonorJson.damas.join(" • ")}
                </p>
              </div>
            )}

            {/* Chambelanes */}
            {data.corteHonorJson?.chambelanes && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#CE8486] font-bold">
                  {isEn ? "Chambelanes" : "Chambelanes"}
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  {data.corteHonorJson.chambelanes.join(" • ")}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 8. Hospedaje / Accomodation (Bloque de Hotel de Canva) */}
        <section className="px-6 py-4">
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm text-center">
            <Hotel className="w-6 h-6 mx-auto text-[#CE8486]" />
            <h3 className="text-xs uppercase tracking-widest font-bold mt-2 text-[#5A3E44] font-serif">
              {isEn ? "Accommodation" : "Alojamiento & Hotel"}
            </h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed font-light">
              {isEn
                ? "A room block has been reserved for our guests. Please contact us for reservation details and special booking information."
                : "Hemos reservado un bloque de habitaciones con tarifa preferencial para nuestros invitados. Por favor contáctanos para detalles de reserva."}
            </p>
          </div>
        </section>

        {/* 9. Wishlist / Regalos */}
        <section className="px-6 py-4">
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm text-center">
            <Gift className="w-6 h-6 mx-auto text-[#CE8486]" />
            <h3 className="text-xs uppercase tracking-widest font-bold mt-2 text-[#5A3E44] font-serif">
              {isEn ? "Gifts & Wishlist" : "Mesa de Regalos"}
            </h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed font-light">
              {isEn
                ? "Your presence is the greatest gift we could ask for. If you'd like to celebrate with a gift, we invite you to browse our wishlist below."
                : "Tu presencia es nuestro mayor regalo. Si deseas tener un detalle con la quinceañera, puedes consultar nuestra mesa de regalos."}
            </p>
            {data.wishlistUrl && (
              <a
                href={data.wishlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-rose-50 text-[#CE8486] border border-rose-200 hover:bg-rose-100 transition"
              >
                {isEn ? "View Wishlist" : "Ver Lista de Deseos"}
              </a>
            )}
          </div>
        </section>

        {/* 10. Formulario RSVP con WhatsApp */}
        <RsvpSection
          eventoId={data.id}
          eventoTitulo={data.titulo}
          telefonoWhatsapp={data.telefonoWhatsappRsvp}
          maxPases={data.maxPasesPorInvitado || 4}
          fechaLimite={data.fechaLimiteRsvp}
          template={template}
        />

        {/* 11. Despedida y Agendar */}
        <footer className="px-6 pt-6 pb-12 text-center">
          <Heart className="w-6 h-6 mx-auto mb-2 text-[#CE8486] animate-pulse" />
          <h3 className="text-4xl font-script text-[#5A3E44]">Thank you!</h3>
          <p className="text-[11px] tracking-widest uppercase text-stone-500 mt-1 mb-6 font-serif">
            {isEn ? "We can't wait to celebrate with you!" : "¡Estamos deseando celebrarlo contigo!"}
          </p>

          <AddToCalendarButton
            titulo={`XV Años: ${data.titulo}`}
            descripcion={`Acompáñanos a celebrar los XV años de ${data.titulo}.`}
            ubicacion={`${data.recepcionNombre}, ${data.recepcionDireccion}`}
            fechaEvento={data.fechaEvento}
            template={template}
          />
        </footer>
      </main>
    </div>
  );
}
