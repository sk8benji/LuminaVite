"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  DATOS_SECCIONES,
  calcularProgresoDatos,
  campoVisible,
  camposVisibles,
  type DatosCampoPlano,
  type DatosRespuestas,
} from "@/lib/datos-questions";

type Vista = "inicio" | "pregunta" | "revisar" | "exito";
type Idioma = "es" | "en";

const UI = {
  es: {
    bienvenida: "Tus datos para tu invitación",
    bienvenidaSub:
      "Llena esto a tu ritmo: cada respuesta se guarda sola y puedes seguir otro día desde este mismo link.",
    empezar: "Empezar",
    continuarDonde: "Continuar donde me quedé",
    preguntaDe: "Pregunta",
    de: "de",
    anterior: "Anterior",
    continuar: "Continuar",
    saltar: "Saltar por ahora",
    guardarSalir: "Guardar y seguir después",
    guardado: "Guardado ✓",
    guardando: "Guardando…",
    errorGuardar: "No se pudo guardar. Revisa tu conexión e intenta de nuevo.",
    requerida: "Esta pregunta es necesaria para armar tu invitación.",
    revisar: "Revisa tus respuestas",
    revisarSub: "Corrige lo que quieras antes de enviar.",
    sinRespuesta: "Sin respuesta",
    editar: "Editar",
    terminar: "Terminé, enviar mis datos",
    enviando: "Enviando…",
    exitoTitulo: "¡Gracias! Ya recibimos tus datos.",
    exitoSub:
      "Nuestro equipo empezará a armar tu invitación. Si falta algo, te contactaremos.",
    yaCompletado: "Este formulario ya fue enviado. Gracias.",
    linkInvalido: "Este link no es válido. Pídele a nuestro equipo que te reenvíe tu link.",
    cargando: "Cargando tus datos…",
    subirFoto: "Elegir foto",
    subiendoFoto: "Subiendo foto…",
    fotoSubida: "Foto subida ✓",
    secciones: "Secciones",
  },
  en: {
    bienvenida: "Your details for your invitation",
    bienvenidaSub:
      "Fill this out at your own pace: every answer saves automatically and you can continue another day from this same link.",
    empezar: "Start",
    continuarDonde: "Continue where I left off",
    preguntaDe: "Question",
    de: "of",
    anterior: "Back",
    continuar: "Continue",
    saltar: "Skip for now",
    guardarSalir: "Save and continue later",
    guardado: "Saved ✓",
    guardando: "Saving…",
    errorGuardar: "Could not save. Check your connection and try again.",
    requerida: "This question is needed to build your invitation.",
    revisar: "Review your answers",
    revisarSub: "Fix anything before sending.",
    sinRespuesta: "No answer",
    editar: "Edit",
    terminar: "Done, send my details",
    enviando: "Sending…",
    exitoTitulo: "Thank you! We received your details.",
    exitoSub:
      "Our team will start building your invitation. If anything is missing, we will contact you.",
    yaCompletado: "This form was already sent. Thank you.",
    linkInvalido: "This link is not valid. Ask our team to resend your link.",
    cargando: "Loading your details…",
    subirFoto: "Choose photo",
    subiendoFoto: "Uploading photo…",
    fotoSubida: "Photo uploaded ✓",
    secciones: "Sections",
  },
} as const;

export default function PortalDatosPage() {
  const params = useParams();
  const token = params.token as string;
  // Vista previa: /datos/demo muestra el portal completo sin tocar ninguna
  // orden real. No lee ni escribe en la API: todo vive en el estado local
  // y se pierde al recargar. Solo sirve para ver cómo quedó y ajustar.
  const esDemo = token === "demo";

  const [cargando, setCargando] = useState(true);
  const [linkValido, setLinkValido] = useState(true);
  const [nombreCliente, setNombreCliente] = useState("");
  const [paqueteNombre, setPaqueteNombre] = useState("");
  const [respuestas, setRespuestas] = useState<DatosRespuestas>({});
  const [completado, setCompletado] = useState(false);
  // Por defecto en inglés; español como secundario (botón ES/EN arriba). Decisión de Abraham 2026-11-01.
  const [idioma, setIdioma] = useState<Idioma>("en");
  const [vista, setVista] = useState<Vista>("inicio");
  const [idx, setIdx] = useState(0);
  const [valorActual, setValorActual] = useState("");
  const [estadoGuardado, setEstadoGuardado] = useState<"idle" | "guardando" | "guardado" | "error">("idle");
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [plantillas, setPlantillas] = useState<
    { estilo: string; nombre: string; demoSlug: string; demoUrl: string; imagen: string }[]
  >([]);
  const [plantillasError, setPlantillasError] = useState(false);
  const [otroActivo, setOtroActivo] = useState(false);
  const [ejemploAbierto, setEjemploAbierto] = useState(false);
  const [mensajeRequerida, setMensajeRequerida] = useState(false);
  const [avisoGuardadoSalir, setAvisoGuardadoSalir] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = UI[idioma];
  // Solo las preguntas visibles: las condicionales ocultas no se recorren ni cuentan.
  const campos = camposVisibles(respuestas);
  const campo: DatosCampoPlano | undefined = campos[idx];
  const progreso = calcularProgresoDatos(respuestas);

  const cargar = useCallback(async () => {
    if (esDemo) {
      setNombreCliente("");
      setPaqueteNombre("");
      setRespuestas({});
      setCompletado(false);
      setCargando(false);
      return;
    }
    try {
      const res = await fetch(`/api/datos/${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLinkValido(false);
        return;
      }
      setNombreCliente(data.nombreCliente || "");
      setPaqueteNombre(data.paqueteNombre || "");
      setRespuestas(data.respuestas || {});
      setCompletado(Boolean(data.completado));
      if (data.completado) setVista("exito");
    } catch {
      setLinkValido(false);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Catálogo de plantillas desde la base de datos (nombres, portada y orden vivos).
  useEffect(() => {
    fetch("/api/datos/plantillas")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.plantillas) && d.plantillas.length > 0) {
          setPlantillas(d.plantillas);
        } else {
          setPlantillasError(true);
        }
      })
      .catch(() => setPlantillasError(true));
  }, []);

  // Al entrar a una pregunta, precargar su respuesta guardada (si existe).
  useEffect(() => {
    if (vista === "pregunta" && campo) {
      setEjemploAbierto(false);
      setValorActual(respuestas[campo.id] || "");
      setOtroActivo(
        campo.tipo === "opcion_otro" &&
          Boolean(respuestas[campo.id]) &&
          !(campo.opciones || []).includes(respuestas[campo.id] || ""),
      );
      setMensajeRequerida(false);
      setAvisoGuardadoSalir(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista, idx]);

  async function guardar(id: string, valor: string): Promise<boolean> {
    if (esDemo) {
      setRespuestas((prev) => ({ ...prev, [id]: valor }));
      setEstadoGuardado("guardado");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setEstadoGuardado("idle"), 2000);
      return true;
    }
    setEstadoGuardado("guardando");
    try {
      const res = await fetch(`/api/datos/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas: { [id]: valor } }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("save failed");
      setRespuestas(data.respuestas || {});
      setEstadoGuardado("guardado");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setEstadoGuardado("idle"), 2000);
      return true;
    } catch {
      setEstadoGuardado("error");
      return false;
    }
  }

  function irA(i: number) {
    if (i < 0) {
      setVista("inicio");
      return;
    }
    if (i >= campos.length) {
      setVista("revisar");
      return;
    }
    setIdx(i);
    setVista("pregunta");
  }

  async function continuar() {
    if (!campo) return;
    if (campo.requerido && !valorActual.trim()) {
      setMensajeRequerida(true);
      return;
    }
    const ok = await guardar(campo.id, valorActual);
    if (ok) irA(idx + 1);
  }

  async function seleccionarOpcion(valor: string) {
    if (!campo) return;
    setValorActual(valor);
    const ok = await guardar(campo.id, valor);
    if (ok) {
      // Tally: al elegir una opción, avanza sola tras un respiro.
      setTimeout(() => irA(idx + 1), 350);
    }
  }

  async function guardarYSalir() {
    if (!campo) return;
    await guardar(campo.id, valorActual);
    setAvisoGuardadoSalir(true);
  }

  async function subirFoto(file: File) {
    if (!campo) return;
    if (esDemo) {
      // Vista previa local: se ve la foto en el flujo, pero no se sube a S3.
      const preview = URL.createObjectURL(file);
      setValorActual(preview);
      await guardar(campo.id, preview);
      return;
    }
    setSubiendoFoto(true);
    try {
      const res = await fetch(`/api/datos/${encodeURIComponent(token)}/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.uploadUrl) throw new Error("upload-url failed");
      const put = await fetch(data.uploadUrl, { method: "PUT", body: file });
      if (!put.ok) throw new Error("put failed");
      setValorActual(data.fileUrl);
      await guardar(campo.id, data.fileUrl);
    } catch {
      setEstadoGuardado("error");
    } finally {
      setSubiendoFoto(false);
    }
  }

  async function completar() {
    if (esDemo) {
      setCompletado(true);
      setVista("exito");
      return;
    }
    setEstadoGuardado("guardando");
    try {
      const res = await fetch(`/api/datos/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completar: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("complete failed");
      setCompletado(true);
      setVista("exito");
    } catch {
      setEstadoGuardado("error");
    }
  }

  function empezar() {
    // Si ya hay respuestas, seguir donde se quedó: primera pregunta sin respuesta.
    const primeroSin = campos.findIndex((c) => !(respuestas[c.id] || "").trim());
    irA(primeroSin === -1 ? 0 : primeroSin);
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
        <p className="text-stone-500">{t.cargando}</p>
      </main>
    );
  }

  if (!linkValido) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-2xl font-bold text-stone-900 mb-2">Click and love</p>
          <p className="text-stone-600">{t.linkInvalido}</p>
        </div>
      </main>
    );
  }

  const preguntaTexto = campo ? (idioma === "es" ? campo.pregunta : campo.preguntaEn) : "";
  const opcionesMostrar = campo
    ? idioma === "es"
      ? campo.opciones
      : campo.opcionesEn || campo.opciones
    : undefined;
  const ayudaTexto = campo
    ? idioma === "es"
      ? campo.ayuda
      : campo.ayudaEn
    : undefined;
  const seccionTitulo = campo
    ? idioma === "es"
      ? campo.seccionTitulo
      : campo.seccionTituloEn
    : "";

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-stone-900">
      {/* Barra superior: marca, idioma y progreso */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <span className="font-bold tracking-widest text-sm">CLICK AND LOVE</span>
          <div className="flex gap-1 text-xs font-semibold">
            <button
              onClick={() => setIdioma("es")}
              className={`px-2.5 py-1 rounded-lg ${idioma === "es" ? "bg-stone-900 text-white" : "bg-stone-100"}`}
            >
              ES
            </button>
            <button
              onClick={() => setIdioma("en")}
              className={`px-2.5 py-1 rounded-lg ${idioma === "en" ? "bg-stone-900 text-white" : "bg-stone-100"}`}
            >
              EN
            </button>
          </div>
        </div>
        <div className="h-1.5 bg-stone-100">
          <div
            className="h-full bg-[#7A002A] transition-all"
            style={{ width: `${completado ? 100 : progreso.porcentaje}%` }}
          />
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 py-8">
        {vista === "inicio" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold leading-tight">{t.bienvenida}</h1>
              {nombreCliente && (
                <p className="text-stone-600 mt-2">
                  {idioma === "es" ? `Hola ${nombreCliente} 👋` : `Hi ${nombreCliente} 👋`}
                </p>
              )}
              <p className="text-stone-600 mt-2">{t.bienvenidaSub}</p>
              {esDemo && (
                <p className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-800">
                  {idioma === "es"
                    ? "VISTA PREVIA — Solo para ver cómo quedó y hacer ajustes. No guarda nada en ninguna orden."
                    : "PREVIEW — Only to see how it looks and make adjustments. Nothing is saved to any order."}
                </p>
              )}
              {paqueteNombre && (
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mt-3">
                  {paqueteNombre}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <p className="text-xs font-bold uppercase text-stone-400 mb-3">{t.secciones}</p>
              <div className="space-y-2">
                {DATOS_SECCIONES.map((sec) => {
                  const camposSec = sec.campos.filter((c) => campoVisible(c, respuestas));
                  const contestadas = camposSec.filter(
                    (c) => (respuestas[c.id] || "").trim().length > 0
                  ).length;
                  return (
                    <div key={sec.id} className="flex items-center justify-between text-sm">
                      <span>{idioma === "es" ? sec.titulo : sec.tituloEn}</span>
                      <span className="text-stone-400">
                        {contestadas}/{camposSec.length}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-stone-500 mt-3">
                {progreso.contestadas} {t.de.toLowerCase()} {progreso.total} {idioma === "es" ? "respuestas" : "answers"}
              </p>
            </div>

            <button
              onClick={empezar}
              className="w-full py-4 rounded-2xl bg-[#7A002A] text-white font-bold text-base shadow"
            >
              {progreso.contestadas > 0 ? t.continuarDonde : t.empezar}
            </button>
          </div>
        )}

        {vista === "pregunta" && campo && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A002A]">
                {seccionTitulo} · {t.preguntaDe} {idx + 1} {t.de} {campos.length}
              </p>
              <div className="flex items-start gap-2 mt-2">
                <h1 className="text-2xl font-bold leading-snug flex-1">{preguntaTexto}</h1>
                {(campo.ejemplo || campo.ejemploEn) && (
                  <button
                    onClick={() => setEjemploAbierto(true)}
                    aria-label={idioma === "es" ? "Ver ejemplo" : "See example"}
                    className="shrink-0 w-8 h-8 rounded-full border-2 border-[#7A002A] text-[#7A002A] font-bold text-base leading-none"
                  >
                    ?
                  </button>
                )}
              </div>
              {ejemploAbierto && (
                <div
                  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5"
                  onClick={() => setEjemploAbierto(false)}
                >
                  <div
                    className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-stone-700 leading-relaxed">
                      {idioma === "es"
                        ? campo.ejemplo || campo.ejemploEn
                        : campo.ejemploEn || campo.ejemplo}
                    </p>
                    <button
                      onClick={() => setEjemploAbierto(false)}
                      className="w-full py-3 rounded-2xl bg-[#7A002A] text-white font-bold"
                    >
                      {idioma === "es" ? "Entendido" : "Got it"}
                    </button>
                  </div>
                </div>
              )}
              {ayudaTexto && <p className="text-stone-500 mt-2">{ayudaTexto}</p>}
            </div>

            {campo.tipo === "opcion" && opcionesMostrar && (
              <div className="space-y-3">
                {opcionesMostrar.map((op) => (
                  <button
                    key={op}
                    onClick={() => seleccionarOpcion(op)}
                    className={`w-full text-left py-4 px-5 rounded-2xl border-2 font-semibold transition ${
                      valorActual === op
                        ? "border-[#7A002A] bg-[#FFF5F7]"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {campo.tipo === "opcion_otro" && campo.opciones && (
              <div className="space-y-3">
                {campo.opciones.map((op) => (
                  <button
                    key={op}
                    onClick={() => {
                      if (op === "Other") {
                        setOtroActivo(true);
                        // Al pasar de una opción de la lista a "Other", se
                        // limpia para escribir el tipo libre.
                        if ((campo.opciones || []).includes(valorActual)) {
                          setValorActual("");
                        }
                      } else {
                        setOtroActivo(false);
                        seleccionarOpcion(op);
                      }
                    }}
                    className={`w-full text-left py-4 px-5 rounded-2xl border-2 font-semibold transition ${
                      (!otroActivo && valorActual === op) || (otroActivo && op === "Other")
                        ? "border-[#7A002A] bg-[#FFF5F7]"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    {op}
                  </button>
                ))}
                {otroActivo && (
                  <input
                    type="text"
                    value={valorActual}
                    onChange={(e) => setValorActual(e.target.value)}
                    placeholder={
                      idioma === "es"
                        ? "Escribe qué tipo de evento"
                        : "Write what type of event"
                    }
                    className="w-full py-4 px-5 rounded-2xl border-2 border-stone-200 bg-white text-base focus:outline-none focus:border-[#7A002A]"
                    autoFocus
                  />
                )}
              </div>
            )}

            {campo.tipo === "plantilla" && (
              <div className="space-y-4">
                {plantillas.length === 0 && !plantillasError && (
                  <p className="text-stone-500">
                    {idioma === "es" ? "Cargando plantillas…" : "Loading templates…"}
                  </p>
                )}
                {plantillas.length === 0 && plantillasError && (
                  <div className="space-y-3">
                    <p className="text-stone-500">
                      {idioma === "es"
                        ? "No se pudieron cargar las plantillas. Puedes seguir y el equipo te ayudará a elegir."
                        : "Templates could not be loaded. You can continue and the team will help you choose."}
                    </p>
                    <button
                      onClick={() => irA(idx + 1)}
                      className="w-full py-4 px-5 rounded-2xl bg-[#7A002A] text-white font-semibold"
                    >
                      {idioma === "es" ? "Continuar sin elegir" : "Continue without choosing"}
                    </button>
                  </div>
                )}
                {plantillas.map((p) => (
                  <div
                    key={p.estilo}
                    className={`rounded-2xl border-2 overflow-hidden transition ${
                      valorActual === p.estilo
                        ? "border-[#7A002A] bg-[#FFF5F7]"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    {p.imagen && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imagen} alt={p.nombre} className="w-full object-cover max-h-56" />
                    )}
                    <div className="p-4 space-y-3">
                      <p className="font-bold text-lg">{p.nombre}</p>
                      <div className="flex gap-2">
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center py-3 px-4 rounded-xl border-2 border-stone-200 font-semibold bg-white"
                        >
                          {idioma === "es" ? "Ver demo" : "View demo"}
                        </a>
                        <button
                          onClick={() => seleccionarOpcion(p.estilo)}
                          className="flex-1 py-3 px-4 rounded-xl bg-[#7A002A] text-white font-semibold"
                        >
                          {valorActual === p.estilo
                            ? idioma === "es"
                              ? "Elegida ✓"
                              : "Chosen ✓"
                            : idioma === "es"
                              ? "Elegir esta plantilla"
                              : "Choose this template"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {campo.tipo === "foto" && (
              <div className="space-y-3">
                {valorActual && (
                  <img
                    src={valorActual}
                    alt=""
                    className="w-full rounded-2xl border border-stone-200 object-cover max-h-72"
                  />
                )}
                <label className="block w-full text-center py-4 rounded-2xl bg-white border-2 border-dashed border-stone-300 font-semibold cursor-pointer">
                  {subiendoFoto ? t.subiendoFoto : valorActual ? t.fotoSubida : t.subirFoto}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) subirFoto(f);
                    }}
                  />
                </label>
              </div>
            )}

            {(campo.tipo === "texto" ||
              campo.tipo === "telefono" ||
              campo.tipo === "email" ||
              campo.tipo === "url") && (
              <input
                type={
                  campo.tipo === "telefono"
                    ? "tel"
                    : campo.tipo === "email"
                      ? "email"
                      : campo.tipo === "url"
                        ? "url"
                        : "text"
                }
                value={valorActual}
                onChange={(e) => setValorActual(e.target.value)}
                className="w-full py-4 px-5 rounded-2xl border-2 border-stone-200 bg-white text-base focus:outline-none focus:border-[#7A002A]"
                autoFocus
              />
            )}

            {campo.tipo === "texto_largo" && (
              <textarea
                value={valorActual}
                onChange={(e) => setValorActual(e.target.value)}
                rows={5}
                className="w-full py-4 px-5 rounded-2xl border-2 border-stone-200 bg-white text-base focus:outline-none focus:border-[#7A002A]"
                autoFocus
              />
            )}

            {campo.tipo === "fecha" && (
              <input
                type="date"
                value={valorActual}
                onChange={(e) => setValorActual(e.target.value)}
                className="w-full py-4 px-5 rounded-2xl border-2 border-stone-200 bg-white text-base focus:outline-none focus:border-[#7A002A]"
              />
            )}

            {mensajeRequerida && <p className="text-sm font-semibold text-red-700">{t.requerida}</p>}
            {estadoGuardado === "error" && (
              <p className="text-sm font-semibold text-red-700">{t.errorGuardar}</p>
            )}
            {estadoGuardado === "guardando" && (
              <p className="text-sm text-stone-400">{t.guardando}</p>
            )}
            {estadoGuardado === "guardado" && (
              <p className="text-sm font-semibold text-emerald-600">{t.guardado}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => irA(idx - 1)}
                className="flex-1 py-3.5 rounded-2xl bg-white border border-stone-200 font-semibold"
              >
                {t.anterior}
              </button>
              {campo.tipo !== "opcion" &&
                !(campo.tipo === "opcion_otro" && !otroActivo) && (
                <button
                  onClick={continuar}
                  className="flex-[2] py-3.5 rounded-2xl bg-[#7A002A] text-white font-bold"
                >
                  {t.continuar}
                </button>
              )}
            </div>
            {!esDemo && (
              <button
                onClick={guardarYSalir}
                className="w-full text-center text-sm font-semibold text-stone-500 underline underline-offset-2"
              >
                {t.guardarSalir}
              </button>
            )}
            {avisoGuardadoSalir && (
              <p className="text-center text-sm font-semibold text-emerald-600">{t.guardado}</p>
            )}
          </div>
        )}

        {vista === "revisar" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{t.revisar}</h1>
              <p className="text-stone-500 mt-1">{t.revisarSub}</p>
              {(() => {
                const faltantes = campos.filter((c) => !(respuestas[c.id] || "").trim());
                const faltanOblig = faltantes.filter((c) => c.requerido);
                const faltanOpc = faltantes.filter((c) => !c.requerido);
                const respondidas = campos.length - faltantes.length;
                return (
                  <div className="mt-3 rounded-2xl bg-white border border-stone-200 p-4 text-sm space-y-1">
                    <p className="font-semibold">
                      {idioma === "es"
                        ? `Respondiste ${respondidas} de ${campos.length}.`
                        : `You answered ${respondidas} of ${campos.length}.`}
                    </p>
                    {faltanOblig.length > 0 && (
                      <p className="text-red-700 font-semibold">
                        {idioma === "es"
                          ? `Te falta ${faltanOblig.length === 1 ? "esta obligatoria" : "estas obligatorias"}: ${faltanOblig.map((c) => c.pregunta).join(", ")}. Toca Editar en esa fila para responderla.`
                          : `You still need ${faltanOblig.length === 1 ? "this required one" : "these required ones"}: ${faltanOblig.map((c) => c.preguntaEn).join(", ")}. Tap Edit on that row to answer it.`}
                      </p>
                    )}
                    {faltanOpc.length > 0 && (
                      <p className="text-stone-500">
                        {idioma === "es"
                          ? `Las ${faltanOpc.length} restantes son opcionales: puedes enviar así sin ellas.`
                          : `The other ${faltanOpc.length} are optional: you can send without them.`}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
            {DATOS_SECCIONES.map((sec) => (
              <div key={sec.id} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
                <p className="font-bold">{idioma === "es" ? sec.titulo : sec.tituloEn}</p>
                {sec.campos.filter((c) => campoVisible(c, respuestas)).map((c) => {
                  const v = respuestas[c.id] || "";
                  const globalIdx = campos.findIndex((f) => f.id === c.id);
                  return (
                    <div key={c.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="text-stone-400">{idioma === "es" ? c.pregunta : c.preguntaEn}</p>
                        {c.tipo === "foto" && v ? (
                          <img src={v} alt="" className="w-24 h-24 object-cover rounded-xl mt-1" />
                        ) : v ? (
                          <p className="font-semibold break-words">
                            {c.id === "plantillaElegida"
                              ? plantillas.find((p) => p.estilo === v)?.nombre || v
                              : v}
                          </p>
                        ) : (
                          <p className={c.requerido ? "font-semibold text-red-700" : "italic text-stone-400"}>
                            {t.sinRespuesta}
                            {c.requerido
                              ? idioma === "es"
                                ? " (obligatoria)"
                                : " (required)"
                              : idioma === "es"
                                ? " (opcional)"
                                : " (optional)"}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setIdx(globalIdx);
                          setVista("pregunta");
                        }}
                        className="shrink-0 text-[#7A002A] font-semibold"
                      >
                        {t.editar}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
            {estadoGuardado === "error" && (
              <p className="text-sm font-semibold text-red-700">{t.errorGuardar}</p>
            )}
            <button
              onClick={completar}
              disabled={estadoGuardado === "guardando"}
              className="w-full py-4 rounded-2xl bg-[#7A002A] text-white font-bold disabled:opacity-60"
            >
              {estadoGuardado === "guardando" ? t.enviando : t.terminar}
            </button>
            <button
              onClick={() => irA(0)}
              className="w-full text-center text-sm font-semibold text-stone-500 underline underline-offset-2"
            >
              {t.anterior}
            </button>
          </div>
        )}

        {vista === "exito" && (
          <div className="space-y-4 text-center pt-10">
            <p className="text-5xl">💌</p>
            <h1 className="text-2xl font-bold">{t.exitoTitulo}</h1>
            <p className="text-stone-600">{completado ? t.exitoSub : t.yaCompletado}</p>
            {esDemo && (
              <p className="text-sm font-semibold text-amber-800">
                {idioma === "es"
                  ? "Vista previa: en el link real aquí se marca el formulario como completado. Aquí no se guardó nada."
                  : "Preview: on the real link this marks the form as completed. Nothing was saved here."}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
