"use client";

import * as React from "react";
import { Language } from "@/lib/home-translations";

export interface ValueFeaturesProps {
  lang?: Language;
}

export function ValueFeatures({ lang = "en" }: ValueFeaturesProps) {
  const isEs = lang === "es";
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = React.useState(false);
  const [gridVisible, setGridVisible] = React.useState(false);
  const [ctaHovered, setCtaHovered] = React.useState(false);

  React.useEffect(() => {
    const headingEl = headingRef.current;
    const gridEl = gridRef.current;

    const headingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeadingVisible(true);
      },
      { threshold: 0.1 }
    );
    const gridObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setGridVisible(true);
      },
      { threshold: 0.1 }
    );

    if (headingEl) headingObserver.observe(headingEl);
    if (gridEl) gridObserver.observe(gridEl);

    return () => {
      if (headingEl) headingObserver.unobserve(headingEl);
      if (gridEl) gridObserver.unobserve(gridEl);
    };
  }, []);

  const cards = [
    {
      src: "/assets/sobre-rosa/solapa.webp",
      alt: isEs ? "Sobre virtual 3D con sello" : "3D Virtual Envelope",
      tag: isEs ? "SOBRE 3D" : "3D UNBOXING",
      title: isEs ? "Apertura Virtual" : "Virtual Unboxing",
      subtitle: isEs ? "— Animación inmersiva con música y sello de cera." : "— Cinematic unboxing with custom waltz & wax seal.",
    },
    {
      src: "/assets/home-real/quince-telefono-aerea.jpg",
      alt: isEs ? "Control de pases familiares" : "Family pass allocation",
      tag: isEs ? "PASES" : "FAMILY PASS",
      title: isEs ? "Control de Mesa" : "Strict Allocation",
      subtitle: isEs ? "— Conteo exacto por familia sin invitados extra." : "— Allotted guest counts without surprise plus-ones.",
    },
    {
      src: "/assets/home-real/blue-butterfly-real.webp",
      alt: isEs ? "RSVP instantáneo por SMS" : "Instant SMS RSVP",
      tag: isEs ? "SMS REAL" : "INSTANT SMS",
      title: isEs ? "Tasa del 98%" : "98% Open Rate",
      subtitle: isEs ? "— Sin descargar aplicaciones ni recordar claves." : "— Instant 1-tap confirmation with no apps or logins.",
    },
    {
      src: "/assets/home-real/elegant-rose-real.webp",
      alt: isEs ? "Llegada en Google Maps" : "Google Maps venue arrival",
      tag: isEs ? "GOOGLE MAPS" : "GOOGLE MAPS",
      title: isEs ? "Ruta GPS" : "Turn-by-Turn",
      subtitle: isEs
        ? "— Ruta directa en 1 toque a la ceremonia religiosa y al salón del evento."
        : "Direct 1-tap GPS directions to church ceremony and reception venue.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAF8F5] text-[#090B10] py-[120px] max-[767px]:py-20 border-t border-b border-neutral-200"
    >
      {/* Global padding */}
      <div className="w-full px-8 max-[767px]:px-4">
        {/* Container large */}
        <div className="relative z-[2] w-full max-w-[1800px] mx-auto">
          {/* Master features */}
          <div className="flex flex-col gap-6 max-[767px]:gap-5">
            {/* Headline row */}
            <div className="flex flex-wrap justify-between items-end w-full gap-8 max-[767px]:gap-6">
              {/* Heading */}
              <div
                ref={headingRef}
                className={`transition-all duration-700 ease-out max-w-3xl ${
                  headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#720e26] mb-3">
                  {isEs ? "Experiencia de Gala" : "Bespoke Gala Experience"}
                </span>
                <h2
                  className="m-0 font-['Playfair_Display',serif] text-[#090B10] font-bold"
                  style={{
                    fontSize: "clamp(32px, 5.5vw, 68px)",
                    lineHeight: "1.12",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {isEs ? "Creado para Celebraciones Inolvidables" : "Crafted for Unforgettable Celebrations"}
                </h2>
                <p className="mt-3 text-sm md:text-base text-neutral-500 font-normal leading-relaxed font-['Montserrat',sans-serif]">
                  {isEs
                    ? "Cada invitación digital combina arte interactivo 3D con un control de invitados sin esfuerzo."
                    : "Every digital invitation combines interactive 3D craft with effortless guest management."}
                </p>
              </div>

              {/* CTA Tertiary */}
              <a
                href="#plantillas"
                className="flex items-center justify-center gap-1 relative no-underline font-['Montserrat',sans-serif] font-bold uppercase text-[#090B10] transition-colors duration-300 max-[767px]:text-sm cursor-pointer"
                style={{ fontSize: "15px", lineHeight: "20px", letterSpacing: "0.05em" }}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                <div className="flex-none flex items-center justify-center p-0 overflow-hidden pointer-events-none">
                  <div className="flex-none relative overflow-hidden" style={{ height: "20px" }}>
                    <div
                      className="relative z-[1] transition-transform duration-300 ease-out text-[#720e26]"
                      style={{
                        transform: ctaHovered ? "translateY(-100%)" : "translateY(0)",
                        textShadow: "0 1.5em 0 #720e26",
                      }}
                    >
                      {isEs ? "Explorar Colecciones" : "Explore Collections"}
                    </div>
                    {/* underline */}
                    <div className="absolute bottom-0 left-0 right-0 w-full h-px overflow-hidden">
                      <div className="w-full h-full bg-[#720e26]" />
                    </div>
                  </div>

                  {/* icon mask */}
                  <div className="overflow-hidden ml-1.5 flex-none" style={{ width: "16px", height: "16px" }}>
                    <div
                      className="transition-transform duration-300 ease-out text-[#720e26]"
                      style={{
                        width: "16px",
                        height: "16px",
                        transform: ctaHovered ? "translateY(-100%)" : "translateY(0)",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16L16 4M16 4H8M16 4V12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
                      </svg>
                    </div>
                    <div
                      className="transition-transform duration-300 ease-out text-[#720e26]"
                      style={{
                        width: "16px",
                        height: "16px",
                        transform: ctaHovered ? "translateY(-100%)" : "translateY(0)",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16L16 4H8M16 4V12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Divider */}
            <div className="w-full bg-neutral-200 h-px my-2" />

            {/* Bento Grid */}
            <div
              ref={gridRef}
              className={`grid grid-cols-4 gap-4 max-[767px]:grid-cols-2 max-[767px]:gap-3 transition-all duration-700 ease-out ${
                gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="relative w-full overflow-hidden text-white rounded-2xl border border-neutral-200/80 shadow-sm group"
                  style={{ height: "22rem", minHeight: "100%" }}
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    loading="lazy"
                    alt={card.alt}
                    className="absolute inset-0 z-[1] w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Dark overlay for readability - deeper gradient */}
                  <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                  {/* Content overlay */}
                  <div
                    className="absolute inset-0 z-[5] flex flex-col justify-between items-stretch max-[767px]:gap-4 p-5 max-[767px]:p-4"
                  >
                    {/* Tag - Unified translucent white pill */}
                    <div className="flex">
                      <div
                        className="flex items-center justify-center bg-white/90 text-neutral-900 border border-neutral-200 px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-[2px]"
                      >
                        <span
                          className="font-['Montserrat',sans-serif] font-bold uppercase text-[10px] tracking-[0.12em] text-[#090B10]"
                        >
                          {card.tag}
                        </span>
                      </div>
                    </div>

                    {/* Bottom tile */}
                    <div className="flex flex-col gap-1 w-full font-['Montserrat']">
                      <div className="font-['Playfair_Display',serif] font-bold text-lg text-white leading-tight">
                        {card.title}
                      </div>
                      <div className="text-white/90 text-xs leading-snug">
                        {card.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ValueFeatures;
