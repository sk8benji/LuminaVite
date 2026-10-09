"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Smartphone,
  Zap,
  Music,
  Share2,
  Check,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  FileSpreadsheet,
  Calendar,
  Lock,
  Heart,
  Globe,
  Star,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { Language, translations } from "@/lib/home-translations";
import InteractivePhoneMockup from "@/components/home/InteractivePhoneMockup";
import InteractiveDemoModal from "@/components/home/InteractiveDemoModal";
import RoiCalculator from "@/components/home/RoiCalculator";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("es");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeDemoSlug, setActiveDemoSlug] = useState("maydelin-mendez");

  const t = translations[lang];

  const handleOpenDemo = (slug: string = "maydelin-mendez") => {
    setActiveDemoSlug(slug);
    setIsDemoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0A0D] text-white selection:bg-[#C5A059]/30 selection:text-white font-['Montserrat'] overflow-x-hidden relative">
      {/* ============================================================== */}
      {/* 1. SELECTOR FLOTANTE DE IDIOMA EN LA ESQUINA SUPERIOR DERECHA */}
      {/* ============================================================== */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 p-1 bg-[#141218]/90 border border-[#C5A059]/40 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <button
          onClick={() => setLang("es")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            lang === "es"
              ? "bg-[#C5A059] text-black shadow-md font-bold"
              : "text-[#A89F91] hover:text-white"
          }`}
          aria-label="Cambiar a Español"
        >
          <span className="text-sm">🇪🇸</span>
          <span className="font-['Cinzel'] tracking-wider text-[11px]">ES</span>
        </button>

        <button
          onClick={() => setLang("en")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            lang === "en"
              ? "bg-[#C5A059] text-black shadow-md font-bold"
              : "text-[#A89F91] hover:text-white"
          }`}
          aria-label="Switch to English"
        >
          <span className="text-sm">🇺🇸</span>
          <span className="font-['Cinzel'] tracking-wider text-[11px]">EN</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* BARRA DE NAVEGACIÓN PRINCIPAL EDITORIAL DE LUJO */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#0B0A0D]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logotipo Editorial Romano */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#EED3A1] text-black font-['Cinzel'] font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(197,160,89,0.4)] group-hover:rotate-12 transition-transform">
              ✦
            </span>
            <div className="flex flex-col">
              <span className="font-['Cinzel'] text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EED3A1] to-[#C5A059]">
                Click & Love
              </span>
              <span className="text-[9px] font-['Montserrat'] tracking-[0.3em] uppercase text-[#A89F91] -mt-1 hidden sm:block">
                Haute Couture Stationery
              </span>
            </div>
          </Link>

          {/* Menú de Enlaces */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#colecciones"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#D4CFC7] hover:text-[#C5A059] transition"
            >
              {t.nav.catalog}
            </a>
            <a
              href="#automatizacion"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#D4CFC7] hover:text-[#C5A059] transition"
            >
              {lang === "es" ? "Tecnología" : "Technology"}
            </a>
            <a
              href="#calculadora"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#D4CFC7] hover:text-[#C5A059] transition"
            >
              {lang === "es" ? "Aforo & Retorno" : "Calculator"}
            </a>
            <a
              href="#comparativa"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#D4CFC7] hover:text-[#C5A059] transition"
            >
              {t.nav.compare}
            </a>
            <a
              href="#precios"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#D4CFC7] hover:text-[#C5A059] transition"
            >
              {t.nav.pricing}
            </a>
          </nav>

          {/* Acciones de Cabecera */}
          <div className="flex items-center gap-3 pr-20 sm:pr-24">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-['Cinzel'] tracking-wider uppercase text-[#EED3A1] hover:bg-white/5 rounded-xl border border-white/10 transition"
            >
              {t.nav.dashboard}
            </Link>
            <Link
              href="/eventos/nuevo"
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#EED3A1] hover:brightness-110 text-black rounded-xl text-[11px] font-['Cinzel'] tracking-[0.15em] uppercase font-bold shadow-[0_0_20px_rgba(197,160,89,0.3)] transition active:scale-95"
            >
              {t.nav.createBtn}
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION CON MOCKUP INTERACTIVO 3D */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Luces de fondo arquitectónicas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-[#C5A059]/15 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-[#C2847A]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Pill superior de exclusividad */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#EED3A1] font-semibold">
              {t.hero.pill}
            </span>
          </div>

          {/* Encabezado Principal en Cinzel */}
          <h1 className="font-['Cinzel'] text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-5xl leading-[1.15]">
            {t.hero.title1}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0D0] via-[#EED3A1] to-[#C5A059] mt-2">
              {t.hero.title2}
            </span>
          </h1>

          {/* Subtítulo Técnico en Montserrat Limpio */}
          <p className="font-['Montserrat'] text-xs sm:text-base text-[#D4CFC7] max-w-3xl mt-6 leading-relaxed font-light">
            {t.hero.subtitle}
          </p>

          {/* Los Dos CTAs de Impacto */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
            <a
              href="#colecciones"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-black font-['Cinzel'] text-xs tracking-[0.25em] uppercase font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_5px_25px_rgba(197,160,89,0.35)] flex items-center justify-center gap-2"
            >
              <span>{t.hero.ctaCatalog}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleOpenDemo("maydelin-mendez")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-[#C5A059]/50 hover:bg-[#C5A059]/10 text-white font-['Cinzel'] text-xs tracking-[0.25em] uppercase font-bold transition-all shadow-sm flex items-center justify-center gap-2 group backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059] group-hover:rotate-12 transition-transform" />
              <span>{t.hero.ctaDemo}</span>
            </button>
          </div>

          {/* Visual Central: Mockup Interactivo del Teléfono con Sobre y Confeti */}
          <div className="w-full mt-14">
            <InteractivePhoneMockup lang={lang} onOpenModal={handleOpenDemo} />
          </div>

          {/* Barra de Métricas & Confianza */}
          <div className="w-full max-w-5xl mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-['Cinzel'] text-xs tracking-[0.2em] uppercase text-[#EED3A1]/90 mb-8">
              {t.hero.trustBar.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#C5A059]">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {t.hero.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#141218]/80 border border-white/5 backdrop-blur-sm text-center"
                >
                  <div className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#EED3A1]">
                    {m.value}
                  </div>
                  <div className="font-['Montserrat'] text-[11px] text-[#A89F91] mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SECCIÓN "INTERACTIVE DEMO" (PRUEBA EN VIVO EN 1 CLIC) */}
      {/* ============================================================== */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-[#141218] to-[#0E0D12] border-y border-white/10 select-none">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#1C1824] via-[#16131C] to-[#1C1824] border-2 border-[#C5A059]/40 shadow-[0_0_50px_rgba(197,160,89,0.15)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-[#EED3A1] font-semibold">
                {t.interactiveDemoBanner.pill}
              </span>
            </div>

            <h3 className="font-['Cinzel'] text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              {t.interactiveDemoBanner.title}
            </h3>

            <p className="font-['Montserrat'] text-xs sm:text-sm text-[#D4CFC7] leading-relaxed mb-6">
              {t.interactiveDemoBanner.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-['Montserrat'] text-[#EED3A1]">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#C5A059]" />
                {t.interactiveDemoBanner.feature1}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#C5A059]" />
                {t.interactiveDemoBanner.feature2}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#C5A059]" />
                {t.interactiveDemoBanner.feature3}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => handleOpenDemo("maydelin-mendez")}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-black font-['Cinzel'] text-xs tracking-[0.25em] uppercase font-bold hover:brightness-110 active:scale-95 transition shadow-[0_0_30px_rgba(197,160,89,0.4)] flex items-center gap-3"
            >
              <Smartphone className="w-4 h-4 text-black" />
              <span>{t.interactiveDemoBanner.ctaBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. GALERÍA DE COLECCIONES (BENTO LUXURY GRID) */}
      {/* ============================================================== */}
      <section id="colecciones" className="relative py-24 px-4 max-w-7xl mx-auto select-none">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 mb-3 backdrop-blur-md">
            <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#EED3A1] font-semibold">
              {t.collections.pill}
            </span>
          </div>

          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            {t.collections.title}
          </h2>

          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#A89F91] leading-relaxed">
            {t.collections.subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.collections.items.map((item, idx) => (
            <div
              key={item.id}
              className="group relative rounded-3xl bg-[#141218]/90 border border-white/10 hover:border-[#C5A059]/50 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl backdrop-blur-xl"
            >
              {/* Imagen con Relieve */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141218] via-transparent to-black/40" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-['Cinzel'] uppercase tracking-wider bg-black/60 border border-white/20 text-[#EED3A1] backdrop-blur-md font-semibold">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Contenido Editorial */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Cinzel'] text-xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <div className="font-['Montserrat'] text-xs text-[#C5A059] mb-3 font-medium">
                    {item.subtitle}
                  </div>
                  <p className="font-['Montserrat'] text-xs text-[#A89F91] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <ul className="space-y-2 mb-6 text-xs font-['Montserrat'] text-[#D4CFC7]">
                    {item.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleOpenDemo(item.slug)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-black font-['Cinzel'] text-[11px] tracking-wider uppercase font-bold hover:brightness-110 active:scale-95 transition shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{t.collections.viewDemo}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
                    title={lang === "es" ? "Abrir en nueva pestaña" : "Open in new tab"}
                  >
                    <ExternalLink className="w-4 h-4 text-[#A89F91]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. RESALTAR LA AUTOMATIZACIÓN TÉCNICA (3 PILARES) */}
      {/* ============================================================== */}
      <section id="automatizacion" className="relative py-24 px-4 bg-[#0E0D12] select-none border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 mb-3 backdrop-blur-md">
              <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#EED3A1] font-semibold">
                {t.techAutomation.pill}
              </span>
            </div>

            <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
              {t.techAutomation.title}
            </h2>

            <p className="font-['Montserrat'] text-xs sm:text-sm text-[#A89F91] leading-relaxed">
              {t.techAutomation.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {t.techAutomation.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl bg-[#141218]/90 border border-white/10 p-8 flex flex-col justify-between backdrop-blur-xl hover:border-[#C5A059]/40 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-['Cinzel'] text-lg font-bold">
                      {idx === 0 ? "01" : idx === 1 ? "02" : "03"}
                    </span>
                    <span className="text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#EED3A1] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-['Cinzel'] text-xl font-bold text-white mb-3 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="font-['Montserrat'] text-xs sm:text-sm text-[#A89F91] leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 font-['Montserrat'] text-xs text-[#EED3A1] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. CALCULADORA DE AFORO O RETORNO PARA SALONES & ORGANIZADORES */}
      {/* ============================================================== */}
      <div id="calculadora">
        <RoiCalculator lang={lang} />
      </div>

      {/* ============================================================== */}
      {/* 7. COMPARATIVA VISUAL (MÉTODO TRADICIONAL VS CLICK & LOVE) */}
      {/* ============================================================== */}
      <section id="comparativa" className="relative py-24 px-4 max-w-6xl mx-auto select-none">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 mb-3 backdrop-blur-md">
            <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#EED3A1] font-semibold">
              {t.comparison.pill}
            </span>
          </div>

          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            {t.comparison.title}
          </h2>

          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#A89F91] leading-relaxed">
            {t.comparison.subtitle}
          </p>
        </div>

        {/* Tabla Comparativa de Lujo */}
        <div className="rounded-3xl bg-[#141218]/90 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#1C1824] border-b border-white/10 p-5 text-xs font-['Cinzel'] uppercase tracking-wider font-semibold">
            <div className="md:col-span-4 text-[#A89F91]">
              {lang === "es" ? "Criterio Editorial & Técnico" : "Editorial & Technical Criteria"}
            </div>
            <div className="md:col-span-4 text-neutral-400 mt-2 md:mt-0">
              {t.comparison.colCompetitors}
            </div>
            <div className="md:col-span-4 text-[#EED3A1] font-bold mt-2 md:mt-0">
              {t.comparison.colClickAndLove}
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {t.comparison.rows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="grid grid-cols-1 md:grid-cols-12 p-5 text-xs font-['Montserrat'] items-center hover:bg-white/[0.02] transition"
              >
                <div className="md:col-span-4 font-['Cinzel'] text-sm font-semibold text-white mb-2 md:mb-0">
                  {row.feature}
                </div>
                <div className="md:col-span-4 text-[#8C8479] pr-4 line-through opacity-70 mb-2 md:mb-0">
                  ✕ {row.competitors}
                </div>
                <div className="md:col-span-4 text-white font-medium flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#C5A059] text-black flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-[#FBF9F5]">{row.clickAndLove}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. SECCIÓN PRECIOS CLICK & LOVE (DISEÑO EXACTO SOLICITADO) */}
      {/* ============================================================== */}
      <section id="precios" className="relative py-24 px-4 bg-[#0B0A0D] text-white overflow-hidden select-none">
        {/* Resplandores ambientales dorados de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#C2847A]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* ENCABEZADO EDITORIAL */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 mb-3 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#EED3A1] font-semibold">
              {t.pricing.pill}
            </span>
          </div>
          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t.pricing.title}
          </h2>
          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#A89F91] mt-3 max-w-lg mx-auto leading-relaxed">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* CONTENEDOR DE TARJETAS (BENTO LUXURY GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* 1. PLAN DIGITAL BASIC ($49) */}
          <div className="relative rounded-3xl bg-[#141218]/80 border border-white/10 p-8 flex flex-col justify-between backdrop-blur-xl hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Cinzel'] text-xs tracking-[0.25em] uppercase text-[#A89F91] font-semibold">
                  {t.pricing.plans[0].badge}
                </span>
                <span className="text-[10px] uppercase font-['Montserrat'] text-neutral-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  {t.pricing.plans[0].typeTag}
                </span>
              </div>

              <h3 className="font-['Cinzel'] text-2xl font-bold text-white mb-2">
                {t.pricing.plans[0].name}
              </h3>
              <p className="font-['Montserrat'] text-xs text-[#A89F91] mb-6 leading-relaxed">
                {t.pricing.plans[0].description}
              </p>

              <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
                <span className="font-['Cinzel'] text-5xl font-bold text-white">
                  {t.pricing.plans[0].price}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#A89F91] uppercase tracking-wider">
                  {t.pricing.plans[0].currency}
                </span>
              </div>

              <ul className="space-y-3.5 text-xs font-['Montserrat'] text-[#D4CFC7]">
                {t.pricing.plans[0].features.map((feat, fIdx) => (
                  <li
                    key={fIdx}
                    className={`flex items-center gap-3 ${
                      !feat.included ? "opacity-30 line-through" : ""
                    }`}
                  >
                    {feat.included ? (
                      <span className="w-4 h-4 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[9px]">
                        ✕
                      </span>
                    )}
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/eventos/nuevo?plan=basic"
              className="mt-8 w-full py-3.5 px-4 rounded-xl border border-white/20 text-white font-['Cinzel'] text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-white/10 active:scale-95 transition-all text-center block"
            >
              {t.pricing.plans[0].cta}
            </Link>
          </div>

          {/* 2. PLAN SIGNATURE VIP ($89) - TARJETA DESTACADA */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#1C181F] to-[#120F16] border-2 border-[#C5A059] p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(197,160,89,0.2)] backdrop-blur-2xl lg:-translate-y-4">
            {/* Cinta superior distintiva */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#9C7736] text-black font-['Cinzel'] text-[9px] font-bold tracking-[0.3em] uppercase py-1 px-5 rounded-full shadow-lg">
              {t.pricing.recommended}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Cinzel'] text-xs tracking-[0.25em] uppercase text-[#EED3A1] font-semibold">
                  {t.pricing.plans[1].badge}
                </span>
                <span className="text-[10px] uppercase font-['Montserrat'] text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 px-2.5 py-1 rounded-full font-medium">
                  {t.pricing.plans[1].typeTag}
                </span>
              </div>

              <h3 className="font-['Cinzel'] text-2xl font-bold text-white mb-2">
                {t.pricing.plans[1].name}
              </h3>
              <p className="font-['Montserrat'] text-xs text-[#D4CFC7] mb-6 leading-relaxed">
                {t.pricing.plans[1].description}
              </p>

              <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-[#C5A059]/20">
                <span className="font-['Cinzel'] text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0D0] via-[#EED3A1] to-[#C5A059]">
                  {t.pricing.plans[1].price}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#A89F91] uppercase tracking-wider">
                  {t.pricing.plans[1].currency}
                </span>
              </div>

              <ul className="space-y-3.5 text-xs font-['Montserrat'] text-white">
                {t.pricing.plans[1].features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-[#C5A059] text-black flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span className={feat.isBold ? "font-semibold" : ""}>{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/eventos/nuevo?plan=signature"
              className="mt-8 w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-black font-['Cinzel'] text-xs tracking-[0.25em] uppercase font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_5px_20px_rgba(197,160,89,0.35)] text-center block"
            >
              {t.pricing.plans[1].cta}
            </Link>
          </div>

          {/* 3. PLAN CONCIERGE ($149) */}
          <div className="relative rounded-3xl bg-[#141218]/80 border border-white/10 p-8 flex flex-col justify-between backdrop-blur-xl hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Cinzel'] text-xs tracking-[0.25em] uppercase text-[#A89F91] font-semibold">
                  {t.pricing.plans[2].badge}
                </span>
                <span className="text-[10px] uppercase font-['Montserrat'] text-neutral-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  {t.pricing.plans[2].typeTag}
                </span>
              </div>

              <h3 className="font-['Cinzel'] text-2xl font-bold text-white mb-2">
                {t.pricing.plans[2].name}
              </h3>
              <p className="font-['Montserrat'] text-xs text-[#A89F91] mb-6 leading-relaxed">
                {t.pricing.plans[2].description}
              </p>

              <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
                <span className="font-['Cinzel'] text-5xl font-bold text-white">
                  {t.pricing.plans[2].price}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#A89F91] uppercase tracking-wider">
                  {t.pricing.plans[2].currency}
                </span>
              </div>

              <ul className="space-y-3.5 text-xs font-['Montserrat'] text-[#D4CFC7]">
                {t.pricing.plans[2].features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span className={feat.isBold ? "font-semibold text-white" : ""}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/eventos/nuevo?plan=concierge"
              className="mt-8 w-full py-3.5 px-4 rounded-xl border border-white/20 text-white font-['Cinzel'] text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-white/10 active:scale-95 transition-all text-center block"
            >
              {t.pricing.plans[2].cta}
            </Link>
          </div>
        </div>

        {/* GARANTÍA Y FAQ RÁPIDO */}
        <div className="mt-16 text-center">
          <p className="font-['Montserrat'] text-xs text-[#8C8479]">
            {t.pricing.venueFaqText}
            <a
              href="https://wa.me/18181234567?text=Hola,%20me%20interesa%20conocer%20los%20paquetes%20por%20volumen%20de%20Click%20and%20Love"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A059] underline hover:text-[#EED3A1] transition-colors ml-1 font-semibold"
            >
              {t.pricing.venueFaqLink}
            </a>
            .
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. FOOTER EDITORIAL MONOCROMÁTICO DORADO */}
      {/* ============================================================== */}
      <footer className="py-14 px-4 bg-[#08070A] border-t border-white/10 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Marca */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#C5A059] text-black font-['Cinzel'] font-bold flex items-center justify-center text-xs">
                ✦
              </span>
              <span className="font-['Cinzel'] text-xl font-bold tracking-[0.2em] uppercase text-white">
                Click & Love
              </span>
            </div>
            <p className="font-['Montserrat'] text-xs text-[#8C8479] mt-2 max-w-sm">
              {t.footer.brandSubtitle}
            </p>
          </div>

          {/* Enlaces de Utilidad & Panel Administrativo */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-['Cinzel'] text-xs tracking-wider uppercase text-[#D4CFC7]">
            <Link href="/dashboard" className="text-[#C5A059] hover:text-[#EED3A1] transition font-bold">
              {t.footer.adminLink}
            </Link>
            <a
              href="https://wa.me/18181234567"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              {t.footer.whatsappSupport}
            </a>
          </div>

          {/* Selector de idioma & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 text-xs text-[#A89F91]">
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <button
                onClick={() => setLang("es")}
                className={`transition ${lang === "es" ? "text-[#C5A059] font-bold" : "hover:text-white"}`}
              >
                Español (ES)
              </button>
              <span>•</span>
              <button
                onClick={() => setLang("en")}
                className={`transition ${lang === "en" ? "text-[#C5A059] font-bold" : "hover:text-white"}`}
              >
                English (EN)
              </button>
            </div>
            <div className="font-['Montserrat'] text-[11px] text-[#5C554D]">
              © {new Date().getFullYear()} Click & Love. {t.footer.rights}
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* 10. MODAL INTERACTIVO DE DEMOSTRACIÓN EN VIVO */}
      {/* ============================================================== */}
      <InteractiveDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        initialSlug={activeDemoSlug}
        lang={lang}
      />
    </div>
  );
}
