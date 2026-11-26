"use client";

import React from "react";
import { Sparkles, Users, Clock } from "lucide-react";
import { QuinceEraPinkConfig } from "@/types/templateConfigs";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const EraPinkFields: React.FC<Props> = ({ value, onChange }) => {
  const config = (value || {}) as QuinceEraPinkConfig;

  const updateConfig = (updater: (prev: QuinceEraPinkConfig) => QuinceEraPinkConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  const set = (key: keyof QuinceEraPinkConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    updateConfig((prev) => ({ ...prev, [key]: e.target.value }));

  const inputCls =
    "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-200";
  const labelCls = "text-[11px] font-semibold text-stone-700 block mb-1";

  return (
    <div className="space-y-4 rounded-2xl border border-pink-200 bg-linear-to-b from-pink-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-pink-100">
        <span className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-pink-950 uppercase tracking-wide">
            Configuración Exclusiva • Quince Pink (Era Pink)
          </h3>
          <p className="text-[11px] text-pink-800/80">
            Familia anfitriona y horarios propios de este diseño.
          </p>
        </div>
      </div>

      <div className="space-y-3 p-3.5 bg-white/90 border border-pink-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-pink-600" />
          <span className="text-xs font-bold text-stone-800">Familia Anfitriona</span>
        </div>
        <div>
          <label className={labelCls}>Familia anfitriona (ES)</label>
          <input className={inputCls} value={config.familiaAnfitriona || ""} onChange={set("familiaAnfitriona")} placeholder="Ej: Familia González" />
        </div>
        <div>
          <label className={labelCls}>Familia anfitriona (EN)</label>
          <input className={inputCls} value={config.familiaAnfitrionaEn || ""} onChange={set("familiaAnfitrionaEn")} placeholder="Ej: The González Family" />
        </div>
      </div>

      <div className="space-y-3 p-3.5 bg-white/90 border border-pink-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-pink-600" />
          <span className="text-xs font-bold text-stone-800">Horarios</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Hora de la ceremonia</label>
            <input className={inputCls} value={config.ceremoniaHora || ""} onChange={set("ceremoniaHora")} placeholder="3:00 PM" />
          </div>
          <div>
            <label className={labelCls}>Hora de la recepción</label>
            <input className={inputCls} value={config.recepcionHora || ""} onChange={set("recepcionHora")} placeholder="4:30 PM" />
          </div>
        </div>
      </div>
    </div>
  );
};
