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
  CreditCard,
  Loader2,
  MessageCircle,
  Send,
  QrCode,
  AlertCircle,
  PhoneCall,
  Clock,
} from "lucide-react";
import { Language, translations } from "@/lib/home-translations";
import InteractivePhoneMockup from "@/components/home/InteractivePhoneMockup";
import InteractiveDemoModal from "@/components/home/InteractiveDemoModal";
import RoiCalculator from "@/components/home/RoiCalculator";
import FloatingWhatsApp from "@/components/home/FloatingWhatsApp";

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

  const handleCheckout = async (plan: "assisted" | "vip" | "basic" | "signature" | "atelier" | string) => {
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
      {/* 0. ANNOUNCEMENT BAR SUPERIOR: VENTAJA LOCAL LOS ÁNGELES */}
      {/* ============================================================== */}
      <div className="bg-stone-900 text-stone-100 py-2 px-4 text-xs font-medium text-center tracking-wide border-b border-stone-800 flex items-center justify-center gap-2 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EED3A1] animate-pulse" />
        <span>{t.announcementBar}</span>
      </div>

      {/* ============================================================== */}
      {/* BARRA DE NAVEGACIÓN EDITORIAL LUMINOSA (PEARL ALABASTER) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logotipo Editorial Solo Emblema */}
          <Link href="/" className="flex items-center group" aria-label="Click and love">
            <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-['Cinzel'] font-bold flex items-center justify-center text-base shadow-[0_2px_12px_rgba(197,160,89,0.35)] group-hover:scale-105 group-hover:rotate-12 transition-all duration-300 ring-2 ring-[#C5A059]/25 border border-white">
              ✦
            </span>
          </Link>

          {/* Menú de Enlaces */}
          <nav className="hidden md:flex items-center gap-7">
            <a
              href="#colecciones"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#2B2B2B] hover:text-[#C5A059] transition font-semibold"
            >
              {t.nav.catalog}
            </a>
            <a
              href="#automatizacion"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#2B2B2B] hover:text-[#C5A059] transition font-semibold"
            >
              {t.nav.features}
            </a>
            <a
              href="#calculadora"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#2B2B2B] hover:text-[#C5A059] transition font-semibold"
            >
              {lang === "es" ? "Calculadora" : "Calculator"}
            </a>
            <a
              href="#comparativa"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#2B2B2B] hover:text-[#C5A059] transition font-semibold"
            >
              {t.nav.compare}
            </a>
            <a
              href="#testimonios"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#2B2B2B] hover:text-[#C5A059] transition font-semibold"
            >
              {lang === "es" ? "Testimonios" : "Reviews"}
            </a>
            <a
              href="#precios"
              className="text-xs font-['Cinzel'] tracking-widest uppercase text-[#2B2B2B] hover:text-[#C5A059] transition font-semibold"
            >
              {t.nav.pricing}
            </a>
          </nav>

          {/* Selector de Idioma Simple (ES | EN) y Acción Principal Directa */}
          <div className="flex items-center gap-3.5">
            {/* Selector de Idioma Minimalista de Texto Simple */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#5A4D45] tracking-widest font-['Cinzel'] border-r border-[#E8E3D9] pr-3 mr-0.5">
              <button
                onClick={() => setLang("es")}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === "es"
                    ? "font-bold text-[#2C1F1B] border-b-2 border-[#C5A059]"
                    : "text-[#8C7E74] hover:text-[#2C1F1B]"
                }`}
                aria-label="Cambiar a Español"
              >
                ES
              </button>
              <span className="text-[#C5A059]/40 select-none">|</span>
              <button
                onClick={() => setLang("en")}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === "en"
                    ? "font-bold text-[#2C1F1B] border-b-2 border-[#C5A059]"
                    : "text-[#8C7E74] hover:text-[#2C1F1B]"
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>

            <a
              href="#precios"
              className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] hover:brightness-105 text-[#2C1F1B] rounded-full text-xs font-['Cinzel'] tracking-[0.2em] uppercase font-bold shadow-[0_4px_18px_rgba(197,160,89,0.35)] hover:shadow-[0_6px_22px_rgba(197,160,89,0.5)] transition-all duration-300 active:scale-95 flex items-center gap-2 border border-[#EED3A1]/70"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2C1F1B] animate-pulse" />
              <span>{t.nav.createBtn}</span>
            </a>
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
          {/* Pill superior de exclusividad con alto contraste */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8C5F2B]/40 bg-white shadow-xs mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#8C5F2B] animate-pulse" />
            <span className="font-['Cinzel'] text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#3A220C] font-extrabold">
              {t.hero.pill}
            </span>
          </div>

          {/* Encabezado Principal en Cormorant Garamond / Playfair Display de Alto Peso */}
          <h1 className="font-serif-roman text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C1F1B] max-w-5xl leading-[1.2]">
            {t.hero.title1}{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#5A330E] via-[#7B4916] to-[#361E0A] mt-2 drop-shadow-xs font-serif-roman">
              {t.hero.title2}
            </span>
          </h1>

          {/* Subtítulo enfocado en dolor y beneficios en Alto Contraste */}
          <p className="font-['Montserrat'] text-sm sm:text-base text-[#2B2B2B] max-w-3xl mt-6 leading-relaxed font-medium">
            {t.hero.subtitle}
          </p>

          {/* Botones de Acción (CTAs): Jerarquía CRO Invertida */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl">
            {/* Botón Principal: Conversión Directa (Crear mi Invitación) */}
            <a
              href="#precios"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-['Cinzel'] text-xs sm:text-sm tracking-[0.15em] uppercase font-bold hover:brightness-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(197,160,89,0.4)] hover:shadow-[0_12px_40px_rgba(197,160,89,0.55)] flex items-center justify-center gap-2.5 border border-[#EED3A1] group"
            >
              <Sparkles className="w-4 h-4 text-[#2C1F1B] animate-pulse" />
              <span>{t.hero.ctaCreate}</span>
              <ArrowRight className="w-4 h-4 text-[#2C1F1B] group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Enlace Secundario: Exploración de Ejemplo en Vivo con Icono de Flecha */}
            <button
              onClick={() => handleOpenDemo("mariposas-xv")}
              className="w-full sm:w-auto px-6 py-3.5 text-[#2C1F1B] hover:text-[#8C6D2D] font-['Cinzel'] text-xs sm:text-sm tracking-[0.15em] uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span className="underline decoration-[#C5A059] decoration-2 underline-offset-4">{t.hero.ctaDemo}</span>
              <ExternalLink className="w-4 h-4 text-[#C5A059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Fila Multicanal (Envío por cualquier medio con paleta sobria y hover de acento) */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="font-['Montserrat'] text-xs font-semibold text-[#574B43]">
              {t.hero.multiChannelTitle}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <div className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E8E3D9] text-[#4A3D36] text-xs font-['Montserrat'] font-semibold shadow-xs hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-900 transition-all duration-200">
                <MessageCircle className="w-3.5 h-3.5 text-[#8C7A6B] group-hover:text-emerald-600 transition-colors" />
                <span>{t.hero.channels[0]}</span>
              </div>
              <div className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E8E3D9] text-[#4A3D36] text-xs font-['Montserrat'] font-semibold shadow-xs hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-900 transition-all duration-200">
                <Smartphone className="w-3.5 h-3.5 text-[#8C7A6B] group-hover:text-blue-600 transition-colors" />
                <span>{t.hero.channels[1]}</span>
              </div>
              <div className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E8E3D9] text-[#4A3D36] text-xs font-['Montserrat'] font-semibold shadow-xs hover:border-pink-300 hover:bg-pink-50/60 hover:text-pink-900 transition-all duration-200">
                <Send className="w-3.5 h-3.5 text-[#8C7A6B] group-hover:text-pink-600 transition-colors" />
                <span>{t.hero.channels[2]}</span>
              </div>
              <div className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E8E3D9] text-[#4A3D36] text-xs font-['Montserrat'] font-semibold shadow-xs hover:border-amber-400 hover:bg-amber-50/60 hover:text-amber-900 transition-all duration-200">
                <QrCode className="w-3.5 h-3.5 text-[#8C7A6B] group-hover:text-amber-700 transition-colors" />
                <span>{t.hero.channels[3]}</span>
              </div>
            </div>
          </div>

          {/* Visual Central: Mockup Interactivo del Teléfono con Sobre y Confeti sobre fondo claro */}
          <div className="w-full mt-10">
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
                  <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-[#2C1F1B] tracking-tight">
                    {m.value}
                  </div>
                  <div className="font-['Montserrat'] text-[11px] text-[#374151] mt-1 font-semibold">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2.5 SECCIÓN DE AGITACIÓN (EL COSTO DEL MÉTODO TRADICIONAL - FÓRMULA PAS) */}
      {/* ============================================================== */}
      <section className="relative py-20 px-4 bg-[#FAF8F5] border-t border-[#E8E3D9] select-none">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50 mb-3 backdrop-blur-md">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              <span className="font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase text-red-900 font-bold">
                {t.agitation.pill}
              </span>
            </div>

            <h2 className="font-serif-roman text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
              {t.agitation.title}
            </h2>

            <p className="font-['Montserrat'] text-sm sm:text-base text-[#374151] max-w-2xl mx-auto leading-relaxed">
              {t.agitation.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Dinero perdido en el banquete */}
            <div className="relative rounded-3xl bg-white border border-red-200/80 p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(239,68,68,0.06)] hover:border-red-300 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif-roman text-xl sm:text-2xl font-bold text-[#1F2937] mb-3 leading-snug">
                  {t.agitation.cards[0].title}
                </h3>
                <p className="font-['Montserrat'] text-xs sm:text-sm text-[#374151] leading-relaxed font-normal">
                  {t.agitation.cards[0].text}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-red-100 flex items-center gap-2 text-[11px] font-['Montserrat'] font-bold text-red-700">
                <span>✕ Desperdicio de presupuesto en platos vacíos</span>
              </div>
            </div>

            {/* Card 2: Semanas perdiendo tiempo */}
            <div className="relative rounded-3xl bg-white border border-amber-200/80 p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(245,158,11,0.06)] hover:border-amber-300 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-serif-roman text-xl sm:text-2xl font-bold text-[#1F2937] mb-3 leading-snug">
                  {t.agitation.cards[1].title}
                </h3>
                <p className="font-['Montserrat'] text-xs sm:text-sm text-[#374151] leading-relaxed font-normal">
                  {t.agitation.cards[1].text}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-100 flex items-center gap-2 text-[11px] font-['Montserrat'] font-bold text-amber-800">
                <span>✕ Semanas agotadoras llamando a invitados</span>
              </div>
            </div>

            {/* Card 3: Cambios de última hora imposibles */}
            <div className="relative rounded-3xl bg-white border border-[#E8E3D9] p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(44,31,27,0.05)] hover:border-[#C5A059]/60 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5EFE4] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="font-serif-roman text-xl sm:text-2xl font-bold text-[#1F2937] mb-3 leading-snug">
                  {t.agitation.cards[2].title}
                </h3>
                <p className="font-['Montserrat'] text-xs sm:text-sm text-[#374151] leading-relaxed font-normal">
                  {t.agitation.cards[2].text}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8E3D9] flex items-center gap-2 text-[11px] font-['Montserrat'] font-bold text-[#4B5563]">
                <span>✕ Papel obsoleto si cambia hora o salón</span>
              </div>
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

            <h3 className="font-serif-roman text-2xl sm:text-4xl font-bold text-[#2C1F1B] tracking-tight mb-3">
              {t.interactiveDemoBanner.title}
            </h3>

            <p className="font-['Montserrat'] text-xs sm:text-sm text-[#2B2B2B] leading-relaxed mb-6 font-normal">
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

          <h2 className="font-serif-roman text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
            {t.collections.title}
          </h2>

          <p className="font-['Montserrat'] text-sm text-[#2B2B2B] leading-relaxed">
            {t.collections.subtitle}
          </p>
        </div>

        {/* Bento Grid con Bloques de Color Marfil Suave y Elementos Interactivos Reales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.collections.items.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative rounded-3xl bg-white border ${
                idx === 1
                  ? "border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-[0_15px_40px_rgba(197,160,89,0.2)]"
                  : "border-[#E8E3D9] hover:border-[#C5A059] shadow-[0_10px_30px_rgba(44,31,27,0.06)]"
              } overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(44,31,27,0.1)]`}
            >
              {/* Imagen con Relieve Luminosa */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-['Cinzel'] uppercase tracking-wider bg-white/95 border border-[#E8E3D9] text-[#2C1F1B] backdrop-blur-md font-bold shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Si es la tarjeta del medio (Bento Luxury), mostrar badge interactivo de música y cuenta regresiva */}
                {idx === 1 && (
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C5A059]/40 shadow-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-['Montserrat'] font-bold text-[#2C1F1B]">
                      <span className="flex items-center gap-1.5 text-[#C5A059]">
                        <Music className="w-3.5 h-3.5 animate-bounce" />
                        <span>Música de Fondo Activa</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#F5EFE4] text-[9px] uppercase tracking-wider text-[#2C1F1B]">
                        En Vivo
                      </span>
                    </div>
                    {/* Contador regresivo animado real en la tarjeta */}
                    <div className="grid grid-cols-3 gap-1 text-center font-['Montserrat']">
                      <div className="bg-[#FAF8F5] py-1 rounded border border-[#E8E3D9]">
                        <span className="block text-xs font-bold text-[#2C1F1B]">142</span>
                        <span className="text-[8px] text-[#2B2B2B] uppercase">Días</span>
                      </div>
                      <div className="bg-[#FAF8F5] py-1 rounded border border-[#E8E3D9]">
                        <span className="block text-xs font-bold text-[#2C1F1B]">18</span>
                        <span className="text-[8px] text-[#2B2B2B] uppercase">Horas</span>
                      </div>
                      <div className="bg-[#FAF8F5] py-1 rounded border border-[#E8E3D9]">
                        <span className="block text-xs font-bold text-[#2C1F1B]">35</span>
                        <span className="text-[8px] text-[#2B2B2B] uppercase">Min</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contenido Editorial en Tonos Chocolate y Café con tipografía robusta */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-roman text-2xl font-bold text-[#2C1F1B] mb-1">
                    {item.title}
                  </h3>
                  <div className="font-['Montserrat'] text-xs text-[#C5A059] mb-3 font-semibold">
                    {item.subtitle}
                  </div>
                  <p className="font-['Montserrat'] text-xs text-[#2B2B2B] leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>

                  <ul className="space-y-2 mb-6 text-xs font-['Montserrat'] text-[#2C1F1B]">
                    {item.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                        <span className="font-medium">{f}</span>
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
                    className="p-3 rounded-xl border border-[#E8E3D9] text-[#2B2B2B] hover:text-[#2C1F1B] hover:bg-[#F5EFE4] transition"
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
      {/* 5. RESALTAR LA AUTOMATIZACIÓN TÉCNICA (ESTRUCTURA EDITORIAL ASIMÉTRICA) */}
      {/* ============================================================== */}
      <section id="automatizacion" className="relative py-24 px-4 bg-[#F5EFE4] select-none border-t border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado Asimétrico Alineado a la Izquierda para Romper la Monotonía */}
          <div className="text-left max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 bg-white mb-3 backdrop-blur-md">
              <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#2C1F1B] font-bold">
                {t.techAutomation.pill}
              </span>
            </div>

            <h2 className="font-serif-roman text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
              {t.techAutomation.title}
            </h2>

            <p className="font-['Montserrat'] text-sm sm:text-base text-[#2B2B2B] leading-relaxed">
              {t.techAutomation.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {t.techAutomation.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl bg-white border border-[#E8E3D9] p-7 sm:p-8 flex flex-col justify-between hover:border-[#C5A059]/60 shadow-[0_10px_30px_rgba(44,31,27,0.05)] transition-all duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#C5A059]/30 text-[#8C6D2D] flex items-center justify-center font-serif-roman text-lg font-bold shadow-xs">
                      {idx === 0 ? "01" : idx === 1 ? "02" : "03"}
                    </span>
                    <span className="text-[10px] font-['Montserrat'] uppercase tracking-wider text-[#2C1F1B] font-bold bg-[#F5EFE4] border border-[#C5A059]/30 px-3 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-serif-roman text-2xl font-bold text-[#2C1F1B] mb-3 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="font-['Montserrat'] text-xs sm:text-sm text-[#2B2B2B] leading-relaxed mb-5 font-normal">
                    {pillar.description}
                  </p>

                  {/* Micro-Capturas de Interfaz Real (Reemplazo de iconos genéricos de IA) */}
                  {idx === 0 && (
                    <div className="mb-6 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D9] space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
                        <span className="flex items-center gap-1 font-semibold text-stone-700">
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>SMS Automático (Twilio)</span>
                        </span>
                        <span>Ahora</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-200 text-[11px] font-['Montserrat'] text-stone-800 leading-snug">
                        &ldquo;¡Hola Familia Rodríguez! Tienen 3 pases reservados. Confirmen aquí: <span className="text-[#C5A059] underline font-semibold">lumina.to/v/valeria</span>&rdquo;
                      </div>
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="mb-6 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D9] space-y-2 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-stone-700 font-semibold">
                        <span>📍 Hello Banquet Hall</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">En ruta directa</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] font-['Montserrat'] font-bold">
                        <div className="py-1.5 px-2 bg-white rounded-lg border border-stone-200 text-sky-700">
                          ✦ Abrir en Waze
                        </div>
                        <div className="py-1.5 px-2 bg-white rounded-lg border border-stone-200 text-emerald-700">
                          ✦ Google Maps
                        </div>
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="mb-6 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D9] space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-stone-700 font-bold">
                        <span>Panel Anfitrión en Vivo</span>
                        <span className="text-[#8C6D2D] font-mono">148 / 150 Asientos</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 text-[10px] font-['Montserrat']">
                        <span className="font-semibold text-stone-800">Mesa 4 · Familia Rodríguez</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">✓ 3 Confirmados</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C5A059]/30 font-['Montserrat'] text-xs text-[#2C1F1B] flex items-start gap-2.5 font-semibold">
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

          <h2 className="font-serif-roman text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
            {t.comparison.title}
          </h2>

          <p className="font-['Montserrat'] text-sm text-[#2B2B2B] leading-relaxed">
            {t.comparison.subtitle}
          </p>
        </div>

        {/* Comparativa Visual Directa: Papel Tradicional vs Click & Love */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Tarjeta Izquierda: Papel Tradicional (El Problema) */}
          <div className="rounded-3xl bg-[#F6F2EC] border border-[#DDD6CC] p-6 sm:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-300/20 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-[10px] font-['Cinzel'] tracking-wider uppercase font-bold mb-4">
                <span>✕</span>
                <span>{lang === "es" ? "El Método Tradicional" : "Outdated Method"}</span>
              </div>

              <h3 className="font-serif-roman text-2xl sm:text-3xl font-bold text-stone-800 mb-2">
                {t.comparison.colCompetitors}
              </h3>
              <p className="font-['Montserrat'] text-xs text-stone-600 mb-6 leading-relaxed">
                {lang === "es"
                  ? "Altos costos en imprentas locales, semanas enteras persiguiendo confirmaciones por teléfono y cero control real del banquete."
                  : "High print shop costs, weeks spent chasing RSVPs over the phone, and zero control over catering guest counts."}
              </p>

              <div className="space-y-4 pt-2 border-t border-stone-300/60">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold text-stone-800">
                      {lang === "es" ? "Costo desproporcionado ($600 - $1,200)" : "Excessive print cost ($600 - $1,200)"}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      {lang === "es"
                        ? "Gasto elevado en imprentas de Los Ángeles más el costo de sobres y timbres postales USPS."
                        : "Hefty print shop bills in Southern California plus postage stamps and custom calligraphy."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold text-stone-800">
                      {lang === "es" ? "Semanas llamando a tías y primos" : "Weeks of manual calling"}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      {lang === "es"
                        ? "Llamadas incómodas una por una; el 30% nunca confirma a tiempo o no responde."
                        : "Chasing guests one-by-one with awkward phone calls; 30% never respond in time."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold text-stone-800">
                      {lang === "es" ? "Pérdida de dinero en el salón ($45-$85/plato)" : "Wasted catering budget ($45-$85/plate)"}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      {lang === "es"
                        ? "Pagas banquetes de personas que prometieron ir pero cancelaron el mero día."
                        : "You pay banquet fees for verbal promises that end up no-showing on party day."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold text-stone-800">
                      {lang === "es" ? "Invitados perdidos en el tráfico de LA" : "Lost guests in LA traffic"}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      {lang === "es"
                        ? "Dirección estática en papel sin GPS; invitados llamando a la familia en plena misa."
                        : "Static paper address with no GPS navigation; frantic phone calls during the ceremony."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-300 text-[11px] text-stone-500 italic text-center">
              {lang === "es"
                ? "Cualquier error de horario o salón requiere mandar a reimprimir y pagar de nuevo."
                : "Any last-minute schedule change requires expensive reprinting from scratch."}
            </div>
          </div>

          {/* Tarjeta Derecha: Click & Love (La Solución) */}
          <div className="rounded-3xl bg-white border-2 border-[#C5A059] p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(197,160,89,0.18)] relative overflow-hidden ring-1 ring-[#C5A059]/30">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#C5A059] to-[#EED3A1] text-[#2C1F1B] text-[10px] font-['Cinzel'] tracking-wider uppercase font-extrabold shadow-xs">
                  <span>✦</span>
                  <span>{lang === "es" ? "Alta Costura Digital" : "Haute Couture Digital"}</span>
                </span>
                <span className="text-[10px] font-['Montserrat'] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {lang === "es" ? "Soporte Local Los Ángeles" : "LA Local Support"}
                </span>
              </div>

              <h3 className="font-serif-roman text-2xl sm:text-3xl font-bold text-[#2C1F1B] mb-2">
                Click & Love Experience
              </h3>
              <p className="font-['Montserrat'] text-xs text-[#2B2B2B] mb-6 leading-relaxed">
                {lang === "es"
                  ? "Invitaciones web interactivas de gala con sobre virtual 3D, confirmación en 1 clic y navegación GPS directa al salón."
                  : "Interactive digital gala invitations with 3D envelope, 1-click SMS RSVPs, and turn-by-turn venue GPS."}
              </p>

              <div className="space-y-4 pt-2 border-t border-[#E8E3D9]">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold text-[#2C1F1B]">
                      {lang === "es" ? "Ahorra hasta un 80% (Desde $99 pago único)" : "Save up to 80% (From $99 one-time)"}
                    </h4>
                    <p className="text-[11px] text-[#554942] mt-0.5">
                      {lang === "es"
                        ? "Sin costos de imprenta ni correo postal. Invita a toda tu lista sin pagar por cada papel adicional."
                        : "Zero printing or postal costs. Invite your entire guest list without per-card charges."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold text-[#2C1F1B]">
                      {lang === "es" ? "98% de confirmación en las primeras 48 hrs" : "98% RSVP confirmation within 48 hrs"}
                    </h4>
                    <p className="text-[11px] text-[#554942] mt-0.5">
                      {lang === "es"
                        ? "Envío directo por WhatsApp o SMS. El invitado confirma en 1 segundo sin contraseñas."
                        : "Direct WhatsApp and SMS delivery. Guests confirm in 1 tap with zero logins."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold text-[#2C1F1B]">
                      {lang === "es" ? "Control de aforo blindado (Cero colados)" : "Strict pass control (Zero uninvited crashers)"}
                    </h4>
                    <p className="text-[11px] text-[#554942] mt-0.5">
                      {lang === "es"
                        ? "Pases asignados exactamente por familia. Sabes con certeza cuántos adultos y niños asistirán."
                        : "Exact seats reserved per family. Protect your tables from unauthorized plus-ones."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold text-[#2C1F1B]">
                      {lang === "es" ? "Navegación GPS a Waze y Google Maps" : "1-Tap GPS to Waze & Google Maps"}
                    </h4>
                    <p className="text-[11px] text-[#554942] mt-0.5">
                      {lang === "es"
                        ? "Tus invitados abren la ruta en su teléfono y llegan a tiempo a la iglesia y al salón."
                        : "Turn-by-turn guidance straight to the parking lot of your banquet hall or church."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E3D9] flex items-center justify-between">
              <span className="text-[11px] font-['Montserrat'] font-semibold text-[#8C6D2D]">
                {lang === "es" ? "Lista en tiempo real exportable a Excel" : "Real-time list exportable to Excel"}
              </span>
              <a
                href="#precios"
                className="text-xs font-['Cinzel'] tracking-wider uppercase font-bold text-[#2C1F1B] hover:text-[#C5A059] underline flex items-center gap-1"
              >
                <span>{lang === "es" ? "Ver Paquetes" : "View Packages"}</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. SECCIÓN TESTIMONIOS REALES & ENLACES DE MUESTRA AL TELÉFONO */}
      {/* ============================================================== */}
      <section id="testimonios" className="relative py-24 px-4 bg-[#F5EFE4] select-none border-t border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 bg-white mb-3 backdrop-blur-md">
              <span className="font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase text-[#2C1F1B] font-bold">
                {t.testimonials.pill}
              </span>
            </div>

            <h2 className="font-serif-roman text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B] mb-3">
              {t.testimonials.title}
            </h2>

            <p className="font-['Montserrat'] text-sm text-[#2B2B2B] leading-relaxed">
              {t.testimonials.subtitle}
            </p>
          </div>

          {/* Grid de 3 Testimonios Reales con Enlace para Probar la Invitación */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {t.testimonials.items.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl bg-white border border-[#E8E3D9] p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(44,31,27,0.05)] hover:border-[#C5A059] transition-all duration-300 group"
              >
                <div>
                  {/* Calificación 5 Estrellas */}
                  <div className="flex items-center gap-1 mb-4 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A059]" />
                    ))}
                    <span className="ml-2 font-['Montserrat'] text-[11px] font-bold text-[#2C1F1B] bg-[#F5EFE4] px-2 py-0.5 rounded-full">
                      5.0
                    </span>
                  </div>

                  {/* Cita */}
                  <p className="font-['Montserrat'] text-xs sm:text-sm text-[#2B2B2B] leading-relaxed italic mb-6">
                    {item.quote}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E8E3D9]">
                  {/* Perfil & Foto */}
                  <div className="flex items-center gap-4 mb-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-14 h-14 rounded-full object-cover object-center border-2 border-[#C5A059] shadow-sm flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-serif-roman text-lg font-bold text-[#2C1F1B] leading-tight">
                        {item.name}
                      </h4>
                      <p className="font-['Montserrat'] text-[11px] text-[#C5A059] font-semibold">
                        {item.role}
                      </p>
                      <p className="font-['Montserrat'] text-[10px] text-[#2B2B2B]/75 leading-tight mt-0.5">
                        {item.event}
                      </p>
                    </div>
                  </div>

                  {/* Métrica de Éxito & Botón de Probar Invitación */}
                  <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-[#F5EFE4] mb-4 text-[11px] font-['Montserrat'] font-semibold text-[#2C1F1B]">
                    <span className="flex items-center gap-1.5 text-[#C5A059]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{item.metric}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C8077]">Verificado</span>
                  </div>

                  <button
                    onClick={() => handleOpenDemo(item.demoSlug)}
                    className="w-full py-3 px-4 rounded-xl bg-white border-2 border-[#C5A059]/60 hover:bg-[#F5EFE4] text-[#2C1F1B] font-['Cinzel'] text-[11px] tracking-wider uppercase font-bold transition flex items-center justify-center gap-2 group-hover:border-[#C5A059] shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{item.demoBtnText}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. SECCIÓN PRECIOS CLICK & LOVE (MODO CLARO DE LUJO) */}
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
          <h2 className="font-serif-roman text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B]">
            {t.pricing.title}
          </h2>
          <p className="font-['Montserrat'] text-sm text-[#2B2B2B] mt-3 max-w-lg mx-auto leading-relaxed">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* CONTENEDOR DE TARJETAS (2 PLANES ASISTIDOS & VIP) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch pt-4">
          {/* 1. PLAN DIGITAL ASISTIDO ($99) */}
          <div className="relative rounded-3xl bg-white border border-[#E8E3D9] p-8 sm:p-10 flex flex-col justify-between shadow-[0_10px_30px_rgba(44,31,27,0.05)] hover:border-[#C5A059]/50 transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Cinzel'] text-xs tracking-[0.25em] uppercase text-[#8C8077] font-bold">
                  {t.pricing.plans[0].badge}
                </span>
                <span className="text-[10px] uppercase font-['Montserrat'] text-[#2C1F1B] bg-[#F5EFE4] px-3 py-1 rounded-full border border-[#E8E3D9] font-semibold">
                  {t.pricing.plans[0].typeTag}
                </span>
              </div>

              <h3 className="font-serif-roman text-2xl sm:text-3xl font-bold text-[#2C1F1B] mb-2">
                {t.pricing.plans[0].name}
              </h3>
              <p className="font-['Montserrat'] text-xs sm:text-sm text-[#2B2B2B] mb-6 leading-relaxed font-normal">
                {t.pricing.plans[0].description}
              </p>

              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[#E8E3D9]">
                <span className="font-serif-roman text-5xl font-bold text-[#2C1F1B]">
                  {t.pricing.plans[0].price}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#8C8077] uppercase tracking-wider font-medium">
                  {t.pricing.plans[0].currency}
                </span>
              </div>

              {/* Viñeta dorada destacada: Sin usar computadora */}
              {t.pricing.plans[0].features.length > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-[#FAF6F0] border border-[#C5A059]/40 flex items-start gap-3 shadow-sm">
                  <span className="text-[#C5A059] text-base leading-none mt-0.5">✦</span>
                  <p className="font-['Montserrat'] text-xs font-bold text-[#2C1F1B] leading-snug">
                    {t.pricing.plans[0].features[0].text}
                  </p>
                </div>
              )}

              {/* Lista de características restantes */}
              <ul className="space-y-3.5 text-xs font-['Montserrat'] text-[#2C1F1B]">
                {t.pricing.plans[0].features.slice(1).map((feat, fIdx) => (
                  <li
                    key={fIdx}
                    className="flex items-start gap-3"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className={feat.isBold ? "font-bold text-[#2C1F1B]" : "text-[#2C1F1B]/90"}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DOBLE VÍA DE COMPRA: CHECKOUT DIRECTO + ZELLE/WHATSAPP */}
            <div className="mt-8 flex flex-col items-center w-full">
              <button
                onClick={() => handleCheckout("assisted")}
                disabled={checkoutLoading !== null}
                className="w-full py-4 px-4 rounded-xl bg-[#2C1F1B] hover:bg-[#1A1311] text-[#FAF8F5] font-['Cinzel'] text-xs tracking-[0.16em] uppercase font-bold active:scale-95 transition-all text-center flex items-center justify-center gap-2.5 shadow-md disabled:opacity-50 group cursor-pointer"
              >
                {checkoutLoading === "assisted" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Procesando pago seguro...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-[#C5A059]" />
                    <span>{t.pricing.plans[0].cta}</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/18182994882?text=${encodeURIComponent(
                  t.pricing.plans[0].secondaryActionMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-center text-xs text-[#2B2B2B] hover:text-[#25D366] transition-colors flex items-center justify-center gap-1.5 font-medium py-1 group/link"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
                <span className="underline decoration-[#25D366]/40 underline-offset-4 group-hover/link:decoration-[#25D366]">
                  {t.pricing.plans[0].secondaryActionText}
                </span>
              </a>
            </div>
          </div>

          {/* 2. PLAN SERVICIO VIP LOS ÁNGELES ($199) - DESTACADO */}
          <div className="relative rounded-3xl bg-white border-2 border-[#C5A059] p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(197,160,89,0.25)] md:-translate-y-3">
            {/* Cinta superior distintiva */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#9C7736] text-[#2C1F1B] font-['Cinzel'] text-[9px] font-bold tracking-[0.3em] uppercase py-1 px-5 rounded-full shadow-md whitespace-nowrap">
              {t.pricing.recommended}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Cinzel'] text-xs tracking-[0.25em] uppercase text-[#C5A059] font-bold">
                  {t.pricing.plans[1].badge}
                </span>
                <span className="text-[10px] uppercase font-['Montserrat'] text-[#2C1F1B] bg-[#F5EFE4] border border-[#C5A059]/40 px-3 py-1 rounded-full font-bold">
                  {t.pricing.plans[1].typeTag}
                </span>
              </div>

              <h3 className="font-serif-roman text-2xl sm:text-3xl font-bold text-[#2C1F1B] mb-2">
                {t.pricing.plans[1].name}
              </h3>
              <p className="font-['Montserrat'] text-xs sm:text-sm text-[#2B2B2B] mb-6 leading-relaxed font-normal">
                {t.pricing.plans[1].description}
              </p>

              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[#C5A059]/30">
                <span className="font-serif-roman text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9C7736] via-[#C5A059] to-[#2C1F1B]">
                  {t.pricing.plans[1].price}
                </span>
                <span className="font-['Montserrat'] text-xs text-[#8C8077] uppercase tracking-wider font-medium">
                  {t.pricing.plans[1].currency}
                </span>
              </div>

              {/* Viñeta dorada destacada: Sin usar computadora */}
              {t.pricing.plans[1].features.length > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#F5EFE4] to-[#FAF6F0] border-2 border-[#C5A059]/60 flex items-start gap-3 shadow-sm">
                  <span className="text-[#C5A059] text-base leading-none mt-0.5">✦</span>
                  <p className="font-['Montserrat'] text-xs font-extrabold text-[#2C1F1B] leading-snug">
                    {t.pricing.plans[1].features[0].text}
                  </p>
                </div>
              )}

              {/* Lista de características restantes */}
              <ul className="space-y-3.5 text-xs font-['Montserrat'] text-[#2C1F1B]">
                {t.pricing.plans[1].features.slice(1).map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <span className="w-4 h-4 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-xs">
                      ✓
                    </span>
                    <span className={feat.isBold ? "font-bold text-[#2C1F1B]" : "text-[#2C1F1B]/90"}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DOBLE VÍA DE COMPRA: CHECKOUT DIRECTO + ZELLE/WHATSAPP */}
            <div className="mt-8 flex flex-col items-center w-full">
              <button
                onClick={() => handleCheckout("vip")}
                disabled={checkoutLoading !== null}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#B38D40] hover:brightness-105 text-[#1A1A1A] font-['Cinzel'] text-xs tracking-[0.16em] uppercase font-extrabold active:scale-95 transition-all shadow-[0_10px_25px_rgba(197,160,89,0.45)] text-center flex items-center justify-center gap-2 group hover:shadow-[0_12px_30px_rgba(197,160,89,0.6)] disabled:opacity-50 cursor-pointer"
              >
                {checkoutLoading === "vip" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
                    <span>Procesando pago seguro...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-[#1A1A1A]" />
                    <span>{t.pricing.plans[1].cta}</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/18182994882?text=${encodeURIComponent(
                  t.pricing.plans[1].secondaryActionMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-center text-xs text-[#2B2B2B] hover:text-[#25D366] transition-colors flex items-center justify-center gap-1.5 font-medium py-1 group/link"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
                <span className="underline decoration-[#25D366]/40 underline-offset-4 group-hover/link:decoration-[#25D366]">
                  {t.pricing.plans[1].secondaryActionText}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* FRANJA DE CONFIANZA Y MÉTODOS DE PAGO */}
        <div className="mt-12 max-w-2xl mx-auto text-center flex flex-col items-center justify-center">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold text-[#2C1F1B] mb-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
            <span>{t.pricing.trustBadgesText}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-white border border-[#E8E3D9] text-[10px] font-extrabold tracking-wider text-[#1A1F71] shadow-2xs">
              VISA
            </span>
            <span className="px-2.5 py-1 rounded bg-white border border-[#E8E3D9] text-[10px] font-bold text-[#2C1F1B] shadow-2xs flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] inline-block -mr-1.5 opacity-90" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] inline-block opacity-90" />
              <span>Mastercard</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-white border border-[#E8E3D9] text-[10px] font-extrabold text-[#006FCF] shadow-2xs">
              AMEX
            </span>
            <span className="px-2.5 py-1 rounded bg-white border border-[#E8E3D9] text-[10px] font-semibold text-[#2C1F1B] shadow-2xs flex items-center gap-0.5">
              <span>Pay</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-white border border-[#E8E3D9] text-[10px] font-semibold text-[#2C1F1B] shadow-2xs flex items-center gap-0.5">
              <span>G Pay</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#7414CA]/10 border border-[#7414CA]/30 text-[10px] font-bold text-[#7414CA] shadow-2xs flex items-center gap-1">
              <span className="font-extrabold">zelle</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#F5EFE4] border border-[#C5A059]/40 text-[9px] uppercase tracking-wider font-semibold text-[#2C1F1B] shadow-2xs flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-[#C5A059]" />
              <span>SSL 256-Bit</span>
            </span>
          </div>
        </div>

        {/* GARANTÍA Y FAQ RÁPIDO */}
        <div className="mt-16 text-center">
          <p className="font-['Montserrat'] text-xs text-[#8C8077]">
            {t.pricing.venueFaqText}
            <a
              href={`https://wa.me/18182994882?text=${encodeURIComponent(
                lang === "en"
                  ? "Hello! I am interested in volume packages for venues and wedding planners with Click & Love."
                  : "Hola, me interesa conocer los paquetes por volumen para salones y wedding planners de Click & Love."
              )}`}
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
            <p className="font-['Montserrat'] text-xs text-[#2B2B2B] mt-2 max-w-sm">
              {t.footer.brandSubtitle}
            </p>
            <p className="font-['Montserrat'] text-[11px] text-[#8C6D2D] font-semibold mt-2 flex items-center gap-1.5 justify-center md:justify-start">
              <span>📍</span>
              <span>{t.footer.localOrigin}</span>
            </p>
          </div>

          {/* Enlaces de Utilidad & Panel Administrativo */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-['Cinzel'] text-xs tracking-wider uppercase text-[#2C1F1B]">
            <Link href="/dashboard" className="text-[#C5A059] hover:text-[#AA8643] transition font-bold">
              {t.footer.adminLink}
            </Link>
            <a
              href={`https://wa.me/18182994882?text=${encodeURIComponent(
                lang === "en"
                  ? "Hello! I would like to get concierge guidance regarding Click & Love digital invitations."
                  : "¡Hola! Me gustaría recibir asesoría personalizada sobre las invitaciones digitales de Click & Love."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C5A059] transition font-semibold"
            >
              {t.footer.whatsappSupport}
            </a>
          </div>

          {/* Selector de idioma & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 text-xs text-[#2B2B2B]">
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
      {/* 10. BOTÓN FLOTANTE OFICIAL DE WHATSAPP CON ASESORÍA CONCIERGE */}
      {/* ============================================================== */}
      <FloatingWhatsApp lang={lang} phone="18182994882" />

      {/* ============================================================== */}
      {/* 11. MODAL INTERACTIVO DE DEMOSTRACIÓN EN VIVO */}
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
