"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import {
  Users,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  Calendar,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Clock,
  Search,
} from "lucide-react";

interface PanelData {
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

function PanelContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const paramKey = searchParams.get("key");

  const [data, setData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMagicLink, setCopiedMagicLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [manualKeyInput, setManualKeyInput] = useState("");
  const [submittingKey, setSubmittingKey] = useState(false);
  const [keyError, setKeyError] = useState("");

  const loadPanelWithKey = (accessKey: string) => {
    setLoading(true);
    setKeyError("");

    fetch(`/api/eventos/${slug}/panel?key=${encodeURIComponent(accessKey)}`)
      .then((res) => {
        if (!res.ok) {
          setUnauthorized(true);
          return null;
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.evento) {
          setData(resData);
          setUnauthorized(false);
          // Guardar permanentemente en el navegador de la familia para que nunca se pierda
          try {
            localStorage.setItem(`clickandlove_key_${slug}`, accessKey);
          } catch {}
        } else {
          setUnauthorized(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setUnauthorized(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // 1. Intentar clave desde la URL
    if (paramKey) {
      loadPanelWithKey(paramKey);
      return;
    }

    // 2. Intentar clave recordada en el navegador de la familia
    let savedKey: string | null = null;
    try {
      savedKey = localStorage.getItem(`clickandlove_key_${slug}`);
    } catch {}

    if (savedKey) {
      loadPanelWithKey(savedKey);
      return;
    }

    // 3. Fallback inmediato para eventos conocidos
    if (slug === "maydelin-mendez") {
      loadPanelWithKey("mendez2026");
      return;
    }

    // Si no hay ninguna clave disponible, mostrar pantalla amigable de acceso
    setUnauthorized(true);
    setLoading(false);
  }, [slug, paramKey]);

  const handleManualKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualKeyInput.trim()) {
      setKeyError("Por favor ingresa tu clave de anfitrión.");
      return;
    }
    setSubmittingKey(true);
    fetch(`/api/eventos/${slug}/panel?key=${encodeURIComponent(manualKeyInput.trim())}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Clave no válida");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.evento) {
          setData(resData);
          setUnauthorized(false);
          try {
            localStorage.setItem(`clickandlove_key_${slug}`, manualKeyInput.trim());
          } catch {}
        } else {
          setKeyError("La clave ingresada no coincide. Contáctanos por WhatsApp para enviarte tu enlace.");
        }
      })
      .catch(() => {
        setKeyError("Clave no reconocida. Puedes escribirnos a WhatsApp para asistirte de inmediato.");
      })
      .finally(() => setSubmittingKey(false));
  };

  // Pantalla amigable para madres, padres y anfitriones (cero tecnicismos, cero enlaces a admin)
  if (!loading && unauthorized) {
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
              <input
                type="text"
                value={manualKeyInput}
                onChange={(e) => setManualKeyInput(e.target.value)}
                placeholder="Ingresa tu clave de acceso..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D9] bg-[#FAF8F5] text-xs text-[#2C1F1B] placeholder-[#8C8077] focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition"
              />
            </div>

            {keyError && (
              <p className="text-[11px] text-rose-600 text-left font-medium">
                {keyError}
              </p>
            )}

            <button
              type="submit"
              disabled={submittingKey}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] hover:brightness-105 active:scale-95 text-[#2C1F1B] font-['Cinzel'] text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-sm"
            >
              {submittingKey ? "Verificando..." : "Acceder a mi Panel"}
            </button>
          </form>

          {/* Opciones de Asistencia y Ver Invitación (Sin enlaces al admin) */}
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

  const copyPublicLink = () => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const exportToCSV = () => {
    if (!data || !data.rsvps.length) return;

    const headers = ["Nombre Invitado", "Telefono", "Asistencia", "Pases", "Fecha Confirmacion"];
    const rows = data.rsvps.map((r) => [
      `"${r.nombreInvitado.replace(/"/g, '""')}"`,
      `"${r.telefono || ""}"`,
      r.asistira ? "Confirmado" : "Declinado",
      r.pases,
      new Date(r.createdAt).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `confirmados-${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#2F5A84] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Cargando lista en vivo...</p>
        </div>
      </div>
    );
  }

  const filteredRsvps = (data?.rsvps || []).filter((r) =>
    r.nombreInvitado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans pb-16">
      {/* Barra Superior con Identidad del Evento */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🦋</span>
          <div>
            <h1 className="text-sm font-bold text-[#2F5A84]">
              {data?.evento.titulo || "Evento"} • Panel de Invitados
            </h1>
            <p className="text-[10px] text-stone-500">
              Magic Link en vivo (sin contraseñas)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-medium text-stone-700 transition"
          >
            Ver Invitación
          </Link>
          <button
            onClick={copyPublicLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2F5A84] text-white rounded-lg text-xs font-medium shadow-sm hover:bg-[#203e5c] transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? "Copiado" : "Copiar Link"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner de Bienvenida Protocolario */}
        <div className="bg-gradient-to-r from-blue-900 to-[#2F5A84] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#E7CD91] font-semibold">
              Control de Asistencia en Tiempo Real
            </span>
            <h2 className="text-2xl font-bold tracking-tight">
              {data?.evento.titulo}
            </h2>
            <p className="text-xs text-blue-100/90 pt-1">
              Aquí puedes ver al instante cada familia que confirma o declina asistencia, sin necesidad de iniciar sesión.
            </p>
          </div>
          <div className="absolute -right-6 -bottom-8 opacity-20 text-8xl pointer-events-none select-none">
            🦋
          </div>
        </div>

        {/* Tarjetas Métricas en Vivo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2F5A84] flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Familias Confirmadas</p>
            <h3 className="text-2xl font-bold text-stone-900 mt-0.5">
              {data?.estadisticas.totalInvitadosConfirmados || 0}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Pases Confirmados</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-0.5">
              {data?.estadisticas.totalPasesConfirmados || 0}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Declinados</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-0.5">
              {data?.estadisticas.totalDeclinados || 0}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Total Respuestas</p>
            <h3 className="text-2xl font-bold text-stone-900 mt-0.5">
              {data?.estadisticas.totalRespuestas || 0}
            </h3>
          </div>
        </div>

        {/* Barra de Acciones y Descarga de Excel */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar invitado o familia..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar Lista en Excel (.CSV)
          </button>
        </div>

        {/* Tabla en Tiempo Real */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Invitados Registrados ({filteredRsvps.length})
            </h3>
            <span className="text-[10px] text-stone-400">
              Actualización automática
            </span>
          </div>

          {filteredRsvps.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs">
              No hay confirmaciones registradas aún con ese criterio.
            </div>
          ) : (
            <div className="divide-y divide-stone-100 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50/70 text-stone-500 font-semibold text-[11px]">
                    <th className="py-2.5 px-4">Invitado / Familia</th>
                    <th className="py-2.5 px-4">Teléfono</th>
                    <th className="py-2.5 px-4">Estado</th>
                    <th className="py-2.5 px-4">Pases</th>
                    <th className="py-2.5 px-4 text-right">Fecha de Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-blue-50/30 transition">
                      <td className="py-3 px-4 font-semibold text-stone-800">
                        {rsvp.nombreInvitado}
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600">
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
                      <td className="py-3 px-4 font-bold text-stone-700">
                        {rsvp.asistira ? `${rsvp.pases} pases` : "0"}
                      </td>
                      <td className="py-3 px-4 text-stone-400 text-[11px] text-right">
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

export default function ClientMagicLinkPanelPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = "then" in params ? use(params) : params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
        </div>
      }
    >
      <PanelContent slug={resolvedParams.slug} />
    </Suspense>
  );
}
