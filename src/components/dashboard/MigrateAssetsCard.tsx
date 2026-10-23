"use client";

import { useState } from "react";
import { CloudUpload, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface MigrationResult {
  bucket: string;
  totalUploaded: number;
  totalFailed: number;
  results: { s3Folder: string; uploaded: number; failed: unknown[] }[];
}

/**
 * Tarjeta de mantenimiento (una sola vez): ejecuta la migración de los
 * assets de plantillas a AWS S3 vía /api/admin/migrate-template-assets.
 * El servidor usa sus propias credenciales AWS; aquí no se maneja ninguna.
 */
export default function MigrateAssetsCard() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (
      !window.confirm(
        "Esto sube TODOS los assets de plantillas (imágenes optimizadas WebP y originales) a las carpetas templates/ de AWS S3. Puede tardar 1–3 minutos. ¿Continuar?"
      )
    ) {
      return;
    }
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/migrate-template-assets", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "La migración falló.");
      } else {
        setResult(data as MigrationResult);
      }
    } catch {
      setError("No se pudo contactar el servidor.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-2xl border border-stone-200 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <CloudUpload className="w-4 h-4 text-[#7A002A]" />
            Migración de assets a AWS (una sola vez)
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Sube las imágenes fijas de las plantillas a las carpetas
            templates/ del bucket S3 para que se sirvan desde AWS. El servidor
            usa sus propias credenciales; no necesitas ninguna clave aquí.
          </p>
        </div>
        <button
          onClick={run}
          disabled={running}
          className="flex items-center gap-2 py-2.5 px-4 bg-[#7A002A] hover:bg-[#5e0020] disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Migrando…
            </>
          ) : (
            <>
              <CloudUpload className="w-4 h-4" /> Migrar assets a AWS
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-700 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> {error}
        </p>
      )}

      {result && (
        <div className="mt-3 text-sm text-stone-700">
          <p className="flex items-center gap-1.5 font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            Migración completa: {result.totalUploaded} archivos subidos
            {result.totalFailed > 0 &&
              `, ${result.totalFailed} con error (reintenta con el mismo botón)`}
          </p>
          <ul className="mt-1 text-xs text-stone-500 list-disc list-inside">
            {result.results.map((r) => (
              <li key={r.s3Folder}>
                templates/{r.s3Folder}/ — {r.uploaded} archivos
                {r.failed.length > 0 && ` (${r.failed.length} fallidos)`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
