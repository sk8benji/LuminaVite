"use client";

import React from "react";
import { Sparkles, Users } from "lucide-react";
import { BlushPrincessConfig } from "@/types/templateConfigs";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const BlushFields: React.FC<Props> = ({ value, onChange }) => {
  const config = (value || {}) as BlushPrincessConfig;

  const updateConfig = (updater: (prev: BlushPrincessConfig) => BlushPrincessConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  const set = (key: keyof BlushPrincessConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    updateConfig((prev) => ({ ...prev, [key]: e.target.value }));

  const inputCls =
    "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200";
  const labelCls = "text-[11px] font-semibold text-stone-700 block mb-1";

  return (
    <div className="space-y-4 rounded-2xl border border-rose-200 bg-linear-to-b from-rose-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-rose-100">
        <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
            Configuración Exclusiva • Blush Princess / Blush Envelope
          </h3>
          <p className="text-[11px] text-rose-800/80">
            Familia anfitriona del sobre y la tarjeta. Vacío = no se muestra la línea.
          </p>
        </div>
      </div>

      <div className="space-y-3 p-3.5 bg-white/90 border border-rose-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-bold text-stone-800">Familia Anfitriona</span>
        </div>
        <div>
          <label className={labelCls}>Familia anfitriona (ES)</label>
          <input className={inputCls} value={config.familiaAnfitriona || ""} onChange={set("familiaAnfitriona")} placeholder="Ej: Familia Hernández" />
        </div>
        <div>
          <label className={labelCls}>Familia anfitriona (EN)</label>
          <input className={inputCls} value={config.familiaAnfitrionaEn || ""} onChange={set("familiaAnfitrionaEn")} placeholder="Ej: The Hernández Family" />
        </div>
      </div>
    </div>
  );
};
