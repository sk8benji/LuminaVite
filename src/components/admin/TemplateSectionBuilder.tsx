"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  Heart,
  Users,
  MapPin,
  Sliders,
  Gift,
  Clock,
  Crown,
  Hourglass,
  Video,
  Music,
  Upload,
  Loader2,
  ChevronDown,
  ChevronUp,
  Languages,
  Check,
  Plus,
  Trash2,
  Info,
  PhoneCall,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ExternalLink,
  Link2,
  Palette,
} from "lucide-react";
import { extractCleanMapUrl } from "@/lib/mapsUrlCleaner";
import { InvitationData } from "@/components/invitation/InvitationMobileView";
import { SECCIONES_QUINCE_ROSADO, SeccionId, isSectionEnabledInEvent } from "@/config/templateSections";
import { TEMPLATES, TemplateId } from "@/lib/templates";

interface TemplateSectionBuilderProps {
  formData: InvitationData;
  updateField: (field: keyof InvitationData, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<InvitationData>>;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    field:
      | "fotoPortadaUrl"
      | "fotoInfanciaUrl"
      | "fotoActualUrl"
      | "musicaUrl"
      | "fotoCierreUrl"
      | "fotoZapato1Url"
      | "fotoZapato2Url",
    mediaType?: "images" | "audio"
  ) => Promise<void>;
  uploadingS3: boolean;
  uploadingField: string | null;
  formatFormalDate: (dateInput: string | Date, lang?: string) => any;
  computeRsvpPhrases: (eventDateInput: string | Date, dias: number) => any;
  onOpenTemplatePicker?: () => void;
}

function MapShortLinkTester({
  rawUrl,
  name,
  address,
  label,
  onAutoClean,
}: {
  rawUrl?: string | null;
  name?: string | null;
  address?: string | null;
  label: string;
  onAutoClean?: (cleaned: string) => void;
}) {
  const [shortUrl, setShortUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-limpieza inmediata de iframes
  useEffect(() => {
    if (rawUrl && (rawUrl.includes("<iframe") || rawUrl.includes("<IFRAME")) && onAutoClean) {
      const cleaned = extractCleanMapUrl(rawUrl, name, address);
      if (cleaned && cleaned !== rawUrl) {
        onAutoClean(cleaned);
      }
    }
  }, [rawUrl, name, address, onAutoClean]);

  // Carga automática / sincronización del enlace corto
  useEffect(() => {
    if (!rawUrl && !name && !address) {
      setShortUrl("");
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: rawUrl, name, address }),
        });
        const data = await res.json();
        if (isMounted && data.shortUrl) {
          setShortUrl(data.shortUrl);
          if (data.cleanUrl && onAutoClean && rawUrl && (rawUrl.includes("<iframe") || rawUrl.includes("<IFRAME"))) {
            onAutoClean(data.cleanUrl);
          }
        }
      } catch (err) {
        console.warn("Aviso al auto-generar enlace corto:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [rawUrl, name, address, onAutoClean]);

  const handleManualRegenerate = async () => {
    if (!rawUrl && !name && !address) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl, name, address }),
      });
      const data = await res.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
        if (data.cleanUrl && onAutoClean && rawUrl && (rawUrl.includes("<iframe") || rawUrl.includes("<IFRAME"))) {
          onAutoClean(data.cleanUrl);
        }
      }
    } catch (err) {
      console.error("Error al generar short link:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 p-3 rounded-xl bg-white/95 border border-pink-200/90 shadow-2xs space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#7A002A]">
          <Link2 className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Enlace Corto para SMS ({label})</span>
        </div>
        <button
          type="button"
          onClick={handleManualRegenerate}
          disabled={loading || (!rawUrl && !name && !address)}
          className="px-2.5 py-1 rounded-lg bg-[#7A002A] hover:bg-[#600020] text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-2xs"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          )}
          <span>{shortUrl ? "Regenerar Enlace" : "Generar Enlace Corto"}</span>
        </button>
      </div>

      {shortUrl ? (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300/80 p-2.5 rounded-lg">
          <span className="font-mono text-emerald-900 text-xs font-medium truncate flex-1 select-all">
            {shortUrl}
          </span>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition shadow-2xs flex-shrink-0"
            title="Probar en Google Maps"
          >
            <span>Probar Enlace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-semibold transition flex-shrink-0 cursor-pointer shadow-2xs"
          >
            {copied ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-gray-500 italic">
          {loading
            ? "Generando enlace corto optimizado..."
            : "Escribe la dirección, nombre o enlace para generar el link de mapas para SMS."}
        </p>
      )}
    </div>
  );
}

export default function TemplateSectionBuilder({
  formData,
  updateField,
  setFormData,
  handleFileUpload,
  uploadingS3,
  uploadingField,
  formatFormalDate,
  computeRsvpPhrases,
  onOpenTemplatePicker,
}: TemplateSectionBuilderProps) {
  // Estado para acordeones expandidos/colapsados (todos expandidos por defecto para acceso rápido)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    portada: true,
    medallonFecha: true,
    dedicatoria: true,
    rsvp: true,
    fotoZapatos1: false,
    ubicaciones: true,
    dressCode: true,
    mesaRegalos: true,
    itinerario: true,
    fotoZapatos2: false,
    corteHonor: true,
    cuentaRegresiva: false,
    videoDespedida: false,
    musica: false,
  });

  const toggleAccordion = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    SECCIONES_QUINCE_ROSADO.forEach((s) => (all[s.id] = true));
    setExpandedSections(all);
  };

  const collapseAll = () => {
    const none: Record<string, boolean> = {};
    SECCIONES_QUINCE_ROSADO.forEach((s) => (none[s.id] = false));
    setExpandedSections(none);
  };

  // Auto-limpieza en carga de URLs de mapas si contienen código <iframe> residual
  useEffect(() => {
    if (
      formData.ceremoniaMapUrl &&
      (formData.ceremoniaMapUrl.includes("<iframe") || formData.ceremoniaMapUrl.includes("<IFRAME"))
    ) {
      const cleanMisa = extractCleanMapUrl(
        formData.ceremoniaMapUrl,
        formData.ceremoniaNombre,
        formData.ceremoniaDireccion
      );
      if (cleanMisa && cleanMisa !== formData.ceremoniaMapUrl) {
        updateField("ceremoniaMapUrl", cleanMisa);
      }
    }
    if (
      formData.recepcionMapUrl &&
      (formData.recepcionMapUrl.includes("<iframe") || formData.recepcionMapUrl.includes("<IFRAME"))
    ) {
      const cleanSalon = extractCleanMapUrl(
        formData.recepcionMapUrl,
        formData.recepcionNombre,
        formData.recepcionDireccion
      );
      if (cleanSalon && cleanSalon !== formData.recepcionMapUrl) {
        updateField("recepcionMapUrl", cleanSalon);
      }
    }
  }, [
    formData.ceremoniaMapUrl,
    formData.recepcionMapUrl,
    formData.ceremoniaNombre,
    formData.ceremoniaDireccion,
    formData.recepcionNombre,
    formData.recepcionDireccion,
    updateField,
  ]);

  const [translatingField, setTranslatingField] = useState<string | null>(null);

  // Helper para traducir cualquier texto usando OpenAI o servicio de traducción con fallback
  const translateWithAi = async (
    text: string,
    targetField: keyof InvitationData,
    targetLang: "en" | "es" = "en"
  ) => {
    let sourceText = (text || "").trim();

    // Si el texto de origen está vacío, sugerir texto temático predeterminado
    if (!sourceText) {
      if (targetField === "frasePersonalizadaEn") {
        sourceText =
          formData.frasePersonalizada ||
          "Hoy comienzo a escribir un nuevo capítulo al dejar atrás mi niñez para convertirme en mujer. En este día tan especial, rodeada del cariño de quienes más quiero, sería un honor contar con tu presencia para celebrar un momento que guardaré por siempre en mi corazón.";
        if (!formData.frasePersonalizada) {
          updateField("frasePersonalizada", sourceText);
        }
      } else if (targetField === "dressCodeNotaEn") {
        sourceText =
          formData.dressCodeNota ||
          "Nos encantaría contar con tu presencia vistiendo de rigurosa etiqueta formal.";
        if (!formData.dressCodeNota) {
          updateField("dressCodeNota", sourceText);
        }
      } else if (targetField === "regalosMensajeEn") {
        sourceText =
          formData.regalosMensaje ||
          "Tu presencia es nuestro mejor regalo. Disponemos de un cofre para lluvia de sobres en la recepción.";
        if (!formData.regalosMensaje) {
          updateField("regalosMensaje", sourceText);
        }
      }
    }

    if (!sourceText) return;
    setTranslatingField(String(targetField));

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, targetLang }),
      });
      const data = await res.json();
      if (data.translatedText) {
        updateField(targetField, data.translatedText);
      } else if (targetField === "frasePersonalizadaEn") {
        updateField(
          "frasePersonalizadaEn",
          "Today I begin to write a new chapter as I leave childhood behind to become a young woman. On this special day, surrounded by the love of those I cherish most, it would be an honor to have your presence to celebrate a moment I will keep in my heart forever."
        );
      }
    } catch (err) {
      console.error("Error al traducir con IA:", err);
      if (targetField === "frasePersonalizadaEn") {
        updateField(
          "frasePersonalizadaEn",
          "Today I begin to write a new chapter as I leave childhood behind to become a young woman. On this special day, surrounded by the love of those I cherish most, it would be an honor to have your presence to celebrate a moment I will keep in my heart forever."
        );
      }
    } finally {
      setTranslatingField(null);
    }
  };

  // Helper para traducir todos los títulos del itinerario en lote
  const [translatingAllItinerario, setTranslatingAllItinerario] = useState(false);
  const handleTranslateAllItinerario = async () => {
    const list = formData.itinerarioJson || [];
    if (!Array.isArray(list) || list.length === 0) return;
    setTranslatingAllItinerario(true);
    try {
      const updatedList = await Promise.all(
        list.map(async (item: any) => {
          if (!item.titulo) return item;
          try {
            const res = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: item.titulo, targetLang: "en" }),
            });
            const data = await res.json();
            return { ...item, tituloEn: data.translatedText || item.tituloEn || item.titulo };
          } catch {
            return item;
          }
        })
      );
      updateField("itinerarioJson", updatedList);
    } finally {
      setTranslatingAllItinerario(false);
    }
  };

  // Helper para verificar si una sección está activa
  const checkSectionEnabled = (sectionId: SeccionId): boolean => {
    return isSectionEnabledInEvent(sectionId, formData.configPlantilla, {
      mostrarFrasePersonalizada: formData.mostrarFrasePersonalizada,
      mostrarFechaPlacaHora: formData.mostrarFechaPlacaHora,
      mostrarDressCode: formData.mostrarDressCode,
      mostrarMesaRegalos: formData.mostrarMesaRegalos,
      permitirConfirmacionTelefono: formData.permitirConfirmacionTelefono,
    });
  };

  // Helper para alternar switch de una sección
  const toggleSectionSwitch = (sectionId: SeccionId) => {
    const currentEnabled = checkSectionEnabled(sectionId);
    const nextEnabled = !currentEnabled;

    setFormData((prev) => {
      const currentConfig = prev.configPlantilla || {};
      const currentSec = (currentConfig as any).secciones || {};

      const nextConfig = {
        ...currentConfig,
        secciones: {
          ...currentSec,
          [sectionId]: { enabled: nextEnabled },
        },
      };

      const updates: Partial<InvitationData> = {
        configPlantilla: nextConfig,
      };

      // Sincronizar columnas nativas existentes para compatibilidad total
      if (sectionId === "dedicatoria") {
        updates.mostrarFrasePersonalizada = nextEnabled;
      }
      if (sectionId === "medallonFecha") {
        updates.mostrarFechaPlacaHora = nextEnabled;
      }
      if (sectionId === "dressCode") {
        updates.mostrarDressCode = nextEnabled;
      }
      if (sectionId === "mesaRegalos") {
        updates.mostrarMesaRegalos = nextEnabled;
      }

      return {
        ...prev,
        ...updates,
      };
    });
  };

  // Helper de iconos
  const renderIcon = (icono: string, className = "w-5 h-5") => {
    switch (icono) {
      case "Sparkles":
        return <Sparkles className={className} />;
      case "Calendar":
        return <Calendar className={className} />;
      case "Heart":
        return <Heart className={className} />;
      case "Users":
        return <Users className={className} />;
      case "MapPin":
        return <MapPin className={className} />;
      case "Sliders":
        return <Sliders className={className} />;
      case "Gift":
        return <Gift className={className} />;
      case "Clock":
        return <Clock className={className} />;
      case "Crown":
        return <Crown className={className} />;
      case "Hourglass":
        return <Hourglass className={className} />;
      case "Video":
        return <Video className={className} />;
      case "Music":
        return <Music className={className} />;
      case "Image":
        return <ImageIcon className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── BANNER DE PLANTILLA ACTIVA Y SELECTOR VISUAL ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-pink-50/90 via-white to-amber-50/80 border border-pink-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7A002A] text-white flex items-center justify-center shadow-xs shrink-0">
            <Palette className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Diseño / Plantilla en Edición
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-pink-100 text-[#7A002A] border border-pink-200">
                {formData.estiloPlantilla || "QUINCE_ROSADO"}
              </span>
            </div>
            <p className="text-sm font-bold text-stone-900 mt-0.5">
              {TEMPLATES[formData.estiloPlantilla as TemplateId]?.name || formData.estiloPlantilla}
            </p>
          </div>
        </div>

        {onOpenTemplatePicker && (
          <button
            type="button"
            onClick={onOpenTemplatePicker}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7A002A] hover:bg-[#600020] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Cambiar Plantilla</span>
          </button>
        )}
      </div>

      {/* ── BARRA SUPERIOR DE NAVEGACIÓN Y ACCIONES RÁPIDAS ── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-pink-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-[#7A002A]">
              Estructura Modular
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Orden visual idéntico a la plantilla
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 font-['Cinzel',serif]">
            Organizador de Secciones
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Activa o desactiva con los interruptores On/Off cada bloque de la invitación y edita sus contenidos en español e inglés.
          </p>
        </div>

        {/* Acciones de expandir / colapsar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer"
          >
            Expandir Todo
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer"
          >
            Colapsar Todo
          </button>
        </div>
      </div>

      {/* ── BARRA DE SECCIONES CON ACCESO DIRECTO ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {SECCIONES_QUINCE_ROSADO.map((sec) => {
          const isEnabled = checkSectionEnabled(sec.id);
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setExpandedSections((prev) => ({ ...prev, [sec.id]: true }));
                const el = document.getElementById(`section-card-${sec.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer border ${
                isEnabled
                  ? "bg-white border-pink-200 text-[#7A002A] hover:bg-pink-50 shadow-xs"
                  : "bg-gray-100 border-gray-200 text-gray-400 opacity-60"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isEnabled ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-gray-300"
                }`}
              />
              <span className="font-bold">{sec.numero}.</span>
              <span>{sec.label.split("(")[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LISTADO ORDENADO DE LAS 14 SECCIONES
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        {SECCIONES_QUINCE_ROSADO.map((sec) => {
          const isEnabled = checkSectionEnabled(sec.id);
          const isExpanded = expandedSections[sec.id] ?? false;

          return (
            <div
              key={sec.id}
              id={`section-card-${sec.id}`}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isEnabled
                  ? "bg-white border-pink-200 shadow-sm"
                  : "bg-gray-50/70 border-gray-200 opacity-75"
              }`}
            >
              {/* ENCABEZADO DEL ACORDEÓN DE LA SECCIÓN */}
              <div
                className={`p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                  isEnabled ? "hover:bg-pink-50/40" : "hover:bg-gray-100/60"
                }`}
                onClick={() => toggleAccordion(sec.id)}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Número y Badge de Ícono */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isEnabled
                        ? "bg-[#7A002A] text-white border-[#600021] shadow-xs"
                        : "bg-gray-200 text-gray-400 border-gray-300"
                    }`}
                  >
                    {renderIcon(sec.icono, "w-5 h-5")}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#A55B64]">
                        Sección {sec.numero}
                      </span>
                      {isEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                          <EyeOff className="w-3 h-3" />
                          Oculta
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {sec.label}
                    </h3>
                    <p className="text-xs text-gray-500 truncate hidden sm:block">
                      {sec.descripcion}
                    </p>
                  </div>
                </div>

                {/* CONTROLES DERECHA: INTERRUPTOR ON/OFF + FLECHA */}
                <div
                  className="flex items-center gap-3 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-bold text-gray-600 hidden sm:inline">
                      {isEnabled ? "Visible" : "Oculto"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      onClick={() => toggleSectionSwitch(sec.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                        isEnabled ? "bg-emerald-600 ring-2 ring-emerald-200" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                          isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </label>

                  <button
                    type="button"
                    onClick={() => toggleAccordion(sec.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                    aria-label="Alternar acordeón"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* CONTENIDO INTERNO DE LA SECCIÓN (CAMPOS EDITABLES) */}
              {isExpanded && (
                <div
                  className={`p-4 sm:p-6 border-t ${
                    isEnabled
                      ? "border-pink-100 bg-white"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  {!isEnabled && (
                    <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>
                        Esta sección está desactivada. Sus datos se mantendrán guardados pero no se mostrarán a los invitados en la invitación final.
                      </span>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 1: PORTADA & ENCABEZADO PRINCIPAL
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "portada" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Nombre de la Festejada (Título Principal)
                          </label>
                          <input
                            type="text"
                            value={formData.titulo}
                            onChange={(e) => updateField("titulo", e.target.value)}
                            placeholder="Ej. Magdalena"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-[#7A002A] focus:ring-1 focus:ring-[#7A002A] text-sm"
                          />
                          <p className="text-[11px] text-gray-400 mt-1">
                            Aparece con tipografía caligráfica curva dentro del arco floral.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Subtítulo / Rol
                          </label>
                          <input
                            type="text"
                            value={formData.subtitulo || ""}
                            onChange={(e) => updateField("subtitulo", e.target.value)}
                            placeholder="Ej. LA QUINCEAÑERA / MY QUINCEAÑERA"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-[#7A002A] focus:ring-1 focus:ring-[#7A002A] text-sm"
                          />
                          <p className="text-[11px] text-gray-400 mt-1">
                            Texto en mayúsculas espaciadas debajo del nombre.
                          </p>
                        </div>
                      </div>

                      {/* Foto Portada con S3 */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Fotografía de Portada (Marco de Arco)
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-pink-200 bg-pink-50/30">
                          {formData.fotoPortadaUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={formData.fotoPortadaUrl}
                              alt="Portada"
                              className="w-20 h-28 object-cover rounded-t-full border-2 border-white shadow-md shrink-0"
                            />
                          ) : (
                            <div className="w-20 h-28 rounded-t-full bg-pink-100 flex items-center justify-center text-pink-400 shrink-0">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}

                          <div className="flex-1 text-center sm:text-left">
                            <p className="text-xs font-semibold text-gray-800">
                              Subir foto personalizada para el arco
                            </p>
                            <p className="text-[11px] text-gray-500 mb-2">
                              Formato vertical (preferible 9:16 o 3:4). Se ajusta automáticamente dentro de la curva del arco.
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A002A] text-white text-xs font-bold hover:bg-[#600021] transition cursor-pointer shadow-xs">
                                {uploadingS3 && uploadingField === "fotoPortadaUrl" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                <span>Cambiar Foto</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, "fotoPortadaUrl")}
                                  disabled={uploadingS3}
                                  className="hidden"
                                />
                              </label>
                              <input
                                type="text"
                                value={formData.fotoPortadaUrl}
                                onChange={(e) => updateField("fotoPortadaUrl", e.target.value)}
                                placeholder="O pega un enlace de imagen..."
                                className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 2: MEDALLÓN DE FECHA Y HORA
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "medallonFecha" && (
                    <div className="space-y-4">
                      {/* Switch secundario específico de la Hora */}
                      <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-[#7A002A]">
                            Mostrar Hora en el Medallón de Fecha
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Activa o desactiva la línea de hora (ej: "A LAS 4:00 PM" / "AT 4:00 PM") dentro del bloque del medallón.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.mostrarFechaPlacaHora !== false}
                          onClick={() =>
                            updateField(
                              "mostrarFechaPlacaHora",
                              formData.mostrarFechaPlacaHora === false ? true : false
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                            formData.mostrarFechaPlacaHora !== false ? "bg-[#7A002A]" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.mostrarFechaPlacaHora !== false
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Fecha y Hora del Evento (Selector Nativo)
                          </label>
                          <input
                            type="datetime-local"
                            value={
                              typeof formData.fechaEvento === "string"
                                ? formData.fechaEvento.slice(0, 16)
                                : new Date(formData.fechaEvento).toISOString().slice(0, 16)
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              updateField("fechaEvento", val);
                              const formatted = formatFormalDate(val, "es");
                              updateField("fechaTextoPersonalizada", formatted.formalText);
                              updateField("fechaPlacaMes", formatted.mes);
                              updateField("fechaPlacaHora", formatted.horaPlaca);
                              const formattedEn = formatFormalDate(val, "en");
                              updateField("fechaPlacaHoraEn", formattedEn.horaPlaca);
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Mes del Medallón (En mayúsculas)
                          </label>
                          <input
                            type="text"
                            value={formData.fechaPlacaMes || ""}
                            onChange={(e) => updateField("fechaPlacaMes", e.target.value)}
                            placeholder="Ej. MAYO / MAY"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Hora en Español (🇲🇽 ES)
                          </label>
                          <input
                            type="text"
                            value={formData.fechaPlacaHora || ""}
                            onChange={(e) => updateField("fechaPlacaHora", e.target.value)}
                            placeholder="Ej. A las 4:00 PM"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Hora en Inglés (🇺🇸 EN)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.fechaPlacaHoraEn || ""}
                              onChange={(e) => updateField("fechaPlacaHoraEn", e.target.value)}
                              placeholder="Ej. AT 4:00 PM"
                              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const formattedEn = formatFormalDate(formData.fechaEvento, "en");
                                updateField("fechaPlacaHoraEn", formattedEn.horaPlaca);
                              }}
                              className="px-3 py-2 rounded-xl bg-pink-100 text-[#7A002A] text-xs font-bold hover:bg-pink-200 transition shrink-0 cursor-pointer"
                            >
                              Auto EN
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 3: DEDICATORIA ("DE NIÑA A SEÑORITA")
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "dedicatoria" && (
                    <div className="space-y-4">
                      {/* Texto Emocional ES y EN */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Mensaje en Español (🇲🇽 ES)
                          </label>
                          <textarea
                            rows={4}
                            value={formData.frasePersonalizada || ""}
                            onChange={(e) => updateField("frasePersonalizada", e.target.value)}
                            placeholder="Hoy comienzo a escribir un nuevo capítulo..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Mensaje en Inglés (🇺🇸 EN)
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                translateWithAi(
                                  formData.frasePersonalizada || "",
                                  "frasePersonalizadaEn",
                                  "en"
                                )
                              }
                              disabled={translatingField === "frasePersonalizadaEn"}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7A002A] hover:underline cursor-pointer disabled:opacity-50"
                            >
                              {translatingField === "frasePersonalizadaEn" ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>
                                {translatingField === "frasePersonalizadaEn"
                                  ? "Traduciendo..."
                                  : "Traducir con IA"}
                              </span>
                            </button>
                          </div>
                          <textarea
                            rows={4}
                            value={formData.frasePersonalizadaEn || ""}
                            onChange={(e) => updateField("frasePersonalizadaEn", e.target.value)}
                            placeholder="Today I begin to write a new chapter..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>
                      </div>

                      {/* Las 2 Fotos Polaroids */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Polaroid 1: De Niña */}
                        <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/30 flex items-center gap-3">
                          {formData.fotoInfanciaUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={formData.fotoInfanciaUrl}
                              alt="De Niña"
                              className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-pink-100 flex items-center justify-center text-pink-400 shrink-0">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-800">
                              Polaroid 1: "De niña"
                            </p>
                            <p className="text-[11px] text-gray-500 mb-2 truncate">
                              Foto de su infancia con rosa decorativa.
                            </p>
                            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#7A002A] text-white text-[11px] font-bold hover:bg-[#600021] transition cursor-pointer">
                              {uploadingS3 && uploadingField === "fotoInfanciaUrl" ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Upload className="w-3 h-3" />
                              )}
                              <span>Subir Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "fotoInfanciaUrl")}
                                disabled={uploadingS3}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Polaroid 2: A Señorita */}
                        <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/30 flex items-center gap-3">
                          {formData.fotoActualUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={formData.fotoActualUrl}
                              alt="A Señorita"
                              className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-pink-100 flex items-center justify-center text-pink-400 shrink-0">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-800">
                              Polaroid 2: "A señorita"
                            </p>
                            <p className="text-[11px] text-gray-500 mb-2 truncate">
                              Foto actual de la festejada.
                            </p>
                            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#7A002A] text-white text-[11px] font-bold hover:bg-[#600021] transition cursor-pointer">
                              {uploadingS3 && uploadingField === "fotoActualUrl" ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Upload className="w-3 h-3" />
                              )}
                              <span>Subir Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "fotoActualUrl")}
                                disabled={uploadingS3}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 4: FOTO ZAPATILLAS 1
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "fotoZapatos1" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-pink-200 bg-pink-50/30">
                        {formData.fotoZapato1Url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={formData.fotoZapato1Url}
                            alt="Zapatillas 1"
                            className="w-24 h-28 object-cover rounded-2xl border-2 border-white shadow-md shrink-0"
                          />
                        ) : (
                          <div className="w-24 h-28 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-400 shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-xs font-bold text-gray-800">
                            Foto de Transición Previa a la Ceremonia
                          </p>
                          <p className="text-[11px] text-gray-500 mb-2">
                            Aparece encima del bloque de ubicaciones (iglesia y salón).
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A002A] text-white text-xs font-bold hover:bg-[#600021] transition cursor-pointer">
                              {uploadingS3 && uploadingField === "fotoZapato1Url" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Subir Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "fotoZapato1Url")}
                                disabled={uploadingS3}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={formData.fotoZapato1Url || ""}
                              onChange={(e) => updateField("fotoZapato1Url", e.target.value)}
                              placeholder="O pega URL de imagen..."
                              className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 6: UBICACIONES (CEREMONIA Y RECEPCIÓN)
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "ubicaciones" && (
                    <div className="space-y-5">
                      {/* Ceremonia Religiosa */}
                      <div className="p-4 rounded-xl border border-pink-100 bg-pink-50/20">
                        <h4 className="text-xs font-bold text-[#7A002A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>Ceremonia Religiosa (Iglesia)</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Nombre del Templo
                            </label>
                            <input
                              type="text"
                              value={formData.ceremoniaNombre || ""}
                              onChange={(e) => updateField("ceremoniaNombre", e.target.value)}
                              placeholder="St. Mary's Church"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Dirección
                            </label>
                            <input
                              type="text"
                              value={formData.ceremoniaDireccion || ""}
                              onChange={(e) => updateField("ceremoniaDireccion", e.target.value)}
                              placeholder="123 Main St, Los Angeles, CA"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Enlace de Google Maps
                            </label>
                            <input
                              type="text"
                              value={formData.ceremoniaMapUrl || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val.includes("<iframe") || val.includes("<IFRAME")) {
                                  const cleaned = extractCleanMapUrl(val, formData.ceremoniaNombre, formData.ceremoniaDireccion);
                                  updateField("ceremoniaMapUrl", cleaned || val);
                                } else {
                                  updateField("ceremoniaMapUrl", val);
                                }
                              }}
                              onPaste={(e) => {
                                const text = e.clipboardData.getData("text");
                                if (text.includes("<iframe") || text.includes("<IFRAME")) {
                                  e.preventDefault();
                                  const cleaned = extractCleanMapUrl(text, formData.ceremoniaNombre, formData.ceremoniaDireccion);
                                  updateField("ceremoniaMapUrl", cleaned || text);
                                }
                              }}
                              onBlur={() => {
                                if (formData.ceremoniaMapUrl && (formData.ceremoniaMapUrl.includes("<iframe") || formData.ceremoniaMapUrl.includes("<IFRAME"))) {
                                  const cleaned = extractCleanMapUrl(formData.ceremoniaMapUrl, formData.ceremoniaNombre, formData.ceremoniaDireccion);
                                  if (cleaned) updateField("ceremoniaMapUrl", cleaned);
                                }
                              }}
                              placeholder="https://maps.app.goo.gl/... o código <iframe>"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                            />
                            <MapShortLinkTester
                              rawUrl={formData.ceremoniaMapUrl}
                              name={formData.ceremoniaNombre}
                              address={formData.ceremoniaDireccion}
                              label="Misa / Ceremonia"
                              onAutoClean={(cleaned) => updateField("ceremoniaMapUrl", cleaned)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Recepción y Salón */}
                      <div className="p-4 rounded-xl border border-pink-100 bg-pink-50/20">
                        <h4 className="text-xs font-bold text-[#7A002A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>Recepción & Fiesta (Salón)</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Nombre del Salón
                            </label>
                            <input
                              type="text"
                              value={formData.recepcionNombre || ""}
                              onChange={(e) => updateField("recepcionNombre", e.target.value)}
                              placeholder="Grand Ballroom Palace"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Dirección
                            </label>
                            <input
                              type="text"
                              value={formData.recepcionDireccion || ""}
                              onChange={(e) => updateField("recepcionDireccion", e.target.value)}
                              placeholder="456 Event Ave, Los Angeles, CA"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Enlace de Google Maps
                            </label>
                            <input
                              type="text"
                              value={formData.recepcionMapUrl || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val.includes("<iframe") || val.includes("<IFRAME")) {
                                  const cleaned = extractCleanMapUrl(val, formData.recepcionNombre, formData.recepcionDireccion);
                                  updateField("recepcionMapUrl", cleaned || val);
                                } else {
                                  updateField("recepcionMapUrl", val);
                                }
                              }}
                              onPaste={(e) => {
                                const text = e.clipboardData.getData("text");
                                if (text.includes("<iframe") || text.includes("<IFRAME")) {
                                  e.preventDefault();
                                  const cleaned = extractCleanMapUrl(text, formData.recepcionNombre, formData.recepcionDireccion);
                                  updateField("recepcionMapUrl", cleaned || text);
                                }
                              }}
                              onBlur={() => {
                                if (formData.recepcionMapUrl && (formData.recepcionMapUrl.includes("<iframe") || formData.recepcionMapUrl.includes("<IFRAME"))) {
                                  const cleaned = extractCleanMapUrl(formData.recepcionMapUrl, formData.recepcionNombre, formData.recepcionDireccion);
                                  if (cleaned) updateField("recepcionMapUrl", cleaned);
                                }
                              }}
                              placeholder="https://maps.app.goo.gl/... o código <iframe>"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                            />
                            <MapShortLinkTester
                              rawUrl={formData.recepcionMapUrl}
                              name={formData.recepcionNombre}
                              address={formData.recepcionDireccion}
                              label="Salón / Recepción"
                              onAutoClean={(cleaned) => updateField("recepcionMapUrl", cleaned)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 7: CÓDIGO DE VESTIMENTA (DRESS CODE)
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "dressCode" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Título en Español (🇲🇽 ES)
                          </label>
                          <input
                            type="text"
                            value={formData.dressCodeTitulo || ""}
                            onChange={(e) => updateField("dressCodeTitulo", e.target.value)}
                            placeholder="ELEGANTE Y FORMAL"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Título en Inglés (🇺🇸 EN)
                          </label>
                          <input
                            type="text"
                            value={formData.dressCodeTituloEn || ""}
                            onChange={(e) => updateField("dressCodeTituloEn", e.target.value)}
                            placeholder="ELEGANT & FORMAL"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Nota y Colores Reservados (🇲🇽 ES)
                          </label>
                          <textarea
                            rows={3}
                            value={formData.dressCodeNota || ""}
                            onChange={(e) => updateField("dressCodeNota", e.target.value)}
                            placeholder="Acompáñanos en esta hermosa celebración... Por favor, NO usar atuendos ROSADOS..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Nota y Colores Reservados (🇺🇸 EN)
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                translateWithAi(formData.dressCodeNota || "", "dressCodeNotaEn", "en")
                              }
                              disabled={translatingField === "dressCodeNotaEn"}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7A002A] hover:underline cursor-pointer disabled:opacity-50"
                            >
                              {translatingField === "dressCodeNotaEn" ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>
                                {translatingField === "dressCodeNotaEn"
                                  ? "Traduciendo..."
                                  : "Traducir con IA"}
                              </span>
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={formData.dressCodeNotaEn || ""}
                            onChange={(e) => updateField("dressCodeNotaEn", e.target.value)}
                            placeholder="Join us in this wonderful celebration... Blush pink tones reserved exclusively..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 8: MESA DE REGALOS / LLUVIA DE SOBRES
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "mesaRegalos" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Mensaje del Cofre (🇲🇽 ES)
                          </label>
                          <textarea
                            rows={3}
                            value={formData.regalosMensaje || ""}
                            onChange={(e) => updateField("regalosMensaje", e.target.value)}
                            placeholder="Tu presencia es nuestro mayor regalo. Disponemos de un cofre en la recepción."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Mensaje del Cofre (🇺🇸 EN)
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                translateWithAi(formData.regalosMensaje || "", "regalosMensajeEn", "en")
                              }
                              disabled={translatingField === "regalosMensajeEn"}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7A002A] hover:underline cursor-pointer disabled:opacity-50"
                            >
                              {translatingField === "regalosMensajeEn" ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>
                                {translatingField === "regalosMensajeEn"
                                  ? "Traduciendo..."
                                  : "Traducir con IA"}
                              </span>
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={formData.regalosMensajeEn || ""}
                            onChange={(e) => updateField("regalosMensajeEn", e.target.value)}
                            placeholder="Your presence is our greatest gift. A gift box will be available at the reception."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Cuenta Zelle
                          </label>
                          <input
                            type="text"
                            value={formData.regalosZelle || ""}
                            onChange={(e) => updateField("regalosZelle", e.target.value)}
                            placeholder="Teléfono o Email Zelle"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            CashApp / Venmo
                          </label>
                          <input
                            type="text"
                            value={formData.regalosCashApp || ""}
                            onChange={(e) => updateField("regalosCashApp", e.target.value)}
                            placeholder="$Cashtag o @Venmo"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Wishlist / Amazon URL
                          </label>
                          <input
                            type="text"
                            value={formData.wishlistUrl || ""}
                            onChange={(e) => updateField("wishlistUrl", e.target.value)}
                            placeholder="https://amazon.com/baby-reg/..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 9: EL PLAN DE LA FIESTA (ITINERARIO)
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "itinerario" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-gray-500">
                          Línea de tiempo decorada con rosas en la plantilla. Puedes agregar, editar horas y títulos en ES y EN.
                        </p>
                        <button
                          type="button"
                          onClick={handleTranslateAllItinerario}
                          disabled={translatingAllItinerario}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A002A] text-white text-xs font-bold hover:bg-[#600021] transition cursor-pointer shadow-xs shrink-0"
                        >
                          {translatingAllItinerario ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>Traducir Todo el Itinerario con IA</span>
                        </button>
                      </div>

                      {/* Lista de hitos interactiva */}
                      <div className="space-y-3">
                        {((formData.itinerarioJson as any[]) || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/20 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#7A002A] text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>

                            <div className="w-28 shrink-0">
                              <input
                                type="text"
                                value={item.hora || ""}
                                onChange={(e) => {
                                  const updated = [...((formData.itinerarioJson as any[]) || [])];
                                  updated[idx] = { ...updated[idx], hora: e.target.value };
                                  updateField("itinerarioJson", updated);
                                }}
                                placeholder="4:00 PM"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#B74F5F]"
                              />
                            </div>

                            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={item.titulo || ""}
                                onChange={(e) => {
                                  const updated = [...((formData.itinerarioJson as any[]) || [])];
                                  updated[idx] = { ...updated[idx], titulo: e.target.value };
                                  updateField("itinerarioJson", updated);
                                }}
                                placeholder="Título en Español (🇲🇽 ES)"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-900"
                              />

                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={item.tituloEn || ""}
                                  onChange={(e) => {
                                    const updated = [...((formData.itinerarioJson as any[]) || [])];
                                    updated[idx] = { ...updated[idx], tituloEn: e.target.value };
                                    updateField("itinerarioJson", updated);
                                  }}
                                  placeholder="Title in English (🇺🇸 EN)"
                                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-900"
                                />
                                <button
                                  type="button"
                                  disabled={translatingField === `itinerario-${idx}`}
                                  onClick={async () => {
                                    if (!item.titulo) return;
                                    setTranslatingField(`itinerario-${idx}`);
                                    try {
                                      const res = await fetch("/api/translate", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ text: item.titulo, targetLang: "en" }),
                                      });
                                      const data = await res.json();
                                      if (data.translatedText) {
                                        const updated = [...((formData.itinerarioJson as any[]) || [])];
                                        updated[idx] = { ...updated[idx], tituloEn: data.translatedText };
                                        updateField("itinerarioJson", updated);
                                      }
                                    } catch (e) {
                                      console.error(e);
                                    } finally {
                                      setTranslatingField(null);
                                    }
                                  }}
                                  title="Traducir este hito con IA"
                                  className="px-2 py-1 rounded-lg bg-pink-100 text-[#7A002A] text-xs hover:bg-pink-200 transition cursor-pointer shrink-0 disabled:opacity-50"
                                >
                                  {translatingField === `itinerario-${idx}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = ((formData.itinerarioJson as any[]) || []).filter(
                                  (_, i) => i !== idx
                                );
                                updateField("itinerarioJson", updated);
                              }}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition cursor-pointer self-end sm:self-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...((formData.itinerarioJson as any[]) || []),
                              { hora: "9:00 PM", titulo: "Nuevo Momento", tituloEn: "New Milestone", tipoIcono: "party" },
                            ];
                            updateField("itinerarioJson", updated);
                          }}
                          className="w-full py-2.5 rounded-xl border-2 border-dashed border-pink-200 text-[#7A002A] text-xs font-bold hover:bg-pink-50/50 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar Hito al Itinerario</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 10: FOTO ZAPATOS 2 / PARA NUESTROS NIÑOS
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "fotoZapatos2" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-pink-200 bg-pink-50/30">
                        {formData.fotoZapato2Url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={formData.fotoZapato2Url}
                            alt="Zapatilla 2"
                            className="w-24 h-20 object-cover rounded-xl border-2 border-white shadow-md shrink-0"
                          />
                        ) : (
                          <div className="w-24 h-20 rounded-xl bg-pink-100 flex items-center justify-center text-pink-400 shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-xs font-bold text-gray-800">
                            Foto Zapatilla en Cojín / Corte
                          </p>
                          <p className="text-[11px] text-gray-500 mb-2">
                            Aparece debajo del itinerario junto a la dedicatoria final y pautas para pequeños invitados.
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A002A] text-white text-xs font-bold hover:bg-[#600021] transition cursor-pointer">
                              {uploadingS3 && uploadingField === "fotoZapato2Url" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Subir Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "fotoZapato2Url")}
                                disabled={uploadingS3}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={formData.fotoZapato2Url || ""}
                              onChange={(e) => updateField("fotoZapato2Url", e.target.value)}
                              placeholder="O pega URL de imagen..."
                              className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Mensaje Breve de Despedida (Debajo de la Foto)
                        </label>
                        <input
                          type="text"
                          value={formData.mensajeDespedida || ""}
                          onChange={(e) => updateField("mensajeDespedida", e.target.value)}
                          placeholder="No puedo celebrar sin ti / I can’t celebrate without you"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                        />
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 11: CORTE DE HONOR & PADRES / PADRINOS
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "corteHonor" && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">
                        Configura individualmente la visibilidad y nombres de cada integrante de la corte de honor y familia:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Quinceañera & Mini Quinceañera */}
                        <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#7A002A]">Quinceañera</label>
                            <input
                              type="checkbox"
                              checked={formData.corteHonorJson?.showQuinceanera !== false}
                              onChange={(e) => {
                                const c = { ...(formData.corteHonorJson || {}) };
                                c.showQuinceanera = e.target.checked;
                                updateField("corteHonorJson", c);
                              }}
                              className="rounded text-[#7A002A]"
                            />
                          </div>
                          <input
                            type="text"
                            value={formData.corteHonorJson?.quinceanera || formData.titulo || ""}
                            onChange={(e) => {
                              const c = { ...(formData.corteHonorJson || {}) };
                              c.quinceanera = e.target.value;
                              updateField("corteHonorJson", c);
                            }}
                            placeholder="Nombre de la Quinceañera"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                          />

                          <div className="flex items-center justify-between pt-2">
                            <label className="text-xs font-bold text-[#7A002A]">Mini Quinceañera</label>
                            <input
                              type="checkbox"
                              checked={Boolean(formData.corteHonorJson?.showMiniQuinceanera)}
                              onChange={(e) => {
                                const c = { ...(formData.corteHonorJson || {}) };
                                c.showMiniQuinceanera = e.target.checked;
                                updateField("corteHonorJson", c);
                              }}
                              className="rounded text-[#7A002A]"
                            />
                          </div>
                          <input
                            type="text"
                            value={formData.corteHonorJson?.miniQuinceanera || ""}
                            onChange={(e) => {
                              const c = { ...(formData.corteHonorJson || {}) };
                              c.miniQuinceanera = e.target.value;
                              updateField("corteHonorJson", c);
                            }}
                            placeholder="Nombre (opcional)"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                          />
                        </div>

                        {/* Chambelán & Mini Chambelán */}
                        <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#7A002A]">Chambelán Principal</label>
                            <input
                              type="checkbox"
                              checked={Boolean(formData.corteHonorJson?.showChambelan)}
                              onChange={(e) => {
                                const c = { ...(formData.corteHonorJson || {}) };
                                c.showChambelan = e.target.checked;
                                updateField("corteHonorJson", c);
                              }}
                              className="rounded text-[#7A002A]"
                            />
                          </div>
                          <input
                            type="text"
                            value={formData.corteHonorJson?.chambelan || ""}
                            onChange={(e) => {
                              const c = { ...(formData.corteHonorJson || {}) };
                              c.chambelan = e.target.value;
                              updateField("corteHonorJson", c);
                            }}
                            placeholder="Nombre del Chambelán"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                          />

                          <div className="flex items-center justify-between pt-2">
                            <label className="text-xs font-bold text-[#7A002A]">Mini Chambelán</label>
                            <input
                              type="checkbox"
                              checked={Boolean(formData.corteHonorJson?.showMiniChambelan)}
                              onChange={(e) => {
                                const c = { ...(formData.corteHonorJson || {}) };
                                c.showMiniChambelan = e.target.checked;
                                updateField("corteHonorJson", c);
                              }}
                              className="rounded text-[#7A002A]"
                            />
                          </div>
                          <input
                            type="text"
                            value={formData.corteHonorJson?.miniChambelan || ""}
                            onChange={(e) => {
                              const c = { ...(formData.corteHonorJson || {}) };
                              c.miniChambelan = e.target.value;
                              updateField("corteHonorJson", c);
                            }}
                            placeholder="Nombre (opcional)"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                          />
                        </div>
                      </div>

                      {/* Damas y Damitas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#7A002A]">Damiselas de Honor</label>
                            <input
                              type="checkbox"
                              checked={Boolean(formData.corteHonorJson?.showDamas)}
                              onChange={(e) => {
                                const c = { ...(formData.corteHonorJson || {}) };
                                c.showDamas = e.target.checked;
                                updateField("corteHonorJson", c);
                              }}
                              className="rounded text-[#7A002A]"
                            />
                          </div>
                          <input
                            type="text"
                            value={
                              Array.isArray(formData.corteHonorJson?.damas)
                                ? formData.corteHonorJson?.damas.join(", ")
                                : formData.corteHonorJson?.damas || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const arr = val.split(",").map((s) => s.trim()).filter(Boolean);
                              const c = { ...(formData.corteHonorJson || {}) };
                              c.damas = arr;
                              updateField("corteHonorJson", c);
                            }}
                            placeholder="Separadas por comas: Violeta, Zoe, Tania..."
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                          />
                        </div>

                        <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#7A002A]">Damitas de Hojitas</label>
                            <input
                              type="checkbox"
                              checked={Boolean(formData.corteHonorJson?.showDamitasHojitas)}
                              onChange={(e) => {
                                const c = { ...(formData.corteHonorJson || {}) };
                                c.showDamitasHojitas = e.target.checked;
                                updateField("corteHonorJson", c);
                              }}
                              className="rounded text-[#7A002A]"
                            />
                          </div>
                          <input
                            type="text"
                            value={
                              Array.isArray(formData.corteHonorJson?.damitasHojitas)
                                ? formData.corteHonorJson?.damitasHojitas.join(", ")
                                : formData.corteHonorJson?.damitasHojitas || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const arr = val.split(",").map((s) => s.trim()).filter(Boolean);
                              const c = { ...(formData.corteHonorJson || {}) };
                              c.damitasHojitas = arr;
                              updateField("corteHonorJson", c);
                            }}
                            placeholder="Separadas por comas: Green, Zoe..."
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                          />
                        </div>
                      </div>

                      {/* Padres y Padrinos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#7A002A]">Mis Padres</label>
                            <input
                              type="checkbox"
                              checked={Boolean(formData.corteHonorJson?.showParents)}
                              onChange={(e) => {
                                const c = { ...(formData.corteHonorJson || {}) };
                                c.showParents = e.target.checked;
                                updateField("corteHonorJson", c);
                              }}
                              className="rounded text-[#7A002A]"
                            />
                          </div>
                          <input
                            type="text"
                            value={formData.corteHonorJson?.parents || ""}
                            onChange={(e) => {
                              const c = { ...(formData.corteHonorJson || {}) };
                              c.parents = e.target.value;
                              updateField("corteHonorJson", c);
                            }}
                            placeholder="Ej. Magdalena & Adrian"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                          />
                        </div>

                        <div className="p-3.5 rounded-xl border border-pink-100 bg-pink-50/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#7A002A]">Padrinos de Honor</label>
                            <input
                              type="checkbox"
                              checked={Boolean(formData.corteHonorJson?.showPadrinos)}
                              onChange={(e) => {
                                const c = { ...(formData.corteHonorJson || {}) };
                                c.showPadrinos = e.target.checked;
                                updateField("corteHonorJson", c);
                              }}
                              className="rounded text-[#7A002A]"
                            />
                          </div>
                          <input
                            type="text"
                            value={
                              Array.isArray(formData.corteHonorJson?.padrinos)
                                ? formData.corteHonorJson?.padrinos.join(" & ")
                                : formData.corteHonorJson?.padrinos || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const arr = val.split(/[&,]/).map((s) => s.trim()).filter(Boolean);
                              const c = { ...(formData.corteHonorJson || {}) };
                              c.padrinos = arr;
                              updateField("corteHonorJson", c);
                            }}
                            placeholder="Ej. Tania & Carl"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                          />
                        </div>
                      </div>

                      {/* Mensaje de Gratitud */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Mensaje de Agradecimiento Especial
                        </label>
                        <textarea
                          rows={3}
                          value={formData.corteHonorJson?.mensajeGratitud || ""}
                          onChange={(e) => {
                            const c = { ...(formData.corteHonorJson || {}) };
                            c.mensajeGratitud = e.target.value;
                            updateField("corteHonorJson", c);
                          }}
                          placeholder="Con infinita gratitud por su amor, apoyo y generosidad..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                        />
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 12: CUENTA REGRESIVA & CALENDARIO
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "cuentaRegresiva" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Encabezado de Cierre
                        </label>
                        <input
                          type="text"
                          value={formData.countdownEncabezado || ""}
                          onChange={(e) => updateField("countdownEncabezado", e.target.value)}
                          placeholder="Faltan sólo... / Counting down..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                          Calcula automáticamente los días, horas, minutos y segundos hacia la fecha del evento, e ilustra el mes con un lazo en el día de la celebración.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 13: VIDEO EMBED & RETRATO FINAL
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "videoDespedida" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Enlace de Video (YouTube o MP4)
                        </label>
                        <input
                          type="text"
                          value={formData.videoUrl || ""}
                          onChange={(e) => updateField("videoUrl", e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... o enlace .mp4"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#7A002A]"
                        />
                      </div>

                      {/* Foto Retrato Final */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-pink-200 bg-pink-50/30">
                        {formData.fotoCierreUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={formData.fotoCierreUrl}
                            alt="Foto Despedida"
                            className="w-20 h-28 object-cover rounded-t-full border-2 border-white shadow-md shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-28 rounded-t-full bg-pink-100 flex items-center justify-center text-pink-400 shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-xs font-bold text-gray-800">
                            Foto Arqueada de Despedida
                          </p>
                          <p className="text-[11px] text-gray-500 mb-2">
                            Retrato final que cierra la invitación con la frase "Con amor y gratitud... te estaré esperando".
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A002A] text-white text-xs font-bold hover:bg-[#600021] transition cursor-pointer">
                              {uploadingS3 && uploadingField === "fotoCierreUrl" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Subir Retrato</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "fotoCierreUrl")}
                                disabled={uploadingS3}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={formData.fotoCierreUrl || ""}
                              onChange={(e) => updateField("fotoCierreUrl", e.target.value)}
                              placeholder="O pega URL de imagen..."
                              className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      SECCIÓN 14: MÚSICA DE FONDO AMBIENTAL
                  ────────────────────────────────────────────────────────── */}
                  {sec.id === "musica" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-pink-200 bg-pink-50/30">
                        <div className="w-12 h-12 rounded-full bg-[#7A002A] text-white flex items-center justify-center shrink-0 shadow-md">
                          <Music className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-xs font-bold text-gray-800">
                            Canción Instrumental o Tema Musical (MP3)
                          </p>
                          <p className="text-[11px] text-gray-500 mb-2">
                            Se reproduce suavemente al abrir el sobre o mediante el botón flotante.
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A002A] text-white text-xs font-bold hover:bg-[#600021] transition cursor-pointer">
                              {uploadingS3 && uploadingField === "musicaUrl" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Subir Audio MP3</span>
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileUpload(e, "musicaUrl", "audio")}
                                disabled={uploadingS3}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={formData.musicaUrl || ""}
                              onChange={(e) => updateField("musicaUrl", e.target.value)}
                              placeholder="O pega enlace directo a archivo .mp3..."
                              className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-[#7A002A]">
                            Reproducir automáticamente al abrir el sobre
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Inicia la música tan pronto como el invitado toca el sello del sobre virtual.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.reproducirMusicaAlAbrir !== false}
                          onClick={() =>
                            updateField(
                              "reproducirMusicaAlAbrir",
                              formData.reproducirMusicaAlAbrir === false ? true : false
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                            formData.reproducirMusicaAlAbrir !== false
                              ? "bg-[#7A002A]"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.reproducirMusicaAlAbrir !== false
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
