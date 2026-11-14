"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Heart,
  Sparkles,
  MapPin,
  CheckCircle2,
  CalendarPlus,
  Music,
  Volume2,
  VolumeX,
  Share2,
  Users,
  Send,
  Loader2,
  ChevronDown,
} from "lucide-react";
import confetti from "canvas-confetti";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar-generator";

export interface SaveTheDateProps {
  data: {
    slug: string;
    titulo: string;
    subtitulo?: string | null;
    mensaje?: string | null;
    fechaEvento: string | Date;
    fechaTextoPersonalizada?: string | null;
    ciudad?: string | null;
    colorSobre?: string | null;
    colorSello?: string | null;
    fotoPortadaUrl: string;
    galeriaFotosUrls: string[];
    musicaUrl?: string | null;
    musicaTitulo?: string | null;
    mostrarSobre: boolean;
    mostrarGaleria: boolean;
    mostrarContador: boolean;
    mostrarCalendario: boolean;
    mostrarPreRsvp: boolean;
    textoPreRsvp?: string | null;
    telefonoWhatsapp?: string | null;
  };
  skipIntro?: boolean;
}

export default function QuinceRosadoSaveTheDate({ data, skipIntro = false }: SaveTheDateProps) {
  // Estado del sobre
  const [sobreAbierto, setSobreAbierto] = useState(skipIntro || !data.mostrarSobre);
  const [animandoSobre, setAnimandoSobre] = useState(false);

  // Música
  const [reproduciendo, setReproduciendo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cuenta regresiva
  const fechaObj = new Date(data.fechaEvento);
  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  // Formulario Pre-RSVP
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [respuesta, setRespuesta] = useState<"SI" | "TAL_VEZ" | "NO">("SI");
  const [pases, setPases] = useState(1);
  const [notas, setNotas] = useState("");
  const [enviandoRsvp, setEnviandoRsvp] = useState(false);
  const [rsvpCompletado, setRsvpCompletado] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  // Actualizar cuenta regresiva en tiempo real
  useEffect(() => {
    const calcular = () => {
      const ahora = new Date().getTime();
      const diff = fechaObj.getTime() - ahora;

      if (diff <= 0) {
        setTiempo({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }

      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diff % (1000 * 60)) / 1000);

      setTiempo({ dias, horas, minutos, segundos });
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [fechaObj]);

  // Manejar audio
  const toggleMusica = () => {
    if (!audioRef.current) return;
    if (reproduciendo) {
      audioRef.current.pause();
      setReproduciendo(false);
    } else {
      audioRef.current.play().then(() => setReproduciendo(true)).catch(() => {});
    }
  };

  const abrirSobre = () => {
    if (animandoSobre) return;
    setAnimandoSobre(true);

    if (data.musicaUrl && audioRef.current) {
      audioRef.current.play().then(() => setReproduciendo(true)).catch(() => {});
    }

    setTimeout(() => {
      setSobreAbierto(true);
      setAnimandoSobre(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#7A002A", "#E8A598", "#C5A059", "#FFFFFF"],
        });
      } catch {}
    }, 900);
  };

  // Enviar Pre-RSVP
  const handleEnviarPreRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setEnviandoRsvp(true);
    setRsvpError(null);

    try {
      const res = await fetch(`/api/save-the-date/${data.slug}/pre-rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefono,
          email,
          respuesta,
          pasesTentativos: pases,
          notas,
        }),
      });

      const resData = await res.json();
      if (!res.ok || resData.error) {
        throw new Error(resData.error || "No se pudo enviar la confirmación");
      }

      setRsvpCompletado(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7A002A", "#C5A059", "#25D366"],
        });
      } catch {}
    } catch (err: any) {
      setRsvpError(err.message || "Error al procesar la confirmación");
    } finally {
      setEnviandoRsvp(false);
    }
  };

  // Días y nombres del mes para el calendario
  const anio = fechaObj.getFullYear();
  const mesIdx = fechaObj.getMonth();
  const diaEvento = fechaObj.getDate();

  const mesesNombres = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  const nombreMes = mesesNombres[mesIdx];

  // Generar cuadrícula del calendario
  const primerDiaSemana = new Date(anio, mesIdx, 1).getDay(); // 0 = Domingo
  const diasEnMes = new Date(anio, mesIdx + 1, 0).getDate();
  const offsetDias = (primerDiaSemana + 6) % 7; // Ajustar a Lunes = 0

  const matrizDias: (number | null)[] = [];
  for (let i = 0; i < offsetDias; i++) matrizDias.push(null);
  for (let d = 1; d <= diasEnMes; d++) matrizDias.push(d);

  return (
    <div className="min-h-screen bg-[#FFF9FA] text-[#2C1F1B] font-sans antialiased relative overflow-x-hidden selection:bg-[#7A002A] selection:text-white pb-16">
      {/* Audio Element Oculto */}
      {data.musicaUrl && (
        <audio ref={audioRef} src={data.musicaUrl} preload="auto" loop />
      )}

      {/* Botón flotante de música */}
      {data.musicaUrl && sobreAbierto && (
        <button
          onClick={toggleMusica}
          className="fixed top-4 right-4 z-40 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-pink-200 text-[#7A002A] hover:scale-105 transition cursor-pointer"
          title={reproduciendo ? "Pausar música" : "Reproducir música"}
        >
          {reproduciendo ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-stone-400" />
          )}
        </button>
      )}

      {/* ============================================================== */}
      {/* 1. SOBRE INTERACTIVO 3D CON APERTURA */}
      {/* ============================================================== */}
      {!sobreAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#2A0815]/95 via-[#3D0A1C]/95 to-[#1F040E]/95 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
            <div className="space-y-1.5 text-white">
              <span className="text-[11px] uppercase tracking-widest text-amber-200 font-bold block">
                {data.subtitulo || "Save Our Date"}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-pink-50">
                {data.titulo}
              </h1>
              <p className="text-xs text-pink-200/80">
                Tienes una invitación especial previa por abrir
              </p>
            </div>

            {/* Ilustración de Sobre 3D Elegante */}
            <div
              onClick={abrirSobre}
              className={`relative w-72 h-48 rounded-2xl shadow-2xl cursor-pointer group transition-all duration-700 transform ${
                animandoSobre ? "-translate-y-6 scale-95 opacity-0" : "hover:scale-102"
              }`}
              style={{
                backgroundColor: data.colorSobre || "#FCECEE",
                border: "2px solid rgba(255,255,255,0.8)",
              }}
            >
              {/* Solapa superior triangular */}
              <div
                className={`absolute top-0 left-0 right-0 h-24 origin-top transition-transform duration-700 rounded-t-2xl flex items-center justify-center ${
                  animandoSobre ? "-rotate-x-180" : ""
                }`}
                style={{
                  background: "linear-gradient(180deg, #FADCE0 0%, #F5C6CE 100%)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />

              {/* Sello de cera dorado central con corona / corazón */}
              <div
                className="absolute top-16 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white font-serif font-bold text-lg border-2 border-amber-300 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: data.colorSello || "#C5A059",
                  boxShadow: "0 4px 15px rgba(197, 160, 89, 0.5)",
                }}
              >
                <Sparkles className="w-6 h-6 text-amber-100" />
              </div>

              {/* Destello de lazo decorativo */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A002A] bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs">
                  Toca para abrir 💌
                </span>
              </div>
            </div>

            <p className="text-[11px] text-pink-200/60 italic">
              Pulsa sobre el sobre para revelar la fecha
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CUERPO PRINCIPAL DEL SAVE THE DATE */}
      {/* ============================================================== */}
      <main className="max-w-md mx-auto px-4 pt-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* ============================================================== */}
        {/* 2. PORTADA & HERO DE LA FESTEJADA */}
        {/* ============================================================== */}
        <section className="bg-white rounded-[32px] p-5 shadow-sm border border-pink-100 text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A059] block">
              — {data.subtitulo || "Save Our Date"} —
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7A002A] leading-tight">
              {data.titulo}
            </h1>
          </div>

          {/* Fotografía Protagonista Vertical en Marco Arco */}
          <div className="relative mx-auto w-full aspect-[9/13] max-w-[320px] rounded-t-full rounded-b-3xl overflow-hidden shadow-md border-4 border-white ring-1 ring-pink-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.fotoPortadaUrl}
              alt={data.titulo}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute bottom-3 left-3 right-3 text-white text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-200 drop-shadow">
                {data.fechaTextoPersonalizada || "Fecha muy pronto"}
              </span>
            </div>
          </div>

          {/* Frase Introductoria */}
          {data.mensaje && (
            <p className="text-xs text-stone-600 italic px-3 leading-relaxed">
              &quot;{data.mensaje}&quot;
            </p>
          )}

          {data.ciudad && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-xs font-semibold text-[#7A002A]">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{data.ciudad}</span>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* 3. GALERÍA DE FOTOS VERTICAL */}
        {/* ============================================================== */}
        {data.mostrarGaleria && data.galeriaFotosUrls && data.galeriaFotosUrls.length > 0 && (
          <section className="space-y-3">
            <div className="text-center space-y-0.5">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                Sesión Especial
              </span>
              <h2 className="font-serif text-xl font-bold text-[#7A002A]">
                Momentos Inolvidables
              </h2>
            </div>

            <div className="space-y-4">
              {data.galeriaFotosUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden shadow-xs border-2 border-white aspect-[9/13] bg-stone-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 4. CUENTA REGRESIVA + CALENDARIO INTERACTIVO */}
        {/* ============================================================== */}
        {data.mostrarContador && (
          <section className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-100 text-center space-y-5">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                Faltan Sólo
              </span>
              <h2 className="font-serif text-xl font-bold text-[#7A002A]">
                Cuenta Regresiva
              </h2>
            </div>

            {/* Reloj Digital Cuadrícula */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: tiempo.dias, label: "DÍAS" },
                { val: tiempo.horas, label: "HORAS" },
                { val: tiempo.minutos, label: "MIN" },
                { val: tiempo.segundos, label: "SEG" },
              ].map((box, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-gradient-to-b from-[#FFF5F7] to-[#FDE8EC] border border-pink-200/80 shadow-2xs"
                >
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#7A002A] block leading-none">
                    {box.val}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 mt-1 block">
                    {box.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Cuadrícula del Calendario del Mes */}
            {data.mostrarCalendario && (
              <div className="pt-4 border-t border-pink-100 space-y-3">
                <div className="flex items-center justify-between px-2">
                  <span className="font-serif font-bold text-sm text-[#7A002A]">
                    {nombreMes} {anio}
                  </span>
                  <span className="text-[11px] font-semibold text-[#C5A059] flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>Día {diaEvento}</span>
                  </span>
                </div>

                <div className="bg-[#FFF9FA] p-3 rounded-2xl border border-pink-100">
                  {/* Encabezado Días Semana */}
                  <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-stone-400 uppercase text-center mb-1">
                    <span>L</span>
                    <span>M</span>
                    <span>M</span>
                    <span>J</span>
                    <span>V</span>
                    <span>S</span>
                    <span>D</span>
                  </div>

                  {/* Días */}
                  <div className="grid grid-cols-7 gap-1 text-xs text-center font-medium">
                    {matrizDias.map((d, idx) => {
                      if (d === null) return <div key={idx} className="h-7" />;
                      const esElDia = d === diaEvento;

                      return (
                        <div
                          key={idx}
                          className={`h-7 rounded-lg flex items-center justify-center transition ${
                            esElDia
                              ? "bg-[#7A002A] text-white font-bold shadow-xs scale-110 ring-2 ring-amber-300"
                              : "text-stone-700 hover:bg-pink-100/50"
                          }`}
                        >
                          {d}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botones Agregar a Calendario */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href={generateGoogleCalendarUrl({
                      titulo: data.titulo,
                      descripcion: data.mensaje || `Save The Date para ${data.titulo}`,
                      ciudad: data.ciudad || undefined,
                      fechaInicio: fechaObj,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#7A002A] text-xs font-bold transition flex items-center justify-center gap-1.5 border border-pink-200 shadow-2xs"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      downloadIcsFile({
                        titulo: data.titulo,
                        descripcion: data.mensaje || `Save The Date para ${data.titulo}`,
                        ciudad: data.ciudad || undefined,
                        fechaInicio: fechaObj,
                      })
                    }
                    className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Apple / iCal (.ics)</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* 5. PRE-RSVP / CONFIRMACIÓN CONECTADA */}
        {/* ============================================================== */}
        {data.mostrarPreRsvp && (
          <section className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-100 space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block">
                Pre-Confirmación
              </span>
              <h2 className="font-serif text-xl font-bold text-[#7A002A]">
                {data.textoPreRsvp || "¿Crees que podrás acompañarnos?"}
              </h2>
              <p className="text-xs text-stone-500">
                Tu respuesta tentativa nos ayuda a planear los detalles preliminares con el salón.
              </p>
            </div>

            {rsvpCompletado ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">
                  ¡Muchas gracias por confirmar, {nombre}!
                </h4>
                <p className="text-xs text-emerald-700">
                  Hemos registrado tu respuesta. Te enviaremos la invitación oficial con todos los detalles cuando esté lista.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnviarPreRsvp} className="space-y-4 text-xs">
                {rsvpError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-medium">
                    {rsvpError}
                  </div>
                )}

                {/* Selector de Respuesta */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "SI", label: "¡Sí, asistiré!", icon: "🎉" },
                    { id: "TAL_VEZ", label: "Tal vez", icon: "🤔" },
                    { id: "NO", label: "No podré", icon: "💔" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setRespuesta(btn.id as any)}
                      className={`p-2.5 rounded-2xl border text-center font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                        respuesta === btn.id
                          ? "bg-[#7A002A] text-white border-[#7A002A] shadow-xs"
                          : "bg-[#FFF9FA] text-stone-700 border-pink-200 hover:bg-pink-100/50"
                      }`}
                    >
                      <span className="text-sm">{btn.icon}</span>
                      <span className="text-[11px]">{btn.label}</span>
                    </button>
                  ))}
                </div>

                {/* Campos de Contacto */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Tu Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Familia Rodríguez"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:outline-none focus:border-[#7A002A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="(818) 123-4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:outline-none focus:border-[#7A002A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                        Pases Tentativos
                      </label>
                      <select
                        value={pases}
                        onChange={(e) => setPases(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 font-semibold"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Pase" : "Pases"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Mensaje o Buenos Deseos (Opcional)
                    </label>
                    <input
                      type="text"
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      placeholder="¡Estamos muy emocionados por acompañarte!"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:outline-none focus:border-[#7A002A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={enviandoRsvp || !nombre.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-[#7A002A] hover:bg-[#5e0020] text-white font-bold transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {enviandoRsvp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando confirmación...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Pre-Confirmación</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </section>
        )}

        {/* Footer Click and Love */}
        <footer className="text-center space-y-1 text-stone-400 text-[11px] pt-4">
          <p className="flex items-center justify-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3 h-3 text-pink-400 fill-current" />
            <span>en Click and Love</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
