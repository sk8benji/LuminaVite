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
  X,
  RefreshCw,
} from "lucide-react";
import { MasterTemplateItem } from "@/lib/templates-data";

export default function TemplatesManager() {
  const [templates, setTemplates] = useState<MasterTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "QUINCEANERA" | "BODA" | "CUMPLEANOS">("ALL");

  // Edición
  const [editingTemplate, setEditingTemplate] = useState<MasterTemplateItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<MasterTemplateItem>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setSuccessMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setSaving(true);
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
        setSuccessMessage("¡Plantilla actualizada correctamente!");
        setTimeout(() => {
          setSuccessMessage(null);
          setEditingTemplate(null);
        }, 1200);
        fetchTemplates();
      } else {
        alert("Error al guardar los cambios.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al guardar.");
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
              Templates
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
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edición de Template */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                  <Palette className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                    Editar Plantilla Maestra
                  </h2>
                  <p className="text-xs text-stone-400 font-mono">
                    /{editingTemplate.slug} • {editingTemplate.nombre}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Sección 1: Música Predeterminada */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <Music className="w-4 h-4 text-[#C5A059]" />
                  <span>Música Predeterminada del Demo</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    Título o Artista de la Canción:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Photograph - Ed Sheeran"
                    value={editForm.musicaTitulo || ""}
                    onChange={(e) => setEditForm({ ...editForm, musicaTitulo: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    URL del Archivo de Audio (MP3 en S3 o enlace directo):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://.../cancion.mp3"
                      value={editForm.musicaUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, musicaUrl: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500 text-xs font-mono"
                    />
                    {editForm.musicaUrl && (
                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(editForm.musicaUrl || "")}
                        className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {playingAudioUrl === editForm.musicaUrl ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current text-red-600" />
                            <span>Parar</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
                            <span>Probar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección 2: Sobre 3D y Tipografía */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <span>Color del Sobre 3D</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editForm.colorSobre || "#E8D5C4"}
                      onChange={(e) => setEditForm({ ...editForm, colorSobre: e.target.value })}
                      className="w-10 h-10 p-0.5 rounded-xl border border-stone-300 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={editForm.colorSobre || "#E8D5C4"}
                      onChange={(e) => setEditForm({ ...editForm, colorSobre: e.target.value })}
                      className="w-24 px-2 py-2 bg-white border border-stone-200 rounded-xl font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                    <Type className="w-4 h-4 text-[#C5A059]" />
                    <span>Tipo de Letra</span>
                  </div>
                  <select
                    value={editForm.tipoLetra || "Cinzel"}
                    onChange={(e) => setEditForm({ ...editForm, tipoLetra: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Cinzel">Cinzel (Clásica & Gala)</option>
                    <option value="Playfair Display">Playfair Display (Elegante)</option>
                    <option value="Great Vibes">Great Vibes (Caligráfica / Cursiva)</option>
                    <option value="Montserrat">Montserrat (Moderna & Minimalista)</option>
                    <option value="Cormorant Garamond">Cormorant Garamond (Editorial)</option>
                  </select>
                </div>
              </div>

              {/* Sección 3: Textos Base */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Textos Base del Demo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-600">Título Principal:</label>
                    <input
                      type="text"
                      placeholder="Ej. Valeria Morales"
                      value={editForm.titulo || ""}
                      onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-600">Subtítulo:</label>
                    <input
                      type="text"
                      placeholder="Ej. My Quinceañera"
                      value={editForm.subtitulo || ""}
                      onChange={(e) => setEditForm({ ...editForm, subtitulo: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    Frase Dedicatoria / Emocional:
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.frasePersonalizada || ""}
                    onChange={(e) => setEditForm({ ...editForm, frasePersonalizada: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                  />
                </div>
              </div>

              {/* Sección 4: Foto de Portada */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                  <span>Foto de Portada Predeterminada</span>
                </div>
                <input
                  type="text"
                  placeholder="URL de imagen 9:16 (/assets/... o https://...)"
                  value={editForm.fotoPortadaUrl || ""}
                  onChange={(e) => setEditForm({ ...editForm, fotoPortadaUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Mensaje de feedback */}
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold text-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#C5A059] via-[#EED3A1] to-[#C5A059] text-[#2C1F1B] font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
