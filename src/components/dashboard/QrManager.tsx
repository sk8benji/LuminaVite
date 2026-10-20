"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Copy,
  Check,
  Download,
  Trash2,
  Edit3,
  Save,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Users,
  ScanLine,
  Clock,
} from "lucide-react";

interface QrDailyPoint {
  date: string;
  count: number;
}

interface QrCampaignItem {
  id: string;
  name: string;
  code: string;
  targetUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  qrUrl: string;
  totalScans: number;
  uniqueScans: number;
  lastScanAt: string | null;
  dailySeries: QrDailyPoint[];
}

/** Renderiza el código QR de una URL en un <canvas>. */
function QrCanvas({ value, size = 168 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
    }).catch((err) => console.error("Error generando QR:", err));
  }, [value, size]);

  return <canvas ref={canvasRef} className="rounded-xl" style={{ width: size, height: size }} />;
}

export default function QrManager() {
  const [campaigns, setCampaigns] = useState<QrCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Formulario de creación
  const [newName, setNewName] = useState("");
  const [newTargetUrl, setNewTargetUrl] = useState("");

  // Edición inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTargetUrl, setEditTargetUrl] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  const fetchCampaigns = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/qr")
      .then((res) => res.json())
      .then((data) => {
        if (data.campaigns) setCampaigns(data.campaigns);
      })
      .catch((err) => console.error("Error cargando campañas QR:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTargetUrl.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), targetUrl: newTargetUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear la campaña");
      setNewName("");
      setNewTargetUrl("");
      showSuccess("¡Campaña QR creada! Ya puedes descargar el código para imprimir.");
      fetchCampaigns();
    } catch (err: any) {
      showError(err.message || "Error al crear la campaña");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (campaign: QrCampaignItem) => {
    navigator.clipboard.writeText(campaign.qrUrl);
    setCopiedId(campaign.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleActive = async (campaign: QrCampaignItem) => {
    setBusyId(campaign.id);
    try {
      const res = await fetch(`/api/admin/qr/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !campaign.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaign.id ? { ...c, active: !c.active } : c))
      );
      showSuccess(campaign.active ? "Campaña desactivada." : "Campaña activada.");
    } catch (err: any) {
      showError(err.message || "Error al actualizar la campaña");
    } finally {
      setBusyId(null);
    }
  };

  const handleStartEdit = (campaign: QrCampaignItem) => {
    setEditingId(campaign.id);
    setEditName(campaign.name);
    setEditTargetUrl(campaign.targetUrl);
  };

  const handleSaveEdit = async (campaign: QrCampaignItem) => {
    setSavingId(campaign.id);
    try {
      const res = await fetch(`/api/admin/qr/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), targetUrl: editTargetUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaign.id ? { ...c, name: editName.trim(), targetUrl: editTargetUrl.trim() } : c
        )
      );
      setEditingId(null);
      showSuccess("Campaña actualizada. El QR impreso ya apunta al nuevo destino.");
    } catch (err: any) {
      showError(err.message || "Error al guardar la campaña");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (campaign: QrCampaignItem) => {
    const ok = window.confirm(
      `¿Eliminar la campaña "${campaign.name}"?\n\nSe borrarán también sus ${campaign.totalScans} escaneos registrados y el QR impreso dejará de funcionar.`
    );
    if (!ok) return;
    setBusyId(campaign.id);
    try {
      const res = await fetch(`/api/admin/qr/${campaign.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");
      setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
      showSuccess("Campaña eliminada.");
    } catch (err: any) {
      showError(err.message || "Error al eliminar la campaña");
    } finally {
      setBusyId(null);
    }
  };

  const handleDownloadPng = async (campaign: QrCampaignItem) => {
    try {
      const dataUrl = await QRCode.toDataURL(campaign.qrUrl, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: "M",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `qr-${campaign.code}.png`;
      a.click();
    } catch (err) {
      console.error(err);
      showError("No se pudo generar el PNG del QR.");
    }
  };

  const handleDownloadSvg = async (campaign: QrCampaignItem) => {
    try {
      const svg = await QRCode.toString(campaign.qrUrl, {
        type: "svg",
        width: 1024,
        margin: 2,
        errorCorrectionLevel: "M",
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${campaign.code}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      showError("No se pudo generar el SVG del QR.");
    }
  };

  const formatDateTime = (iso: string | null) => {
    if (!iso) return "Sin escaneos";
    const d = new Date(iso);
    return d.toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDayLabel = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00Z`);
    return d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", timeZone: "UTC" });
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <QrCode className="w-6 h-6 text-[#C5A059]" />
          Códigos QR con Tracking
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Crea un QR por campaña o evento. Cada escaneo queda registrado y el destino se puede
          cambiar sin reimprimir el código.
        </p>
      </div>

      {/* Notificaciones */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-800 text-xs font-semibold shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Formulario: nueva campaña */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4"
      >
        <h2 className="font-serif font-bold text-base text-stone-900">Nueva campaña QR</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Nombre de la campaña:</label>
            <input
              type="text"
              placeholder="Ej. Evento quinceañera — domingo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">URL destino (a dónde llega quien escanea):</label>
            <input
              type="url"
              placeholder="https://clickandlove.app/demo/... o tu WhatsApp"
              value={newTargetUrl}
              onChange={(e) => setNewTargetUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7A002A] hover:bg-[#5e0020] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          {creating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Creando...</span>
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4" />
              <span>Crear campaña y generar QR</span>
            </>
          )}
        </button>
      </form>

      {/* Lista de campañas */}
      {loading ? (
        <div className="flex items-center gap-2 text-stone-500 text-sm py-10 justify-center">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Cargando campañas...</span>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-stone-200 text-center space-y-2">
          <QrCode className="w-10 h-10 mx-auto text-stone-300" />
          <p className="text-sm font-semibold text-stone-700">Todavía no hay campañas QR</p>
          <p className="text-xs text-stone-500">
            Crea la primera arriba: ponle nombre al evento y la URL a la que quieres que llegue la gente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {campaigns.map((campaign) => {
            const maxDaily = Math.max(1, ...campaign.dailySeries.map((d) => d.count));
            const isEditing = editingId === campaign.id;
            return (
              <div
                key={campaign.id}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5"
              >
                {/* Título + estado */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-base text-stone-900 truncate">
                      {campaign.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 font-mono">/q/{campaign.code}</p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(campaign)}
                    disabled={busyId === campaign.id}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer ${
                      campaign.active
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                    }`}
                    title="Activar / desactivar la redirección"
                  >
                    {campaign.active ? "● Activa" : "○ Inactiva"}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  {/* QR + descargas */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="p-2 bg-stone-50 border border-stone-200 rounded-2xl">
                      <QrCanvas value={campaign.qrUrl} />
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleDownloadPng(campaign)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-lg text-[11px] font-semibold transition cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        PNG
                      </button>
                      <button
                        onClick={() => handleDownloadSvg(campaign)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        SVG
                      </button>
                    </div>
                  </div>

                  {/* Datos + stats */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* URL pública con copiar */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                        URL del QR (esta es la que se imprime)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <code className="flex-1 min-w-0 truncate px-2.5 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-[11px] text-stone-700">
                          {campaign.qrUrl}
                        </code>
                        <button
                          onClick={() => handleCopy(campaign)}
                          className="shrink-0 p-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition cursor-pointer"
                          title="Copiar URL"
                        >
                          {copiedId === campaign.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-stone-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Destino: vista o edición */}
                    {isEditing ? (
                      <div className="space-y-2 p-3 bg-stone-50 border border-stone-200 rounded-2xl">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-stone-600">Nombre:</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-stone-600">URL destino:</label>
                          <input
                            type="url"
                            value={editTargetUrl}
                            onChange={(e) => setEditTargetUrl(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                          />
                        </div>
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => handleSaveEdit(campaign)}
                            disabled={savingId === campaign.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-lg text-[11px] font-semibold transition disabled:opacity-50 cursor-pointer"
                          >
                            <Save className="w-3 h-3" />
                            {savingId === campaign.id ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                          Destino actual
                        </label>
                        <p className="text-[11px] text-stone-700 font-mono break-all">
                          {campaign.targetUrl}
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-2xl">
                        <ScanLine className="w-3.5 h-3.5 mx-auto text-[#C5A059]" />
                        <p className="text-base font-bold text-stone-900 leading-tight">
                          {campaign.totalScans}
                        </p>
                        <p className="text-[10px] text-stone-500">Escaneos</p>
                      </div>
                      <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-2xl">
                        <Users className="w-3.5 h-3.5 mx-auto text-[#C5A059]" />
                        <p className="text-base font-bold text-stone-900 leading-tight">
                          {campaign.uniqueScans}
                        </p>
                        <p className="text-[10px] text-stone-500">Únicos aprox.</p>
                      </div>
                      <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-2xl">
                        <Clock className="w-3.5 h-3.5 mx-auto text-[#C5A059]" />
                        <p className="text-[11px] font-bold text-stone-900 leading-tight pt-1">
                          {formatDateTime(campaign.lastScanAt)}
                        </p>
                        <p className="text-[10px] text-stone-500">Último escaneo</p>
                      </div>
                    </div>

                    {/* Mini-serie últimos 7 días */}
                    <div>
                      <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                        <BarChart3 className="w-3 h-3" />
                        Últimos 7 días
                      </p>
                      <div className="flex items-end gap-1.5 h-16">
                        {campaign.dailySeries.map((day) => (
                          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-stone-600">{day.count}</span>
                            <div
                              className="w-full rounded-t-md bg-gradient-to-t from-[#7A002A] to-[#C5A059]"
                              style={{ height: `${Math.max(6, (day.count / maxDaily) * 36)}px` }}
                              title={`${day.date}: ${day.count} escaneos`}
                            />
                            <span className="text-[9px] text-stone-400 capitalize">
                              {formatDayLabel(day.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Acciones */}
                    {!isEditing && (
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => handleStartEdit(campaign)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          Editar destino
                        </button>
                        <button
                          onClick={() => handleDelete(campaign)}
                          disabled={busyId === campaign.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
