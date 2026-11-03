"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@/lib/analytics";
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
  "https://wa.me/18182994882?text=Hola%20Click%20%26%20Love!%20Me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20invitaciones%20de%20Quincea%C3%B1era.";

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
    name: "Celestial Butterfly (Mariposas)",
    tag: "Gala & Real",
    slug: "mariposas-xv",
    image: "/assets/home-real/blue-butterfly-real.webp",
    palette: "Baby Blue • Lavanda • Plata",
    description: "Mariposas animadas, arco de cuento de hadas, dedicatoria de padres y desglose completo de la corte de honor.",
    highlights: ["Sobre 3D interactivo", "Mariposas animadas", "Sección para chambelanes y damas"],
  },
  {
    id: "elegant-rose",
    name: "Vintage Quinceañera (Isabella)",
    tag: "Romántico",
    slug: "isabella-xv",
    image: "/assets/home-real/elegant-rose-real.webp",
    palette: "Rosa Pastel • Oro Suave • Marfil",
    description: "Réplica estilo Canva de alta costura con sello de cera, alternador bilingüe inglés/español, galería 'Antes y Ahora' y reproductor musical.",
    highlights: ["Bilingüe EN / ES", "Línea de tiempo de fotos", "Tipografía clásica curva"],
  },
  {
    id: "quince-rosado",
    name: "Quince Rosado (Princesa de Gala)",
    tag: "Elegante",
    slug: "quince-rosado",
    image: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.webp",
    palette: "Magenta Profundo • Rosa • Oro",
    description: "Estética clásica de salón real con filigranas doradas, apertura con lazo de seda y datos de la misa parroquial.",
    highlights: ["Lazo virtual de gala", "Selector estricto de pases", "Mesa de regalos con Zelle"],
  },
  {
    id: "baby-blue",
    name: "Garden Baby Blue & Castillo",
    tag: "Majestuoso",
    slug: "baby-blue-xv",
    image: "/assets/template-baby-blue/foto-gazebo.webp",
    palette: "Azul Cenicienta • Platino • Perla",
    description: "Ambiente de carruaje real con reloj de cuenta regresiva, mapa postal de la capilla y tributo del vals padre e hija.",
    highlights: ["Carruaje de palacio", "Vals padre e hija", "Rutas GPS en vivo"],
  },
  {
    id: "beauty-quince",
    name: "Beauty Quince (Rosa Encantada)",
    tag: "Gala Nocturna",
    slug: "beauty-quince-xv",
    image: "/assets/template-rose/722d78548334333072ad7200e4f8233e.webp",
    palette: "Azul Medianoche • Oro Imperial",
    description: "Inspirada en el cuento de hadas con sobre azul real, rosa encantada, itinerario Party Plan, política de niños y confirmación por SMS.",
    highlights: ["Rosa encantada animada", "Itinerario Party Plan", "Política de niños clara"],
  },
];

export default function QuinceLandingPageEs() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Host dashboard search simulation
  const [searchGuest, setSearchGuest] = useState("");
  const [guestList, setGuestList] = useState([
    { id: 1, name: "Familia Morales", passes: 4, confirmed: 4, status: "Confirmado", phone: "(818) ***-4921" },
    { id: 2, name: "Tíos Ramirez & Primos", passes: 5, confirmed: 5, status: "Confirmado", phone: "(323) ***-8812" },
    { id: 3, name: "Padrinos de Brindis (Gómez)", passes: 2, confirmed: 2, status: "Confirmado", phone: "(818) ***-1290" },
    { id: 4, name: "Familia Castillo", passes: 3, confirmed: 0, status: "Pendiente", phone: "(626) ***-7734" },
  ]);

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

  const filteredGuests = guestList.filter((g) =>
    g.name.toLowerCase().includes(searchGuest.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#2B0A18] font-['Montserrat',sans-serif] selection:bg-[#7A002A] selection:text-white">
      {/* ==================================================================== */}
      {/* 1. BARRA DE NAVEGACIÓN SUPERIOR (Sticky / Minimalista) */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-50 bg-[#FDFBF8]/90 backdrop-blur-md border-b border-[#2B0A18]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/es"
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
                Quinceañeras • Los Ángeles
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2B0A18]/80">
            <a href="#caracteristicas" className="hover:text-[#7A002A] transition-colors py-1">
              Características
            </a>
            <a href="#como-funciona" className="hover:text-[#7A002A] transition-colors py-1">
              Cómo Funciona
            </a>
            <a href="#plantillas" className="hover:text-[#7A002A] transition-colors py-1">
              Plantillas
            </a>
            <a href="#precios" className="hover:text-[#7A002A] transition-colors py-1">
              Precios
            </a>
            <a href="#preguntas" className="hover:text-[#7A002A] transition-colors py-1">
              Preguntas
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "es-invitaciones-de-quinceanera" })}
              className="hidden lg:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border border-[#2B0A18]/15 text-[#2B0A18] hover:border-[#7A002A] hover:text-[#7A002A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B08D3C]" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "es-invitaciones-de-quinceanera" })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A002A] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#7A002A]/20 hover:bg-[#5C0020] active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. SECCIÓN HERO (2 Columnas en Escritorio) */}
      {/* ==================================================================== */}
      <section className="relative pt-12 pb-20 md:py-24 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#7A002A]/10 via-[#B08D3C]/10 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Columna Izquierda */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7A002A]/5 border border-[#7A002A]/20 text-[#7A002A] text-xs font-semibold tracking-wide mb-6">
                <MapPin className="w-3.5 h-3.5 text-[#B08D3C]" />
                <span>Sirviendo a Los Ángeles y el Valle de San Fernando</span>
              </div>

              <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B0A18] leading-[1.12] tracking-tight mb-6">
                Invitaciones Digitales de Quinceañera que{" "}
                <span className="italic font-normal text-[#7A002A] underline decoration-[#B08D3C]/60 decoration-wavy">
                  Tus Invitados Realmente Abren
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#2B0A18]/80 leading-relaxed mb-8 max-w-2xl font-light">
                Sobres interactivos en 3D con música personalizada, confirmaciones instantáneas por SMS y cero aplicaciones para descargar. Dale a tu quinceañera la gala que merece.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-[#2B0A18]/10 w-full max-w-xl">
                <div className="flex items-center gap-1 text-[#B08D3C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B08D3C] text-[#B08D3C]" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#2B0A18]">
                  4.98 / 5 Calificación
                </span>
                <span className="text-xs text-[#2B0A18]/60">
                  • Más de 1,200 familias en el Sur de California confían en nosotros
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <a
                  href="#plantillas"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#7A002A] to-[#9B113F] text-white text-base font-semibold shadow-xl shadow-[#7A002A]/25 hover:shadow-2xl hover:shadow-[#7A002A]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <Sparkles className="w-5 h-5 text-[#E5C158]" />
                  <span>Ver Demos en Vivo</span>
                </a>
                <a
                  href="#precios"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#2B0A18]/20 bg-white/70 text-[#2B0A18] text-base font-semibold hover:border-[#7A002A] hover:text-[#7A002A] hover:bg-white transition-all text-center"
                >
                  <span>Ver Precios ($99 - $199)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[#2B0A18]/70">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Sin descargas para invitados
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Ruta GPS directa a salones en LA
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Cero publicidad de terceros
                </span>
              </div>
            </div>

            {/* Columna Derecha: Mockup realista de teléfono con Sobre 3D */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                <div className="absolute -top-4 -right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-[#B08D3C]/30 flex items-center gap-2 text-xs font-semibold text-[#2B0A18] animate-bounce">
                  <Sparkles className="w-4 h-4 text-[#B08D3C]" />
                  <span>¡Toca el sobre para abrirlo!</span>
                </div>

                <div className="relative rounded-[44px] p-3.5 bg-gradient-to-b from-[#3A222A] via-[#1A050E] to-[#120309] shadow-2xl shadow-[#1A050E]/40 border-4 border-[#5A3844]">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e24] ring-1 ring-white/10" />
                  </div>

                  <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-b from-[#2B0A18] via-[#1A050E] to-[#100308] text-white p-5 pt-12 pb-6 min-h-[580px] flex flex-col justify-between">
                    <div className="text-center">
                      <span className="inline-block text-[10px] tracking-widest uppercase font-semibold text-[#B08D3C] px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                        Mis Quince Años
                      </span>
                      <h3 className="font-['Playfair_Display',serif] text-xl font-bold tracking-tight text-white">
                        Valeria Morales
                      </h3>
                      <p className="text-[11px] text-white/70">
                        Sábado, 14 de Noviembre, 2026 • Glendale, CA
                      </p>
                    </div>

                    {/* Sobre 3D Interactivo */}
                    <div
                      onClick={() => setEnvelopeOpen(!envelopeOpen)}
                      className="my-auto cursor-pointer group select-none relative perspective-1000"
                    >
                      <div className="relative mx-auto w-[240px] h-[160px] bg-[#F7EBE8] rounded-xl shadow-2xl border border-[#E8D4D0] overflow-visible transition-all duration-700">
                        <div className="absolute inset-2 border border-[#B08D3C]/40 rounded-lg pointer-events-none" />

                        {/* Tarjeta interior deslizante */}
                        <div
                          className={`absolute inset-x-2 bg-white rounded-lg shadow-xl p-3 border border-[#E8DEC8] flex flex-col items-center justify-center text-center transition-all duration-700 ${
                            envelopeOpen
                              ? "-translate-y-20 z-20 opacity-100 shadow-2xl"
                              : "translate-y-2 z-0 opacity-80"
                          }`}
                        >
                          <span className="text-[9px] uppercase tracking-wider text-[#B08D3C] font-semibold">
                            Invitación de Gala
                          </span>
                          <h4 className="font-['Playfair_Display',serif] text-sm font-bold text-[#2B0A18] my-0.5">
                            Valeria Morales
                          </h4>
                          <p className="text-[9px] text-[#2B0A18]/70">
                            The Brandview Ballroom • Glendale
                          </p>
                          <div className="mt-1.5 flex items-center gap-1 text-[8px] font-semibold text-[#7A002A] bg-[#7A002A]/10 px-2 py-0.5 rounded-full">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>4 Pases Reservados</span>
                          </div>
                        </div>

                        {/* Solapa superior que rota en 3D */}
                        <div
                          style={{ transformOrigin: "top center" }}
                          className={`absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#F2DBD6] to-[#E8CBC4] rounded-t-xl border-b border-[#D8B9B1] transition-transform duration-700 z-10 flex items-center justify-center ${
                            envelopeOpen ? "rotate-x-180 -translate-y-full opacity-40" : "rotate-x-0 opacity-100"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#7A002A] text-white flex items-center justify-center shadow-lg border-2 border-[#B08D3C] font-['Playfair_Display',serif] text-xs font-bold">
                            XV
                          </div>
                        </div>

                        {/* Bolsillo inferior */}
                        <div className="absolute bottom-0 inset-x-0 h-[100px] bg-gradient-to-t from-[#F7EBE8] to-[#F2DBD6] rounded-b-xl z-10 flex flex-col items-center justify-end pb-3">
                          <p className="text-[10px] font-medium text-[#2B0A18]/80 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#B08D3C]" />
                            {envelopeOpen ? "Toca para cerrar sobre" : "Toca para abrir invitación"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Barra de música y botón de confirmación */}
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
                              Vals de las Mariposas
                            </p>
                            <p className="text-[9px] text-white/60">
                              {musicPlaying ? "Sonando vista previa..." : "Vals Real Tradicional"}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#B08D3C] font-mono">03:15</span>
                      </div>

                      <button
                        onClick={() => setEnvelopeOpen(true)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Confirmar Asistencia (RSVP)</span>
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
      {/* 3. BENTO GRID DE CARACTERÍSTICAS (Beneficios Clave) */}
      {/* ==================================================================== */}
      <section id="caracteristicas" className="py-20 md:py-24 bg-white border-y border-[#2B0A18]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Organización Sin Estrés
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              La Forma Más Moderna y Elegante de Invitar a Tus Seres Queridos
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Reemplaza las costosas tarjetas impresas y los mensajes de texto desordenados con un sistema digital completo que tus invitados amarán.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Tarjeta 1 (Grande): Control Estricto de Pases */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Cero Invitados No Deseados
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Control Estricto de Pases por Familia
                </h3>
                <p className="text-[#2B0A18]/75 text-sm sm:text-base leading-relaxed mb-6">
                  Asigna el número exacto de boletos por hogar (ej. &quot;Familia Morales · 4 pases asignados&quot;). El formulario restringe el registro a ese cupo, evitando que lleguen personas sin invitación y cuidando tu presupuesto de platillos.
                </p>

                {/* Simulación del Panel del Anfitrión */}
                <div className="bg-white rounded-2xl p-5 border border-[#2B0A18]/10 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#2B0A18]/10 text-xs">
                    <span className="font-bold text-[#2B0A18]">
                      Panel en Vivo • 180 Pases Asignados
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                      142 Confirmados (79%)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredGuests.map((g) => (
                      <div
                        key={g.id}
                        className="p-2.5 rounded-xl bg-[#FDFBF8] border border-[#2B0A18]/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#2B0A18]">{g.name}</p>
                          <p className="text-[11px] text-[#2B0A18]/60">
                            {g.passes} pases asignados • {g.phone}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            g.status === "Confirmado"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {g.status === "Confirmado" ? `${g.confirmed} Confirmados` : "Pendiente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Confirmación Instantánea por SMS */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#B08D3C]/10 text-[#B08D3C] flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Sin Apps ni Contraseñas
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  Confirmación Instantánea por SMS
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  Tus invitados no tienen que crear cuentas ni descargar nada de la tienda. Abren el enlace en Safari o Chrome y confirman con un solo toque desde su número móvil.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#2B0A18]/10 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verificado al instante</span>
                </div>
                <p className="text-[11px] text-[#2B0A18]/70">
                  Recordatorios automáticos para asegurar que todos confirmen antes de tu fecha límite del salón.
                </p>
              </div>
            </div>

            {/* Tarjeta 3: Navegación GPS Directa a Salones en LA */}
            <div className="rounded-3xl p-8 bg-[#FDFBF8] border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7A002A]/10 text-[#7A002A] flex items-center justify-center mb-6">
                  <Navigation className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#B08D3C] tracking-wider">
                  Cero Invitados Perdidos
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18] mt-1 mb-3">
                  GPS Directo a Salones en LA
                </h3>
                <p className="text-[#2B0A18]/75 text-sm leading-relaxed mb-6">
                  Un solo toque abre la ruta en Google Maps, Apple Maps o Waze hacia salones populares en Glendale, Burbank, Pasadena, Downey y el Valle de San Fernando.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#2B0A18]/10">
                  <span className="font-semibold text-[#2B0A18]">Brandview Ballroom Glendale</span>
                  <span className="text-[#B08D3C] font-semibold text-[11px]">Waze &amp; Maps</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#2B0A18]/10">
                  <span className="font-semibold text-[#2B0A18]">Castaway Burbank</span>
                  <span className="text-[#B08D3C] font-semibold text-[11px]">Waze &amp; Maps</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#2B0A18]/10">
                  <span className="font-semibold text-[#2B0A18]">Renaissance Banquet Hall</span>
                  <span className="text-[#B08D3C] font-semibold text-[11px]">Waze &amp; Maps</span>
                </div>
              </div>
            </div>

            {/* Tarjeta 4 (Spans 2-col): Sobre 3D con Música y Cero Publicidad */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-[#2B0A18] to-[#1A050E] text-white shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#E5C158] flex items-center justify-center mb-6 border border-white/10">
                  <Music className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase font-bold text-[#E5C158] tracking-wider">
                  Experiencia de Gala
                </span>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
                  Sobre 3D Virtual con Música y Cero Publicidad
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                  Nada de PDFs estáticos ni sitios web llenos de molestos anuncios de Google. Tu invitación se abre con la magia de un sobre tridimensional real con sello de cera mientras suena el vals elegido por la quinceañera.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Música Personalizada</p>
                    <p className="text-white/70 text-[11px]">Tu vals o canción favorita con reproductor integrado.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">100% Sin Publicidad</p>
                    <p className="text-white/70 text-[11px]">Experiencia de lujo pura sin marcas invasivas.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-bold text-[#E5C158] mb-1">Muro de Fotos en Vivo</p>
                    <p className="text-white/70 text-[11px]">Invitados suben fotos de la fiesta mediante código QR.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. FLUJO EN 3 PASOS ("Cómo funciona") */}
      {/* ==================================================================== */}
      <section id="como-funciona" className="py-20 md:py-24 bg-[#FAF5EC]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Proceso Sencillo
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Tu Invitación Lista en Menos de 48 Horas
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              Nosotros nos encargamos del montaje digital y la programación para que tú solo disfrutes los preparativos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  01
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Elige Tu Plantilla Favorita
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Explora nuestras colecciones: Celestial Butterfly, Vintage Isabella, Quince Rosado o Beauty Quince. Envíanos el nombre de la quinceañera, fecha, iglesias y salones.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Demos en vivo para probar en tu celular</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  02
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Personalización con Nuestro Equipo
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Nuestro equipo de diseño en Los Ángeles sube tus fotos de sesión, añade tu canción, ajusta el sobre 3D y configura tu panel con los pases de cada familia.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Atención dedicada por WhatsApp y teléfono</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#2B0A18]/10 shadow-sm flex flex-col justify-between group hover:border-[#7A002A]/40 transition-colors">
              <div>
                <span className="font-['Playfair_Display',serif] text-5xl font-bold text-[#B08D3C]/30 group-hover:text-[#B08D3C] transition-colors">
                  03
                </span>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18] mt-4 mb-2">
                  Comparte y Recibe Confirmaciones
                </h3>
                <p className="text-sm text-[#2B0A18]/75 leading-relaxed">
                  Envía el enlace por SMS o WhatsApp a tus invitados. Observa cómo confirman en tiempo real y descarga tu lista final para el salón en cualquier momento.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B0A18]/10 text-xs font-semibold text-[#7A002A] flex items-center gap-1">
                <span>Panel del anfitrión en vivo incluido</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. CATÁLOGO VISUAL DE PLANTILLAS */}
      {/* ==================================================================== */}
      <section id="plantillas" className="py-20 md:py-24 bg-white border-b border-[#2B0A18]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
                Colecciones Exclusivas
              </span>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2">
                Explora Nuestras Plantillas de Quinceañera
              </h2>
              <p className="text-base text-[#2B0A18]/70 mt-2 font-light">
                Cada diseño incluye sobre 3D, música, cuenta regresiva, mapas y confirmación por SMS.
              </p>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A002A] hover:text-[#5C0020] transition-colors self-start md:self-end"
            >
              <span>Ver Catálogo Completo (8+ Demos)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEMPLATES_LIST.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-3xl bg-[#FDFBF8] border border-[#2B0A18]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                  <Image
                    src={tpl.image}
                    alt={tpl.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-[#2B0A18] shadow">
                      {tpl.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-4 inset-x-4 text-white">
                    <p className="text-[11px] uppercase tracking-wider text-[#E5C158] font-semibold">
                      {tpl.palette}
                    </p>
                    <h3 className="font-['Playfair_Display',serif] text-xl font-bold mt-0.5">
                      {tpl.name}
                    </h3>
                  </div>
                </div>

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
                      <span>Ver Demo en Vivo</span>
                    </Link>

                    <button
                      onClick={() => handleCheckout("assisted")}
                      className="px-4 py-2 rounded-xl bg-[#7A002A] text-white text-xs font-semibold hover:bg-[#5C0020] transition-colors"
                    >
                      Elegir Diseño
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. TABLA COMPARATIVA DE PRECIOS */}
      {/* ==================================================================== */}
      <section id="precios" className="py-20 md:py-24 bg-[#FAF5EC]/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Precios Claros y Transparentes
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Pago Único. Invitados Ilimitados. Cero Mensualidades.
            </h2>
            <p className="text-base sm:text-lg text-[#2B0A18]/70 font-light">
              A diferencia de otras plataformas que cobran por cada invitado o te obligan a renovar suscripciones, nuestro precio cubre todo tu evento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Plan Asistido ($99) */}
            <div className="rounded-3xl p-8 bg-white border border-[#2B0A18]/15 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18]">
                    Plan Asistido
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#B08D3C] bg-[#B08D3C]/10 px-2.5 py-1 rounded-full">
                    Esencial
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-[#2B0A18]">$99</span>
                  <span className="text-xs text-[#2B0A18]/60 uppercase tracking-wider font-medium">
                    Pago Único
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#2B0A18]/70 mb-6">
                  Ideal para familias que tienen sus datos listos y buscan una invitación con sobre 3D y confirmaciones en vivo.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-[#2B0A18]/85 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Sobre 3D interactivo con sello de cera</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Confirmación instantánea por SMS sin apps</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Panel del anfitrión para ver respuestas en vivo</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Rutas GPS a iglesia y salón de banquetes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Mesa de regalos con Zelle / sobre de lluvia</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Invitados ilimitados (sin costo extra por persona)</span>
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
                    <span>Elegir Plan Asistido ($99)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Plan VIP Los Ángeles ($199) - Destacado */}
            <div className="rounded-3xl p-8 bg-gradient-to-b from-[#2B0A18] to-[#1A050E] text-white border-2 border-[#B08D3C] shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                El Más Elegido
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white">
                    Plan VIP Los Ángeles
                  </h3>
                  <span className="text-xs text-[#E5C158] font-semibold">
                    Servicio Concierge Completo Guante Blanco
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-white">$199</span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-medium">
                    Pago Único
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/70 mb-6">
                  Montaje integral por nuestro equipo de diseño: fotos retocadas, música a medida, muro de fotos en vivo para invitados y atención prioritaria.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-white/90 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span className="font-semibold text-white">Todo lo del Plan Asistido, MÁS:</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Muro de fotos en vivo (invitados suben fotos por QR + descarga en ZIP)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Alternador bilingüe inglés / español</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Control estricto de pases y dedicatorias especiales</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Asistencia y montaje completo por una diseñadora</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                    <span>Soporte prioritario por WhatsApp hasta el día del evento</span>
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
                    <span>Elegir Plan VIP Los Ángeles ($199)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. ACORDEÓN DE PREGUNTAS FRECUENTES */}
      {/* ==================================================================== */}
      <section id="preguntas" className="py-20 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B08D3C] font-bold">
              Resolvemos Tus Dudas
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B0A18] mt-2 mb-4">
              Preguntas Frecuentes sobre Invitaciones de Quinceañera
            </h2>
            <p className="text-base text-[#2B0A18]/70 font-light">
              Todo lo que necesitas saber sobre pases, confirmaciones y tiempos de entrega.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Cómo funciona el control estricto de pases para que no vayan invitados de más?",
                a: "Tú nos indicas cuántos pases tiene asignados cada familia (ejemplo: 4 pases para los tíos). Cuando ellos abren su invitación, el formulario únicamente les permite confirmar hasta ese número de personas. No pueden añadir acompañantes extra sin tu consentimiento.",
              },
              {
                q: "¿Mis invitados necesitan descargar alguna aplicación en su teléfono?",
                a: "¡Para nada! Esta es una de nuestras mayores ventajas. Tus invitados reciben el enlace por SMS o WhatsApp, lo tocan y se abre de inmediato en el navegador de su teléfono (Safari, Chrome, etc.). No tienen que instalar nada ni recordar contraseñas.",
              },
              {
                q: "¿Cómo sé quién ha confirmado y quién no?",
                a: "Recibes acceso a un panel privado para anfitriones en tu celular. Cada vez que una familia confirma, sus nombres, teléfono y pases aparecen de inmediato en tu pantalla. Puedes descargar la lista en Excel cuando la pida el salón.",
              },
              {
                q: "¿Puedo poner regalos en efectivo o Zelle?",
                a: "Sí. Incluimos una sección especial para 'Lluvia de sobres' o transferencia por Zelle / Venmo con un botón de copiado rápido, para que tus invitados envíen su obsequio fácilmente.",
              },
              {
                q: "¿Cuánto tiempo tarda en estar lista la invitación?",
                a: "El tiempo habitual es de 24 a 48 horas una vez que nos envías tus fotos y detalles del evento. Si tu fecha está muy cerca, escríbenos por WhatsApp al (818) 299-4882 y te ayudamos con entrega prioritaria.",
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

      {/* Servicios relacionados */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E7DCC8]/70">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2B0A18] mb-2">
            Servicios relacionados
          </h2>
          <p className="text-sm text-[#2B0A18]/70 mb-8 max-w-2xl">
            Todo alrededor de tu invitación de quinceañera, desde enviarla hasta seguir las respuestas.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/quince-invitations" className="rounded-2xl border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Quinceañera Invitations (English)</span>
              <span className="text-xs text-[#2B0A18]/70">The same design in English, for guests who read in English.</span>
            </a>
            <a href="/text-message-invitations" className="rounded-2xl border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Invitaciones por mensaje de texto</span>
              <span className="text-xs text-[#2B0A18]/70">Manda la invitación directo por SMS con RSVP en 1 toque.</span>
            </a>
            <a href="/rsvp-tracking" className="rounded-2xl border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Seguimiento RSVP en línea</span>
              <span className="text-xs text-[#2B0A18]/70">Conteo en vivo, control de pases y exporte a Excel para tu salón.</span>
            </a>
            <a href="/whatsapp-invitations" className="rounded-2xl border border-[#E7DCC8] p-5 hover:border-[#B08D3C] hover:shadow-md transition-all block">
              <span className="font-bold text-[#7A002A] block">Invitaciones por WhatsApp</span>
              <span className="text-xs text-[#2B0A18]/70">Tarjetas enriquecidas para compartir en chats privados y grupos.</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. BANNER FINAL DE CONVERSIÓN OSCURA */}
      {/* ==================================================================== */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#1A050E] to-[#100308] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest text-[#E5C158] font-bold">
            Comienza Hoy Mismo
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
            Crea una Primera Impresión Inolvidable para sus Quince Años
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-light max-w-2xl mx-auto mb-10">
            Contáctanos hoy para resolver cualquier duda, verificar disponibilidad de fecha o recibir una demo personalizada en tu teléfono.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href={WHATSAPP_URL} onClick={() => track("click_whatsapp", { origen: "landing", pagina: "es-invitaciones-de-quinceanera" })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#B08D3C] to-[#E5C158] text-[#2B0A18] font-bold text-sm shadow-xl hover:brightness-105 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Escríbenos por WhatsApp</span>
            </a>
            <a
              href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "es-invitaciones-de-quinceanera" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              <Phone className="w-4 h-4 text-[#E5C158]" />
              <span>Llamar {PHONE_DISPLAY}</span>
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/50">
            <a href={PHONE_SMS} onClick={() => track("click_sms", { origen: "landing", pagina: "es-invitaciones-de-quinceanera" })} className="hover:text-white transition-colors underline">
              O envíanos un mensaje de texto por SMS: (818) 299-4882
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#120309] text-white/60 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src="/logo.png" alt="Click & Love" width={1600} height={1600} className="h-7 w-auto object-contain opacity-80" />
            <span className="font-['Playfair_Display',serif] text-sm font-semibold text-white">
              Click &amp; Love
            </span>
            <span className="text-white/40">© {new Date().getFullYear()} Todos los Derechos Reservados.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-white/70">
            <Link href="/es" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <Link href="/es/invitaciones-de-quinceanera" className="hover:text-white text-white font-semibold">
              Quinceañeras
            </Link>
            <Link href="/wedding-invitations-los-angeles" className="hover:text-white transition-colors">
              Bodas
            </Link>
            <Link href="/text-message-invitations" className="hover:text-white transition-colors">
              Invitaciones por SMS
            </Link>
            <Link href="/rsvp-tracking" className="hover:text-white transition-colors">
              Control de Asistencia
            </Link>
            <Link href="/whatsapp-invitations" className="hover:text-white transition-colors">
              WhatsApp
            </Link>
            <Link href="/demo" className="hover:text-white transition-colors">
              Catálogo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
