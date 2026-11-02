"use client";

import { useEffect, useRef, useState } from "react";

type Foto = {
  id: string;
  url: string;
  tipo: string;
  nombre: string | null;
  mensaje: string | null;
  createdAt: string;
};

// Muro en vivo: vista web para TV/proyector/tablet (como el Photo Wall de
// Kululu, sin hardware especial). Avanza sola y se actualiza cada 15 s.
export default function MuroClient({ slug, titulo }: { slug: string; titulo: string }) {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);

  useEffect(() => {
    let vivo = true;
    async function cargar() {
      try {
        const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/fotos`);
        const data = await res.json();
        if (!vivo || !res.ok) return;
        setFotos(data.fotos || []);
      } catch {}
    }
    cargar();
    const t = setInterval(cargar, 15000);
    return () => {
      vivo = false;
      clearInterval(t);
    };
  }, [slug]);

  useEffect(() => {
    if (fotos.length === 0) return;
    const t = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % fotos.length;
      setIdx(idxRef.current);
    }, 8000);
    return () => clearInterval(t);
  }, [fotos.length]);

  const actual = fotos.length > 0 ? fotos[idx % fotos.length] : null;

  function pantallaCompleta() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/70 to-transparent">
        <p className="font-bold truncate">{titulo} · 📸 Muro de fotos</p>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-stone-300">
            {fotos.length} {fotos.length === 1 ? "foto" : "fotos"}
          </span>
          <button
            onClick={pantallaCompleta}
            className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-bold"
          >
            Pantalla completa
          </button>
        </div>
      </div>

      {!actual && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-5xl">📸</p>
          <p className="text-xl font-bold">Aún no hay fotos</p>
          <p className="text-stone-400">
            Escanea el QR de la fiesta o abre <span className="text-white font-semibold">/{slug}/fotos</span> para
            subir la primera.
          </p>
        </div>
      )}

      {actual && actual.tipo === "mensaje" && (
        <div className="min-h-screen flex items-center justify-center px-8">
          <div className="max-w-2xl text-center space-y-4">
            <p className="text-3xl sm:text-5xl font-serif leading-snug">“{actual.mensaje}”</p>
            {actual.nombre && <p className="text-stone-300 font-bold">— {actual.nombre}</p>}
          </div>
        </div>
      )}

      {actual && actual.tipo === "foto" && (
        <div className="min-h-screen flex items-center justify-center pt-14 pb-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={actual.url} alt="" className="max-h-[80vh] max-w-full object-contain rounded-xl" />
        </div>
      )}

      {actual && actual.tipo === "video" && (
        <div className="min-h-screen flex items-center justify-center pt-14 pb-24">
          <video
            key={actual.id}
            src={actual.url}
            autoPlay
            muted
            loop
            playsInline
            className="max-h-[80vh] max-w-full object-contain rounded-xl"
          />
        </div>
      )}

      {actual && actual.tipo !== "mensaje" && (actual.nombre || actual.mensaje) && (
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 py-5 bg-gradient-to-t from-black/80 to-transparent text-center">
          {actual.mensaje && <p className="font-semibold">{actual.mensaje}</p>}
          {actual.nombre && <p className="text-stone-300 text-sm">{actual.nombre}</p>}
        </div>
      )}
    </main>
  );
}
