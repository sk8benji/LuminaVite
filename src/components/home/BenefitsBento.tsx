"use client";

import * as React from "react";
import { Language } from "@/lib/home-translations";

export interface BenefitsBentoProps {
  lang?: Language;
}

export function BenefitsBento({ lang = "en" }: BenefitsBentoProps) {
  const isEs = lang === "es";
  const headingRef = React.useRef<HTMLDivElement>(null);
  const card1Ref = React.useRef<HTMLDivElement>(null);
  const card2Ref = React.useRef<HTMLDivElement>(null);
  const card3Ref = React.useRef<HTMLDivElement>(null);
  const img4Ref = React.useRef<HTMLImageElement>(null);

  const [headingVisible, setHeadingVisible] = React.useState(false);
  const [card1Visible, setCard1Visible] = React.useState(false);
  const [card2Visible, setCard2Visible] = React.useState(false);
  const [card3Visible, setCard3Visible] = React.useState(false);
  const [img4Visible, setImg4Visible] = React.useState(false);

  React.useEffect(() => {
    const makeObserver = (
      ref: React.RefObject<HTMLElement | null>,
      setter: (v: boolean) => void
    ) => {
      const el = ref.current;
      if (!el) return () => {};
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    };

    const cleanups = [
      makeObserver(headingRef, setHeadingVisible),
      makeObserver(card1Ref, setCard1Visible),
      makeObserver(card2Ref, setCard2Visible),
      makeObserver(card3Ref, setCard3Visible),
      makeObserver(img4Ref, setImg4Visible),
    ];
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section
      id="como-funciona"
      className="bg-[#FAF8F5] py-[120px] max-[479px]:py-[100px] text-[#090B10] font-['Montserrat',sans-serif] text-lg font-normal leading-[145%] scroll-mt-24"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 max-[479px]:px-4">
        {/* Heading Center */}
        <div
          ref={headingRef}
          className={`flex flex-col items-center text-center gap-4 mb-16 transition-all duration-700 ease-out ${
            headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white font-['Montserrat'] text-[11px] tracking-[0.2em] uppercase text-[#720e26] font-bold">
            {isEs ? "Beneficios Exclusivos" : "Exclusive Guest Experience"}
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.2] m-0 text-neutral-900 tracking-tight max-w-3xl">
            {isEs
              ? "Control Total de Invitados para tu Celebración"
              : "Complete Guest Control for Your Celebration"}
          </h2>
          <p className="text-sm md:text-base font-normal leading-relaxed text-neutral-600 max-w-2xl m-0 font-['Montserrat']">
            {isEs
              ? "Control de asistencia en tiempo real, pases familiares asignados y confirmación automática sin hojas de cálculo ni apps."
              : "Real-time attendance tracking, strict family pass control, and automatic SMS confirmations without messy spreadsheets."}
          </p>
        </div>

        {/* Bento Grid */}
        <div
          className="grid gap-6 grid-cols-1 md:grid-cols-3"
        >
          {/* Card 1 — Captura del Pase Familiar Digital (spans 2 rows, col 1) */}
          <div
            ref={card1Ref}
            id="w-node-card1"
            className={`bg-[#FFFFFF] border border-neutral-200 rounded-xl flex flex-col items-stretch gap-6 p-8 max-[991px]:p-6 md:row-span-2 min-w-0 shadow-[0_2px_40px_rgba(142,142,148,0.08)] transition-all duration-700 ease-out ${
              card1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "100ms",
            }}
          >
            {/* Mockup del Pase Familiar Digital */}
            <div className="rounded-xl border border-neutral-200 bg-[#FAF8F5] p-5 flex flex-col justify-between shadow-sm flex-1 min-h-[300px]">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#720e26]" />
                  <span className="text-[11px] font-bold tracking-wider text-neutral-800 uppercase font-['Montserrat']">
                    {isEs ? "Pase Digital Oficial" : "Official Digital Pass"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#720e26] bg-[#720e26]/10 px-2 py-0.5 rounded-full">
                  Mesa #7
                </span>
              </div>

              <div className="py-4 space-y-3 font-['Montserrat']">
                <div className="bg-white rounded-lg p-3.5 border border-neutral-200 shadow-sm">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                    {isEs ? "Familia Invitada" : "Invited Family"}
                  </span>
                  <p className="font-bold text-sm text-neutral-900">Familia Morales</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {isEs ? "4 lugares reservados asignados" : "4 allotted reserved seats"}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                    <span>{isEs ? "Estado:" : "RSVP:"}</span>
                  </div>
                  <span className="font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    {isEs ? "✓ 4 Confirmados" : "✓ 4 Attending"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 font-['Montserrat']">
                <span>{isEs ? "Cero invitados sorpresa" : "Zero surprise guests"}</span>
                <span className="font-bold text-neutral-800">QR #07-MOR</span>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#720e26]">
                {isEs ? "Capacidad Blindada" : "Capacity Control"}
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold leading-tight m-0 text-neutral-900">
                {isEs ? "Control de pases familiares" : "Strict Family Pass Control"}
              </h3>
              <div className="text-sm text-neutral-600 leading-relaxed font-['Montserrat']">
                {isEs
                  ? "Asigna cupos exactos por familia (ej. Familia Morales: 4 pases). Cero invitados sorpresa ni desajustes con el presupuesto del salón."
                  : "Allot exact seats per family (e.g. Morales Family: 4 passes). Zero uninvited plus-ones, zero catering budget surprises."}
              </div>
            </div>
          </div>

          {/* Card 2 — Captura Notificación SMS (row 1, cols 2-3, horizontal layout) */}
          <div
            ref={card2Ref}
            id="w-node-card2"
            className={`bg-[#FFFFFF] border border-neutral-200 rounded-xl flex flex-row max-[767px]:flex-col items-center max-[767px]:items-stretch gap-8 p-8 max-[991px]:p-6 md:col-span-2 min-w-0 shadow-[0_2px_40px_rgba(142,142,148,0.08)] transition-all duration-700 ease-out ${
              card2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "200ms",
            }}
          >
            {/* Mockup de Notificación SMS */}
            <div className="w-[44%] max-w-[320px] max-[767px]:w-full max-[767px]:mx-auto rounded-xl border border-neutral-200 bg-[#FAF8F5] p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-800">
                  <span>💬</span>
                  <span>SMS Notification</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">Now</span>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-3 shadow-sm text-xs font-['Montserrat'] text-neutral-800 space-y-2">
                <p className="font-semibold text-neutral-900 text-[11px]">
                  {isEs ? "Click & Love · Confirmación" : "Click & Love · Event Update"}
                </p>
                <p className="text-[11px] text-neutral-600 leading-snug">
                  {isEs
                    ? "¡Hola Familia Ramos! Confirmamos sus 3 pases para la Quinceañera. Mesa #7 reservada. Pulsa aquí para ver tu pase y ruta:"
                    : "Hi Ramos Family! 3 passes confirmed for Isabella's Quince. Table #7 reserved. Tap below for your pass & route:"}
                </p>
                <div className="inline-block px-3 py-1 rounded-md bg-[#720e26] text-white text-[10px] font-bold shadow-xs">
                  {isEs ? "Confirmar Asistencia →" : "Confirm Attendance →"}
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] text-neutral-500 font-semibold font-['Montserrat']">
                <span>✓ Delivered</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  98.4% Open Rate
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start max-[767px]:items-center max-[767px]:text-center gap-2.5 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#720e26]">
                {isEs ? "Apertura >98%" : "98% Open Rate"}
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold leading-tight m-0 text-neutral-900">
                {isEs ? "RSVP instantáneo por SMS" : "Instant 1-Click SMS RSVP"}
              </h3>
              <div className="text-sm text-neutral-600 leading-relaxed font-['Montserrat']">
                {isEs
                  ? "Sin aplicaciones que descargar ni usuarios que registrar. Tus invitados reciben su mensaje y confirman en segundos con recordatorio el día del evento."
                  : "No apps to download, no passwords. Guests receive automated SMS reminders and confirm in 1 tap with day-of navigation alerts."}
              </div>
            </div>
          </div>

          {/* Card 3 — Mockup de Google Maps Navegación (row 2, col 2) */}
          <div
            ref={card3Ref}
            id="w-node-card3"
            className={`bg-[#FFFFFF] border border-neutral-200 rounded-xl flex flex-col items-center gap-5 p-7 max-[991px]:p-6 min-w-0 shadow-[0_2px_40px_rgba(142,142,148,0.08)] transition-all duration-700 ease-out ${
              card3Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "300ms",
            }}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#720e26]">
                {isEs ? "Navegación GPS" : "Turn-by-turn"}
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold leading-tight m-0 text-neutral-900">
                {isEs ? "Llegada en Google Maps" : "Google Maps Arrival"}
              </h3>
              <div className="text-sm text-neutral-600 leading-relaxed font-['Montserrat']">
                {isEs
                  ? "Ruta directa con 1 toque a la iglesia y al salón de recepción."
                  : "Direct 1-tap route straight to ceremony and reception parking."}
              </div>
            </div>

            {/* Mockup sutil de interfaz de mapa y navegación */}
            <div className="w-full rounded-xl border border-neutral-200 bg-[#FAF8F5] p-3 flex flex-col gap-2 font-['Montserrat'] shadow-inner">
              <div className="bg-white rounded-lg p-2.5 border border-neutral-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-bold text-neutral-900 text-[11px]">
                    {isEs ? "Ruta Activa en Google Maps" : "Live Google Maps Route"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  14 min · 6.2 mi
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white rounded-lg p-2 border border-neutral-200 flex items-center gap-1.5">
                  <span>⛪</span>
                  <span className="font-semibold text-neutral-800 truncate">{isEs ? "Misa" : "Ceremony"}</span>
                </div>
                <div className="bg-white rounded-lg p-2 border border-neutral-200 flex items-center gap-1.5">
                  <span>🏰</span>
                  <span className="font-semibold text-neutral-800 truncate">{isEs ? "Recepción" : "Reception"}</span>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-lg bg-[#0F9D58] hover:bg-[#0B8043] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <span>📍</span>
                <span>{isEs ? "Abrir en Google Maps" : "Open in Google Maps"}</span>
              </a>
            </div>
          </div>

          {/* Image 4 — Foto de celebración real de gala (row 2, col 3) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={img4Ref}
            id="w-node-img4"
            src="/assets/home-real/elegant-rose-real.webp"
            loading="lazy"
            alt={isEs ? "Celebración de gala" : "Bespoke celebration"}
            className={`object-cover rounded-xl w-full h-full max-[767px]:h-auto border border-neutral-200 transition-all duration-700 ease-out ${
              img4Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "400ms",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default BenefitsBento;
