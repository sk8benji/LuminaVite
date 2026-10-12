"use client";

import React from "react";
import { Sparkles, Users, Crown, Heart } from "lucide-react";
import { ElegantRoseConfig } from "@/types/templateConfigs";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const ElegantRoseFields: React.FC<Props> = ({ value, onChange }) => {
  const config = (value || {}) as ElegantRoseConfig;

  const updateConfig = (updater: (prev: ElegantRoseConfig) => ElegantRoseConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-rose-200 bg-linear-to-b from-rose-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-rose-100">
        <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
            Configuración Exclusiva • Elegant Rose (Isabella)
          </h3>
          <p className="text-[11px] text-rose-800/80">
            Ajusta los detalles de corte de honor y damas específicos para la estética floral de Isabella.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-white/90 border border-rose-100 rounded-xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Padres de la Quinceañera</span>
          </label>
          <input
            type="text"
            value={config.padres || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                padres: e.target.value,
              }))
            }
            placeholder="Ej: Mr & Mrs Rodríguez"
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="p-3 bg-white/90 border border-rose-100 rounded-xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <Crown className="w-3.5 h-3.5 text-rose-600" />
            <span>Chambelán de Honor</span>
          </label>
          <input
            type="text"
            value={config.chambelan || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                chambelan: e.target.value,
              }))
            }
            placeholder="Ej: Emilio Salazar"
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="p-3 bg-white/90 border border-rose-100 rounded-xl space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
          <Users className="w-3.5 h-3.5 text-rose-600" />
          <span>Damas de Honor (Separadas por comas)</span>
        </label>
        <input
          type="text"
          value={(config.damas || []).join(", ")}
          onChange={(e) =>
            updateConfig((prev) => ({
              ...prev,
              damas: e.target.value.split(",").map((d) => d.trim()).filter(Boolean),
            }))
          }
          placeholder="Ej: Isabella Cordero, Valeria Morales, Sofia Villanueva"
          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
        />
        <p className="text-[10px] text-stone-400">
          Se distribuirán en las columnas de la tarjeta de corte de gala.
        </p>
      </div>
    </div>
  );
};
