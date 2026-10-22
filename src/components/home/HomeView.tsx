"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Language, translations } from "@/lib/home-translations";
import HeroPhones from "@/components/home/HeroPhones";
import InteractiveDemoModal from "@/components/home/InteractiveDemoModal";

const PHONE_DISPLAY = "(818) 299-4882";
const PHONE_TEL = "tel:+18182994882";
const PHONE_SMS = "sms:+18182994882";

export default function HomeView({ initialLang = "en" }: { initialLang?: Language }) {
  const [lang, setLang] = useState<Language>(initialLang);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeDemoSlug, setActiveDemoSlug] = useState("isabella-xv");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const t = translations[lang];
  const b = t.brand;

  const handleOpenDemo = (slug: string = "isabella-xv") => {
    setActiveDemoSlug(slug);
    setIsDemoModalOpen(true);
  };

  const handleCheckout = async (plan: "assisted" | "vip" | string) => {
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
    { key: "assisted" as const, dict: t.pricing.plans[0], features: b.planFeatures.assisted, hot: false },
    { key: "vip" as const, dict: t.pricing.plans[1], features: b.planFeatures.vip, hot: true },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8FB] text-[#2B0A18] selection:bg-[#7A002A]/20 selection:text-[#2B0A18] font-['Montserrat'] overflow-x-hidden relative">
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
      <header className="sticky top-0 z-40 bg-[#FFF8FB]/92 backdrop-blur-md border-b border-[#F3CDDE]">
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
            <a href="#plantillas" className="hover:text-[#7A002A] transition">
              {b.navTemplates}
            </a>
            <a href="#precios" className="hover:text-[#7A002A] transition">
              {t.nav.pricing}
            </a>
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
              <span className="text-[#C2185B]/40 select-none">|</span>
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

            <a
              href="#precios"
              className="hidden sm:inline-flex px-5 py-2.5 bg-[#7A002A] hover:bg-[#660025] text-white rounded-full text-[13px] font-['Montserrat'] font-bold shadow-[0_6px_18px_rgba(122,0,42,0.35)] transition active:scale-95"
            >
              {b.createBtn}
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* HERO */}
      {/* ============================================================== */}
      <section className="relative px-4 sm:px-6 pt-12 pb-14 lg:pt-16 lg:pb-20 overflow-hidden">
        <div className="absolute -top-24 right-0 w-[520px] h-[420px] bg-[#FF5DA2]/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <p className="font-['Montserrat'] font-extrabold text-[12px] sm:text-[13px] tracking-[0.18em] uppercase text-[#C2185B]">
              {b.heroEyebrow}
            </p>
            <h1 className="font-['Cinzel'] font-bold text-[34px] sm:text-5xl xl:text-[56px] leading-[1.14] text-[#2B0A18] mt-4">
              {t.hero.title1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A002A] via-[#C2185B] to-[#7A002A]">
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
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-[#7A002A] text-[#7A002A] hover:bg-[#FFE3EF] font-['Montserrat'] font-bold text-sm text-center transition active:scale-95"
              >
                {b.heroCtaPricing}
              </a>
            </div>
            <p className="font-['Montserrat'] font-bold text-[13px] text-[#96690A] mt-6">{b.heroNote}</p>
          </div>

          {/* 3 teléfonos */}
          <HeroPhones />
        </div>
      </section>

      {/* ============================================================== */}
      {/* BANDA BORGOÑA DE BENEFICIOS */}
      {/* ============================================================== */}
      <section className="bg-[#7A002A] py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center">
          {b.strip.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="text-[#FF5DA2] font-extrabold">·</span>}
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
            <span className="font-vibes text-5xl text-[#C2185B] block leading-tight">{b.howScript}</span>
            <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-[32px] text-[#2B0A18] mt-2 leading-snug">
              {b.howTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {b.steps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-3xl bg-white border border-[#F3CDDE] p-7 shadow-[0_12px_28px_rgba(122,0,42,0.07)]"
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
      {/* PLANTILLAS REALES */}
      {/* ============================================================== */}
      <section id="plantillas" className="py-20 px-4 sm:px-6 bg-[#FFE3EF] scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-vibes text-5xl text-[#C2185B] block leading-tight">{b.tplScript}</span>
            <h2 className="font-['Cinzel'] font-bold text-2xl sm:text-[30px] text-[#2B0A18] mt-2 leading-snug">
              {b.tplTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {b.tplCards.map((card) => (
              <div
                key={card.slug}
                className="rounded-3xl bg-white border border-[#F3CDDE] overflow-hidden shadow-[0_12px_28px_rgba(122,0,42,0.08)] flex flex-col"
              >
                <a href={`/demo/${card.slug}`} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="h-56 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </a>
                <div className="p-6 flex flex-col gap-1.5">
                  <h3 className="font-['Montserrat'] font-extrabold text-lg text-[#2B0A18]">{card.name}</h3>
                  <p className="font-['Montserrat'] text-[13px] text-[#5A3C46]">{card.desc}</p>
                  <button
                    onClick={() => handleOpenDemo(card.slug)}
                    className="mt-3 self-start inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#7A002A] hover:bg-[#660025] text-white font-['Montserrat'] font-bold text-[12.5px] transition active:scale-95 cursor-pointer"
                  >
                    {b.tplViewDemo}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 font-['Montserrat'] font-bold text-sm text-[#7A002A] hover:text-[#C2185B] transition"
            >
              {lang === "es" ? "Ver el catálogo completo" : "Browse the full catalog"}
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
                    : "relative rounded-3xl bg-white border border-[#F3CDDE] p-8 flex flex-col shadow-[0_12px_28px_rgba(122,0,42,0.07)]"
                }
              >
                {plan.hot && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFD166] text-[#2B0A18] font-['Montserrat'] font-extrabold text-[10.5px] tracking-[0.18em] uppercase py-1.5 px-4 rounded-full shadow whitespace-nowrap">
                    {b.pricingFavorite}
                  </span>
                )}
                <h3
                  className={`font-['Montserrat'] font-extrabold text-xl ${
                    plan.hot ? "text-white" : "text-[#2B0A18]"
                  }`}
                >
                  {plan.dict.name}
                </h3>
                <div className="flex items-baseline gap-2.5 mt-4">
                  <span className={`font-['Cinzel'] font-bold text-5xl ${plan.hot ? "text-white" : "text-[#2B0A18]"}`}>
                    {plan.dict.price}
                  </span>
                  <span className={`font-['Montserrat'] text-xs font-semibold ${plan.hot ? "text-[#FFC7DC]" : "text-[#8A6B76]"}`}>
                    {b.pricingPerNote}
                  </span>
                </div>
                <ul className="mt-7 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span
                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-[1px] ${
                          plan.hot ? "bg-[#FFD166] text-[#7A002A]" : "bg-[#FFE3EF] text-[#7A002A]"
                        }`}
                      >
                        <Check className="w-3 h-3" strokeWidth={3.5} />
                      </span>
                      <span className={`font-['Montserrat'] text-[13.5px] leading-snug ${plan.hot ? "text-white" : "text-[#45303B]"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={checkoutLoading !== null}
                  className={`mt-8 w-full py-3.5 rounded-full font-['Montserrat'] font-bold text-sm transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 ${
                    plan.hot
                      ? "bg-white text-[#7A002A] hover:bg-[#FFE3EF] shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
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
                  className={`mt-3.5 text-center font-['Montserrat'] text-xs font-semibold underline underline-offset-4 transition ${
                    plan.hot
                      ? "text-[#FFC7DC] decoration-[#FFC7DC]/50 hover:text-white"
                      : "text-[#7A002A] decoration-[#C2185B]/40 hover:text-[#C2185B]"
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
              className="text-[#7A002A] font-bold underline underline-offset-4 hover:text-[#C2185B]"
            >
              {t.pricing.venueFaqLink}
            </a>
          </p>
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
              <p className="font-['Montserrat'] text-sm text-[#FFC7DC] mt-1">{b.contactText}</p>
            </div>
          </div>
          <div className="md:ml-auto flex flex-col items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-3">
              <a
                href={PHONE_TEL}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#7A002A] font-['Montserrat'] font-extrabold text-sm hover:bg-[#FFE3EF] transition active:scale-95"
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
            <span className="font-['Montserrat'] font-bold text-[13px] text-[#FFC7DC]">{PHONE_DISPLAY}</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FOOTER SIMPLE */}
      {/* ============================================================== */}
      <footer className="py-10 px-4 bg-[#FFF8FB]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 text-center">
          <p className="font-['Montserrat'] text-[13px] text-[#8A6B76]">{b.footerLine}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 font-['Montserrat'] text-xs text-[#8A6B76]">
            <Link href="/dashboard" className="font-semibold text-[#7A002A] hover:text-[#C2185B] transition">
              {t.footer.adminLink}
            </Link>
            <span>
              © {new Date().getFullYear()} Click &amp; Love. {t.footer.rights}
            </span>
          </div>
        </div>
      </footer>

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
