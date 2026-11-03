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
import BenefitsBento from "@/components/home/BenefitsBento";
import ServiceTabs from "@/components/home/ServiceTabs";
import ValueFeatures from "@/components/home/ValueFeatures";

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
      {/* BENTO GRID DE BENEFICIOS (good-biz-bento-1)                    */}
      {/* ============================================================== */}
      <BenefitsBento lang={lang} />

      {/* ============================================================== */}
      {/* COMPARATIVA / TABS DE SERVICIOS (nextwell-tabs-1)              */}
      {/* ============================================================== */}
      <ServiceTabs lang={lang} />

      {/* ============================================================== */}
      {/* BLOQUE DE CARACTERÍSTICAS (seven-nine-value-features-5)        */}
      {/* ============================================================== */}
      <ValueFeatures lang={lang} />

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
