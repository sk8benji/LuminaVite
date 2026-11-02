"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Globe,
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
  Send,
  Share2,
  ShieldCheck,
  Smartphone,
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
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20information%20about%20WhatsApp%20invitations.";

export default function WhatsAppLandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const sampleSnippet =
    "✨ You are cordially invited to our celebration! Open our interactive 3D invitation and confirm your attendance here: https://clickandlove.app/emma-and-lucas";

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const handleCheckout = async (plan: "assisted" | "vip") => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          templateSlug: "beauty-quince-xv",
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
      {/* 1. STICKY TOP NAVBAR */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-50 bg-[#FDFBF8]/90 backdrop-blur-md border-b border-[#2B0A18]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A002A]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Click & Love"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-['Playfair_Display',serif] text-xl font-bold tracking-tight text-[#2B0A18]">
                Click &amp; Love
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#B08D3C] font-semibold">
                WhatsApp Event Invitations
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2B0A18]/80">
            <a href="#features" className="hover:text-[#7A002A] transition-colors py-1">
              Features
            </a>
            <a href="#preview" className="hover:text-[#7A002A] transition-colors py-1">
              Rich Preview
            </a>
            <a href="#how-it-works" className="hover:text-[#7A002A] transition-colors py-1">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-[#7A002A] transition-colors py-1">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#7A002A] transition-colors py-1">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={PHONE_TEL}
              className="hidden lg:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border border-[#2B0A18]/15 text-[#2B0A18] hover:border-[#7A002A] hover:text-[#7A002A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B08D3C]" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-[#123820] text-xs sm:text-sm font-bold shadow-md shadow-[#25D366]/20 hover:brightness-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-[#123820]" />
              <span>Send Demo on WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. HERO SECTION */}
      {/* ==================================================================== */}
      <section className="relative pt-12 pb-20 md:py-24 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#25D366]/15 via-[#B08D3C]/10 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#123820] text-xs font-bold tracking-wide mb-6">
                <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Rich Visual Snippets • No Cluttered Group Chats</span>
              </div>

              <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B0A18] leading-[1.12] tracking-tight mb-6">
                Send Luxury Invitations on{" "}
                <span className="italic font-normal text-[#25D366] underline decoration-[#B08D3C]/60 decoration-wavy">
                  WhatsApp in 1 Tap
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#2B0A18]/80 leading-relaxed mb-8 max-w-2xl font-light">
                Share rich, personalized invitations in private chats or family groups. Guests open an interactive 3D unboxing experience with music, GPS navigation, and direct RSVP confirmation without installing any application.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-[#2B0A18]/10 w-full max-w-xl">
                <div className="flex items-center gap-1 text-[#B08D3C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B08D3C] text-[#B08D3C]" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#2B0A18]">
                  4.97 / 5 Host Experience
                </span>
                <span className="text-xs text-[#2B0A18]/60">
                  • Millions of WhatsApp shares across California &amp; Latin America
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white text-base font-bold shadow-xl shadow-[#25D366]/25 hover:shadow-2xl hover:brightness-105 active:scale-98 transition-all text-center"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Test Demo on WhatsApp</span>
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#2B0A18]/20 bg-white/70 text-[#2B0A18] text-base font-semibold hover:border-[#7A002A] hover:text-[#7A002A] hover:bg-white transition-all text-center"
                >
                  <span>See Packages ($99 - $199)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[#2B0A18]/70">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Rich photo preview in chat
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  No 80-person noisy groups
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Instant RSVP sync to dashboard
                </span>
              </div>
            </div>

            {/* Right Column: WhatsApp Chat Screen Mockup */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                {/* Floating pill */}
                <div className="absolute -top-4 -right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-[#25D366]/30 flex items-center gap-2 text-xs font-bold text-[#123820]">
                  <Sparkles className="w-4 h-4 text-[#25D366]" />
                  <span>Rich OpenGraph WhatsApp Preview</span>
                </div>

                {/* iPhone Frame */}
                <div className="relative rounded-[44px] p-3.5 bg-gradient-to-b from-[#1E2E24] via-[#0D1812] to-[#070D09] shadow-2xl shadow-black/50 border-4 border-[#2D4537]">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e24] ring-1 ring-white/10" />
                  </div>

                  {/* WhatsApp Canvas */}
                  <div className="relative rounded-[32px] overflow-hidden bg-[#ECE5DD] text-[#111B21] p-4 pt-12 pb-5 min-h-[580px] flex flex-col justify-between">
                    {/* Top WhatsApp Chat Bar */}
                    <div className="bg-[#075E54] text-white -mx-4 -mt-12 p-3 pt-12 flex items-center gap-3 shadow-md">
                      <div className="w-8 h-8 rounded-full bg-[#B08D3C] text-white font-bold flex items-center justify-center text-xs">
                        E&amp;L
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs truncate">Emma &amp; Lucas Wedding</p>
                        <p className="text-[10px] text-white/80">tap here for contact info</p>
                      </div>
                      <Phone className="w-4 h-4 text-white/80" />
                    </div>

                    {/* Chat Bubble Thread */}
                    <div className="my-auto py-3 space-y-3">
                      {/* Outgoing Message with Rich Card Preview */}
                      <div className="flex flex-col items-end">
                        <div className="max-w-[92%] bg-[#E7FFDB] text-[#111B21] p-2.5 rounded-2xl rounded-tr-xs shadow-sm space-y-2 border border-[#D0F0C0]">
                          <p className="text-xs leading-snug">
                            Dearest Aunt Rosa &amp; Family! ✨ We are thrilled to invite you to our wedding day in Pasadena:
                          </p>

                          {/* Rich OpenGraph Card Preview */}
                          <div className="bg-white rounded-xl overflow-hidden shadow-xs border border-black/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                              alt="Wedding Invitation"
                              className="w-full h-28 object-cover"
                            />
                            <div className="p-2.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#B08D3C]">
                                3D Unboxing Invitation
                              </p>
                              <p className="font-bold text-xs text-[#2B0A18] mt-0.5">
                                Emma &amp; Lucas Wedding Celebration
                              </p>
                              <p className="text-[10px] text-neutral-600 line-clamp-1 mt-0.5">
                                Saturday, October 17 • The Langham Huntington, Pasadena
                              </p>
                              <span className="text-[9px] text-[#075E54] font-medium block mt-1">
                                clickandlove.app/emma-and-lucas
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-1 text-[9px] text-neutral-500 pt-0.5">
                            <span>1:42 PM</span>
                            <span className="text-[#34B7F1] font-bold">✓✓</span>
                          </div>
                        </div>
                      </div>

                      {/* Guest Reply */}
                      <div className="flex flex-col items-start">
                        <div className="max-w-[85%] bg-white text-[#111B21] p-3 rounded-2xl rounded-tl-xs shadow-sm">
                          <p className="text-xs leading-snug">
                            We just opened the envelope! The song gave me goosebumps 🥹 We already confirmed our 2 passes on the link! See you in Pasadena! ❤️
                          </p>
                          <span className="text-[9px] text-neutral-400 block text-right mt-1">1:45 PM</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Copy Snippet Box */}
                    <div className="bg-white rounded-2xl p-3 shadow-md border border-black/10 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#111B21]">
                        <span>Ready-to-Paste Template</span>
                        <button
                          onClick={handleCopySnippet}
                          className="flex items-center gap-1 text-[#075E54] hover:underline font-semibold"
                        >
                          {copiedSnippet ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-600 leading-tight bg-[#F7F7F7] p-2 rounded-lg font-mono">
                        {sampleSnippet}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. BENTO GRID: WHY WHATSAPP INVITATIONS WIN */}
      {/* ==================================================================== */}
      <section id="features" className="py-20 md:py-24 bg-white border-y border-[#2B0A18]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Effortless Sharing
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Everything You Need to Share Elegantly on WhatsApp
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Stop sending raw, suspicious links or creating chaotic 80-person family groups where people mute the chat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 (Large 2-col): Rich Snippet vs Raw Spam Link */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center mb-6">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Premium Visual Presentation
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Automatic Rich Card Preview in Every Chat
                </h3>
                <p className="text-[#2B0A18]/75 text-sm sm:text-base leading-relaxed mb-6">
                  Raw URLs look like suspicious spam and get ignored. When you paste your Click &amp; Love link into WhatsApp, it immediately populates a gorgeous card displaying your celebration photograph, couple/quinceañera name, date, and venue.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-[#2B0A18]/10">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" />
                      Click &amp; Love Rich Card
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      High-resolution cover photo, formal typography, and instant 3D unboxing hook.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                    <p className="font-bold text-rose-900 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-700" />
                      Generic Short Links
                    </p>
                    <p className="text-[11px] text-rose-800 mt-1">
                      Suspicious bitly links, no preview photo, frequently ignored or flagged as phishing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Zero Chaotic Group Chats */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#B08D3C]/10 text-[#B08D3C] flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Dignified &amp; Private
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Say Goodbye to Noisy Group Chats
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  Creating an 80-person WhatsApp group results in constant notification pings, people leaving awkwardly, and RSVPs lost in 500 unread messages.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#2B0A18]/10 text-xs space-y-1">
                <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Direct Individual Sending
                </p>
                <p className="text-[11px] text-[#2B0A18]/70">
                  Send warm private messages to each guest. Confirmations flow straight into your host panel.
                </p>
              </div>
            </div>

            {/* Card 3: 3D Unboxing & Instant Audio */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center mb-6">
                  <Music className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Interactive Physics
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  3D Wax Seal &amp; Music
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  When guests tap the WhatsApp preview, it opens in full screen with an animated 3D envelope unboxing while your romantic waltz or ballad starts playing.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#2B0A18]/10 flex items-center justify-between">
                  <span className="font-semibold">3D Envelope Unboxing</span>
                  <span className="text-[#7A002A] font-bold">Interactive</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#2B0A18]/10 flex items-center justify-between">
                  <span className="font-semibold">Zero App Downloads</span>
                  <span className="text-emerald-700 font-bold">100% Web</span>
                </div>
              </div>
            </div>

            {/* Card 4 (Spans 2-col): Sync from WhatsApp to Host Panel */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-[#2B0A18] to-[#1A050E] text-white shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#E5C158] flex items-center justify-center mb-6 border border-white/10">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
                  Unified Coordination
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
                  Every WhatsApp Click Syncs Live to Your Host Portal
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                  Even though your guests receive the invitation inside WhatsApp, their confirmation form syncs directly with your central dashboard. You never need to write down names on paper napkins or count thumbs-up emojis.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Pass Enforcement</p>
                    <p className="text-white/70 text-[11px]">Strict seat limits per family link.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Waze &amp; Maps Link</p>
                    <p className="text-white/70 text-[11px]">1-Tap navigation to the banquet hall.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Gift Registry</p>
                    <p className="text-white/70 text-[11px]">Zelle, Venmo &amp; registry links with 1-tap copy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. THREE-STEP WORKFLOW */}
      {/* ==================================================================== */}
      <section id="how-it-works" className="py-20 md:py-24 bg-[#FAF5EC]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              3 Simple Steps
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              How WhatsApp Invitations Work
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Distribute stunning invitations to everyone in your contact list in under 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  01
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Get Your WhatsApp Link
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Select your luxury 3D design. We assemble your high-resolution OpenGraph card, song player, countdown clock, and venue directions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Delivered in 48 Hours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  02
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Paste Into Any Chat
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Copy our ready-to-send message and paste it into private chats or broadcast lists. WhatsApp automatically pulls the photo and title card.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Copy-paste message included</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  03
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Track RSVPs in Real Time
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Guests tap to open, listen to your music, and confirm their seats. Your host panel records each response with zero chat clutter.
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
      {/* 5. PRICING TABLE */}
      {/* ==================================================================== */}
      <section id="pricing" className="py-20 md:py-24 bg-white border-y border-[#2B0A18]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Transparent Pricing
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Share With Unlimited WhatsApp Contacts
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Send to 50 or 500 guests. No limits, no recurring subscriptions, and zero hidden costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Plan Assisted */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/15 shadow-sm flex flex-col justify-between">
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
                  Perfect for hosts who want a high-converting WhatsApp link with 3D unboxing and real-time confirmations.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-[#2B0A18]/85 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Rich WhatsApp preview card with your event photo</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Interactive 3D envelope with music player</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Integrated RSVP form (no app required)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Live host dashboard to track confirmations</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Unlimited guests and shares included</span>
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

            {/* Plan VIP */}
            <div className="rounded-3xl p-8 bg-gradient-to-b from-[#2B0A18] to-[#1A050E] text-white border-2 border-[#B08D3C] shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                VIP Concierge
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white">
                    Plan VIP Concierge
                  </h3>
                  <span className="text-xs text-[#E5C158] font-semibold">
                    Concierge White-Glove WhatsApp Management
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-white">$199</span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                    One-Time Payment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/70 mb-6">
                  Complete white-glove setup by our team: meal preferences, guest photo wall, and bilingual management.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-white/90 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span className="font-semibold text-white">Everything in Plan Assisted, PLUS:</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Guest photo upload wall (QR code + instant ZIP download)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Plated meal choice tracking (Beef, Salmon, Vegan)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Bilingual switch (English &amp; Spanish instant toggle)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Priority WhatsApp concierge support directly with our team</span>
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
                    <span>Get Plan VIP ($199)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. FAQ SECTION */}
      {/* ==================================================================== */}
      <section id="faq" className="py-20 md:py-24 bg-[#FAF5EC]/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Got Questions?
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Frequently Asked Questions About WhatsApp Invitations
            </h2>
            <p className="text-base text-[#2B0A18]/70 font-light">
              Clear answers on previews, sending methods, and guest confirmation.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Will the photo and event title show up automatically in WhatsApp?",
                a: "Yes! Every invitation includes specialized OpenGraph metadata optimized specifically for WhatsApp, iMessage, and Facebook. When you paste your link, WhatsApp automatically displays your chosen cover photo, the event title, date, and venue.",
              },
              {
                q: "Do I have to create an 80-person group to invite everyone?",
                a: "No! In fact, we recommend sending the link in private one-on-one chats or using a WhatsApp Broadcast list. This keeps the invitation personal, eliminates group chat clutter, and ensures all RSVPs are cleanly collected in your host portal.",
              },
              {
                q: "Can international family members open the invitation?",
                a: "Absolutely. WhatsApp is the most popular messaging app in Mexico, Central America, South America, and Europe. Family members anywhere in the world can open your link, listen to the music, and confirm their attendance in seconds.",
              },
              {
                q: "Do guests need an app to open the invitation?",
                a: "No! Tapping the link opens the invitation directly in their mobile browser (Safari, Chrome, or WhatsApp's built-in browser). They do not need to download anything.",
              },
              {
                q: "Where do the confirmations go when guests click confirm?",
                a: "Every confirmation is instantly logged in your private host dashboard. You see guest names, allocated passes, companion names, and meal choices all in one place.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#2B0A18]/10 bg-white overflow-hidden transition-all"
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
      {/* 7. DARK LUXURY CONVERSION BANNER */}
      {/* ==================================================================== */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1A050E] to-[#100308] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest text-[#E5C158] font-bold">
            Fast 48-Hour Delivery
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
            Ready to Share Your Event on WhatsApp?
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-light max-w-2xl mx-auto mb-10">
            Message our Los Angeles team on WhatsApp right now to see live demos, verify dates, or get a personalized draft started.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-[#072414] font-bold text-sm shadow-xl hover:brightness-105 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-[#072414]" />
              <span>Message Us on WhatsApp</span>
            </a>
            <a
              href={PHONE_TEL}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              <Phone className="w-4 h-4 text-[#E5C158]" />
              <span>Call {PHONE_DISPLAY}</span>
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/50">
            <a href={PHONE_SMS} className="hover:text-white transition-colors underline">
              Or text us via SMS: (818) 299-4882
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#120309] text-white/60 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Click & Love" className="h-7 w-auto object-contain opacity-80" />
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
              Quinceañera
            </Link>
            <Link href="/wedding-invitations-los-angeles" className="hover:text-white transition-colors">
              Weddings
            </Link>
            <Link href="/text-message-invitations" className="hover:text-white transition-colors">
              SMS Invitations
            </Link>
            <Link href="/rsvp-tracking" className="hover:text-white transition-colors">
              RSVP Tracking
            </Link>
            <Link href="/whatsapp-invitations" className="hover:text-white text-white font-semibold">
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
