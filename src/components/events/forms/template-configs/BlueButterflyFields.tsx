"use client";

import React from "react";
import { Sparkles, Palette, BookOpen, Disc } from "lucide-react";
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
            Ajusta los efectos visuales, colores de mariposas y textos temáticos del diseño celeste.
          </p>
        </div>
      </div>

      {/* Selector de Color de Acento y Animación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Color de acento */}
        <div className="p-3 bg-white/90 border border-sky-100 rounded-xl space-y-2">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <Palette className="w-3.5 h-3.5 text-sky-600" />
            <span>Color de Acento de Mariposas</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.colorAcentoHex || "#5B8DB8"}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  colorAcentoHex: e.target.value,
                }))
              }
              className="w-9 h-9 p-0.5 rounded-lg border border-stone-200 cursor-pointer bg-white"
            />
            <input
              type="text"
              value={config.colorAcentoHex || "#5B8DB8"}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  colorAcentoHex: e.target.value,
                }))
              }
              placeholder="#5B8DB8"
              className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
          {/* Quick presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-stone-400">Presets:</span>
            {PRESET_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    colorAcentoHex: hex,
                  }))
                }
                style={{ backgroundColor: hex }}
                className="w-4 h-4 rounded-full border border-black/10 hover:scale-110 transition shadow-xs"
                title={hex}
              />
            ))}
          </div>
        </div>

        {/* Toggle de animación de mariposas */}
        <div className="p-3 bg-white/90 border border-sky-100 rounded-xl flex flex-col justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Animación de Mariposas Flotantes</span>
            </span>
            <p className="text-[11px] text-stone-500 mt-1">
              Activa o desactiva las mariposas animadas flotando sobre la pantalla al interactuar.
            </p>
          </div>
          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.animacionMariposas !== false}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    animacionMariposas: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-sky-600 rounded-sm border-stone-300 focus:ring-sky-500"
              />
              <span className="text-xs font-semibold text-stone-800">
                {config.animacionMariposas !== false ? "Animación Activada (Recomendado)" : "Animación Pausada"}
              </span>
            </label>
          </div>
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

      {/* Texto de Reproductor de Vinilo */}
      <div className="p-3 bg-white/90 border border-sky-100 rounded-xl space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
          <Disc className="w-3.5 h-3.5 text-sky-600" />
          <span>Texto en el Botón del Vinilo Musical</span>
        </label>
        <input
          type="text"
          value={config.reproductorViniloTexto || ""}
          onChange={(e) =>
            updateConfig((prev) => ({
              ...prev,
              reproductorViniloTexto: e.target.value,
            }))
          }
          placeholder="Ej: Click to Play Music / Dale Play a la Música"
          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
        />
      </div>
    </div>
  );
};
