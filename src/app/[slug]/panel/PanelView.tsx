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
} from "lucide-react";

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
}

interface PanelViewProps {
  slug: string;
  isAuthorized: boolean;
  initialData?: PanelData | null;
  errorMessage?: string | null;
}

export default function PanelView({
  slug,
  isAuthorized,
  initialData,
  errorMessage,
}: PanelViewProps) {
  const [data, setData] = useState<PanelData | null>(initialData || null);
  const [copiedLink, setCopiedLink] = useState(false);
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

  // Formulario manual de acceso
  const handleManualKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualKeyInput.trim()) {
      setKeyError("Por favor ingresa tu clave de anfitrión.");
      return;
    }
    setSubmittingKey(true);
    setKeyError("");

    try {
      const res = await fetch(`/api/eventos/${slug}/panel/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: manualKeyInput.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Clave no válida.");
      }

      // Sesión iniciada con éxito en cookie HttpOnly: recargar página
      window.location.href = `/${slug}/panel`;
    } catch (err: any) {
      setKeyError(err.message || "Clave no reconocida. Puedes escribirnos a WhatsApp para asistirte de inmediato.");
      setSubmittingKey(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`/api/eventos/${slug}/panel/auth`, { method: "DELETE" }).catch(() => {});
    window.location.reload();
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 1. Pantalla amigable para anfitriones si no hay sesión activa
  if (!isAuthorized || !data) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-['Montserrat']">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#E8E3D9] text-center shadow-[0_15px_40px_rgba(44,31,27,0.06)] space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40 shadow-xs text-2xl font-['Cinzel'] font-bold">
            ✦
          </div>

          <div className="space-y-2">
            <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#2C1F1B] tracking-tight">
              Panel Familiar de Confirmaciones
            </h2>
            <p className="text-xs text-[#5E534C] leading-relaxed">
              Este espacio privado permite a los anfitriones y a la familia consultar en tiempo real quién ha confirmado su asistencia.
            </p>
          </div>

          {/* Formulario de ingreso de clave familiar */}
          <form onSubmit={handleManualKeySubmit} className="space-y-3 pt-2">
            <div className="text-left">
              <label className="block text-[10px] font-['Cinzel'] font-bold uppercase tracking-wider text-[#8C8077] mb-1.5">
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
              className="w-full py-3 px-4 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] hover:brightness-105 active:scale-95 text-[#2C1F1B] font-['Cinzel'] text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-sm cursor-pointer"
            >
              {submittingKey ? "Verificando..." : "Acceder a mi Panel"}
            </button>
          </form>

          {/* Opciones de Asistencia y Ver Invitación */}
          <div className="pt-3 border-t border-[#E8E3D9] flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`/${slug}`}
              className="flex-1 py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#F5EFE4] text-[#2C1F1B] border border-[#E8E3D9] rounded-xl text-xs font-semibold transition text-center"
            >
              Ver Invitación Digital
            </Link>
            <a
              href={`https://wa.me/18181234567?text=Hola,%20soy%20la%20familia%20del%20evento%20clickandlove.app/${slug}%20y%20necesito%20acceder%20a%20mi%20panel%20de%20confirmaciones`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Ayuda por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Panel Autorizado en Vivo
  const filteredRsvps = (data.rsvps || []).filter((r) =>
    r.nombreInvitado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1F1B] font-['Montserrat'] pb-16">
      {/* Barra Superior con Identidad del Evento */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#E8E3D9] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <div>
            <h1 className="text-sm font-bold text-[#2C1F1B] font-['Cinzel']">
              {data.evento.titulo} • Panel de Invitados
            </h1>
            <p className="text-[10px] text-[#8C8077]">
              Panel familiar • Actualización en tiempo real
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
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-1.5 text-[#8C8077] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner de Bienvenida Protocolario */}
        <div className="bg-[#2C1F1B] text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-[#C5A059]/30">
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#EED3A1] font-semibold font-['Cinzel']">
              Control de Asistencia en Tiempo Real
            </span>
            <h2 className="text-2xl font-bold tracking-tight font-['Cinzel'] text-[#FAF8F5]">
              {data.evento.titulo}
            </h2>
            <p className="text-xs text-[#D5C9B8] pt-1">
              Aquí puedes ver al instante cada familia que confirma o declina asistencia.
            </p>
          </div>
          <div className="absolute -right-6 -bottom-8 opacity-10 text-8xl pointer-events-none select-none">
            ✦
          </div>
        </div>

        {/* Tarjetas Métricas en Vivo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-[#F5EFE4] text-[#C5A059] flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#8C8077] font-medium">Familias Confirmadas</p>
            <h3 className="text-2xl font-bold text-[#2C1F1B] mt-0.5 font-['Cinzel']">
              {data.estadisticas.totalInvitadosConfirmados}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#8C8077] font-medium">Pases Confirmados</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-0.5 font-['Cinzel']">
              {data.estadisticas.totalPasesConfirmados}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#8C8077] font-medium">Declinados</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-0.5 font-['Cinzel']">
              {data.estadisticas.totalDeclinados}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#8C8077] font-medium">Total Respuestas</p>
            <h3 className="text-2xl font-bold text-[#2C1F1B] mt-0.5 font-['Cinzel']">
              {data.estadisticas.totalRespuestas}
            </h3>
          </div>
        </div>

        {/* Barra de Acciones y Descarga de Excel Segura */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8077]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar invitado o familia..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          <a
            href={`/api/eventos/${slug}/panel/export`}
            download
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#2C1F1B] hover:bg-black text-[#FAF8F5] text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar Lista en Excel (.CSV)
          </a>
        </div>

        {/* Tabla en Tiempo Real */}
        <div className="bg-white rounded-2xl border border-[#E8E3D9] shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E8E3D9] flex items-center justify-between bg-[#FAF8F5]/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1F1B] font-['Cinzel']">
              Invitados Registrados ({filteredRsvps.length})
            </h3>
            <span className="text-[10px] text-[#8C8077]">
              Sincronizado con PostgreSQL
            </span>
          </div>

          {filteredRsvps.length === 0 ? (
            <div className="p-8 text-center text-[#8C8077] text-xs">
              No hay confirmaciones registradas aún con ese criterio.
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
                      <td className="py-3 px-4 font-mono text-[#5E534C]">
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
      </main>
    </div>
  );
}
