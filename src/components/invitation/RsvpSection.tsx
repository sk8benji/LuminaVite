"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, XCircle } from "lucide-react";
import { TemplateConfig } from "@/lib/templates";
import { generateWhatsAppRsvpUrl } from "@/lib/whatsapp";

interface RsvpSectionProps {
  eventoId?: string;
  eventoTitulo: string;
  telefonoWhatsapp: string;
  maxPases: number;
  fechaLimite?: string | null;
  template: TemplateConfig;
}

export default function RsvpSection({
  eventoId,
  eventoTitulo,
  telefonoWhatsapp,
  maxPases,
  fechaLimite,
  template,
}: RsvpSectionProps) {
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

  const pasesOptions = Array.from({ length: Math.min(Math.max(maxPases, 1), 10) }, (_, i) => i + 1);

  return (
    <section id="rsvp" className="px-4 py-8">
      <div
        className="p-6 rounded-3xl border shadow-sm text-center"
        style={{
          backgroundColor: template.cardBg,
          borderColor: "#FADCE0",
        }}
      >
        <span className="text-2xl">💌</span>
        <h3
          className="text-xs sm:text-sm uppercase tracking-widest font-bold mt-2"
          style={{
            color: "#9E2A4B",
            fontFamily: template.fontSubheading,
          }}
        >
          WILL YOU BE PART OF My Special Day?
        </h3>
        <p
          className="text-xs mt-1 mb-5 font-serif italic text-stone-600"
        >
          Save Your Seat for the Celebration!
        </p>

        {fechaLimite && (
          <p
            className="text-[11px] mb-5 opacity-75 font-medium"
            style={{
              color: template.textSecondary,
              fontFamily: template.fontBody,
            }}
          >
            Please confirm your seat before{" "}
            <span className="font-semibold text-[#9E2A4B]">{fechaLimite}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left mt-2">
          {/* Full name * */}
          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: "#7A6E70" }}
            >
              Full name *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="e.g. John Doe / Familia Hernández"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: template.bgColor,
                borderColor: template.borderSoft,
                color: template.textPrimary,
              }}
            />
          </div>

          {/* Asistencia */}
          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: "#7A6E70" }}
            >
              Will you attend?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAsistencia("SI")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition ${
                  asistencia === "SI" ? "ring-2 font-semibold" : "opacity-75"
                }`}
                style={{
                  backgroundColor: asistencia === "SI" ? template.badgeBg : template.bgColor,
                  borderColor: asistencia === "SI" ? template.accentColor : template.borderSoft,
                  color: template.textPrimary,
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Yes, with pleasure
              </button>

              <button
                type="button"
                onClick={() => setAsistencia("NO")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition ${
                  asistencia === "NO" ? "ring-2 font-semibold" : "opacity-75"
                }`}
                style={{
                  backgroundColor: asistencia === "NO" ? template.badgeBg : template.bgColor,
                  borderColor: asistencia === "NO" ? template.accentColor : template.borderSoft,
                  color: template.textPrimary,
                }}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                Regretfully decline
              </button>
            </div>
          </div>

          {/* How many seats/guests will you bring? (1, 2, 3+) */}
          {asistencia === "SI" && (
            <>
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "#7A6E70" }}
                >
                  How many seats/guests will you bring?
                </label>
                <select
                  value={pases}
                  onChange={(e) => setPases(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none"
                  style={{
                    backgroundColor: template.bgColor,
                    borderColor: template.borderSoft,
                    color: template.textPrimary,
                  }}
                >
                  {pasesOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Guest / Seat" : "Guests / Seats"}
                    </option>
                  ))}
                </select>
              </div>

              {/* What are their names? */}
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "#7A6E70" }}
                >
                  What are their names? (Companion names)
                </label>
                <textarea
                  rows={2}
                  value={acompanantes}
                  onChange={(e) => setAcompanantes(e.target.value)}
                  placeholder="e.g. Maria and Daniel"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none resize-none"
                  style={{
                    backgroundColor: template.bgColor,
                    borderColor: template.borderSoft,
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
            style={{
              backgroundColor: "#5A3E44",
              color: "#FFFFFF",
              fontFamily: template.fontSubheading,
            }}
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? "Connecting to WhatsApp..." : "Submit RSVP via WhatsApp"}
          </button>
        </form>
      </div>
    </section>
  );
}
