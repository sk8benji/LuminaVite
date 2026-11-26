"use client";

import React from "react";
import { Sparkles, BookOpen } from "lucide-react";
import { BlueButterflyConfig } from "@/types/templateConfigs";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const BlueButterflyFields: React.FC<Props> = ({ value, onChange }) => {
  const config = (value || {}) as BlueButterflyConfig;

  const updateConfig = (updater: (prev: BlueButterflyConfig) => BlueButterflyConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  const PRESET_COLORS = ["#5B8DB8", "#3B82F6", "#2563EB", "#1E3A8A", "#60A5FA", "#D4AF37"];

  return (
    <div className="space-y-4 rounded-2xl border border-sky-200 bg-linear-to-b from-sky-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-sky-100">
        <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-sky-950 uppercase tracking-wide">
            Configuración Exclusiva • Blue Butterfly (Valeria)
          </h3>
          <p className="text-[11px] text-sky-800/80">
            Textos temáticos propios del diseño celeste.
          </p>
        </div>
      </div>

      {/* Frase Bíblica o Conmemorativa */}
      <div className="p-3 bg-white/90 border border-sky-100 rounded-xl space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
          <span>Frase Conmemorativa o Bíblica</span>
        </label>
        <textarea
          rows={2}
          value={config.fraseBiblica || ""}
          onChange={(e) =>
            updateConfig((prev) => ({
              ...prev,
              fraseBiblica: e.target.value,
            }))
          }
          placeholder="Ej: Doy gracias a Dios por cada instante de mi vida y a mis padres por su amor incondicional..."
          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs resize-none focus:outline-none focus:border-sky-500"
        />
        <p className="text-[10px] text-stone-400">
          Se exhibe en la dedicatoria principal dentro de la sección de agradecimiento a los padres.
        </p>
      </div>

    </div>
  );
};
