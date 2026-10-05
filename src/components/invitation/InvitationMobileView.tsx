import React from "react";
import Image from "next/image";
import {
  MapPin,
  Gift,
  Heart,
  Sparkles,
  Music,
  CalendarDays,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { getTemplate, TemplateId } from "@/lib/templates";
import AudioPlayer from "./AudioPlayer";
import CountdownTimer from "./CountdownTimer";
import RsvpSection from "./RsvpSection";
import TimelineSection, { TimelineItem } from "./TimelineSection";
import AddToCalendarButton from "./AddToCalendarButton";

export interface InvitationData {
  id?: string;
  slug: string;
  tipoEvento: "QUINCEANERA" | "BODA";
  estiloPlantilla: TemplateId;
  titulo: string; // ej. "Elsy" o "Sofía & Alejandro"
  subtitulo?: string | null; // ej. "With love, we invite you"
  frasePersonalizada?: string | null;
  fechaEvento: string | Date;
  fotoPortadaUrl: string;
  fotoInfanciaUrl?: string | null;
  fotoActualUrl?: string | null;
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

  dressCodeTitulo?: string | null;
  dressCodeNota?: string | null;
  coloresReservados?: string[];

  itinerarioJson?: TimelineItem[] | any;
  corteHonorJson?: {
    chambelan?: string;
    damas?: string[];
    padrinos?: string[];
  } | any;
  mesaRegalosJson?: {
    titulo?: string;
    mensaje?: string;
    datosBancarios?: string;
  } | any;
}

export default function InvitationMobileView({ data }: { data: InvitationData }) {
  const template = getTemplate(data.estiloPlantilla);
  const eventDateObj = new Date(data.fechaEvento);

  // Formato elegante de fecha: "DICIEMBRE 05, 2026"
  const formattedDate = eventDateObj.toLocaleDateString("es-ES", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).toUpperCase();

  const formattedTime = eventDateObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="min-h-screen flex justify-center selection:bg-pink-200 antialiased"
      style={{ backgroundColor: template.bgColor }}
    >
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

        {/* 1. Mini-Nav Superior Fija */}
        <nav
          className="sticky top-0 z-40 backdrop-blur-md px-6 py-3 flex justify-between items-center text-xs tracking-widest uppercase border-b transition-colors"
          style={{
            backgroundColor: `${template.bgColor}EE`,
            borderColor: template.borderSoft,
            fontFamily: template.fontSubheading,
          }}
        >
          <a
            href="#inicio"
            className="hover:opacity-75 transition"
            style={{ color: template.textPrimary }}
          >
            Invitación
          </a>
          <a
            href="#rsvp"
            className="font-semibold transition hover:opacity-75 px-3 py-1 rounded-full"
            style={{
              backgroundColor: template.badgeBg,
              color: template.textPrimary,
            }}
          >
            RSVP
          </a>
        </nav>

        {/* 2. Portada (Sobre y Lazo) */}
        <section id="inicio" className="px-6 pt-10 pb-6 text-center flex flex-col items-center">
          <div
            className={`w-56 h-56 rounded-3xl bg-gradient-to-tr ${template.ribbonGradient} flex flex-col items-center justify-center shadow-inner relative p-4 border transition-transform duration-500 hover:scale-105`}
            style={{ borderColor: template.borderSoft }}
          >
            <span className="text-6xl animate-bounce">🎀</span>
            <div className="flex gap-1 mt-3">
              <Sparkles className="w-4 h-4 opacity-70" style={{ color: template.accentColor }} />
              <Sparkles className="w-5 h-5" style={{ color: template.accentColor }} />
              <Sparkles className="w-4 h-4 opacity-70" style={{ color: template.accentColor }} />
            </div>
          </div>

          <h1
            className="text-5xl mt-8 font-normal"
            style={{
              fontFamily: template.fontHeading,
              color: template.textPrimary,
            }}
          >
            You&apos;re Invited!
          </h1>
          <p
            className="text-[11px] tracking-widest uppercase mt-2 font-medium opacity-75"
            style={{ fontFamily: template.fontSubheading }}
          >
            {data.subtitulo || "An Unforgettable Celebration Awaits"}
          </p>
        </section>

        {/* 3. Foto Principal y Nombres */}
        <section className="px-6 py-6 text-center">
          <p
            className="text-[11px] tracking-widest uppercase opacity-75 mb-3 font-medium"
            style={{ fontFamily: template.fontSubheading }}
          >
            With Love We Invite You
          </p>

          {/* Marco curvo vertical tipo arco */}
          <div
            className="rounded-t-full overflow-hidden border-4 shadow-xl mx-auto w-72 h-96 relative bg-stone-100"
            style={{ borderColor: template.cardBg }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoPortadaUrl}
              alt={data.titulo}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <p
            className="text-[11px] tracking-widest uppercase opacity-60 mt-6"
            style={{ fontFamily: template.fontSubheading }}
          >
            {data.tipoEvento === "QUINCEANERA"
              ? "Celebrate the Quinceañera of"
              : "Celebremos el Matrimonio de"}
          </p>

          <h2
            className="text-6xl -mt-1 font-normal tracking-wide"
            style={{
              fontFamily: template.fontHeading,
              color: template.textPrimary,
            }}
          >
            {data.titulo}
          </h2>

          {/* Fecha destacada con separadores */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="h-[1px] w-12" style={{ backgroundColor: template.accentColor }} />
            <p
              className="text-xs tracking-widest font-semibold"
              style={{
                fontFamily: template.fontSubheading,
                color: template.textPrimary,
              }}
            >
              {formattedDate}
            </p>
            <div className="h-[1px] w-12" style={{ backgroundColor: template.accentColor }} />
          </div>
        </section>

        {/* 4. Contador Regresivo en Vivo */}
        <CountdownTimer targetDate={data.fechaEvento} template={template} />

        {/* 5. Bloque Emocional: "From Girl to Señorita" o Historia de Amor */}
        {(data.fotoInfanciaUrl || data.fotoActualUrl || data.frasePersonalizada) && (
          <section className="px-6 py-8 text-center">
            <h3
              className="text-xs uppercase tracking-widest font-semibold mb-4"
              style={{
                color: template.textPrimary,
                fontFamily: template.fontSubheading,
              }}
            >
              {data.tipoEvento === "QUINCEANERA"
                ? "From Girl to Señorita"
                : "Nuestra Historia de Amor"}
            </h3>

            {/* Dos fotos en comparativa */}
            {(data.fotoInfanciaUrl || data.fotoActualUrl) && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {data.fotoInfanciaUrl && (
                  <div
                    className="rounded-2xl overflow-hidden shadow-sm aspect-square relative border-2"
                    style={{ borderColor: template.cardBg }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.fotoInfanciaUrl}
                      alt="Infancia"
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute bottom-2 left-2 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm shadow"
                      style={{
                        backgroundColor: `${template.cardBg}CC`,
                        color: template.textPrimary,
                      }}
                    >
                      Ayer
                    </span>
                  </div>
                )}
                {data.fotoActualUrl && (
                  <div
                    className="rounded-2xl overflow-hidden shadow-sm aspect-square relative border-2"
                    style={{ borderColor: template.cardBg }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.fotoActualUrl}
                      alt="Actual"
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm shadow"
                      style={{
                        backgroundColor: `${template.cardBg}CC`,
                        color: template.textPrimary,
                      }}
                    >
                      Hoy
                    </span>
                  </div>
                )}
              </div>
            )}

            <p
              className="text-xs leading-relaxed font-light px-2 opacity-90"
              style={{ color: template.textSecondary }}
            >
              {data.frasePersonalizada ||
                (data.tipoEvento === "QUINCEANERA"
                  ? "Desde pequeña soñé con este momento tan mágico. Hoy doy el hermoso paso de niña a señorita, rodeada del amor y bendición de todos los que amo."
                  : "Dos almas que decidieron caminar juntas de la mano hacia una vida llena de momentos inolvidables.")}
            </p>
          </section>
        )}

        {/* 6. Formulario RSVP con WhatsApp */}
        <RsvpSection
          eventoId={data.id}
          eventoTitulo={data.titulo}
          telefonoWhatsapp={data.telefonoWhatsappRsvp}
          maxPases={data.maxPasesPorInvitado || 4}
          fechaLimite={data.fechaLimiteRsvp}
          template={template}
        />

        {/* 7. Ubicaciones (Ceremonia y Recepción) */}
        <section className="px-6 py-6 space-y-4">
          <div className="text-center mb-4">
            <span className="text-2xl">📍</span>
            <h3
              className="text-xs uppercase tracking-widest font-semibold mt-1"
              style={{
                color: template.textPrimary,
                fontFamily: template.fontSubheading,
              }}
            >
              Ubicación del Evento
            </h3>
          </div>

          {/* Ceremonia religiosa (si existe) */}
          {data.ceremoniaNombre && (
            <div
              className="p-5 rounded-2xl border shadow-sm text-center"
              style={{
                backgroundColor: template.cardBg,
                borderColor: template.borderSoft,
              }}
            >
              <p
                className="text-[10px] uppercase tracking-wider font-semibold opacity-70"
                style={{ color: template.accentColor }}
              >
                Ceremonia Religiosa
              </p>
              <h4 className="text-sm font-semibold mt-1" style={{ color: template.textPrimary }}>
                {data.ceremoniaNombre}
              </h4>
              {data.ceremoniaDireccion && (
                <p className="text-[11px] opacity-75 mt-0.5" style={{ color: template.textSecondary }}>
                  {data.ceremoniaDireccion}
                </p>
              )}
              {data.ceremoniaMapUrl && (
                <a
                  href={data.ceremoniaMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs uppercase tracking-wider font-semibold underline underline-offset-4 hover:opacity-80 transition"
                  style={{ color: template.accentColor }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Abrir Mapa Ceremonia
                </a>
              )}
            </div>
          )}

          {/* Recepción (Salón Principal) */}
          <div
            className="p-5 rounded-2xl border shadow-sm text-center"
            style={{
              backgroundColor: template.cardBg,
              borderColor: template.borderSoft,
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wider font-semibold opacity-70"
              style={{ color: template.accentColor }}
            >
              Recepción & Fiesta
            </p>
            <h4 className="text-sm font-semibold mt-1" style={{ color: template.textPrimary }}>
              {data.recepcionNombre}
            </h4>
            <p className="text-[11px] opacity-75 mt-0.5" style={{ color: template.textSecondary }}>
              {data.recepcionDireccion}
            </p>

            <a
              href={data.recepcionMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold border transition hover:opacity-90 active:scale-95 shadow-sm"
              style={{
                backgroundColor: template.buttonBg,
                borderColor: template.buttonBg,
                color: template.buttonText,
                fontFamily: template.fontSubheading,
              }}
            >
              <MapPin className="w-3.5 h-3.5" />
              Ver Dirección en Google Maps
            </a>
          </div>
        </section>

        {/* 8. Línea de Tiempo (Itinerario) */}
        <TimelineSection items={data.itinerarioJson} template={template} />

        {/* 9. Código de Vestimenta (Dress Code) */}
        <section className="px-6 py-6">
          <div
            className="p-6 rounded-3xl border shadow-sm text-center"
            style={{
              backgroundColor: template.cardBg,
              borderColor: template.borderSoft,
            }}
          >
            <span className="text-2xl">👗</span>
            <h3
              className="text-xs uppercase tracking-widest font-semibold mt-2"
              style={{
                color: template.textPrimary,
                fontFamily: template.fontSubheading,
              }}
            >
              Dress Code
            </h3>

            <p
              className="text-sm font-medium mt-1"
              style={{
                color: template.textPrimary,
                fontFamily: template.fontSubheading,
              }}
            >
              {data.dressCodeTitulo || "Elegante y Formal"}
            </p>

            <p className="text-[11px] opacity-75 mt-1 leading-relaxed" style={{ color: template.textSecondary }}>
              {data.dressCodeNota ||
                "Agradecemos vestir atuendo formal. Por favor reservar tonos blancos y pastel para los protagonistas."}
            </p>

            {/* Muestra de colores reservados */}
            {data.coloresReservados && data.coloresReservados.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-[10px] uppercase tracking-wider opacity-70">Reservados:</span>
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

        {/* 10. Mesa de Regalos / Lluvia de Sobres */}
        <section className="px-6 py-4">
          <div
            className="p-6 rounded-3xl border shadow-sm text-center"
            style={{
              backgroundColor: template.cardBg,
              borderColor: template.borderSoft,
            }}
          >
            <Gift className="w-6 h-6 mx-auto opacity-75" style={{ color: template.accentColor }} />
            <h3
              className="text-xs uppercase tracking-widest font-semibold mt-2"
              style={{
                color: template.textPrimary,
                fontFamily: template.fontSubheading,
              }}
            >
              {data.mesaRegalosJson?.titulo || "Lluvia de Sobres"}
            </h3>
            <p className="text-[11px] opacity-80 mt-1 leading-relaxed" style={{ color: template.textSecondary }}>
              {data.mesaRegalosJson?.mensaje ||
                "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, dispondremos de un cofre especial para sobres en la recepción."}
            </p>
            {data.mesaRegalosJson?.datosBancarios && (
              <div
                className="mt-3 p-3 rounded-xl text-xs font-mono select-all border"
                style={{
                  backgroundColor: template.bgColor,
                  borderColor: template.borderSoft,
                  color: template.textPrimary,
                }}
              >
                {data.mesaRegalosJson.datosBancarios}
              </div>
            )}
          </div>
        </section>

        {/* 11. Corte de Honor / Damitas & Chambelanes */}
        {data.corteHonorJson && (
          <section className="px-6 py-6">
            <div
              className="p-6 rounded-3xl border shadow-sm text-center"
              style={{
                backgroundColor: template.cardBg,
                borderColor: template.borderSoft,
              }}
            >
              <h3
                className="text-xs uppercase tracking-widest font-semibold"
                style={{
                  color: template.textPrimary,
                  fontFamily: template.fontSubheading,
                }}
              >
                Corte de Honor
              </h3>

              {data.corteHonorJson.chambelan && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Chambelán Principal</p>
                  <p className="text-xs font-semibold" style={{ color: template.textPrimary }}>
                    {data.corteHonorJson.chambelan}
                  </p>
                </div>
              )}

              {data.corteHonorJson.damas && data.corteHonorJson.damas.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Damas de Honor</p>
                  <p className="text-xs" style={{ color: template.textSecondary }}>
                    {data.corteHonorJson.damas.join(" • ")}
                  </p>
                </div>
              )}

              {data.corteHonorJson.padrinos && data.corteHonorJson.padrinos.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Agradecimiento Especial</p>
                  <p className="text-xs" style={{ color: template.textSecondary }}>
                    {data.corteHonorJson.padrinos.join(" • ")}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 12. Despedida y Agendar en Calendario */}
        <footer className="px-6 pt-6 pb-12 text-center">
          <Heart className="w-6 h-6 mx-auto mb-2 animate-pulse" style={{ color: template.accentColor }} />
          <h3
            className="text-4xl font-normal"
            style={{
              fontFamily: template.fontHeading,
              color: template.textPrimary,
            }}
          >
            See You Soon!
          </h3>
          <p
            className="text-[11px] tracking-widest uppercase opacity-70 mt-1 mb-6"
            style={{ fontFamily: template.fontSubheading }}
          >
            With Love and Gratitude, {data.titulo}
          </p>

          {/* Agendar en Google Calendar o Apple ICS */}
          <AddToCalendarButton
            titulo={`Celebración: ${data.titulo}`}
            descripcion={`Acompáñanos en la recepción de ${data.titulo} en ${data.recepcionNombre}.`}
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
