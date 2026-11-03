"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  Lock,
  Menu,
  MessageSquare,
  Sparkles,
  Phone,
  Star,
  X,
} from "lucide-react";
import { Language, translations } from "@/lib/home-translations";
import { track } from "@/lib/analytics";
import HeroPhones from "@/components/home/HeroPhones";
import InteractiveDemoModal from "@/components/home/InteractiveDemoModal";
import SiteFooter from "@/components/layout/SiteFooter";

const PHONE_DISPLAY = "(818) 299-4882";
const PHONE_TEL = "tel:+18182994882";
const PHONE_SMS = "sms:+18182994882";

// Enlaces internos a las landings transaccionales (SEO: las landings eran
// huérfanas, solo accesibles por URL directa y sitemap). Van en el MENÚ
// PRINCIPAL, no en el footer (Abraham 2026-11-01). ES enlaza la landing
// XV en español; el resto aún no tiene versión ES. El panel usa hidden/block
// (no render condicional) para que los enlaces estén en el HTML inicial.
const MENU_LANDING_LINKS: Record<Language, { href: string; label: string }[]> = {
  en: [
    { href: "/quince-invitations", label: "Quince Invitations" },
    { href: "/wedding-invitations-los-angeles", label: "Wedding Invitations" },
    { href: "/wedding-invitations-las-vegas", label: "Wedding Invitations Las Vegas" },
    { href: "/text-message-invitations", label: "Text Message Invitations" },
    { href: "/rsvp-tracking", label: "RSVP Tracking" },
    { href: "/whatsapp-invitations", label: "WhatsApp Invitations" },
  ],
  es: [
    { href: "/es/invitaciones-de-quinceanera", label: "Invitaciones de Quinceañera" },
    { href: "/wedding-invitations-los-angeles", label: "Invitaciones de Boda" },
    { href: "/wedding-invitations-las-vegas", label: "Invitaciones de Boda Las Vegas" },
    { href: "/text-message-invitations", label: "Invitaciones por Mensaje de Texto" },
    { href: "/rsvp-tracking", label: "Invitaciones con RSVP" },
    { href: "/whatsapp-invitations", label: "Invitaciones por WhatsApp" },
  ],
};

export default function HomeView({ initialLang = "en" }: { initialLang?: Language }) {
  const [lang, setLang] = useState<Language>(initialLang);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeDemoSlug, setActiveDemoSlug] = useState("isabella-xv");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const t = translations[lang];
  const b = t.brand;

  const handleOpenDemo = (slug: string = "isabella-xv") => {
    // En movil el popup de vista previa reduce demasiado la plantilla
    // (decision de Abraham 2026-10-22): ir directo a la demo a pantalla
    // completa, la misma ruta que enlaza el catalogo (/demo/<slug>).
    // En escritorio se mantiene el modal con su iframe.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      window.location.href = `/demo/${slug}`;
      return;
    }
    setActiveDemoSlug(slug);
    setIsDemoModalOpen(true);
  };

  const handleCheckout = async (plan: "assisted" | "vip" | string) => {
    // Semana 1: inicio de checkout como evento (antes de salir a Stripe).
    track("begin_checkout", { paquete: plan });
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
        alert(
          lang === "es"
            ? "Hubo un error al iniciar la compra. Por favor intenta de nuevo."
            : "There was an error starting checkout. Please try again."
        );
        setCheckoutLoading(null);
      }
    } catch (err) {
      console.error("Error en checkout:", err);
      alert(lang === "es" ? "Error de conexión al procesar la compra." : "Connection error during checkout.");
      setCheckoutLoading(null);
    }
  };

  const plans = [
    { key: "assisted" as const, dict: t.pricing.plans[0], hot: false },
    { key: "vip" as const, dict: t.pricing.plans[1], hot: true },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#2B0A18] selection:bg-[#7A002A]/20 selection:text-[#2B0A18] font-['Montserrat'] overflow-x-hidden relative">
      {/* ============================================================== */}
      {/* BARRA SUPERIOR BORGOÑA */}
      {/* ============================================================== */}
      <div className="bg-[#7A002A] text-white py-2.5 px-4 text-center">
        <span className="font-['Montserrat'] text-[11px] sm:text-xs font-semibold tracking-wide">
          {b.topbar}
        </span>
      </div>

      {/* ============================================================== */}
      {/* HEADER CON LOGO NUEVO */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#FDFBF8]/92 backdrop-blur-md border-b border-[#E7DCC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[76px] flex items-center justify-between gap-3">
          {/* Logo: corazón a color + wordmark */}
          <Link href={lang === "es" ? "/es" : "/"} className="flex items-center gap-2.5 shrink-0" aria-label="Click and Love">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Click and Love" className="w-11 h-11 object-contain" />
            <span className="flex items-baseline whitespace-nowrap">
              <span className="font-['Montserrat'] font-extrabold text-[22px] tracking-tight text-[#2B0A18]">
                Click
              </span>
              <span className="font-vibes text-[30px] leading-none text-[#C2185B] ml-1.5">and Love</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-7 font-['Montserrat'] text-[13.5px] font-semibold text-[#2B0A18]">
            <button onClick={() => handleOpenDemo("isabella-xv")} className="hover:text-[#7A002A] transition cursor-pointer">
              {b.navLiveDemo}
            </button>
            <a href="#como-funciona" className="hover:text-[#7A002A] transition">
              {t.nav.howItWorks}
            </a>
            <a href="#comparativa" className="hover:text-[#7A002A] transition">
              {t.nav.compare}
            </a>
            <a href="#plantillas" className="hover:text-[#7A002A] transition">
              {b.navTemplates}
            </a>
            <a href="#precios" className="hover:text-[#7A002A] transition">
              {t.nav.pricing}
            </a>
            <a href="#reviews" className="hover:text-[#7A002A] transition">
              {b.navReviews}
            </a>
            <div className="relative">
              <button
                onClick={() => setServicesOpen((v) => !v)}
                className="hover:text-[#7A002A] transition cursor-pointer"
                aria-expanded={servicesOpen}
              >
                {lang === "es" ? "Servicios ▾" : "Services ▾"}
              </button>
              <div
                className={`${servicesOpen ? "block" : "hidden"} absolute right-0 top-full mt-3 w-64 rounded-xl border border-[#E7DCC8] bg-white shadow-xl py-2 z-50`}
              >
                {MENU_LANDING_LINKS[lang].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setServicesOpen(false)}
                    className="block px-4 py-2.5 text-[13px] hover:bg-[#FDFBF8] hover:text-[#7A002A] transition"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            {/* Toggle ES | EN (rutas / y /es) */}
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#5A3C46]">
              <Link
                href="/es"
                onClick={() => setLang("es")}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === "es" ? "text-[#7A002A] border-b-2 border-[#7A002A]" : "text-[#A98B96] hover:text-[#7A002A]"
                }`}
                aria-label="Cambiar a Español"
              >
                ES
              </Link>
              <span className="text-[#B08D3C]/50 select-none">|</span>
              <Link
                href="/"
                onClick={() => setLang("en")}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === "en" ? "text-[#7A002A] border-b-2 border-[#7A002A]" : "text-[#A98B96] hover:text-[#7A002A]"
                }`}
                aria-label="Switch to English"
              >
                EN
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#E7DCC8] text-[#2B0A18] transition"
              aria-label={lang === "es" ? "Abrir menú" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a
              href="#precios"
              className="hidden sm:inline-flex px-5 py-2.5 bg-[#7A002A] hover:bg-[#660025] text-white rounded-full text-[13px] font-['Montserrat'] font-bold shadow-[0_6px_18px_rgba(122,0,42,0.35)] transition active:scale-95"
            >
              {b.createBtn}
            </a>
          </div>
        </div>
        <div className={`${mobileMenuOpen ? "block" : "hidden"} lg:hidden border-t border-[#E7DCC8] bg-[#FDFBF8]`}>
          <div className="px-4 py-3 flex flex-col font-['Montserrat'] text-[13.5px] font-semibold text-[#2B0A18]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenDemo("isabella-xv");
              }}
              className="text-left py-2.5 hover:text-[#7A002A] transition cursor-pointer"
            >
              {b.navLiveDemo}
            </button>
            <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {t.nav.howItWorks}
            </a>
            <a href="#comparativa" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {t.nav.compare}
            </a>
            <a href="#plantillas" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {b.navTemplates}
            </a>
            <a href="#precios" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {t.nav.pricing}
            </a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {b.navReviews}
            </a>
            <p className="pt-3 mt-1 border-t border-[#E7DCC8] text-xs font-bold tracking-widest text-[#7A002A]">
              {lang === "es" ? "SERVICIOS" : "SERVICES"}
            </p>
            {MENU_LANDING_LINKS[lang].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 hover:text-[#7A002A] transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* HERO */}
      {/* ============================================================== */}
      <section className="relative px-4 sm:px-6 pt-12 pb-14 lg:pt-16 lg:pb-20 overflow-hidden">
        <div className="absolute -top-24 right-0 w-[520px] h-[420px] bg-[#D9B45B]/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <p className="font-['Montserrat'] font-extrabold text-[12px] sm:text-[13px] tracking-[0.18em] uppercase text-[#B08D3C]">
              {b.heroEyebrow}
            </p>
            <h1 className="font-['Cinzel'] font-bold text-[34px] sm:text-5xl xl:text-[56px] leading-[1.14] text-[#2B0A18] mt-4">
              {t.hero.title1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A002A] via-[#B08D3C] to-[#7A002A]">
                {t.hero.title2}
              </span>
            </h1>
            <p className="font-['Montserrat'] text-[15px] sm:text-base text-[#5A3C46] leading-relaxed mt-6 max-w-xl mx-auto lg:mx-0">
              {b.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={() => handleOpenDemo("isabella-xv")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7A002A] hover:bg-[#660025] text-white font-['Montserrat'] font-bold text-sm shadow-[0_10px_26px_rgba(122,0,42,0.35)] transition active:scale-95 cursor-pointer"
              >
                {b.heroCtaDemo}
              </button>
              <a
                href="#precios"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-[#7A002A] text-[#7A002A] hover:bg-[#F5EDDA] font-['Montserrat'] font-bold text-sm text-center transition active:scale-95"
              >
                {b.heroCtaPricing}
              </a>
            </div>
            <p className="font-['Montserrat'] font-bold text-[13px] text-[#96690A] mt-6">{b.heroNote}</p>
          </div>

          {/* 3 teléfonos con badges flotantes de prueba */}
          <div className="relative">
            <HeroPhones />
            <span className="absolute top-6 -left-1 sm:left-2 z-20 inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-white/95 backdrop-blur border border-[#E7DCC8] shadow-[0_10px_24px_rgba(122,0,42,0.18)]">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-600" />
              </span>
              <span className="font-['Montserrat'] font-extrabold text-[10.5px] tracking-wide text-[#2B0A18]">
                {t.hero.phoneBadge2}
              </span>
            </span>
            <span className="absolute bottom-10 -right-1 sm:right-2 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2B0A18]/92 backdrop-blur shadow-[0_10px_24px_rgba(43,10,24,0.35)]">
              <Lock className="w-3 h-3 text-[#FFD166]" />
              <span className="font-['Montserrat'] font-extrabold text-[10.5px] tracking-wide text-white">
                {t.hero.phoneBadge3}
              </span>
            </span>
          </div>
        </div>

        {/* Prueba social + canales para compartir (del home anterior) */}
        <div className="max-w-4xl mx-auto text-center mt-12 relative">
          <p className="inline-flex items-start sm:items-center gap-2 font-['Montserrat'] text-[13px] sm:text-sm font-semibold text-[#5A3C46] leading-relaxed">
            <span className="relative flex w-2 h-2 mt-1.5 sm:mt-0 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-600" />
            </span>
            {t.hero.phoneBadge1}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="font-['Montserrat'] text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A6B76] mr-1">
              {b.shareLabel}
            </span>
            {b.shareChannels.map((ch) => (
              <span
                key={ch}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E7DCC8] font-['Montserrat'] text-xs font-bold text-[#45303B] shadow-[0_4px_12px_rgba(122,0,42,0.06)]"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* BANDA BORGOÑA DE BENEFICIOS */}
      {/* ============================================================== */}
      <section className="bg-[#7A002A] py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center">
          {b.strip.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="text-[#D9B45B] font-extrabold">·</span>}
              <span className="font-['Montserrat'] font-extrabold text-[13px] sm:text-sm text-white tracking-wide">
                {item}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* CÓMO FUNCIONA */}
      {/* ============================================================== */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-vibes text-[32px] text-[#B08D3C] block leading-tight">{b.howScript}</span>
            <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-[32px] text-[#2B0A18] mt-2 leading-snug">
              {b.howTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {b.steps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-3xl bg-white border border-[#E7DCC8] p-7 shadow-[0_12px_28px_rgba(122,0,42,0.07)]"
              >
                <div className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full bg-[#7A002A] text-white flex items-center justify-center font-['Montserrat'] font-extrabold text-lg shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="font-['Montserrat'] font-extrabold text-[17px] text-[#2B0A18] leading-snug">
                    {step.title}
                  </h3>
                </div>
                <p className="font-['Montserrat'] text-sm text-[#5A3C46] leading-relaxed mt-4">{step.line1}</p>
                <p className="font-['Montserrat'] text-sm text-[#5A3C46] leading-relaxed">{step.line2}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* VALOR / COMPARACIÓN (restaurada del home anterior) */}
      {/* ============================================================== */}
      <section id="comparativa" className="py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#B08D3C]/40 bg-[#F5EDDA] font-['Montserrat'] text-[10.5px] tracking-[0.22em] uppercase text-[#7A002A] font-extrabold">
              {t.comparison.pill}
            </span>
            <span className="font-vibes text-[32px] sm:text-[36px] text-[#B08D3C] block leading-tight mt-3">{b.compScript}</span>
            <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-[34px] text-[#2B0A18] mt-1 leading-snug">
              {t.comparison.title}
            </h2>
            <p className="font-['Montserrat'] text-[15px] text-[#5A3C46] leading-relaxed mt-3 max-w-2xl mx-auto">
              {t.comparison.subtitle}
            </p>
          </div>

          {/* Asymmetric Bento Grid (Inspirado en Babka Bento-1) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* -------------------------------------------------------- */}
            {/* CARD 1 (HERO BENTO - SPANS 12 COLS): White-Glove Atelier */}
            {/* -------------------------------------------------------- */}
            <div className="lg:col-span-12 rounded-[28px] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] border border-[#E7DCC8] p-7 sm:p-10 lg:p-12 shadow-[0_16px_36px_rgba(122,0,42,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C2185B]/6 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#B08D3C]/8 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Storytelling & Value props */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EDDA] border border-[#B08D3C]/40 text-[#7A002A] text-[10.5px] font-['Montserrat'] tracking-[0.16em] uppercase font-bold mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-[#B08D3C]" />
                      {lang === "es" ? "Cero Trabajo Para Ti · Servicio Atelier Llave en Mano" : "Zero Work For You · Bespoke Concierge Atelier"}
                    </span>
                    <h3 className="font-['Cinzel'] font-bold text-2xl sm:text-[32px] text-[#2B0A18] leading-tight">
                      {lang === "es"
                        ? "Tú no tocas ninguna computadora. Nosotros la armamos completa."
                        : "You don't touch any software. We handcraft everything for you."}
                    </h3>
                    <p className="font-['Montserrat'] text-[14.5px] sm:text-[15.5px] text-[#5A3C46] leading-relaxed mt-4 max-w-xl">
                      {lang === "es"
                        ? "En Canva te entregan una plantilla vacía y tú tienes que aprender a acomodar fotos, pelear con fuentes y exportar archivos que nadie abre. Con Click & Love solo nos mandas tus fotos y datos por WhatsApp. Nuestro equipo en Los Ángeles diseña tu invitación interactiva 3D con sobre virtual y música personalizada en menos de 48 horas."
                        : "With Canva you get an empty template and have to figure out fonts, align photo boxes, and export static files guests lose. With Click & Love, simply send your photos and itinerary via WhatsApp. Our Los Angeles design atelier crafts your bespoke 3D unboxing experience with custom music ready to send in under 48 hours."}
                    </p>
                  </div>

                  {/* Feature pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-[#E7DCC8]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span className="text-xs font-semibold text-[#2B0A18] font-['Montserrat']">
                        {lang === "es" ? "Diseñador dedicado en LA" : "Dedicated LA Designer"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span className="text-xs font-semibold text-[#2B0A18] font-['Montserrat']">
                        {lang === "es" ? "Muestra lista en 48 horas" : "48-Hour Fast Delivery"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span className="text-xs font-semibold text-[#2B0A18] font-['Montserrat']">
                        {lang === "es" ? "Revisiones ilimitadas" : "Unlimited Fine-Tuning"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href="https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20to%20create%20my%20invitation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A002A] hover:bg-[#660025] text-white text-xs font-['Montserrat'] font-bold shadow-[0_6px_16px_rgba(122,0,42,0.25)] transition active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {lang === "es" ? "Chatear con el Diseñador por WhatsApp" : "Chat with Atelier Designer on WhatsApp"}
                    </a>
                    <span className="text-[11.5px] text-[#8A6B76] font-['Montserrat']">
                      {lang === "es" ? "✦ Respuesta en minutos (Mon-Sat 9AM-7PM PST)" : "✦ Instant reply (Mon-Sat 9AM-7PM PST)"}
                    </span>
                  </div>
                </div>

                {/* Right Column: WhatsApp Concierge Simulator */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl bg-white border border-[#E5DAC6] shadow-[0_18px_36px_rgba(122,0,42,0.10)] overflow-hidden">
                    {/* WhatsApp Top bar */}
                    <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0 border border-white/30">
                          ✨
                        </div>
                        <div className="min-w-0">
                          <p className="font-['Montserrat'] font-bold text-xs truncate flex items-center gap-1.5">
                            Click &amp; Love Concierge
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-300 inline" />
                          </p>
                          <span className="text-[10px] text-emerald-100/90 block leading-tight">
                            {lang === "es" ? "En línea · Estudio Los Ángeles" : "Online · Los Angeles Studio"}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold text-white/90">
                        VIP
                      </span>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="p-4 bg-[#EFEAE2] space-y-3 font-['Montserrat'] text-xs">
                      {/* Message 1 (Customer Outgoing) */}
                      <div className="flex flex-col items-end">
                        <div className="bg-[#DCF8C6] text-[#111B21] rounded-2xl rounded-tr-sm p-3 max-w-[88%] shadow-sm border border-emerald-900/5">
                          <p className="leading-snug">
                            {lang === "es"
                              ? "¡Hola Click & Love! Les mando las fotos de Isabella y los datos del salón Brandview en Glendale 🌸"
                              : "Hi Click & Love! Here are Isabella's photo shoot pics and our ballroom details for Brandview in Glendale 🌸"}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#667781]">
                            <span>10:14 AM</span>
                            <span>✓✓</span>
                          </div>
                        </div>
                      </div>

                      {/* Message 2 (Concierge Incoming) */}
                      <div className="flex flex-col items-start">
                        <div className="bg-white text-[#111B21] rounded-2xl rounded-tl-sm p-3 max-w-[90%] shadow-sm border border-black/5">
                          <p className="leading-snug">
                            {lang === "es"
                              ? "¡Recibido! Diseñamos tu invitación 3D con sobre dorado, vals personalizado y control de 4 pases por familia. ¡Te enviamos la muestra en menos de 48 horas! 💌"
                              : "Received! Crafting your 3D unboxing invitation with gold envelope, custom music, and strict family pass control. Sample ready in under 48h! 💌"}
                          </p>
                          <span className="block text-right mt-1 text-[9px] text-[#667781]">10:16 AM</span>
                        </div>
                      </div>

                      {/* Message 3 (Concierge link preview bubble) */}
                      <div className="flex flex-col items-start">
                        <div className="bg-white text-[#111B21] rounded-2xl rounded-tl-sm p-2.5 max-w-[90%] shadow-sm border border-[#B08D3C]/30">
                          <div className="rounded-xl bg-[#FAF5EC] border border-[#E7DCC8] p-2 flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg bg-[#7A002A] text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                              💌
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-[11px] text-[#2B0A18] truncate">
                                {lang === "es" ? "Muestra Lista: Isabella's Grand XV" : "Sample Ready: Isabella's Grand XV"}
                              </p>
                              <span className="text-[9.5px] text-[#7A002A] font-semibold block truncate">
                                clickandlove.app/demo/isabella-xv
                              </span>
                            </div>
                          </div>
                          <span className="block text-right mt-1 text-[9px] text-[#667781]">Next day · 11:30 AM</span>
                        </div>
                      </div>

                      {/* Message 4 (Customer feedback) */}
                      <div className="flex flex-col items-end">
                        <div className="bg-[#DCF8C6] text-[#111B21] rounded-2xl rounded-tr-sm p-2.5 max-w-[88%] shadow-sm border border-emerald-900/5">
                          <p className="leading-snug">
                            {lang === "es"
                              ? "¡Quedó espectacular! A toda la familia le encantó el sobre interactivo ✨"
                              : "It looks breathtaking! Everyone was blown away opening the 3D envelope ✨"}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] text-[#667781]">
                            <span>11:34 AM</span>
                            <span className="text-[#53BDEB]">✓✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* CARD 2 (DARK LUXURY - SPANS 6 COLS): Host Live Roster    */}
            {/* -------------------------------------------------------- */}
            <div className="lg:col-span-6 rounded-[28px] bg-[#1A050E] text-white border border-[#B08D3C]/40 p-7 sm:p-9 shadow-[0_18px_40px_rgba(26,5,14,0.4)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#7A002A]/25 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-['Montserrat'] tracking-[0.14em] uppercase font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {b.rosterLive} · {lang === "es" ? "Cero Colados" : "Zero Plus-Ones"}
                  </span>
                  <span className="text-[10.5px] text-[#D9B8C4]/70 font-['Montserrat'] font-medium">
                    {lang === "es" ? "Control de Aforo Blindado" : "Ironclad Capacity"}
                  </span>
                </div>

                <h3 className="font-['Cinzel'] font-bold text-2xl sm:text-[26px] text-white leading-tight">
                  {lang === "es"
                    ? "Control estricto de pases por familia. Cero invitados sorpresa."
                    : "Strict family pass control. Zero uninvited surprise guests."}
                </h3>
                <p className="font-['Montserrat'] text-[14px] text-[#D9B8C4] leading-relaxed mt-3">
                  {lang === "es"
                    ? "Una imagen de Canva no te dice quién asiste; terminas anotando nombres en servilletas y persiguiendo gente. Con Click & Love asignas pases exactos y monitoreas quién confirmó desde tu celular."
                    : "A Canva flyer cannot track attendance; you end up jotting names on napkins and chasing relatives. With Click & Love, assign exact passes per family and track confirms live from your phone."}
                </p>

                {/* Host Live Roster Simulation */}
                <div className="mt-6 rounded-2xl bg-[#2B0A18]/90 border border-[#B08D3C]/35 p-4 shadow-xl">
                  {/* KPI Counters */}
                  <div className="grid grid-cols-3 gap-2 pb-3 border-b border-white/10 text-center font-['Montserrat']">
                    <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                      <span className="block text-[9.5px] text-[#D9B8C4] uppercase tracking-wider font-semibold">
                        {b.rosterConfirmed}
                      </span>
                      <span className="text-base font-bold text-emerald-400">142</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                      <span className="block text-[9.5px] text-[#D9B8C4] uppercase tracking-wider font-semibold">
                        {b.rosterDeclined}
                      </span>
                      <span className="text-base font-bold text-rose-400">8</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                      <span className="block text-[9.5px] text-[#D9B8C4] uppercase tracking-wider font-semibold">
                        {b.rosterPending}
                      </span>
                      <span className="text-base font-bold text-[#FFD166]">15</span>
                    </div>
                  </div>

                  {/* Family Pass List */}
                  <div className="space-y-2 pt-3 font-['Montserrat'] text-[11px]">
                    <div className="flex items-center justify-between bg-white/6 rounded-xl px-3 py-2 gap-2 border border-white/5">
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">Familia Morales</p>
                        <span className="text-[10px] text-[#C9A3B2] block">{b.rosterGuest1Sub}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-700/60 whitespace-nowrap">
                        {b.rosterGuest1Chip}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white/6 rounded-xl px-3 py-2 gap-2 border border-white/5">
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">Carlos &amp; Diana Mendoza</p>
                        <span className="text-[10px] text-[#C9A3B2] block">{b.rosterGuest2Sub}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-rose-950 text-rose-300 font-bold text-[10px] border border-rose-700/60 whitespace-nowrap">
                        {b.rosterGuest2Chip}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom micro-stat */}
              <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#D9B8C4]/80 font-['Montserrat']">
                <span>{lang === "es" ? "Ahorro estimado en banquetes:" : "Estimated catering saved:"}</span>
                <span className="font-bold text-[#E5C158]">{lang === "es" ? "~$1,400 por pases controlados" : "~$1,400 on avoided extra plates"}</span>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* CARD 3 (LIGHT CHAMPAGNE - SPANS 6 COLS): 1-Tap SMS & GPS */}
            {/* -------------------------------------------------------- */}
            <div className="lg:col-span-6 rounded-[28px] bg-white border border-[#E7DCC8] p-7 sm:p-9 shadow-[0_14px_32px_rgba(122,0,42,0.06)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#B08D3C]/8 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EDDA] border border-[#B08D3C]/40 text-[#7A002A] text-[10px] font-['Montserrat'] tracking-[0.14em] uppercase font-bold">
                    <MessageSquare className="w-3 h-3 text-[#7A002A]" />
                    {lang === "es" ? "SMS Directo · Tasa de Apertura >98%" : "Direct SMS · >98% Open Rate"}
                  </span>
                  <span className="text-[10.5px] text-[#8A6B76] font-['Montserrat'] font-semibold">
                    Google Maps
                  </span>
                </div>

                <h3 className="font-['Cinzel'] font-bold text-2xl sm:text-[26px] text-[#2B0A18] leading-tight">
                  {lang === "es"
                    ? "Llegada directa al salón. Nadie se pierde en el tráfico."
                    : "Turn-by-turn arrival. Zero guests lost in traffic."}
                </h3>
                <p className="font-['Montserrat'] text-[14px] text-[#5A3C46] leading-relaxed mt-3">
                  {lang === "es"
                    ? "Los enlaces sueltos se pierden en el chat familiar y terminan llamándote a la hora del vals. Tus invitados reciben recordatorios automáticos por SMS con su mesa y ruta directa con un solo toque en Google Maps."
                    : "Loose image links get buried in chaotic group chats. With Click & Love, each guest receives an automated SMS confirmation with their assigned table and 1-tap navigation directly on Google Maps to the ballroom."}
                </p>

                {/* SMS & GPS Mockup Bubble */}
                <div className="mt-6 rounded-2xl bg-[#FBF6EE] border border-[#E7DCC8] p-4 shadow-sm">
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-md border border-[#EFE3D2] text-[#2B0A18]">
                    <div className="flex items-center justify-between text-[10px] text-[#8A6B76] mb-2 pb-1.5 border-b border-[#F3E9D7] font-semibold font-['Montserrat']">
                      <span className="flex items-center gap-1.5 text-[#7A002A]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {b.smsTitle}
                      </span>
                      <span>{b.smsWhen}</span>
                    </div>
                    <p className="leading-snug text-xs sm:text-[12.5px] font-['Montserrat'] text-[#2B0A18]">
                      {b.smsBody}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-[#F3E9D7] flex flex-wrap items-center gap-2 font-['Montserrat']">
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition"
                      >
                        📍 Google Maps Route
                      </a>
                      <span className="text-[10px] text-[#8A6B76] font-medium ml-auto">
                        Brandview Ballroom · Glendale
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom venue areas */}
              <div className="relative z-10 mt-5 pt-4 border-t border-[#EFE3D2] flex flex-wrap items-center justify-between text-[11px] text-[#8A6B76] font-['Montserrat'] gap-1">
                <span className="font-semibold text-[#7A002A]">{lang === "es" ? "Salones en California:" : "Southern CA Venues:"}</span>
                <span>Glendale · Burbank · Pasadena · Downtown LA · Orange Co.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PLANTILLAS REALES */}
      {/* ============================================================== */}
      <section id="plantillas" className="py-20 px-4 sm:px-6 bg-[#F5EDDA] scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-vibes text-[32px] text-[#B08D3C] block leading-tight">{b.tplScript}</span>
            <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-[30px] text-[#2B0A18] mt-2 leading-snug">
              {b.tplTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {b.tplCards.map((card) => (
              <div
                key={card.slug}
                className="rounded-3xl bg-white border border-[#E7DCC8] overflow-hidden shadow-[0_12px_28px_rgba(122,0,42,0.08)] hover:shadow-[0_20px_40px_rgba(122,0,42,0.14)] transition-shadow flex flex-col"
              >
                <a href={`/demo/${card.slug}`} target="_blank" rel="noopener noreferrer" className="block group relative">
                  <div className="h-64 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={card.name}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={533}
                      style={{ objectPosition: card.imgPos ?? "50% 0%" }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#2B0A18]/78 backdrop-blur text-white font-['Montserrat'] text-[9.5px] font-extrabold tracking-[0.16em] uppercase">
                    {card.tag}
                  </span>
                </a>
                <div className="p-6 flex flex-col gap-1.5 flex-1">
                  <h3 className="font-['Montserrat'] font-extrabold text-lg text-[#2B0A18]">{card.name}</h3>
                  <p className="font-['Montserrat'] text-[13px] text-[#5A3C46] leading-relaxed">{card.desc}</p>
                  <ul className="mt-3 space-y-1.5">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 font-['Montserrat'] text-[12.5px] font-semibold text-[#45303B]">
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#B08D3C] shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5">
                    <button
                      onClick={() => handleOpenDemo(card.slug)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A002A] hover:bg-[#660025] text-white font-['Montserrat'] font-bold text-[12.5px] transition active:scale-95 cursor-pointer"
                    >
                      {t.collections.viewDemo}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href={lang === "es" ? "/es/demo" : "/demo"}
              className="inline-flex items-center gap-2 font-['Montserrat'] font-bold text-sm text-[#7A002A] hover:text-[#B08D3C] transition"
            >
              {b.catalogLink}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PRECIOS */}
      {/* ============================================================== */}
      <section id="precios" className="py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-['Cinzel'] font-bold text-3xl sm:text-4xl text-[#2B0A18]">{b.pricingTitle}</h2>
            <p className="font-['Montserrat'] text-[15px] text-[#5A3C46] mt-3">{b.pricingSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={
                  plan.hot
                    ? "relative rounded-3xl bg-[#7A002A] text-white p-8 flex flex-col shadow-[0_22px_45px_rgba(122,0,42,0.35)]"
                    : "relative rounded-3xl bg-white border border-[#E7DCC8] p-8 flex flex-col shadow-[0_12px_28px_rgba(122,0,42,0.07)]"
                }
              >
                {plan.hot && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFD166] text-[#2B0A18] font-['Montserrat'] font-extrabold text-[10.5px] tracking-[0.18em] uppercase py-1.5 px-4 rounded-full shadow whitespace-nowrap">
                    {b.pricingFavorite}
                  </span>
                )}
                <span
                  className={`font-['Montserrat'] text-[10.5px] font-extrabold tracking-[0.18em] uppercase ${
                    plan.hot ? "text-[#FFD166]" : "text-[#96690A]"
                  }`}
                >
                  {plan.dict.typeTag}
                </span>
                <h3
                  className={`font-['Montserrat'] font-extrabold text-xl mt-1.5 ${
                    plan.hot ? "text-white" : "text-[#2B0A18]"
                  }`}
                >
                  {plan.dict.name}
                </h3>
                <div className="flex items-baseline gap-2.5 mt-4">
                  <span className={`font-['Cinzel'] font-bold text-5xl ${plan.hot ? "text-white" : "text-[#2B0A18]"}`}>
                    {plan.dict.price}
                  </span>
                  <span className={`font-['Montserrat'] text-xs font-semibold ${plan.hot ? "text-[#F0DCAE]" : "text-[#8A6B76]"}`}>
                    {b.pricingPerNote}
                  </span>
                </div>
                <ul className="mt-7 space-y-3 flex-1">
                  {plan.dict.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      <span
                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-[1px] ${
                          plan.hot ? "bg-[#FFD166] text-[#7A002A]" : "bg-[#F5EDDA] text-[#7A002A]"
                        }`}
                      >
                        <Check className="w-3 h-3" strokeWidth={3.5} />
                      </span>
                      <span
                        className={`font-['Montserrat'] text-[13.5px] leading-snug ${
                          plan.hot ? "text-white" : "text-[#45303B]"
                        } ${f.isBold ? "font-bold" : ""}`}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={checkoutLoading !== null}
                  className={`mt-8 w-full py-3.5 rounded-full font-['Montserrat'] font-bold text-sm transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 ${
                    plan.hot
                      ? "bg-white text-[#7A002A] hover:bg-[#F5EDDA] shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                      : "bg-[#7A002A] text-white hover:bg-[#660025] shadow-[0_10px_24px_rgba(122,0,42,0.3)]"
                  }`}
                >
                  {checkoutLoading === plan.key ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === "es" ? "Procesando pago seguro…" : "Processing secure payment…"}</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{b.pricingCta}</span>
                    </>
                  )}
                </button>
                <a
                  href={`${PHONE_SMS}?&body=${encodeURIComponent(plan.dict.secondaryActionMessage)}`}
                  onClick={() => track("click_zelle", { paquete: plan.key })}
                  className={`mt-3.5 text-center font-['Montserrat'] text-xs font-semibold underline underline-offset-4 transition ${
                    plan.hot
                      ? "text-[#F0DCAE] decoration-[#F0DCAE]/50 hover:text-white"
                      : "text-[#7A002A] decoration-[#B08D3C]/40 hover:text-[#B08D3C]"
                  }`}
                >
                  {b.pricingSecondaryText}
                </a>
              </div>
            ))}
          </div>

          <p className="text-center font-['Montserrat'] text-xs mt-10 text-[#8A6B76]">{t.pricing.trustBadgesText}</p>
          <p className="text-center font-['Montserrat'] text-xs text-[#8A6B76] mt-2">
            {t.pricing.venueFaqText}{" "}
            <a
              href={`${PHONE_SMS}?&body=${encodeURIComponent(
                lang === "es"
                  ? "Hola, me interesa conocer los paquetes por volumen para salones y wedding planners de Click & Love."
                  : "Hello! I am interested in volume packages for venues and wedding planners with Click & Love."
              )}`}
              onClick={() => track("click_sms", { origen: "volumen" })}
              className="text-[#7A002A] font-bold underline underline-offset-4 hover:text-[#B08D3C]"
            >
              {t.pricing.venueFaqLink}
            </a>
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* REVIEWS (restauradas del home anterior) */}
      {/* ============================================================== */}
      <section id="reviews" className="py-20 px-4 sm:px-6 bg-[#FFF7F9] scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#B08D3C]/40 bg-white font-['Montserrat'] text-[10.5px] tracking-[0.22em] uppercase text-[#7A002A] font-extrabold">
              {t.testimonials.pill}
            </span>
            <span className="font-vibes text-[32px] text-[#B08D3C] block leading-tight mt-4">{b.reviewsScript}</span>
            <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-[32px] text-[#2B0A18] mt-2 leading-snug">
              {t.testimonials.title}
            </h2>
            <p className="font-['Montserrat'] text-[15px] text-[#5A3C46] leading-relaxed mt-3">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {t.testimonials.items.map((item) => (
              <figure
                key={item.name}
                className="rounded-3xl bg-white border border-[#E7DCC8] p-7 flex flex-col shadow-[0_12px_28px_rgba(122,0,42,0.07)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-0.5" aria-label="5.0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#B08D3C] fill-[#B08D3C]" />
                    ))}
                  </span>
                  <span className="font-['Cinzel'] font-bold text-sm text-[#2B0A18]">5.0</span>
                </div>
                <blockquote className="font-['Montserrat'] text-[13.5px] italic text-[#45303B] leading-relaxed mt-4 flex-1">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-[#B08D3C]/50 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-['Montserrat'] font-extrabold text-[13.5px] text-[#2B0A18] leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="font-['Montserrat'] text-[11px] text-[#8A6B76] leading-snug">{item.event}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F5EDDA] font-['Montserrat'] text-[10.5px] font-extrabold text-[#7A002A]">
                      {item.metric}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-['Montserrat'] text-[10.5px] font-extrabold text-emerald-800 uppercase tracking-wide">
                      <BadgeCheck className="w-3 h-3" />
                      {b.verifiedLabel}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenDemo(item.demoSlug)}
                    className="mt-5 w-full py-2.5 rounded-full border-2 border-[#7A002A] text-[#7A002A] hover:bg-[#FFF0F4] font-['Montserrat'] font-bold text-[12px] tracking-wide uppercase transition active:scale-95 cursor-pointer"
                  >
                    {item.demoBtnText}
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* BANDA DE CONTACTO */}
      {/* ============================================================== */}
      <section className="bg-[#7A002A] py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-7 md:gap-10">
          <div className="flex items-center gap-4 text-center md:text-left flex-col sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt="" className="w-16 h-16 object-contain shrink-0" />
            <div>
              <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-[28px] text-white">{b.contactTitle}</h2>
              <p className="font-['Montserrat'] text-sm text-[#F0DCAE] mt-1">{b.contactText}</p>
            </div>
          </div>
          <div className="md:ml-auto flex flex-col items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-3">
              <a
                href={PHONE_TEL}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#7A002A] font-['Montserrat'] font-extrabold text-sm hover:bg-[#F5EDDA] transition active:scale-95"
              >
                <Phone className="w-4 h-4" />
                {b.contactCall}
              </a>
              <a
                href={PHONE_SMS}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFD166] text-[#2B0A18] font-['Montserrat'] font-extrabold text-sm hover:brightness-105 transition active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                {b.contactSms}
              </a>
            </div>
            <span className="font-['Montserrat'] font-bold text-[13px] text-[#F0DCAE]">{PHONE_DISPLAY}</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* LUXURY EDITORIAL FOOTER (BYQ / JIRO STYLE) */}
      {/* ============================================================== */}
      <SiteFooter lang={lang} />

      {/* ============================================================== */}
      {/* MODAL DE DEMO EN VIVO */}
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
