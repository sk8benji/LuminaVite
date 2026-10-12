"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Send,
  Loader2,
  Users,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export interface GuestSearchResult {
  id: string;
  name: string;
  max_pax: number;
  status: string;
}

interface DynamicRsvpFormProps {
  slug: string;
  eventTitle: string;
  eventDate?: string | Date;
  recepcionMapUrl?: string | null;
  telefonoWhatsapp?: string | null;
  primaryColor?: string; // Ej: "#7A002A" para rosa o "#C5A059" para dorado
  accentBgColor?: string;
  deadlineText?: string;
  lang?: "es" | "en";
  permiteSms?: boolean;
  tipoPlan?: string | null;
}

export default function DynamicRsvpForm({
  slug,
  eventTitle,
  eventDate,
  recepcionMapUrl,
  telefonoWhatsapp,
  primaryColor = "#7A002A",
  accentBgColor = "bg-white",
  deadlineText = "Favor de confirmar antes de la fecha límite",
  lang = "es",
  permiteSms,
  tipoPlan,
}: DynamicRsvpFormProps) {
  const isEn = lang === "en";
  const isSmsEnabled = permiteSms ?? (!tipoPlan || !tipoPlan.toLowerCase().includes("basic"));
  const searchParams = useSearchParams();
  const directGuestId = searchParams?.get("guest") || searchParams?.get("guest_id") || searchParams?.get("id");

  // Estados del flujo: 1 = Buscar, 2 = Seleccionar Asistencia/Pases, 3 = Éxito, "manual" = Fallback
  const [step, setStep] = useState<1 | 2 | 3 | "manual">(1);

  // Estado 1: Búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GuestSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Estado 2: Invitado seleccionado y formulario
  const [selectedGuest, setSelectedGuest] = useState<GuestSearchResult | null>(null);
  const [asistencia, setAsistencia] = useState<"SI" | "NO">("SI");
  const [confirmedPax, setConfirmedPax] = useState<number>(1);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Estado 3: Confirmación exitosa
  const [confirmedDetails, setConfirmedDetails] = useState<{
    name: string;
    confirmed_pax: number;
    max_pax: number;
    status: string;
  } | null>(null);

  // Fallback Manual
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualPax, setManualPax] = useState("2");
  const [manualSubmitted, setManualSubmitted] = useState(false);

  // 1. Detección y carga directa de invitado por URL (?guest=UUID o ?guest_id=UUID)
  useEffect(() => {
    if (!directGuestId) return;

    let isMounted = true;
    setIsSearching(true);

    fetch(
      `/api/events/${encodeURIComponent(slug)}/guests/search?id=${encodeURIComponent(directGuestId)}`
    )
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((guest) => {
        if (isMounted && guest && guest.id) {
          setSelectedGuest(guest);
          setConfirmedPax(Math.min(guest.max_pax || 1, 2));
          setAsistencia("SI");
          setStep(2); // Salta directamente al Estado 2
        }
      })
      .catch((err) => {
        console.warn("No se pudo cargar el invitado directo por URL:", err);
      })
      .finally(() => {
        if (isMounted) setIsSearching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [directGuestId, slug]);

  // Debounce para búsqueda pública
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const trimmed = searchQuery.trim();
    if (trimmed.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/events/${encodeURIComponent(slug)}/guests/search?q=${encodeURIComponent(trimmed)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data : []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Error al buscar invitado:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    }, 350);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, slug]);

  // Selección de invitado de la lista
  const handleSelectGuest = (guest: GuestSearchResult) => {
    setSelectedGuest(guest);
    setConfirmedPax(Math.min(guest.max_pax, 2));
    setAsistencia("SI");
    setSubmitError("");
    setStep(2);
  };

  // Envío del RSVP
  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const contactVal = phone.trim();
      const payload = {
        guest_id: selectedGuest.id,
        status: asistencia === "SI" ? "attending" : "declined",
        confirmed_pax: asistencia === "SI" ? confirmedPax : 0,
        phone: isSmsEnabled ? contactVal || undefined : undefined,
        email: !isSmsEnabled ? contactVal || undefined : undefined,
        notes: notes.trim() || undefined,
      };

      const res = await fetch(`/api/events/${encodeURIComponent(slug)}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo registrar la confirmación.");
      }

      // Si asiste, lanzar confeti
      if (asistencia === "SI") {
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.75 },
            colors: ["#C5A059", "#EED3A1", "#7A002A", "#FFFFFF"],
          });
        } catch (_) {}
      }

      setConfirmedDetails({
        name: selectedGuest.name,
        confirmed_pax: asistencia === "SI" ? confirmedPax : 0,
        max_pax: selectedGuest.max_pax,
        status: payload.status,
      });

      setStep(3);
    } catch (err: any) {
      setSubmitError(err.message || "Ocurrió un error al enviar. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(eventTitle);
    const details = encodeURIComponent(`¡Celebración de ${eventTitle}!`);
    const dateParam = eventDate
      ? new Date(eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "")
      : "";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateParam}/${dateParam}`;
  };

  // Notificar por WhatsApp / SMS
  const handleShareToWhatsApp = () => {
    if (!confirmedDetails) return;
    const phoneClean = (telefonoWhatsapp || "").replace(/[^0-9]/g, "");
    let text = `Confirmación de asistencia para ${eventTitle}:\n`;
    text += `Invitado: ${confirmedDetails.name}\n`;
    if (confirmedDetails.status === "attending") {
      text += `Pases Confirmados: ${confirmedDetails.confirmed_pax} de ${confirmedDetails.max_pax}`;
    } else {
      text += `Estado: No podré asistir`;
      if (notes) text += `\nMensaje: ${notes}`;
    }

    const url = phoneClean
      ? `sms:${phoneClean}?&body=${encodeURIComponent(text)}`
      : `sms:?body=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Envío manual fallback
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const phoneClean = (telefonoWhatsapp || "").replace(/[^0-9]/g, "");
    let text = `Solicitud de asistencia para ${eventTitle}:\n`;
    text += `Nombre: ${manualName.trim()}\n`;
    if (manualPhone.trim()) text += `Teléfono: ${manualPhone.trim()}\n`;
    text += `Pases Solicitados: ${manualPax}`;

    const url = phoneClean
      ? `sms:${phoneClean}?&body=${encodeURIComponent(text)}`
      : `sms:?body=${encodeURIComponent(text)}`;

    setManualSubmitted(true);
    window.open(url, "_blank");
  };

  return (
    <div className={`w-full max-w-[340px] mx-auto p-5 sm:p-6 rounded-3xl shadow-xl border border-pink-200/80 ${accentBgColor} text-center select-none`}>
      {/* ─────────────────────────────────────────────────────────────
          ESTADO 1: BÚSQUEDA DEL INVITADO
      ───────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <span className="text-2xl">💌</span>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mt-1"
              style={{ color: primaryColor }}
            >
              {isEn ? "WILL YOU JOIN US?" : "¿SERÁS PARTE DE"}
            </h3>
            <h2
              className="text-3xl font-serif italic mt-0.5"
              style={{ color: primaryColor }}
            >
              {isEn ? "Our Celebration?" : "Mi Celebración?"}
            </h2>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-stone-500 mt-2">
              {deadlineText}
            </p>
          </div>

          <div className="text-left pt-1">
            <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-1.5">
              {isEn ? "Find your name on the guest list:" : "Escribe tu nombre o apellido:"}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "e.g. Rodriguez Family or Maria..." : "Ej. Familia Rodríguez o María..."}
                className="w-full pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            <p className="text-[9px] text-stone-400 mt-1">
              {isEn ? "Type at least 3 characters to search." : "Escribe al menos 3 letras para buscar tu pase."}
            </p>
          </div>

          {/* Resultados de búsqueda */}
          {searchQuery.trim().length >= 3 && (
            <div className="space-y-2 pt-1 animate-fade-in">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 text-left">
                    {isEn ? "Matching Guests Found:" : "Resultados encontrados:"}
                  </p>
                  {searchResults.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => handleSelectGuest(guest)}
                      className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50/80 hover:bg-stone-100 hover:border-stone-400 transition flex items-center justify-between text-left group cursor-pointer shadow-xs"
                    >
                      <div>
                        <p className="text-xs font-bold text-stone-900 group-hover:text-black">
                          {guest.name}
                        </p>
                        <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Users className="w-3 h-3 text-stone-400" />
                          <span>
                            {guest.max_pax} {guest.max_pax === 1 ? (isEn ? "Pass" : "Pase asignado") : (isEn ? "Passes" : "Pases asignados")}
                          </span>
                          {guest.status === "attending" && (
                            <span className="text-emerald-600 font-bold ml-1.5">✓ Ya confirmado</span>
                          )}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              ) : hasSearched && !isSearching ? (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-600 text-xs text-center space-y-1">
                  <p className="font-semibold">{isEn ? "No guest found with that name." : "No encontramos ese nombre en la lista."}</p>
                  <p className="text-[10px] text-stone-500">
                    {isEn ? "Try typing your last name only." : "Intenta escribir solo tu apellido o primer nombre."}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Enlace secundario: escape manual */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep("manual")}
              className="text-[11px] font-medium text-stone-500 hover:text-stone-800 underline transition cursor-pointer"
            >
              {isEn ? "¿Not on the list? Request manual confirmation" : "¿No estás en la lista? Solicitar confirmación manual"}
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ESTADO 2: SELECCIÓN DE ASISTENCIA Y PASES
      ───────────────────────────────────────────────────────────── */}
      {step === 2 && selectedGuest && (
        <form onSubmit={handleSubmitRsvp} className="space-y-4 text-left">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-800 transition cursor-pointer mb-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>{isEn ? "Change guest" : "Buscar otro invitado"}</span>
          </button>

          <div className="border-b border-stone-100 pb-3">
            <span className="text-[11px] text-stone-500 uppercase font-semibold tracking-wider">
              {isEn ? "Welcome," : "Hola,"}
            </span>
            <h3 className="text-base font-bold text-stone-900 leading-tight">
              {selectedGuest.name}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {isEn ? `You have ${selectedGuest.max_pax} allotted pass(es).` : `Tienes hasta ${selectedGuest.max_pax} ${selectedGuest.max_pax === 1 ? "pase asignado" : "pases asignados"}.`}
            </p>
          </div>

          {/* Selector de presencia (Radio Buttons) */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-2">
              {isEn ? "¿Will you attend?" : "¿Podrás acompañarnos?"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAsistencia("SI")}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  asistencia === "SI"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEn ? "Yes, I will attend" : "Sí, asistiré"}</span>
              </button>

              <button
                type="button"
                onClick={() => setAsistencia("NO")}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  asistencia === "NO"
                    ? "bg-rose-50 border-rose-400 text-rose-800 shadow-xs"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>{isEn ? "Cannot attend" : "No podré asistir"}</span>
              </button>
            </div>
          </div>

          {/* Si selecciona "Sí, asistiré" */}
          {asistencia === "SI" ? (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-1">
                  {isEn ? "Confirmed Guests / Passes:" : "Número de personas que asistirán:"}
                </label>
                <select
                  value={confirmedPax}
                  onChange={(e) => setConfirmedPax(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 font-medium"
                >
                  {Array.from({ length: selectedGuest.max_pax }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? (isEn ? "Person / Pass" : "Persona / Pase") : (isEn ? "Persons / Passes" : "Personas / Pases")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-1">
                  {isSmsEnabled
                    ? isEn
                      ? "MOBILE NUMBER TO RECEIVE YOUR PASSES VIA SMS:"
                      : "MÓVIL PARA RECIBIR TUS PASES POR SMS:"
                    : isEn
                    ? "EMAIL TO RECEIVE YOUR PASSES:"
                    : "CORREO ELECTRÓNICO PARA RECIBIR TUS PASES:"}
                </label>
                <input
                  type={isSmsEnabled ? "tel" : "email"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={
                    isSmsEnabled
                      ? "(818) 555-0123"
                      : isEn
                      ? "name@example.com"
                      : "nombre@ejemplo.com"
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
                <p className="text-xs text-neutral-500 mt-1 text-left">
                  {isSmsEnabled
                    ? isEn
                      ? "We'll send your access details and location via text message."
                      : "Te enviaremos los detalles de tu acceso y ubicación por mensaje de texto."
                    : isEn
                    ? "We'll send your access details and location via email."
                    : "Te enviaremos los detalles de tu acceso y ubicación por email."}
                </p>
              </div>
            </div>
          ) : (
            /* Si selecciona "No podré asistir" */
            <div className="pt-1">
              <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-1">
                {isEn ? "Message for the hosts (Optional):" : "Mensaje para los anfitriones (Opcional):"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={isEn ? "Wishing you the absolute best on this special day!" : "¡Les deseamos lo mejor en este gran día! No podremos ir por..."}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
              />
            </div>
          )}

          {submitError && (
            <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3 rounded-full text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isEn ? "Confirming..." : "Guardando..."}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{asistencia === "SI" ? (isEn ? "Confirm Attendance" : "Confirmar Asistencia") : (isEn ? "Send Response" : "Enviar Respuesta")}</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ESTADO 3: CONFIRMACIÓN EXITOSA
      ───────────────────────────────────────────────────────────── */}
      {step === 3 && confirmedDetails && (
        <div className="space-y-4 py-2 animate-fade-in">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              {isEn ? "RSVP Confirmed Successfully!" : "¡Confirmación registrada con éxito!"}
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              {confirmedDetails.name}
            </p>
          </div>

          {confirmedDetails.status === "attending" ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs">
              <p className="font-bold">
                {isEn ? `Confirmed Passes: ${confirmedDetails.confirmed_pax} of ${confirmedDetails.max_pax}` : `Pases confirmados: ${confirmedDetails.confirmed_pax} de ${confirmedDetails.max_pax}`}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {isEn ? "We can't wait to celebrate with you!" : "¡Te esperamos con muchísima emoción!"}
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-600 text-xs">
              <p className="font-semibold">
                {isEn ? "Thank you for letting us know." : "Gracias por avisarnos."}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {isEn ? "You will be dearly missed in our hearts." : "Te extrañaremos en esta gran celebración."}
              </p>
            </div>
          )}

          {/* Botones directos requeridos por la auditoría */}
          <div className="space-y-2 pt-2">
            {recepcionMapUrl && (
              <a
                href={recepcionMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-stone-600" />
                <span>{isEn ? "Directions (Google Maps / Waze)" : "Cómo llegar (Google Maps / Waze)"}</span>
              </a>
            )}

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              <span>{isEn ? "Add to Calendar" : "Agregar al Calendario"}</span>
            </a>

            {/* Avisar a la anfitriona por SMS */}
            <button
              onClick={handleShareToWhatsApp}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEn ? "Share Confirmation via SMS" : "Compartir Confirmación por SMS"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setSelectedGuest(null);
              setSearchQuery("");
            }}
            className="text-[10px] text-stone-400 hover:text-stone-700 uppercase tracking-wider font-semibold transition cursor-pointer pt-2"
          >
            {isEn ? "Modify or confirm another guest" : "Modificar o confirmar otro invitado"}
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FALLBACK: SOLICITUD MANUAL
      ───────────────────────────────────────────────────────────── */}
      {step === "manual" && (
        <div className="space-y-3.5 text-left animate-fade-in">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-800 transition cursor-pointer mb-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>{isEn ? "Back to search" : "Volver a buscar"}</span>
          </button>

          <h3 className="text-sm font-bold text-stone-900 leading-tight">
            {isEn ? "Manual Confirmation Request" : "Solicitud de Confirmación Manual"}
          </h3>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            {isEn
              ? "If your name does not appear in the search, send your details directly to the hosts via WhatsApp."
              : "Si no apareces en la lista, envía tus datos directamente a la anfitriona por WhatsApp para que te agregue a la lista oficial."}
          </p>

          {manualSubmitted ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-1">
              <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" />
              <p className="font-bold">{isEn ? "Request Sent via WhatsApp!" : "¡Solicitud enviada por WhatsApp!"}</p>
              <p className="text-[11px] text-emerald-700">
                {isEn ? "The host has received your details." : "La anfitriona ya recibió tus datos en su chat."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-1">
                  {isEn ? "Full Name / Family *" : "Nombre Completo o Familia *"}
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Ej. Familia Pérez López"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-1">
                  {isEn ? "Phone (Optional)" : "Teléfono (Opcional)"}
                </label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="Ej. +1 (818) 555-0123"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-600 mb-1">
                  {isEn ? "Requested Passes" : "Pases Solicitados"}
                </label>
                <select
                  value={manualPax}
                  onChange={(e) => setManualPax(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 font-medium"
                >
                  <option value="1">1 Pase</option>
                  <option value="2">2 Pases</option>
                  <option value="3">3 Pases</option>
                  <option value="4">4 Pases</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEn ? "Send to Host via WhatsApp" : "Enviar a Anfitriona por WhatsApp"}</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
