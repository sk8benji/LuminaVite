"use client";

import React, { useState } from "react";
import { Users, Clock, DollarSign, FileSpreadsheet, Sparkles, CheckCircle2 } from "lucide-react";
import { Language, translations } from "@/lib/home-translations";

interface RoiCalculatorProps {
  lang: Language;
}

export default function RoiCalculator({ lang }: RoiCalculatorProps) {
  const [guests, setGuests] = useState(150);
  const t = translations[lang].calculator;

  const hoursSaved = Math.round(guests * 0.22);
  const moneySaved = Math.round(guests * 3.5);
  const estimatedTables = Math.ceil(guests / 10);
  const confirmedAttendees = Math.round(guests * 0.96);

  return (
    <section className="relative py-20 px-4 bg-[#0E0D12] text-white overflow-hidden select-none border-t border-b border-white/5">
      {/* Resplandor ambiental sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Encabezado Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#EED3A1] font-semibold">
              {t.pill}
            </span>
          </div>

          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            {t.title}
          </h2>

          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#A89F91] max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Panel Interactivo de la Calculadora */}
        <div className="bg-[#141218]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Slider de Invitados */}
          <div className="mb-10 max-w-2xl mx-auto text-center">
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-['Cinzel'] text-sm tracking-wider uppercase text-[#EED3A1]">
                {t.guestsLabel}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-['Cinzel'] text-4xl sm:text-5xl font-bold text-white">
                  {guests}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#A89F91] uppercase">
                  {lang === "es" ? "Personas" : "Guests"}
                </span>
              </div>
            </div>

            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full h-2.5 bg-[#2B2733] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />

            <div className="flex justify-between text-[11px] font-['Montserrat'] text-[#8C8479] mt-2">
              <span>50 {lang === "es" ? "invitados" : "guests"}</span>
              <span>250 {lang === "es" ? "invitados" : "guests"}</span>
              <span>500 {lang === "es" ? "invitados" : "guests"}</span>
            </div>
          </div>

          {/* Grilla de Métricas en Tiempo Real */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* 1. Horas Ahorradas */}
            <div className="bg-[#1C1824]/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white mb-1">
                  ~{hoursSaved} hrs
                </div>
                <h4 className="font-['Cinzel'] text-xs uppercase tracking-wider text-[#EED3A1] font-semibold mb-2">
                  {t.stat1Label}
                </h4>
                <p className="font-['Montserrat'] text-xs text-[#A89F91] leading-relaxed">
                  {t.stat1Desc}
                </p>
              </div>
            </div>

            {/* 2. Dinero Ahorrado */}
            <div className="bg-[#1C1824]/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white mb-1">
                  ~${moneySaved} USD
                </div>
                <h4 className="font-['Cinzel'] text-xs uppercase tracking-wider text-[#EED3A1] font-semibold mb-2">
                  {t.stat2Label}
                </h4>
                <p className="font-['Montserrat'] text-xs text-[#A89F91] leading-relaxed">
                  {t.stat2Desc}
                </p>
              </div>
            </div>

            {/* 3. Tasa de Confirmación */}
            <div className="bg-[#1C1824]/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white mb-1">
                  ~{confirmedAttendees} {lang === "es" ? "pases" : "passes"}
                </div>
                <h4 className="font-['Cinzel'] text-xs uppercase tracking-wider text-[#EED3A1] font-semibold mb-2">
                  {t.stat3Label}
                </h4>
                <p className="font-['Montserrat'] text-xs text-[#A89F91] leading-relaxed">
                  {t.stat3Desc}
                </p>
              </div>
            </div>

            {/* 4. Excel en 1 Clic */}
            <div className="bg-[#1C1824]/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white mb-1">
                  {estimatedTables} {lang === "es" ? "Mesas" : "Tables"}
                </div>
                <h4 className="font-['Cinzel'] text-xs uppercase tracking-wider text-[#EED3A1] font-semibold mb-2">
                  {t.stat4Label}
                </h4>
                <p className="font-['Montserrat'] text-xs text-[#A89F91] leading-relaxed">
                  {t.stat4Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Banner inferior para Wedding Planners y Salones */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
              <p className="font-['Montserrat'] text-xs text-[#D4CFC7]">
                <strong className="text-white">{t.venuesNote}</strong>{" "}
                <span className="text-[#A89F91]">
                  {lang === "es"
                    ? "Ofrece invitaciones interactivas como servicio prémium sin esfuerzo adicional."
                    : "Offer interactive invitations as a premium turnkey service with zero overhead."}
                </span>
              </p>
            </div>

            <a
              href="https://wa.me/18181234567?text=Hola,%20me%20interesa%20conocer%20los%20paquetes%20para%20salones%20de%20Click%20and%20Love"
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Cinzel'] text-[11px] tracking-wider uppercase text-[#C5A059] hover:text-[#EED3A1] transition underline whitespace-nowrap font-bold"
            >
              {t.venuesLink} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
