"use client";

import React from "react";
import { Sparkles, Building, Car, Heart, ShieldAlert } from "lucide-react";
import { FairytaleChateauConfig } from "@/types/templateConfigs";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const FairytaleChateauFields: React.FC<Props> = ({ value, onChange }) => {
  const config = (value || {}) as FairytaleChateauConfig;

  const updateConfig = (updater: (prev: FairytaleChateauConfig) => FairytaleChateauConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-linear-to-b from-amber-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-amber-100">
        <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Configuración Exclusiva • Fairytale Chateau (Boda / Gala)
          </h3>
          <p className="text-[11px] text-amber-800/80">
            Ajusta los bloques de hospedaje para invitados foráneos, shuttles y nombres de la pareja.
          </p>
        </div>
      </div>

      {/* Nombres de los novios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-white/90 border border-amber-100 rounded-xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <Heart className="w-3.5 h-3.5 text-amber-600" />
            <span>Nombre de la Novia / Festejada</span>
          </label>
          <input
            type="text"
            value={config.pareja?.novia || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                pareja: { ...prev.pareja, novia: e.target.value },
              }))
            }
            placeholder="Ej: Sofia Loren"
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="p-3 bg-white/90 border border-amber-100 rounded-xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <Heart className="w-3.5 h-3.5 text-amber-600" />
            <span>Nombre del Novio / Festejado</span>
          </label>
          <input
            type="text"
            value={config.pareja?.novio || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                pareja: { ...prev.pareja, novio: e.target.value },
              }))
            }
            placeholder="Ej: Alexander King"
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Hospedaje y Shuttles */}
      <div className="p-3.5 bg-white/90 border border-amber-100 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-stone-800">
            Hospedaje Recomendado & Bloque de Habitaciones
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Nombre del Hotel / Resort
            </label>
            <input
              type="text"
              value={config.hospedaje?.hotelNombre || ""}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  hospedaje: { ...prev.hospedaje, hotelNombre: e.target.value },
                }))
              }
              placeholder="Ej: Grand Chateau Resort & Spa"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Enlace de Reservación o Código
            </label>
            <input
              type="text"
              value={config.hospedaje?.link || ""}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  hospedaje: { ...prev.hospedaje, link: e.target.value },
                }))
              }
              placeholder="https://hotel.com/group-rate..."
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
            Información de Tarifas y Código Promocional
          </label>
          <input
            type="text"
            value={config.hospedaje?.tarifas || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                hospedaje: { ...prev.hospedaje, tarifas: e.target.value },
              }))
            }
            placeholder="Ej: Código de descuento BODA2026 antes del 1 de Septiembre"
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Transporte y Shuttles */}
      <div className="p-3 bg-white/90 border border-amber-100 rounded-xl space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
          <Car className="w-3.5 h-3.5 text-amber-600" />
          <span>Servicio de Transporte / Shuttles</span>
        </label>
        <input
          type="text"
          value={config.transporte?.shuttlesInfo || ""}
          onChange={(e) =>
            updateConfig((prev) => ({
              ...prev,
              transporte: { ...prev.transporte, shuttlesInfo: e.target.value },
            }))
          }
          placeholder="Ej: Shuttles continuos saliendo del lobby de 3:00 PM a 2:00 AM"
          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
        />
      </div>
    </div>
  );
};
