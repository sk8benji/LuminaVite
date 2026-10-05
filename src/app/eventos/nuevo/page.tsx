"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Upload,
  Calendar,
  MapPin,
  MessageCircle,
  Music,
  Eye,
  Sliders,
} from "lucide-react";
import { TEMPLATES, TemplateId } from "@/lib/templates";
import { InvitationData } from "@/components/invitation/InvitationMobileView";
import MobileSimulator from "@/components/preview/MobileSimulator";

export default function NuevoEventoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingS3, setUploadingS3] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<InvitationData>({
    slug: "mi-celebracion",
    tipoEvento: "QUINCEANERA",
    estiloPlantilla: "PRINCESA_ROSA",
    titulo: "Sofía",
    subtitulo: "An Unforgettable Celebration Awaits",
    frasePersonalizada:
      "Hoy doy el hermoso paso de niña a señorita, rodeada de las personas que más amo en el mundo.",
    fechaEvento: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    fotoPortadaUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    fotoInfanciaUrl:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
    fotoActualUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    telefonoWhatsappRsvp: "18181234567",
    fechaLimiteRsvp: "15 de Noviembre",
    maxPasesPorInvitado: 4,
    ceremoniaNombre: "Parroquia Nuestra Señora",
    ceremoniaDireccion: "Av. Las Flores 123",
    ceremoniaMapUrl: "https://maps.google.com",
    recepcionNombre: "Gran Salón Diamante",
    recepcionDireccion: "Blvd. Principal 456, Suite A",
    recepcionMapUrl: "https://maps.google.com",
    dressCodeTitulo: "Elegante y Formal",
    dressCodeNota: "Por favor reservamos tonos rosa pastel para la quinceañera.",
    coloresReservados: ["#FCECEE", "#FFFFFF"],
    itinerarioJson: [
      { hora: "4:00 PM", titulo: "Llegada de Invitados", tipoIcono: "car" },
      { hora: "5:00 PM", titulo: "Ceremonia Religiosa", tipoIcono: "church" },
      { hora: "7:00 PM", titulo: "Cena & Brindis", tipoIcono: "wine" },
      { hora: "8:30 PM", titulo: "Vals y Fiesta", tipoIcono: "crown" },
    ],
    corteHonorJson: {
      chambelan: "Jeremiah",
      damas: ["Magdalena", "Violeta", "Tania"],
    },
    mesaRegalosJson: {
      titulo: "Lluvia de Sobres",
      mensaje: "Tu presencia es nuestro mayor regalo. Disponemos de un cofre en la recepción.",
    },
  });

  // Presets con fotos reales y textos para la previsualización de cada plantilla
  const TEMPLATE_PRESETS: Partial<Record<TemplateId, Partial<InvitationData>>> = {
    BLUE_BUTTERFLY: {
      estiloPlantilla: "BLUE_BUTTERFLY",
      tipoEvento: "QUINCEANERA",
      titulo: "Valeria Sofía",
      subtitulo: "My Quinceañera",
      frasePersonalizada:
        "Doy gracias a Dios por cada instante de mi vida y a mis padres por su amor incondicional en esta noche tan soñada.",
      fechaTextoPersonalizada: "SÁBADO 24 DE OCTUBRE, 2026",
      fotoPortadaUrl: "/assets/template-butterfly/foto-columpio-portada.png",
      fotoInfanciaUrl: "/assets/template-butterfly/foto-sesion-1.jpg",
      fotoActualUrl: "/assets/template-butterfly/foto-sesion-2.jpg",
      fotoCierreUrl: "/assets/template-butterfly/foto-gala-vestido.jpg",
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      textoDisco: "Click to Play Music",
      dressCodeTitulo: "Formal Elegante",
      dressCodeNota: "Agradecemos reservar los tonos azul celeste y blanco para la quinceañera.",
      ceremoniaNombre: "Catedral Nuestra Señora del Carmen",
      ceremoniaDireccion: "Av. Las Rosas #450, Centro",
      ceremoniaMapUrl: "https://maps.google.com/?q=Catedral+Nuestra+Señora+del+Carmen",
      recepcionNombre: "Hacienda Los Jardines Celestiales",
      recepcionDireccion: "Carr. Nacional Km 14.5, Jardín Real",
      recepcionMapUrl: "https://maps.google.com/?q=Hacienda+Los+Jardines+Celestiales",
      itinerarioJson: [
        { hora: "3:00 PM", titulo: "Guest arrival", tipoIcono: "welcome" },
        { hora: "4:30 PM", titulo: "Grand entrance", tipoIcono: "entrance" },
        { hora: "4:00 - 6:00 PM", titulo: "Dinner", tipoIcono: "dinner" },
        { hora: "6:00 - 7:00 PM", titulo: "Waltz", tipoIcono: "waltz" },
        { hora: "7:00 - 12:00 AM", titulo: "Open Dance", tipoIcono: "disco" },
        { hora: "10:00 PM", titulo: "Cake cutting", tipoIcono: "cake" },
      ],
      corteHonorJson: {
        chambelan: "Jeremiah Smith",
        damas: ["Magdalena", "Violeta", "Tania"],
        parents: "Carlos Mendoza & Patricia Solís",
      },
    },
    ELEGANT_ROSE: {
      estiloPlantilla: "ELEGANT_ROSE",
      tipoEvento: "QUINCEANERA",
      titulo: "Isabella Rose",
      subtitulo: "Mis Quince Primaveras",
      frasePersonalizada:
        "Con inmensa gratitud en mi corazón, celebro el comienzo de una nueva etapa llena de sueños y esperanza.",
      fechaTextoPersonalizada: "SÁBADO 18 DE NOVIEMBRE, 2026",
      fotoPortadaUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      fotoInfanciaUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
      fotoActualUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      fotoCierreUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      dressCodeTitulo: "Etiqueta Rigurosa / Gala",
      dressCodeNota: "Por favor reservar tonos rosa pastel exclusivamente para la quinceañera.",
      ceremoniaNombre: "Parroquia San Francisco de Asís",
      ceremoniaDireccion: "Calle Central 102",
      recepcionNombre: "Salón Cristal Real",
      recepcionDireccion: "Av. Diamante 789",
    },
    FAIRYTALE_CHATEAU: {
      estiloPlantilla: "FAIRYTALE_CHATEAU",
      tipoEvento: "BODA",
      titulo: "Emma & Lucas",
      subtitulo: "Nuestra Boda de Ensueño",
      frasePersonalizada:
        "Dos almas con un solo pensamiento, dos corazones que laten como uno solo.",
      fechaTextoPersonalizada: "SATURDAY, JULY 22 • 3:30 PM",
      fotoPortadaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      fotoInfanciaUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
      fotoActualUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      dressCodeTitulo: "Black Tie / Formal",
      dressCodeNota: "Rogamos vestir de gala. El blanco está reservado exclusivamente para la novia.",
      ceremoniaNombre: "Château de Chambord Chapel",
      ceremoniaDireccion: "Château Domain, Loire Valley",
      recepcionNombre: "The Grand Ballroom at Château",
      recepcionDireccion: "Palais Central, Suite Royale",
    },
    CORALINE_MYSTICAL: {
      estiloPlantilla: "CORALINE_MYSTICAL",
      tipoEvento: "CUMPLEANOS",
      titulo: "Coraline Jones",
      subtitulo: "Welcome to The Other World",
      frasePersonalizada:
        "Ten cuidado con lo que deseas... estás cordialmente invitado a cruzar la puerta secreta.",
      fechaTextoPersonalizada: "OCTOBER 31 • 6:00 PM",
      fotoPortadaUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      dressCodeTitulo: "Gótico / Fantasía Mística",
      dressCodeNota: "Trae tu mejor atuendo de otro mundo o detalle amarillo.",
      recepcionNombre: "The Pink Palace Apartments",
      recepcionDireccion: "Ashland, Oregon",
    },
    PRINCESA_ROSA: {
      estiloPlantilla: "PRINCESA_ROSA",
      tipoEvento: "QUINCEANERA",
      titulo: "Sofía",
      subtitulo: "An Unforgettable Celebration Awaits",
      frasePersonalizada:
        "Hoy doy el hermoso paso de niña a señorita, rodeada de las personas que más amo en el mundo.",
      fechaTextoPersonalizada: "15 DE NOVIEMBRE, 2026",
      fotoPortadaUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      fotoInfanciaUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
      fotoActualUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      dressCodeTitulo: "Elegante y Formal",
      dressCodeNota: "Por favor reservamos tonos rosa pastel para la quinceañera.",
      ceremoniaNombre: "Parroquia Nuestra Señora",
      ceremoniaDireccion: "Av. Las Flores 123",
      recepcionNombre: "Gran Salón Diamante",
      recepcionDireccion: "Blvd. Principal 456, Suite A",
    },
  };

  const updateField = (field: keyof InvitationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Al seleccionar plantilla, se actualizan el estilo y los datos de demo/preview
  const handleSelectTemplate = (tempKey: TemplateId) => {
    const preset = TEMPLATE_PRESETS[tempKey];
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        ...preset,
        estiloPlantilla: tempKey,
      }));
    } else {
      updateField("estiloPlantilla", tempKey);
    }
  };

  // Subida a AWS S3 con Presigned URL respetando la estructura del bucket:
  // - Templates: templates/<nombre-template>/
  // - Clientes invitaciones: clientes/invitaciones/<slug-o-id>/
  // - Clientes invitados: clientes/subidas-invitados/<slug-o-id>/
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "fotoPortadaUrl" | "fotoInfanciaUrl" | "fotoActualUrl" | "musicaUrl",
    mediaType: "images" | "audio" = "images"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingS3(true);
    setErrorMsg(null);

    try {
      // Carpeta estructurada dentro del bucket luminavite-storage
      const clientFolder = `clientes/invitaciones/${formData.slug || "general"}`;

      // 1. Pedir presigned URL a la API
      const res = await fetch("/api/s3/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: clientFolder,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar URL para S3");
      }

      // 2. Subir binario directo a S3 usando PUT
      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Falló la subida a S3. Verifica permisos de tu bucket CORS/ACL.");
      }

      // 3. Guardar URL final del archivo en el estado
      updateField(field, data.fileUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Error al subir archivo a S3");
    } finally {
      setUploadingS3(false);
    }
  };

  // Guardar en la base de datos
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "No se pudo guardar la invitación.");
      }

      // Redirigir a la invitación creada
      router.push(`/${formData.slug}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Error al guardar el evento.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Barra superior del Dashboard */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-stone-100 rounded-xl transition text-stone-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-stone-900">Crear Invitación Digital</h1>
            <p className="text-xs text-stone-500">Paso {step} de 4</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón ver preview en móvil */}
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium"
          >
            <Eye className="w-4 h-4" />
            {showMobilePreview ? "Ocultar Vista" : "Previsualizar"}
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-[#5A3E44] hover:bg-[#432d32] text-white rounded-xl text-xs font-semibold shadow transition"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-1 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving ? "Publicando..." : "Publicar Invitación"}
            </button>
          )}
        </div>
      </header>

      {/* Alerta de error si ocurre */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex justify-between items-center">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="font-bold ml-2">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Contenedor principal: Formulario a la izquierda + Live Phone Simulator a la derecha */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario Wizard (7 Columnas en escritorio) */}
        <div className={`lg:col-span-7 ${showMobilePreview ? "hidden lg:block" : "block"}`}>
          {/* Pasos Progress Bar */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { num: 1, label: "Datos Básicos" },
              { num: 2, label: "Multimedia (S3)" },
              { num: 3, label: "Ubicación" },
              { num: 4, label: "RSVP & Estilo" },
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setStep(st.num)}
                className={`py-2.5 px-2 text-center rounded-xl border text-xs font-medium transition ${
                  step === st.num
                    ? "bg-[#5A3E44] text-white border-[#5A3E44] shadow-sm"
                    : step > st.num
                    ? "bg-pink-50 text-[#5A3E44] border-pink-200"
                    : "bg-white text-stone-400 border-stone-200"
                }`}
              >
                <span className="block font-bold">{st.num}. {st.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            {/* PASO 1: DATOS BÁSICOS */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-stone-900">1. Datos Generales de la Celebración</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Tipo de Evento</label>
                    <select
                      value={formData.tipoEvento}
                      onChange={(e) => updateField("tipoEvento", e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-pink-300 focus:outline-none"
                    >
                      <option value="QUINCEANERA">Mis XV Años</option>
                      <option value="BODA">Boda / Matrimonio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Nombre / Pareja</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => updateField("titulo", e.target.value)}
                      placeholder="Ej. Sofía o Sofía & Alejandro"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Enlace Personalizado (Slug de la Invitación)
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-stone-100 border border-r-0 border-stone-200 rounded-l-xl text-xs text-stone-500 font-mono">
                      tudominio.com/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                      }
                      className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-r-xl text-xs font-mono focus:ring-2 focus:ring-pink-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Fecha y Hora del Evento (Para el cronómetro)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.fechaEvento.toString().slice(0, 16)}
                    onChange={(e) => updateField("fechaEvento", e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  />
                </div>

                {/* Selector de Plantilla Visual */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Estilo Visual y Paleta de Colores (5 Presets)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(TEMPLATES) as TemplateId[]).map((tempKey) => {
                      const t = TEMPLATES[tempKey];
                      const isSelected = formData.estiloPlantilla === tempKey;
                      return (
                        <div
                          key={tempKey}
                          onClick={() => handleSelectTemplate(tempKey)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                            isSelected
                              ? "border-[#5A3E44] bg-pink-50/50 shadow-sm"
                              : "border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-800">{t.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#5A3E44]" />}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span
                              className="w-5 h-5 rounded-full border border-stone-300 shadow-sm"
                              style={{ backgroundColor: t.bgColor }}
                              title="Fondo"
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-stone-300 shadow-sm"
                              style={{ backgroundColor: t.accentColor }}
                              title="Acento"
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-stone-300 shadow-sm"
                              style={{ backgroundColor: t.buttonBg }}
                              title="Botón"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: MULTIMEDIA CON S3 */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-stone-900">2. Multimedia y Almacenamiento S3</h2>

                {/* Foto Portada 9:16 */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Fotografía Principal Vertical (Ratio 9:16) *
                  </label>
                  <p className="text-[11px] text-stone-500 mb-3">
                    Esta foto será la portada de la invitación y la vista previa al compartir en WhatsApp.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={formData.fotoPortadaUrl}
                      onChange={(e) => updateField("fotoPortadaUrl", e.target.value)}
                      placeholder="https://... o sube a S3"
                      className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                    <label className="flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingS3 ? "Subiendo..." : "Subir a S3"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "fotoPortadaUrl", "images")}
                      />
                    </label>
                  </div>
                </div>

                {/* Bloque Emocional: 2 fotos */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <label className="block text-xs font-bold text-stone-800">
                    Bloque Emocional: De Niña a Señorita / Ayer y Hoy
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-600 block mb-1">Foto de Infancia</span>
                      <input
                        type="text"
                        value={formData.fotoInfanciaUrl || ""}
                        onChange={(e) => updateField("fotoInfanciaUrl", e.target.value)}
                        placeholder="URL foto de niña"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-600 block mb-1">Foto Actual</span>
                      <input
                        type="text"
                        value={formData.fotoActualUrl || ""}
                        onChange={(e) => updateField("fotoActualUrl", e.target.value)}
                        placeholder="URL foto actual"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-600 block mb-1">Frase Emocional o Reflexión</span>
                    <textarea
                      rows={2}
                      value={formData.frasePersonalizada || ""}
                      onChange={(e) => updateField("frasePersonalizada", e.target.value)}
                      placeholder="Mensaje de agradecimiento o reflexión..."
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                    />
                  </div>
                </div>

                {/* Música MP3 */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Canción de Fondo (MP3)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={formData.musicaUrl || ""}
                      onChange={(e) => updateField("musicaUrl", e.target.value)}
                      placeholder="URL archivo .mp3"
                      className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                    <label className="flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer transition">
                      <Music className="w-3.5 h-3.5" />
                      {uploadingS3 ? "Subiendo..." : "Subir MP3 a S3"}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "musicaUrl", "audio")}
                      />
                    </label>
                  </div>
                </div>

                {/* Video del Evento (YouTube o MP4) */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Video de Agradecimiento o Sesión Previa (YouTube o MP4)
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Se reproducirá embebido de forma elegante en la sección audiovisual de la plantilla.
                  </p>
                  <input
                    type="text"
                    value={formData.videoUrl || ""}
                    onChange={(e) => updateField("videoUrl", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... o https://s3.../video.mp4"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                {/* Foto de Cierre / Despedida */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Foto de Cierre / Portada Final (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.fotoCierreUrl || ""}
                    onChange={(e) => updateField("fotoCierreUrl", e.target.value)}
                    placeholder="https://... URL de foto de cierre o retrato final"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                {/* Enlace Wishlist / Mesa de Regalos */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Mesa de Regalos / Wishlist Externa (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.wishlistUrl || ""}
                    onChange={(e) => updateField("wishlistUrl", e.target.value)}
                    placeholder="https://amazon.com/baby-reg/... o tienda departamental"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* PASO 3: UBICACIONES */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-stone-900">3. Locación y Mapas</h2>

                {/* Recepción (Salón Principal) */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">
                    Salón de Recepción / Fiesta (Obligatorio)
                  </span>
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Nombre del Salón</label>
                    <input
                      type="text"
                      value={formData.recepcionNombre}
                      onChange={(e) => updateField("recepcionNombre", e.target.value)}
                      placeholder="Ej. Gran Salón Real"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Dirección Completa</label>
                    <input
                      type="text"
                      value={formData.recepcionDireccion}
                      onChange={(e) => updateField("recepcionDireccion", e.target.value)}
                      placeholder="Calle, número, colonia, ciudad"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] text-stone-700 font-semibold">
                        Enlace o Código Embebido de Google Maps / Waze
                      </label>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-medium">
                        Soporta enlace o &lt;iframe&gt;
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.recepcionMapUrl}
                      onChange={(e) => updateField("recepcionMapUrl", e.target.value)}
                      placeholder="https://maps.google.com/... o pega aquí el código <iframe src='...'> de Google Maps"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono focus:border-stone-400 focus:outline-none"
                    />
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      💡 <strong>Para mostrar el mapa interactivo:</strong> En Google Maps haz clic en <strong>Compartir &gt; Incorporar un mapa</strong> y copia el código HTML para pegarlo aquí. También puedes pegar directamente el enlace web de Google Maps o Waze.
                    </p>
                  </div>
                </div>

                {/* Ceremonia Religiosa */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">
                    Ceremonia Religiosa / Iglesia (Opcional)
                  </span>
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Nombre de la Iglesia</label>
                    <input
                      type="text"
                      value={formData.ceremoniaNombre || ""}
                      onChange={(e) => updateField("ceremoniaNombre", e.target.value)}
                      placeholder="Ej. Parroquia San Juan Bautista"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Dirección de la Iglesia</label>
                    <input
                      type="text"
                      value={formData.ceremoniaDireccion || ""}
                      onChange={(e) => updateField("ceremoniaDireccion", e.target.value)}
                      placeholder="Calle, número, colonia, ciudad"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] text-stone-700 font-semibold">
                        Enlace o Código Embebido de Google Maps Iglesia
                      </label>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-medium">
                        Soporta enlace o &lt;iframe&gt;
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={formData.ceremoniaMapUrl || ""}
                      onChange={(e) => updateField("ceremoniaMapUrl", e.target.value)}
                      placeholder="https://maps.google.com/... o pega aquí el código <iframe src='...'>"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono focus:border-stone-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4: RSVP & DETALLES */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-stone-900">4. Configuración de RSVP y Detalles Finales</h2>

                {/* WhatsApp */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-stone-800">
                      Recepción de Confirmaciones por WhatsApp
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">
                        Teléfono WhatsApp (Con lada, sin signos +)
                      </label>
                      <input
                        type="text"
                        value={formData.telefonoWhatsappRsvp}
                        onChange={(e) => updateField("telefonoWhatsappRsvp", e.target.value)}
                        placeholder="Ej: 18181234567 o 5215512345678"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">
                        Máximo de pases por invitado
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.maxPasesPorInvitado || 4}
                        onChange={(e) => updateField("maxPasesPorInvitado", Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Dress Code */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">Código de Vestimenta</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Título</label>
                      <input
                        type="text"
                        value={formData.dressCodeTitulo || ""}
                        onChange={(e) => updateField("dressCodeTitulo", e.target.value)}
                        placeholder="Ej. Rigurosa Etiqueta o Formal"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Nota de Colores Reservados</label>
                      <input
                        type="text"
                        value={formData.dressCodeNota || ""}
                        onChange={(e) => updateField("dressCodeNota", e.target.value)}
                        placeholder="Ej. Reservado el rosa para la quinceañera"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Corte de Honor */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">Corte de Honor</span>
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Chambelán Principal</label>
                    <input
                      type="text"
                      value={formData.corteHonorJson?.chambelan || ""}
                      onChange={(e) =>
                        updateField("corteHonorJson", {
                          ...formData.corteHonorJson,
                          chambelan: e.target.value,
                        })
                      }
                      placeholder="Nombre del chambelán"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Controles de Navegación del Wizard */}
            <div className="flex justify-between items-center pt-4 border-t border-stone-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 px-5 py-2.5 bg-[#5A3E44] hover:bg-[#432d32] text-white rounded-xl text-xs font-semibold shadow transition"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {isSaving ? "Guardando..." : "Publicar Invitación"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Simulator en Tiempo Real (5 Columnas en escritorio) */}
        <div className={`lg:col-span-5 ${showMobilePreview ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-24">
            <MobileSimulator data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
