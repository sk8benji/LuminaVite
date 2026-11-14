"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Copy, Check, MessageSquare, ArrowRight, Clock, Tag } from "lucide-react";
import { Language } from "@/lib/home-translations";
import { track } from "@/lib/analytics";

interface BlackFridayModalProps {
  lang: Language;
}

export default function BlackFridayModal({ lang }: BlackFridayModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 32,
    seconds: 45,
  });

  const isEs = lang === "es";

  // Mostrar automáticamente tras 5 segundos si no se ha cerrado antes
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("bf_modal_dismissed_2026");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          track("view_bf_modal", { lang });
        }, 5000);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }, [lang]);

  // Reloj de cuenta regresiva
  useEffect(() => {
    const targetDate = new Date("2026-12-01T23:59:59").getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem("bf_modal_dismissed_2026", "true");
    } catch {}
    track("dismiss_bf_modal", { lang });
  };

  const handleCopyAndScroll = () => {
    try {
      navigator.clipboard.writeText("BLACK10");
    } catch {}
    setCopied(true);
    track("copy_bf_coupon", { code: "BLACK10", lang });

    setTimeout(() => {
      setIsOpen(false);
      try {
        localStorage.setItem("bf_modal_dismissed_2026", "true");
      } catch {}
      const el = document.getElementById("precios");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 700);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappMessage = isEs
    ? "¡Hola! Quiero activar mi 10% de descuento de Black Friday (código BLACK10) para mi evento. ¿Me pueden dar información?"
    : "Hi! I'd like to activate my 10% Black Friday discount (code BLACK10) for my event. Could you give me more details?";

  const whatsappUrl = `https://wa.me/18182994882?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#FDFBF9] rounded-3xl border border-[#C5A059] shadow-[0_25px_60px_rgba(122,0,42,0.25)] p-6 sm:p-8 text-[#2B0A18] overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(197, 160, 89, 0.12) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(122, 0, 42, 0.08) 0%, transparent 50%)",
        }}
      >
        {/* Botón de cierre */}
        <button
          onClick={handleClose}
          aria-label={isEs ? "Cerrar ventana" : "Close window"}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F5EDDA]/80 hover:bg-[#F5EDDA] text-[#2B0A18] flex items-center justify-center transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge superior y contador */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 pr-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD166] text-[#2B0A18] font-['Montserrat'] font-extrabold text-[11px] tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#7A002A]" />
            BLACK FRIDAY SPECIAL
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6D3F]">
            <Clock className="w-3.5 h-3.5" />
            <span className="tabular-nums">
              {String(timeLeft.days).padStart(2, "0")}d : {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </div>
        </div>

        {/* Título y subtítulo */}
        <h3 className="font-['Cinzel'] font-bold text-2xl sm:text-3xl text-[#2B0A18] leading-tight">
          {isEs ? "10% OFF en tu Invitación Digital" : "10% OFF on your Digital Invitation"}
        </h3>
        <p className="font-['Montserrat'] text-[13.5px] text-[#5A3C46] mt-2 leading-relaxed">
          {isEs
            ? "Aprovecha nuestra oferta exclusiva de temporada. Haz que tu celebración comience desde el primer mensaje."
            : "Take advantage of our seasonal exclusive offer. Make your celebration shine from the very first message."}
        </p>

        {/* Precios con 10% aplicado tachando el regular */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="rounded-2xl bg-white border border-[#EADFC7] p-3 text-center shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C6D3F] block">
              Assisted Digital
            </span>
            <div className="flex items-baseline justify-center gap-1.5 mt-1">
              <span className="text-xs text-[#8A6B76] line-through">$199</span>
              <span className="font-['Cinzel'] font-bold text-xl text-[#7A002A]">$179</span>
            </div>
            <span className="text-[10px] font-bold text-[#2A7B4C] mt-0.5 block">
              {isEs ? "Ahorras $20" : "Save $20"}
            </span>
          </div>
          <div className="rounded-2xl bg-white border border-[#EADFC7] p-3 text-center shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C6D3F] block">
              VIP All-Inclusive
            </span>
            <div className="flex items-baseline justify-center gap-1.5 mt-1">
              <span className="text-xs text-[#8A6B76] line-through">$279</span>
              <span className="font-['Cinzel'] font-bold text-xl text-[#7A002A]">$251</span>
            </div>
            <span className="text-[10px] font-bold text-[#2A7B4C] mt-0.5 block">
              {isEs ? "Ahorras $28" : "Save $28"}
            </span>
          </div>
        </div>

        {/* Bloque del cupón */}
        <div className="mb-5 p-3.5 rounded-2xl bg-[#F5EDDA]/60 border border-dashed border-[#C5A059] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 flex items-center justify-center text-[#8C6D3F] shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8C6D3F] block">
                {isEs ? "Cupón de Descuento" : "Promo Code"}
              </span>
              <span className="font-mono font-bold text-lg text-[#2B0A18] tracking-widest">
                BLACK10
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#7A002A] bg-[#7A002A]/10 px-2.5 py-1 rounded-full">
            10% OFF
          </span>
        </div>

        {/* Acción Principal */}
        <button
          onClick={handleCopyAndScroll}
          className="w-full py-4 rounded-full bg-[#7A002A] hover:bg-[#660025] text-white font-['Montserrat'] font-bold text-sm tracking-wide shadow-[0_12px_24px_rgba(122,0,42,0.3)] transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#FFD166]" />
              <span className="text-[#FFD166]">{isEs ? "✓ ¡Código BLACK10 copiado!" : "✓ Code BLACK10 copied!"}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{isEs ? "Copiar código y ver paquetes" : "Copy code & view packages"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Acción Secundaria (WhatsApp) */}
        <div className="mt-3.5 text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("click_bf_whatsapp", { lang })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A002A] hover:text-[#581825] transition underline underline-offset-4"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {isEs
              ? "¿Dudas con tu evento? Pide tu descuento por WhatsApp"
              : "Questions about your event? Claim your discount on WhatsApp"}
          </a>
        </div>

        {/* Letra pequeña */}
        <p className="mt-5 text-center font-['Montserrat'] text-[10.5px] text-[#8A6B76] leading-tight">
          {isEs
            ? "* Válido por tiempo limitado por Black Friday. 10% de descuento aplicable una vez por evento. No acumulable con otras promociones."
            : "* Limited-time Black Friday offer. 10% discount applicable once per event. Cannot be combined with other promotions."}
        </p>
      </div>
    </div>
  );
}
