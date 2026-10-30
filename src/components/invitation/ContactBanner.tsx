"use client";

import { MessageSquare, Phone } from "lucide-react";
import type { InvitationData } from "./InvitationMobileView";
import { track } from "@/lib/analytics";

/**
 * Banner de contacto — barra fija comercial al pie de la invitación pública.
 *
 * Solo se muestra si el evento lo tiene activado (bannerContactoActivo) desde
 * Ajustes del evento. Pensado para invitaciones de marketing (ej. la que se
 * abre desde el QR de las tarjetas impresas): quien la recibe en casa debe
 * poder contactar al negocio sin buscar el número.
 *
 * Mercado EE.UU.: los botones son Llamar (tel:) y Texto (sms:) — nada de
 * WhatsApp. El número sale de bannerContactoTelefono (formato visible, ej.
 * "(818) 299-4882"); si está vacío, cae al teléfono RSVP del evento.
 */
export default function ContactBanner({ data }: { data: InvitationData }) {
  if (!data.bannerContactoActivo) return null;

  const telefonoVisible =
    (data.bannerContactoTelefono || "").trim() ||
    (data.telefonoWhatsappRsvp || "").trim();
  const digits = telefonoVisible.replace(/[^0-9]/g, "");
  if (!digits) return null;

  // tel:/sms: en formato internacional: 10 dígitos US → +1; 11 con 1 → +; otro → tal cual
  const intl =
    digits.length === 10
      ? `+1${digits}`
      : digits.length === 11 && digits.startsWith("1")
        ? `+${digits}`
        : digits;

  const texto =
    (data.bannerContactoTexto || "").trim() ||
    "¿Te gustó esta invitación? Haz la tuya";
  const mostrarLlamar = data.bannerContactoLlamar !== false;
  const mostrarSms = data.bannerContactoSms !== false;

  return (
    <>
      {/* Espaciador: que la barra fija nunca tape el final de la invitación */}
      <div aria-hidden className="h-24" />
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#7A002A] text-white shadow-[0_-6px_28px_rgba(0,0,0,0.35)]">
        <div className="max-w-xl mx-auto px-4 pt-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold leading-snug">{texto}</p>
            <p className="text-[12px] text-white/80 font-semibold leading-snug">
              {telefonoVisible}
            </p>
          </div>
          {mostrarLlamar && (
            <a
              href={`tel:${intl}`}
              onClick={() => track("click_llamar", { origen: "banner_evento" })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FFD166] text-[#7A002A] text-xs font-extrabold uppercase tracking-wide shadow-sm shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Llamar</span>
            </a>
          )}
          {mostrarSms && (
            <a
              href={`sms:${intl}`}
              onClick={() => track("click_sms", { origen: "banner_evento" })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white text-[#7A002A] text-xs font-extrabold uppercase tracking-wide shadow-sm shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Texto</span>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
