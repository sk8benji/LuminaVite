"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Language } from "@/lib/home-translations";

interface FloatingWhatsAppProps {
  lang: Language;
  phone?: string;
}

export default function FloatingWhatsApp({
  lang,
  phone = "18182994882",
}: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage =
    lang === "en"
      ? "Hello! I would like to get concierge guidance regarding Click & Love digital invitations."
      : "¡Hola! Me gustaría recibir asesoría sobre las invitaciones digitales de Click & Love.";

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside
      aria-label="WhatsApp Concierge"
      className="fixed bottom-6 right-5 sm:right-6 z-50 flex items-end gap-3 select-none"
    >
      {/* Tooltip / Globo de texto flotante elegante */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md text-[#2C1F1B] px-3.5 py-2.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#E8E3D9] max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex-1">
            <p className="text-[10px] font-['Cinzel'] tracking-wider uppercase text-[#C5A059] font-bold">
              {lang === "en" ? "Concierge Support" : "Asesoría Concierge"}
            </p>
            <p className="text-xs font-['Montserrat'] font-semibold text-[#2C1F1B] leading-tight mt-0.5">
              {lang === "en"
                ? "¿Have questions? Chat with our team"
                : "¿Dudas con tu evento? Escríbenos en vivo"}
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-700 p-0.5 rounded-md transition cursor-pointer"
            aria-label={lang === "en" ? "Close hint" : "Cerrar sugerencia"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón Circular Oficial de WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5C] text-white flex items-center justify-center shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-white border border-[#20BA5C]"
      >
        {/* Onda de pulso sutil */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:opacity-0 pointer-events-none" />

        {/* Icono vectorial oficial de WhatsApp */}
        <svg
          className="w-7 h-7 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893 0-3.177-1.237-6.164-3.488-8.415" />
        </svg>

        {/* Punto verde de conexión en vivo */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full border-2 border-white" />
      </a>
    </aside>
  );
}
