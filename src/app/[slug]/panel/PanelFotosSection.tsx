"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type FotoPanel = {
  id: string;
  url: string;
  tipo: string;
  nombre: string | null;
  mensaje: string | null;
  createdAt: string;
};

// Galería de fotos de invitados dentro del panel del anfitrión: QR para
// mesas, link de subida, muro en vivo, descarga ZIP y borrado.
export default function PanelFotosSection({
  slug,
  panelKey,
  lang,
}: {
  slug: string;
  panelKey: string;
  lang: "es" | "en";
}) {
  const [fotos, setFotos] = useState<FotoPanel[]>([]);
  const [cargando, setCargando] = useState(true);
  const [qr, setQr] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [borrando, setBorrando] = useState<string | null>(null);

  const es = lang === "es";
  const fotosUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${slug}/fotos` : `/${slug}/fotos`;
  const zipUrl = `/api/eventos/${encodeURIComponent(slug)}/fotos/zip?key=${encodeURIComponent(panelKey)}`;

  useEffect(() => {
    let vivo = true;
    async function cargar() {
      try {
        const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/fotos`);
        const data = await res.json();
        if (vivo && res.ok) setFotos(data.fotos || []);
      } catch {}
      if (vivo) setCargando(false);
    }
    cargar();
    const t = setInterval(cargar, 30000);
    return () => {
      vivo = false;
      clearInterval(t);
    };
  }, [slug]);

  useEffect(() => {
    QRCode.toDataURL(fotosUrl, { width: 220, margin: 1 })
      .then(setQr)
      .catch(() => {});
  }, [fotosUrl]);

  async function borrar(id: string) {
    if (!window.confirm(es ? "¿Borrar esta foto?" : "Delete this photo?")) return;
    setBorrando(id);
    try {
      const res = await fetch(
        `/api/eventos/${encodeURIComponent(slug)}/fotos/${encodeURIComponent(id)}?key=${encodeURIComponent(panelKey)}`,
        { method: "DELETE" }
      );
      if (res.ok) setFotos((prev) => prev.filter((f) => f.id !== id));
    } catch {}
    setBorrando(null);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(fotosUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  }

  return (
    <div className="mt-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E3D9] shadow-xs space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F1B] font-serif flex items-center gap-2">
        📸 {es ? "Fotos de invitados" : "Guest photos"}
      </h3>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="shrink-0 text-center space-y-1">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR para subir fotos" className="w-36 h-36 rounded-xl border border-stone-200 mx-auto" />
          ) : (
            <div className="w-36 h-36 rounded-xl border border-stone-200 bg-stone-50 mx-auto" />
          )}
          <p className="text-[11px] text-stone-500">
            {es ? "Imprime este QR para las mesas" : "Print this QR for the tables"}
          </p>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <p className="text-sm text-stone-600">
            {es
              ? "Los invitados escanean el QR o abren el link y suben sus fotos sin app ni registro. La galería queda guardada después de la fiesta."
              : "Guests scan the QR or open the link and upload photos with no app or sign-up. The gallery stays saved after the party."}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm truncate flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
              {fotosUrl}
            </span>
            <button
              onClick={copiar}
              className="px-3 py-2 rounded-xl bg-[#7A002A] text-white text-sm font-bold shrink-0"
            >
              {copiado ? (es ? "¡Copiado!" : "Copied!") : es ? "Copiar" : "Copy"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/${slug}/muro`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-black text-white text-sm font-bold"
            >
              {es ? "Ver muro en vivo" : "View live wall"}
            </a>
            <a
              href={zipUrl}
              className="px-4 py-2 rounded-xl bg-white border-2 border-[#7A002A] text-[#7A002A] text-sm font-bold"
            >
              {es ? "Descargar todo (ZIP)" : "Download all (ZIP)"}
            </a>
          </div>
          <p className="text-xs text-stone-400">
            {cargando
              ? es
                ? "Cargando fotos…"
                : "Loading photos…"
              : `${fotos.length} ${fotos.length === 1 ? (es ? "foto" : "photo") : es ? "fotos" : "photos"}`}
          </p>
        </div>
      </div>

      {fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {fotos.map((f) => (
            <div key={f.id} className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
              {f.tipo === "video" ? (
                <video src={f.url} muted preload="metadata" className="w-full aspect-square object-cover" />
              ) : f.tipo === "mensaje" ? (
                <div className="w-full aspect-square flex items-center justify-center p-3 text-center">
                  <p className="text-sm font-serif leading-snug line-clamp-6">“{f.mensaje}”</p>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt="" className="w-full aspect-square object-cover" />
              )}
              {(f.nombre || f.mensaje) && f.tipo !== "mensaje" && (
                <p className="px-2 py-1.5 text-xs truncate bg-white">
                  {f.nombre ? <span className="font-bold">{f.nombre}</span> : null}
                  {f.nombre && f.mensaje ? " · " : ""}
                  {f.mensaje || ""}
                </p>
              )}
              <button
                onClick={() => borrar(f.id)}
                disabled={borrando === f.id}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white text-xs font-bold disabled:opacity-50"
                title={es ? "Borrar" : "Delete"}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
