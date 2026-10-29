"use client";

import { useEffect, useState } from "react";

function formatoPeso(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface MiniaturaConMetaProps {
  url?: string | null;
  alt?: string;
  imgClassName?: string;
}

/**
 * Miniatura de una foto con su medida y su peso debajo, para los campos de
 * foto de los editores (invitaciones y plantillas, todas las plantillas).
 * - Medida: se lee del propio <img> al cargar (naturalWidth × naturalHeight).
 * - Peso: intento HEAD (Content-Length). Si el origen no lo permite (CORS),
 *   simplemente no se muestra el peso, sin romper nada.
 * Si no hay URL, no renderiza nada (el padre muestra su placeholder).
 */
export default function MiniaturaConMeta({ url, alt = "", imgClassName = "" }: MiniaturaConMetaProps) {
  const [medida, setMedida] = useState<string | null>(null);
  const [peso, setPeso] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMedida(null);
    setPeso(null);
    setError(false);
    if (!url) return;
    let cancelado = false;
    fetch(url, { method: "HEAD" })
      .then((r) => {
        const len = r.headers.get("content-length");
        if (!cancelado && len) {
          const n = parseInt(len, 10);
          if (Number.isFinite(n)) setPeso(formatoPeso(n));
        }
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, [url]);

  if (!url) return null;

  return (
    <div className="shrink-0 flex flex-col items-center gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className={imgClassName}
        onLoad={(e) => {
          const im = e.currentTarget;
          if (im.naturalWidth > 0) setMedida(`${im.naturalWidth} × ${im.naturalHeight} px`);
        }}
        onError={() => setError(true)}
      />
      {error ? (
        <p className="text-[10px] font-semibold text-red-600 whitespace-nowrap">No carga</p>
      ) : (
        <div className="text-center leading-tight">
          <p className="text-[10px] font-semibold text-stone-700 whitespace-nowrap">
            {medida ?? "midiendo…"}
          </p>
          {peso && <p className="text-[10px] text-stone-500 whitespace-nowrap">{peso}</p>}
        </div>
      )}
    </div>
  );
}
