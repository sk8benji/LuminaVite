"use client";
import SiteFooter from "@/components/layout/SiteFooter";

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
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20information%20about%20Text%20Message%20(SMS)%20invitations.";

export default function SmsLandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [simulatedStatus, setSimulatedStatus] = useState<"delivered" | "read" | "confirmed">("confirmed");

  const handleCheckout = async (plan: "assisted" | "vip") => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          templateSlug: "mariposas-xv",
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
                Instant SMS Invitations
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2B0A18]/80">
            <a href="#features" className="hover:text-[#7A002A] transition-colors py-1">
              Why SMS?
            </a>
            <a href="#comparison" className="hover:text-[#7A002A] transition-colors py-1">
              SMS vs Paper
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
              href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "text-message-invitations" })}
              className="hidden lg:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border border-[#2B0A18]/15 text-[#2B0A18] hover:border-[#7A002A] hover:text-[#7A002A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B08D3C]" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "text-message-invitations" })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A002A] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#7A002A]/20 hover:bg-[#5C0020] active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Send Demo to My Phone</span>
            </a>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. HERO SECTION */}
      {/* ==================================================================== */}
      <section className="relative pt-12 pb-20 md:py-24 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#7A002A]/10 via-[#B08D3C]/10 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-semibold tracking-wide mb-6">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>98%+ Open Rate • 0 Apps Required • Instant Delivery</span>
              </div>

              <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B0A18] leading-[1.12] tracking-tight mb-6">
                Text Message Invitations
              </h1>

              <p className="text-lg sm:text-xl text-[#2B0A18]/80 leading-relaxed mb-8 max-w-2xl font-light">
                Skip lost paper cards and unopened emails. Send gorgeous 3D interactive invitations straight to your guests&apos; SMS inbox with zero app downloads, real-time confirmations, and automatic GPS reminders.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-[#2B0A18]/10 w-full max-w-xl">
                <div className="flex items-center gap-1 text-[#B08D3C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B08D3C] text-[#B08D3C]" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#2B0A18]">
                  Over 150,000+ texts delivered
                </span>
                <span className="text-xs text-[#2B0A18]/60">
                  • 94% of guests confirm within 48 hours
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <a
                  href="#comparison"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#7A002A] to-[#9B113F] text-white text-base font-semibold shadow-xl shadow-[#7A002A]/25 hover:shadow-2xl hover:shadow-[#7A002A]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <Zap className="w-5 h-5 text-[#E5C158]" />
                  <span>See How SMS Beats Paper</span>
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#2B0A18]/20 bg-white/70 text-[#2B0A18] text-base font-semibold hover:border-[#7A002A] hover:text-[#7A002A] hover:bg-white transition-all text-center"
                >
                  <span>View Pricing ($99 - $199)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[#2B0A18]/70">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Works on iPhone &amp; Android
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Live Host RSVP Dashboard
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Zero Third-Party Ads
                </span>
              </div>
            </div>

            {/* Right Column: Realistic SMS Messaging Chat Thread Simulator */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                {/* iPhone Frame */}
                <div className="relative rounded-[44px] p-3.5 bg-gradient-to-b from-[#25282F] via-[#141519] to-[#0A0B0D] shadow-2xl shadow-black/50 border-4 border-[#3D404A]">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e24] ring-1 ring-white/10" />
                  </div>

                  {/* Messages Canvas */}
                  <div className="relative rounded-[32px] overflow-hidden bg-[#F2F2F7] text-[#1C1C1E] p-4 pt-12 pb-6 min-h-[580px] flex flex-col justify-between">
                    {/* Top iMessage Header */}
                    <div className="text-center pb-3 border-b border-black/10">
                      <div className="w-10 h-10 rounded-full bg-[#7A002A] text-white mx-auto flex items-center justify-center font-bold text-sm shadow">
                        C&amp;L
                      </div>
                      <p className="font-semibold text-xs text-black mt-1">Click &amp; Love Celebrations</p>
                      <p className="text-[10px] text-black/50">iMessage / SMS</p>
                    </div>

                    {/* Chat Bubble Flow */}
                    <div className="space-y-3 my-auto py-2 text-xs">
                      {/* Outgoing Message from Host */}
                      <div className="flex flex-col items-end">
                        <div className="max-w-[85%] bg-[#007AFF] text-white p-3 rounded-2xl rounded-tr-xs shadow-sm space-y-2">
                          <p className="leading-snug">
                            Hi Familia Morales! ✨ You are cordially invited to our special celebration:
                          </p>
                          {/* Rich Card Attachment Preview */}
                          <div className="bg-white text-[#2B0A18] rounded-xl overflow-hidden shadow-inner border border-white/20">
                            <Image
                              src="/assets/home-real/blue-butterfly-real.webp"
                              alt="Invitation Preview"
                              width={1600}
                              height={1066}
                              className="w-full h-24 object-cover"
                            />
                            <div className="p-2.5">
                              <p className="text-[10px] uppercase font-bold text-[#B08D3C]">
                                3D Royal Invitation
                              </p>
                              <p className="font-bold text-xs">Valeria&apos;s Quinceañera &amp; Gala</p>
                              <p className="text-[10px] text-[#2B0A18]/60">
                                clickandlove.app/valeria-xv
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] text-black/40 mt-1 mr-1">Delivered • Just now</span>
                      </div>

                      {/* Guest Instant Reply */}
                      <div className="flex flex-col items-start">
                        <div className="max-w-[80%] bg-[#E9E9EB] text-black p-3 rounded-2xl rounded-tl-xs shadow-sm">
                          <p className="leading-snug">
                            Omg this is stunning! We just tapped the link and opened the 3D envelope. Confirming 4 passes! 🎉
                          </p>
                        </div>
                        <span className="text-[9px] text-black/40 mt-1 ml-1">Read 12:44 PM</span>
                      </div>

                      {/* Automated GPS Reminder Trigger */}
                      <div className="p-3 bg-white rounded-2xl border border-black/5 shadow-sm space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>RSVP Confirmed in Host Panel</span>
                        </div>
                        <p className="text-[10px] text-black/70">
                          Automated directions sent: <strong>The Brandview Ballroom, Glendale</strong>
                        </p>
                        <div className="flex gap-2 pt-1">
                          <span className="text-[9px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                            Google Maps
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold">
                            Google Maps Route
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Simulator Controller */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border border-black/10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-black/80">Simulate reply:</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setSimulatedStatus("read")}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                            simulatedStatus === "read"
                              ? "bg-[#007AFF] text-white"
                              : "bg-black/5 text-black/70 hover:bg-black/10"
                          }`}
                        >
                          Read
                        </button>
                        <button
                          onClick={() => setSimulatedStatus("confirmed")}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                            simulatedStatus === "confirmed"
                              ? "bg-emerald-600 text-white"
                              : "bg-black/5 text-black/70 hover:bg-black/10"
                          }`}
                        >
                          Confirmed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. BENTO GRID: WHY SMS BEATS PAPER & EMAIL */}
      {/* ==================================================================== */}
      <section id="comparison" className="py-20 md:py-24 bg-white border-y border-[#2B0A18]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              The Technical Advantage
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Why 98% of Modern Events Switch to SMS Invitations
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Compare the friction of traditional channels against the effortless speed of text messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 (Large 2-col): 3-Way Channel Comparison */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Open Rate &amp; Response Velocity
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2B0A18] mt-1 mb-3">
                  SMS vs. Email vs. Paper Mail
                </h3>
                <p className="text-[#2B0A18]/75 text-sm sm:text-base leading-relaxed mb-6">
                  Emails get trapped in spam or promotion tabs. Paper mail takes weeks and requires guests to mail back postcards. Text messaging reaches your guests immediately on the phone they already check 96 times a day.
                </p>

                {/* Technical Metric Bars */}
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-[#2B0A18]/10 shadow-xs">
                  {/* SMS Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#7A002A] flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        Click &amp; Love SMS Invitations
                      </span>
                      <span className="text-emerald-700">98% Open Rate (Avg 3 Minutes)</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#7A002A] to-emerald-600 rounded-full w-[98%]" />
                    </div>
                  </div>

                  {/* Email Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#2B0A18]/70 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Traditional Email Invitations (Evite, Paperless Post)
                      </span>
                      <span>21% Open Rate (Often in Spam)</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[21%]" />
                    </div>
                  </div>

                  {/* Paper Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#2B0A18]/70 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Paper Mail &amp; Printed Postcards
                      </span>
                      <span>42% Return Rate ($600+ Postage &amp; Printing)</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-400 rounded-full w-[42%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: 1-Click Zero-Password Confirmation */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#B08D3C]/10 text-[#B08D3C] flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Zero Friction
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  No Passwords. No App Downloads.
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  Asking elderly grandparents or busy cousins to install an app or reset a password kills your response rate. Our web-based experience opens directly in Safari, Chrome, or Samsung Internet. This is a complete SMS RSVP service: guests complete their text RSVP without app downloads, accounts, or passwords.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#2B0A18]/10 text-xs">
                <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Universal Carrier Support
                </p>
                <p className="text-[11px] text-[#2B0A18]/70 mt-1">
                  Compatible with all US &amp; International carriers: AT&amp;T, Verizon, T-Mobile, Telcel, and Claro.
                </p>
              </div>
            </div>

            {/* Card 3: Automated Route & Driving Directions */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center mb-6">
                  <Navigation className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Smart Logistics
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Automated GPS Reminders
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  Never answer &quot;What was the address again?&quot; while you are getting your hair or makeup done. Confirmed guests receive a reminder with 1-tap route launch into Google Maps.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#2B0A18]/10 flex items-center justify-between">
                  <span className="font-semibold">3-Day Prior Reminder</span>
                  <span className="text-emerald-700 font-bold">Automatic</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#2B0A18]/10 flex items-center justify-between">
                  <span className="font-semibold">Day-Of Venue Traffic Route</span>
                  <span className="text-emerald-700 font-bold">1-Tap GPS</span>
                </div>
              </div>
            </div>

            {/* Card 4 (Spans 2-col): Rich Unboxing Experience */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-[#2B0A18] to-[#1A050E] text-white shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#E5C158] flex items-center justify-center mb-6 border border-white/10">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
                  High-End Visual Standard
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
                  Rich Visual Link Previews with 3D Wax Seal Unboxing
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                  When you send your link, phones display an elegant branded snippet with your photo, event title, and date. Upon tapping, guests experience smooth 3D envelope physics, personalized background music, and direct RSVP.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Rich iMessage Snippet</p>
                    <p className="text-white/70 text-[11px]">Displays high-res artwork in the chat thread.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Instant Audio Playback</p>
                    <p className="text-white/70 text-[11px]">Custom soundtrack plays seamlessly on tap.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Live Pass Counter</p>
                    <p className="text-white/70 text-[11px]">Enforces exact assigned seats per household.</p>
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
              Effortless Setup
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              How Text Message Invitations Work
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Send invitations to 20 or 200 guests in minutes without dealing with addresses or stamps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  01
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Create Your Invitation Link
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Choose your favorite 3D theme. We load your photos, ceremony &amp; banquet schedule, music, and assigned family pass counts into your secure link.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>48-Hour Turnaround</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  02
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Send via SMS or iMessage
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Send directly from your phone to individual contacts or family groups. Guests receive a beautiful visual preview they can tap immediately.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>No app or account required</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  03
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Monitor Live Confirmations
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Open your private host dashboard from your phone anytime to view who confirmed, how many seats they claimed, and meal selections in real time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Real-time headcount tallies</span>
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
              Simple Flat-Rate Pricing
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Send to Unlimited Guests Without Per-Text Fees
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Other platforms charge every time you send an SMS or add a guest. Click &amp; Love includes unlimited guests under a single one-time fee.
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
                    Starter
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-[#2B0A18]">$99</span>
                  <span className="text-xs text-[#2B0A18]/60 uppercase tracking-wider font-medium">
                    One-Time Payment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#2B0A18]/70 mb-6">
                  Great for hosts ready to share their event link via SMS and manage RSVPs through our real-time portal.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-[#2B0A18]/85 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Rich SMS link preview snippet with your photo</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Interactive 3D unboxing envelope &amp; music player</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Instant SMS RSVP without app downloads</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Live host tracking panel for phones</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Unlimited guests (no per-contact charge)</span>
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
                Most Popular
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white">
                    Plan VIP Concierge
                  </h3>
                  <span className="text-xs text-[#E5C158] font-semibold">
                    Full Support &amp; Automated Reminders
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-white">$199</span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                    One-Time Payment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/70 mb-6">
                  Complete white-glove setup, automatic reminder dispatch, guest photo gallery wall, and priority concierge.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-white/90 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span className="font-semibold text-white">Everything in Plan Assisted, PLUS:</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Automated RSVP reminders sent prior to deadline</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Day-of event GPS directions reminder (Google Maps)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Guest Photo Upload Wall (QR code + instant ZIP download)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Bilingual Spanish / English switcher</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Direct WhatsApp concierge support with our creative director</span>
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
              Frequently Asked Questions About SMS Invitations
            </h2>
            <p className="text-base text-[#2B0A18]/70 font-light">
              Clear answers on delivery, phone carrier compatibility, and host controls.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Why do SMS invitations perform better than email or paper?",
                a: "Over 98% of text messages are opened within 3 minutes of receipt, compared to just 21% for emails (which frequently land in spam folders). Unlike paper invitations that cost hundreds in postage and take weeks to be answered, text invitations allow guests to confirm attendance with one tap.",
              },
              {
                q: "Do my guests need to download an app or register an account?",
                a: "No! Guests do not need to install anything from the App Store or Google Play, nor do they need to remember passwords. Tapping the link opens the invitation directly in their mobile browser, reveals the 3D envelope and music, and confirms their RSVP immediately.",
              },
              {
                q: "Can I send the invitation to international family members?",
                a: "Yes. Your invitation link works globally on any phone connected to the internet. You can send it via regular international SMS, iMessage, WhatsApp, or Telegram with zero extra roaming or hosting fees.",
              },
              {
                q: "How do I see who confirmed from their text?",
                a: "You receive access to a private, password-free host management link. Whenever a guest confirms, their name, phone number, and allocated pass count appear instantly on your live dashboard.",
              },
              {
                q: "What if a guest does not respond right away?",
                a: "In our VIP plan, our system can trigger polite automated text reminders 14 days and 7 days before your deadline, helping you lock in final headcounts without awkward individual follow-ups.",
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
            Ready in 48 Hours
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
            Start Collecting Instant Confirmations Today
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-light max-w-2xl mx-auto mb-10">
            Have questions about sending via SMS or want a free demo sent straight to your personal phone? Contact our team right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "text-message-invitations" })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] font-bold text-sm shadow-xl hover:brightness-105 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Text Demo to My Phone</span>
            </a>
            <a
              href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "text-message-invitations" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              <Phone className="w-4 h-4 text-[#E5C158]" />
              <span>Call {PHONE_DISPLAY}</span>
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/50">
            <a href={PHONE_SMS} onClick={() => track("click_sms", { origen: "landing", pagina: "text-message-invitations" })} className="hover:text-white transition-colors underline">
              Or text us anytime: (818) 299-4882
            </a>
          </div>
        </div>
      </section>

      <SiteFooter lang="en" />
    </div>
  );
}
