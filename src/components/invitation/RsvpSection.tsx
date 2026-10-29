"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, XCircle, Phone } from "lucide-react";
import { TemplateConfig } from "@/lib/templates";
import { generateWhatsAppRsvpUrl } from "@/lib/whatsapp";
import { formatFechaLimiteRsvp } from "@/lib/fecha-limite";

interface RsvpSectionProps {
  eventoId?: string;
  eventoTitulo: string;
  telefonoWhatsapp: string;
  // CONVENCIÓN: maxPases === 0 significa SIN LÍMITE (selector numérico libre,
  // tope de sanidad 200). Nunca aplicar `|| N` antes de pasar este valor.
  maxPases: number;
  fechaLimite?: string | null;
  template: TemplateConfig;
  // Hallazgo 11: respeta el toggle "permitir confirmación por teléfono" del evento
  permitirConfirmacionTelefono?: boolean;
  // Idioma del formulario (la vista genérica lo pasa; Coraline/Fairytale no, y quedan en inglés)
  isEn?: boolean;
  // Variante cuento de hadas (solo Beauty Quince): tarjeta pergamino con
  // borde dorado, copa focal arriba y rosa lateral. Sin royal, el estilo
  // original queda intacto para el resto de plantillas.
  royal?: boolean;
  gobletImage?: string;
  roseImage?: string;
}

export default function RsvpSection({
  eventoId,
  eventoTitulo,
  telefonoWhatsapp,
  maxPases,
  fechaLimite,
  template,
  permitirConfirmacionTelefono = true,
  isEn = true,
  royal = false,
  gobletImage,
  roseImage,
}: RsvpSectionProps) {
  // La fecha límite puede llegar como ISO (guardado nuevo): se muestra legible, nunca cruda.
  const fechaLimiteLegible = formatFechaLimiteRsvp(fechaLimite, isEn ? "en" : "es");
  const [nombre, setNombre] = useState("");
  const [asistencia, setAsistencia] = useState<"SI" | "NO">("SI");
  const [pases, setPases] = useState(1);
  const [acompanantes, setAcompanantes] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSubmitting(true);

    // Lanzar confeti si confirma asistencia
    if (asistencia === "SI") {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: [template.accentColor, "#FCECEE", "#FFFFFF", "#E5C158"],
        });
      } catch (err) {}
    }

    // Registro opcional en backend
    if (eventoId) {
      try {
        fetch("/api/rsvp/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventoId,
            nombreInvitado: nombre,
            asistira: asistencia === "SI",
            pases: asistencia === "SI" ? pases : 0,
            acompanantes,
          }),
        }).catch(() => {});
      } catch {}
    }

    // Generar enlace directo de WhatsApp
    const whatsappUrl = generateWhatsAppRsvpUrl({
      telefono: telefonoWhatsapp,
      eventoTitulo,
      nombreInvitado: nombre,
      asistencia,
      pases,
      acompanantes,
      comentarios,
    });

    // Abrir WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsSubmitting(false);
    }, 400);
  };

  const sinLimitePases = maxPases === 0;
  const pasesOptions = Array.from({ length: Math.min(Math.max(maxPases, 1), 10) }, (_, i) => i + 1);

  const royalInput = royal
    ? { backgroundColor: "#fffdf9", borderColor: "rgba(212,175,55,0.4)" }
    : { backgroundColor: template.bgColor, borderColor: template.borderSoft };
  const royalLabel: React.CSSProperties = royal
    ? { color: "#64748b", fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.15em", fontWeight: 700 }
    : { color: "#7A6E70" };

  return (
    <section
      id="rsvp"
      className={royal ? "relative flex justify-center items-center w-full max-w-[430px] mx-auto" : "px-4 py-8"}
      style={royal ? { padding: "60px 16px 40px", boxSizing: "border-box", backgroundColor: "#faf5ea" } : undefined}
    >
      <div className={royal ? "relative w-full" : undefined} style={royal ? { position: "relative", width: "100%" } : undefined}>
      {royal && gobletImage && (
        <div style={{ position: "absolute", top: "-45px", left: "50%", transform: "translateX(-50%)", width: "90px", height: "auto", zIndex: 4 }}>
          <img src={gobletImage} alt="Copa de Honor Quinceañera" className="w-full h-auto block bg-transparent" style={{ background: "transparent", filter: "drop-shadow(0 10px 16px rgba(11,23,54,0.3))" }} />
        </div>
      )}
      {royal && roseImage && (
        <img src={roseImage} alt="Rosa dorada" className="bg-transparent" style={{ position: "absolute", right: "-15px", bottom: "-20px", width: "110px", height: "auto", zIndex: 3, pointerEvents: "none", background: "transparent", transform: "rotate(18deg)", filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35))" }} />
      )}
      <div
        className={royal ? "text-center" : "p-6 rounded-3xl border shadow-sm text-center"}
        style={
          royal
            ? {
                position: "relative",
                zIndex: 2,
                width: "100%",
                background: "radial-gradient(circle at center, #ffffff 0%, #fbf8f2 100%)",
                border: "1.5px solid rgba(212,175,55,0.45)",
                borderRadius: "24px",
                padding: "65px 22px 30px",
                boxShadow: "0 12px 35px rgba(11,23,54,0.12), inset 0 0 25px rgba(212,175,55,0.12)",
                boxSizing: "border-box",
              }
            : {
                backgroundColor: template.cardBg,
                borderColor: "#FADCE0",
              }
        }
      >
        {royal ? (
          <div className="text-center" style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "'Alex Brush', cursive", fontSize: "2.7rem", color: "#a81c1c", lineHeight: 0.9, margin: 0 }}>
              {isEn ? "Will You Be Part" : "¿Serás Parte"}
            </h3>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", letterSpacing: "0.25em", fontWeight: 700, color: "#0b1736", margin: "6px 0 8px" }}>
              {isEn ? "OF MY SPECIAL DAY?" : "DE MI DÍA ESPECIAL?"}
            </h4>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "0.85rem", color: "#555", margin: "0 0 6px" }}>
              {isEn ? "Save Your Seat for the Celebration!" : "¡Aparta tu lugar para la celebración!"}
            </p>
            {fechaLimiteLegible && (
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.08em", color: "#a81c1c", fontWeight: 600, margin: 0 }}>
                {isEn ? "Please confirm your seat before" : "Por favor confirma tu lugar antes del"} {fechaLimiteLegible}
              </p>
            )}
          </div>
        ) : (
          <>
            <span className="text-2xl">💌</span>
            <h3
              className="text-xs sm:text-sm uppercase tracking-widest font-bold mt-2"
              style={{
                color: "#9E2A4B",
                fontFamily: template.fontSubheading,
              }}
            >
              {isEn ? "WILL YOU BE PART OF My Special Day?" : "¿SERÁS PARTE DE Mi Día Especial?"}
            </h3>
            <p
              className="text-xs mt-1 mb-5 font-serif italic text-stone-600"
            >
              {isEn ? "Save Your Seat for the Celebration!" : "¡Aparta tu lugar para la celebración!"}
            </p>

            {fechaLimiteLegible && (
              <p
                className="text-[11px] mb-5 opacity-75 font-medium"
                style={{
                  color: template.textSecondary,
                  fontFamily: template.fontBody,
                }}
              >
                {isEn ? "Please confirm your seat before" : "Por favor confirma tu lugar antes del"}{" "}
                <span className="font-semibold text-[#9E2A4B]">{fechaLimiteLegible}</span>
              </p>
            )}
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left mt-2">
          {/* Full name * */}
          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={royalLabel}
            >
              {isEn ? "Full name *" : "Nombre completo *"}
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={isEn ? "e.g. John Doe / Familia Hernández" : "ej. Juan Pérez / Familia Hernández"}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 transition"
              style={{
                ...royalInput,
                borderRadius: royal ? "10px" : undefined,
                padding: royal ? "12px 14px" : undefined,
                fontSize: royal ? "0.85rem" : undefined,
                color: template.textPrimary,
              }}
            />
          </div>

          {/* Asistencia */}
          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={royalLabel}
            >
              {isEn ? "Will you attend?" : "¿Asistirás?"}
            </label>
            <div className={royal ? "flex gap-2.5" : "grid grid-cols-2 gap-2"}>
              <button
                type="button"
                onClick={() => setAsistencia("SI")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition ${
                  asistencia === "SI" ? "ring-2 font-semibold" : "opacity-75"
                }`}
                style={
                  royal
                    ? {
                        flex: 1,
                        padding: "12px 8px",
                        borderRadius: "10px",
                        border: "1px solid rgba(212,175,55,0.4)",
                        backgroundColor: asistencia === "SI" ? "#0b1736" : "#fffdf9",
                        borderColor: asistencia === "SI" ? "#d4af37" : "rgba(212,175,55,0.4)",
                        color: asistencia === "SI" ? "#ffffff" : "#475569",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                        boxShadow: asistencia === "SI" ? "0 4px 12px rgba(11,23,54,0.25)" : undefined,
                      }
                    : {
                        backgroundColor: asistencia === "SI" ? template.badgeBg : template.bgColor,
                        borderColor: asistencia === "SI" ? template.accentColor : template.borderSoft,
                        color: template.textPrimary,
                      }
                }
              >
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: royal ? (asistencia === "SI" ? "#d4af37" : "#10b981") : undefined }} />
                {isEn ? "Yes, with pleasure" : "Sí, con gusto"}
              </button>

              <button
                type="button"
                onClick={() => setAsistencia("NO")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition ${
                  asistencia === "NO" ? "ring-2 font-semibold" : "opacity-75"
                }`}
                style={
                  royal
                    ? {
                        flex: 1,
                        padding: "12px 8px",
                        borderRadius: "10px",
                        border: "1px solid rgba(212,175,55,0.4)",
                        backgroundColor: asistencia === "NO" ? "#0b1736" : "#fffdf9",
                        borderColor: asistencia === "NO" ? "#d4af37" : "rgba(212,175,55,0.4)",
                        color: asistencia === "NO" ? "#ffffff" : "#475569",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                        boxShadow: asistencia === "NO" ? "0 4px 12px rgba(11,23,54,0.25)" : undefined,
                      }
                    : {
                        backgroundColor: asistencia === "NO" ? template.badgeBg : template.bgColor,
                        borderColor: asistencia === "NO" ? template.accentColor : template.borderSoft,
                        color: template.textPrimary,
                      }
                }
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                {isEn ? "Regretfully decline" : "Lamentablemente no podré"}
              </button>
            </div>
          </div>

          {/* How many seats/guests will you bring? (1, 2, 3+) */}
          {asistencia === "SI" && (
            <>
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                  style={royalLabel}
                >
                  {isEn ? "How many seats/guests will you bring?" : "¿Cuántos lugares/invitados traerás?"}
                </label>
                {sinLimitePases ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={isEn ? "One less guest" : "Un invitado menos"}
                      onClick={() => setPases((p) => Math.max(1, p - 1))}
                      className="w-10 h-10 shrink-0 rounded-xl border text-base font-bold flex items-center justify-center"
                      style={{
                        ...royalInput,
                        color: template.textPrimary,
                      }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={pases}
                      onChange={(e) => {
                        const v = Math.floor(Number(e.target.value));
                        setPases(Number.isFinite(v) ? Math.min(200, Math.max(1, v)) : 1);
                      }}
                      className="w-full px-3.5 py-2.5 text-xs text-center rounded-xl border focus:outline-none"
                      style={{
                        ...royalInput,
                        color: template.textPrimary,
                      }}
                    />
                    <button
                      type="button"
                      aria-label={isEn ? "One more guest" : "Un invitado más"}
                      onClick={() => setPases((p) => Math.min(200, p + 1))}
                      className="w-10 h-10 shrink-0 rounded-xl border text-base font-bold flex items-center justify-center"
                      style={{
                        ...royalInput,
                        color: template.textPrimary,
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <select
                    value={pases}
                    onChange={(e) => setPases(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none"
                    style={{
                      ...royalInput,
                      borderRadius: royal ? "10px" : undefined,
                      padding: royal ? "12px 14px" : undefined,
                      fontSize: royal ? "0.85rem" : undefined,
                      color: template.textPrimary,
                    }}
                  >
                    {pasesOptions.map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? (isEn ? "Guest / Seat" : "Invitado / Lugar") : (isEn ? "Guests / Seats" : "Invitados / Lugares")}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* What are their names? */}
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                  style={royalLabel}
                >
                  {isEn ? "What are their names? (Companion names)" : "¿Cómo se llaman? (Nombres de acompañantes)"}
                </label>
                <textarea
                  rows={2}
                  value={acompanantes}
                  onChange={(e) => setAcompanantes(e.target.value)}
                  placeholder={isEn ? "e.g. Maria and Daniel" : "ej. María y Daniel"}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none resize-none"
                  style={{
                    ...royalInput,
                    borderRadius: royal ? "10px" : undefined,
                    padding: royal ? "12px 14px" : undefined,
                    fontSize: royal ? "0.85rem" : undefined,
                    color: template.textPrimary,
                  }}
                />
              </div>
            </>
          )}

          {/* Botón Submit RSVP via WhatsApp */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-semibold shadow-md transition-all duration-200 transform active:scale-95 disabled:opacity-50 mt-2"
            style={
              royal
                ? {
                    background: "linear-gradient(135deg, #0b1736 0%, #172a5a 100%)",
                    color: "#ffffff",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    border: "1px solid #d4af37",
                    borderRadius: "12px",
                    padding: "15px 20px",
                    marginTop: "24px",
                    boxShadow: "0 6px 18px rgba(11,23,54,0.3)",
                  }
                : {
                    backgroundColor: "#5A3E44",
                    color: "#FFFFFF",
                    fontFamily: template.fontSubheading,
                  }
            }
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? (isEn ? "Connecting to WhatsApp..." : "Conectando con WhatsApp...") : (isEn ? "Submit RSVP via WhatsApp" : "Enviar RSVP por WhatsApp")}
          </button>
        </form>

        {/* Hallazgo 11: enlace de llamada al anfitrión, controlado por el toggle del evento */}
        {permitirConfirmacionTelefono !== false && telefonoWhatsapp && (
          <a
            href={`tel:${telefonoWhatsapp.replace(/[^0-9+]/g, "")}`}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-[11px] font-bold uppercase tracking-widest opacity-80 hover:opacity-100 transition"
            style={
              royal
                ? { color: "#a81c1c", fontFamily: "'Cinzel', serif", fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 600, marginTop: "14px", textAlign: "center", display: "block" }
                : { color: template.textSecondary }
            }
          >
            <Phone className="w-4 h-4" />
            {isEn ? "Prefer to call? Call the host" : "¿Prefieres llamar? Llama al anfitrión"}
          </a>
        )}
      </div>
      </div>
    </section>
  );
}
