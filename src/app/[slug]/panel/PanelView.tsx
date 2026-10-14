"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Download,
  Copy,
  Check,
  Clock,
  Search,
  Lock,
  LogOut,
  UserPlus,
  Trash2,
  Edit2,
  AlertCircle,
  Loader2,
  UserCheck,
  Link2,
  MessageSquare,
  Share2,
  Globe,
  Zap,
  Shield,
  Phone,
  PhoneCall,
  Gift,
  Sparkles,
  Quote,
  ExternalLink,
} from "lucide-react";

function formatPhoneDisplay(phone?: string | null): string {
  if (!phone) return "—";
  const clean = phone.trim();
  const digits = clean.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return clean;
}

export interface GuestItem {
  id: string;
  name: string;
  phone?: string | null;
  max_pax: number;
  confirmed_pax: number;
  status: "pending" | "attending" | "declined" | string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PanelData {
  evento: {
    id?: string;
    titulo: string;
    slug: string;
    fechaEvento: string;
    recepcionNombre?: string;
    maxPasesPorInvitado?: number;
    modalidadRsvp?: "ESTRICTO" | "HIBRIDO" | "ABIERTO" | string;
    permitirConfirmacionTelefono?: boolean;
    mostrarMesaRegalos?: boolean;
    mostrarDressCode?: boolean;
    mostrarFrasePersonalizada?: boolean;
    mostrarFechaPlacaHora?: boolean;
    fechaPlacaHora?: string;
    telefonoWhatsappRsvp?: string;
  };
  estadisticas: {
    totalInvitadosConfirmados: number;
    totalPasesConfirmados: number;
    totalDeclinados: number;
    totalRespuestas: number;
    aforoTotal: number;
  };
  rsvps: Array<{
    id: string;
    nombreInvitado: string;
    telefono?: string | null;
    asistira: boolean;
    pases: number;
    acompanantes?: string | null;
    createdAt: string;
  }>;
  guests?: GuestItem[];
}

interface PanelViewProps {
  slug: string;
  isAuthorized: boolean;
  initialData?: PanelData | null;
  errorMessage?: string | null;
  panelKey?: string;
  isMaster?: boolean;
}

export default function PanelView({
  slug,
  isAuthorized,
  initialData,
  errorMessage,
  panelKey = "",
  isMaster = false,
}: PanelViewProps) {
  const [data, setData] = useState<PanelData | null>(initialData || null);
  const [guests, setGuests] = useState<GuestItem[]>(initialData?.guests || []);
  const [activeTab, setActiveTab] = useState<"guests" | "rsvps">("guests");

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [manualKeyInput, setManualKeyInput] = useState("");
  const [submittingKey, setSubmittingKey] = useState(false);
  const [keyError, setKeyError] = useState(
    errorMessage === "clave_incorrecta"
      ? "La clave ingresada no es válida para este evento."
      : errorMessage === "clave_requerida"
      ? "Por favor introduce tu clave de anfitrión."
      : ""
  );

  const [modalidadRsvp, setModalidadRsvp] = useState<string>(
    initialData?.evento?.modalidadRsvp || "HIBRIDO"
  );
  const [isUpdatingModalidad, setIsUpdatingModalidad] = useState(false);
  const [modalidadSuccess, setModalidadSuccess] = useState(false);

  const handleUpdateModalidad = async (newModalidad: "ESTRICTO" | "HIBRIDO" | "ABIERTO") => {
    if (newModalidad === modalidadRsvp || isUpdatingModalidad) return;
    const prev = modalidadRsvp;
    setModalidadRsvp(newModalidad);
    setIsUpdatingModalidad(true);

    try {
      const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/panel?key=${encodeURIComponent(panelKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modalidadRsvp: newModalidad }),
      });

      if (!res.ok) {
        throw new Error("No se pudo actualizar la modalidad");
      }

      setModalidadSuccess(true);
      setTimeout(() => setModalidadSuccess(false), 2500);
    } catch (err) {
      console.error("Error al actualizar modalidad de RSVP:", err);
      setModalidadRsvp(prev);
    } finally {
      setIsUpdatingModalidad(false);
    }
  };

  const [permitirConfirmacionTelefono, setPermitirConfirmacionTelefono] = useState<boolean>(
    initialData?.evento?.permitirConfirmacionTelefono !== false
  );
  const [telefonoAnfitriona] = useState<string>(
    initialData?.evento?.telefonoWhatsappRsvp || ""
  );
  const [isUpdatingPhoneSettings, setIsUpdatingPhoneSettings] = useState(false);
  const [phoneSettingsSuccess, setPhoneSettingsSuccess] = useState(false);

  const handleToggleConfirmacionTelefono = async () => {
    if (isUpdatingPhoneSettings) return;
    const nextVal = !permitirConfirmacionTelefono;
    setPermitirConfirmacionTelefono(nextVal);
    setIsUpdatingPhoneSettings(true);

    try {
      const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/panel?key=${encodeURIComponent(panelKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permitirConfirmacionTelefono: nextVal }),
      });

      if (!res.ok) {
        throw new Error("No se pudo actualizar la opción de teléfono");
      }

      setPhoneSettingsSuccess(true);
      setTimeout(() => setPhoneSettingsSuccess(false), 2500);
    } catch (err) {
      console.error("Error al actualizar confirmación por teléfono:", err);
      setPermitirConfirmacionTelefono(!nextVal);
    } finally {
      setIsUpdatingPhoneSettings(false);
    }
  };

  const [mostrarMesaRegalos, setMostrarMesaRegalos] = useState<boolean>(
    initialData?.evento?.mostrarMesaRegalos !== false
  );
  const [isUpdatingGiftSettings, setIsUpdatingGiftSettings] = useState(false);
  const [giftSettingsSuccess, setGiftSettingsSuccess] = useState(false);

  const handleToggleMesaRegalos = async () => {
    if (isUpdatingGiftSettings) return;
    const nextVal = !mostrarMesaRegalos;
    setMostrarMesaRegalos(nextVal);
    setIsUpdatingGiftSettings(true);

    try {
      const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/panel?key=${encodeURIComponent(panelKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mostrarMesaRegalos: nextVal }),
      });

      if (!res.ok) {
        throw new Error("No se pudo actualizar la opción de mesa de regalos");
      }

      setGiftSettingsSuccess(true);
      setTimeout(() => setGiftSettingsSuccess(false), 2500);
    } catch (err) {
      console.error("Error al actualizar mesa de regalos:", err);
      setMostrarMesaRegalos(!nextVal);
    } finally {
      setIsUpdatingGiftSettings(false);
    }
  };

  const [mostrarDressCode, setMostrarDressCode] = useState<boolean>(
    initialData?.evento?.mostrarDressCode !== false
  );
  const [isUpdatingDressCodeSettings, setIsUpdatingDressCodeSettings] = useState(false);
  const [dressCodeSettingsSuccess, setDressCodeSettingsSuccess] = useState(false);

  const handleToggleDressCode = async () => {
    if (isUpdatingDressCodeSettings) return;
    const nextVal = !mostrarDressCode;
    setMostrarDressCode(nextVal);
    setIsUpdatingDressCodeSettings(true);

    try {
      const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/panel?key=${encodeURIComponent(panelKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mostrarDressCode: nextVal }),
      });

      if (!res.ok) {
        throw new Error("No se pudo actualizar la opción de código de vestimenta");
      }

      setDressCodeSettingsSuccess(true);
      setTimeout(() => setDressCodeSettingsSuccess(false), 2500);
    } catch (err) {
      console.error("Error al actualizar código de vestimenta:", err);
      setMostrarDressCode(!nextVal);
    } finally {
      setIsUpdatingDressCodeSettings(false);
    }
  };

  const [mostrarFrasePersonalizada, setMostrarFrasePersonalizada] = useState<boolean>(
    initialData?.evento?.mostrarFrasePersonalizada !== false
  );
  const [isUpdatingFraseSettings, setIsUpdatingFraseSettings] = useState(false);
  const [fraseSettingsSuccess, setFraseSettingsSuccess] = useState(false);

  const handleToggleFrasePersonalizada = async () => {
    if (isUpdatingFraseSettings) return;
    const nextVal = !mostrarFrasePersonalizada;
    setMostrarFrasePersonalizada(nextVal);
    setIsUpdatingFraseSettings(true);

    try {
      const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/panel?key=${encodeURIComponent(panelKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mostrarFrasePersonalizada: nextVal }),
      });

      if (!res.ok) {
        throw new Error("No se pudo actualizar la dedicatoria");
      }

      setFraseSettingsSuccess(true);
      setTimeout(() => setFraseSettingsSuccess(false), 2500);
    } catch (err) {
      console.error("Error al actualizar dedicatoria:", err);
      setMostrarFrasePersonalizada(!nextVal);
    } finally {
      setIsUpdatingFraseSettings(false);
    }
  };

  const [mostrarFechaPlacaHora, setMostrarFechaPlacaHora] = useState<boolean>(
    initialData?.evento?.mostrarFechaPlacaHora !== false
  );
  const [isUpdatingHoraSettings, setIsUpdatingHoraSettings] = useState(false);
  const [horaSettingsSuccess, setHoraSettingsSuccess] = useState(false);

  const handleToggleFechaPlacaHora = async () => {
    if (isUpdatingHoraSettings) return;
    const nextVal = !mostrarFechaPlacaHora;
    setMostrarFechaPlacaHora(nextVal);
    setIsUpdatingHoraSettings(true);

    try {
      const res = await fetch(`/api/eventos/${encodeURIComponent(slug)}/panel?key=${encodeURIComponent(panelKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mostrarFechaPlacaHora: nextVal }),
      });

      if (!res.ok) {
        throw new Error("No se pudo actualizar la hora de la placa");
      }

      setHoraSettingsSuccess(true);
      setTimeout(() => setHoraSettingsSuccess(false), 2500);
    } catch (err) {
      console.error("Error al actualizar la hora de la placa:", err);
      setMostrarFechaPlacaHora(!nextVal);
    } finally {
      setIsUpdatingHoraSettings(false);
    }
  };

  // Copiar enlace directo personalizado de un invitado (?guest=UUID)
  const copyGuestLink = (guestId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://clickandlove.app";
    const url = `${origin}/${slug}?guest=${guestId}`;
    navigator.clipboard.writeText(url);
    setCopiedGuestId(guestId);
    setTimeout(() => setCopiedGuestId(null), 2500);
  };

  // Enviar invitación personalizada por SMS
  const sendGuestSms = (guest: GuestItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://clickandlove.app";
    const guestLink = `${origin}/${slug}?guest=${guest.id}`;
    const text = encodeURIComponent(
      `¡Hola ${guest.name}! Queremos compartir este momento contigo. Tienes ${guest.max_pax} pases reservados para nuestro evento. Confirma tu asistencia aquí: ${guestLink}`
    );
    const cleanPhone = guest.phone ? guest.phone.replace(/[^0-9]/g, "") : "";
    const smsUrl = cleanPhone
      ? `sms:${cleanPhone}?&body=${text}`
      : `sms:?body=${text}`;
    window.open(smsUrl, "_blank");
  };

  // Formulario rápido para añadir invitado
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPax, setNewGuestPax] = useState("2");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [addGuestError, setAddGuestError] = useState("");

  // Estado para eliminar invitado
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Estado para editar invitado
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editMaxPax, setEditMaxPax] = useState("2");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const [editConfirmedPax, setEditConfirmedPax] = useState("0");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Totales dinámicos de invitados calculados en tiempo real
  const totalAssignedPax = guests.reduce((sum, g) => sum + (g.max_pax || 0), 0);
  const totalConfirmedPax = guests
    .filter((g) => g.status === "attending")
    .reduce((sum, g) => sum + (g.confirmed_pax || 0), 0);
  const totalDeclinedCount = guests.filter((g) => g.status === "declined").length;
  const totalPendingCount = guests.filter((g) => g.status === "pending" || !g.status).length;

  // Acceso manual con clave
  const handleManualKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualKeyInput.trim()) {
      setKeyError("Por favor ingresa tu clave de anfitrión.");
      return;
    }
    setSubmittingKey(true);
    setKeyError("");

    try {
      window.location.href = `/${slug}/panel?key=${encodeURIComponent(manualKeyInput.trim())}`;
    } catch (err: any) {
      setKeyError(err.message || "Error al verificar la clave.");
      setSubmittingKey(false);
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Crear invitado
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newGuestName.trim().replace(/\s+/g, " ");
    if (!cleanName || cleanName.length < 3) {
      setAddGuestError("Por favor ingresa un nombre o familia válido de al menos 3 caracteres.");
      return;
    }

    setIsAddingGuest(true);
    setAddGuestError("");

    try {
      const res = await fetch(`/api/events/${encodeURIComponent(slug)}/guests?key=${encodeURIComponent(panelKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          max_pax: Number(newGuestPax) || 1,
          phone: newGuestPhone.trim() || undefined,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "No se pudo agregar el invitado.");
      }

      if (resData.guest) {
        setGuests((prev) => [resData.guest, ...prev]);
        setNewGuestName("");
        setNewGuestPhone("");
        setNewGuestPax("2");
      }
    } catch (err: any) {
      setAddGuestError(err.message || "Error al agregar invitado.");
    } finally {
      setIsAddingGuest(false);
    }
  };

  // Eliminar invitado
  const handleDeleteGuest = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar a "${name}" de la lista?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(
        `/api/events/${encodeURIComponent(slug)}/guests/${encodeURIComponent(id)}?key=${encodeURIComponent(panelKey)}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "No se pudo eliminar el invitado.");
      }

      setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al eliminar invitado.");
    } finally {
      setDeletingId(null);
    }
  };

  // Abrir modal de edición
  const handleStartEdit = (guest: GuestItem) => {
    setEditingGuest(guest);
    setEditName(guest.name);
    setEditMaxPax(String(guest.max_pax));
    setEditPhone(guest.phone || "");
    setEditStatus(guest.status || "pending");
    setEditConfirmedPax(String(guest.confirmed_pax || 0));
  };

  // Guardar edición
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;

    setIsSavingEdit(true);
    try {
      const res = await fetch(
        `/api/events/${encodeURIComponent(slug)}/guests/${encodeURIComponent(editingGuest.id)}?key=${encodeURIComponent(panelKey)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName.trim(),
            max_pax: Number(editMaxPax),
            phone: editPhone.trim() || null,
            status: editStatus,
            confirmed_pax: editStatus === "attending" ? Number(editConfirmedPax) : 0,
          }),
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "No se pudo actualizar el invitado.");
      }

      if (resData.guest) {
        setGuests((prev) =>
          prev.map((g) => (g.id === editingGuest.id ? resData.guest : g))
        );
        setEditingGuest(null);
      }
    } catch (err: any) {
      alert(err.message || "Error al guardar cambios.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Si no está autorizado
  if (!isAuthorized || !data) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-['Montserrat']">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#E8E3D9] text-center shadow-[0_15px_40px_rgba(44,31,27,0.06)] space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40 shadow-xs text-2xl font-serif font-bold">
            ✦
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C1F1B] tracking-tight">
              Panel de Gestión de Invitados
            </h2>
            <p className="text-xs text-[#2B2B2B] leading-relaxed">
              Introduce tu clave de anfitrión para administrar la lista oficial de invitados y controlar el aforo en tiempo real.
            </p>
          </div>

          <form onSubmit={handleManualKeySubmit} className="space-y-3 pt-2">
            <div className="text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1.5">
                Clave de Acceso Familiar
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={manualKeyInput}
                  onChange={(e) => setManualKeyInput(e.target.value)}
                  placeholder="Ingresa tu clave de anfitrión..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E8E3D9] bg-[#FAF8F5] text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-[#8C8077] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {keyError && (
              <p className="text-[11px] text-rose-600 text-left font-medium">
                {keyError}
              </p>
            )}

            <button
              type="submit"
              disabled={submittingKey}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] hover:brightness-105 active:scale-95 text-[#2C1F1B] text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-sm cursor-pointer"
            >
              {submittingKey ? "Verificando..." : "Acceder a mi Panel"}
            </button>
          </form>

          <div className="pt-3 border-t border-[#E8E3D9] flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`/${slug}`}
              className="flex-1 py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#F5EFE4] text-[#2C1F1B] border border-[#E8E3D9] rounded-xl text-xs font-semibold transition text-center"
            >
              Ver Invitación Digital
            </Link>
            <a
              href={`sms:18181234567?&body=${encodeURIComponent(`Hola, necesito acceder a mi panel del evento ${slug}`)}`}
              className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Ayuda por SMS</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Filtrado de invitados por búsqueda
  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.phone && g.phone.includes(searchTerm))
  );

  // Filtrado de RSVPs
  const filteredRsvps = (data.rsvps || []).filter((r) =>
    r.nombreInvitado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1F1B] font-['Montserrat'] pb-16">
      {/* Barra Superior */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E8E3D9] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <div>
            <h1 className="text-sm font-bold text-[#2C1F1B] font-serif">
              {data.evento.titulo} • Panel del Anfitrión
            </h1>
            <p className="text-[11px] text-[#8C8077]">
              Gestión de lista de invitados y aforo en tiempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Botón Ver Invitación con flecha externa diagonal */}
          <Link
            href={`/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF8F5] hover:bg-[#F5EFE4] rounded-xl text-xs font-semibold text-[#2C1F1B] border border-[#E8E3D9] transition shadow-xs"
          >
            <span>Ver Invitación</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C8077]" />
          </Link>

          {/* Botón Copiar Link Secundario con borde dorado y feedback inmediato */}
          <button
            onClick={copyPublicLink}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer shadow-xs ${
              copiedLink
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-white hover:bg-[#FAF6F0] text-[#2C1F1B] border-[#D4AF37]"
            }`}
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Link2 className="w-3.5 h-3.5 text-[#C5A059]" />
            )}
            <span>{copiedLink ? "¡Copiado!" : "Copiar Link"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner Cálido de Bienvenida (Marfil a Arena Suave con Borde Fino Dorado) */}
        <div className="bg-gradient-to-br from-[#FAF6F0] via-[#FDFBF7] to-[#F3ECE2] border border-[#E8E3D9] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#D4AF37]/50 text-[#6B4E1B] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-serif shadow-xs">
              <span>✦</span>
              <span>Panel de Control del Evento</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif text-[#2C1F1B]">
              {data.evento.titulo}
            </h2>
            <p className="text-xs sm:text-sm text-[#5E534C] max-w-2xl leading-relaxed">
              Administra el acceso de tus familias invitadas y supervisa las confirmaciones en tiempo real.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. BARRA DE RESUMEN (MÉTRICAS EXACTAS REQUERIDAS) */}
        {/* ============================================================== */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Pases Asignados */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E3D9] shadow-xs text-center transition hover:border-[#D4AF37]/50">
              <div className="w-9 h-9 rounded-full bg-[#F7F3EB] border border-[#EADBBD] text-[#8C6D2D] flex items-center justify-center mx-auto mb-2.5">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#5E534C] font-medium">Pases asignados</p>
              <h3 className="text-3xl font-serif font-bold text-[#2C1F1B] mt-1">
                {totalAssignedPax}
              </h3>
              <span className="text-[10px] text-stone-500 mt-0.5 block">{guests.length} familias/invitados</span>
            </div>

            {/* Pases Confirmados */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E3D9] shadow-xs text-center transition hover:border-emerald-300">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#1B5E20] flex items-center justify-center mx-auto mb-2.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#5E534C] font-medium">Pases confirmados</p>
              <h3 className="text-3xl font-serif font-bold text-[#1B5E20] mt-1">
                {totalConfirmedPax}
              </h3>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                {guests.filter((g) => g.status === "attending").length} confirmaron asistencia
              </span>
            </div>

            {/* Declinados */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E3D9] shadow-xs text-center transition hover:border-rose-300">
              <div className="w-9 h-9 rounded-full bg-[#FBF0F1] border border-[#F2D5D9] text-[#8B2635] flex items-center justify-center mx-auto mb-2.5">
                <XCircle className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#5E534C] font-medium">Declinados</p>
              <h3 className="text-3xl font-serif font-bold text-[#8B2635] mt-1">
                {totalDeclinedCount}
              </h3>
              <span className="text-[10px] text-[#8B2635] font-semibold mt-0.5 block">No podrán asistir</span>
            </div>

            {/* Pendientes */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E3D9] shadow-xs text-center transition hover:border-amber-300">
              <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/60 text-[#B8860B] flex items-center justify-center mx-auto mb-2.5">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#5E534C] font-medium">Pendientes</p>
              <h3 className="text-3xl font-serif font-bold text-[#B8860B] mt-1">
                {totalPendingCount}
              </h3>
              <span className="text-[10px] text-[#B8860B] font-semibold mt-0.5 block">Por responder</span>
            </div>
          </div>

          {/* Barra de Progreso Visual de Capacidad Total */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#5E534C]">
              <span className="font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E20]"></span>
                <span>Capacidad confirmada: <strong className="text-[#1B5E20] font-semibold">{totalConfirmedPax} pases</strong></span>
              </span>
              <span className="text-[11px] font-semibold text-stone-600">
                {data.estadisticas.aforoTotal > 0
                  ? `${Math.round((totalConfirmedPax / data.estadisticas.aforoTotal) * 100)}% del cupo (${data.estadisticas.aforoTotal} pases estimados)`
                  : `${totalConfirmedPax} confirmados`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#E8E3D9] flex">
              <div
                className="bg-[#1B5E20] h-full transition-all duration-500 rounded-l-full"
                style={{
                  width: `${Math.min(100, Math.round((totalConfirmedPax / (data.estadisticas.aforoTotal || totalAssignedPax || 1)) * 100))}%`,
                }}
              />
              <div
                className="bg-[#B8860B]/40 h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round(((totalAssignedPax - totalConfirmedPax - totalDeclinedCount) / (data.estadisticas.aforoTotal || totalAssignedPax || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. SELECTOR DE PESTAÑAS (PASTILLA MODERNA SEGMENTADA) */}
        {/* ============================================================== */}
        <div className="inline-flex p-1 bg-[#F0ECE1] rounded-2xl border border-[#E3DDD1] shadow-2xs">
          <button
            onClick={() => setActiveTab("guests")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "guests"
                ? "bg-white text-[#2C1F1B] shadow-xs"
                : "text-stone-600 hover:text-[#2C1F1B]"
            }`}
          >
            Lista de Invitados ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "rsvps"
                ? "bg-white text-[#2C1F1B] shadow-xs"
                : "text-stone-600 hover:text-[#2C1F1B]"
            }`}
          >
            Historial de Respuestas ({data.rsvps.length})
          </button>
        </div>

        {/* ============================================================== */}
        {/* SECCIÓN PESTAÑA A: GESTIÓN DE INVITADOS */}
        {/* ============================================================== */}
        {activeTab === "guests" && (
          <div className="space-y-6">
            {/* Formulario rápido de inserción */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E3D9] shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F1B] mb-3.5 font-serif flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#C5A059]" />
                <span>Agregar nuevo invitado a la lista</span>
              </h3>

              <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5">
                    Nombre o familia
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Ej. Familia Rodríguez o Sofía Méndez"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059] shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5">
                    Pases
                  </label>
                  <select
                    value={newGuestPax}
                    onChange={(e) => setNewGuestPax(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-medium shadow-2xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Pase" : "Pases"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5">
                    Teléfono móvil
                  </label>
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="+1 (818) 555-0123"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059] shadow-2xs"
                  />
                </div>

                {addGuestError && (
                  <p className="sm:col-span-12 text-xs text-rose-600 font-medium">
                    {addGuestError}
                  </p>
                )}

                <div className="sm:col-span-12 flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isAddingGuest}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#38271F] hover:bg-[#251A14] active:scale-95 text-white text-xs font-bold tracking-wider rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAddingGuest ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5 text-[#EED3A1]" />
                    )}
                    <span>+ Agregar Invitado</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Barra de Búsqueda y Botón de Exportación */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E8E3D9] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 sm:max-w-[65%]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D2D]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar invitado por nombre o teléfono..."
                  className="w-full pl-9 pr-3.5 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              <a
                href={`/api/eventos/${slug}/panel/export`}
                download
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FAF6F0] hover:bg-[#F3ECE2] text-[#2C1F1B] border border-[#E5D9C5] text-xs font-medium rounded-xl shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Descargar lista (CSV)</span>
              </a>
            </div>

            {/* Tabla de Invitados Oficial */}
            <div className="bg-white rounded-2xl border border-[#E8E3D9] shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E8E3D9] flex items-center justify-between bg-[#FAF8F5]/80">
                <h3 className="text-xs font-bold text-[#2C1F1B] font-serif">
                  Lista de Invitados ({filteredGuests.length})
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Actualizado automáticamente</span>
                </div>
              </div>

              {filteredGuests.length === 0 ? (
                <div className="p-10 text-center text-[#8C8077] text-xs space-y-2">
                  <Users className="w-8 h-8 text-[#C5A059]/50 mx-auto" />
                  <p className="font-semibold text-[#2C1F1B]">No hay invitados en la lista todavía.</p>
                  <p className="text-[11px]">Usa el formulario de arriba para agregar a los primeros invitados o familias.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-100/60 text-stone-600 font-semibold text-xs border-b border-[#E8E3D9]">
                        <th className="py-3 px-4">Nombre / Familia</th>
                        <th className="py-3 px-4 text-center">Pases Asignados</th>
                        <th className="py-3 px-4 text-center">Confirmados</th>
                        <th className="py-3 px-4 text-center">Estado</th>
                        <th className="py-3 px-4">Teléfono / Notas</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E3D9]">
                      {filteredGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-[#FAF8F5] transition">
                          <td className="py-3.5 px-4 font-semibold text-[#2C1F1B] capitalize">
                            {guest.name}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-[#2C1F1B]">
                            {guest.max_pax}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-[#1B5E20]">
                            {guest.status === "attending" ? guest.confirmed_pax : "—"}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {guest.status === "attending" ? (
                              <span className="inline-flex items-center gap-1 text-xs py-0.5 px-2.5 rounded-full font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60">
                                <CheckCircle2 className="w-3 h-3" /> Confirmado
                              </span>
                            ) : guest.status === "declined" ? (
                              <span className="inline-flex items-center gap-1 text-xs py-0.5 px-2.5 rounded-full font-medium text-[#8B2635] bg-[#FBF0F1] border border-[#F2D5D9]">
                                <XCircle className="w-3 h-3" /> Declinado
                              </span>
                            ) : guest.status === "PENDIENTE_APROBACION" || guest.status === "pending_approval" ? (
                              <span className="inline-flex items-center gap-1 text-xs py-0.5 px-2.5 rounded-full font-medium text-amber-800 bg-amber-50 border border-amber-300">
                                <AlertCircle className="w-3 h-3 text-amber-600" /> Solicitud Manual
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs py-0.5 px-2.5 rounded-full font-medium text-stone-600 bg-stone-100 border border-stone-200">
                                <Clock className="w-3 h-3" /> Pendiente
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-[#2B2B2B]">
                            <div className="font-mono text-xs text-[#2C1F1B]">
                              {formatPhoneDisplay(guest.phone)}
                            </div>
                            {guest.notes && (
                              <div className="text-[11px] text-[#8C8077] italic line-clamp-1">{guest.notes}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Acciones directas (enlace y mensaje) */}
                              <div className="flex items-center gap-1 bg-[#FAF6F0] p-0.5 rounded-xl border border-[#E8E3D9]">
                                <button
                                  onClick={() => copyGuestLink(guest.id)}
                                  title="Copiar enlace personalizado del invitado"
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                    copiedGuestId === guest.id
                                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                      : "text-stone-600 hover:text-[#2C1F1B] hover:bg-white"
                                  }`}
                                >
                                  {copiedGuestId === guest.id ? (
                                    <Check className="w-3.5 h-3.5" />
                                  ) : (
                                    <Link2 className="w-3.5 h-3.5 text-[#8C6D2D]" />
                                  )}
                                </button>
                                <button
                                  onClick={() => sendGuestSms(guest)}
                                  title="Enviar invitación personalizada por SMS / WhatsApp"
                                  className="w-8 h-8 flex items-center justify-center text-blue-700 hover:text-blue-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Acciones de gestión (editar y eliminar) */}
                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={() => handleStartEdit(guest)}
                                  title="Editar invitado"
                                  className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-[#2C1F1B] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGuest(guest.id, guest.name)}
                                  disabled={deletingId === guest.id}
                                  title="Eliminar de la lista"
                                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {deletingId === guest.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECCIÓN PESTAÑA B: HISTORIAL DE RESPUESTAS (RSVPS) */}
        {/* ============================================================== */}
        {activeTab === "rsvps" && (
          <div className="bg-white rounded-2xl border border-[#E8E3D9] shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E8E3D9] flex items-center justify-between bg-[#FAF8F5]/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F1B] font-serif">
                Confirmaciones Registradas ({filteredRsvps.length})
              </h3>
            </div>

            {filteredRsvps.length === 0 ? (
              <div className="p-8 text-center text-[#8C8077] text-xs">
                No hay respuestas de invitados registradas aún.
              </div>
            ) : (
              <div className="divide-y divide-[#E8E3D9] overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] text-[#8C8077] font-semibold text-[11px]">
                      <th className="py-2.5 px-4">Invitado / Familia</th>
                      <th className="py-2.5 px-4">Teléfono</th>
                      <th className="py-2.5 px-4">Estado</th>
                      <th className="py-2.5 px-4">Pases</th>
                      <th className="py-2.5 px-4 text-right">Fecha de Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E3D9]">
                    {filteredRsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-[#F5EFE4]/30 transition">
                        <td className="py-3 px-4 font-semibold text-[#2C1F1B]">
                          {rsvp.nombreInvitado}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#2B2B2B]">
                          {rsvp.telefono || "—"}
                        </td>
                        <td className="py-3 px-4">
                          {rsvp.asistira ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Asiste
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                              <XCircle className="w-3 h-3" /> Declinó
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#2C1F1B]">
                          {rsvp.asistira ? `${rsvp.pases} pases` : "0"}
                        </td>
                        <td className="py-3 px-4 text-[#8C8077] text-[11px] text-right">
                          {new Date(rsvp.createdAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL PARA EDITAR INVITADO */}
        {/* ============================================================== */}
        {editingGuest && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-[#E8E3D9] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2C1F1B]">
                Editar Invitado
              </h3>

              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1">
                    Nombre Completo o Familia *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1">
                      Pases Asignados
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={editMaxPax}
                      onChange={(e) => setEditMaxPax(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1">
                      Estado
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="PENDIENTE_APROBACION">Solicitud Manual (Por Aprobar)</option>
                      <option value="attending">Confirmado</option>
                      <option value="declined">Cancelado</option>
                    </select>
                  </div>
                </div>

                {editStatus === "attending" && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1">
                      Pases Confirmados Reales
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={Number(editMaxPax)}
                      value={editConfirmedPax}
                      onChange={(e) => setEditConfirmedPax(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+1 (818) 555-0123"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E3D9]">
                  <button
                    type="button"
                    onClick={() => setEditingGuest(null)}
                    className="px-4 py-2 bg-[#FAF8F5] text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-100 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-4 py-2 bg-[#2C1F1B] hover:bg-black text-[#FAF8F5] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingEdit ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-[#EED3A1]" />
                    )}
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
