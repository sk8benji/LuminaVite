"use client";

import React from "react";
import { Sparkles, Ticket, MapPin, Gift, MessageCircle, Palette } from "lucide-react";
import { Gatsby20sConfig } from "@/types/templateConfigs";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const GatsbyFields: React.FC<Props> = ({ value, onChange }) => {
  const config = (value || {}) as Gatsby20sConfig;

  const updateConfig = (updater: (prev: Gatsby20sConfig) => Gatsby20sConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  const set = (key: keyof Gatsby20sConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    updateConfig((prev) => ({ ...prev, [key]: e.target.value }));

  const inputCls =
    "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200";
  const labelCls = "text-[11px] font-semibold text-stone-700 block mb-1";

  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-linear-to-b from-amber-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-amber-100">
        <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Configuración Exclusiva • Gatsby 20&apos;s / Gypsy Burgundy
          </h3>
          <p className="text-[11px] text-amber-800/80">
            Textos del sobre, ticket, sede, vestimenta y agradecimiento propios de este diseño Art Déco.
          </p>
        </div>
      </div>

      {/* Portada */}
      <div className="space-y-3 p-3.5 bg-white/90 border border-amber-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-stone-800">Portada y Ticket</span>
        </div>
        <div>
          <label className={labelCls}>Nombre de la quinceañera (en el ticket y la tarjeta)</label>
          <input className={inputCls} value={config.nombreQuinceanera || ""} onChange={set("nombreQuinceanera")} placeholder="Ej: Chloe" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Frase de apertura (ES)</label>
            <input className={inputCls} value={config.fraseApertura || ""} onChange={set("fraseApertura")} placeholder="Una Celebración Años 20" />
          </div>
          <div>
            <label className={labelCls}>Frase de apertura (EN)</label>
            <input className={inputCls} value={config.fraseAperturaEn || ""} onChange={set("fraseAperturaEn")} placeholder="A Roaring Twenties Celebration" />
          </div>
          <div>
            <label className={labelCls}>Subtítulo (EN)</label>
            <input className={inputCls} value={config.subtituloEn || ""} onChange={set("subtituloEn")} placeholder="My Sweet Fifteen" />
          </div>
          <div>
            <label className={labelCls}>Hora propia de la recepción</label>
            <input className={inputCls} value={config.horaRecepcion || ""} onChange={set("horaRecepcion")} placeholder="6:19 PM (vacío = hora de la placa)" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Línea de bienvenida (ES) — vacío = oculta la línea</label>
            <input className={inputCls} value={config.portadaBienvenida || ""} onChange={set("portadaBienvenida")} placeholder="WELCOME TO THE" />
          </div>
          <div>
            <label className={labelCls}>Línea de bienvenida (EN) — vacío = oculta la línea</label>
            <input className={inputCls} value={config.portadaBienvenidaEn || ""} onChange={set("portadaBienvenidaEn")} placeholder="WELCOME TO THE" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Texto del ticket (fecha y hora)</label>
          <input className={inputCls} value={config.ticketFechaTexto || ""} onChange={set("ticketFechaTexto")} placeholder="THURSDAY 10.14.2027 • 7:00 PM • ADMIT ONE" />
        </div>
      </div>

      {/* Sede */}
      <div className="space-y-3 p-3.5 bg-white/90 border border-amber-100 rounded-xl">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-stone-800">Sede (tarjetas Cuándo y Dónde)</span>
        </div>
        <div>
          <label className={labelCls}>Nombre del salón</label>
          <input className={inputCls} value={config.venueNombre || ""} onChange={set("venueNombre")} placeholder="GRAND HALL BALLROOM" />
        </div>
        <div>
          <label className={labelCls}>Dirección del salón</label>
          <input className={inputCls} value={config.venueDireccion || ""} onChange={set("venueDireccion")} placeholder="1920 Speakeasy Blvd, Los Angeles, CA" />
        </div>
      </div>

      {/* Vestimenta y bar */}
      <div className="space-y-3 p-3.5 bg-white/90 border border-amber-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-stone-800">Vestimenta y Bar</span>
        </div>
        <div>
          <label className={labelCls}>Texto de vestimenta</label>
          <textarea className={inputCls} rows={2} value={config.dressCodeTexto || ""} onChange={set("dressCodeTexto")} placeholder="Dress to the nines! Flappers, fringe, feathers, pearls, fedoras & sharp suits." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Colores reservados (ES) — vacío = oculta la línea</label>
            <input className={inputCls} value={config.coloresReservados || ""} onChange={set("coloresReservados")} placeholder="Ej: Dorado y negro reservados para la quinceañera" />
          </div>
          <div>
            <label className={labelCls}>Colores reservados (EN) — vacío = oculta la línea</label>
            <input className={inputCls} value={config.coloresReservadosEn || ""} onChange={set("coloresReservadosEn")} placeholder="Ej: Gold and black reserved for the quinceañera" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Título del bar</label>
            <input className={inputCls} value={config.cocktailsTitulo || ""} onChange={set("cocktailsTitulo")} placeholder="OPEN SPEAKEASY BAR" />
          </div>
          <div>
            <label className={labelCls}>Texto del bar</label>
            <input className={inputCls} value={config.cocktailsTexto || ""} onChange={set("cocktailsTexto")} placeholder="Signature mocktails, sparkling champagne towers & craft drinks all night." />
          </div>
        </div>
      </div>

      {/* Agradecimiento */}
      <div className="space-y-3 p-3.5 bg-white/90 border border-amber-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-stone-800">Agradecimiento (cierre)</span>
        </div>
        <div>
          <label className={labelCls}>Mensaje de agradecimiento (ES)</label>
          <textarea className={inputCls} rows={2} value={config.agradecimientoTexto || ""} onChange={set("agradecimientoTexto")} placeholder="¡Compartir este momento tan especial con ustedes significa más de lo que las palabras pueden expresar!" />
        </div>
        <div>
          <label className={labelCls}>Mensaje de agradecimiento (EN)</label>
          <textarea className={inputCls} rows={2} value={config.agradecimientoTextoEn || ""} onChange={set("agradecimientoTextoEn")} placeholder="Sharing this milestone with you means more than words can say!" />
        </div>
      </div>

      <p className="text-[11px] text-stone-500 flex items-start gap-1.5">
        <MessageCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
        <span>Vacío = texto original del diseño. Los campos de subtítulo y título de vestimenta se editan en sus secciones (no se duplican aquí).</span>
      </p>
    </div>
  );
};
