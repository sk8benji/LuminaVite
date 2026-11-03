"use client";
import SiteFooter from "@/components/layout/SiteFooter";

import React, { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import Image from "next/image";
import { FAQS_LIST } from "@/lib/quince-faqs";
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
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20information%20about%20Quincea%C3%B1era%20invitations.";

interface TemplateItem {
  id: string;
  name: string;
  tag: string;
  slug: string;
  image: string;
  palette: string;
  description: string;
  highlights: string[];
}

const TEMPLATES_LIST: TemplateItem[] = [
  {
    id: "blue-butterfly",
    name: "Celestial Butterfly Garden",
    tag: "Gala & Royal",
    slug: "mariposas-xv",
    image: "/assets/home-real/blue-butterfly-real.webp",
    palette: "Baby Blue • Lavender • Silver",
    description: "Floating CSS butterflies, fairy tale arch, parental dedication letter, and full court of honor.",
    highlights: ["Interactive 3D Envelope", "Floating butterflies animation", "Court of Honor breakdown"],
  },
  {
    id: "elegant-rose",
    name: "Vintage Quinceañera (Elegant Rose)",
    tag: "Romántico",
    slug: "isabella-xv",
    image: "/assets/home-real/elegant-rose-real.webp",
    palette: "Blush Rose • Soft Gold • Ivory",
    description: "Canva luxury replica with velvet wax seal, bilingual switcher, Then & Now photo timeline, and song player.",
    highlights: ["Bilingual EN / ES toggle", "Then & Now photo timeline", "Curved typography header"],
  },
  {
    id: "quince-rosado",
    name: "Quince Rosado (Princesa de Gala)",
    tag: "Elegante",
    slug: "quince-rosado",
    image: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.webp",
    palette: "Deep Magenta • Rose • Gold",
    description: "Classic royal ball theme with gold filigree accents, silk bow unboxing, and church mass details.",
    highlights: ["Gold silk bow seal", "Strict RSVP pass selector", "Gift registry with Zelle"],
  },
  {
    id: "baby-blue",
    name: "Baby Blue Royalty & Castle",
    tag: "Majestuoso",
    slug: "baby-blue-xv",
    image: "/assets/template-baby-blue/foto-castillo.webp",
    palette: "Cinderella Blue • Platinum • Pearl",
    description: "Dreamy royal carriage aesthetic with countdown clock, chapel postal map, and father-daughter dance tribute.",
    highlights: ["Palace carriage illustration", "Father-daughter waltz track", "Live GPS directions"],
  },
  {
    id: "beauty-quince",
    name: "Beauty & Rose Enchantment",
    tag: "Gala Nocturna",
    slug: "beauty-quince-xv",
    image: "/assets/template-rose/722d78548334333072ad7200e4f8233e.webp",
    palette: "Midnight Blue • Imperial Gold",
    description: "Enchanted rose under glass dome motif, spinning vinyl disc, kids policy notice, and registry box.",
    highlights: ["Spinning vinyl record player", "Children policy card", "High-contrast night palette"],
  },
  {
    id: "miss-15",
    name: "Miss 15 Años Champagne Floral",
    tag: "Moderno",
    slug: "miss-15-xv",
    image: "/assets/home-real/quince-telefono-aerea.jpg",
    palette: "Champagne • Cream • Warm Tan",
    description: "Minimalist floral swing concept opening directly to the gala photo with modern typography and timeline icons.",
    highlights: ["Instant card reveal", "Minimalist outlined icons", "Instagram story friendly"],
  },
];



// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function QuinceLandingPage() {
  // Micro-interaction states
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [rosterTab, setRosterTab] = useState<"all" | "confirmed" | "pending">("all");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Handler for Checkout API
  const handleCheckout = async (plan: "assisted" | "vip") => {
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
        window.location.href = WHATSAPP_URL;
      }
    } catch {
      window.location.href = WHATSAPP_URL;
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#2B0A18] selection:bg-[#7A002A]/20 selection:text-[#2B0A18] font-sans antialiased overflow-x-hidden">
      {/* ================================================================== */}
      {/* 1. TOP NAVIGATION BAR (Sticky / Minimalist) */}
      {/* ================================================================== */}
      <div className="bg-[#7A002A] text-white py-2 px-4 text-center border-b border-[#5A0020] text-xs font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
        <span>📍 Serving Greater Los Angeles, San Fernando Valley & Orange County • 24–48h Turnaround</span>
      </div>

      <header className="sticky top-0 z-50 bg-[#FDFBF8]/90 backdrop-blur-md border-b border-[#E7DCC8]/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="Click & Love"
              width={40}
              height={40}
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex items-baseline">
              <span className="font-extrabold text-2xl tracking-tight text-[#2B0A18]">Click</span>
              <span className="font-serif italic text-2xl leading-none text-[#C2185B] ml-1.5 font-normal">
                and Love
              </span>
            </div>
          </Link>

          {/* Quick Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#4A2D37]">
            <a href="#features" className="hover:text-[#7A002A] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#7A002A] transition-colors">
              How It Works
            </a>
            <a href="#templates" className="hover:text-[#7A002A] transition-colors">
              Templates
            </a>
            <a href="#pricing" className="hover:text-[#7A002A] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#7A002A] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Nav CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="/demo/isabella-xv"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#7A002A] bg-[#F5EDDA] hover:bg-[#EFE3C7] rounded-full transition-all border border-[#B08D3C]/30"
            >
              <span>View Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "quince-invitations" })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7A002A] hover:bg-[#600021] text-white rounded-full text-xs font-bold tracking-wide shadow-[0_4px_14px_rgba(122,0,42,0.35)] hover:shadow-[0_6px_20px_rgba(122,0,42,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-[#E5C158]" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* 2. HERO SECTION (2 columns on desktop) */}
      {/* ================================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-[#FDFBF8] via-[#FAF5EC] to-[#FDFBF8]">
        {/* Ambient atmospheric glows (Kululu/Linear style) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#7A002A]/10 via-[#B08D3C]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-[-10%] w-[450px] h-[450px] bg-[#C2185B]/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition & Social Proof */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#B08D3C]/40 shadow-sm text-xs font-semibold text-[#7A002A]">
                <MapPin className="w-3.5 h-3.5 text-[#B08D3C]" />
                <span>Serving Los Angeles & San Fernando Valley</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
              </div>

              {/* H1 Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-[#2B0A18] tracking-tight leading-[1.12]">
                Luxury Quince Invitations with{" "}
                <span className="relative whitespace-nowrap text-[#7A002A]">
                  <span className="relative z-10">3D Envelopes</span>
                  <span className="absolute bottom-1.5 left-0 w-full h-3 bg-[#E5C158]/30 -z-0 rounded-sm transform -rotate-1" />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-[#5A3C46] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Interactive 3D animated envelopes with custom celebration music, direct SMS RSVP tracking, and zero app downloads for family and guests.
              </p>

              {/* Social Proof */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#B08D3C]/40 bg-[#7A002A] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    VM
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#B08D3C]/40 bg-[#9D2C4A] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    IM
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#B08D3C]/40 bg-[#2B4C7E] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    SC
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#B08D3C]/40 bg-[#B08D3C] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    AL
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start text-left">
                  <div className="flex items-center gap-1 text-[#E5C158]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E5C158]" />
                    ))}
                    <span className="text-xs font-bold text-[#2B0A18] ml-1">5.0</span>
                  </div>
                  <span className="text-xs text-[#5A3C46] font-medium">
                    Trusted by <strong>1,200+ families</strong> across Southern California
                  </span>
                </div>
              </div>

              {/* Buttons: Primary embossed + Secondary bordered */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="/demo/mariposas-xv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#7A002A] hover:bg-[#630022] text-white rounded-full text-base font-bold tracking-wide shadow-[0_10px_25px_rgba(122,0,42,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_14px_32px_rgba(122,0,42,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>View Live Demo</span>
                  <ArrowRight className="w-4 h-4 text-[#E5C158]" />
                </a>

                <a
                  href="#pricing"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-[#F9F5EC] text-[#2B0A18] border-2 border-[#E7DCC8] hover:border-[#B08D3C] rounded-full text-base font-bold transition-all shadow-sm hover:shadow"
                >
                  <span>See Pricing & Plans</span>
                </a>
              </div>

              {/* Micro Perks */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-[#7A5B66] font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  No app download needed
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  100% ad-free experience
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  Ready in 24–48 hours
                </span>
              </div>
            </div>

            {/* Right Column: Realistic Mobile Phone Mockup with 3D Envelope */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
                {/* Glow ring under mockup */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#B08D3C]/30 via-[#7A002A]/20 to-[#C2185B]/30 rounded-[3rem] blur-2xl opacity-75 -z-10" />

                {/* iPhone Frame */}
                <div className="relative bg-[#181114] p-3 rounded-[3rem] shadow-[0_30px_70px_rgba(43,10,24,0.4)] border-4 border-[#3D252E]">
                  {/* Speaker notch / Dynamic Island */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#181114] rounded-full z-30 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#2A1D23] ml-auto mr-3" />
                  </div>

                  {/* Screen Content */}
                  <div className="relative bg-gradient-to-b from-[#FDF8F5] via-[#FFF9FA] to-[#F5EFEB] rounded-[2.3rem] overflow-hidden pt-8 pb-6 px-4 flex flex-col items-center text-center min-h-[560px]">
                    {/* Event Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A002A]/10 text-[10px] font-bold uppercase tracking-widest text-[#7A002A] mb-3">
                      <Sparkles className="w-3 h-3 text-[#B08D3C]" />
                      <span>Mis Quince Años</span>
                    </div>

                    <h2 className="font-serif italic text-3xl text-[#7A002A] mb-1">Valeria Morales</h2>
                    <p className="text-[11px] font-semibold text-[#8A6B76] uppercase tracking-wider mb-4">
                      Saturday, October 24 • Los Angeles, CA
                    </p>

                    {/* Interactive 3D Envelope Simulation */}
                    <div
                      onClick={() => setIsEnvelopeOpen(!isEnvelopeOpen)}
                      className="relative w-full h-[230px] my-auto cursor-pointer group transition-all duration-500"
                      style={{ perspective: "1000px" }}
                      title="Tap to preview envelope opening"
                    >
                      {/* Envelope Cavity */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#5C453C] via-[#E8A8A2] to-[#E29B95] shadow-inner" />

                      {/* Sliding Invitation Card */}
                      <div
                        className={`absolute left-3 right-3 top-3 bottom-3 rounded-xl bg-white p-4 shadow-xl border border-[#D4AF37]/40 flex flex-col items-center justify-center text-center transition-all duration-700 ${
                          isEnvelopeOpen ? "-translate-y-20 scale-105 shadow-2xl z-20" : "translate-y-0 z-10"
                        }`}
                      >
                        <span className="text-[9px] tracking-widest text-[#B08D3C] uppercase font-bold">
                          Official Invitation
                        </span>
                        <span className="font-serif italic text-2xl text-[#2B0A18] my-1">Valeria Morales</span>
                        <div className="w-16 h-[1px] bg-[#D4AF37]/50 my-1" />
                        <span className="text-[10px] font-semibold text-[#5A3C46]">OCTOBER 24 • 4:00 PM</span>
                        <span className="text-[9px] text-[#8A6B76] mt-0.5">The Castaway • Burbank, CA</span>
                      </div>

                      {/* Front Pocket */}
                      <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-[#E29B95] to-[#EBB5BF] rounded-b-2xl border-t border-white/40 shadow-md z-25 flex flex-col justify-end p-3 pointer-events-none">
                        <div className="flex items-center justify-between text-[10px] text-[#5A3C46] font-semibold px-1">
                          <span>🌸 Floral Gold Foil</span>
                          <span>Stereo Audio ♫</span>
                        </div>
                      </div>

                      {/* 3D Flap */}
                      <div
                        className="absolute top-0 inset-x-0 h-[100px] bg-[#D99FA9] rounded-t-2xl shadow-md transition-transform duration-700 ease-out origin-top z-30"
                        style={{
                          transform: isEnvelopeOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                          transformStyle: "preserve-3d",
                        }}
                      />

                      {/* Wax Seal */}
                      <div
                        className={`absolute top-[80px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#7FA2C6] border-2 border-white/80 shadow-lg flex items-center justify-center text-white transition-all duration-300 ${
                          isEnvelopeOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 animate-pulse"
                        }`}
                      >
                        <span className="text-xs">📍</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#8A6B76] mt-2 mb-3">
                      {isEnvelopeOpen ? "✓ Envelope opened with waltz music" : "👆 Tap envelope to simulate unboxing"}
                    </p>

                    {/* RSVP Action Bar */}
                    <div className="w-full mt-auto space-y-2">
                      <button
                        type="button"
                        onClick={() => setIsEnvelopeOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-[#7A002A] text-white text-xs font-bold tracking-wider uppercase shadow-md hover:bg-[#630022] transition-colors"
                      >
                        Confirmar Asistencia (RSVP)
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[10px] text-[#5A3C46]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Instant SMS Confirmation • 4 Passes Reserved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. BENTO GRID OF FEATURES (Kululu / Linear Asymmetric Layout) */}
      {/* ================================================================== */}
      <section id="features" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E7DCC8]/70">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5EDDA] border border-[#B08D3C]/40 text-xs font-bold uppercase tracking-widest text-[#7A002A]">
              <span>✪ Modern Quince Platform</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B0A18] tracking-tight">
              Designed for Traditional and Modern Quince Celebrations
            </h2>
            <p className="text-base sm:text-lg text-[#5A3C46] leading-relaxed">
              Designed specifically for Los Angeles families managing 150 to 400+ guests. Keep full control of your
              budget, your headcount, and your peace of mind.
            </p>
          </div>

          {/* Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Strict Pass Control per Family (Large - Spans 2 Cols) */}
            <div className="md:col-span-2 rounded-3xl bg-[#FDFBF8] border border-[#E7DCC8] p-8 sm:p-10 shadow-[0_10px_30px_rgba(122,0,42,0.05)] hover:shadow-[0_18px_40px_rgba(122,0,42,0.08)] transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#E5C158]/15 via-transparent to-transparent rounded-full pointer-events-none" />

              <div className="space-y-4 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A002A]/10 text-xs font-bold text-[#7A002A] uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Headcount Security
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2B0A18]">
                  Family Pass Limits & Seating
                </h3>
                <p className="text-sm sm:text-base text-[#5A3C46] leading-relaxed">
                  Avoid the dreaded &ldquo;plus-three&rdquo; that blows your catering bill. Assign exact pass counts to
                  each family. When they confirm, they can only confirm up to their allocated seats.
                </p>
              </div>

              {/* Host Control Panel Simulation */}
              <div className="mt-8 rounded-2xl bg-white border border-[#E7DCC8] p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#F0E6D8] pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#2B0A18] uppercase tracking-wider block">
                      Valeria&rsquo;s Live Host Dashboard
                    </span>
                    <span className="text-[11px] text-[#8A6B76]">Real-time headcount synced to banquet hall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      186 / 220 Confirmed
                    </span>
                  </div>
                </div>

                {/* Simulated Guest Row 1 */}
                <div className="rounded-xl bg-[#FAF5EE] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-[#EBE0D0]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#7A002A] text-white flex items-center justify-center font-bold text-xs">
                      FM
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2B0A18]">Familia Morales (Tíos)</h4>
                      <p className="text-[11px] text-[#7A5B66]">Carlos, Elena, Mateo & Sofía</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      ✓ 4 of 4 Confirmed
                    </span>
                    <span className="text-[11px] text-[#8A6B76] font-mono">Table 03</span>
                  </div>
                </div>

                {/* Simulated Guest Row 2 */}
                <div className="rounded-xl bg-[#FAF5EE] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-[#EBE0D0]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2B4C7E] text-white flex items-center justify-center font-bold text-xs">
                      RF
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2B0A18]">Roberto & Patricia Flores</h4>
                      <p className="text-[11px] text-[#7A5B66]">2 passes reserved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                      ⏳ Pending (SMS Sent)
                    </span>
                    <span className="text-[11px] text-[#8A6B76] font-mono">Table 05</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Instant SMS Confirmation (Single Col) */}
            <div className="rounded-3xl bg-[#FDFBF8] border border-[#E7DCC8] p-8 shadow-[0_10px_30px_rgba(122,0,42,0.05)] hover:shadow-[0_18px_40px_rgba(122,0,42,0.08)] transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A002A]/10 text-xs font-bold text-[#7A002A] uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5" />
                  SMS Deliverability
                </span>
                <h3 className="text-2xl font-extrabold text-[#2B0A18]">Direct SMS RSVP with No App Required</h3>
                <p className="text-sm text-[#5A3C46] leading-relaxed">
                  No passwords or logins to remember. Guests receive an immediate text confirmation with their assigned
                  table number and event details directly on their phone.
                </p>
              </div>

              {/* iOS Text Message Bubble */}
              <div className="mt-8 rounded-2xl bg-white border border-[#E7DCC8] p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#8A6B76] font-semibold border-b border-[#F0E6D8] pb-1.5">
                  <span>Messages • Click &amp; Love</span>
                  <span>Now</span>
                </div>
                <div className="bg-[#E9E9EB] text-[#1C1C1E] p-3 rounded-2xl rounded-tl-sm text-xs leading-snug">
                  ¡Hola Familia Morales! Confirmamos sus <strong>4 pases</strong> para la Quinceañera de Valeria el Sábado
                  24 de Octubre en The Castaway, Burbank.
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    📍 Google Maps Route
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    🗺️ Google Maps
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: 1-Tap Direct GPS Navigation (Single Col) */}
            <div className="rounded-3xl bg-[#FDFBF8] border border-[#E7DCC8] p-8 shadow-[0_10px_30px_rgba(122,0,42,0.05)] hover:shadow-[0_18px_40px_rgba(122,0,42,0.08)] transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A002A]/10 text-xs font-bold text-[#7A002A] uppercase tracking-wider">
                  <Navigation className="w-3.5 h-3.5" />
                  GPS Navigation
                </span>
                <h3 className="text-2xl font-extrabold text-[#2B0A18]">1-Tap Church &amp; Reception Navigation</h3>
                <p className="text-sm text-[#5A3C46] leading-relaxed">
                  Your guests receive direct Google Maps links for both the church ceremony and reception party. Avoid phone calls in traffic and ensure everyone arrives right on time.
                </p>
              </div>

              {/* Event Navigation Chips */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E7DCC8] text-xs font-medium text-[#2B0A18]">
                  <span>📍 Misa / Church Ceremony</span>
                  <span className="text-[#B08D3C] text-[11px] font-bold">Google Maps →</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E7DCC8] text-xs font-medium text-[#2B0A18]">
                  <span>📍 Recepción / Reception Party</span>
                  <span className="text-[#B08D3C] text-[11px] font-bold">Google Maps →</span>
                </div>
              </div>
            </div>

            {/* Card 4: Virtual 3D Envelope with Custom Music (Spans 2 Cols) */}
            <div className="md:col-span-2 rounded-3xl bg-[#FDFBF8] border border-[#E7DCC8] p-8 sm:p-10 shadow-[0_10px_30px_rgba(122,0,42,0.05)] hover:shadow-[0_18px_40px_rgba(122,0,42,0.08)] transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A002A]/10 text-xs font-bold text-[#7A002A] uppercase tracking-wider">
                  <Music className="w-3.5 h-3.5" />
                  Luxury Unboxing
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2B0A18]">
                  Virtual 3D Envelope with Custom Music. Zero Third-Party Ads.
                </h3>
                <p className="text-sm sm:text-base text-[#5A3C46] leading-relaxed">
                  Cheap digital invitation websites clutter your daughter&rsquo;s milestone with popups for car insurance
                  or credit cards. Click &amp; Love is 100% private, ad-free, and delivers an emotional unboxing with her
                  favorite song.
                </p>
              </div>

              {/* Music Player Strip */}
              <div className="mt-8 rounded-2xl bg-[#2B0A18] text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#B08D3C]/40 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#7A002A] border border-[#E5C158] flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-[#E5C158] animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Ed Sheeran — Photograph (Vals Oficial)
                    </h4>
                    <p className="text-xs text-[#E5C158]/80">Plays automatically when guests open the envelope</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white border border-white/20">
                    High Fidelity Audio
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E5C158]/20 text-[#E5C158] text-xs font-bold border border-[#E5C158]/40">
                    100% Ad-Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. 3-STEP WORKFLOW ("How It Works") */}
      {/* ================================================================== */}
      <section id="how-it-works" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAF5EC]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-serif italic text-2xl text-[#B08D3C] block font-normal">Simple &amp; Effortless</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B0A18] tracking-tight">
              From idea to your guests&rsquo; phones: quince invitations in 3 steps.
            </h2>
            <p className="text-base text-[#5A3C46]">
              No software to install. We handle all coding, photo formatting, and music setup for you.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-3xl bg-white border border-[#E7DCC8] p-8 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between">
              <div>
                <span className="font-serif italic text-5xl font-bold text-[#E5C158] block mb-4">01</span>
                <h3 className="text-xl font-extrabold text-[#2B0A18] mb-2">Pick Your Design</h3>
                <p className="text-sm text-[#5A3C46] leading-relaxed">
                  Browse our curated collection of luxury quinceañera templates. Test the full live interactive demo with
                  audio, envelope, and timeline on your own phone.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F0E6D8] text-xs font-bold text-[#7A002A] flex items-center gap-1">
                <span>Explore catalog below</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl bg-white border border-[#E7DCC8] p-8 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between">
              <div>
                <span className="font-serif italic text-5xl font-bold text-[#B08D3C] block mb-4">02</span>
                <h3 className="text-xl font-extrabold text-[#2B0A18] mb-2">We Build It For You</h3>
                <p className="text-sm text-[#5A3C46] leading-relaxed">
                  Send us your photos, court of honor, dress code, and waltz song via WhatsApp. Our local Los Angeles
                  designers build and optimize your private link in 24–48 hours.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F0E6D8] text-xs font-bold text-[#7A002A] flex items-center gap-1">
                <span>Zero technical skills needed</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl bg-white border border-[#E7DCC8] p-8 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between">
              <div>
                <span className="font-serif italic text-5xl font-bold text-[#7A002A] block mb-4">03</span>
                <h3 className="text-xl font-extrabold text-[#2B0A18] mb-2">Share &amp; Track Live</h3>
                <p className="text-sm text-[#5A3C46] leading-relaxed">
                  Share your link with family via text or WhatsApp. Watch RSVPs, guest notes, and pass confirmations roll
                  in live from your mobile host control panel.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F0E6D8] text-xs font-bold text-[#7A002A] flex items-center gap-1">
                <span>Live headcount spreadsheet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. VISUAL TEMPLATES CATALOG (Templates Grid) */}
      {/* ================================================================== */}
      <section id="templates" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-serif italic text-2xl text-[#B08D3C] block font-normal">
              Exclusive Quinceañera Collection
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B0A18] tracking-tight">
              Explore Interactive Quince Invitation Themes
            </h2>
            <p className="text-base text-[#5A3C46]">
              Every template includes custom 3D envelope opening, waltz music player, photo gallery, and strict pass
              control. Tap any design to test it in full screen.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES_LIST.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-3xl bg-[#FDFBF8] border border-[#E7DCC8] overflow-hidden shadow-[0_8px_24px_rgba(122,0,42,0.06)] hover:shadow-[0_18px_40px_rgba(122,0,42,0.12)] transition-all duration-300 flex flex-col group"
              >
                {/* Image Container with 9:16 mobile aspect feel */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-[#2B0A18]">
                  <Image
                    src={tpl.image}
                    alt={tpl.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#2B0A18]/85 backdrop-blur-md text-white font-bold text-[10px] tracking-widest uppercase border border-white/20">
                    {tpl.tag}
                  </span>

                  {/* Palette Pill */}
                  <span className="absolute bottom-3 left-4 text-[11px] font-medium text-white/90 drop-shadow">
                    🎨 {tpl.palette}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#2B0A18] mb-1.5">{tpl.name}</h3>
                    <p className="text-xs text-[#5A3C46] leading-relaxed mb-4">{tpl.description}</p>

                    <div className="space-y-1.5 pt-2 border-t border-[#F0E6D8]">
                      {tpl.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#4A2D37]">
                          <span className="w-1.5 h-1.5 rotate-45 bg-[#B08D3C] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href={`/demo/${tpl.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-[#7A002A] text-[#7A002A] hover:text-white border border-[#E7DCC8] hover:border-[#7A002A] text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
                    >
                      <span>Preview Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. PRICING TABLE (2 Contrasted Plans) */}
      {/* ================================================================== */}
      <section id="pricing" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAF5EC] relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-serif italic text-2xl text-[#B08D3C] block font-normal">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B0A18] tracking-tight">
              Simple One-Time Pricing for Your Quince Celebration
            </h2>
            <p className="text-base text-[#5A3C46]">
              Keep your quince invitation active forever. No subscription traps or unexpected credit charges.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Plan 1: Assisted ($99) */}
            <div className="rounded-3xl bg-white border border-[#E7DCC8] p-8 sm:p-10 shadow-sm flex flex-col justify-between relative">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8A6B76] block mb-1">
                    Standard Gala
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#2B0A18]">Plan Assisted</h3>
                  <p className="text-xs text-[#5A3C46] mt-1">
                    Perfect for families who want a turnkey digital invitation ready to share.
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#2B0A18]">$99</span>
                  <span className="text-xs text-[#8A6B76] font-medium">USD • One-time fee</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#F0E6D8] text-xs sm:text-sm text-[#4A2D37]">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Turnkey 3D unboxing envelope with custom waltz music</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>200 SMS RSVP confirmations</strong> included for guests
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Real-time mobile guest list &amp; pass manager</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct GPS links to church &amp; reception (Google Maps)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Gift registry box (Zelle, CashApp &amp; Amazon Wishlist)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Photo gallery with up to 5 photos</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Ready in 24 to 48 hours by our team</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handleCheckout("assisted")}
                  disabled={checkoutLoading === "assisted"}
                  className="w-full py-4 rounded-full bg-white hover:bg-[#FDFBF8] text-[#7A002A] border-2 border-[#7A002A] text-sm font-bold tracking-wide uppercase transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {checkoutLoading === "assisted" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Select Assisted Plan ($99)</span>
                  )}
                </button>
              </div>
            </div>

            {/* Plan 2: VIP Los Angeles ($199) - Highlighted */}
            <div className="rounded-3xl bg-white border-2 border-[#B08D3C] p-8 sm:p-10 shadow-[0_20px_50px_rgba(176,141,60,0.18)] flex flex-col justify-between relative overflow-hidden">
              {/* Highlight ribbon */}
              <div className="absolute top-0 right-0 bg-[#B08D3C] text-white text-[10px] font-extrabold uppercase tracking-widest py-1.5 px-6 rounded-bl-xl shadow-sm">
                ★ Most Popular in Los Angeles
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B08D3C] block mb-1">
                    Complete Concierge Service
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#2B0A18]">Plan VIP Los Ángeles</h3>
                  <p className="text-xs text-[#5A3C46] mt-1">
                    Designed for large galas (200–400+ guests) needing VIP support and printable assets.
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#7A002A]">$199</span>
                  <span className="text-xs text-[#8A6B76] font-medium">USD • One-time fee</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#F0E6D8] text-xs sm:text-sm text-[#4A2D37]">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#B08D3C] shrink-0 mt-0.5 stroke-[3]" />
                    <span>
                      <strong>Everything in Assisted Plan</strong>, plus:
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>350 SMS RSVP confirmations</strong> for large families
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Professional photo retouching</strong> &amp; color-grading
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Printable Table Card QR code</strong> design (PDF for reception tables)
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Bilingual Switcher</strong> (Instant English &amp; Spanish mode)
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dedicated Court of Honor (Damas &amp; Chambelanes) section</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Priority WhatsApp Concierge</strong> for instant last-minute changes
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Rush 24h delivery</strong> included
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handleCheckout("vip")}
                  disabled={checkoutLoading === "vip"}
                  className="w-full py-4 rounded-full bg-[#7A002A] hover:bg-[#630022] text-white text-sm font-bold tracking-wide uppercase transition-all shadow-[0_10px_25px_rgba(122,0,42,0.4)] hover:shadow-[0_14px_32px_rgba(122,0,42,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {checkoutLoading === "vip" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>Get VIP Los Ángeles ($199)</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Guarantee footnote */}
          <div className="mt-12 text-center text-xs text-[#7A5B66] flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Secure 256-bit Stripe Checkout
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#B08D3C]" />
              No surprise subscriptions
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#C2185B]" />
              100% Satisfaction Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 7. INTERACTIVE ACCORDION FOR FAQS */}
      {/* ================================================================== */}
      <section id="faq" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-serif italic text-2xl text-[#B08D3C] block font-normal">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B0A18] tracking-tight">
              Frequently Asked Questions About Our Quince Invitations
            </h2>
            <p className="text-base text-[#5A3C46]">
              Everything you need to know about setting up your digital quinceañera invitation.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {FAQS_LIST.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? "bg-[#FDFBF8] border-[#B08D3C]" : "bg-white border-[#E7DCC8] hover:border-[#D4AF37]/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-extrabold text-base sm:text-lg text-[#2B0A18]">{faq.question}</span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "bg-[#7A002A] text-white rotate-180" : "bg-[#F5EDDA] text-[#7A002A]"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#5A3C46] leading-relaxed border-t border-[#F0E6D8] pt-4 animate-in fade-in duration-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Support link */}
          <div className="mt-10 text-center text-sm text-[#7A5B66]">
            Have a custom theme or unique request?{" "}
            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "quince-invitations" })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7A002A] font-bold underline hover:text-[#5A0020]"
            >
              Chat directly with our Los Angeles design team on WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF5EC] border-t border-[#E7DCC8]/70">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B0A18] mb-2">
            Related Services
          </h2>
          <p className="text-sm text-[#5A3C46] mb-8 max-w-2xl">
            Everything around your quinceañera invitation, from sending to tracking replies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/wedding-invitations-los-angeles" className="rounded-2xl bg-white border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Wedding Invitations in Los Angeles</span>
              <span className="text-xs text-[#5A3C46]">3D unboxing, first-dance music and meal selection for weddings.</span>
            </a>
            <a href="/text-message-invitations" className="rounded-2xl bg-white border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Text Message Invitations</span>
              <span className="text-xs text-[#5A3C46]">Send the invitation straight to SMS with 1-tap RSVP.</span>
            </a>
            <a href="/rsvp-tracking" className="rounded-2xl bg-white border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Online RSVP Tracking</span>
              <span className="text-xs text-[#5A3C46]">Live headcount, pass control and Excel export for your venue.</span>
            </a>
            <a href="/whatsapp-invitations" className="rounded-2xl bg-white border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">WhatsApp Invitations</span>
              <span className="text-xs text-[#5A3C46]">Rich card previews shared in private chats and groups.</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 8. FINAL CONVERSION BANNER (CTA) */}
      {/* ================================================================== */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#1A050E] text-white relative overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#7A002A]/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-[#E5C158]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E5C158]/40 text-xs font-semibold text-[#E5C158]">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
            <span>Southern California Quinceañera Concierge</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-[1.12]">
            Let&rsquo;s make her 15th birthday{" "}
            <span className="font-serif italic text-[#E5C158] font-normal">unforgettable.</span>
          </h2>

          <p className="text-base sm:text-lg text-rose-100/80 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop worrying about lost paper envelopes and unconfirmed guests. Call, text, or WhatsApp us today—we&rsquo;ll
            have her custom quince invitation live in under 48 hours.
          </p>

          {/* Action Buttons: Phone & SMS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "quince-invitations" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#E5C158] hover:bg-[#D4AF37] text-[#1A050E] rounded-full text-base font-extrabold tracking-wide shadow-[0_10px_25px_rgba(229,193,88,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now {PHONE_DISPLAY}</span>
            </a>

            <a
              href={PHONE_SMS} onClick={() => track("click_sms", { origen: "landing", pagina: "quince-invitations" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-5 h-5 text-[#E5C158]" />
              <span>Send Text (SMS)</span>
            </a>

            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "quince-invitations" })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Local Studio Footer Badge */}
          <div className="pt-8 border-t border-white/10 text-xs text-rose-200/60 max-w-xl mx-auto space-y-1">
            <p className="font-semibold text-rose-100">
              Handcrafted with love in Los Angeles, California • Click &amp; Love Studio
            </p>
            <p>Delivering bespoke digital invitation experiences for celebrations nationwide.</p>
          </div>
        </div>
      </section>

      <SiteFooter lang="en" />
    </div>
  );
}
