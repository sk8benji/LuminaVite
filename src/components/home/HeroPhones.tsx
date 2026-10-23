"use client";

import React from "react";
import { Play } from "lucide-react";

/**
 * Composición de 3 teléfonos del hero (réplica decorativa de las pantallas
 * reales del producto): RSVP · portada Elegant Rose (Isabella) · Party Plan.
 * El contenido de las pantallas reproduce la invitación demo real
 * (isabella-xv), por eso se muestra igual en ES y EN, como en el mockup.
 */

const ROSE_IMG = "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp";

function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-[#111111] rounded-[2.4rem] p-[7px] shadow-[0_24px_50px_rgba(122,0,42,0.28)] ring-1 ring-black/40 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-20 h-[14px] bg-[#111111] rounded-full z-20" />
      <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function RsvpScreen() {
  return (
    <div className="h-full w-full bg-gradient-to-b from-white to-[#FFF0F5] flex flex-col items-center px-4 pt-9 pb-4 text-center">
      <span className="font-vibes text-[26px] leading-none text-[#C2185B]">You&rsquo;re invited!</span>
      <span className="font-['Playfair_Display'] italic text-[19px] text-[#3C3C3C] mt-2">Please</span>
      <span className="font-['Cinzel'] font-bold text-[34px] tracking-wide text-[#7A002A] leading-none mt-0.5">RSVP</span>
      <span className="font-['Montserrat'] text-[8.5px] font-semibold tracking-[0.18em] text-[#8A8A8A] mt-2">
        ANTES DEL 20 DE JUNIO
      </span>
      <span className="font-['Montserrat'] font-extrabold text-[12.5px] text-[#2B0A18] leading-snug mt-3">
        ¿SERÁS PARTE DE MI CELEBRACIÓN?
      </span>
      <div className="w-full mt-3 rounded-lg border border-[#C9C9C9] bg-white px-2.5 py-2 text-left">
        <span className="font-['Montserrat'] text-[10px] text-[#9A9A9A]">Escribe tu nombre…</span>
      </div>
      <div className="w-full mt-2 rounded-lg bg-[#7A002A] py-2.5">
        <span className="font-['Montserrat'] font-extrabold text-[11px] tracking-[0.14em] text-white">
          CONFIRMAR RSVP
        </span>
      </div>
      <div className="w-full mt-2.5 rounded-lg bg-[#FFE3EE] border border-[#C2185B]/50 px-2.5 py-2">
        <span className="block font-['Montserrat'] font-bold text-[9.5px] text-[#7A002A]">
          ✓ Confirmation by text / SMS
        </span>
        <span className="block font-['Montserrat'] text-[9.5px] text-[#5A3C46]">
          on your phone in seconds
        </span>
      </div>
    </div>
  );
}

function CoverScreen() {
  return (
    <div className="h-full w-full bg-white flex flex-col">
      <div className="relative h-[54%] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ROSE_IMG} alt="" className="w-full h-full object-cover object-top" />
      </div>
      <div className="flex-1 flex flex-col items-center px-3 pt-2.5 text-center">
        <div className="flex items-baseline justify-center gap-1.5 w-full">
          <span className="font-['Montserrat'] font-semibold text-[7.5px] tracking-[0.14em] text-[#5A5A5A]">
            YOU ARE
          </span>
          <span className="font-vibes text-[19px] leading-none text-[#7A002A]">cordially</span>
          <span className="font-['Montserrat'] font-semibold text-[7.5px] tracking-[0.14em] text-[#5A5A5A]">
            INVITED TO
          </span>
        </div>
        <span className="font-['Cinzel'] text-[10px] tracking-[0.22em] text-[#3C3C3C] mt-1.5">
          THE QUINCEAÑERA OF
        </span>
        <span className="font-vibes text-[40px] leading-[1.05] text-[#7A002A]">Isabella</span>
        <div className="w-4/5 border-t border-[#C8A05A] relative mt-1">
          <span className="absolute left-1/2 -translate-x-1/2 -top-[3.5px] w-[7px] h-[7px] rounded-full bg-[#C2185B]" />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="font-['Montserrat'] text-[#464646] text-[10px]">◂|</span>
          <span className="w-6 h-6 rounded-full bg-[#7A002A] flex items-center justify-center">
            <Play className="w-3 h-3 text-white fill-white ml-[1px]" />
          </span>
          <span className="font-['Montserrat'] text-[#464646] text-[10px]">|▸</span>
        </div>
        <span className="font-['Montserrat'] font-semibold text-[7px] tracking-[0.12em] text-[#6E6E6E] mt-2">
          PHOTOGRAPH — ED SHEERAN · OFFICIAL SONG
        </span>
        <span className="font-['Montserrat'] font-extrabold text-[8px] tracking-[0.12em] text-[#7A002A] mt-1">
          SATURDAY · 4:00 PM · GRAND BALLROOM
        </span>
      </div>
    </div>
  );
}

function PlanScreen() {
  const items = [
    { time: "4:00 PM", label: "RECEPCIÓN", sub: "Grand Ballroom" },
    { time: "6:00 PM", label: "VALS", sub: "Waltz" },
    { time: "7:00 PM", label: "CENA", sub: "Dinner" },
    { time: "9:00 PM", label: "FIESTA", sub: "Party Time" },
  ];
  return (
    <div className="h-full w-full bg-white flex flex-col px-4 pt-8 pb-4">
      <span className="font-['Playfair_Display'] italic font-semibold text-[21px] text-[#7A002A] text-center">
        The Party Plan
      </span>
      <div className="border-t border-[#C8A05A] mx-3 mt-2" />
      <div className="relative mt-4 ml-2">
        <div className="absolute left-[5px] top-1 bottom-1 w-[2px] bg-[#DCAABF]" />
        <div className="space-y-3.5">
          {items.map((it) => (
            <div key={it.time} className="relative pl-5">
              <span className="absolute left-0 top-[3px] w-[11px] h-[11px] rounded-full bg-[#C2185B]" />
              <span className="block font-['Montserrat'] font-extrabold text-[11px] text-[#7A002A] leading-none">
                {it.time}
              </span>
              <span className="font-['Montserrat'] font-bold text-[11px] text-[#2B0A18]">{it.label}</span>
              <span className="font-['Montserrat'] text-[9.5px] text-[#7A7A7A]"> · {it.sub}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-[#FFF0F6] border border-[#DCAABF] px-2 py-2 text-center">
        <span className="block font-['Montserrat'] font-extrabold text-[8.5px] tracking-[0.2em] text-[#7A002A]">
          DRESS CODE
        </span>
        <span className="block font-['Playfair_Display'] italic text-[12px] text-[#2B0A18]">
          Formal &amp; Elegant Attire
        </span>
      </div>
      <div className="mt-auto flex items-end justify-between px-1">
        <div className="text-center">
          <span className="block font-vibes text-[22px] leading-none text-[#C2185B]">Mis XV</span>
          <span className="block font-vibes text-[17px] leading-none text-[#7A002A]">Isabella</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ROSE_IMG}
          alt=""
          className="w-11 h-11 rounded-full object-cover object-top ring-2 ring-[#C8A05A]"
        />
      </div>
    </div>
  );
}

export default function HeroPhones() {
  return (
    <div className="relative flex items-end justify-center select-none" aria-hidden="true">
      <div className="absolute inset-x-8 bottom-0 top-16 bg-gradient-to-tr from-[#FF5DA2]/25 via-[#FFE3EF] to-transparent rounded-full blur-3xl pointer-events-none" />
      {/* Izquierda: RSVP */}
      <PhoneFrame className="hidden sm:block w-[196px] lg:w-[218px] aspect-[9/17.5] -rotate-6 translate-y-3 -mr-7 z-0 shrink-0">
        <RsvpScreen />
      </PhoneFrame>
      {/* Centro: Portada Elegant Rose */}
      <PhoneFrame className="w-[228px] sm:w-[248px] lg:w-[272px] aspect-[9/17.5] z-10 shrink-0">
        <CoverScreen />
      </PhoneFrame>
      {/* Derecha: Party Plan */}
      <PhoneFrame className="hidden sm:block w-[196px] lg:w-[218px] aspect-[9/17.5] rotate-6 translate-y-3 -ml-7 z-0 shrink-0">
        <PlanScreen />
      </PhoneFrame>
    </div>
  );
}
