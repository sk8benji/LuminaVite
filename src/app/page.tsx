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
  Loader2,
} from "lucide-react";
import { Language, translations } from "@/lib/home-translations";
import InteractivePhoneMockup from "@/components/home/InteractivePhoneMockup";
import InteractiveDemoModal from "@/components/home/InteractiveDemoModal";
import RoiCalculator from "@/components/home/RoiCalculator";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("es");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeDemoSlug, setActiveDemoSlug] = useState("mariposas-xv");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const t = translations[lang];

  const handleOpenDemo = (slug: string = "mariposas-xv") => {
    setActiveDemoSlug(slug);
    setIsDemoModalOpen(true);
  };

  const handleCheckout = async (plan: "basic" | "signature" | "atelier") => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Hubo un error al iniciar la compra. Por favor intenta de nuevo.");
        setCheckoutLoading(null);
      }
    } catch (err) {
      console.error("Error en checkout:", err);
      alert("Error de conexión al procesar la compra.");
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1F1B] selection:bg-[#C5A059]/25 selection:text-[#2C1F1B] font-['Montserrat'] overflow-x-hidden relative">
      {/* ============================================================== */}
      {/* 1. SELECTOR FLOTANTE DE IDIOMA EN LA ESQUINA (ES 🇪🇸 / EN 🇺🇸) */}
      {/* ============================================================== */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 p-1 bg-white/95 border border-[#E8E3D9] rounded-full shadow-[0_10px_30px_rgba(44,31,27,0.12)] backdrop-blur-xl">
        <button
          onClick={() => setLang("es")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            lang === "es"
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] shadow-sm font-bold"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
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
              ? "bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] shadow-sm font-bold"
              : "text-[#5E534C] hover:text-[#2C1F1B]"
          }`}
          aria-label="Switch to English"
        >
          <span className="text-sm">🇺🇸</span>
          <span className="font-['Cinzel'] tracking-wider text-[11px]">EN</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* BARRA DE NAVEGACIÓN EDITORIAL LUMINOSA (PEARL ALABASTER) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logotipo Editorial Romano */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-['Cinzel'] font-bold flex items-center justify-center text-sm shadow-[0_2px_10px_rgba(197,160,89,0.3)] group-hover:rotate-12 transition-transform">
              ✦
            </span>
            <div className="flex flex-col">
              <span className="font-['Cinzel'] text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-[#2C1F1B]">
                Click & Love
              </span>
              <span className="text-[9px] font-['Montserrat'] tracking-[0.3em] uppercase text-[#8C8077] -mt-1 hidden sm:block font-medium">
                Haute Couture Stationery
              </span>
            </div>
          </Link>

          {/* Menú de Enlaces */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#colecciones"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#5E534C] hover:text-[#C5A059] transition font-semibold"
            >
              {t.nav.catalog}
            </a>
            <a
              href="#automatizacion"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#5E534C] hover:text-[#C5A059] transition font-semibold"
            >
              {lang === "es" ? "Tecnología" : "Technology"}
            </a>
            <a
              href="#calculadora"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#5E534C] hover:text-[#C5A059] transition font-semibold"
            >
              {lang === "es" ? "Aforo & Retorno" : "Calculator"}
            </a>
            <a
              href="#comparativa"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#5E534C] hover:text-[#C5A059] transition font-semibold"
            >
              {t.nav.compare}
            </a>
            <a
              href="#precios"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#5E534C] hover:text-[#C5A059] transition font-semibold"
            >
              {t.nav.pricing}
            </a>
          </nav>

          {/* Acciones de Cabecera */}
          <div className="flex items-center gap-3 pr-20 sm:pr-24">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-['Cinzel'] tracking-wider uppercase text-[#2C1F1B] hover:bg-white rounded-xl border border-[#E8E3D9] transition font-semibold"
            >
              {t.nav.dashboard}
            </Link>
            <Link
              href="/eventos/nuevo"
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#EED3A1] hover:brightness-105 text-[#2C1F1B] rounded-xl text-[11px] font-['Cinzel'] tracking-[0.15em] uppercase font-bold shadow-[0_4px_15px_rgba(197,160,89,0.3)] transition active:scale-95"
            >
              {t.nav.createBtn}
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION EN MODO CLARO DE LUJO */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Resplandores ambientales cálidos y naturales */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-[#C2847A]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Pill superior de exclusividad */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#2C1F1B] font-bold">
              {t.hero.pill}
            </span>
          </div>

          {/* Encabezado Principal en Cinzel (Chocolate Profundo) */}
          <h1 className="font-['Cinzel'] text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#2C1F1B] max-w-5xl leading-[1.15]">
            {t.hero.title1}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#9C7736] via-[#C5A059] to-[#2C1F1B] mt-2">
              {t.hero.title2}
            </span>
          </h1>

          {/* Subtítulo Técnico en Montserrat Café Tostado */}
          <p className="font-['Montserrat'] text-xs sm:text-base text-[#5E534C] max-w-3xl mt-6 leading-relaxed font-normal">
            {t.hero.subtitle}
          </p>

          {/* Los Dos CTAs de Impacto */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
            <a
              href="#colecciones"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-['Cinzel'] text-xs tracking-[0.25em] uppercase font-bold hover:brightness-105 active:scale-95 transition-all shadow-[0_8px_25px_rgba(197,160,89,0.35)] flex items-center justify-center gap-2"
            >
              <span>{t.hero.ctaCatalog}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleOpenDemo("mariposas-xv")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-[#C5A059]/60 hover:bg-[#F5EFE4] text-[#2C1F1B] font-['Cinzel'] text-xs tracking-[0.25em] uppercase font-bold transition-all shadow-[0_4px_15px_rgba(44,31,27,0.06)] flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059] group-hover:rotate-12 transition-transform" />
              <span>{t.hero.ctaDemo}</span>
            </button>
          </div>

          {/* Visual Central: Mockup Interactivo del Teléfono con Sobre y Confeti sobre fondo claro */}
          <div className="w-full mt-14">
            <InteractivePhoneMockup lang={lang} onOpenModal={handleOpenDemo} />
          </div>

          {/* Barra de Métricas & Confianza (Tarjetas Pearl Alabaster) */}
          <div className="w-full max-w-5xl mt-16 pt-8 border-t border-[#E8E3D9]">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-['Cinzel'] text-xs tracking-[0.2em] uppercase text-[#2C1F1B] font-semibold mb-8">
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
                  className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-[0_4px_20px_rgba(44,31,27,0.04)] text-center"
                >
                  <div className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#2C1F1B]">
                    {m.value}
                  </div>
                  <div className="font-['Montserrat'] text-[11px] text-[#5E534C] mt-1 font-medium">
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
      <section className="relative py-16 px-4 bg-[#F5EFE4] border-y border-[#E8E3D9] select-none">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-white border-2 border-[#C5A059]/40 shadow-[0_15px_45px_rgba(44,31,27,0.06)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-[#2C1F1B] font-bold">
                {t.interactiveDemoBanner.pill}
              </span>
            </div>

            <h3 className="font-['Cinzel'] text-2xl sm:text-4xl font-bold text-[#2C1F1B] tracking-tight mb-3">
              {t.interactiveDemoBanner.title}
            </h3>

            <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] leading-relaxed mb-6">
              {t.interactiveDemoBanner.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-['Montserrat'] text-[#2C1F1B] font-medium">
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
              onClick={() => handleOpenDemo("mariposas-xv")}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-['Cinzel'] text-xs tracking-[0.25em] uppercase font-bold hover:brightness-105 active:scale-95 transition shadow-[0_8px_25px_rgba(197,160,89,0.35)] flex items-center gap-3"
            >
              <Smartphone className="w-4 h-4 text-[#2C1F1B]" />
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-3 backdrop-blur-md">
            <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#2C1F1B] font-bold">
              {t.collections.pill}
            </span>
          </div>

          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
            {t.collections.title}
          </h2>

          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] leading-relaxed">
            {t.collections.subtitle}
          </p>
        </div>

        {/* Bento Grid con Bloques de Color Marfil Suave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.collections.items.map((item, idx) => (
            <div
              key={item.id}
              className="group relative rounded-3xl bg-white border border-[#E8E3D9] hover:border-[#C5A059] overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(44,31,27,0.06)] hover:shadow-[0_20px_40px_rgba(44,31,27,0.1)]"
            >
              {/* Imagen con Relieve Luminosa */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-['Cinzel'] uppercase tracking-wider bg-white/95 border border-[#E8E3D9] text-[#2C1F1B] backdrop-blur-md font-bold shadow-sm">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Contenido Editorial en Tonos Chocolate y Café */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Cinzel'] text-xl font-bold text-[#2C1F1B] mb-1">
                    {item.title}
                  </h3>
                  <div className="font-['Montserrat'] text-xs text-[#C5A059] mb-3 font-semibold">
                    {item.subtitle}
                  </div>
                  <p className="font-['Montserrat'] text-xs text-[#5E534C] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <ul className="space-y-2 mb-6 text-xs font-['Montserrat'] text-[#2C1F1B]">
                    {item.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E8E3D9]">
                  <button
                    onClick={() => handleOpenDemo(item.slug)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] font-['Cinzel'] text-[11px] tracking-wider uppercase font-bold hover:brightness-105 active:scale-95 transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>{t.collections.viewDemo}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`/demo/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#E8E3D9] text-[#5E534C] hover:text-[#2C1F1B] hover:bg-[#F5EFE4] transition"
                    title={lang === "es" ? "Abrir en nueva pestaña" : "Open in new tab"}
                  >
                    <ExternalLink className="w-4 h-4 text-[#8C8077]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón para ver el catálogo completo de 8+ demos */}
        <div className="mt-12 text-center">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-[#C5A059]/40 hover:border-[#C5A059] text-[#2C1F1B] font-['Cinzel'] text-xs tracking-[0.2em] uppercase font-bold shadow-[0_4px_15px_rgba(44,31,27,0.06)] hover:bg-[#F5EFE4] transition-all group"
          >
            <span>{lang === "es" ? "Explorar las 8+ Colecciones en el Catálogo Completo" : "Explore all 8+ Collections in Full Catalog"}</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. RESALTAR LA AUTOMATIZACIÓN TÉCNICA (3 PILARES LUMINOSOS) */}
      {/* ============================================================== */}
      <section id="automatizacion" className="relative py-24 px-4 bg-[#F5EFE4] select-none border-t border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 bg-white mb-3 backdrop-blur-md">
              <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#2C1F1B] font-bold">
                {t.techAutomation.pill}
              </span>
            </div>

            <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
              {t.techAutomation.title}
            </h2>

            <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] leading-relaxed">
              {t.techAutomation.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {t.techAutomation.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl bg-white border border-[#E8E3D9] p-8 flex flex-col justify-between hover:border-[#C5A059]/60 shadow-[0_10px_30px_rgba(44,31,27,0.05)] transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="w-12 h-12 rounded-2xl bg-[#F5EFE4] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-['Cinzel'] text-lg font-bold">
                      {idx === 0 ? "01" : idx === 1 ? "02" : "03"}
                    </span>
                    <span className="text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#2C1F1B] font-semibold bg-[#F5EFE4] border border-[#C5A059]/30 px-3 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-['Cinzel'] text-xl font-bold text-[#2C1F1B] mb-3 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#C5A059]/20 font-['Montserrat'] text-xs text-[#2C1F1B] flex items-start gap-2.5 font-medium">
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-3 backdrop-blur-md">
            <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#2C1F1B] font-bold">
              {t.comparison.pill}
            </span>
          </div>

          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
            {t.comparison.title}
          </h2>

          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] leading-relaxed">
            {t.comparison.subtitle}
          </p>
        </div>

        {/* Tabla Comparativa en Modo Claro de Lujo */}
        <div className="rounded-3xl bg-white border border-[#E8E3D9] overflow-hidden shadow-[0_15px_45px_rgba(44,31,27,0.06)]">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#F5EFE4] border-b border-[#E8E3D9] p-5 text-xs font-['Cinzel'] uppercase tracking-wider font-bold">
            <div className="md:col-span-4 text-[#2C1F1B]">
              {lang === "es" ? "Criterio Editorial & Técnico" : "Editorial & Technical Criteria"}
            </div>
            <div className="md:col-span-4 text-[#8C8077] mt-2 md:mt-0">
              {t.comparison.colCompetitors}
            </div>
            <div className="md:col-span-4 text-[#C5A059] font-bold mt-2 md:mt-0">
              {t.comparison.colClickAndLove}
            </div>
          </div>

          <div className="divide-y divide-[#E8E3D9]">
            {t.comparison.rows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="grid grid-cols-1 md:grid-cols-12 p-5 text-xs font-['Montserrat'] items-center hover:bg-[#FAF8F5] transition"
              >
                <div className="md:col-span-4 font-['Cinzel'] text-sm font-bold text-[#2C1F1B] mb-2 md:mb-0">
                  {row.feature}
                </div>
                <div className="md:col-span-4 text-[#8C8077] pr-4 line-through opacity-80 mb-2 md:mb-0">
                  ✕ {row.competitors}
                </div>
                <div className="md:col-span-4 text-[#2C1F1B] font-semibold flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{row.clickAndLove}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. SECCIÓN PRECIOS CLICK & LOVE (MODO CLARO DE LUJO) */}
      {/* ============================================================== */}
      <section id="precios" className="relative py-24 px-4 bg-[#FAF8F5] text-[#2C1F1B] overflow-hidden select-none border-t border-[#E8E3D9]">
        {/* Resplandores ambientales dorados suaves */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#C2847A]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* ENCABEZADO EDITORIAL */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-3 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#2C1F1B] font-bold">
              {t.pricing.pill}
            </span>
          </div>
          <h2 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B]">
            {t.pricing.title}
          </h2>
          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] mt-3 max-w-lg mx-auto leading-relaxed">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* CONTENEDOR DE TARJETAS (BENTO LUXURY GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* 1. PLAN DIGITAL BASIC ($49) */}
          <div className="relative rounded-3xl bg-white border border-[#E8E3D9] p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(44,31,27,0.05)] hover:border-[#C5A059]/50 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Cinzel'] text-xs tracking-[0.25em] uppercase text-[#8C8077] font-bold">
                  {t.pricing.plans[0].badge}
                </span>
                <span className="text-[10px] uppercase font-['Montserrat'] text-[#5E534C] bg-[#F5EFE4] px-2.5 py-1 rounded-full border border-[#E8E3D9] font-semibold">
                  {t.pricing.plans[0].typeTag}
                </span>
              </div>

              <h3 className="font-['Cinzel'] text-2xl font-bold text-[#2C1F1B] mb-2">
                {t.pricing.plans[0].name}
              </h3>
              <p className="font-['Montserrat'] text-xs text-[#5E534C] mb-6 leading-relaxed">
                {t.pricing.plans[0].description}
              </p>

              <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-[#E8E3D9]">
                <span className="font-['Cinzel'] text-5xl font-bold text-[#2C1F1B]">
                  {t.pricing.plans[0].price}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#8C8077] uppercase tracking-wider font-medium">
                  {t.pricing.plans[0].currency}
                </span>
              </div>

              <ul className="space-y-3.5 text-xs font-['Montserrat'] text-[#2C1F1B]">
                {t.pricing.plans[0].features.map((feat, fIdx) => (
                  <li
                    key={fIdx}
                    className={`flex items-center gap-3 ${
                      !feat.included ? "opacity-35 line-through text-[#8C8077]" : ""
                    }`}
                  >
                    {feat.included ? (
                      <span className="w-4 h-4 rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-[#E8E3D9] flex items-center justify-center text-[9px] text-[#8C8077]">
                        ✕
                      </span>
                    )}
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("basic")}
              disabled={checkoutLoading !== null}
              className="mt-8 w-full py-3.5 px-4 rounded-xl border border-[#2C1F1B] text-[#2C1F1B] font-['Cinzel'] text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-[#F5EFE4] active:scale-95 transition-all text-center flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {checkoutLoading === "basic" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                t.pricing.plans[0].cta
              )}
            </button>
          </div>

          {/* 2. PLAN SIGNATURE VIP ($89) - TARJETA DESTACADA EN ORO */}
          <div className="relative rounded-3xl bg-white border-2 border-[#C5A059] p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(197,160,89,0.25)] lg:-translate-y-4">
            {/* Cinta superior distintiva */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#9C7736] text-[#2C1F1B] font-['Cinzel'] text-[9px] font-bold tracking-[0.3em] uppercase py-1 px-5 rounded-full shadow-md">
              {t.pricing.recommended}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Cinzel'] text-xs tracking-[0.25em] uppercase text-[#C5A059] font-bold">
                  {t.pricing.plans[1].badge}
                </span>
                <span className="text-[10px] uppercase font-['Montserrat'] text-[#2C1F1B] bg-[#F5EFE4] border border-[#C5A059]/40 px-2.5 py-1 rounded-full font-bold">
                  {t.pricing.plans[1].typeTag}
                </span>
              </div>

              <h3 className="font-['Cinzel'] text-2xl font-bold text-[#2C1F1B] mb-2">
                {t.pricing.plans[1].name}
              </h3>
              <p className="font-['Montserrat'] text-xs text-[#5E534C] mb-6 leading-relaxed">
                {t.pricing.plans[1].description}
              </p>

              <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-[#C5A059]/30">
                <span className="font-['Cinzel'] text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9C7736] via-[#C5A059] to-[#2C1F1B]">
                  {t.pricing.plans[1].price}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#8C8077] uppercase tracking-wider font-medium">
                  {t.pricing.plans[1].currency}
                </span>
              </div>

              <ul className="space-y-3.5 text-xs font-['Montserrat'] text-[#2C1F1B]">
                {t.pricing.plans[1].features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span className={feat.isBold ? "font-bold text-[#2C1F1B]" : ""}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("signature")}
              disabled={checkoutLoading !== null}
              className="mt-8 w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-['Cinzel'] text-xs tracking-[0.25em] uppercase font-bold hover:brightness-105 active:scale-95 transition-all shadow-[0_5px_20px_rgba(197,160,89,0.35)] text-center flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {checkoutLoading === "signature" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#2C1F1B]" />
                  <span>Procesando Reserva...</span>
                </>
              ) : (
                t.pricing.plans[1].cta
              )}
            </button>
          </div>

          {/* 3. PLAN CONCIERGE ($149) */}
          <div className="relative rounded-3xl bg-white border border-[#E8E3D9] p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(44,31,27,0.05)] hover:border-[#C5A059]/50 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Cinzel'] text-xs tracking-[0.25em] uppercase text-[#8C8077] font-bold">
                  {t.pricing.plans[2].badge}
                </span>
                <span className="text-[10px] uppercase font-['Montserrat'] text-[#5E534C] bg-[#F5EFE4] px-2.5 py-1 rounded-full border border-[#E8E3D9] font-semibold">
                  {t.pricing.plans[2].typeTag}
                </span>
              </div>

              <h3 className="font-['Cinzel'] text-2xl font-bold text-[#2C1F1B] mb-2">
                {t.pricing.plans[2].name}
              </h3>
              <p className="font-['Montserrat'] text-xs text-[#5E534C] mb-6 leading-relaxed">
                {t.pricing.plans[2].description}
              </p>

              <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-[#E8E3D9]">
                <span className="font-['Cinzel'] text-5xl font-bold text-[#2C1F1B]">
                  {t.pricing.plans[2].price}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#8C8077] uppercase tracking-wider font-medium">
                  {t.pricing.plans[2].currency}
                </span>
              </div>

              <ul className="space-y-3.5 text-xs font-['Montserrat'] text-[#2C1F1B]">
                {t.pricing.plans[2].features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span className={feat.isBold ? "font-bold text-[#2C1F1B]" : ""}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("atelier")}
              disabled={checkoutLoading !== null}
              className="mt-8 w-full py-3.5 px-4 rounded-xl border border-[#2C1F1B] text-[#2C1F1B] font-['Cinzel'] text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-[#F5EFE4] active:scale-95 transition-all text-center flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {checkoutLoading === "atelier" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                t.pricing.plans[2].cta
              )}
            </button>
          </div>
        </div>

        {/* GARANTÍA Y FAQ RÁPIDO */}
        <div className="mt-16 text-center">
          <p className="font-['Montserrat'] text-xs text-[#8C8077]">
            {t.pricing.venueFaqText}
            <a
              href="https://wa.me/18181234567?text=Hola,%20me%20interesa%20conocer%20los%20paquetes%20por%20volumen%20de%20Click%20and%20Love"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A059] underline hover:text-[#AA8643] transition-colors ml-1 font-bold"
            >
              {t.pricing.venueFaqLink}
            </a>
            .
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. FOOTER EDITORIAL EN PEARL ALABASTER */}
      {/* ============================================================== */}
      <footer className="py-14 px-4 bg-[#F5EFE4] border-t border-[#E8E3D9] select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Marca */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#C5A059] text-white font-['Cinzel'] font-bold flex items-center justify-center text-xs shadow-sm">
                ✦
              </span>
              <span className="font-['Cinzel'] text-xl font-bold tracking-[0.2em] uppercase text-[#2C1F1B]">
                Click & Love
              </span>
            </div>
            <p className="font-['Montserrat'] text-xs text-[#5E534C] mt-2 max-w-sm">
              {t.footer.brandSubtitle}
            </p>
          </div>

          {/* Enlaces de Utilidad & Panel Administrativo */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-['Cinzel'] text-xs tracking-wider uppercase text-[#2C1F1B]">
            <Link href="/dashboard" className="text-[#C5A059] hover:text-[#AA8643] transition font-bold">
              {t.footer.adminLink}
            </Link>
            <a
              href="https://wa.me/18181234567"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C5A059] transition font-semibold"
            >
              {t.footer.whatsappSupport}
            </a>
          </div>

          {/* Selector de idioma & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 text-xs text-[#5E534C]">
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <button
                onClick={() => setLang("es")}
                className={`transition font-semibold ${lang === "es" ? "text-[#C5A059] font-bold" : "hover:text-[#2C1F1B]"}`}
              >
                Español (ES)
              </button>
              <span>•</span>
              <button
                onClick={() => setLang("en")}
                className={`transition font-semibold ${lang === "en" ? "text-[#C5A059] font-bold" : "hover:text-[#2C1F1B]"}`}
              >
                English (EN)
              </button>
            </div>
            <div className="font-['Montserrat'] text-[11px] text-[#8C8077]">
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
