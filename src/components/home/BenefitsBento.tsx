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
          className={`flex flex-col items-center text-center gap-6 mb-16 transition-all duration-700 ease-out ${
            headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white font-['Montserrat'] text-[11px] tracking-[0.2em] uppercase text-[#720e26] font-bold">
            {isEs ? "Beneficios Exclusivos" : "Exclusive Guest Experience"}
          </span>
          <h2 className="font-['Cinzel',serif] text-4xl max-[479px]:text-3xl font-bold leading-[120%] m-0 text-[#090B10]">
            {isEs
              ? "Una solución completa para tu celebración"
              : "A complete solution for your celebration"}
          </h2>
          <div className="text-xl font-normal leading-[140%] text-[#090B10]/80 max-w-2xl">
            {isEs
              ? "Control de asistencia en tiempo real, pases familiares asignados y confirmación automática sin hojas de cálculo ni apps."
              : "Real-time attendance tracking, strict family pass control, and automatic SMS confirmations without messy spreadsheets."}
          </div>
        </div>

        {/* Bento Grid */}
        <div
          className="grid gap-6 max-[767px]:grid-cols-1"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto auto",
          }}
        >
          {/* Card 1 — Proven track (spans 2 rows, col 1) */}
          <div
            ref={card1Ref}
            id="w-node-card1"
            className={`bg-[#FFFFFF] border border-neutral-200 rounded-xl flex flex-col items-stretch gap-10 p-10 max-[991px]:p-6 max-[767px]:p-8 shadow-[0_2px_40px_rgba(142,142,148,0.08)] transition-all duration-700 ease-out ${
              card1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              gridRow: "1 / 3",
              gridColumn: "1 / 2",
              transitionDelay: "100ms",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home-real/quince-telefono-aerea.jpg"
              loading="lazy"
              alt={isEs ? "Control de pases familiares" : "Family pass roster"}
              className="object-cover rounded-xl flex-1 max-[767px]:max-h-[300px] border border-neutral-200"
            />
            <div className="flex flex-col items-center text-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#720e26]">
                {isEs ? "Capacidad Blindada" : "Capacity Control"}
              </span>
              <h3 className="font-['Cinzel',serif] text-2xl font-bold leading-[125%] m-0 text-[#090B10]">
                {isEs ? "Control de pases familiares" : "Strict family pass control"}
              </h3>
              <div className="text-sm text-[#090B10]/70 leading-relaxed font-['Montserrat']">
                {isEs
                  ? "Asigna cupos exactos por familia (ej. Familia Morales: 4 pases). Cero invitados sorpresa ni desajustes con el presupuesto del salón."
                  : "Allot exact seats per family (e.g. Morales Family: 4 passes). Zero uninvited plus-ones, zero catering budget surprises."}
              </div>
            </div>
          </div>

          {/* Card 2 — Professionals (row 1, cols 2-3, horizontal layout) */}
          <div
            ref={card2Ref}
            id="w-node-card2"
            className={`bg-[#FFFFFF] border border-neutral-200 rounded-xl flex flex-row max-[767px]:flex-col items-center max-[767px]:items-stretch gap-[80px] max-[991px]:gap-8 p-10 max-[991px]:px-8 max-[991px]:py-6 max-[767px]:p-8 shadow-[0_2px_40px_rgba(142,142,148,0.08)] transition-all duration-700 ease-out ${
              card2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              gridRow: "1 / 2",
              gridColumn: "2 / 4",
              transitionDelay: "200ms",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home-real/blue-butterfly-real.webp"
              loading="lazy"
              alt={isEs ? "RSVP instantáneo por SMS" : "Instant SMS RSVP"}
              className="object-cover rounded-xl w-[40%] max-w-[290px] h-full max-[767px]:w-full max-[767px]:mx-auto border border-neutral-200"
            />
            <div className="flex flex-col items-start max-[767px]:items-center max-[767px]:text-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#720e26]">
                {isEs ? "Apertura >98%" : "98% Open Rate"}
              </span>
              <h3 className="font-['Cinzel',serif] text-2xl font-bold leading-[125%] m-0 text-[#090B10]">
                {isEs ? "RSVP instantáneo por SMS" : "Instant 1-click SMS RSVP"}
              </h3>
              <div className="text-sm text-[#090B10]/70 leading-relaxed font-['Montserrat']">
                {isEs
                  ? "Sin aplicaciones que descargar ni usuarios que registrar. Tus invitados reciben su mensaje y confirman en segundos con recordatorio el día del evento."
                  : "No apps to download, no passwords. Guests receive automated SMS reminders and confirm in 1 tap with day-of navigation alerts."}
              </div>
            </div>
          </div>

          {/* Card 3 — Best tech stack (row 2, col 2) */}
          <div
            ref={card3Ref}
            id="w-node-card3"
            className={`bg-[#FFFFFF] border border-neutral-200 rounded-xl flex flex-col items-center gap-6 max-[991px]:gap-6 p-10 max-[991px]:p-6 max-[767px]:p-8 shadow-[0_2px_40px_rgba(142,142,148,0.08)] transition-all duration-700 ease-out ${
              card3Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              gridRow: "2 / 3",
              gridColumn: "2 / 3",
              transitionDelay: "300ms",
            }}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#720e26]">
                {isEs ? "Navegación GPS" : "Turn-by-turn"}
              </span>
              <h3 className="font-['Cinzel',serif] text-2xl font-bold leading-[125%] m-0 text-[#090B10]">
                {isEs ? "Llegada en Google Maps" : "Google Maps Arrival"}
              </h3>
              <div className="text-sm text-[#090B10]/70 leading-relaxed font-['Montserrat']">
                {isEs
                  ? "Ruta directa con 1 toque a la iglesia y al salón de recepción."
                  : "Direct 1-tap route straight to ceremony and reception parking."}
              </div>
            </div>
            <div className="w-full rounded-xl bg-[#FAF8F5] border border-neutral-200 p-4 flex items-center justify-center gap-3 text-xs font-semibold text-[#090B10]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isEs ? "Ruta GPS activa en el móvil" : "Live mobile GPS route"}</span>
            </div>
          </div>

          {/* Image 4 — USP3 photo (row 2, col 3) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={img4Ref}
            id="w-node-img4"
            src="/assets/home-real/elegant-rose-real.webp"
            loading="lazy"
            alt={isEs ? "Celebración de gala" : "Bespoke celebration"}
            className={`object-cover rounded-xl w-full h-full border border-neutral-200 transition-all duration-700 ease-out ${
              img4Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              gridRow: "2 / 3",
              gridColumn: "3 / 4",
              transitionDelay: "400ms",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default BenefitsBento;
