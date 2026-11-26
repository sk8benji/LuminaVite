"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { translations, type Language } from "@/lib/home-translations";
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
  MessageCircle,
  Music,
  Play,
  Sparkles,
  Users,
} from "lucide-react";

// ============================================================================
// CONSTANTS & ASSETS
// ============================================================================
const PHONE_DISPLAY = "(818) 918-2519";
const PHONE_TEL = "tel:+18189182519";
const PHONE_SMS = "sms:+18182994882";
const WHATSAPP_URL =
  "https://wa.me/18182994882?text=Hola%20Click%20%26%20Love!%20Quiero%20un%20Save%20the%20Date%20digital.";
const DEMO_URL = "/save-the-date/demo";
// El demo en vivo, verificado 2026-11-18: Luna's Roaring 15th Celebration,
// Los Ángeles, cuenta regresiva al 2027-09-18T20:00:00Z.
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

export default function SaveTheDateLandingPageEs() {
  const lang: Language = "es";
  const t = translations[lang];
  const b = t.brand;

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
        body: JSON.stringify({ plan: "save-the-date", lang: "es" }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Hubo un error al iniciar la compra. Por favor intenta de nuevo.");
        setCheckoutLoading(null);
      }
    } catch (err) {
      console.error("Error en checkout:", err);
      alert("Error de conexión al procesar la compra.");
      setCheckoutLoading(null);
    }
  };

  const faqs = [
    {
      q: "¿Cómo se envía un Save the Date digital?",
      a: "Con un enlace — por mensaje de texto, WhatsApp o correo. Tus invitados lo tocan y el sobre se abre en su teléfono: tu foto, la fecha, una cuenta regresiva en vivo y un botón para guardarla en su calendario. Sin app que instalar, sin cuenta que crear, sin nada que imprimir.",
    },
    {
      q: "¿Se puede combinar el Save the Date con el RSVP?",
      a: "Sí. Cada Save the Date incluye Confirmación Anticipada: tus invitados ya pueden decirte si planean venir, meses antes de que salga la invitación formal. Ves las respuestas tempranas en tu panel de anfitrión y planeas con números reales, no con suposiciones.",
    },
    {
      q: "¿Cuánto cuesta un Save the Date?",
      a: "Un Save the Date digital de Click and Love cuesta $49, pago único — sobre, cuenta regresiva, guardar en calendario, Confirmación Anticipada, galería de fotos y música incluidos. Uno impreso sale más caro cuando sumas diseño, impresión, sobres y una estampilla por invitado. El Save the Date también viene incluido sin costo en el plan VIP ($279).",
    },
    {
      q: "¿Cuándo se deben enviar los Save the Date?",
      a: "De 6 a 12 meses antes de la celebración. Es lo suficientemente temprano para que los invitados de fuera planeen su viaje, y lo suficientemente tarde para que la fecha ya esté firme. La invitación formal se envía unas 8 semanas antes del evento.",
    },
    {
      q: "¿Qué debe llevar un Save the Date?",
      a: "Cuatro cosas: sus nombres, la fecha, la ciudad y una forma de guardarla. El nuestro agrega el resto por ti — tu foto, una cuenta regresiva en vivo, el botón para guardar en calendario y la Confirmación Anticipada para que te respondan de inmediato.",
    },
  ];

  const features = [
    {
      icon: Mail,
      title: "Un sobre con tu foto",
      text: "Tus invitados tocan el sobre sellado y se abre sobre su foto — el mismo momento de abrir que tu invitación, en miniatura.",
    },
    {
      icon: Clock,
      title: "Una cuenta regresiva que avanza",
      text: "Días, horas, minutos, segundos — en vivo en la página. Convierte una fecha en una tarjeta en algo que tus invitados vuelven a ver.",
    },
    {
      icon: CalendarPlus,
      title: "Guardar en calendario, con un toque",
      text: "Google Calendar o Apple Calendar. Un toque y tu fecha queda en su teléfono, con recordatorio — adiós al “se me olvidó”.",
    },
    {
      icon: Users,
      title: "Confirmación Anticipada",
      text: "Tus invitados ya pueden decir “ahí estaremos” con meses de anticipación. Ves el conteo temprano en tu panel de anfitrión.",
    },
    {
      icon: Heart,
      title: "Galería de fotos",
      text: "Unas fotos favoritas de la festejada, dentro del mismo Save the Date. Se siente personal, no un formulario.",
    },
    {
      icon: Music,
      title: "Tu música, en dos idiomas",
      text: "La página suena tu canción y habla inglés y español — cada invitado la lee en su idioma.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#2B0A18]">
      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-10 items-center">
          <div>
            <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A]">
              Save the Date &middot; Digital
            </p>
            <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] font-bold text-[#2B0A18] mt-4">
              Save the Date Digital
            </h1>
            <p className="text-lg text-[#5C3A45] font-light leading-relaxed mt-5 max-w-xl">
              Tu fecha, en el teléfono de tus invitados, meses antes de la
              invitación. Un sobre con tu foto, una cuenta regresiva que avanza,
              un toque para guardarla en el calendario — y tus invitados ya pueden
              decir que ahí estarán.
            </p>
            <p className="text-base text-[#5C3A45] mt-4 max-w-xl">
              <span className="font-bold text-[#7A002A]">$49, pago único.</span>{" "}
              Sin imprimir, sin estampillas, sin app que instalar. Se envía de 6 a
              12 meses antes de la celebración.
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
                Quiero mi Save the Date — $49
              </button>
              <Link
                href={DEMO_URL}
                onClick={() => track("click_demo", { pagina: "save-the-date" })}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white border border-[#E7DCC8] text-[#7A002A] font-bold text-sm shadow-sm hover:border-[#D4AF37] transition-all"
              >
                <Play className="w-4 h-4" />
                Ver el demo en vivo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-[#8A6B73] mt-4">
              Inglés y español &middot; Funciona en cualquier teléfono &middot; También incluido sin costo en el plan VIP
            </p>
          </div>

          {/* El demo real, en marco de teléfono — la cuenta regresiva avanza en vivo */}
          <div className="flex justify-center">
            <div className="w-[320px] sm:w-[340px] rounded-[2.5rem] border-[10px] border-[#1A1A1A] bg-[#1A1A1A] shadow-[0_30px_60px_rgba(43,10,24,0.35)] overflow-hidden">
              <div className="relative">
                <Image
                  src={DEMO_PHOTO}
                  alt="Luna — demo de Save the Date"
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
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold">Solo faltan</p>
                <div className="flex justify-center gap-3 mt-2">
                  {[
                    { v: cd.days, l: "Días" },
                    { v: cd.hours, l: "Hrs" },
                    { v: cd.mins, l: "Min" },
                    { v: cd.secs, l: "Seg" },
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
                    <CalendarPlus className="w-3.5 h-3.5" /> Guardar fecha
                  </span>
                  <span className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/25 text-white text-xs font-semibold py-2.5">
                    <Users className="w-3.5 h-3.5" /> Confirmación
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
          Arriba: el demo real — el Save the Date de Luna, contando en este momento.{" "}
          <Link href={DEMO_URL} className="underline text-[#7A002A] font-semibold">Ábrelo y tócalo todo.</Link>
        </p>
      </section>

      {/* ================= QUÉ INCLUYE ================= */}
      <section id="inside" className="bg-white border-y border-[#EFE6D4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A] text-center">
            Qué incluye
          </p>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-center mt-3">
            Todo lo que un Save the Date debe hacer
          </h2>
          <p className="text-center text-[#5C3A45] font-light max-w-2xl mx-auto mt-3">
            No es la foto de una tarjeta. Es una paginita interactiva que tus
            invitados abren, guardan y responden de verdad.
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

      {/* ================= CUÁNDO ENVIARLO ================= */}
      <section id="when" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A]">
              Cuándo enviarlo
            </p>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold mt-3 leading-tight">
              Primero el Save the Date. Después la invitación.
            </h2>
            <p className="text-[#5C3A45] font-light leading-relaxed mt-4">
              El Save the Date no es la invitación — es el aviso que hace que la
              invitación funcione. Los invitados que ya guardaron la fecha y ya
              dijeron que vendrán son los que llegan.
            </p>
          </div>
          <ol className="space-y-0">
            {[
              {
                when: "De 6 a 12 meses antes",
                what: "Envía el Save the Date",
                text: "Nombres, fecha, ciudad y un enlace. Los invitados de fuera reservan su viaje; los demás lo ponen en el calendario.",
              },
              {
                when: "Unas 8 semanas antes",
                what: "Envía la invitación formal",
                text: "Todos los detalles — salón, hora, vestimenta y el RSVP completo con tu lista de invitados y pases.",
              },
              {
                when: "La semana del evento",
                what: "Tus invitados llegan sabiendo el plan",
                text: "La Confirmación Anticipada ya te dijo quién viene. Sin perseguir a nadie, sin adivinar el conteo.",
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

      {/* ================= PRECIOS ================= */}
      <section id="pricing" className="bg-white border-y border-[#EFE6D4]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A] text-center">
            Precios
          </p>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-center mt-3">
            $49 solo. Gratis dentro del VIP.
          </h2>
          <p className="text-center text-[#5C3A45] font-light max-w-2xl mx-auto mt-3">
            Compra solo el Save the Date, o llévalo incluido con la invitación
            VIP completa — mismo diseño, álbum de fotos y todo lo demás.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-3xl mx-auto items-stretch">
            <div className="relative rounded-3xl bg-white border border-[#E7DCC8] p-8 flex flex-col shadow-[0_12px_28px_rgba(122,0,42,0.07)]">
              <span className="font-['Montserrat'] text-[10.5px] font-extrabold tracking-[0.18em] uppercase text-[#96690A]">
                Save the Date — solo
              </span>
              <p className="mt-4">
                <span className="font-['Playfair_Display',serif] text-5xl font-bold">$49</span>
                <span className="text-[#5C3A45] text-sm"> pago único</span>
              </p>
              <ul className="space-y-2.5 mt-6 text-sm text-[#3A1B26] flex-1">
                {[
                  "Sobre con tu foto",
                  "Cuenta regresiva en vivo",
                  "Guardar en calendario (Google / Apple)",
                  "Confirmación Anticipada con panel de anfitrión",
                  "Galería de fotos + tu música",
                  "Inglés y español",
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
                Comprar Save the Date — $49
              </button>
            </div>
            <div className="relative rounded-3xl bg-[#7A002A] text-white p-8 flex flex-col shadow-[0_22px_45px_rgba(122,0,42,0.35)] border-2 border-[#FFD166]/40">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFD166] text-[#2B0A18] font-['Montserrat'] font-extrabold text-[10.5px] tracking-[0.18em] uppercase py-1.5 px-4 rounded-full shadow whitespace-nowrap">
                Mejor valor
              </span>
              <span className="font-['Montserrat'] text-[10.5px] font-extrabold tracking-[0.18em] uppercase text-[#FFD166]">
                VIP Todo Incluido
              </span>
              <p className="mt-4">
                <span className="font-['Playfair_Display',serif] text-5xl font-bold">$279</span>
                <span className="text-white/70 text-sm"> pago único</span>
              </p>
              <ul className="space-y-2.5 mt-6 text-sm flex-1">
                {[
                  "Save the Date incluido (valor de $49)",
                  "Invitación digital completa, mismo diseño",
                  "Álbum de fotos en vivo con tarjetas QR para mesas",
                  "Hasta 400 RSVP por SMS + recordatorios",
                  "Cambios ilimitados hasta tu fiesta",
                ].map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Check className="w-4 h-4 text-[#FFD166] shrink-0 mt-0.5" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/es/precios"
                onClick={() => track("click_pricing", { pagina: "save-the-date" })}
                className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFD166] text-[#2B0A18] font-bold text-sm hover:brightness-105 transition-all"
              >
                Ver VIP en Precios
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-[#8A6B73] mt-6">
            Pago único, compra segura. Tus invitados nunca pagan nada ni necesitan cuenta.
          </p>
        </div>
      </section>

      {/* ================= PREGUNTAS ================= */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <p className="font-['Montserrat'] text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#96690A] text-center">
          Preguntas
        </p>
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-center mt-3">
          Preguntas frecuentes
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

      {/* ================= CTA FINAL ================= */}
      <section className="bg-[#2B0A18] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#FFD166]">
            <Sparkles className="w-4 h-4" /> Entrega rápida
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
            ¿Lista para apartar tu fecha?
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-light max-w-2xl mx-auto mt-4">
            Mándanos tu foto y tu fecha — armamos tu Save the Date y te enviamos
            el enlace para compartir. $49, pago único.
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
              Quiero el mío — $49
            </button>
            <a
              href={WHATSAPP_URL}
              onClick={() => track("click_whatsapp", { origen: "landing", pagina: "save-the-date" })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#E5C158]" />
              <span>Escríbenos por WhatsApp</span>
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/50">
            <a href={PHONE_TEL} onClick={() => track("click_llamar", { origen: "landing", pagina: "save-the-date" })} className="hover:text-white transition-colors underline">
              Llamar {PHONE_DISPLAY}
            </a>
            <a href={PHONE_SMS} onClick={() => track("click_sms", { origen: "landing", pagina: "save-the-date" })} className="hover:text-white transition-colors underline">
              O por SMS: (818) 299-4882
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
