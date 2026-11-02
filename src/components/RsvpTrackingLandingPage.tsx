"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Filter,
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
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  UserMinus,
  Users,
  UserX,
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
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20information%20about%20RSVP%20Tracking%20and%20Host%20Control.";

interface GuestRow {
  id: string;
  name: string;
  passesAssigned: number;
  passesConfirmed: number;
  status: "confirmed" | "declined" | "pending";
  confirmedAt: string;
  dietary?: string;
}

const SAMPLE_GUESTS: GuestRow[] = [
  {
    id: "g1",
    name: "Familia Morales",
    passesAssigned: 4,
    passesConfirmed: 4,
    status: "confirmed",
    confirmedAt: "Today, 11:24 AM",
    dietary: "2 Salmon, 2 Beef",
  },
  {
    id: "g2",
    name: "Carlos & Mariana Reyes",
    passesAssigned: 2,
    passesConfirmed: 2,
    status: "confirmed",
    confirmedAt: "Yesterday, 4:15 PM",
    dietary: "Vegetarian (1)",
  },
  {
    id: "g3",
    name: "Familia Hernandez-Gomez",
    passesAssigned: 5,
    passesConfirmed: 0,
    status: "pending",
    confirmedAt: "Reminder sent",
  },
  {
    id: "g4",
    name: "Dr. Roberto Silva",
    passesAssigned: 2,
    passesConfirmed: 0,
    status: "declined",
    confirmedAt: "Out of state",
  },
  {
    id: "g5",
    name: "Claudia & Sofia Fuentes",
    passesAssigned: 3,
    passesConfirmed: 3,
    status: "confirmed",
    confirmedAt: "Oct 28",
    dietary: "Gluten free (1)",
  },
];

export default function RsvpTrackingLandingPage() {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "declined">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const filteredGuests = SAMPLE_GUESTS.filter((g) => {
    const matchesFilter = filter === "all" ? true : g.status === filter;
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalAssigned = 160;
  const totalConfirmed = 124;
  const totalDeclined = 8;
  const totalPending = 28;

  const handleCheckout = async (plan: "assisted" | "vip") => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          templateSlug: "isabella-xv",
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
                Live RSVP Host Control
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2B0A18]/80">
            <a href="#features" className="hover:text-[#7A002A] transition-colors py-1">
              Host Panel
            </a>
            <a href="#pass-control" className="hover:text-[#7A002A] transition-colors py-1">
              Pass Security
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A002A] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#7A002A]/20 hover:bg-[#5C0020] active:scale-95 transition-all"
            >
              <BarChart3 className="w-4 h-4 fill-white" />
              <span>See Live Dashboard Demo</span>
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7A002A]/5 border border-[#7A002A]/20 text-[#7A002A] text-xs font-semibold tracking-wide mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B08D3C]" />
                <span>Zero Unwanted Plus-Ones • Real-Time Headcount Control</span>
              </div>

              <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B0A18] leading-[1.12] tracking-tight mb-6">
                Real-Time RSVP Tracking &amp; Strict Pass Control{" "}
                <span className="italic font-normal text-[#7A002A] underline decoration-[#B08D3C]/60 decoration-wavy">
                  on Your Phone
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#2B0A18]/80 leading-relaxed mb-8 max-w-2xl font-light">
                Stop chasing down guests on WhatsApp or managing messy spreadsheets. Our live host portal tracks confirmed seats, declined invites, dietary requests, and enforces exact pass limits per household.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-[#2B0A18]/10 w-full max-w-xl">
                <div className="flex items-center gap-1 text-[#B08D3C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B08D3C] text-[#B08D3C]" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#2B0A18]">
                  100% Accurate Banquet Headcounts
                </span>
                <span className="text-xs text-[#2B0A18]/60">
                  • Saved hosts an average of $1,400 in wasted catering plates
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#7A002A] to-[#9B113F] text-white text-base font-semibold shadow-xl shadow-[#7A002A]/25 hover:shadow-2xl hover:shadow-[#7A002A]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <BarChart3 className="w-5 h-5 text-[#E5C158]" />
                  <span>Explore Host Dashboard</span>
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
                  Direct 1-Click Excel / CSV Export
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Individual pass allocation lock
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Password-free mobile portal
                </span>
              </div>
            </div>

            {/* Right Column: Live Host Dashboard Simulator on Mobile Frame */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                {/* Floating summary badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-[#B08D3C]/30 flex items-center gap-2 text-xs font-bold text-[#2B0A18]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live RSVP Feed Active</span>
                </div>

                <div className="relative rounded-[44px] p-3.5 bg-gradient-to-b from-[#2B0A18] via-[#1A050E] to-[#120309] shadow-2xl shadow-[#1A050E]/40 border-4 border-[#5A3844]">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e24] ring-1 ring-white/10" />
                  </div>

                  <div className="relative rounded-[32px] overflow-hidden bg-white text-[#2B0A18] p-4 pt-12 pb-5 min-h-[580px] flex flex-col justify-between shadow-inner">
                    {/* Panel Brand Title */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#2B0A18]/10">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[#B08D3C] tracking-wider">
                            Host Control Panel
                          </p>
                          <h3 className="font-['Playfair_Display',serif] text-sm font-bold text-[#2B0A18]">
                            Valeria&apos;s Quinceañera
                          </h3>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Active
                        </span>
                      </div>

                      {/* Stat Counters 4-box grid */}
                      <div className="grid grid-cols-2 gap-2 my-3">
                        <div className="p-2.5 rounded-xl bg-[#FDFBF8] border border-[#2B0A18]/10 text-center">
                          <p className="text-[10px] text-[#2B0A18]/60 font-semibold uppercase">Confirmed</p>
                          <p className="text-xl font-bold text-emerald-700">{totalConfirmed}</p>
                          <p className="text-[9px] text-emerald-600 font-medium">78% of capacity</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FDFBF8] border border-[#2B0A18]/10 text-center">
                          <p className="text-[10px] text-[#2B0A18]/60 font-semibold uppercase">Pending</p>
                          <p className="text-xl font-bold text-amber-600">{totalPending}</p>
                          <p className="text-[9px] text-amber-600 font-medium">17% awaiting</p>
                        </div>
                      </div>

                      {/* Search & Filter Bar */}
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-[#2B0A18]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search family or guest name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-[#2B0A18]/15 bg-[#FDFBF8] focus:outline-none focus:ring-1 focus:ring-[#7A002A]"
                          />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                          {(["all", "confirmed", "pending", "declined"] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setFilter(tab)}
                              className={`px-2.5 py-1 rounded-md font-semibold capitalize shrink-0 transition-all ${
                                filter === tab
                                  ? "bg-[#7A002A] text-white shadow-xs"
                                  : "bg-[#2B0A18]/5 text-[#2B0A18]/70 hover:bg-[#2B0A18]/10"
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Guest Row List */}
                      <div className="mt-3 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {filteredGuests.map((g) => (
                          <div
                            key={g.id}
                            className="p-2 rounded-xl bg-[#FDFBF8] border border-[#2B0A18]/10 text-xs flex items-center justify-between"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-bold text-[#2B0A18] truncate text-[11px]">{g.name}</p>
                              <p className="text-[9px] text-[#2B0A18]/60">
                                {g.passesAssigned} Passes • {g.dietary || g.confirmedAt}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                g.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : g.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-neutral-100 text-neutral-600"
                              }`}
                            >
                              {g.status === "confirmed"
                                ? `${g.passesConfirmed} Confirmed`
                                : g.status === "pending"
                                ? "Pending"
                                : "Declined"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-3 border-t border-[#2B0A18]/10">
                      <button
                        onClick={() => alert("Simulation: Excel export downloaded.")}
                        className="w-full py-2.5 rounded-xl bg-[#2B0A18] text-white text-xs font-semibold hover:bg-[#7A002A] transition-colors flex items-center justify-center gap-1.5 shadow"
                      >
                        <Download className="w-3.5 h-3.5 text-[#B08D3C]" />
                        <span>Download Guest List (Excel / CSV)</span>
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
      {/* 3. BENTO GRID: HOST MANAGEMENT SUPERPOWERS */}
      {/* ==================================================================== */}
      <section id="features" className="py-20 md:py-24 bg-white border-y border-[#2B0A18]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Host Security &amp; Organization
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Total Control Over Every Seat and Family Pass
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Designed specifically to prevent uninvited guests, uncoordinated table arrangements, and costly catering surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 (Large 2-col): Strict Pass Locking */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Zero Surprise Plus-Ones
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Lock Exact Seat Counts per Household
                </h3>
                <p className="text-[#2B0A18]/75 text-sm sm:text-base leading-relaxed mb-6">
                  When a guest opens their personalized invitation link, they see only their allotted tickets (e.g. &quot;Reserved for 2 Guests&quot;). They cannot add extra friends or cousins without your explicit permission, keeping your banquet budget strictly on track.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-[#2B0A18]/10">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" />
                      Individual Ticket Caps
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      Set 1, 2, 4 or 6 passes per household. The dropdown restricts selection beyond the quota.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                    <p className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-purple-700" />
                      Optional Unlimited Mode
                    </p>
                    <p className="text-[11px] text-purple-800 mt-1">
                      For open celebrations, toggle open RSVPs with name &amp; phone verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: 1-Click Excel / Security List Export */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#B08D3C]/10 text-[#B08D3C] flex items-center justify-center mb-6">
                  <Download className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Banquet Hall Ready
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  One-Tap Security Export
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  Export clean Excel / CSV spreadsheets for the venue security guard at the door, catering staff, and table decorators in one tap.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#2B0A18]/10 text-xs space-y-1.5">
                <p className="font-bold text-[#2B0A18]">Includes columns for:</p>
                <p className="text-[11px] text-[#2B0A18]/70">
                  Guest Name • Phone Number • Passes Confirmed • Dietary Restrictions • Table Number (VIP).
                </p>
              </div>
            </div>

            {/* Card 3: Mobile Friendly (No App Store Download) */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Always in Your Pocket
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Check from Anywhere
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  Bookmark your private host URL on your phone&apos;s home screen. Review new confirmations during lunch or when meeting your banquet coordinator.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#2B0A18]/10 flex items-center justify-between">
                  <span className="font-semibold">Real-Time Refresh</span>
                  <span className="text-emerald-700 font-bold">Instant</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#2B0A18]/10 flex items-center justify-between">
                  <span className="font-semibold">Security Token Protected</span>
                  <span className="text-[#7A002A] font-bold">Private</span>
                </div>
              </div>
            </div>

            {/* Card 4 (Spans 2-col): Dietary & Menu Breakdown */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-[#2B0A18] to-[#1A050E] text-white shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#E5C158] flex items-center justify-center mb-6 border border-white/10">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
                  Zero Food Waste
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
                  Automatic Dietary &amp; Entrée Headcounts
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                  Catering companies charge high penalties for unconsumed meals and emergency vegan plates. Our panel groups and counts every specific dietary request so your caterer produces the exact quantities required.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Entrée Tallies</p>
                    <p className="text-white/70 text-[11px]">Instant counts for beef, poultry, fish &amp; vegetarian.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Allergy Alerts</p>
                    <p className="text-white/70 text-[11px]">Highlights gluten, nut, and dairy alerts by guest.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Companion Names</p>
                    <p className="text-white/70 text-[11px]">Guests list every attendee&apos;s full name for seating.</p>
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
              Streamlined Coordination
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              How the Live RSVP System Works
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              From your initial guest list to the final banquet headcounts in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  01
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Configure Guest Quotas
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Enter your family names and assigned ticket counts (e.g. Familia Alvarez: 4 seats). Our system generates private secure tokens for each household.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Personalized pass allocation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  02
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Guests Confirm in 1 Tap
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Guests open their 3D invitation, view their allocated seats, choose their meals, and tap &quot;Confirm Attendance&quot; with zero login friction.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Zero app installs required</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  03
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Real-Time Banquet Totals
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Your live host dashboard updates automatically. Download an Excel roster ready for the banquet hall door security and catering coordinator.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Live exports to Excel / CSV</span>
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
              Includes Full Host Dashboard &amp; Unlimited Guests
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Never pay extra for additional guest confirmations or export features.
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
                  Great for hosts who want live confirmation tracking and individual family pass quotas.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-[#2B0A18]/85 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Real-time mobile host control dashboard</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Strict family pass limits (zero uninvited plus-ones)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Instant CSV / Excel spreadsheet export</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Interactive 3D unboxing invitation &amp; music player</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Unlimited guests and confirmations included</span>
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
                    White-Glove Guest Management &amp; Gallery
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-white">$199</span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                    One-Time Payment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/70 mb-6">
                  Complete white-glove setup by our team: meal choice tracking, guest photo wall, and bilingual management.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-white/90 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span className="font-semibold text-white">Everything in Plan Assisted, PLUS:</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Plated entrée &amp; dietary allergy preference tracker</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Guest photo upload wall (QR code + instant ZIP download)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Bilingual Spanish / English interface</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Dedicated event coordinator support via WhatsApp</span>
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
              Frequently Asked Questions About RSVP Tracking
            </h2>
            <p className="text-base text-[#2B0A18]/70 font-light">
              Everything you need to know about pass limits, Excel exports, and host security.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does strict pass control work to stop uninvited guests?",
                a: "You specify how many seats each guest or family is granted (e.g. 2 passes for a couple). When they open their link, the RSVP form only permits them to confirm up to that designated limit. They cannot type in additional names or exceed their quota.",
              },
              {
                q: "Can I export the guest list to Excel for my venue or caterer?",
                a: "Yes! With one tap from your host dashboard, you can export a clean spreadsheet formatted with guest names, verified phone numbers, confirmed companion headcounts, and meal choices. You can email this directly to your banquet hall or security team.",
              },
              {
                q: "Do I need to create an account or remember a password to check RSVPs?",
                a: "No passwords required! You receive a private, secure administrative link generated specifically for your event. Bookmark it in Safari or Chrome on your phone to check responses whenever you like.",
              },
              {
                q: "Can I manually update a guest if they confirm to me in person?",
                a: "Yes. From your host panel, you can manually mark any guest as confirmed or declined and adjust their attendee count in seconds.",
              },
              {
                q: "Can guests select meal choices or report dietary restrictions?",
                a: "Yes, our VIP plan includes custom entrée selection (Beef, Salmon, Chicken, Vegan) as well as a dedicated dietary allergy input field.",
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
            Zero Guesswork
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
            Take Control of Your Event Guest List Today
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-light max-w-2xl mx-auto mb-10">
            Have questions about pass management or want to see a live host dashboard demo? Message our team now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] font-bold text-sm shadow-xl hover:brightness-105 transition-all"
            >
              <BarChart3 className="w-4 h-4 fill-current" />
              <span>See Live Dashboard Demo</span>
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
              Or text us directly: (818) 299-4882
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
            <Link href="/rsvp-tracking" className="hover:text-white text-white font-semibold">
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
