"use client";

import { useState } from "react";

const TEXTOS = {
  es: {
    titulo: "Sube tus fotos de la fiesta",
    subtitulo: "Sin app y sin registro. Tus fotos van directo a la galería del anfitrión.",
    nombre: "Tu nombre (opcional)",
    nombrePh: "Ej. Familia López",
    mensaje: "Mensaje junto a tus fotos (opcional)",
    mensajePh: "Ej. ¡Qué noche tan hermosa!",
    elegir: "Elegir fotos o videos",
    subir: "Subir",
    subiendo: "Subiendo…",
    gracias: "¡Gracias! Tus fotos ya están en la galería.",
    subirMas: "Subir más fotos",
    soloMensaje: "O solo deja un mensaje de felicitación",
    enviarMensaje: "Enviar mensaje",
    mensajeEnviado: "¡Mensaje enviado! Gracias por tus buenos deseos.",
    verInvitacion: "Ver invitación",
    privacidad: "Tus fotos son tuyas. Solo el anfitrión verá la galería completa.",
    errorTipo: "Solo se aceptan fotos y videos cortos.",
    errorTamano: "supera el tamaño máximo (fotos 15 MB, videos 50 MB).",
    errorSubida: "No se pudo subir. Intenta de nuevo.",
    errorMensaje: "Escribe tu mensaje antes de enviar.",
    fotos: "fotos",
    videos: "videos",
  },
  en: {
    titulo: "Upload your party photos",
    subtitulo: "No app, no sign-up. Your photos go straight to the host gallery.",
    nombre: "Your name (optional)",
    nombrePh: "E.g. Lopez Family",
    mensaje: "Message with your photos (optional)",
    mensajePh: "E.g. What a beautiful night!",
    elegir: "Choose photos or videos",
    subir: "Upload",
    subiendo: "Uploading…",
    gracias: "Thank you! Your photos are now in the gallery.",
    subirMas: "Upload more photos",
    soloMensaje: "Or just leave a congratulatory message",
    enviarMensaje: "Send message",
    mensajeEnviado: "Message sent! Thank you for your kind wishes.",
    verInvitacion: "View invitation",
    privacidad: "Your photos are yours. Only the host will see the full gallery.",
    errorTipo: "Only photos and short videos are accepted.",
    errorTamano: "exceeds the max size (photos 15 MB, videos 50 MB).",
    errorSubida: "Upload failed. Please try again.",
    errorMensaje: "Write your message before sending.",
    fotos: "photos",
    videos: "videos",
  },
};

type EstadoArchivo = {
  file: File;
  estado: "pendiente" | "subiendo" | "ok" | "error";
  error?: string;
};

export default function FotosUploadClient({
  slug,
  titulo,
  idiomaDefault,
}: {
  slug: string;
  titulo: string;
  idiomaDefault: "es" | "en";
}) {
  const [idioma, setIdioma] = useState<"es" | "en">(idiomaDefault);
  const t = TEXTOS[idioma];
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [archivos, setArchivos] = useState<EstadoArchivo[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [exito, setExito] = useState(0);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setErrorGeneral("");
    const nuevos: EstadoArchivo[] = [];
    for (const f of files) {
      const esVideo = f.type.startsWith("video/");
      const esFoto = f.type.startsWith("image/");
      if (!esVideo && !esFoto) {
        setErrorGeneral(t.errorTipo);
        continue;
      }
      const max = esVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
      if (f.size > max) {
        setErrorGeneral(`${f.name} ${t.errorTamano}`);
        continue;
      }
      nuevos.push({ file: f, estado: "pendiente" });
    }
    setArchivos((prev) => [...prev, ...nuevos]);
    e.target.value = "";
  }

  async function subirTodo() {
    const pendientes = archivos.filter((a) => a.estado === "pendiente");
    if (pendientes.length === 0) return;
    setSubiendo(true);
    setErrorGeneral("");
    let ok = 0;
    for (const item of pendientes) {
      setArchivos((prev) =>
        prev.map((a) => (a.file === item.file ? { ...a, estado: "subiendo" } : a))
      );
      try {
        const resUrl = await fetch(`/api/eventos/${encodeURIComponent(slug)}/fotos/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: item.file.name,
            contentType: item.file.type,
            fileSize: item.file.size,
          }),
        });
        const dataUrl = await resUrl.json();
        if (!resUrl.ok || !dataUrl.uploadUrl) throw new Error(dataUrl.error || t.errorSubida);
        const resPut = await fetch(dataUrl.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": item.file.type },
          body: item.file,
        });
        if (!resPut.ok) throw new Error(t.errorSubida);
        const resReg = await fetch(`/api/eventos/${encodeURIComponent(slug)}/fotos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileKey: dataUrl.fileKey, nombre, mensaje }),
        });
        const dataReg = await resReg.json();
        if (!resReg.ok || !dataReg.ok) throw new Error(dataReg.error || t.errorSubida);
        ok += 1;
        setArchivos((prev) =>
          prev.map((a) => (a.file === item.file ? { ...a, estado: "ok" } : a))
        );
      } catch (err: any) {
        setArchivos((prev) =>
          prev.map((a) =>
            a.file === item.file ? { ...a, estado: "error", error: err?.message || t.errorSubida } : a
          )
        );
      }
    }
    setSubiendo(false);
    if (ok > 0) setExito((v) => v + ok);
  }

  async function enviarSoloMensaje() {
    if (!mensaje.trim()) {
      setErrorGeneral(t.errorMensaje);
      return;
    }
    setErrorGeneral("");
    const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/fotos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "mensaje", mensaje, nombre }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setErrorGeneral(data.error || t.errorSubida);
      return;
    }
    setMensajeEnviado(true);
    setMensaje("");
  }

  const pendientes = archivos.filter((a) => a.estado === "pendiente").length;

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-5 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7A002A]">
            {titulo}
          </p>
          <div className="flex gap-1 bg-white border border-stone-200 rounded-full p-1">
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setIdioma(l)}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  idioma === l ? "bg-[#7A002A] text-white" : "text-stone-500"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-4xl">📸</p>
          <h1 className="text-2xl font-bold leading-tight">{t.titulo}</h1>
          <p className="text-stone-500">{t.subtitulo}</p>
        </div>

        {exito > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
            <p className="font-bold text-emerald-800">{t.gracias}</p>
            <button
              onClick={() => {
                setArchivos([]);
                setExito(0);
              }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-700 text-white font-bold text-sm"
            >
              {t.subirMas}
            </button>
          </div>
        )}

        {mensajeEnviado && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <p className="font-bold text-emerald-800">{t.mensajeEnviado}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-5 space-y-4 shadow">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              {t.nombre}
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={t.nombrePh}
              className="w-full py-3 px-4 rounded-2xl border-2 border-stone-200 focus:outline-none focus:border-[#7A002A]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              {t.mensaje}
            </label>
            <input
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder={t.mensajePh}
              className="w-full py-3 px-4 rounded-2xl border-2 border-stone-200 focus:outline-none focus:border-[#7A002A]"
            />
          </div>

          <label className="block w-full py-4 rounded-2xl border-2 border-dashed border-[#7A002A]/40 bg-[#FFF5F7] text-center font-bold text-[#7A002A] cursor-pointer">
            📷 {t.elegir}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={alElegir}
              className="hidden"
            />
          </label>

          {archivos.length > 0 && (
            <ul className="space-y-2 text-sm">
              {archivos.map((a, i) => (
                <li key={i} className="flex items-center justify-between gap-2 bg-stone-50 rounded-xl px-3 py-2">
                  <span className="truncate flex-1">{a.file.name}</span>
                  {a.estado === "ok" && <span className="text-emerald-600 font-bold">✓</span>}
                  {a.estado === "subiendo" && <span className="text-stone-400">…</span>}
                  {a.estado === "error" && (
                    <span className="text-red-600 text-xs">{a.error || t.errorSubida}</span>
                  )}
                  {a.estado === "pendiente" && (
                    <button
                      onClick={() => setArchivos((prev) => prev.filter((x) => x.file !== a.file))}
                      className="text-stone-400 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {errorGeneral && <p className="text-sm font-semibold text-red-700">{errorGeneral}</p>}

          <button
            onClick={subirTodo}
            disabled={subiendo || pendientes === 0}
            className="w-full py-4 rounded-2xl bg-[#7A002A] text-white font-bold disabled:opacity-50"
          >
            {subiendo ? t.subiendo : `${t.subir} (${pendientes})`}
          </button>
        </div>

        <div className="bg-white rounded-3xl p-5 space-y-3 shadow">
          <p className="font-bold text-center">{t.soloMensaje}</p>
          <button
            onClick={enviarSoloMensaje}
            className="w-full py-3.5 rounded-2xl bg-white border-2 border-[#7A002A] text-[#7A002A] font-bold"
          >
            {t.enviarMensaje}
          </button>
        </div>

        <p className="text-center text-xs text-stone-400">{t.privacidad}</p>
        <a
          href={`/${slug}`}
          className="block text-center text-sm font-semibold text-stone-500 underline underline-offset-2"
        >
          {t.verInvitacion}
        </a>
      </div>
    </main>
  );
}
