"use client";
import SiteFooter from "@/components/layout/SiteFooter";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { translations, type Language } from "@/lib/home-translations";
import InteractiveDemoModal from "@/components/home/InteractiveDemoModal";
import Image from "next/image";
import {
  ArrowRight,
  CalendarPlus,
  Check,
  ChevronDown,
  Clock,
  Heart,
  Loader2,
  Mail,
  Menu,
  MessageCircle,
  Music,
  Phone,
  Play,
  Sparkles,
  Users,
  X,
} from "lucide-react";

// ============================================================================
// CONSTANTS & ASSETS
// ============================================================================
const PHONE_DISPLAY = "(818) 918-2519";
const PHONE_TEL = "tel:+18189182519";
const PHONE_SMS = "sms:+18182994882";
const WHATSAPP_URL =
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20a%20digital%20Save%20the%20Date.";
const DEMO_URL = "/save-the-date/demo";
// The live demo, verified 2026-11-18: Luna's Roaring 15th Celebration,
// Los Angeles, countdown to 2027-09-18T20:00:00Z.
const DEMO_COUNTDOWN_TARGET = new Date("2027-09-18T20:00:00Z").getTime();
const DEMO_PHOTO = "/assets/save-the-date/principal.jpeg";

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    mins: Math.floor(diff / 60000) % 60,
    secs: Math.floor(diff / 1000) % 60,
  };
}

const MENU_LANDING_LINKS = {
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

export default function SaveTheDateLandingPage() {
  const lang: Language = "en";
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeDemoSlug, setActiveDemoSlug] = useState("isabella-xv");
  const t = translations[lang];
  const b = t.brand;

  const handleOpenDemo = (slug: string = "isabella-xv") => {
    // Igual que la home: en móvil va directo a la demo a pantalla completa;
    // en escritorio abre el modal.
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
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const cd = useCountdown(DEMO_COUNTDOWN_TARGET);

  const handleCheckout = async () => {
    track("begin_checkout", { paquete: "save-the-date" });
    setCheckoutLoading("save-the-date");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "save-the-date", lang: "en" }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("There was an error starting checkout. Please try again.");
        setCheckoutLoading(null);
      }
    } catch (err) {
      console.error("Error en checkout:", err);
      alert("Connection error during checkout.");
      setCheckoutLoading(null);
    }
  };

  const faqs = [
    {
      q: "How do you send a digital save the date?",
      a: "You share a link — by text, WhatsApp, or email. Your guests tap it and the envelope opens on their phone: your photo, the date, a live countdown, and a button to add it to their calendar. No app to install, no account to create, nothing to print.",
    },
    {
      q: "Can you combine a save the date and RSVP?",
      a: "Yes. Every Save the Date includes Early RSVP: guests can already tell you if they plan to come, months before the formal invitation goes out. You see the early answers in your host dashboard, so you plan with real numbers instead of guesses.",
    },
    {
      q: "How much do save the dates cost?",
      a: "A digital Save the Date from Click and Love is $49, one time — envelope, countdown, Add to Calendar, Early RSVP, photo gallery, and music included. Printed save the dates cost more once you add design, printing, envelopes, and a stamp for every guest. The Save the Date is also included free in the VIP plan ($279).",
    },
    {
      q: "When should you send save the dates?",
      a: "Six to twelve months before the celebration. That is early enough for out-of-town guests to plan travel, and late enough that the date is firm. Your formal invitation goes out about eight weeks before the event.",
    },
    {
      q: "What should a save the date include?",
      a: "Four things: your names, the date, the city, and a way to save it. Ours adds the rest for you — your photo, a live countdown, an Add to Calendar button, and Early RSVP so you hear back right away.",
    },
  ];

  const features = [
    {
      icon: Mail,
      title: "An envelope with your photo",
      text: "Your guests tap the sealed envelope and it opens on their photo — the same unboxing moment as your invitation, in miniature.",
    },
    {
      icon: Clock,
      title: "A countdown that ticks",
      text: "Days, hours, minutes, seconds — live on the page. It turns a date on a card into something your guests keep checking.",
    },
    {
      icon: CalendarPlus,
      title: "Add to Calendar, one tap",
      text: "Google Calendar or Apple Calendar. One tap and your date is on their phone, with a reminder — no more “I forgot”.",
    },
    {
      icon: Users,
      title: "Early RSVP",
      text: "Guests can already say “we’ll be there” months ahead. You see the early headcount in your host dashboard.",
    },
    {
      icon: Heart,
      title: "Photo gallery",
      text: "A few favorite photos of the guest of honor, right inside the Save the Date. It feels personal, not like a form.",
    },
    {
      icon: Music,
      title: "Your music, in two languages",
      text: "The page plays your song and speaks English and Spanish — every guest reads it in their language.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#2B0A18]">
      {/* ============================================================== */}
      {/* BARRA SUPERIOR BORGOÑA — igual que la home */}
      {/* ============================================================== */}
      <div className="bg-[#7A002A] text-white py-2.5 px-4 text-center">
        <span className="font-['Montserrat'] text-[11px] sm:text-xs font-semibold tracking-wide">
          {b.topbar}
        </span>
      </div>

      {/* ============================================================== */}
      {/* HEADER CON LOGO NUEVO — igual que la home */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#FDFBF8]/92 backdrop-blur-md border-b border-[#E7DCC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[76px] flex items-center justify-between gap-3">
          {/* Logo: corazón a color + wordmark */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Click and Love">
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
            <a href="/#como-funciona" className="hover:text-[#7A002A] transition">
              {t.nav.howItWorks}
            </a>
            <a href="/#comparativa" className="hover:text-[#7A002A] transition">
              {t.nav.compare}
            </a>
            <a href="/#plantillas" className="hover:text-[#7A002A] transition">
              {b.navTemplates}
            </a>
            <a href="/#prices" className="hover:text-[#7A002A] transition">
              {t.nav.pricing}
            </a>
            <a href="/#reviews" className="hover:text-[#7A002A] transition">
              {b.navReviews}
            </a>
            <div className="relative">
              <button
                onClick={() => setServicesOpen((v) => !v)}
                className="hover:text-[#7A002A] transition cursor-pointer"
                aria-expanded={servicesOpen}
              >
                Services ▾
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
            {/* Toggle ES | EN */}
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#5A3C46]">
              <Link
                href="/es/save-the-date"
                className="px-1.5 py-0.5 rounded transition text-[#A98B96] hover:text-[#7A002A]"
                aria-label="Cambiar a Español"
              >
                ES
              </Link>
              <span className="text-[#B08D3C]/50 select-none">|</span>
              <Link
                href="/save-the-date"
                className="px-1.5 py-0.5 rounded transition text-[#7A002A] border-b-2 border-[#7A002A]"
                aria-label="Switch to English"
              >
                EN
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#E7DCC8] text-[#2B0A18] transition"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a
              href="/#prices"
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
            <a href="/#como-funciona" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {t.nav.howItWorks}
            </a>
            <a href="/#comparativa" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {t.nav.compare}
            </a>
            <a href="/#plantillas" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {b.navTemplates}
            </a>
            <a href="/#prices" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {t.nav.pricing}
            </a>
            <a href="/#reviews" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#7A002A] transition">
              {b.navReviews}
            </a>
            <p className="pt-3 mt-1 border-t border-[#E7DCC8] text-xs font-bold tracking-widest text-[#7A002A]">
              SERVICES
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

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-10 items-center">
          <div>
            <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A]">
              Save the Date &middot; Digital
            </p>
            <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] font-bold text-[#2B0A18] mt-4">
              Digital Save the Date Invitations
            </h1>
            <p className="text-lg text-[#5C3A45] font-light leading-relaxed mt-5 max-w-xl">
              Your date, on their phone, months before the invitation. An envelope
              with your photo, a countdown that ticks, one tap to save it to the
              calendar — and your guests can already say they&rsquo;ll be there.
            </p>
            <p className="text-base text-[#5C3A45] mt-4 max-w-xl">
              <span className="font-bold text-[#7A002A]">$49, one time.</span>{" "}
              No printing, no stamps, no app to install. Send it 6 to 12 months
              before the celebration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading !== null}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#7A002A] text-white font-bold text-sm shadow-[0_16px_32px_rgba(122,0,42,0.35)] hover:bg-[#5F0020] transition-all disabled:opacity-70"
              >
                {checkoutLoading === "save-the-date" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Get your Save the Date — $49
              </button>
              <Link
                href={DEMO_URL}
                onClick={() => track("click_demo", { pagina: "save-the-date" })}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white border border-[#E7DCC8] text-[#7A002A] font-bold text-sm shadow-sm hover:border-[#D4AF37] transition-all"
              >
                <Play className="w-4 h-4" />
                See the live demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-[#8A6B73] mt-4">
              English &amp; Spanish &middot; Works on any phone &middot; Also included free in the VIP plan
            </p>
          </div>

          {/* The real demo, in a phone frame — countdown ticks live */}
          <div className="flex justify-center">
            <div className="w-[320px] sm:w-[340px] rounded-[2.5rem] border-[10px] border-[#1A1A1A] bg-[#1A1A1A] shadow-[0_30px_60px_rgba(43,10,24,0.35)] overflow-hidden">
              <div className="relative">
                <Image
                  src={DEMO_PHOTO}
                  alt="Luna — Save the Date demo"
                  width={680}
                  height={880}
                  className="w-full h-[380px] object-cover object-[center_18%]"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pt-10 pb-3">
                  <p className="font-['Great_Vibes',cursive] text-3xl text-[#F5E6AB] leading-none">Luna</p>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-white/85 mt-1">
                    Luna&rsquo;s Roaring 15th Celebration
                  </p>
                </div>
              </div>
              <div className="bg-[#0d0d0d] px-4 pt-4 pb-5 text-center">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold">Countdown</p>
                <div className="flex justify-center gap-3 mt-2">
                  {[
                    { v: cd.days, l: "Days" },
                    { v: cd.hours, l: "Hrs" },
                    { v: cd.mins, l: "Min" },
                    { v: cd.secs, l: "Sec" },
                  ].map((u) => (
                    <div key={u.l} className="w-14 rounded-lg bg-white/5 border border-white/10 py-2">
                      <p className="text-xl font-bold text-white tabular-nums leading-none">
                        {String(u.v).padStart(2, "0")}
                      </p>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-white/50 mt-1">{u.l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold py-2.5">
                    <CalendarPlus className="w-3.5 h-3.5" /> Add to Calendar
                  </span>
                  <span className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/25 text-white text-xs font-semibold py-2.5">
                    <Users className="w-3.5 h-3.5" /> Early RSVP
                  </span>
                </div>
                <p className="text-[11px] text-white/45 mt-3 flex items-center justify-center gap-1.5">
                  <Music className="w-3 h-3" /> The Stranglers — Golden Brown
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-[#8A6B73] mt-8">
          Above: the real live demo — Luna&rsquo;s Save the Date, counting down right now.{" "}
          <Link href={DEMO_URL} className="underline text-[#7A002A] font-semibold">Open it and tap around.</Link>
        </p>
      </section>

      {/* ================= WHAT'S INSIDE ================= */}
      <section id="inside" className="bg-white border-y border-[#EFE6D4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A] text-center">
            What&rsquo;s inside
          </p>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-center mt-3">
            Everything a save the date should do
          </h2>
          <p className="text-center text-[#5C3A45] font-light max-w-2xl mx-auto mt-3">
            Not a picture of a card. A small interactive page your guests actually
            open, save, and answer.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-[#EFE6D4] bg-[#FAF5EC]/60 p-6">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#7A002A] text-[#F5E6AB]">
                  <f.icon className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-lg mt-4">{f.title}</h3>
                <p className="text-sm text-[#5C3A45] leading-relaxed mt-1.5">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHEN TO SEND ================= */}
      <section id="when" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A]">
              When to send it
            </p>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold mt-3 leading-tight">
              First the Save the Date. Then the invitation.
            </h2>
            <p className="text-[#5C3A45] font-light leading-relaxed mt-4">
              The Save the Date is not the invitation — it is the heads-up that
              makes the invitation work. Guests who already saved the date and
              already said they&rsquo;ll come are the ones who show up.
            </p>
          </div>
          <ol className="space-y-0">
            {[
              {
                when: "6 to 12 months before",
                what: "Send the Save the Date",
                text: "Names, date, city, and a link. Out-of-town guests book travel; everyone else puts it on the calendar.",
              },
              {
                when: "About 8 weeks before",
                what: "Send the formal invitation",
                text: "All the details — venue, time, dress code, and the full RSVP with your guest list and passes.",
              },
              {
                when: "The week of the event",
                what: "Guests arrive knowing the plan",
                text: "Early RSVP already told you who is coming. No chasing, no guessing the headcount.",
              },
            ].map((s, i) => (
              <li key={s.what} className="flex gap-4 pb-6 last:pb-0">
                <span className="flex flex-col items-center">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#7A002A] text-white text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  {i < 2 ? <span className="w-px flex-1 bg-[#E7DCC8] mt-1" /> : null}
                </span>
                <div className="pt-1">
                  <p className="text-xs font-extrabold tracking-[0.15em] uppercase text-[#96690A]">{s.when}</p>
                  <h3 className="font-bold text-lg mt-0.5">{s.what}</h3>
                  <p className="text-sm text-[#5C3A45] leading-relaxed mt-1">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="bg-white border-y border-[#EFE6D4]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A] text-center">
            Pricing
          </p>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-center mt-3">
            $49 on its own. Free inside VIP.
          </h2>
          <p className="text-center text-[#5C3A45] font-light max-w-2xl mx-auto mt-3">
            Buy just the Save the Date, or get it included with the full VIP
            invitation — matching design, photo album, and everything else.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-3xl mx-auto items-stretch">
            <div className="relative rounded-3xl bg-white border border-[#E7DCC8] p-8 flex flex-col shadow-[0_12px_28px_rgba(122,0,42,0.07)]">
              <span className="font-['Montserrat'] text-[10.5px] font-extrabold tracking-[0.18em] uppercase text-[#96690A]">
                Save the Date — alone
              </span>
              <p className="mt-4">
                <span className="font-['Playfair_Display',serif] text-5xl font-bold">$49</span>
                <span className="text-[#5C3A45] text-sm"> one time</span>
              </p>
              <ul className="space-y-2.5 mt-6 text-sm text-[#3A1B26] flex-1">
                {[
                  "Envelope with your photo",
                  "Live countdown",
                  "Add to Calendar (Google / Apple)",
                  "Early RSVP with host dashboard",
                  "Photo gallery + your music",
                  "English & Spanish",
                ].map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Check className="w-4 h-4 text-[#7A002A] shrink-0 mt-0.5" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading !== null}
                className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#7A002A] text-white font-bold text-sm hover:bg-[#5F0020] transition-all disabled:opacity-70"
              >
                {checkoutLoading === "save-the-date" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Buy Save the Date — $49
              </button>
            </div>
            <div className="relative rounded-3xl bg-[#7A002A] text-white p-8 flex flex-col shadow-[0_22px_45px_rgba(122,0,42,0.35)] border-2 border-[#FFD166]/40">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFD166] text-[#2B0A18] font-['Montserrat'] font-extrabold text-[10.5px] tracking-[0.18em] uppercase py-1.5 px-4 rounded-full shadow whitespace-nowrap">
                Best value
              </span>
              <span className="font-['Montserrat'] text-[10.5px] font-extrabold tracking-[0.18em] uppercase text-[#FFD166]">
                VIP All-Inclusive
              </span>
              <p className="mt-4">
                <span className="font-['Playfair_Display',serif] text-5xl font-bold">$279</span>
                <span className="text-white/70 text-sm"> one time</span>
              </p>
              <ul className="space-y-2.5 mt-6 text-sm flex-1">
                {[
                  "Save the Date included ($49 value)",
                  "Full digital invitation, matching design",
                  "Live guest photo album with table QR cards",
                  "Up to 400 SMS RSVPs + reminders",
                  "Unlimited revisions until your celebration",
                ].map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Check className="w-4 h-4 text-[#FFD166] shrink-0 mt-0.5" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                onClick={() => track("click_pricing", { pagina: "save-the-date" })}
                className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFD166] text-[#2B0A18] font-bold text-sm hover:brightness-105 transition-all"
              >
                See VIP on Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-[#8A6B73] mt-6">
            One-time payment, secure checkout. Your guests never pay anything and never need an account.
          </p>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A] text-center">
          Questions
        </p>
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-center mt-3">
          Frequently asked questions
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => {
            const open = activeFaq === idx;
            return (
              <div key={faq.q} className="rounded-2xl border border-[#E7DCC8] bg-white overflow-hidden">
                <button
                  onClick={() => setActiveFaq(open ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  aria-expanded={open}
                >
                  <span className="font-bold text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 text-[#7A002A] transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open ? (
                  <p className="px-6 pb-5 text-sm text-[#5C3A45] leading-relaxed">{faq.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#2B0A18] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#FFD166]">
            <Sparkles className="w-4 h-4" /> Fast delivery
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
            Ready to save your date?
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-light max-w-2xl mx-auto mt-4">
            Send us your photo and your date — we build your Save the Date and
            send you the link to share. $49, one time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mt-9">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading !== null}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FFD166] text-[#2B0A18] font-bold text-sm shadow-xl hover:brightness-105 transition-all disabled:opacity-70"
            >
              {checkoutLoading === "save-the-date" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              Get yours — $49
            </button>
            <a
              href={WHATSAPP_URL}
              onClick={() => track("click_whatsapp", { origen: "landing", pagina: "save-the-date" })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#E5C158]" />
              <span>Message us on WhatsApp</span>
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/50">
            <a href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "save-the-date" })} className="hover:text-white transition-colors underline">
              Call {PHONE_DISPLAY}
            </a>
            <a href={PHONE_SMS} onClick={() => track("click_sms", { origen: "landing", pagina: "save-the-date" })} className="hover:text-white transition-colors underline">
              Or text us via SMS: (818) 299-4882
            </a>
          </div>
        </div>
      </section>

      <SiteFooter lang="en" />
      <InteractiveDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        initialSlug={activeDemoSlug}
        lang="en"
      />
    </div>
  );
}
