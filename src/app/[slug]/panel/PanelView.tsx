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
} from "lucide-react";

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
}

export default function PanelView({
  slug,
  isAuthorized,
  initialData,
  errorMessage,
  panelKey = "",
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
    if (!newGuestName.trim()) return;

    setIsAddingGuest(true);
    setAddGuestError("");

    try {
      const res = await fetch(`/api/events/${encodeURIComponent(slug)}/guests?key=${encodeURIComponent(panelKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGuestName.trim(),
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
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E8E3D9] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <div>
            <h1 className="text-sm font-bold text-[#2C1F1B] font-serif">
              {data.evento.titulo} • Panel del Anfitrión
            </h1>
            <p className="text-[10px] text-[#8C8077]">
              Gestión de lista de invitados y aforo en tiempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F5EFE4] rounded-lg text-xs font-medium text-[#2C1F1B] border border-[#E8E3D9] transition"
          >
            Ver Invitación
          </Link>
          <button
            onClick={copyPublicLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] hover:bg-[#AA8643] text-[#2C1F1B] font-semibold rounded-lg text-xs shadow-xs transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? "Copiado" : "Copiar Link"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner Editorial */}
        <div className="bg-[#2C1F1B] text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-[#C5A059]/30">
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#EED3A1] font-semibold font-serif">
              Sistema de Gestión de Invitados y RSVP
            </span>
            <h2 className="text-2xl font-bold tracking-tight font-serif text-[#FAF8F5]">
              {data.evento.titulo}
            </h2>
            <p className="text-xs text-[#D5C9B8] pt-1">
              Agrega tu lista de invitados para que busquen su nombre en la invitación y confirmen sus pases exactos.
            </p>
          </div>
          <div className="absolute -right-6 -bottom-8 opacity-10 text-8xl pointer-events-none select-none">
            ✦
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. BARRA DE RESUMEN (MÉTRICAS EXACTAS REQUERIDAS) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total invitados asignados (SUM(max_pax)) */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#2B2B2B] font-medium">Pases Asignados</p>
            <h3 className="text-2xl font-bold text-[#2C1F1B] mt-0.5 font-serif">
              {totalAssignedPax}
            </h3>
            <span className="text-[9px] text-[#8C8077]">{guests.length} familias/invitados</span>
          </div>

          {/* Total confirmados (SUM(confirmed_pax) con status attending) */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#2B2B2B] font-medium">Pases Confirmados</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-0.5 font-serif">
              {totalConfirmedPax}
            </h3>
            <span className="text-[9px] text-emerald-600 font-semibold">
              {guests.filter((g) => g.status === "attending").length} confirmaron asistencia
            </span>
          </div>

          {/* Total declinados (COUNT con status declined) */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#2B2B2B] font-medium">Declinados</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-0.5 font-serif">
              {totalDeclinedCount}
            </h3>
            <span className="text-[9px] text-rose-500 font-semibold">No podrán asistir</span>
          </div>

          {/* Total pendientes (COUNT con status pending) */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#2B2B2B] font-medium">Pendientes</p>
            <h3 className="text-2xl font-bold text-amber-700 mt-0.5 font-serif">
              {totalPendingCount}
            </h3>
            <span className="text-[9px] text-amber-600 font-semibold">Por responder</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. SELECTOR DE PESTAÑAS */}
        {/* ============================================================== */}
        <div className="flex border-b border-[#E8E3D9] gap-4">
          <button
            onClick={() => setActiveTab("guests")}
            className={`pb-3 px-2 text-xs font-bold uppercase tracking-wider transition border-b-2 cursor-pointer ${
              activeTab === "guests"
                ? "border-[#C5A059] text-[#2C1F1B]"
                : "border-transparent text-[#8C8077] hover:text-[#2C1F1B]"
            }`}
          >
            Gestión de Lista de Invitados ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`pb-3 px-2 text-xs font-bold uppercase tracking-wider transition border-b-2 cursor-pointer ${
              activeTab === "rsvps"
                ? "border-[#C5A059] text-[#2C1F1B]"
                : "border-transparent text-[#8C8077] hover:text-[#2C1F1B]"
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
            <div className="bg-white p-5 rounded-2xl border border-[#E8E3D9] shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F1B] mb-3 font-serif flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#C5A059]" />
                <span>Agregar Nuevo Invitado a la Lista</span>
              </h3>

              <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1">
                    Nombre Completo o Familia *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Ej. Familia Rodríguez o Sofía Méndez"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1">
                    Pases Asignados (1-10)
                  </label>
                  <select
                    value={newGuestPax}
                    onChange={(e) => setNewGuestPax(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Pase" : "Pases"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8077] mb-1">
                    Teléfono (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="+1 (818) 555-0123"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                {addGuestError && (
                  <p className="sm:col-span-12 text-[11px] text-rose-600 font-medium">
                    {addGuestError}
                  </p>
                )}

                <div className="sm:col-span-12 flex justify-end">
                  <button
                    type="submit"
                    disabled={isAddingGuest}
                    className="px-5 py-2.5 bg-[#2C1F1B] hover:bg-black text-[#FAF8F5] text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAddingGuest ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5 text-[#EED3A1]" />
                    )}
                    <span>Agregar Invitado</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Barra de Búsqueda de Invitados */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8077]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en la lista de invitados por nombre o teléfono..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              <a
                href={`/api/eventos/${slug}/panel/export`}
                download
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FAF8F5] hover:bg-[#F5EFE4] text-[#2C1F1B] border border-[#E8E3D9] text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Exportar Excel (.CSV)</span>
              </a>
            </div>

            {/* Tabla de Invitados Oficial */}
            <div className="bg-white rounded-2xl border border-[#E8E3D9] shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E8E3D9] flex items-center justify-between bg-[#FAF8F5]/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F1B] font-serif">
                  Lista de Invitados ({filteredGuests.length})
                </h3>
                <span className="text-[10px] text-[#8C8077]">
                  Sincronizado con PostgreSQL
                </span>
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
                      <tr className="bg-[#FAF8F5] text-[#8C8077] font-semibold text-[11px] border-b border-[#E8E3D9]">
                        <th className="py-2.5 px-4">Nombre / Familia</th>
                        <th className="py-2.5 px-4 text-center">Pases Asignados</th>
                        <th className="py-2.5 px-4 text-center">Confirmados</th>
                        <th className="py-2.5 px-4 text-center">Estado</th>
                        <th className="py-2.5 px-4">Teléfono / Notas</th>
                        <th className="py-2.5 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E3D9]">
                      {filteredGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-[#FAF8F5] transition">
                          <td className="py-3 px-4 font-semibold text-[#2C1F1B]">
                            {guest.name}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-[#2C1F1B]">
                            {guest.max_pax}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-700">
                            {guest.status === "attending" ? guest.confirmed_pax : "—"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {guest.status === "attending" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Confirmado
                              </span>
                            ) : guest.status === "declined" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                <XCircle className="w-3 h-3" /> Cancelado
                              </span>
                            ) : guest.status === "PENDIENTE_APROBACION" || guest.status === "pending_approval" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                                <AlertCircle className="w-3 h-3 text-amber-600" /> Solicitud Manual
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                                <Clock className="w-3 h-3" /> Pendiente
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-[#2B2B2B]">
                            <div>{guest.phone || "—"}</div>
                            {guest.notes && (
                              <div className="text-[10px] text-[#8C8077] italic line-clamp-1">{guest.notes}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => copyGuestLink(guest.id)}
                                title="Copiar enlace personalizado"
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  copiedGuestId === guest.id
                                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                    : "text-stone-500 hover:text-[#2C1F1B] hover:bg-[#F5EFE4]"
                                }`}
                              >
                                {copiedGuestId === guest.id ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Link2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => sendGuestSms(guest)}
                                title="Enviar invitación por Mensaje de Texto (SMS)"
                                className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleStartEdit(guest)}
                                title="Editar invitado"
                                className="p-1.5 text-stone-500 hover:text-[#2C1F1B] hover:bg-[#F5EFE4] rounded-lg transition cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteGuest(guest.id, guest.name)}
                                disabled={deletingId === guest.id}
                                title="Eliminar de la lista"
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                              >
                                {deletingId === guest.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
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
