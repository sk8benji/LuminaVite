"use client";

import React from "react";
import { Sparkles, Eye, KeyRound, Palette } from "lucide-react";
import { CoralineMysticalConfig } from "@/types/templateConfigs";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const CoralineMysticalFields: React.FC<Props> = ({ value, onChange }) => {
  const config = (value || {}) as CoralineMysticalConfig;

  const updateConfig = (updater: (prev: CoralineMysticalConfig) => CoralineMysticalConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-indigo-200 bg-linear-to-b from-indigo-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-indigo-100">
        <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
          <Eye className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
            Configuración Exclusiva • Coraline Mística / Gótico
          </h3>
          <p className="text-[11px] text-indigo-800/80">
            Personaliza la atmósfera de fantasía oscura, puerta secreta y animaciones de botones mágicos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Frase Mística */}
        <div className="p-3 bg-white/90 border border-indigo-100 rounded-xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Frase de Apertura / Misterio</span>
          </label>
          <input
            type="text"
            value={config.fraseMistica || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                fraseMistica: e.target.value,
              }))
            }
            placeholder="Ej: Ten cuidado con lo que deseas... cruza la puerta secreta."
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Mensaje de la Puerta Secreta */}
        <div className="p-3 bg-white/90 border border-indigo-100 rounded-xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mensaje de la Puerta Secreta</span>
          </label>
          <input
            type="text"
            value={config.puertaSecretaMsg || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                puertaSecretaMsg: e.target.value,
              }))
            }
            placeholder="Ej: Introduce la llave para desbloquear tu acceso."
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Toggle Botones Mágicos */}
      <div className="p-3 bg-white/90 border border-indigo-100 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-stone-700 block">
            Animación Temática de Botones Negros / Ojos
          </span>
          <p className="text-[11px] text-stone-500">
            Activar detalles flotantes interactivos de botones de costura al hacer scroll.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={config.animacionBotones !== false}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                animacionBotones: e.target.checked,
              }))
            }
            className="w-4 h-4 text-indigo-600 rounded-sm border-stone-300 focus:ring-indigo-500"
          />
          <span className="text-xs font-semibold text-stone-800">
            {config.animacionBotones !== false ? "Activado" : "Desactivado"}
          </span>
        </label>
      </div>
    </div>
  );
};
