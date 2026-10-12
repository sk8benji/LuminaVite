"use client";

import React, { useState } from "react";
import { Upload, Sparkles, Image as ImageIcon, Music, Heart, Info } from "lucide-react";
import { QuinceRosadoConfig } from "@/types/templateConfigs";
import { uploadClientFile } from "@/lib/upload-client";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const QuinceRosadoFields: React.FC<Props> = ({ value, onChange, slug }) => {
  const config = (value || {}) as QuinceRosadoConfig;
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateConfig = (updater: (prev: QuinceRosadoConfig) => QuinceRosadoConfig) => {
    const updated = updater({ ...config });
    onChange(updated);
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: "fotoZapato1Url" | "fotoZapato2Url"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    setUploadError(null);

    try {
      const folder = `clientes/invitaciones/${slug || "general"}/images`;
      const uploadedUrl = await uploadClientFile(file, folder);

      updateConfig((prev) => ({
        ...prev,
        cambioZapatillas: {
          ...prev.cambioZapatillas,
          [fieldKey]: uploadedUrl,
        },
      }));
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Error al subir la imagen");
    } finally {
      setUploadingField(null);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-pink-200 bg-linear-to-b from-pink-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-pink-100">
        <span className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-pink-950 uppercase tracking-wide">
            Configuración Exclusiva • Quince Rosado (Magdalena)
          </h3>
          <p className="text-[11px] text-pink-800/80">
            Personaliza el momento del cambio de zapatillas, vals y avisos propios de este diseño.
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Sección Cambio de Zapatillas */}
      <div className="space-y-3 p-3.5 bg-white/90 border border-pink-100 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-sm">👠</span>
          <span className="text-xs font-bold text-stone-800">
            Cambio de Zapatillas & Fotos de Calzado
          </span>
        </div>
        <p className="text-[11px] text-stone-500">
          Sube las fotografías personalizadas para la zapatilla de cristal previa a la misa y la zapatilla sobre cojín del vals.
        </p>

        {/* Zapato 1 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-stone-700 block">
            Foto Zapato 1 (Zapatilla de Cristal previa a la Ceremonia)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={config.cambioZapatillas?.fotoZapato1Url || ""}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  cambioZapatillas: {
                    ...prev.cambioZapatillas,
                    fotoZapato1Url: e.target.value,
                  },
                }))
              }
              placeholder="URL o sube imagen a S3 (dejar vacío para imagen por defecto)"
              className="flex-1 min-w-0 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
            />
            <label className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingField === "fotoZapato1Url" ? "Subiendo..." : "Subir a S3"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField === "fotoZapato1Url"}
                onChange={(e) => handleUpload(e, "fotoZapato1Url")}
              />
            </label>
          </div>
          {config.cambioZapatillas?.fotoZapato1Url && (
            <div className="mt-1 flex items-center gap-2 text-[10px] text-stone-500">
              <ImageIcon className="w-3 h-3 text-pink-600" />
              <span className="truncate max-w-xs">{config.cambioZapatillas.fotoZapato1Url}</span>
            </div>
          )}
        </div>

        {/* Zapato 2 */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-semibold text-stone-700 block">
            Foto Zapato 2 (Zapatilla en Cojín / Baile de Honor)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={config.cambioZapatillas?.fotoZapato2Url || ""}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  cambioZapatillas: {
                    ...prev.cambioZapatillas,
                    fotoZapato2Url: e.target.value,
                  },
                }))
              }
              placeholder="URL o sube imagen a S3 (dejar vacío para imagen por defecto)"
              className="flex-1 min-w-0 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
            />
            <label className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingField === "fotoZapato2Url" ? "Subiendo..." : "Subir a S3"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingField === "fotoZapato2Url"}
                onChange={(e) => handleUpload(e, "fotoZapato2Url")}
              />
            </label>
          </div>
          {config.cambioZapatillas?.fotoZapato2Url && (
            <div className="mt-1 flex items-center gap-2 text-[10px] text-stone-500">
              <ImageIcon className="w-3 h-3 text-pink-600" />
              <span className="truncate max-w-xs">{config.cambioZapatillas.fotoZapato2Url}</span>
            </div>
          )}
        </div>

        {/* Mensaje emotivo de las zapatillas */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-semibold text-stone-700 block">
            Mensaje Emotivo del Cambio de Zapatillas (Opcional)
          </label>
          <textarea
            rows={2}
            value={config.cambioZapatillas?.mensaje || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                cambioZapatillas: {
                  ...prev.cambioZapatillas,
                  mensaje: e.target.value,
                },
              }))
            }
            placeholder="Ej: Un paso de niña a señorita que guardaremos por siempre en el corazón..."
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs resize-none focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Color de Vestido Reservado y Canción Vals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-white/90 border border-pink-100 rounded-xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <Heart className="w-3.5 h-3.5 text-pink-600" />
            <span>Color de Vestido Reservado</span>
          </label>
          <input
            type="text"
            value={config.colorVestidoReservado || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                colorVestidoReservado: e.target.value,
              }))
            }
            placeholder="Ej: Rosa pastel y blanco reservados"
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
          />
          <p className="text-[10px] text-stone-400">
            Aparece en la tarjeta de código de vestimenta de esta plantilla.
          </p>
        </div>

        <div className="p-3 bg-white/90 border border-pink-100 rounded-xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700">
            <Music className="w-3.5 h-3.5 text-pink-600" />
            <span>Canción Especial del Vals</span>
          </label>
          <input
            type="text"
            value={config.cancionVals || ""}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                cancionVals: e.target.value,
              }))
            }
            placeholder="Ej: Vals de las Mariposas - Chayanne"
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
          />
          <p className="text-[10px] text-stone-400">
            Nombre del tema del vals principal con los padres.
          </p>
        </div>
      </div>

      {/* Frase Emocional o Aviso de Niños */}
      <div className="p-3 bg-white/90 border border-pink-100 rounded-xl space-y-2">
        <label className="text-[11px] font-semibold text-stone-700 block">
          Aviso Especial / Recomendación para Invitados (Opcional)
        </label>
        <input
          type="text"
          value={config.avisoNinos || ""}
          onChange={(e) =>
            updateConfig((prev) => ({
              ...prev,
              avisoNinos: e.target.value,
            }))
          }
          placeholder="Ej: Evento sólo para adultos / Agradecemos su comprensión con los niños"
          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
        />
      </div>
    </div>
  );
};
