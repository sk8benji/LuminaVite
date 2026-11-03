"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Globe,
  Lock,
  MessageCircle,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface SiteFooterProps {
  lang?: "en" | "es";
}

const PHONE_DISPLAY = "(818) 299-4882";
const PHONE_TEL = "tel:+18182994882";
const WHATSAPP_URL =
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20information%20about%20digital%20invitations.";
const WHATSAPP_URL_ES =
  "https://wa.me/18182994882?text=Hola%20Click%20%26%20Love!%20Me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20invitaciones%20digitales.";

export default function SiteFooter({ lang = "en" }: SiteFooterProps) {
  const isEs = lang === "es";

  return (
    <footer className="relative bg-[#120309] text-white/70 font-['Montserrat',sans-serif] overflow-hidden border-t border-white/10 selection:bg-[#7A002A] selection:text-white">
      {/* Subtle radial glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-gradient-to-b from-[#7A002A]/25 via-[#B08D3C]/10 to-transparent blur-3xl rounded-full pointer-events-none -z-0" />

      {/* ==================================================================== */}
      {/* 1. TOP STATUS BAR (Refined & Clutter-Free) */}
      {/* ==================================================================== */}
      <div className="relative z-10 border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Status Message */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-white/90 tracking-wide text-[11px] sm:text-xs">
              {isEs
                ? "Entrega Inmediata · Soporte en Vivo a Invitados · Panel Privado de Anfitrión"
                : "Instant Delivery · Live Guest Support · Private Host Dashboard"}
            </span>
          </div>

          {/* Concierge Guarantee & Hours */}
          <div className="flex items-center gap-3 text-[11px] text-white/60">
            <span className="text-[#E5C158] font-medium">
              {isEs ? "Garantía de Entrega 48 Horas" : "48h Delivery Guarantee"}
            </span>
            <span className="text-white/20">•</span>
            <span className="hidden sm:inline">
              {isEs ? "Lun – Sáb 9:00 AM – 7:00 PM PST" : "Mon – Sat 9AM – 7PM PST"}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN 4-COLUMN EDITORIAL GRID */}
      {/* ==================================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1 (Spans 4 cols): Brand Identity & Concierge Hotline */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <Link
                href={isEs ? "/es" : "/"}
                className="inline-flex items-center gap-3 group focus:outline-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Click & Love"
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="font-['Playfair_Display',serif] text-2xl font-bold tracking-tight text-white">
                    Click &amp; Love
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#B08D3C] font-semibold">
                    {isEs ? "Invitaciones de Gala" : "Bespoke Digital Invitations"}
                  </span>
                </div>
              </Link>

              <p className="mt-4 text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {isEs
                  ? "Diseñamos invitaciones digitales interactivas con sobres 3D, música personalizada, control estricto de pases y confirmación por SMS para celebraciones modernas en todo el país."
                  : "Crafting bespoke 3D interactive unboxing digital invitations with personalized soundtracks, instant SMS RSVP, and strict family pass control for modern celebrations nationwide."}
              </p>
            </div>

            {/* Direct Contact Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href={isEs ? WHATSAPP_URL_ES : WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#7A002A] to-[#9B113F] text-white text-xs font-semibold shadow-md shadow-[#7A002A]/30 hover:brightness-110 active:scale-98 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{isEs ? "Contactar por WhatsApp" : "Concierge WhatsApp"}</span>
              </a>

              <div className="flex items-center gap-2 text-xs text-white/70 pt-1">
                <Phone className="w-3.5 h-3.5 text-[#B08D3C]" />
                <a
                  href={PHONE_TEL}
                  className="hover:text-white transition-colors font-medium font-mono"
                >
                  {PHONE_DISPLAY}
                </a>
                <span className="text-white/30">•</span>
                <span className="text-[11px] text-white/50">
                  {isEs ? "Llamadas y SMS directo" : "Direct Voice & SMS"}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2 (Spans 3 cols): Collections & Live Demos */}
          <div className="lg:col-span-3 space-y-4">
            <p className="font-['Playfair_Display',serif] text-sm font-bold text-white tracking-wide uppercase">
              {isEs ? "Colecciones de Gala" : "Luxury Collections"}
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href={isEs ? "/es/invitaciones-de-quinceanera" : "/quince-invitations"}
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{isEs ? "Invitaciones de Quince" : "Quince Invitations"}</span>
                  <span className="text-[10px] text-[#E5C158] opacity-0 group-hover:opacity-100 transition-opacity">
                    ★ Top
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wedding-invitations-los-angeles"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{isEs ? "Invitaciones de Boda" : "Wedding Invitations"}</span>
                  <span className="text-[10px] text-[#E5C158] opacity-0 group-hover:opacity-100 transition-opacity">
                    ★
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href={isEs ? "/es/invitaciones-de-quinceanera" : "/quince-invitations"}
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Invitaciones Sweet 16" : "Sweet 16 Invitations"}
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Galas y Aniversarios" : "Gala & Anniversaries"}
                </Link>
              </li>
              <li>
                <Link
                  href="/demo/mariposas-xv"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Celestial Butterfly" : "Celestial Butterfly"}
                </Link>
              </li>
              <li>
                <Link
                  href="/demo/isabella-xv"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Vintage Quinceañera" : "Vintage Rose"}
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-1.5 text-[#E5C158] font-semibold hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEs ? "Ver Catálogo Completo (8+)" : "Explore Full Catalog (8+)"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 (Spans 3 cols): Host Features & Technology */}
          <div className="lg:col-span-3 space-y-4">
            <p className="font-['Playfair_Display',serif] text-sm font-bold text-white tracking-wide uppercase">
              {isEs ? "Tecnología de Anfitrión" : "Host Technology"}
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/rsvp-tracking"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Control Estricto de Pases" : "Strict Family Pass Control"}
                </Link>
              </li>
              <li>
                <Link
                  href="/text-message-invitations"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Confirmación por SMS 1-Click" : "Instant SMS RSVPs (98% Open)"}
                </Link>
              </li>
              <li>
                <Link
                  href="/whatsapp-invitations"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Enlaces Ricos de WhatsApp" : "Rich WhatsApp Invitations"}
                </Link>
              </li>
              <li>
                <Link
                  href="/rsvp-tracking"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Muro de Fotos por Código QR" : "Live Guest Photo QR Wall"}
                </Link>
              </li>
              <li>
                <Link
                  href={isEs ? "/es#servicios" : "/#servicios"}
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Ruta GPS con Google Maps" : "1-Tap GPS to Google Maps"}
                </Link>
              </li>
              <li>
                <Link
                  href={isEs ? "/es#precios" : "/#precios"}
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Mesa de Regalos y Zelle Directo" : "Honeymoon & Zelle Registry"}
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-medium hover:underline"
                >
                  <Lock className="w-3.5 h-3.5 text-[#B08D3C]" />
                  <span>{isEs ? "Acceso a Panel de Anfitrión" : "Host Dashboard Portal"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 (Spans 2 cols): Company & Support (Reemplaza Venues & Areas) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="font-['Playfair_Display',serif] text-sm font-bold text-white tracking-wide uppercase">
              {isEs ? "Empresa y Soporte" : "Company & Support"}
            </p>
            <ul className="space-y-2.5 text-xs text-white/70 font-light">
              <li>
                <Link
                  href={isEs ? "/es#como-funciona" : "/#como-funciona"}
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Cómo Funciona" : "How It Works"}
                </Link>
              </li>
              <li>
                <Link
                  href={isEs ? "/es#precios" : "/#precios"}
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Planes y Precios" : "Pricing Plans"}
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Muestras en Vivo" : "Sample Demos"}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Acceso de Anfitrión" : "Host Login"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Política de Privacidad" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  {isEs ? "Términos de Servicio" : "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. BOTTOM BAR & REFINED COPYRIGHT */}
      {/* ==================================================================== */}
      <div className="relative z-10 border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          {/* Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} Click &amp; Love LLC.</span>
            <span>{isEs ? "Todos los derechos reservados." : "All rights reserved."}</span>
          </div>

          {/* Micro-guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-white/60">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B08D3C]" />
            <span>
              {isEs
                ? "Sin Publicidad de Terceros · Privacidad Garantizada"
                : "Zero Third-Party Ads · Private & Confidential"}
            </span>
          </div>

          {/* Refined Language Switcher Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 text-[11px]">
            <Link
              href="/"
              className={`px-3 py-1 rounded-full transition-all ${
                !isEs
                  ? "bg-[#7A002A] text-white font-bold shadow-xs"
                  : "text-white/70 hover:text-white"
              }`}
            >
              EN
            </Link>
            <Link
              href="/es"
              className={`px-3 py-1 rounded-full transition-all ${
                isEs
                  ? "bg-[#7A002A] text-white font-bold shadow-xs"
                  : "text-white/70 hover:text-white"
              }`}
            >
              ES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
