"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Sparkles,
  Calendar,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  Heart,
} from "lucide-react";

interface OrderInfo {
  id: string;
  stripeSessionId: string;
  montoTotal: number;
  moneda: string;
  paqueteId: string;
  paqueteNombre: string;
  estadoPago: string;
  nombreCliente?: string | null;
  emailCliente: string;
  telefonoCliente?: string | null;
  tipoEvento?: string | null;
  fechaEvento?: string | null;
  plantillaDeseada?: string | null;
  comentarios?: string | null;
  onboardingCompletado: boolean;
}

const PLANTILLAS_OPCIONES = [
  {
    id: "QUINCE_ROSADO",
    titulo: "Quince Rosado",
    subtitulo: "Rosas, moño satinado y fotos estilo Canva",
    tag: "Más Popular",
  },
  {
    id: "PRINCESA_ROSA",
    titulo: "Princesa Rosa",
    subtitulo: "Castillo clásico, destellos de oro y elegancia",
    tag: "Clásica",
  },
  {
    id: "ELEGANT_ROSE",
    titulo: "Elegant Rose",
    subtitulo: "Bilingüe, video embed y línea de tiempo",
    tag: "Bilingüe",
  },
  {
    id: "FAIRYTALE_CHATEAU",
    titulo: "Fairytale Château",
    subtitulo: "Bodas de gala, itinerario y suites de hotel",
    tag: "Bodas",
  },
  {
    id: "BLUE_BUTTERFLY",
    titulo: "Blue Butterfly",
    subtitulo: "Mariposas celestiales y jardín mágico",
    tag: "Fantasía",
  },
  {
    id: "CORALINE_MYSTICAL",
    titulo: "Coraline Mystical",
    subtitulo: "Puerta secreta, llaves y temática de botones",
    tag: "Temática",
  },
];

function GraciasContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isPreview = searchParams.get("preview") === "true";

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaEvento, setFechaEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("QUINCEANERA");
  const [plantillaDeseada, setPlantillaDeseada] = useState("QUINCE_ROSADO");
  const [comentarios, setComentarios] = useState("");

  useEffect(() => {
    // Confeti de celebración
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C5A059", "#EED3A1", "#2C1F1B", "#C2847A"],
      });
    } catch (e) {
      // Ignorar si falla
    }

    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          setNombre(data.order.nombreCliente || "");
          setEmail(data.order.emailCliente || "");
          setTelefono(data.order.telefonoCliente || "");
          if (data.order.tipoEvento) setTipoEvento(data.order.tipoEvento);
          if (data.order.fechaEvento) {
            setFechaEvento(data.order.fechaEvento.split("T")[0]);
          }
          if (data.order.plantillaDeseada) setPlantillaDeseada(data.order.plantillaDeseada);
          if (data.order.comentarios) setComentarios(data.order.comentarios);
          if (data.order.onboardingCompletado) {
            setSubmitted(true);
          }
        }
      })
      .catch((err) => console.error("Error verificando sesión:", err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          nombreCliente: nombre,
          emailCliente: email,
          telefonoCliente: telefono,
          tipoEvento,
          fechaEvento,
          plantillaDeseada,
          comentarios,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#25D366", "#C5A059", "#FFFFFF"],
        });
      }
    } catch (err) {
      console.error("Error al guardar onboarding:", err);
      alert("Hubo un problema al guardar los detalles. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-w-screen min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin mb-4" />
        <h2 className="font-['Cinzel'] text-xl font-bold text-[#2C1F1B]">Verificando tu compra...</h2>
        <p className="font-['Montserrat'] text-xs text-[#5E534C] mt-2">Un momento mientras confirmamos tu reserva en Click and love.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1F1B] py-12 px-4 selection:bg-[#C5A059] selection:text-white">
      {/* Fondo decorativo de lujo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* ENCABEZADO DE AGRADECIMIENTO */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E3FCEF] border-2 border-[#00875A] text-[#00875A] mb-4 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A059]/40 bg-[#F5EFE4] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase text-[#2C1F1B] font-bold">
              {isPreview ? "Modo Demo • Pago Confirmado" : "Pago Confirmado con Éxito"}
            </span>
          </div>

          <h1 className="font-['Cinzel'] text-3xl sm:text-5xl font-bold tracking-tight text-[#2C1F1B]">
            ¡Felicidades y Bienvenidos!
          </h1>
          <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] mt-3 max-w-lg mx-auto leading-relaxed">
            Tu paquete <strong className="text-[#C5A059]">{order?.paqueteNombre || "Click and love VIP"}</strong> ha sido reservado. Ahora personalizaremos tu experiencia.
          </p>
        </div>

        {/* TARJETA DE RESUMEN DEL PEDIDO */}
        {order && (
          <div className="bg-white border border-[#E8E3D9] rounded-2xl p-5 mb-8 shadow-[0_5px_20px_rgba(44,31,27,0.04)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-['Cinzel'] uppercase tracking-wider text-[#8C8077] font-semibold">
                Orden #{order.id.slice(-6).toUpperCase()}
              </div>
              <div className="font-['Cinzel'] text-lg font-bold text-[#2C1F1B]">
                {order.paqueteNombre}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[10px] font-['Montserrat'] uppercase text-[#8C8077]">Monto Total</div>
                <div className="font-['Cinzel'] text-xl font-bold text-[#C5A059]">
                  ${order.montoTotal.toFixed(2)} {order.moneda.toUpperCase()}
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3FCEF] text-[#006644] text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Pagado
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN SI YA SE COMPLETÓ EL ONBOARDING */}
        {submitted ? (
          <div className="bg-white border-2 border-[#C5A059] rounded-3xl p-8 sm:p-10 text-center shadow-[0_15px_40px_rgba(197,160,89,0.15)]">
            <div className="w-14 h-14 rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 fill-[#C5A059]" />
            </div>
            <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#2C1F1B]">
              ¡Datos Recibidos con Éxito!
            </h2>
            <p className="font-['Montserrat'] text-xs sm:text-sm text-[#5E534C] mt-3 max-w-md mx-auto leading-relaxed">
              Hemos registrado los detalles de tu evento. Te hemos enviado un correo oficial de confirmación. Nuestro equipo de diseño te contactará muy pronto por WhatsApp para comenzar a recibir tus fotos y preparar tu diseño.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/18181234567?text=${encodeURIComponent(
                  `Hola Click and love! Ya completé los datos de mi orden #${order?.id?.slice(-6)?.toUpperCase() || ""}. Estoy listo/a para coordinar mi invitación.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-['Montserrat'] text-xs font-bold uppercase tracking-wider hover:bg-[#1EBE5D] transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Contactar por WhatsApp Ahora
              </a>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#2C1F1B] text-[#2C1F1B] font-['Cinzel'] text-xs font-bold uppercase tracking-wider hover:bg-[#F5EFE4] transition"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        ) : (
          /* FORMULARIO DE ONBOARDING RÁPIDO (CERO FRICCIÓN) */
          <div className="bg-white border border-[#E8E3D9] rounded-3xl p-6 sm:p-10 shadow-[0_10px_35px_rgba(44,31,27,0.05)]">
            <div className="border-b border-[#E8E3D9] pb-6 mb-8">
              <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#2C1F1B]">
                Paso Final: Datos Básicos de tu Evento
              </h2>
              <p className="font-['Montserrat'] text-xs text-[#5E534C] mt-1.5 leading-relaxed">
                Completa estos datos en menos de un minuto. <strong>No te preocupes por fotos o textos largos ahora</strong>: los afinaremos contigo por WhatsApp de forma relajada y personalizada.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Nombre del Anfitrión / Festejada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-['Cinzel'] text-xs uppercase tracking-wider font-bold text-[#2C1F1B] mb-2">
                    Nombre del Festejado(a) o Pareja *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Isabella o Emma & Lucas"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E3D9] bg-[#FAF8F5] text-xs font-['Montserrat'] text-[#2C1F1B] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-['Cinzel'] text-xs uppercase tracking-wider font-bold text-[#2C1F1B] mb-2">
                    Teléfono WhatsApp (Para coordinar) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. +1 818 123 4567 o 55 1234 5678"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E3D9] bg-[#FAF8F5] text-xs font-['Montserrat'] text-[#2C1F1B] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* 2. Email */}
              <div>
                <label className="block font-['Cinzel'] text-xs uppercase tracking-wider font-bold text-[#2C1F1B] mb-2">
                  Correo Electrónico (Para recibo y accesos) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E3D9] bg-[#FAF8F5] text-xs font-['Montserrat'] text-[#2C1F1B] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                />
              </div>

              {/* 3. Tipo de Evento & Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-['Cinzel'] text-xs uppercase tracking-wider font-bold text-[#2C1F1B] mb-2">
                    Tipo de Evento *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "QUINCEANERA", label: "XV Años" },
                      { id: "BODA", label: "Boda" },
                      { id: "CUMPLEANOS", label: "Otro" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTipoEvento(t.id)}
                        className={`py-2.5 px-3 rounded-xl border text-[11px] font-['Cinzel'] font-bold transition text-center ${
                          tipoEvento === t.id
                            ? "bg-[#2C1F1B] text-[#EED3A1] border-[#2C1F1B]"
                            : "bg-[#FAF8F5] text-[#5E534C] border-[#E8E3D9] hover:bg-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-['Cinzel'] text-xs uppercase tracking-wider font-bold text-[#2C1F1B] mb-2">
                    Fecha del Evento (Aprox. o Definitiva) *
                  </label>
                  <input
                    type="date"
                    required
                    value={fechaEvento}
                    onChange={(e) => setFechaEvento(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D9] bg-[#FAF8F5] text-xs font-['Montserrat'] text-[#2C1F1B] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* 4. Selector Visual de Plantilla Deseada */}
              <div>
                <label className="block font-['Cinzel'] text-xs uppercase tracking-wider font-bold text-[#2C1F1B] mb-2">
                  ¿Qué estilo de tarjeta te gustó más? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PLANTILLAS_OPCIONES.map((p) => {
                    const isSelected = plantillaDeseada === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPlantillaDeseada(p.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#FAF8F5] border-2 border-[#C5A059] shadow-sm"
                            : "bg-white border-[#E8E3D9] hover:border-[#C5A059]/40 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-['Cinzel'] text-xs font-bold text-[#2C1F1B]">
                            {p.titulo}
                          </span>
                          <span className="text-[9px] uppercase font-['Montserrat'] px-2 py-0.5 rounded-full bg-[#F5EFE4] text-[#C5A059] font-semibold">
                            {p.tag}
                          </span>
                        </div>
                        <p className="text-[10px] font-['Montserrat'] text-[#5E534C] leading-snug">
                          {p.subtitulo}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Comentarios o Notas */}
              <div>
                <label className="block font-['Cinzel'] text-xs uppercase tracking-wider font-bold text-[#2C1F1B] mb-2">
                  Comentarios o Ideas Especiales (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  placeholder="Ej. Colores favoritos (rosa pastel y plata), si tienen temática especial, o si aún están por definir salón..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E3D9] bg-[#FAF8F5] text-xs font-['Montserrat'] text-[#2C1F1B] focus:outline-none focus:border-[#C5A059] focus:bg-white transition leading-relaxed"
                />
              </div>

              {/* Botón de Envío */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#2C1F1B] to-[#4A352F] hover:from-[#1F1512] hover:to-[#382621] text-[#EED3A1] font-['Cinzel'] text-xs uppercase tracking-[0.25em] font-bold shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#EED3A1]" />
                    <span>Guardando y Notificando al Diseñador...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar y Enviar Detalles</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* MENSAJE DE CONFIANZA Y GARANTÍA */}
        <div className="mt-8 text-center text-[11px] font-['Montserrat'] text-[#8C8077] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Garantía de satisfacción Click and love • Acompañamiento VIP por WhatsApp durante todo el diseño</span>
        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-w-screen min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
        </div>
      }
    >
      <GraciasContent />
    </Suspense>
  );
}
