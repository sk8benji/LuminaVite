"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Palette,
  Music,
  ExternalLink,
  Edit3,
  Check,
  Play,
  Square,
  Search,
  Sparkles,
  Type,
  Mail,
  Image as ImageIcon,
  RefreshCw,
  ArrowLeft,
  Upload,
  Calendar,
  MapPin,
  Gift,
  Users,
  Shirt,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Smartphone,
} from "lucide-react";
import { MasterTemplateItem } from "@/lib/templates-data";
import TemplateDispatcher from "@/components/templates/TemplateDispatcher";
import { InvitationData } from "@/components/invitation/InvitationMobileView";

export default function TemplatesManager() {
  const [templates, setTemplates] = useState<MasterTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "QUINCEANERA" | "BODA" | "CUMPLEANOS">("ALL");

  // Estado de plantilla en edición
  const [editingTemplate, setEditingTemplate] = useState<MasterTemplateItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<MasterTemplateItem>>({});
  const [activeSection, setActiveSection] = useState<
    "musica" | "sobre" | "textos" | "fechas" | "lugares" | "dresscode" | "regalos" | "corte" | "fotos"
  >("musica");

  // Opciones de visualizador en vivo
  const [skipIntroPreview, setSkipIntroPreview] = useState(false);
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);

  // Estado de subida a S3
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Reproductor de audio de prueba en inputs
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchTemplates = () => {
    setLoading(true);
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.templates) {
          setTemplates(data.templates);
        }
      })
      .catch((err) => console.error("Error cargando templates:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTogglePlayAudio = (url: string) => {
    if (!url) return;
    if (playingAudioUrl === url) {
      audioRef.current?.pause();
      setPlayingAudioUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => setPlayingAudioUrl(null);
      setPlayingAudioUrl(url);
    }
  };

  const handleOpenEdit = (template: MasterTemplateItem) => {
    setEditingTemplate(template);
    setEditForm({ ...template });
    setActiveSection("musica");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseEdit = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioUrl(null);
    }
    setEditingTemplate(null);
  };

  // Subida de archivos (Canción o Imágenes) directamente a AWS S3
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof MasterTemplateItem,
    isAudio: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingTemplate) return;

    setUploadingField(fieldName as string);
    setErrorToast(null);

    try {
      let resolvedType = file.type;
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!resolvedType || resolvedType === "application/octet-stream") {
        if (["mp3"].includes(ext)) resolvedType = "audio/mpeg";
        else if (["wav"].includes(ext)) resolvedType = "audio/wav";
        else if (["m4a"].includes(ext)) resolvedType = "audio/m4a";
        else if (["jpg", "jpeg"].includes(ext)) resolvedType = "image/jpeg";
        else if (["png"].includes(ext)) resolvedType = "image/png";
        else if (["webp"].includes(ext)) resolvedType = "image/webp";
      }

      const folder = isAudio ? "templates/audio" : "templates/images";

      // 1. Pedir presigned URL a la API
      const presignedRes = await fetch("/api/s3/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: resolvedType,
          folder,
          fileSize: file.size,
        }),
      });

      const presignedData = await presignedRes.json();
      if (!presignedRes.ok) {
        throw new Error(presignedData.error || "No se pudo obtener enlace firmado de S3");
      }

      // 2. Subir binario a S3
      const uploadRes = await fetch(presignedData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": resolvedType },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Falló la transferencia del archivo a S3.");
      }

      // 3. Actualizar campo con la URL pública de S3
      setEditForm((prev) => {
        const next = { ...prev, [fieldName]: presignedData.fileUrl };
        if (isAudio && !prev.musicaTitulo) {
          next.musicaTitulo = file.name.replace(/\.[^/.]+$/, "");
        }
        return next;
      });

      setSuccessToast(`¡${isAudio ? "Canción" : "Imagen"} subida exitosamente a S3!`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorToast(err.message || "Error al subir archivo a AWS S3");
      setTimeout(() => setErrorToast(null), 4000);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingTemplate) return;

    setSaving(true);
    setErrorToast(null);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: editingTemplate.slug,
          ...editForm,
        }),
      });

      if (res.ok) {
        setSuccessToast("¡Plantilla maestra guardada con éxito!");
        setTimeout(() => setSuccessToast(null), 3000);
        fetchTemplates();
      } else {
        setErrorToast("Error al guardar la plantilla en el servidor.");
      }
    } catch (err) {
      console.error(err);
      setErrorToast("Error de conexión al guardar.");
    } finally {
      setSaving(false);
    }
  };

  // Mapeo dinámico a InvitationData para el simulador en vivo a la derecha
  const buildLivePreviewData = (): InvitationData => {
    if (!editingTemplate) {
      return {} as InvitationData;
    }

    return {
      id: editingTemplate.id || "preview-template",
      slug: editingTemplate.slug,
      tipoEvento: (editForm.categoria as any) || "QUINCEANERA",
      estiloPlantilla: (editForm.estiloPlantilla as any) || "BLUE_BUTTERFLY",
      titulo: editForm.titulo || "Valeria Morales",
      subtitulo: editForm.subtitulo || "My Quinceañera",
      frasePersonalizada: editForm.frasePersonalizada || "",
      fechaEvento: new Date("2026-10-24T15:00:00Z"),
      fechaTextoPersonalizada: editForm.fechaTextoPersonalizada || "SATURDAY, OCTOBER 24, 2026 AT 3 PM",
      fechaPlacaMes: editForm.fechaPlacaMes || "OCTUBRE",
      fechaPlacaHora: editForm.fechaPlacaHora || "A LAS 3:00 PM",
      fechaPlacaLugar: editForm.fechaPlacaLugar || editForm.recepcionNombre || "QUINCE PALACE",
      countdownEncabezado: editForm.countdownEncabezado || "Faltan sólo...",
      fotoPortadaUrl: editForm.fotoPortadaUrl || "/assets/template-butterfly/foto-columpio-portada.png",
      fotoInfanciaUrl: editForm.fotoInfanciaUrl || "",
      fotoActualUrl: editForm.fotoActualUrl || "",
      fotoCierreUrl: editForm.fotoCierreUrl || "",
      musicaUrl: editForm.musicaUrl || "",
      musicaTitulo: editForm.musicaTitulo || "",
      textoDisco: editForm.textoDisco || "Click to Play Music",
      telefonoWhatsappRsvp: editForm.telefonoWhatsappRsvp || "18181234567",
      recepcionNombre: editForm.recepcionNombre || "Salón de Gala",
      recepcionDireccion: editForm.recepcionDireccion || "123 Event St, Los Angeles, CA",
      recepcionMapUrl: editForm.recepcionMapUrl || "https://maps.google.com",
      ceremoniaNombre: editForm.ceremoniaNombre || "",
      ceremoniaDireccion: editForm.ceremoniaDireccion || "",
      ceremoniaMapUrl: editForm.ceremoniaMapUrl || "",
      dressCodeTitulo: editForm.dressCodeTitulo || "Formal & Elegant",
      dressCodeEtiqueta: editForm.dressCodeEtiqueta || "Formal & Rigurosa Etiqueta",
      dressCodeNota: editForm.dressCodeNota || "",
      dressCodeColoresReservados: editForm.dressCodeColoresReservados || "",
      regalosMensaje: editForm.regalosMensaje || "",
      regalosZelle: editForm.regalosZelle || "",
      regalosCashApp: editForm.regalosCashApp || "",
      rsvpFechaLimite: editForm.rsvpFechaLimite || "20 de Octubre",
      maxPasesPorInvitado: editForm.maxPasesPorInvitado ?? 3,
      mensajeDespedida: editForm.mensajeDespedida || "",
      autorBendicion: editForm.autorBendicion || "Con amor, tu familia",
      corteHonorJson: editForm.corteHonorJson || {},
      itinerarioJson: editForm.itinerarioJson || [],
      configPlantilla: {
        colorSobre: editForm.colorSobre || "#E8D5C4",
        colorSello: editForm.colorSello || "#C5A059",
        tipoLetra: editForm.tipoLetra || "Cinzel",
        ...(editForm.configExtra || {}),
      },
    };
  };

  const sectionsList = [
    { id: "musica", label: "Música & Audio", icon: Music },
    { id: "sobre", label: "Sobre 3D & Tipografía", icon: Mail },
    { id: "textos", label: "Textos Principales", icon: Sparkles },
    { id: "fechas", label: "Fecha & Medallón", icon: Calendar },
    { id: "lugares", label: "Recepción & Misa", icon: MapPin },
    { id: "dresscode", label: "Dress Code", icon: Shirt },
    { id: "regalos", label: "Regalos & RSVP", icon: Gift },
    { id: "corte", label: "Corte & Programa", icon: Users },
    { id: "fotos", label: "Fotos & Galería", icon: ImageIcon },
  ] as const;

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.titulo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || tpl.categoria === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // =========================================================================
  // VISTA 2: EDITOR VERTICAL CON PREVISUALIZACIÓN EN VIVO A LA DERECHA
  // =========================================================================
  if (editingTemplate) {
    const liveData = buildLivePreviewData();

    return (
      <div className="space-y-6 pb-20 animate-in fade-in duration-200">
        {/* Barra Superior Fija del Editor */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseEdit}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              title="Volver al Catálogo"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-stone-900 leading-tight">
                  {editingTemplate.nombre}
                </span>
                <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200">
                  /{editingTemplate.slug}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Ajusta las secciones en vertical y observa los cambios en vivo en el smartphone de la derecha
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Botón flotante para ver preview en móviles */}
            <button
              type="button"
              onClick={() => setShowMobilePreviewModal(!showMobilePreviewModal)}
              className="xl:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{showMobilePreviewModal ? "Ocultar Teléfono" : "Ver Teléfono"}</span>
            </button>

            <a
              href={`https://clickandlove.app/demo/${editingTemplate.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
            >
              <span>Ver Demo en Vivo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notificaciones flotantes */}
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

        {/* LAYOUT PRINCIPAL: Formulario Vertical a la Izquierda + Smartphone Simulator a la Derecha */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* COLUMNA IZQUIERDA (7 Columnas): Menú Vertical & Formulario */}
          {/* ============================================================== */}
          <div className={`xl:col-span-7 space-y-6 ${showMobilePreviewModal ? "hidden xl:block" : "block"}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Menú Vertical Lateral de Secciones */}
              <div className="md:col-span-4 space-y-1.5 bg-stone-100 p-2 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1 block">
                  Secciones de la Invitación
                </span>
                {sectionsList.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                        isActive
                          ? "bg-white text-stone-900 shadow-xs font-bold border-l-4 border-l-[#C5A059]"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A059]" : "text-stone-400"}`} />
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Formulario de la Sección Activa */}
              <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
                {/* 1. MÚSICA & AUDIO */}
                {activeSection === "musica" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Música & Audio del Demo</h3>
                      <p className="text-[11px] text-stone-500">Canción que suena al abrir el sobre en la web pública.</p>
                    </div>

                    {/* Subida directa S3 */}
                    <div className="p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#C5A059] transition text-center space-y-2">
                      <Music className="w-6 h-6 mx-auto text-[#C5A059]" />
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingField === "musicaUrl" ? "Subiendo a S3..." : "Subir Canción (.mp3, .wav, .m4a)"}</span>
                        <input
                          type="file"
                          accept="audio/*,.mp3,.wav,.m4a"
                          onChange={(e) => handleFileUpload(e, "musicaUrl", true)}
                          disabled={uploadingField === "musicaUrl"}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-stone-400">Sube directo a AWS S3 sin límites de tamaño.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Título / Artista de la Canción:</label>
                      <input
                        type="text"
                        placeholder="Ej. Photograph - Ed Sheeran"
                        value={editForm.musicaTitulo || ""}
                        onChange={(e) => setEditForm({ ...editForm, musicaTitulo: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">URL del Audio MP3:</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://.../cancion.mp3"
                          value={editForm.musicaUrl || ""}
                          onChange={(e) => setEditForm({ ...editForm, musicaUrl: e.target.value })}
                          className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                        />
                        {editForm.musicaUrl && (
                          <button
                            type="button"
                            onClick={() => handleTogglePlayAudio(editForm.musicaUrl || "")}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {playingAudioUrl === editForm.musicaUrl ? (
                              <Square className="w-3.5 h-3.5 fill-current text-red-600" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Texto del Disco Giratorio:</label>
                      <input
                        type="text"
                        placeholder="Ej. Toca para Escuchar Música"
                        value={editForm.textoDisco || ""}
                        onChange={(e) => setEditForm({ ...editForm, textoDisco: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 2. SOBRE 3D & TIPOGRAFÍA */}
                {activeSection === "sobre" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Sobre 3D & Tipografía de Gala</h3>
                      <p className="text-[11px] text-stone-500">Colores físicos del sobre de apertura y tipografía.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                        <label className="text-xs font-bold text-stone-800 block">Color del Sobre Exterior:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editForm.colorSobre || "#E8D5C4"}
                            onChange={(e) => setEditForm({ ...editForm, colorSobre: e.target.value })}
                            className="w-10 h-10 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            value={editForm.colorSobre || "#E8D5C4"}
                            onChange={(e) => setEditForm({ ...editForm, colorSobre: e.target.value })}
                            className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono uppercase w-28"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                        <label className="text-xs font-bold text-stone-800 block">Sello de Cera (Lacre):</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editForm.colorSello || "#C5A059"}
                            onChange={(e) => setEditForm({ ...editForm, colorSello: e.target.value })}
                            className="w-10 h-10 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            value={editForm.colorSello || "#C5A059"}
                            onChange={(e) => setEditForm({ ...editForm, colorSello: e.target.value })}
                            className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono uppercase w-28"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Tipografía de la Invitación:</label>
                      <select
                        value={editForm.tipoLetra || "Cinzel"}
                        onChange={(e) => setEditForm({ ...editForm, tipoLetra: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                      >
                        <option value="Cinzel">Cinzel (Clásica & Lujo Imperial)</option>
                        <option value="Playfair Display">Playfair Display (Elegante & Serifas)</option>
                        <option value="Great Vibes">Great Vibes (Cursiva & Caligráfica)</option>
                        <option value="Montserrat">Montserrat (Minimalista & Moderna)</option>
                        <option value="Cormorant Garamond">Cormorant Garamond (Editorial de Moda)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. TEXTOS PRINCIPALES */}
                {activeSection === "textos" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Textos Principales</h3>
                      <p className="text-[11px] text-stone-500">Títulos, subtítulo y frase dedicatoria emocional.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Título / Nombre Festejado:</label>
                      <input
                        type="text"
                        placeholder="Ej. Valeria Morales o Emma & Lucas"
                        value={editForm.titulo || ""}
                        onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Subtítulo:</label>
                      <input
                        type="text"
                        placeholder="Ej. My Quinceañera o Nos Casamos"
                        value={editForm.subtitulo || ""}
                        onChange={(e) => setEditForm({ ...editForm, subtitulo: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Frase Dedicatoria / Emocional:</label>
                      <textarea
                        rows={3}
                        value={editForm.frasePersonalizada || ""}
                        onChange={(e) => setEditForm({ ...editForm, frasePersonalizada: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Firma o Autor de Bendición:</label>
                      <input
                        type="text"
                        placeholder="Ej. Con amor, tu familia"
                        value={editForm.autorBendicion || ""}
                        onChange={(e) => setEditForm({ ...editForm, autorBendicion: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Mensaje de Despedida:</label>
                      <input
                        type="text"
                        placeholder="Ej. See You Soon! Esperamos contar con tu presencia."
                        value={editForm.mensajeDespedida || ""}
                        onChange={(e) => setEditForm({ ...editForm, mensajeDespedida: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 4. FECHA & MEDALLÓN */}
                {activeSection === "fechas" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Fecha del Evento & Medallón</h3>
                      <p className="text-[11px] text-stone-500">Composición del medallón dorado y cuenta regresiva.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Texto Completo de Fecha:</label>
                      <input
                        type="text"
                        placeholder="Ej. SÁBADO 24 DE OCTUBRE, 2026 • 4:00 PM"
                        value={editForm.fechaTextoPersonalizada || ""}
                        onChange={(e) => setEditForm({ ...editForm, fechaTextoPersonalizada: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">Mes en Medallón:</label>
                        <input
                          type="text"
                          placeholder="OCTUBRE"
                          value={editForm.fechaPlacaMes || ""}
                          onChange={(e) => setEditForm({ ...editForm, fechaPlacaMes: e.target.value })}
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">Hora en Medallón:</label>
                        <input
                          type="text"
                          placeholder="A LAS 4:00 PM"
                          value={editForm.fechaPlacaHora || ""}
                          onChange={(e) => setEditForm({ ...editForm, fechaPlacaHora: e.target.value })}
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Lugar en Medallón:</label>
                      <input
                        type="text"
                        placeholder="GRAN SALÓN REAL"
                        value={editForm.fechaPlacaLugar || ""}
                        onChange={(e) => setEditForm({ ...editForm, fechaPlacaLugar: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Contador Regresivo:</label>
                      <input
                        type="text"
                        placeholder="Faltan sólo..."
                        value={editForm.countdownEncabezado || ""}
                        onChange={(e) => setEditForm({ ...editForm, countdownEncabezado: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 5. LUGARES (RECEPCIÓN & MISA) */}
                {activeSection === "lugares" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Lugares & Mapas GPS</h3>
                      <p className="text-[11px] text-stone-500">Recepción de gala y ceremonia religiosa.</p>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <span className="text-xs font-bold text-stone-800 block">Salón de Recepción</span>
                      <input
                        type="text"
                        placeholder="Nombre del Salón (Ej. Quince Palace)"
                        value={editForm.recepcionNombre || ""}
                        onChange={(e) => setEditForm({ ...editForm, recepcionNombre: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Dirección del Salón"
                        value={editForm.recepcionDireccion || ""}
                        onChange={(e) => setEditForm({ ...editForm, recepcionDireccion: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <input
                        type="url"
                        placeholder="Enlace Google Maps / Waze"
                        value={editForm.recepcionMapUrl || ""}
                        onChange={(e) => setEditForm({ ...editForm, recepcionMapUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <span className="text-xs font-bold text-stone-800 block">Misa / Ceremonia (Opcional)</span>
                      <input
                        type="text"
                        placeholder="Nombre de Parroquia o Iglesia"
                        value={editForm.ceremoniaNombre || ""}
                        onChange={(e) => setEditForm({ ...editForm, ceremoniaNombre: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Dirección de la Iglesia"
                        value={editForm.ceremoniaDireccion || ""}
                        onChange={(e) => setEditForm({ ...editForm, ceremoniaDireccion: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <input
                        type="url"
                        placeholder="Enlace Google Maps Iglesia"
                        value={editForm.ceremoniaMapUrl || ""}
                        onChange={(e) => setEditForm({ ...editForm, ceremoniaMapUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* 6. DRESS CODE */}
                {activeSection === "dresscode" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Código de Vestimenta</h3>
                      <p className="text-[11px] text-stone-500">Etiqueta formal y colores reservados.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Título de la Sección:</label>
                      <input
                        type="text"
                        placeholder="Ej. Formal & Elegant Attire"
                        value={editForm.dressCodeTitulo || ""}
                        onChange={(e) => setEditForm({ ...editForm, dressCodeTitulo: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Etiqueta Exigida:</label>
                      <input
                        type="text"
                        placeholder="Ej. Formal & Rigurosa Etiqueta"
                        value={editForm.dressCodeEtiqueta || ""}
                        onChange={(e) => setEditForm({ ...editForm, dressCodeEtiqueta: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Nota para los Invitados:</label>
                      <textarea
                        rows={2}
                        value={editForm.dressCodeNota || ""}
                        onChange={(e) => setEditForm({ ...editForm, dressCodeNota: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Colores Reservados:</label>
                      <input
                        type="text"
                        placeholder="Ej. Tonos azul celeste y blanco reservados exclusivamente para la festejada"
                        value={editForm.dressCodeColoresReservados || ""}
                        onChange={(e) => setEditForm({ ...editForm, dressCodeColoresReservados: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 7. REGALOS & RSVP */}
                {activeSection === "regalos" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Mesa de Regalos & RSVP</h3>
                      <p className="text-[11px] text-stone-500">Lluvia de sobres, Zelle, CashApp y WhatsApp.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Mensaje de Regalo:</label>
                      <textarea
                        rows={2}
                        value={editForm.regalosMensaje || ""}
                        onChange={(e) => setEditForm({ ...editForm, regalosMensaje: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">Zelle:</label>
                        <input
                          type="text"
                          placeholder="email o teléfono Zelle"
                          value={editForm.regalosZelle || ""}
                          onChange={(e) => setEditForm({ ...editForm, regalosZelle: e.target.value })}
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">CashApp:</label>
                        <input
                          type="text"
                          placeholder="$Cashtag"
                          value={editForm.regalosCashApp || ""}
                          onChange={(e) => setEditForm({ ...editForm, regalosCashApp: e.target.value })}
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">WhatsApp RSVP:</label>
                        <input
                          type="tel"
                          placeholder="18181234567"
                          value={editForm.telefonoWhatsappRsvp || ""}
                          onChange={(e) => setEditForm({ ...editForm, telefonoWhatsappRsvp: e.target.value })}
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">Máx Pases (0 = sin límite):</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editForm.maxPasesPorInvitado ?? 3}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            setEditForm({
                              ...editForm,
                              maxPasesPorInvitado: Number.isNaN(v) ? 0 : Math.min(100, Math.max(0, v)),
                            });
                          }}
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. CORTE DE HONOR */}
                {activeSection === "corte" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Corte de Honor</h3>
                      <p className="text-[11px] text-stone-500">Padres, padrinos, chambelán y damas.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Padres:</label>
                      <input
                        type="text"
                        placeholder="Ej. Carlos & Elena Morales"
                        value={editForm.corteHonorJson?.parents || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            corteHonorJson: { ...(editForm.corteHonorJson || {}), parents: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Padrinos:</label>
                      <input
                        type="text"
                        placeholder="Ej. Roberto & Patricia Méndez"
                        value={
                          Array.isArray(editForm.corteHonorJson?.padrinos)
                            ? editForm.corteHonorJson?.padrinos.join(", ")
                            : editForm.corteHonorJson?.padrinos || ""
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            corteHonorJson: {
                              ...(editForm.corteHonorJson || {}),
                              padrinos: e.target.value.split(",").map((s: string) => s.trim()),
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Chambelán de Honor:</label>
                      <input
                        type="text"
                        placeholder="Ej. Sebastián Ramos"
                        value={editForm.corteHonorJson?.chambelan || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            corteHonorJson: { ...(editForm.corteHonorJson || {}), chambelan: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">Damas de Honor (Separadas por comas):</label>
                      <input
                        type="text"
                        placeholder="Camila, Valentina, Sofía, Isabella"
                        value={
                          Array.isArray(editForm.corteHonorJson?.damas)
                            ? editForm.corteHonorJson?.damas.join(", ")
                            : editForm.corteHonorJson?.damas || ""
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            corteHonorJson: {
                              ...(editForm.corteHonorJson || {}),
                              damas: e.target.value.split(",").map((s: string) => s.trim()),
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 9. FOTOS & GALERÍA */}
                {activeSection === "fotos" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Fotos & Galería</h3>
                      <p className="text-[11px] text-stone-500">Sube imágenes directamente a tu bucket de S3.</p>
                    </div>

                    {/* Foto de Portada */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800">Foto de Portada 9:16</span>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A002A] text-white rounded-lg text-xs font-semibold cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{uploadingField === "fotoPortadaUrl" ? "Subiendo..." : "Subir Foto"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "fotoPortadaUrl", false)}
                            disabled={uploadingField === "fotoPortadaUrl"}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={editForm.fotoPortadaUrl || ""}
                        onChange={(e) => setEditForm({ ...editForm, fotoPortadaUrl: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                      />
                    </div>

                    {/* Foto Infancia */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800">Foto Infancia / Recuerdo</span>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A002A] text-white rounded-lg text-xs font-semibold cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{uploadingField === "fotoInfanciaUrl" ? "Subiendo..." : "Subir Foto"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "fotoInfanciaUrl", false)}
                            disabled={uploadingField === "fotoInfanciaUrl"}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={editForm.fotoInfanciaUrl || ""}
                        onChange={(e) => setEditForm({ ...editForm, fotoInfanciaUrl: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                      />
                    </div>

                    {/* Foto Actual */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800">Foto Sesión de Gala</span>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A002A] text-white rounded-lg text-xs font-semibold cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{uploadingField === "fotoActualUrl" ? "Subiendo..." : "Subir Foto"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "fotoActualUrl", false)}
                            disabled={uploadingField === "fotoActualUrl"}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={editForm.fotoActualUrl || ""}
                        onChange={(e) => setEditForm({ ...editForm, fotoActualUrl: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* COLUMNA DERECHA (5 Columnas): SMARTPHONE EN VIVO EN TIEMPO REAL */}
          {/* ============================================================== */}
          <div className={`xl:col-span-5 sticky top-24 ${showMobilePreviewModal ? "block" : "hidden xl:block"}`}>
            <div className="flex flex-col items-center justify-center bg-stone-100 p-4 rounded-3xl border border-stone-200 shadow-sm">
              {/* Barra superior de controles del Simulador */}
              <div className="w-full max-w-[370px] flex items-center justify-between pb-3 mb-2 border-b border-stone-200 text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-bold text-stone-800">Vista en Tiempo Real</span>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setSkipIntroPreview(false)}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                      !skipIntroPreview ? "bg-amber-100 text-amber-900 font-bold" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    Sobre 3D
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkipIntroPreview(true)}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                      skipIntroPreview ? "bg-amber-100 text-amber-900 font-bold" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    Directo
                  </button>
                </div>
              </div>

              {/* Marco Físico de Smartphone */}
              <div className="relative w-full max-w-[360px] h-[720px] bg-stone-900 rounded-[48px] p-3 shadow-2xl border-4 border-stone-800 ring-1 ring-stone-700/50 flex flex-col">
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1A1820]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                {/* Pantalla Interna con TemplateDispatcher en Tiempo Real */}
                <div className="w-full h-full bg-white rounded-[38px] overflow-y-auto overflow-x-hidden relative scrollbar-none">
                  <TemplateDispatcher data={liveData} skipIntro={skipIntroPreview} />
                </div>

                {/* Barra inferior iOS */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full pointer-events-none" />
              </div>

              <p className="text-[11px] text-stone-400 mt-3 font-medium text-center">
                Cualquier cambio que escribas o color que elijas se refleja inmediatamente en esta pantalla.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 1: CATÁLOGO DE TEMPLATES (LISTADO)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-serif">
              Plantillas Maestras del Catálogo
            </h1>
            <span className="text-[11px] uppercase tracking-wider font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              🎨 Templates
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Gestiona la música por defecto, textos base, tipografía, color del sobre 3D y canción que escuchan los clientes al abrir la demo interactiva en la web pública antes de comprar.
          </p>
        </div>

        <button
          onClick={fetchTemplates}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg shadow-2xs hover:bg-stone-50 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, slug o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              categoryFilter === "ALL"
                ? "bg-[#7A002A] text-white font-bold"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Todas ({templates.length})
          </button>
          <button
            onClick={() => setCategoryFilter("QUINCEANERA")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              categoryFilter === "QUINCEANERA"
                ? "bg-[#7A002A] text-white font-bold"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            XV Años
          </button>
          <button
            onClick={() => setCategoryFilter("BODA")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              categoryFilter === "BODA"
                ? "bg-[#7A002A] text-white font-bold"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Bodas
          </button>
          <button
            onClick={() => setCategoryFilter("CUMPLEANOS")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              categoryFilter === "CUMPLEANOS"
                ? "bg-[#7A002A] text-white font-bold"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Cumpleaños
          </button>
        </div>
      </div>

      {/* Grid de Plantillas */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C5A059]" />
          Cargando plantillas maestras...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
          No se encontraron plantillas que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.slug}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col"
            >
              {/* Vista previa superior con miniatura */}
              <div className="relative h-44 bg-stone-900 overflow-hidden group">
                <img
                  src={tpl.fotoPortadaUrl}
                  alt={tpl.nombre}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge Categoría */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 text-stone-900 backdrop-blur-md shadow-xs">
                  {tpl.categoria === "QUINCEANERA"
                    ? "XV Años"
                    : tpl.categoria === "BODA"
                    ? "Boda"
                    : "Cumpleaños"}
                </span>

                {/* Slug ID */}
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/60 text-stone-300 backdrop-blur-md border border-white/10">
                  /{tpl.slug}
                </span>

                {/* Título en la imagen */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-serif font-bold text-base leading-tight drop-shadow-md">
                    {tpl.titulo}
                  </h3>
                  <p className="text-stone-300 text-xs truncate">
                    {tpl.nombre}
                  </p>
                </div>
              </div>

              {/* Contenido / Metadatos */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs">
                  {/* Canción Predeterminada */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Music className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-semibold">Canción Demo</span>
                        <span className="text-stone-700 font-medium truncate block">
                          {tpl.musicaTitulo || "Sin título definido"}
                        </span>
                      </div>
                    </div>
                    {tpl.musicaUrl && (
                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(tpl.musicaUrl)}
                        title={playingAudioUrl === tpl.musicaUrl ? "Detener" : "Reproducir demo"}
                        className="p-1.5 rounded-full bg-white hover:bg-stone-200 border border-stone-200 text-stone-800 transition cursor-pointer flex-shrink-0"
                      >
                        {playingAudioUrl === tpl.musicaUrl ? (
                          <Square className="w-3 h-3 fill-current text-red-600" />
                        ) : (
                          <Play className="w-3 h-3 fill-current text-emerald-700 ml-0.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Atributos Visuales (Sobre, Sello y Fuente) */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <div
                        className="w-4 h-4 rounded-full border border-stone-300 flex-shrink-0 shadow-2xs"
                        style={{ backgroundColor: tpl.colorSobre || "#E8D5C4" }}
                      />
                      <div className="truncate">
                        <span className="text-stone-400 block text-[9px] uppercase font-semibold">Sobre 3D</span>
                        <span className="text-stone-700 font-mono text-[10px]">
                          {tpl.colorSobre || "#E8D5C4"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <Type className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                      <div className="truncate">
                        <span className="text-stone-400 block text-[9px] uppercase font-semibold">Tipografía</span>
                        <span className="text-stone-700 font-medium truncate block">
                          {tpl.tipoLetra || "Cinzel"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://clickandlove.app/demo/${tpl.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                    >
                      <span>Ver Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleOpenEdit(tpl)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#2C1F1B] bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] hover:opacity-95 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Plantilla</span>
                    </button>
                  </div>

                  <Link
                    href={`/eventos/nuevo?plantilla=${tpl.estiloPlantilla}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Crear Invitación con este Diseño</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
