"use client";

import React from "react";
import { Sparkles, Users, Mail, Clock } from "lucide-react";
import { BabyBlueConfig } from "@/types/templateConfigs";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const BabyBlueFields: React.FC<Props> = ({ value, onChange }) => {
  const config = (value || {}) as BabyBlueConfig;

  const updateConfig = (updater: (prev: BabyBlueConfig) => BabyBlueConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  const set = (key: keyof BabyBlueConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    updateConfig((prev) => ({ ...prev, [key]: e.target.value }));

  const inputCls =
    "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200";
  const labelCls = "text-[11px] font-semibold text-stone-700 block mb-1";

  return (
    <div className="space-y-4 rounded-2xl border border-sky-200 bg-linear-to-b from-sky-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-sky-100">
        <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-sky-950 uppercase tracking-wide">
            Configuración Exclusiva • Garden Baby Blue
          </h3>
          <p className="text-[11px] text-sky-800/80">
            Familia anfitriona, carta de cierre, contacto y horario propios de este diseño.
          </p>
        </div>
      </div>

      <div className="space-y-3 p-3.5 bg-white/90 border border-sky-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-stone-800">Familia Anfitriona</span>
        </div>
        <div>
          <label className={labelCls}>Familia anfitriona (ES)</label>
          <input className={inputCls} value={config.familiaAnfitriona || ""} onChange={set("familiaAnfitriona")} placeholder="Ej: Familia Torres" />
        </div>
        <div>
          <label className={labelCls}>Familia anfitriona (EN)</label>
          <input className={inputCls} value={config.familiaAnfitrionaEn || ""} onChange={set("familiaAnfitrionaEn")} placeholder="Ej: The Torres Family" />
        </div>
      </div>

      <div className="space-y-3 p-3.5 bg-white/90 border border-sky-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-stone-800">Carta de Cierre y Contacto</span>
        </div>
        <div>
          <label className={labelCls}>Texto de la carta (ES)</label>
          <textarea className={inputCls} rows={3} value={config.cartaTexto || ""} onChange={set("cartaTexto")} placeholder="Ej: Gracias por acompañarnos en este día tan especial…" />
        </div>
        <div>
          <label className={labelCls}>Texto de la carta (EN)</label>
          <textarea className={inputCls} rows={3} value={config.cartaTextoEn || ""} onChange={set("cartaTextoEn")} placeholder="Ej: Thank you for joining us on this special day…" />
        </div>
        <div>
          <label className={labelCls}>Nombre de contacto (preguntas)</label>
          <input className={inputCls} value={config.contactoNombre || ""} onChange={set("contactoNombre")} placeholder="Ej: Mamá de Isabella" />
        </div>
      </div>

      <div className="space-y-3 p-3.5 bg-white/90 border border-sky-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-stone-800">Horario</span>
        </div>
        <div>
          <label className={labelCls}>Hora de la ceremonia</label>
          <input className={inputCls} value={config.ceremoniaHora || ""} onChange={set("ceremoniaHora")} placeholder="3:00 PM" />
        </div>
      </div>
    </div>
  );
};
