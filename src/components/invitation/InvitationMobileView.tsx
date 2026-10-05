import React from "react";
import {
  MapPin,
  Gift,
  Heart,
  Sparkles,
  ExternalLink,
  Users,
  Compass,
} from "lucide-react";
import { getTemplate, TemplateId } from "@/lib/templates";
import { getMapEmbedUrl, getMapDirectionsUrl } from "@/lib/maps";
import AudioPlayer from "./AudioPlayer";
import CountdownTimer from "./CountdownTimer";
import RsvpSection from "./RsvpSection";
import TimelineSection, { TimelineItem } from "./TimelineSection";
import AddToCalendarButton from "./AddToCalendarButton";
import EnvelopeIntro from "./EnvelopeIntro";

export interface InvitationData {
  id?: string;
  slug: string;
  tipoEvento: "QUINCEANERA" | "BODA" | "CUMPLEANOS";
  estiloPlantilla: TemplateId;
  titulo: string; // ej. "Elsy" o "Sofía & Alejandro"
  subtitulo?: string | null; // ej. "An Unforgettable Celebration Awaits"
  frasePersonalizada?: string | null;
  fechaEvento: string | Date;
  fechaTextoPersonalizada?: string | null; // ej. "DECEMBER 05, 2026 AT 2 PM"
  fotoPortadaUrl: string;
  fotoInfanciaUrl?: string | null;
  fotoActualUrl?: string | null;
  fotoCierreUrl?: string | null;
  musicaUrl?: string | null;
  telefonoWhatsappRsvp: string;
  fechaLimiteRsvp?: string | null;
  maxPasesPorInvitado?: number;

  ceremoniaNombre?: string | null;
  ceremoniaDireccion?: string | null;
  ceremoniaMapUrl?: string | null;

  recepcionNombre: string;
  recepcionDireccion: string;
  recepcionMapUrl: string;

  // Placa de Fecha & Recinto (Paso 3)
  fechaPlacaMes?: string | null;
  fechaPlacaHora?: string | null;
  fechaPlacaLugar?: string | null;

  // Protocolo, Regalos y RSVP (Paso 4)
  countdownEncabezado?: string | null;
  dressCodeEtiqueta?: string | null;
  dressCodeColoresReservados?: string | null;
  regalosMensaje?: string | null;
  regalosZelle?: string | null;
  regalosCashApp?: string | null;
  rsvpFechaLimite?: string | null;

  dressCodeTitulo?: string | null;
  dressCodeNota?: string | null;
  coloresReservados?: string[];

  celebrationGuideline?: string | null;
  mensajeDespedida?: string | null;
  autorBendicion?: string | null;
  textoDisco?: string | null;

  itinerario?: any[];
  itinerarioJson?: TimelineItem[] | any;
  corteHonorJson?: {
    chambelan?: string;
    chambelanes?: string[];
    damas?: string[];
    parents?: string;
    padrinos?: string[];
    mensajeGratitud?: string;
  } | any;
  mesaRegalosJson?: {
    titulo?: string;
    mensaje?: string;
    plataformas?: string[];
    datosBancarios?: string;
  } | any;
  videoUrl?: string | null;
  galeriaFotosUrls?: string[];
  wishlistUrl?: string | null;
  hospedajeJson?: any;
  transporteJson?: any;
  historiaHitosJson?: any;
  idiomaDefault?: string;
}

export default function InvitationMobileView({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const template = getTemplate(data.estiloPlantilla);
  const eventDateObj = new Date(data.fechaEvento);

  // Fecha por defecto o personalizada
  const formattedDate =
    data.fechaTextoPersonalizada ||
    eventDateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).toUpperCase() + " AT 2 PM";

  return (
    <div
      className="min-h-screen flex justify-center selection:bg-pink-200 antialiased"
      style={{ backgroundColor: template.bgColor }}
    >
      {/* 0. Intro Animada 3D del Sobre con Sello y Desbloqueo de Audio */}
      {!skipIntro && (
        <EnvelopeIntro
          titulo={data.titulo}
          tipoEvento={data.tipoEvento}
          fechaTexto={formattedDate}
          template={template}
        />
      )}

      <main
        className="w-full max-w-[440px] min-h-screen shadow-2xl relative overflow-hidden flex flex-col pb-12"
        style={{
          backgroundColor: template.bgColor,
          color: template.textPrimary,
          fontFamily: template.fontBody,
        }}
      >
        {/* Audio flotante */}
        <AudioPlayer audioUrl={data.musicaUrl} template={template} />

        {/* 1. Barra Superior Fija (Navbar) */}
        <nav
          className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-6 py-3 flex justify-between items-center text-xs tracking-widest uppercase border-b border-pink-100/60 transition-colors"
          style={{
            fontFamily: template.fontSubheading,
          }}
        >
          <a
            href="#inicio"
            className="hover:text-pink-700 transition font-serif tracking-widest text-[#5A3E44]"
          >
            Invitation
          </a>
          <a
            href="#rsvp"
            className="font-semibold transition hover:opacity-80 px-3.5 py-1 rounded-full text-xs shadow-sm"
            style={{
              backgroundColor: "#5A3E44",
              color: "#FFFFFF",
            }}
          >
            RSVP
          </a>
        </nav>

        {/* 2. Portada (Sobre y Lazo con Glitter Oro Rosa) */}
        <section id="inicio" className="px-6 pt-10 pb-6 text-center flex flex-col items-center relative">
          {/* Lluvia de brillos / glitter en la parte superior */}
          <div className="absolute top-2 left-0 right-0 flex justify-around pointer-events-none opacity-60">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <Sparkles className="w-5 h-5 text-rose-300 animate-float" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <Sparkles className="w-4 h-4 text-rose-300 animate-pulse" />
          </div>

          <div
            className={`w-60 h-60 rounded-3xl bg-gradient-to-tr ${template.ribbonGradient} flex flex-col items-center justify-center shadow-lg relative p-4 border border-pink-200/80 transition-transform duration-500 hover:scale-105`}
          >
            <div className="relative">
              <span className="text-6xl drop-shadow">🎀</span>
              <span className="absolute -top-1 -right-1 text-sm">💎</span>
            </div>
            <div className="flex gap-1.5 mt-3">
              <Sparkles className="w-4 h-4 text-[#D4A59A]" />
              <Sparkles className="w-5 h-5 text-[#C58B95]" />
              <Sparkles className="w-4 h-4 text-[#D4A59A]" />
            </div>
          </div>

          <h1
            className="text-5xl sm:text-6xl mt-8 font-normal"
            style={{
              fontFamily: template.fontHeading,
              color: "#5A3E44",
            }}
          >
            You&apos;re Invited!
          </h1>
          <p
            className="text-[11px] tracking-widest uppercase mt-2 font-medium text-stone-500"
            style={{ fontFamily: template.fontSubheading }}
          >
            {data.subtitulo || "An Unforgettable Celebration Awaits"}
          </p>
        </section>

        {/* 3. Retrato Principal y Nombre */}
        <section className="px-6 py-6 text-center">
          <p
            className="text-[11px] tracking-widest uppercase text-stone-500 mb-3 font-semibold"
            style={{ fontFamily: template.fontSubheading }}
          >
            WITH LOVE WE INVITE YOU
          </p>

          {/* Fotografía vertical enmarcada en arco superior */}
          <div
            className="rounded-t-full overflow-hidden border-4 border-white shadow-xl mx-auto w-72 h-96 relative bg-stone-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoPortadaUrl}
              alt={data.titulo}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <p
            className="text-[11px] tracking-widest uppercase text-stone-400 mt-6 font-semibold"
            style={{ fontFamily: template.fontSubheading }}
          >
            {data.tipoEvento === "QUINCEANERA"
              ? "CELEBRATE THE QUINCEAÑERA OF"
              : "CELEBRATE THE WEDDING OF"}
          </p>

          {/* Nombre caligráfico + Corazón musical */}
          <div className="flex items-center justify-center gap-2 -mt-1">
            <h2
              className="text-6xl font-normal tracking-wide text-[#5A3E44]"
              style={{
                fontFamily: template.fontHeading,
              }}
            >
              {data.titulo}
            </h2>
            <span className="text-xl animate-pulse" title="Musical Heart">💖🎵</span>
          </div>

          {/* Bloque de fecha entre separadores lineales delgados */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="h-[1px] w-12 bg-pink-200" />
            <p
              className="text-xs tracking-widest font-semibold text-stone-600"
              style={{
                fontFamily: template.fontSubheading,
              }}
            >
              {formattedDate}
            </p>
            <div className="h-[1px] w-12 bg-pink-200" />
          </div>
        </section>

        {/* 4. Cuenta Regresiva Digital (Countdown en Magenta/Vino #9E2A4B) */}
        <CountdownTimer
          targetDate={data.fechaEvento}
          template={template}
          titulo="I CAN'T WAIT TO CELEBRATE WITH YOU!"
        />

        {/* 5. Módulo Emocional "From Girl to Señorita" */}
        {(data.fotoInfanciaUrl || data.fotoActualUrl || data.frasePersonalizada) && (
          <section className="px-6 py-8 text-center">
            <h3
              className="text-xs uppercase tracking-widest font-bold mb-4 text-[#5A3E44]"
              style={{ fontFamily: template.fontSubheading }}
            >
              {data.tipoEvento === "QUINCEANERA"
                ? "FROM GIRL TO SEÑORITA"
                : "OUR LOVE STORY"}
            </h3>

            {/* Dos fotos comparativas en marcos redondeados / ovalados */}
            {(data.fotoInfanciaUrl || data.fotoActualUrl) && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {data.fotoInfanciaUrl && (
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-stone-100 relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.fotoInfanciaUrl}
                        alt="De niña"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <span
                      className="mt-2 text-[10px] font-bold tracking-widest uppercase text-stone-500 font-serif"
                    >
                      FROM GIRL
                    </span>
                  </div>
                )}

                {data.fotoActualUrl && (
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-stone-100 relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.fotoActualUrl}
                        alt="De señorita"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <span
                      className="mt-2 text-[10px] font-bold tracking-widest uppercase text-[#5A3E44] font-serif"
                    >
                      TO SEÑORITA
                    </span>
                  </div>
                )}
              </div>
            )}

            <p
              className="text-xs leading-relaxed font-light px-2 text-stone-600 mt-2"
            >
              {data.frasePersonalizada ||
                "Desde pequeña, Elsy soñó con este instante. Hoy celebramos el hermoso paso de niña a señorita, rodeada del cariño y bendición de quienes han guiado cada uno de sus pasos."}
            </p>
          </section>
        )}

        {/* 6. Módulo de Confirmación (RSVP con WhatsApp) */}
        <RsvpSection
          eventoId={data.id}
          eventoTitulo={data.titulo}
          telefonoWhatsapp={data.telefonoWhatsappRsvp}
          maxPases={data.maxPasesPorInvitado || 4}
          fechaLimite={data.fechaLimiteRsvp}
          template={template}
        />

        {/* 7. Mesa de Regalos / Lluvia de Sobres (The Registry) */}
        <section className="px-6 py-6">
          <div
            className="p-6 rounded-3xl border border-pink-100 shadow-sm text-center bg-white"
          >
            <span className="text-3xl">🎁</span>
            <h3
              className="text-xs uppercase tracking-widest font-bold mt-2 text-[#5A3E44]"
              style={{ fontFamily: template.fontSubheading }}
            >
              {data.mesaRegalosJson?.titulo || "THE REGISTRY"}
            </h3>

            <p className="text-xs text-stone-600 mt-2 leading-relaxed font-light">
              {data.mesaRegalosJson?.mensaje ||
                "Celebrating with you is the greatest gift of all. For guests who wish to bring a contribution, is warmly appreciated."}
            </p>

            {/* Badges de opciones de aportación (Zelle / CashApp / Urna de sobres) */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-100 text-[11px] font-semibold text-[#5A3E44]">
                ✉️ Urna de Sobres
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-[11px] font-semibold text-purple-800">
                💜 Zelle
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-800">
                💵 CashApp / Efectivo
              </span>
            </div>

            {data.mesaRegalosJson?.datosBancarios && (
              <div
                className="mt-3 p-3 rounded-xl text-xs font-mono select-all bg-[#FFF9FA] border border-pink-100 text-[#5A3E44]"
              >
                {data.mesaRegalosJson.datosBancarios}
              </div>
            )}
          </div>
        </section>

        {/* 8. Ubicación con Mapa (The Location) */}
        <section className="px-6 py-6 space-y-4">
          <div className="text-center mb-2">
            <span className="text-2xl">📍</span>
            <h3
              className="text-sm uppercase tracking-widest font-bold mt-1 text-[#5A3E44]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              THE LOCATION
            </h3>
          </div>

          {/* Salón de Recepción */}
          <div
            className="p-6 rounded-3xl border border-pink-100 shadow-sm text-center bg-white"
          >
            <h4 className="text-sm font-bold text-stone-800" style={{ fontFamily: template.fontSubheading }}>
              {data.recepcionNombre}
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              {data.recepcionDireccion}
            </p>

            {/* MAPA EMBEBIDO INTERACTIVO */}
            {(() => {
              const fullAddress = `${data.recepcionNombre || ""} ${data.recepcionDireccion || ""}`.trim();
              const embedUrl = getMapEmbedUrl(data.recepcionMapUrl, fullAddress);
              return embedUrl ? (
                <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-pink-100 my-4 bg-stone-50 relative">
                  <iframe
                    title={`Ubicación - ${data.recepcionNombre}`}
                    src={embedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              ) : null;
            })()}

            {/* Botón estilizado Directions */}
            <a
              href={getMapDirectionsUrl(
                data.recepcionMapUrl,
                `${data.recepcionNombre || ""} ${data.recepcionDireccion || ""}`.trim()
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-semibold border border-[#5A3E44] text-[#5A3E44] hover:bg-[#5A3E44] hover:text-white transition shadow-sm"
              style={{ fontFamily: template.fontSubheading }}
            >
              <Compass className="w-3.5 h-3.5" />
              Directions / Ver en Mapa
            </a>
          </div>

          {/* Ceremonia religiosa si existe */}
          {data.ceremoniaNombre && (
            <div
              className="p-5 rounded-2xl border border-pink-100 shadow-sm text-center bg-white/70"
            >
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#D4A59A]">
                Ceremonia Religiosa / Iglesia
              </p>
              <h4 className="text-xs font-bold text-stone-800 mt-1">
                {data.ceremoniaNombre}
              </h4>
              {data.ceremoniaDireccion && (
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {data.ceremoniaDireccion}
                </p>
              )}

              {(() => {
                const fullCeremonyAddress = `${data.ceremoniaNombre || ""} ${data.ceremoniaDireccion || ""}`.trim();
                const ceremonyEmbedUrl = getMapEmbedUrl(data.ceremoniaMapUrl, fullCeremonyAddress);
                return ceremonyEmbedUrl ? (
                  <div className="w-full h-44 rounded-xl overflow-hidden shadow-sm border border-pink-100 my-3 bg-stone-50 relative">
                    <iframe
                      title={`Ceremonia - ${data.ceremoniaNombre}`}
                      src={ceremonyEmbedUrl}
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
                  data.ceremoniaMapUrl,
                  `${data.ceremoniaNombre || ""} ${data.ceremoniaDireccion || ""}`.trim()
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs uppercase tracking-wider font-semibold text-[#5A3E44] underline underline-offset-4"
              >
                <MapPin className="w-3.5 h-3.5" />
                Ver Mapa Iglesia
              </a>
            </div>
          )}
        </section>

        {/* 9. Línea de Tiempo del Evento (The Program) */}
        <TimelineSection items={data.itinerarioJson} template={template} />

        {/* 10. Código de Vestimenta (Dress Code) */}
        <section className="px-6 py-6">
          <div
            className="p-6 rounded-3xl border border-pink-100 shadow-sm text-center bg-white/80"
          >
            <span className="text-2xl">👠</span>
            <h3
              className="text-xs uppercase tracking-widest font-bold mt-2 text-[#5A3E44]"
              style={{ fontFamily: template.fontSubheading }}
            >
              BRING YOUR DANCING SHOES
            </h3>

            <p
              className="text-xs font-semibold text-[#5A3E44] mt-1 uppercase tracking-wider"
              style={{ fontFamily: template.fontSubheading }}
            >
              {data.dressCodeTitulo || "DRESS CODE: ELEGANT & FORMAL"}
            </p>

            <p className="text-xs text-stone-600 mt-2 leading-relaxed font-light">
              {data.dressCodeNota ||
                "Guests are encouraged to wear shades of white/formal to match the celebration."}
            </p>

            {/* Muestra de colores reservados */}
            {data.coloresReservados && data.coloresReservados.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-[10px] uppercase tracking-wider text-stone-400">Reserved tones:</span>
                {data.coloresReservados.map((hex, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-stone-300 shadow-inner"
                    style={{ backgroundColor: hex }}
                    title={`Color reservado ${hex}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 11. Guía de la Celebración (Celebration Guideline) */}
        <section className="px-6 py-4">
          <div
            className="p-6 rounded-3xl border border-pink-100 shadow-sm text-center bg-white/70"
          >
            <span className="text-2xl">🧸</span>
            <h3
              className="text-xs uppercase tracking-widest font-bold mt-1 text-[#5A3E44]"
              style={{ fontFamily: template.fontSubheading }}
            >
              CELEBRATION GUIDELINE
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed font-light px-2">
              {data.celebrationGuideline ||
                "OUR LITTLE GUESTS: We lovingly welcome children to celebrate with us. During special dances and performances, we kindly ask that children remain seated."}
            </p>
          </div>
        </section>

        {/* 12. Corte de Honor y Agradecimientos (The Court of Honor & Special Thank You) */}
        <section className="px-6 py-6">
          <div
            className="p-6 rounded-3xl border border-pink-100 shadow-sm text-center bg-white"
          >
            <h3
              className="text-xs uppercase tracking-widest font-bold text-[#5A3E44]"
              style={{ fontFamily: template.fontSubheading }}
            >
              THE COURT OF HONOR
            </h3>

            {/* Main Chambelán */}
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                Main Chambelán
              </p>
              <p className="text-xs font-bold text-[#5A3E44]">
                {data.corteHonorJson?.chambelan || "Jeremiah"}
              </p>
            </div>

            {/* Damitas */}
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                Damitas
              </p>
              <p className="text-xs text-stone-700">
                {data.corteHonorJson?.damas?.join(" • ") || "Magdalena • Violeta • Tania"}
              </p>
            </div>

            {/* Chambelanes adicionales si existen */}
            {data.corteHonorJson?.chambelanes && data.corteHonorJson.chambelanes.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                  Chambelanes
                </p>
                <p className="text-xs text-stone-700">
                  {data.corteHonorJson.chambelanes.join(" • ")}
                </p>
              </div>
            )}

            <div className="h-[1px] bg-pink-100 my-4" />

            <h4
              className="text-[11px] uppercase tracking-widest font-bold text-[#5A3E44]"
              style={{ fontFamily: template.fontSubheading }}
            >
              SPECIAL THANK YOU
            </h4>

            {/* Parents */}
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                Parents
              </p>
              <p className="text-xs font-semibold text-stone-700">
                {data.corteHonorJson?.parents || "Magdalena & Adrian"}
              </p>
            </div>

            {/* Padrinos de Honor */}
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                Padrinos de Honor
              </p>
              <p className="text-xs text-stone-600">
                {data.corteHonorJson?.padrinos?.join(" • ") || "Tania & Carl"}
              </p>
            </div>

            <p className="text-[11px] text-stone-500 italic mt-4 font-light">
              {data.corteHonorJson?.mensajeGratitud ||
                "Gracias a nuestros seres queridos por su amor, generosidad y apoyo incondicional para hacer posible este sueño."}
            </p>
          </div>
        </section>

        {/* 13. Despedida y Agendar en Calendario (See You Soon!) */}
        <footer className="px-6 pt-6 pb-12 text-center">
          {/* Foto final ajustando el vestido si existe */}
          {data.fotoCierreUrl && (
            <div className="w-56 h-72 mx-auto rounded-3xl overflow-hidden shadow-md mb-6 border-2 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.fotoCierreUrl}
                alt="See You Soon"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <Heart className="w-6 h-6 mx-auto mb-2 text-[#D4A59A] animate-pulse" />
          <h3
            className="text-4xl sm:text-5xl font-normal text-[#5A3E44]"
            style={{
              fontFamily: template.fontHeading,
            }}
          >
            See You Soon!
          </h3>
          <p
            className="text-[11px] tracking-widest uppercase text-stone-500 mt-1 mb-6 font-semibold"
            style={{ fontFamily: template.fontSubheading }}
          >
            WITH LOVE AND GRATITUDE, {data.titulo} - SAVE THE DATE
          </p>

          {/* Botón de acción: Add to Calendar */}
          <AddToCalendarButton
            titulo={`Celebración: ${data.titulo}`}
            descripcion={`Acompáñanos en la celebración de ${data.titulo} en ${data.recepcionNombre}.`}
            ubicacion={`${data.recepcionNombre}, ${data.recepcionDireccion}`}
            fechaEvento={data.fechaEvento}
            template={template}
          />

          <p className="text-[10px] opacity-40 uppercase tracking-widest mt-10">
            Powered by LuminaVite
          </p>
        </footer>
      </main>
    </div>
  );
}
