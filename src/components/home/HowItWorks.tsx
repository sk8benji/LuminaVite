"use client";

import * as React from "react";
import { Language } from "@/lib/home-translations";

export interface HowItWorksProps {
  lang?: Language;
}

// Iconos de linea (SVG inline, sin emojis): tarjeta, lapiz y avion de papel.
function IconCard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function IconPen() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4Z" />
    </svg>
  );
}

export function HowItWorks({ lang = "en" }: HowItWorksProps) {
  const isEs = lang === "es";
  const headingRef = React.useRef<HTMLDivElement>(null);
  const card1Ref = React.useRef<HTMLDivElement>(null);
  const card2Ref = React.useRef<HTMLDivElement>(null);
  const card3Ref = React.useRef<HTMLDivElement>(null);

  const [headingVisible, setHeadingVisible] = React.useState(false);
  const [card1Visible, setCard1Visible] = React.useState(false);
  const [card2Visible, setCard2Visible] = React.useState(false);
  const [card3Visible, setCard3Visible] = React.useState(false);

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
    ];
    return () => cleanups.forEach((c) => c());
  }, []);

  const steps = [
    {
      num: "01",
      icon: <IconCard />,
      title: isEs ? "Elige tu diseño y plan ($99–$279)" : "Pick your style & plan ($99–$279)",
      body: isEs
        ? "Elige tu diseño y tu paquete con un solo pago. Sin mensualidades ni sorpresas."
        : "Choose your design and package with a single payment. No monthly fees or surprises.",
      tag: isEs ? "Un solo pago" : "Single payment",
    },
    {
      num: "02",
      icon: <IconPen />,
      title: isEs ? "Manda tus datos y fotos" : "Send your details & photos",
      body: isEs
        ? "Comparte los datos de tu evento, los horarios del salón y tus fotos. Lo armamos y te mandamos una vista previa para que lo revises antes de compartirlo."
        : "Share your event info, venue times, and photos. We set it up and send you a preview so you can review before sharing.",
      tag: isEs ? "Vista previa antes de publicar" : "Preview before going live",
    },
    {
      num: "03",
      icon: <IconSend />,
      title: isEs ? "Mándala por SMS y sigue los RSVP" : "Send by SMS & track RSVPs",
      body: isEs
        ? "Tus invitados reciben el enlace en su teléfono, confirman con 1 toque, y tú ves el conteo exacto y los pases en tu panel."
        : "Your guests get the link on their phone, confirm in one tap, and you see exact headcounts and passes in your dashboard.",
      tag: isEs ? "Conteo en vivo y pases por familia" : "Live headcount & family passes",
    },
  ];

  const cards = [
    { ref: card1Ref, visible: card1Visible, delay: "100ms" },
    { ref: card2Ref, visible: card2Visible, delay: "200ms" },
    { ref: card3Ref, visible: card3Visible, delay: "300ms" },
  ];

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
            {isEs ? "Cómo funciona" : "How it works"}
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.2] m-0 text-neutral-900 tracking-tight max-w-3xl">
            {isEs ? (
              <>
                Simple{" "}
                <em className="text-[#B08D3C] italic">desde el primer día.</em>
              </>
            ) : (
              <>
                Simple{" "}
                <em className="text-[#B08D3C] italic">from day one.</em>
              </>
            )}
          </h2>
        </div>

        {/* Tres columnas */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.num}
              ref={cards[i].ref}
              className={`bg-[#FFFFFF] border border-neutral-200 rounded-xl flex flex-col items-start gap-5 p-8 max-[991px]:p-6 min-w-0 shadow-[0_2px_40px_rgba(142,142,148,0.08)] transition-all duration-700 ease-out ${
                cards[i].visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: cards[i].delay }}
            >
              <span className="font-['Playfair_Display',serif] text-5xl font-bold leading-none text-[#D4AF37]">
                {s.num}
              </span>
              <span className="w-11 h-11 rounded-full bg-[#FAF8F5] border border-neutral-200 flex items-center justify-center text-[#7A002A]">
                {s.icon}
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold leading-tight m-0 text-neutral-900">
                {s.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-['Montserrat'] m-0">
                {s.body}
              </p>
              <span className="mt-auto inline-flex items-center px-2.5 py-1 rounded-full border border-neutral-200 bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#720e26]">
                {s.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Cierre + CTA */}
        <div className="flex flex-col items-center text-center gap-6 mt-14">
          <p className="font-['Playfair_Display',serif] italic text-lg text-neutral-500 m-0 max-w-xl">
            {isEs
              ? "Tus invitados no descargan apps ni recuerdan contraseñas. Tocan, confirman y llegan."
              : "Your guests don't download apps or remember passwords. They tap, confirm, and show up."}
          </p>
          <a
            href={isEs ? "/es/precios" : "/pricing"}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#7A002A] hover:bg-[#5e0020] text-white text-sm font-bold tracking-wide transition shadow-sm"
          >
            {isEs ? "Empezar mi invitación" : "Start my invitation"}
          </a>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
