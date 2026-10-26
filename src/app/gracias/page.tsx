"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Sparkles,
  Phone,
  ShieldCheck,
  Loader2,
  Heart,
} from "lucide-react";

const TEAM_PHONE_DISPLAY = "(818) 299-4482";
const TEAM_PHONE_TEL = "+18182994482";

interface OrderInfo {
  id: string;
  stripeSessionId: string;
  montoTotal: number;
  moneda: string;
  paqueteId: string;
  paqueteNombre: string;
  estadoPago: string;
  nombreCliente?: string | null;
  emailCliente: string;
  telefonoCliente?: string | null;
  tipoEvento?: string | null;
  fechaEvento?: string | null;
  plantillaDeseada?: string | null;
  comentarios?: string | null;
  onboardingCompletado: boolean;
}

function GraciasContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderInfo | null>(null);

  useEffect(() => {
    // Celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C5A059", "#EED3A1", "#2C1F1B", "#C2847A"],
      });
    } catch (e) {
      // Ignore if it fails
    }

    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error("Error verifying session:", err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-w-screen min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin mb-4" />
        <h2 className="font-['Cinzel'] text-xl font-bold text-[#2C1F1B]">Verifying your purchase...</h2>
        <p className="font-['Montserrat'] text-xs text-[#5E534C] mt-2">One moment while we confirm your order with Click and love.</p>
      </div>
    );
  }

  const isPaid = order?.estadoPago === "PAGADO";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1F1B] py-12 px-4 selection:bg-[#C5A059] selection:text-white">
      {/* Decorative luxury background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* THANK YOU HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E3FCEF] border-2 border-[#00875A] text-[#00875A] mb-4 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-[#2C1F1B] font-bold">
              {isPaid ? "Payment Confirmed" : "Thank You"}
            </span>
          </div>

          <h1 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B]">
            Thank You!
          </h1>
          <p className="font-['Montserrat'] text-sm sm:text-base text-[#5E534C] mt-4 max-w-lg mx-auto leading-relaxed">
            {order
              ? <>Your <strong className="text-[#C5A059]">{order.paqueteNombre}</strong> package has been reserved.</>
              : "Your order has been received."}
          </p>
          <p className="font-['Montserrat'] text-sm sm:text-base text-[#5E534C] mt-3 max-w-lg mx-auto leading-relaxed">
            <strong className="text-[#2C1F1B]">Our team will contact you shortly</strong> to coordinate
            the details of your event and start designing your invitation.
          </p>
        </div>

        {/* ORDER SUMMARY CARD */}
        {order && (
          <div className="bg-white border border-[#E8E3D9] rounded-2xl p-5 mb-8 shadow-[0_5px_20px_rgba(44,31,27,0.04)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-['Cinzel'] uppercase tracking-wider text-[#8C8077] font-semibold">
                Order #{order.id.slice(-6).toUpperCase()}
              </div>
              <div className="font-['Cinzel'] text-lg font-bold text-[#2C1F1B]">
                {order.paqueteNombre}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[10px] font-['Montserrat'] uppercase text-[#8C8077]">Total</div>
                <div className="font-['Cinzel'] text-xl font-bold text-[#C5A059]">
                  ${order.montoTotal.toFixed(2)} {order.moneda.toUpperCase()}
                </div>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                  isPaid
                    ? "bg-[#E3FCEF] text-[#006644]"
                    : "bg-[#FFF4E0] text-[#8A5A00]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {isPaid ? "Paid" : "Payment Pending"}
              </div>
            </div>
          </div>
        )}

        {/* TEAM CONTACT CARD */}
        <div className="bg-white border-2 border-[#C5A059] rounded-3xl p-8 sm:p-10 text-center shadow-[0_15px_40px_rgba(197,160,89,0.15)]">
          <div className="w-14 h-14 rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 fill-[#C5A059]" />
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#2C1F1B]">
            Our Team Will Contact You
          </h2>
          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] mt-3 max-w-md mx-auto leading-relaxed">
            You don&apos;t need to do anything else. Our team will reach out to you shortly to
            collect your photos and details and begin designing your invitation.
          </p>
          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] mt-3 max-w-md mx-auto leading-relaxed">
            Prefer to talk to our team now? Call us at:
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${TEAM_PHONE_TEL}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#2C1F1B] text-[#EED3A1] font-['Montserrat'] text-sm font-bold tracking-wider hover:bg-[#4A352F] transition shadow-md"
            >
              <Phone className="w-4 h-4" />
              {TEAM_PHONE_DISPLAY}
            </a>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#2C1F1B] text-[#2C1F1B] font-['Cinzel'] text-xs font-bold uppercase tracking-wider hover:bg-[#F5EFE4] transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin" />
        </div>
      }
    >
      <GraciasContent />
    </Suspense>
  );
}
