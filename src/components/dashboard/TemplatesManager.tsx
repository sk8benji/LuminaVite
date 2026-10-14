"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Clock,
  Shirt,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MasterTemplateItem } from "@/lib/templates-data";

export default function TemplatesManager() {
  const [templates, setTemplates] = useState<MasterTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "QUINCEANERA" | "BODA" | "CUMPLEANOS">("ALL");

  // Estado de plantilla en edición completa (Full Screen Editor)
  const [editingTemplate, setEditingTemplate] = useState<MasterTemplateItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<MasterTemplateItem>>({});
  const [activeEditorTab, setActiveEditorTab] = useState<
    "musica" | "sobre" | "textos" | "fechas" | "lugares" | "dresscode" | "regalos" | "corte" | "fotos"
  >("musica");

  // Estado de subida a S3
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Reproductor de prueba de audio
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
    setActiveEditorTab("musica");
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
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof MasterTemplateItem, isAudio: boolean = false) => {
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

      // 1. Obtener presigned URL de S3
      const presignedRes = await fetch("/api/s3/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: resolvedType,
          folder,
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
  // VISTA 2: EDITOR COMPLETO (FULL PAGE VIEW)
  // =========================================================================
  if (editingTemplate) {
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
                Editando todos los detalles maestros de la plantilla
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`/demo/${editingTemplate.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
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

        {/* Notificaciones flotantes de éxito o error */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold shadow-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}
        {errorToast && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-800 text-xs font-semibold shadow-xs animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorToast}</span>
          </div>
        )}

        {/* Pestañas de Navegación del Editor */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveEditorTab("musica")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "musica" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Music className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Música & Audio</span>
          </button>

          <button
            onClick={() => setActiveEditorTab("sobre")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "sobre" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Sobre 3D & Tipografía</span>
          </button>

          <button
            onClick={() => setActiveEditorTab("textos")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "textos" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Textos Principales</span>
          </button>

          <button
            onClick={() => setActiveEditorTab("fechas")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "fechas" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Fecha & Medallón</span>
          </button>

          <button
            onClick={() => setActiveEditorTab("lugares")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "lugares" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Recepción & Misa</span>
          </button>

          <button
            onClick={() => setActiveEditorTab("dresscode")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "dresscode" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Shirt className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Dress Code</span>
          </button>

          <button
            onClick={() => setActiveEditorTab("regalos")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "regalos" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Regalos & RSVP</span>
          </button>

          <button
            onClick={() => setActiveEditorTab("corte")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "corte" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Corte & Programa</span>
          </button>

          <button
            onClick={() => setActiveEditorTab("fotos")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeEditorTab === "fotos" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Fotos & Galería</span>
          </button>
        </div>

        {/* Contenido de Cada Pestaña en Vista Completa */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm">
          {/* 1. MÚSICA & AUDIO */}
          {activeEditorTab === "musica" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Música Predeterminada del Demo
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Esta es la canción que se reproducirá automáticamente cuando un cliente abra la invitación interactiva en la web pública.
                </p>
              </div>

              {/* Caja de subida directa a S3 */}
              <div className="p-6 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#C5A059] transition text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-[#C5A059] flex items-center justify-center">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingField === "musicaUrl" ? "Subiendo a AWS S3..." : "Subir Canción desde tu Computadora (.mp3, .wav, .m4a)"}</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a"
                      onChange={(e) => handleFileUpload(e, "musicaUrl", true)}
                      disabled={uploadingField === "musicaUrl"}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-stone-400 mt-2">
                    El archivo se alojará directamente en tu bucket de AWS S3 de alta velocidad.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Título o Artista de la Canción:</label>
                  <input
                    type="text"
                    placeholder="Ej. Photograph - Ed Sheeran o Vals de Primavera"
                    value={editForm.musicaTitulo || ""}
                    onChange={(e) => setEditForm({ ...editForm, musicaTitulo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">URL del Archivo de Audio:</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://luminavite-storage.s3.../audio.mp3"
                      value={editForm.musicaUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, musicaUrl: e.target.value })}
                      className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                    />
                    {editForm.musicaUrl && (
                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(editForm.musicaUrl || "")}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                      >
                        {playingAudioUrl === editForm.musicaUrl ? (
                          <>
                            <Square className="w-4 h-4 fill-current text-red-600" />
                            <span>Parar</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current text-emerald-600" />
                            <span>Escuchar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Texto del Disco Giratorio:</label>
                  <input
                    type="text"
                    placeholder="Ej. Click to Play Music o Toca para Escuchar"
                    value={editForm.textoDisco || ""}
                    onChange={(e) => setEditForm({ ...editForm, textoDisco: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. SOBRE 3D & TIPOGRAFÍA */}
          {activeEditorTab === "sobre" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Sobre 3D & Tipografía de Gala
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Personaliza los colores del sobre físico de apertura 3D, el sello de cera y la tipografía base de toda la invitación.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <label className="text-xs font-bold text-stone-800 block">Color del Sobre Exterior:</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editForm.colorSobre || "#E8D5C4"}
                      onChange={(e) => setEditForm({ ...editForm, colorSobre: e.target.value })}
                      className="w-12 h-12 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={editForm.colorSobre || "#E8D5C4"}
                      onChange={(e) => setEditForm({ ...editForm, colorSobre: e.target.value })}
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono uppercase w-32"
                    />
                  </div>
                  <div
                    className="h-16 rounded-xl border border-stone-300 shadow-inner flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: editForm.colorSobre || "#E8D5C4", color: "#2C1F1B" }}
                  >
                    Muestra del Sobre
                  </div>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <label className="text-xs font-bold text-stone-800 block">Color del Sello de Cera (Lacre):</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editForm.colorSello || "#C5A059"}
                      onChange={(e) => setEditForm({ ...editForm, colorSello: e.target.value })}
                      className="w-12 h-12 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={editForm.colorSello || "#C5A059"}
                      onChange={(e) => setEditForm({ ...editForm, colorSello: e.target.value })}
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono uppercase w-32"
                    />
                  </div>
                  <div className="flex items-center justify-center h-16">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-white/60 shadow-md flex items-center justify-center text-white font-serif font-bold text-xs"
                      style={{ backgroundColor: editForm.colorSello || "#C5A059" }}
                    >
                      👑
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <label className="text-xs font-bold text-stone-800 block">Tipografía Principal del Evento:</label>
                <select
                  value={editForm.tipoLetra || "Cinzel"}
                  onChange={(e) => setEditForm({ ...editForm, tipoLetra: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium"
                >
                  <option value="Cinzel">Cinzel (Clásica Romana, Gala & Lujo Imperial)</option>
                  <option value="Playfair Display">Playfair Display (Moderna & Sofisticada con Serifas)</option>
                  <option value="Great Vibes">Great Vibes (Caligráfica, Cursiva & Romántica)</option>
                  <option value="Montserrat">Montserrat (Minimalista, Limpia & Contemporánea)</option>
                  <option value="Cormorant Garamond">Cormorant Garamond (Editorial de Alta Costura)</option>
                </select>

                <p className="text-xs text-stone-500 pt-2 border-t border-stone-200">
                  Muestra de texto: <span className="font-bold text-stone-900" style={{ fontFamily: editForm.tipoLetra || "Cinzel" }}>Nuestra Boda Real & XV Años de Ensueño</span>
                </p>
              </div>
            </div>
          )}

          {/* 3. TEXTOS PRINCIPALES */}
          {activeEditorTab === "textos" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Textos Principales & Dedicatoria
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Define los nombres de ejemplo, títulos y mensajes de bendición o reflexión.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Título Principal (Nombre del Festejado/Pareja):</label>
                  <input
                    type="text"
                    placeholder="Ej. Valeria Morales o Emma & Lucas"
                    value={editForm.titulo || ""}
                    onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Subtítulo / Encabezado:</label>
                  <input
                    type="text"
                    placeholder="Ej. My Quinceañera o Nos Casamos"
                    value={editForm.subtitulo || ""}
                    onChange={(e) => setEditForm({ ...editForm, subtitulo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Frase Dedicatoria / Emocional:</label>
                <textarea
                  rows={3}
                  placeholder="Doy gracias a Dios por concederme la dicha de celebrar..."
                  value={editForm.frasePersonalizada || ""}
                  onChange={(e) => setEditForm({ ...editForm, frasePersonalizada: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Firma o Autor de la Bendición:</label>
                  <input
                    type="text"
                    placeholder="Ej. Con amor, tus padres y padrinos"
                    value={editForm.autorBendicion || ""}
                    onChange={(e) => setEditForm({ ...editForm, autorBendicion: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Mensaje de Despedida / Cierre:</label>
                  <input
                    type="text"
                    placeholder="Ej. See You Soon! Esperamos contar con tu presencia."
                    value={editForm.mensajeDespedida || ""}
                    onChange={(e) => setEditForm({ ...editForm, mensajeDespedida: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. FECHA & MEDALLÓN */}
          {activeEditorTab === "fechas" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Fecha del Evento & Medallón
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Textos que componen la placa central de fecha y el contador regresivo de gala.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Texto Completo de la Fecha (Gala):</label>
                  <input
                    type="text"
                    placeholder="Ej. SÁBADO 24 DE OCTUBRE, 2026 • 4:00 PM o SATURDAY, OCTOBER 24, 2026 AT 3 PM"
                    value={editForm.fechaTextoPersonalizada || ""}
                    onChange={(e) => setEditForm({ ...editForm, fechaTextoPersonalizada: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Mes en el Medallón:</label>
                    <input
                      type="text"
                      placeholder="Ej. OCTUBRE / OCTOBER"
                      value={editForm.fechaPlacaMes || ""}
                      onChange={(e) => setEditForm({ ...editForm, fechaPlacaMes: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Hora en el Medallón:</label>
                    <input
                      type="text"
                      placeholder="Ej. A LAS 4:00 PM / AT 4 PM"
                      value={editForm.fechaPlacaHora || ""}
                      onChange={(e) => setEditForm({ ...editForm, fechaPlacaHora: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Lugar en el Medallón:</label>
                    <input
                      type="text"
                      placeholder="Ej. GRAN SALÓN REAL"
                      value={editForm.fechaPlacaLugar || ""}
                      onChange={(e) => setEditForm({ ...editForm, fechaPlacaLugar: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Encabezado del Contador Regresivo:</label>
                  <input
                    type="text"
                    placeholder="Ej. Faltan sólo... o Countdown to the Big Day"
                    value={editForm.countdownEncabezado || ""}
                    onChange={(e) => setEditForm({ ...editForm, countdownEncabezado: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. LUGARES (RECEPCIÓN & CEREMONIA) */}
          {activeEditorTab === "lugares" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Lugares del Evento (Salón & Ceremonia Religiosa)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Configura nombres de los salones, iglesias, direcciones y enlaces de Google Maps.
                </p>
              </div>

              {/* Salón de Recepción */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center gap-2 font-bold text-xs text-stone-900">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>Salón de Recepción / Fiesta</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Nombre del Salón:</label>
                    <input
                      type="text"
                      placeholder="Ej. The Grand Ballroom o Quince Palace"
                      value={editForm.recepcionNombre || ""}
                      onChange={(e) => setEditForm({ ...editForm, recepcionNombre: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Dirección Completa:</label>
                    <input
                      type="text"
                      placeholder="Ej. 123 Event St, Los Angeles, CA 90001"
                      value={editForm.recepcionDireccion || ""}
                      onChange={(e) => setEditForm({ ...editForm, recepcionDireccion: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Enlace de Google Maps / Waze:</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/?q=..."
                    value={editForm.recepcionMapUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, recepcionMapUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Misa / Ceremonia Religiosa */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center gap-2 font-bold text-xs text-stone-900">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>Ceremonia Religiosa / Iglesia (Opcional)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Nombre de la Iglesia / Parroquia:</label>
                    <input
                      type="text"
                      placeholder="Ej. Parroquia San Fernando Rey"
                      value={editForm.ceremoniaNombre || ""}
                      onChange={(e) => setEditForm({ ...editForm, ceremoniaNombre: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Dirección de la Iglesia:</label>
                    <input
                      type="text"
                      placeholder="Ej. 456 Cathedral Way, Glendale, CA"
                      value={editForm.ceremoniaDireccion || ""}
                      onChange={(e) => setEditForm({ ...editForm, ceremoniaDireccion: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Enlace de Google Maps de la Iglesia:</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/?q=..."
                    value={editForm.ceremoniaMapUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, ceremoniaMapUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. DRESS CODE */}
          {activeEditorTab === "dresscode" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Código de Vestimenta (Dress Code)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Pautas de vestuario para los invitados y colores reservados.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Título de la Sección:</label>
                    <input
                      type="text"
                      placeholder="Ej. Formal & Elegant Attire o Código de Vestimenta"
                      value={editForm.dressCodeTitulo || ""}
                      onChange={(e) => setEditForm({ ...editForm, dressCodeTitulo: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Etiqueta Exigida:</label>
                    <input
                      type="text"
                      placeholder="Ej. Formal & Rigurosa Etiqueta o Black Tie"
                      value={editForm.dressCodeEtiqueta || ""}
                      onChange={(e) => setEditForm({ ...editForm, dressCodeEtiqueta: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Nota para los Invitados:</label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Agradecemos a los invitados lucir trajes oscuros y vestidos largos..."
                    value={editForm.dressCodeNota || ""}
                    onChange={(e) => setEditForm({ ...editForm, dressCodeNota: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Colores Reservados Exclusivamente:</label>
                  <input
                    type="text"
                    placeholder="Ej. Tonos blanco y azul celeste reservados exclusivamente para la festejada"
                    value={editForm.dressCodeColoresReservados || ""}
                    onChange={(e) => setEditForm({ ...editForm, dressCodeColoresReservados: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. REGALOS & RSVP */}
          {activeEditorTab === "regalos" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Mesa de Regalos & Sistema RSVP
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Mensaje de lluvia de sobres, Zelle, CashApp y contacto de WhatsApp para confirmaciones.
                </p>
              </div>

              {/* Lluvia de Sobres / Cuentas */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Mensaje de Regalo / Lluvia de Sobres:</label>
                  <textarea
                    rows={2}
                    placeholder="Tu presencia es nuestro mayor regalo. Si deseas tener un detalle, dispondremos de un cofre en la recepción."
                    value={editForm.regalosMensaje || ""}
                    onChange={(e) => setEditForm({ ...editForm, regalosMensaje: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Cuenta o Teléfono de Zelle:</label>
                    <input
                      type="text"
                      placeholder="Ej. maria.morales@gmail.com o (818) 555-0192"
                      value={editForm.regalosZelle || ""}
                      onChange={(e) => setEditForm({ ...editForm, regalosZelle: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Cashtag de CashApp:</label>
                    <input
                      type="text"
                      placeholder="Ej. $MariaMoralesXV"
                      value={editForm.regalosCashApp || ""}
                      onChange={(e) => setEditForm({ ...editForm, regalosCashApp: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Parámetros de RSVP */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Teléfono WhatsApp RSVP:</label>
                    <input
                      type="tel"
                      placeholder="Ej. 18181234567"
                      value={editForm.telefonoWhatsappRsvp || ""}
                      onChange={(e) => setEditForm({ ...editForm, telefonoWhatsappRsvp: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Texto Fecha Límite RSVP:</label>
                    <input
                      type="text"
                      placeholder="Ej. Favor de confirmar antes del 20 de Octubre"
                      value={editForm.rsvpFechaLimite || ""}
                      onChange={(e) => setEditForm({ ...editForm, rsvpFechaLimite: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Máx Pases por Invitado:</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={editForm.maxPasesPorInvitado || 4}
                      onChange={(e) => setEditForm({ ...editForm, maxPasesPorInvitado: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. CORTE DE HONOR & ITINERARIO */}
          {activeEditorTab === "corte" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Corte de Honor & Protocolo
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Padres, padrinos y acompañantes que se exhiben en la corte de honor de la plantilla.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Nombres de los Padres:</label>
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
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Nombres de los Padrinos:</label>
                    <input
                      type="text"
                      placeholder="Ej. Roberto & Patricia Méndez"
                      value={Array.isArray(editForm.corteHonorJson?.padrinos) ? editForm.corteHonorJson?.padrinos.join(", ") : (editForm.corteHonorJson?.padrinos || "")}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          corteHonorJson: { ...(editForm.corteHonorJson || {}), padrinos: e.target.value.split(",").map((s: string) => s.trim()) },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Damas de Honor (Separadas por comas):</label>
                    <input
                      type="text"
                      placeholder="Ej. Camila, Valentina, Sofía, Isabella"
                      value={Array.isArray(editForm.corteHonorJson?.damas) ? editForm.corteHonorJson?.damas.join(", ") : (editForm.corteHonorJson?.damas || "")}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          corteHonorJson: { ...(editForm.corteHonorJson || {}), damas: e.target.value.split(",").map((s: string) => s.trim()) },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. FOTOS & GALERÍA */}
          {activeEditorTab === "fotos" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Fotos de Demostración & Multimedia
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Sube fotos directamente a tu almacenamiento AWS S3 para la portada y las galerías de muestra.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Foto de Portada */}
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">Foto de Portada Principal (9:16 Vertical)</span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-lg text-xs font-semibold cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
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

                  {editForm.fotoPortadaUrl && (
                    <div className="relative h-64 rounded-xl overflow-hidden border border-stone-300 bg-stone-900 flex items-center justify-center">
                      <img
                        src={editForm.fotoPortadaUrl}
                        alt="Portada"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="URL de imagen /assets/... o https://..."
                    value={editForm.fotoPortadaUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, fotoPortadaUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Foto Infancia / Recuerdo */}
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">Foto de Infancia / Sesión 1</span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-lg text-xs font-semibold cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
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

                  {editForm.fotoInfanciaUrl && (
                    <div className="relative h-64 rounded-xl overflow-hidden border border-stone-300 bg-stone-900 flex items-center justify-center">
                      <img
                        src={editForm.fotoInfanciaUrl}
                        alt="Infancia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="URL de imagen /assets/... o https://..."
                    value={editForm.fotoInfanciaUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, fotoInfanciaUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Foto Actual / Sesión 2 */}
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">Foto Sesión de Gala / Actual</span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-lg text-xs font-semibold cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
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

                  {editForm.fotoActualUrl && (
                    <div className="relative h-64 rounded-xl overflow-hidden border border-stone-300 bg-stone-900 flex items-center justify-center">
                      <img
                        src={editForm.fotoActualUrl}
                        alt="Actual"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="URL de imagen /assets/... o https://..."
                    value={editForm.fotoActualUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, fotoActualUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Foto Cierre / Vestido */}
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">Foto Cierre / Despedida</span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-lg text-xs font-semibold cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingField === "fotoCierreUrl" ? "Subiendo..." : "Subir Foto"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "fotoCierreUrl", false)}
                        disabled={uploadingField === "fotoCierreUrl"}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {editForm.fotoCierreUrl && (
                    <div className="relative h-64 rounded-xl overflow-hidden border border-stone-300 bg-stone-900 flex items-center justify-center">
                      <img
                        src={editForm.fotoCierreUrl}
                        alt="Cierre"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="URL de imagen /assets/... o https://..."
                    value={editForm.fotoCierreUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, fotoCierreUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones de Guardar al pie */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={handleCloseEdit}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Cancelar & Volver
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
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
                <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                  <a
                    href={`/demo/${tpl.slug}`}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
