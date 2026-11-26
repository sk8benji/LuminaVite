"use client";

import React, { useState } from "react";
import { Sparkles, Upload, Info, X } from "lucide-react";
import { uploadClientFile } from "@/lib/upload-client";
import {
  BEAUTY_QUINCE_ASSET_LABELS,
  BEAUTY_QUINCE_ASSETS,
  BeautyQuinceArtKey,
} from "@/lib/templates/beautyQuinceAssets";

interface Props {
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const BeautyFields: React.FC<Props> = ({ value, onChange, slug }) => {
  const overrides = (value?.arteBeautyQuince || {}) as Partial<Record<BeautyQuinceArtKey, string>>;
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateOverrides = (next: Partial<Record<BeautyQuinceArtKey, string>>) => {
    onChange({ ...(value || {}), arteBeautyQuince: next });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, artKey: BeautyQuinceArtKey) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingKey(artKey);
    setUploadError(null);
    try {
      const folder = `clientes/invitaciones/${slug || "general"}/images`;
      const uploadedUrl = await uploadClientFile(file, folder);
      updateOverrides({ ...overrides, [artKey]: uploadedUrl });
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Error al subir la imagen");
    } finally {
      setUploadingKey(null);
    }
  };

  const removeOverride = (artKey: BeautyQuinceArtKey) => {
    const next = { ...overrides };
    delete next[artKey];
    updateOverrides(next);
  };

  const keys = Object.keys(BEAUTY_QUINCE_ASSET_LABELS) as BeautyQuinceArtKey[];

  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-linear-to-b from-amber-50/60 to-white p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2 border-b border-amber-100">
        <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Configuración Exclusiva • Beauty Quince
          </h3>
          <p className="text-[11px] text-amber-800/80">
            Reemplaza pieza por pieza el arte del diseño (sobre, marcos, castillo, carroza…). Sin reemplazo se usa el arte original.
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {keys.map((artKey) => {
          const currentUrl = overrides[artKey] || BEAUTY_QUINCE_ASSETS[artKey];
          const isOverride = Boolean(overrides[artKey]);
          const inputId = `beauty-art-${artKey}`;
          return (
            <div key={artKey} className="p-3 bg-white/90 border border-amber-100 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-stone-700">
                  {BEAUTY_QUINCE_ASSET_LABELS[artKey]}
                  {isOverride && <span className="ml-1.5 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">PERSONALIZADO</span>}
                </span>
                {isOverride && (
                  <button
                    type="button"
                    onClick={() => removeOverride(artKey)}
                    className="text-[10px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-0.5 shrink-0"
                  >
                    <X className="w-3 h-3" /> Restaurar
                  </button>
                )}
              </div>
              {currentUrl && (
                <img src={currentUrl} alt={BEAUTY_QUINCE_ASSET_LABELS[artKey]} className="w-full h-20 object-cover rounded-lg border border-stone-100" />
              )}
              <label
                htmlFor={inputId}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-2.5 py-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadingKey === artKey ? "Subiendo…" : "Reemplazar imagen"}
              </label>
              <input
                id={inputId}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e, artKey)}
                disabled={uploadingKey === artKey}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
