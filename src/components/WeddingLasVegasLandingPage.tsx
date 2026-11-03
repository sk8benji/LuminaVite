"use client";

import React, { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Heart,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Music,
  Navigation,
  Phone,
  Play,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Utensils,
  Volume2,
  X,
  Zap,
} from "lucide-react";

// ============================================================================
// CONSTANTS & ASSETS
// ============================================================================
const PHONE_DISPLAY = "(818) 299-4882";
const PHONE_TEL = "tel:+18182994882";
const PHONE_SMS = "sms:+18182994882";
const WHATSAPP_URL =
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20information%20about%20Wedding%20invitations%20in%20Las%20Vegas.";

interface WeddingTemplateItem {
  id: string;
  name: string;
  tag: string;
  slug: string;
  image: string;
  palette: string;
  description: string;
  highlights: string[];
}

const WEDDING_TEMPLATES_LIST: WeddingTemplateItem[] = [
  {
    id: "emma-and-lucas",
    name: "Fairytale Castle (Emma & Lucas)",
    tag: "Gala & Black Tie",
    slug: "emma-and-lucas",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    palette: "Pearl Ivory • Champagne Gold • Onyx",
    description: "Imperial ballroom aesthetic with royal wax seal unboxing, dual monograms, first-dance song player, and plated dinner selector.",
    highlights: ["Interactive 3D Envelope", "Plated dinner entrée choice", "Live guest photo upload wall"],
  },
  {
    id: "sofia-y-alejandro",
    name: "Hacienda Romance (Sofía & Alejandro)",
    tag: "Romance & Garden",
    slug: "sofia-y-alejandro",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    palette: "Eucalyptus Green • Warm Rose • Ivory",
    description: "Romantic garden atmosphere with botanical borders, church & reception dual itinerary, gift registry links, and Waze navigation.",
    highlights: ["Bilingual EN / ES switcher", "Dual-venue itinerary (Church + Reception)", "Honeyfund / Zelle registry"],
  },
  {
    id: "classic-ivory",
    name: "Classic Elegance & Monogram",
    tag: "Traditional Wedding",
    slug: "emma-and-lucas",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    palette: "Crisp White • Rich Burgundy • Gold Foil",
    description: "Understated luxury with embossed gold letters, dress code visual cards, hotel block recommendations, and 1-tap SMS confirmations.",
    highlights: ["Dress code style guide", "Hotel accommodations block", "Strict plus-one pass control"],
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function WeddingLasVegasLandingPage() {
  // Envelope unboxing state for hero phone mockup
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Meal selection simulator in Bento Grid
  const [selectedMeal, setSelectedMeal] = useState<"beef" | "salmon" | "vegan">("beef");

  const handleCheckout = async (plan: "assisted" | "vip") => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          templateSlug: "emma-and-lucas",
          currency: "usd",
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        window.location.href = WHATSAPP_URL;
      }
    } catch {
      window.location.href = WHATSAPP_URL;
    } finally {
      setCheckoutLoading(null);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#2B0A18] font-['Montserrat',sans-serif] selection:bg-[#7A002A] selection:text-white">
      {/* ==================================================================== */}
      {/* 1. STICKY MINIMALIST TOP NAVBAR */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-50 bg-[#FDFBF8]/90 backdrop-blur-md border-b border-[#2B0A18]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A002A]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src="/logo.png"
              alt="Click & Love"
              width={1600}
              height={1600}
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-['Playfair_Display',serif] text-xl font-bold tracking-tight text-[#2B0A18]">
                Click &amp; Love
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#B08D3C] font-semibold">
                Weddings • Las Vegas
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2B0A18]/80">
            <a
              href="#features"
              className="hover:text-[#7A002A] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#7A002A] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#7A002A] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#7A002A] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              How It Works
            </a>
            <a
              href="#templates"
              className="hover:text-[#7A002A] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#7A002A] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Wedding Demos
            </a>
            <a
              href="#pricing"
              className="hover:text-[#7A002A] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#7A002A] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-[#7A002A] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#7A002A] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "wedding-invitations-las-vegas" })}
              className="hidden lg:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border border-[#2B0A18]/15 text-[#2B0A18] hover:border-[#7A002A] hover:text-[#7A002A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B08D3C]" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "wedding-invitations-las-vegas" })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A002A] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#7A002A]/20 hover:bg-[#5C0020] active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Book via WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. HERO SECTION (2 Columns on Desktop) */}
      {/* ==================================================================== */}
      <section className="relative pt-12 pb-20 md:py-24 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#7A002A]/10 via-[#B08D3C]/10 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Las Vegas Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7A002A]/5 border border-[#7A002A]/20 text-[#7A002A] text-xs font-semibold tracking-wide mb-6">
                <MapPin className="w-3.5 h-3.5 text-[#B08D3C]" />
                <span>Serving Las Vegas</span>
              </div>

              {/* H1 Headline */}
              <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B0A18] leading-[1.12] tracking-tight mb-6">
                Wedding Digital Invitations in{" "}
                <span className="italic font-normal text-[#7A002A] underline decoration-[#B08D3C]/60 decoration-wavy">
                  Las Vegas
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-[#2B0A18]/80 leading-relaxed mb-8 max-w-2xl font-light">
                Give your wedding guests an unforgettable luxury experience: virtual 3D wax seal unboxing, romantic first-dance music, entrée meal preferences, and zero apps or accounts to download.
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-[#2B0A18]/10 w-full max-w-xl">
                <div className="flex items-center gap-1 text-[#B08D3C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B08D3C] text-[#B08D3C]" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#2B0A18]">
                  4.98 / 5 Rating
                </span>
                <span className="text-xs text-[#2B0A18]/60">
                  • Trusted by 850+ couples &amp; planners
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <a
                  href="#templates"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#7A002A] to-[#9B113F] text-white text-base font-semibold shadow-xl shadow-[#7A002A]/25 hover:shadow-2xl hover:shadow-[#7A002A]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <Sparkles className="w-5 h-5 text-[#E5C158]" />
                  <span>Explore Wedding Demos</span>
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#2B0A18]/20 bg-white/70 text-[#2B0A18] text-base font-semibold hover:border-[#7A002A] hover:text-[#7A002A] hover:bg-white transition-all text-center"
                >
                  <span>See Packages ($99 - $199)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Micro-guarantees */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[#2B0A18]/70">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  No guest app required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  1-Tap GPS to LA venues
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Zero third-party ads
                </span>
              </div>
            </div>

            {/* Right Column: Floating Realistic Mobile Mockup with 3D Envelope */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                {/* Floating ambient badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-[#B08D3C]/30 flex items-center gap-2 text-xs font-semibold text-[#2B0A18] animate-bounce">
                  <Sparkles className="w-4 h-4 text-[#B08D3C]" />
                  <span>Click envelope to unbox!</span>
                </div>

                {/* iPhone Hardware Frame */}
                <div className="relative rounded-[44px] p-3.5 bg-gradient-to-b from-[#3A222A] via-[#1A050E] to-[#120309] shadow-2xl shadow-[#1A050E]/40 border-4 border-[#5A3844]">
                  {/* Speaker & camera dynamic island pill */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e24] ring-1 ring-white/10" />
                  </div>

                  {/* Phone Screen Canvas */}
                  <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-b from-[#2B0A18] via-[#1A050E] to-[#100308] text-white p-5 pt-12 pb-6 min-h-[580px] flex flex-col justify-between">
                    {/* Event Header Pill */}
                    <div className="text-center">
                      <span className="inline-block text-[10px] tracking-widest uppercase font-semibold text-[#B08D3C] px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                        Wedding Celebration
                      </span>
                      <h3 className="font-['Playfair_Display',serif] text-xl font-bold tracking-tight text-white">
                        Emma &amp; Lucas
                      </h3>
                      <p className="text-[11px] text-white/70">
                        Saturday, October 17, 2026 • Pasadena, CA
                      </p>
                    </div>

                    {/* Interactive 3D Envelope Canvas */}
                    <div
                      onClick={() => setEnvelopeOpen(!envelopeOpen)}
                      className="my-auto cursor-pointer group select-none relative perspective-1000"
                    >
                      {/* Envelope Body Container */}
                      <div className="relative mx-auto w-[240px] h-[160px] bg-[#EFEAE2] rounded-xl shadow-2xl border border-[#D8CEBE] overflow-visible transition-all duration-700">
                        {/* Foil Gold Floral Edges */}
                        <div className="absolute inset-2 border border-[#B08D3C]/40 rounded-lg pointer-events-none" />

                        {/* Invitation Card sliding out when open */}
                        <div
                          className={`absolute inset-x-2 bg-white rounded-lg shadow-xl p-3 border border-[#E8DEC8] flex flex-col items-center justify-center text-center transition-all duration-700 ${
                            envelopeOpen
                              ? "-translate-y-20 z-20 opacity-100 shadow-2xl"
                              : "translate-y-2 z-0 opacity-80"
                          }`}
                        >
                          <span className="text-[9px] uppercase tracking-wider text-[#B08D3C] font-semibold">
                            Save the Date
                          </span>
                          <h4 className="font-['Playfair_Display',serif] text-sm font-bold text-[#2B0A18] my-0.5">
                            Emma &amp; Lucas
                          </h4>
                          <p className="text-[9px] text-[#2B0A18]/70">
                            The Langham Huntington • Pasadena
                          </p>
                          <div className="mt-1.5 flex items-center gap-1 text-[8px] font-semibold text-[#7A002A] bg-[#7A002A]/10 px-2 py-0.5 rounded-full">
                            <Utensils className="w-2.5 h-2.5" />
                            <span>Entrée: Filet Mignon / Salmon</span>
                          </div>
                        </div>

                        {/* Top Flap with 3D Rotation */}
                        <div
                          style={{ transformOrigin: "top center" }}
                          className={`absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#E5DEC9] to-[#DDD4BE] rounded-t-xl border-b border-[#C7BA9F] transition-transform duration-700 z-10 flex items-center justify-center ${
                            envelopeOpen ? "rotate-x-180 -translate-y-full opacity-40" : "rotate-x-0 opacity-100"
                          }`}
                        >
                          {/* Wax Seal */}
                          <div className="w-10 h-10 rounded-full bg-[#7A002A] text-white flex items-center justify-center shadow-lg border-2 border-[#B08D3C] font-['Playfair_Display',serif] text-xs font-bold">
                            E&amp;L
                          </div>
                        </div>

                        {/* Bottom Envelope Pocket */}
                        <div className="absolute bottom-0 inset-x-0 h-[100px] bg-gradient-to-t from-[#EFEAE2] to-[#E5DEC9] rounded-b-xl z-10 flex flex-col items-center justify-end pb-3">
                          <p className="text-[10px] font-medium text-[#2B0A18]/80 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#B08D3C]" />
                            {envelopeOpen ? "Touch to close envelope" : "Tap to open invitation"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Music & RSVP Widget Bar */}
                    <div className="space-y-2">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setMusicPlaying(!musicPlaying)}
                            className="w-8 h-8 rounded-full bg-[#B08D3C] text-[#2B0A18] flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-transform"
                          >
                            {musicPlaying ? (
                              <Volume2 className="w-4 h-4 animate-pulse" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>
                          <div>
                            <p className="text-[11px] font-semibold text-white leading-tight">
                              Can&apos;t Help Falling in Love
                            </p>
                            <p className="text-[9px] text-white/60">
                              {musicPlaying ? "Playing live preview..." : "Romantic Acoustic Strings"}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#B08D3C] font-mono">03:42</span>
                      </div>

                      <button
                        onClick={() => setEnvelopeOpen(true)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Confirm Attendance (RSVP)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. ASYMMETRIC BENTO GRID (Key Wedding Features) */}
      {/* ==================================================================== */}
      <section id="features" className="py-20 md:py-24 bg-white border-y border-[#2B0A18]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Flawless Wedding Coordination
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Everything Couples Need to Welcome Their Guests in Style
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Replace outdated paper RSVP cards and lost emails with an all-in-one digital experience your guests actually enjoy.
            </p>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 (Large - Spans 2 Columns): Meal & Pass Management */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center mb-6">
                  <Utensils className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Catering &amp; Dietary Precision
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Strict Meal Preferences &amp; Plus-One Pass Control
                </h3>
                <p className="text-[#2B0A18]/75 text-sm sm:text-base leading-relaxed mb-6">
                  Assign exact seat counts per couple or family. As guests confirm, they select their preferred plated entrée (Filet Mignon, Grilled Salmon, Vegetarian) and enter allergies, giving your caterer exact tallies without spreadsheets.
                </p>

                {/* Interactive Simulation of Host Dashboard & Meal Selector */}
                <div className="bg-white rounded-2xl p-5 border border-[#2B0A18]/10 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2B0A18]/10 text-xs">
                    <span className="font-bold text-[#2B0A18]">
                      Host Live Banquet Breakdown • 140 Guests Assigned
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                      112 Confirmed (80%)
                    </span>
                  </div>

                  {/* Entrée breakdown buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedMeal("beef")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMeal === "beef"
                          ? "border-[#7A002A] bg-[#7A002A]/5 ring-2 ring-[#7A002A]/20"
                          : "border-[#2B0A18]/10 hover:border-[#2B0A18]/30"
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#2B0A18]">Prime Beef Tenderloin</p>
                      <p className="text-lg font-bold text-[#7A002A] mt-1">58</p>
                      <p className="text-[10px] text-[#2B0A18]/60">52% of guests</p>
                    </button>

                    <button
                      onClick={() => setSelectedMeal("salmon")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMeal === "salmon"
                          ? "border-[#7A002A] bg-[#7A002A]/5 ring-2 ring-[#7A002A]/20"
                          : "border-[#2B0A18]/10 hover:border-[#2B0A18]/30"
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#2B0A18]">Herb-Crusted Salmon</p>
                      <p className="text-lg font-bold text-[#7A002A] mt-1">42</p>
                      <p className="text-[10px] text-[#2B0A18]/60">38% of guests</p>
                    </button>

                    <button
                      onClick={() => setSelectedMeal("vegan")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMeal === "vegan"
                          ? "border-[#7A002A] bg-[#7A002A]/5 ring-2 ring-[#7A002A]/20"
                          : "border-[#2B0A18]/10 hover:border-[#2B0A18]/30"
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#2B0A18]">Wild Truffle Risotto</p>
                      <p className="text-lg font-bold text-[#7A002A] mt-1">12</p>
                      <p className="text-[10px] text-[#2B0A18]/60">10% vegan / GF</p>
                    </button>
                  </div>

                  {/* Sample guest confirmation row */}
                  <div className="bg-[#FDFBF8] p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2B0A18]">Dr. &amp; Mrs. Harrison • 2 Passes</p>
                      <p className="text-[11px] text-[#2B0A18]/70">
                        Selected: 1 Tenderloin, 1 Salmon • No peanut allergy
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      Confirmed via SMS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Instant 1-Click SMS Confirmations */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#B08D3C]/10 text-[#B08D3C] flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  98%+ Open Rate
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Instant SMS Confirmations
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  No passwords to remember and no app to install. Guests tap their private invitation link and confirm attendance with a single tap.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#2B0A18]/10 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SMS verified in real-time</span>
                </div>
                <p className="text-[#2B0A18]/70 text-[11px]">
                  Automatic RSVP reminder sent 14 days before your deadline to keep your guest list finalized on schedule.
                </p>
              </div>
            </div>

            {/* Card 3: 1-Tap Direct Venue Navigation to Popular LA Halls */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center mb-6">
                  <Navigation className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Zero Lost Guests
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  1-Tap GPS to Iconic Vegas Venues
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  Guests open driving directions directly in Google Maps, Apple Maps, or Waze. Pre-mapped with ceremony and reception parking instructions.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#2B0A18]/10">
                  <span className="font-semibold text-[#2B0A18]">Bellagio</span>
                  <span className="text-[#B08D3C] font-semibold text-[11px]">Waze &amp; Maps</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#2B0A18]/10">
                  <span className="font-semibold text-[#2B0A18]">Caesars Palace</span>
                  <span className="text-[#B08D3C] font-semibold text-[11px]">Waze &amp; Maps</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#2B0A18]/10">
                  <span className="font-semibold text-[#2B0A18]">Wynn Las Vegas</span>
                  <span className="text-[#B08D3C] font-semibold text-[11px]">Waze &amp; Maps</span>
                </div>
              </div>
            </div>

            {/* Card 4 (Spans 2 Columns): 3D Unboxing & First Dance Audio */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-[#2B0A18] to-[#1A050E] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#E5C158] flex items-center justify-center mb-6 border border-white/10">
                  <Music className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
                  Royal Digital Experience
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
                  Custom Wax Seal Unboxing &amp; Romantic First Dance Music
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                  No flat PDFs or boring image attachments. When your guests open your personalized link, the customized 3D wax seal breaks, revealing your wedding announcement while your chosen song begins playing smoothly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Dual Monograms</p>
                    <p className="text-white/70 text-[11px]">
                      Initials stamped on realistic virtual wax seals.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Zero Third-Party Ads</p>
                    <p className="text-white/70 text-[11px]">
                      100% white-label elegance without intrusive banners.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Guest Photo Wall</p>
                    <p className="text-white/70 text-[11px]">
                      Guests upload candid reception photos straight to your gallery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. THREE-STEP WORKFLOW ("How It Works") */}
      {/* ==================================================================== */}
      <section id="how-it-works" className="py-20 md:py-24 bg-[#FAF5EC]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Simple 3-Step Process
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              From Concept to Your Guests&apos; Phones in 48 Hours
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              We handle the digital assembly, layout polishing, and host panel setup so you can focus on enjoying your engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="relative p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  01
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Pick Your Wedding Theme
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Browse our luxury collections: Fairytale Castle, Hacienda Romance, or Classic Monogram. Submit your couple names, wedding date, church &amp; reception addresses, and song choice.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>View template live preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  02
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Review &amp; Personalize
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Our team curates your interactive invitation, fine-tunes your wax seal, uploads your engagement photos, and configures your custom guest meal preferences and pass rules.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Dedicated support via WhatsApp/Phone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  03
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Share &amp; Watch RSVPs Stream In
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Send your private link via SMS, WhatsApp, or iMessage. Track confirmed guests, companion names, and entrée counts live on your private host dashboard.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Live host dashboard included</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. VISUAL TEMPLATES CATALOG (Real Wedding Demos) */}
      {/* ==================================================================== */}
      <section id="templates" className="py-20 md:py-24 bg-white border-b border-[#2B0A18]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
                Luxury Wedding Demos
              </span>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2">
                Explore Our Interactive Wedding Collections
              </h2>
              <p className="text-base text-[#2B0A18]/70 mt-2 font-light">
                Each collection includes custom wax seals, dual monograms, music players, and GPS integration.
              </p>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A002A] hover:text-[#5C0020] transition-colors self-start md:self-end"
            >
              <span>View All 8+ Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WEDDING_TEMPLATES_LIST.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-3xl bg-[#FDFBF8] border border-[#2B0A18]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Mobile Preview Aspect Ratio Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                  <Image
                    src={tpl.image}
                    alt={tpl.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-[#2B0A18] shadow">
                      {tpl.tag}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-4 inset-x-4 text-white">
                    <p className="text-[11px] uppercase tracking-wider text-[#E5C158] font-semibold">
                      {tpl.palette}
                    </p>
                    <h3 className="font-['Playfair_Display',serif] text-xl font-bold mt-0.5">
                      {tpl.name}
                    </h3>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#2B0A18]/75 leading-relaxed mb-4">
                      {tpl.description}
                    </p>

                    <ul className="space-y-1.5 mb-6 text-xs text-[#2B0A18]/85">
                      {tpl.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#B08D3C]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#2B0A18]/10 flex items-center justify-between gap-3">
                    <Link
                      href={`/demo/${tpl.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A002A] hover:text-[#5C0020] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview Live Demo</span>
                    </Link>

                    <button
                      onClick={() => handleCheckout("assisted")}
                      className="px-4 py-2 rounded-xl bg-[#7A002A] text-white text-xs font-semibold hover:bg-[#5C0020] transition-colors"
                    >
                      Choose Design
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. PRICING TABLE (Plan Assisted $99 vs Plan VIP $199) */}
      {/* ==================================================================== */}
      <section id="pricing" className="py-20 md:py-24 bg-[#FAF5EC]/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Transparent Wedding Pricing
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              One Flat Fee. Unlimited Guests. Zero Hidden Charges.
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Unlike other platforms that charge per guest or surprise you with monthly renewal fees, our price covers your entire wedding celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Plan Assisted ($99) */}
            <div className="rounded-3xl p-8 bg-white border border-[#2B0A18]/15 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18]">
                    Plan Assisted
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#B08D3C] bg-[#B08D3C]/10 px-2.5 py-1 rounded-full">
                    Essential
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-[#2B0A18]">$99</span>
                  <span className="text-xs text-[#2B0A18]/60 uppercase tracking-wider font-medium">
                    One-Time Payment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#2B0A18]/70 mb-6">
                  Perfect for couples with their schedule ready who want a beautiful 3D digital invitation with live SMS confirmations.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-[#2B0A18]/85 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Interactive 3D unboxing envelope with custom wax seal</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Instant SMS attendance confirmations without apps</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Host control panel to see real-time RSVPs</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>1-Tap GPS directions to church &amp; banquet hall</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Countdown clock &amp; gift registry link (Zelle/Venmo)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Unlimited guests included (no fee per head)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckout("assisted")}
                disabled={checkoutLoading === "assisted"}
                className="w-full py-3.5 rounded-xl border-2 border-[#7A002A] text-[#7A002A] font-bold text-sm hover:bg-[#7A002A] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                {checkoutLoading === "assisted" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Select Plan Assisted ($99)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Plan VIP Las Vegas ($199) - Highlighted */}
            <div className="rounded-3xl p-8 bg-gradient-to-b from-[#2B0A18] to-[#1A050E] text-white border-2 border-[#B08D3C] shadow-2xl flex flex-col justify-between relative overflow-hidden">
              {/* Highlight Ribbon */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Couples&apos; Choice
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white">
                    Plan VIP Las Vegas
                  </h3>
                  <span className="text-xs text-[#E5C158] font-semibold">
                    Concierge White-Glove Wedding Service
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-white">$199</span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                    One-Time Payment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/70 mb-6">
                  Complete white-glove setup by our wedding design team, including meal choice tracking, guest photo upload wall, and music fine-tuning.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-white/90 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span className="font-semibold text-white">Everything in Plan Assisted, PLUS:</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Plated entrée / dinner preference selector (Beef, Salmon, Vegan, GF)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Guest Photo Upload Wall (QR code on tables + full ZIP download)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Bilingual switch (English &amp; Spanish instant toggle)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>White-glove assembly by a dedicated wedding designer</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Priority WhatsApp concierge support until wedding day</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckout("vip")}
                disabled={checkoutLoading === "vip"}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] font-bold text-sm shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {checkoutLoading === "vip" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Get Plan VIP Las Vegas ($199)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. INTERACTIVE FAQ ACCORDION */}
      {/* ==================================================================== */}
      <section id="faq" className="py-20 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Got Questions?
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Frequently Asked Questions About Wedding Invitations
            </h2>
            <p className="text-base text-[#2B0A18]/70 font-light">
              Everything you need to know about catering choices, gift registries, dress codes, and guest confirmations.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can our wedding guests choose their plated dinner entrée through the RSVP?",
                a: "Yes! In the VIP plan, your invitation includes an interactive meal selector where guests specify their dish choice (e.g., Filet Mignon, Grilled Salmon, Vegetarian, or Children's meal) along with any dietary allergies. You can view and export exact tallies directly from your host panel to deliver straight to your venue or caterer.",
              },
              {
                q: "How does the gift registry section work? Can we link Zelle, Venmo, or Honeyfund?",
                a: "Absolutely. We include a dedicated registry section where you can link your Honeyfund, Zola, Amazon, or Crate & Barrel registries, or display your Zelle / Venmo details with a 1-tap copy button for couples who prefer cash gifts for their honeymoon.",
              },
              {
                q: "Do our wedding guests need to download an app or create an account?",
                a: "No! This is one of our biggest advantages over other platforms. Your guests simply tap the unique link in your text message or WhatsApp. It opens instantly in their mobile browser, plays your song, and lets them confirm attendance with a single click. Zero app store downloads or forgotten passwords.",
              },
              {
                q: "Can we include a dress code guide (Black Tie, Formal, Cocktail)?",
                a: "Yes! Every wedding invitation features a curated dress code module with color palette swatches and formal guidelines (e.g. 'Black Tie Preferred', 'Formal Garden Attire') so your guests arrive dressed exactly to your vision.",
              },
              {
                q: "How does the guest photo wall work?",
                a: "With our VIP package, you receive a custom QR code to place on banquet tables or display on the venue projector. Guests scan the code with their phone camera to upload candid photos and videos directly into your private wedding gallery—no logins required. You can later download every photo in high-resolution in a single ZIP file.",
              },
              {
                q: "How fast will our wedding invitation be ready?",
                a: "Standard turnaround is within 48 to 72 hours once you provide your event itinerary and photos. If you are on a tight schedule, text us at (818) 299-4882 and our Las Vegas team will expedite your invitation.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#2B0A18]/10 bg-[#FDFBF8] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-sm sm:text-base text-[#2B0A18]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#B08D3C] shrink-0 transition-transform duration-300 ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#2B0A18]/75 leading-relaxed border-t border-[#2B0A18]/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. DARK LUXURY CONVERSION BANNER */}
      {/* ==================================================================== */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1A050E] to-[#100308] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#7A002A]/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest text-[#E5C158] font-bold">
            Ready to Impress Your Guests?
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
            Create an Unforgettable First Impression for Your Las Vegas Wedding
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-light max-w-2xl mx-auto mb-10">
            Contact our Las Vegas wedding team today. We answer questions, verify date availability, and guide you through choosing the perfect digital aesthetic.
          </p>

          {/* Quick contact buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "wedding-invitations-las-vegas" })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] font-bold text-sm shadow-xl hover:brightness-105 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Message on WhatsApp</span>
            </a>
            <a
              href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "wedding-invitations-las-vegas" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              <Phone className="w-4 h-4 text-[#E5C158]" />
              <span>Call {PHONE_DISPLAY}</span>
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/50">
            <a href={PHONE_SMS} onClick={() => track("click_sms", { origen: "landing", pagina: "wedding-invitations-las-vegas" })} className="hover:text-white transition-colors underline">
              Or text us directly via SMS: (818) 299-4882
            </a>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E7DCC8]/70">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2B0A18] mb-2">
            Related Services
          </h2>
          <p className="text-sm text-[#2B0A18]/70 mb-8 max-w-2xl">
            Everything around your wedding invitation, from sending to tracking replies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/text-message-invitations" className="rounded-2xl border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Text Message Invitations</span>
              <span className="text-xs text-[#2B0A18]/70">Send the invitation straight to SMS with 1-tap RSVP.</span>
            </a>
            <a href="/rsvp-tracking" className="rounded-2xl border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Online RSVP Tracking</span>
              <span className="text-xs text-[#2B0A18]/70">Live headcount, pass control and Excel export for your venue.</span>
            </a>
            <a href="/whatsapp-invitations" className="rounded-2xl border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">WhatsApp Invitations</span>
              <span className="text-xs text-[#2B0A18]/70">Rich card previews shared in private chats and groups.</span>
            </a>
            <a href="/quince-invitations" className="rounded-2xl border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Quinceañera Invitations</span>
              <span className="text-xs text-[#2B0A18]/70">3D unboxing, waltz music and strict pass control for XV años.</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* FOOTER */}
      {/* ==================================================================== */}
      <footer className="py-12 bg-[#120309] text-white/60 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src="/logo.png" alt="Click & Love" width={1600} height={1600} className="h-7 w-auto object-contain opacity-80" />
            <span className="font-['Playfair_Display',serif] text-sm font-semibold text-white">
              Click &amp; Love
            </span>
            <span className="text-white/40">© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/quince-invitations" className="hover:text-white transition-colors">
              Quinceañera Invitations
            </Link>
            <Link href="/wedding-invitations-los-angeles" className="hover:text-white transition-colors">
              Wedding Invitations LA
            </Link>
            <Link href="/wedding-invitations-las-vegas" className="hover:text-white text-white font-semibold">
              Wedding Invitations Las Vegas
            </Link>
            <Link href="/text-message-invitations" className="hover:text-white transition-colors">
              SMS Invitations
            </Link>
            <Link href="/rsvp-tracking" className="hover:text-white transition-colors">
              RSVP Tracking
            </Link>
            <Link href="/whatsapp-invitations" className="hover:text-white transition-colors">
              WhatsApp Invitations
            </Link>
            <Link href="/demo" className="hover:text-white transition-colors">
              Catalog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
