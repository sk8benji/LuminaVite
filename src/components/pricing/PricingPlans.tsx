"use client";

import React, { useState } from "react";
import { BadgeCheck, Check, CreditCard, Loader2, X } from "lucide-react";
import { translations, type Language } from "@/lib/home-translations";
import { track } from "@/lib/analytics";

// Tarjetas de planes — misma fuente que el home (home-translations.ts,
// t.pricing.plans) y mismo flujo de checkout que HomeView (POST /api/checkout
// -> Stripe). El plan destacado es el que trae highlighted: true en el dict,
// sin índices hardcodeados.
const PHONE_SMS = "sms:+18182994882";

export default function PricingPlans({ lang }: { lang: Language }) {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const t = translations[lang];
  const plans = t.pricing.plans;

  const handleCheckout = async (plan: "express" | "assisted" | "vip") => {
    track("begin_checkout", { paquete: plan });
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, lang }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(
          lang === "es"
            ? "Hubo un error al iniciar la compra. Por favor intenta de nuevo."
            : "There was an error starting checkout. Please try again."
        );
        setCheckoutLoading(null);
      }
    } catch (err) {
      console.error("Error en checkout:", err);
      alert(lang === "es" ? "Error de conexión al procesar la compra." : "Connection error during checkout.");
      setCheckoutLoading(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const hot = plan.highlighted === true;
          return (
            <div
              key={plan.planKey}
              className={
                hot
                  ? "relative rounded-3xl bg-[#7A002A] text-white p-8 flex flex-col shadow-[0_22px_45px_rgba(122,0,42,0.35)] md:-translate-y-2 border-2 border-[#FFD166]/40"
                  : "relative rounded-3xl bg-white border border-[#E7DCC8] p-8 flex flex-col shadow-[0_12px_28px_rgba(122,0,42,0.07)]"
              }
            >
              {hot ? (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFD166] text-[#2B0A18] font-['Montserrat'] font-extrabold text-[10.5px] tracking-[0.18em] uppercase py-1.5 px-4 rounded-full shadow whitespace-nowrap">
                  {t.pricing.recommended}
                </span>
              ) : null}
              <span
                className={`font-['Montserrat'] text-[10.5px] font-extrabold tracking-[0.18em] uppercase ${
                  hot ? "text-[#FFD166]" : "text-[#96690A]"
                }`}
              >
                {plan.typeTag}
              </span>
              <h3
                className={`font-['Montserrat'] font-extrabold text-xl mt-1.5 ${
                  hot ? "text-white" : "text-[#2B0A18]"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`font-['Montserrat'] text-[13px] leading-snug mt-2 ${
                  hot ? "text-[#F0DCAE]" : "text-[#5A3C46]"
                }`}
              >
                {plan.description}
              </p>
              <div className="flex items-baseline gap-2.5 mt-4">
                <span className={`font-['Cinzel'] font-bold text-5xl ${hot ? "text-white" : "text-[#2B0A18]"}`}>
                  {plan.price}
                </span>
                <span
                  className={`font-['Montserrat'] text-xs font-semibold ${
                    hot ? "text-[#F0DCAE]" : "text-[#8A6B76]"
                  }`}
                >
                  {plan.currency}
                </span>
              </div>
              {plan.bonusLabel ? (
                <div
                  className={`mt-6 rounded-2xl border px-4 py-3.5 ${
                    hot ? "border-[#FFD166]/60 bg-white/10" : "border-[#E7DCC8] bg-[#FAF8F5]"
                  }`}
                >
                  <span
                    className={`font-['Montserrat'] text-[10px] font-extrabold tracking-[0.18em] uppercase ${
                      hot ? "text-[#FFD166]" : "text-[#96690A]"
                    }`}
                  >
                    {plan.bonusLabel}
                  </span>
                  <p
                    className={`font-['Montserrat'] text-[13px] font-semibold leading-snug mt-1 ${
                      hot ? "text-white" : "text-[#2B0A18]"
                    }`}
                  >
                    {plan.bonusText}
                  </p>
                </div>
              ) : null}
              <ul className="mt-7 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5">
                    {f.included === false ? (
                      <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-[1px] bg-neutral-200 text-neutral-500">
                        <X className="w-3 h-3" strokeWidth={3.5} />
                      </span>
                    ) : (
                      <span
                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-[1px] ${
                          hot ? "bg-[#FFD166] text-[#7A002A]" : "bg-[#F5EDDA] text-[#7A002A]"
                        }`}
                      >
                        <Check className="w-3 h-3" strokeWidth={3.5} />
                      </span>
                    )}
                    <span
                      className={`font-['Montserrat'] text-[13.5px] leading-snug ${
                        f.included === false
                          ? "text-neutral-400 line-through"
                          : hot
                            ? "text-white"
                            : "text-[#45303B]"
                      } ${f.isBold ? "font-bold" : ""}`}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              {plan.trustLine ? (
                <p
                  className={`mt-6 flex items-start gap-2 font-['Montserrat'] text-xs leading-snug ${
                    hot ? "text-[#F0DCAE]" : "text-[#8A6B76]"
                  }`}
                >
                  <BadgeCheck className="w-4 h-4 shrink-0 mt-[1px]" />
                  <span>{plan.trustLine}</span>
                </p>
              ) : null}
              <button
                onClick={() => handleCheckout(plan.planKey)}
                disabled={checkoutLoading !== null}
                className={`mt-8 w-full py-3.5 rounded-full font-['Montserrat'] font-bold text-sm transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 ${
                  hot
                    ? "bg-white text-[#7A002A] hover:bg-[#F5EDDA] shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                    : "bg-[#7A002A] text-white hover:bg-[#660025] shadow-[0_10px_24px_rgba(122,0,42,0.3)]"
                }`}
              >
                {checkoutLoading === plan.planKey ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === "es" ? "Procesando pago seguro…" : "Processing secure payment…"}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>{plan.cta}</span>
                  </>
                )}
              </button>
              <a
                href={`${PHONE_SMS}?&body=${encodeURIComponent(plan.secondaryActionMessage)}`}
                onClick={() => track("click_zelle", { paquete: plan.planKey })}
                className={`mt-3.5 text-center font-['Montserrat'] text-xs font-semibold underline underline-offset-4 transition ${
                  hot
                    ? "text-[#F0DCAE] decoration-[#F0DCAE]/50 hover:text-white"
                    : "text-[#7A002A] decoration-[#B08D3C]/40 hover:text-[#B08D3C]"
                }`}
              >
                {plan.secondaryActionText}
              </a>
            </div>
          );
        })}
      </div>
      <p className="text-center font-['Montserrat'] text-xs mt-10 text-[#8A6B76]">
        {t.pricing.trustBadgesText}
      </p>
    </div>
  );
}
