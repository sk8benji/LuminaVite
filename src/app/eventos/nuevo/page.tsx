"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Share2,
  X,
  Copy,
  Edit3,
} from "lucide-react";
import { TEMPLATES, TemplateId } from "@/lib/templates";
import { InvitationData } from "@/components/invitation/InvitationMobileView";
import MobileSimulator from "@/components/preview/MobileSimulator";

function NuevoEventoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("editar") || searchParams.get("slug");
  const isEditMode = Boolean(editSlug);
  const [isLoadingEdit, setIsLoadingEdit] = useState(Boolean(editSlug));
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingS3, setUploadingS3] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
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
    emailOrganizador: "mama.valeria@example.com",
    aforoTotal: 200,
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
    dressCodeEtiqueta: "Formal & Rigurosa Etiqueta",
    dressCodeColoresReservados: "Tonos rosa pastel reservados para la quinceañera",
    countdownEncabezado: "Faltan sólo...",
    fechaPlacaMes: "NOVIEMBRE",
    fechaPlacaHora: "A LAS 4:00 PM",
    fechaPlacaLugar: "Gran Salón Diamante",
    regalosMensaje: "Tu presencia es nuestro mayor regalo. Disponemos de un cofre en la recepción.",
    regalosZelle: "",
    regalosCashApp: "",
    rsvpFechaLimite: "Favor de confirmar antes del 15 de Noviembre",
    rsvpDiasAntes: 15,
    coloresReservados: ["#FCECEE", "#FFFFFF"],
    itinerarioJson: [
      { hora: "4:00 PM", titulo: "Llegada de Invitados", tipoIcono: "welcome" },
      { hora: "5:00 PM", titulo: "Ceremonia Religiosa", tipoIcono: "entrance" },
      { hora: "7:00 PM", titulo: "Cena & Brindis", tipoIcono: "dinner" },
      { hora: "8:30 PM", titulo: "Vals y Fiesta", tipoIcono: "waltz" },
    ],
    corteHonorJson: {
      chambelan: "Jeremiah",
      damas: ["Magdalena", "Violeta", "Tania"],
    },
    mesaRegalosJson: {
      titulo: "Lluvia de Sobres",
      mensaje: "Tu presencia es nuestro mayor regalo. Disponemos de un cofre en la recepción.",
    },
    idiomaDefault: "es",
  });

  // Presets con fotos reales y textos para la previsualización de cada plantilla
  const TEMPLATE_PRESETS: Partial<Record<TemplateId, Partial<InvitationData>>> = {
    BLUE_BUTTERFLY: {
      estiloPlantilla: "BLUE_BUTTERFLY",
      tipoEvento: "QUINCEANERA",
      idiomaDefault: "bilingual",
      titulo: "Valeria Sofía",
      subtitulo: "My Quinceañera",
      frasePersonalizada:
        "Doy gracias a Dios por cada instante de mi vida y a mis padres por su amor incondicional en esta noche tan soñada.",
      fechaTextoPersonalizada: "SÁBADO 24 DE OCTUBRE, 2026",
      fotoPortadaUrl: "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blue-butterfly/foto-columpio-portada.png",
      fotoInfanciaUrl: "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blue-butterfly/foto-sesion-1.jpg",
      fotoActualUrl: "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blue-butterfly/foto-sesion-2.jpg",
      fotoCierreUrl: "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blue-butterfly/foto-gala-vestido.jpg",
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      textoDisco: "Click to Play Music",
      dressCodeTitulo: "Formal Elegante",
      dressCodeNota: "Agradecemos reservar los tonos azul celeste y blanco para la quinceañera.",
      dressCodeEtiqueta: "Formal & Rigurosa Etiqueta",
      dressCodeColoresReservados: "Tonos azul celeste y blanco reservados exclusivamente para la quinceañera",
      countdownEncabezado: "Faltan sólo...",
      fechaPlacaMes: "OCTUBRE",
      fechaPlacaHora: "A LAS 3:00 PM",
      fechaPlacaLugar: "Hacienda Los Jardines Celestiales",
      regalosMensaje: "Tu presencia es nuestro mayor regalo. Si deseas tener un detalle con la quinceañera, dispondremos de un cofre en la recepción.",
      regalosZelle: "valeria.xv@example.com",
      regalosCashApp: "$ValeriaXV",
      rsvpFechaLimite: "Favor de confirmar antes del 20 de Octubre",
      rsvpDiasAntes: 15,
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

  // Helper para formatear fechas automáticamente en español o inglés
  const formatFormalDate = (dateInput: string | Date, lang: string = "es") => {
    if (!dateInput) return { formalText: "", mes: "", horaPlaca: "", diaSemana: "", diaNumero: "", anio: "" };

    let year = 2026, month = 9, day = 24, hours = 18, minutes = 0, dayOfWeek = 6;
    if (typeof dateInput === "string" && dateInput.includes("T")) {
      const [dPart, tPart] = dateInput.split("T");
      const [y, m, d] = dPart.split("-").map(Number);
      const [h, min] = (tPart || "00:00").split(":").map(Number);
      const dateObj = new Date(y, m - 1, d, h || 0, min || 0);
      year = dateObj.getFullYear();
      month = dateObj.getMonth();
      day = dateObj.getDate();
      dayOfWeek = dateObj.getDay();
      hours = dateObj.getHours();
      minutes = dateObj.getMinutes();
    } else {
      const dateObj = new Date(dateInput);
      if (!isNaN(dateObj.getTime())) {
        year = dateObj.getFullYear();
        month = dateObj.getMonth();
        day = dateObj.getDate();
        dayOfWeek = dateObj.getDay();
        hours = dateObj.getHours();
        minutes = dateObj.getMinutes();
      }
    }

    const daysEs = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const daysEn = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    const monthsEs = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const monthsEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMins = minutes < 10 ? `0${minutes}` : String(minutes);
    const timeStr = displayMins === "00" ? `${displayHours}:00 ${ampm}` : `${displayHours}:${displayMins} ${ampm}`;

    const isEn = lang === "en";

    return {
      formalText: isEn
        ? `${daysEn[dayOfWeek]}, ${monthsEn[month]} ${day}, ${year}`
        : `${daysEs[dayOfWeek]} ${day} DE ${monthsEs[month]}, ${year}`,
      mes: isEn ? monthsEn[month] : monthsEs[month],
      horaPlaca: isEn ? `AT ${timeStr}` : `A LAS ${timeStr}`,
      diaSemana: isEn ? daysEn[dayOfWeek] : daysEs[dayOfWeek],
      diaNumero: String(day),
      anio: String(year),
    };
  };

  // Helper para calcular la frase fija RSVP bilingüe según días de anticipación
  const computeRsvpPhrases = (eventDateInput: string | Date, dias: number) => {
    let year = 2026, month = 9, day = 24;
    if (typeof eventDateInput === "string" && eventDateInput.includes("T")) {
      const [dPart] = eventDateInput.split("T");
      const [y, m, d] = dPart.split("-").map(Number);
      const dObj = new Date(y, m - 1, d);
      year = dObj.getFullYear();
      month = dObj.getMonth();
      day = dObj.getDate();
    } else {
      const dObj = new Date(eventDateInput);
      if (!isNaN(dObj.getTime())) {
        year = dObj.getFullYear();
        month = dObj.getMonth();
        day = dObj.getDate();
      }
    }

    const eventTime = new Date(year, month, day).getTime();
    const deadlineDate = new Date(eventTime - dias * 24 * 60 * 60 * 1000);
    const deadlineDay = deadlineDate.getDate();

    const rawMonthEs = deadlineDate.toLocaleDateString("es-ES", { month: "long" });
    const rawMonthEn = deadlineDate.toLocaleDateString("en-US", { month: "long" });
    const monthEs = rawMonthEs.charAt(0).toUpperCase() + rawMonthEs.slice(1);
    const monthEn = rawMonthEn.charAt(0).toUpperCase() + rawMonthEn.slice(1);

    return {
      deadlineDay,
      monthEs,
      monthEn,
      fraseEs: `Favor de confirmar antes del ${deadlineDay} de ${monthEs}`,
      fraseEn: `Please confirm before ${monthEn} ${deadlineDay}`,
      fechaLimiteRsvp: `${deadlineDay} de ${monthEs.toLowerCase()}`,
    };
  };

  // Manejar cambio en los días de anticipación RSVP
  const handleRsvpDiasChange = (dias: number) => {
    const val = Math.max(1, Math.min(90, dias || 1));
    const rsvpCalc = computeRsvpPhrases(formData.fechaEvento, val);
    setFormData((prev) => ({
      ...prev,
      rsvpDiasAntes: val,
      fechaLimiteRsvp: rsvpCalc.fechaLimiteRsvp,
      rsvpFechaLimite: prev.idiomaDefault === "en" ? rsvpCalc.fraseEn : rsvpCalc.fraseEs,
    }));
  };

  // Manejar cambio de fecha con actualización automática de textos de presentación
  const handleDateChange = (newDateStr: string) => {
    const formatted = formatFormalDate(newDateStr, formData.idiomaDefault || "es");
    const dias = Number(formData.rsvpDiasAntes) || 15;
    const rsvpCalc = computeRsvpPhrases(newDateStr, dias);
    setFormData((prev) => ({
      ...prev,
      fechaEvento: newDateStr,
      fechaTextoPersonalizada: formatted.formalText,
      fechaPlacaMes: formatted.mes,
      fechaPlacaHora: formatted.horaPlaca,
      fechaLimiteRsvp: rsvpCalc.fechaLimiteRsvp,
      rsvpFechaLimite: prev.idiomaDefault === "en" ? rsvpCalc.fraseEn : rsvpCalc.fraseEs,
    }));
  };

  // Botón rápido para alternar formato entre Español e Inglés
  const applyDateFormat = (targetLang: "es" | "en") => {
    const formatted = formatFormalDate(formData.fechaEvento, targetLang);
    setFormData((prev) => ({
      ...prev,
      fechaTextoPersonalizada: formatted.formalText,
      fechaPlacaMes: formatted.mes,
      fechaPlacaHora: formatted.horaPlaca,
    }));
  };

  // Manejar cambio de idioma de la invitación
  const handleLanguageChange = (newLang: "es" | "en" | "bilingual") => {
    const targetDateLang = newLang === "en" ? "en" : "es";
    const formatted = formatFormalDate(formData.fechaEvento, targetDateLang);
    const dias = Number(formData.rsvpDiasAntes) || 15;
    const rsvpCalc = computeRsvpPhrases(formData.fechaEvento, dias);
    setFormData((prev) => ({
      ...prev,
      idiomaDefault: newLang,
      fechaTextoPersonalizada: formatted.formalText,
      fechaPlacaMes: formatted.mes,
      fechaPlacaHora: formatted.horaPlaca,
      subtitulo: newLang === "en" ? (prev.subtitulo === "Mis Quince Años" ? "My Quinceañera" : prev.subtitulo) : prev.subtitulo,
      countdownEncabezado: newLang === "en" ? "Counting down..." : "Faltan sólo...",
      rsvpFechaLimite: newLang === "en" ? rsvpCalc.fraseEn : rsvpCalc.fraseEs,
    }));
  };

  // Al seleccionar plantilla, se actualizan el estilo y los datos de demo/preview preservando datos del usuario
  const handleSelectTemplate = (tempKey: TemplateId) => {
    const preset = TEMPLATE_PRESETS[tempKey];
    if (preset) {
      setFormData((prev) => {
        const isCustomName =
          prev.titulo &&
          prev.titulo !== "Valeria Sofía" &&
          prev.titulo !== "Isabella Rose" &&
          prev.titulo !== "Emma & Lucas" &&
          prev.titulo !== "Coraline Jones" &&
          prev.titulo !== "Sofía";
        const formatted = formatFormalDate(
          prev.fechaEvento,
          (prev.idiomaDefault || preset.idiomaDefault || "es") as any
        );
        return {
          ...preset,
          ...prev,
          estiloPlantilla: tempKey,
          titulo: isCustomName ? prev.titulo : (preset.titulo || prev.titulo),
          slug: isCustomName ? prev.slug : (preset.slug || prev.slug),
          fechaEvento: prev.fechaEvento,
          fechaTextoPersonalizada: formatted.formalText || prev.fechaTextoPersonalizada,
          fechaPlacaMes: formatted.mes || prev.fechaPlacaMes,
          fechaPlacaHora: formatted.horaPlaca || prev.fechaPlacaHora,
          fotoPortadaUrl: preset.fotoPortadaUrl || prev.fotoPortadaUrl,
          fotoInfanciaUrl: preset.fotoInfanciaUrl || prev.fotoInfanciaUrl,
          fotoActualUrl: preset.fotoActualUrl || prev.fotoActualUrl,
          fotoCierreUrl: preset.fotoCierreUrl || prev.fotoCierreUrl,
          musicaUrl: preset.musicaUrl || prev.musicaUrl,
          dressCodeTitulo: preset.dressCodeTitulo || prev.dressCodeTitulo,
          dressCodeNota: preset.dressCodeNota || prev.dressCodeNota,
        };
      });
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
    field: "fotoPortadaUrl" | "fotoInfanciaUrl" | "fotoActualUrl" | "musicaUrl" | "fotoCierreUrl",
    mediaType: "images" | "audio" = "images"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingS3(true);
    setUploadingField(field);
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
      setUploadingField(null);
    }
  };

  // Modal de éxito tras publicar o guardar cambios
  const [createdLinks, setCreatedLinks] = useState<{
    publicUrl: string;
    magicLink: string;
    titulo: string;
  } | null>(null);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedMagic, setCopiedMagic] = useState(false);

  // Cargar datos del evento si estamos en modo edición (?editar=slug o ?slug=slug)
  useEffect(() => {
    if (!editSlug) return;
    setIsLoadingEdit(true);
    fetch(`/api/eventos?slug=${encodeURIComponent(editSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.evento) {
          const ev = data.evento;
          setFormData((prev) => ({
            ...prev,
            ...ev,
            fechaEvento: ev.fechaEvento
              ? new Date(ev.fechaEvento).toISOString().slice(0, 16)
              : prev.fechaEvento,
          }));
        }
      })
      .catch((err) => {
        console.error("Error al cargar evento para edición:", err);
        setErrorMsg("No se pudieron cargar los datos del evento para editar.");
      })
      .finally(() => setIsLoadingEdit(false));
  }, [editSlug]);

  // Guardar en la base de datos (POST para crear, PUT para actualizar)
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);

    try {
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch("/api/eventos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "No se pudo guardar la invitación.");
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const panelKey = result.evento?.panelToken || result.panelToken || "";
      setCreatedLinks({
        publicUrl: `${origin}/${formData.slug}`,
        magicLink: `${origin}/${formData.slug}/panel?key=${panelKey}`,
        titulo: formData.titulo,
      });
      setIsSaving(false);
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
            <h1 className="text-base font-bold text-stone-900 flex items-center gap-2">
              {isEditMode ? (
                <>
                  <span className="text-amber-600">✏️</span>
                  <span>Editar Invitación: {formData.titulo}</span>
                </>
              ) : (
                "Crear Invitación Digital"
              )}
            </h1>
            <p className="text-xs text-stone-500">
              {isEditMode
                ? `Modificando /${formData.slug} • Paso ${step} de 4`
                : `Paso ${step} de 4`}
            </p>
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
              disabled={isSaving || isLoadingEdit}
              onClick={handleSave}
              className="flex items-center gap-1 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving
                ? "Guardando..."
                : isEditMode
                ? "Guardar Cambios"
                : "Publicar Invitación"}
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
                    Título de la Portada / Subtítulo Superior (Sección 1)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitulo || ""}
                    onChange={(e) => updateField("subtitulo", e.target.value)}
                    placeholder="Ej. My Quinceañera o Mis Quince Años"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  />
                </div>

                {/* Selector Rápido de Idioma Principal */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-stone-700">
                      Idioma de la Invitación
                    </label>
                    <span className="text-[10px] text-stone-400">
                      Define el formato automático de la fecha y textos
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLanguageChange("es")}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        (formData.idiomaDefault || "es") === "es"
                          ? "bg-[#5A3E44] text-white border-[#5A3E44] shadow-sm font-semibold"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <span>🇲🇽</span> Español
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange("en")}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        formData.idiomaDefault === "en"
                          ? "bg-[#5A3E44] text-white border-[#5A3E44] shadow-sm font-semibold"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <span>🇺🇸</span> English
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange("bilingual")}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        formData.idiomaDefault === "bilingual"
                          ? "bg-[#5A3E44] text-white border-[#5A3E44] shadow-sm font-semibold"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <span>🌐</span> Bilingüe
                    </button>
                  </div>
                </div>

                {/* Fecha y Hora con Generación Automática en Español o Inglés */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Fecha y Hora del Evento (Selector de Calendario)
                    </label>
                    <input
                      type="datetime-local"
                      value={
                        typeof formData.fechaEvento === "string"
                          ? formData.fechaEvento.slice(0, 16)
                          : new Date(formData.fechaEvento).toISOString().slice(0, 16)
                      }
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-300 focus:outline-none"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      ⚡ Al cambiar la fecha se actualiza el texto automáticamente
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-stone-700">
                        Texto Formal de la Fecha (Tarjeta)
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => applyDateFormat("es")}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition cursor-pointer border border-stone-200"
                          title="Formatear automáticamente en Español"
                        >
                          🇪🇸 Español
                        </button>
                        <button
                          type="button"
                          onClick={() => applyDateFormat("en")}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition cursor-pointer border border-stone-200"
                          title="Format automatically in English"
                        >
                          🇺🇸 English
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.fechaTextoPersonalizada || ""}
                      onChange={(e) => updateField("fechaTextoPersonalizada", e.target.value)}
                      placeholder="Ej. SÁBADO 19 DE DICIEMBRE, 2026"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-300 focus:outline-none font-medium text-stone-800"
                    />
                    <p className="text-[10px] text-emerald-600 mt-1">
                      ✓ Generado en tiempo real (puedes editarlo si deseas)
                    </p>
                  </div>
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
                      <span className="text-[11px] font-semibold text-stone-700 block mb-1">Foto de Infancia (Ayer)</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.fotoInfanciaUrl || ""}
                          onChange={(e) => updateField("fotoInfanciaUrl", e.target.value)}
                          placeholder="URL foto de niña o sube a S3"
                          className="flex-1 min-w-0 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                        />
                        <label className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer transition shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingField === "fotoInfanciaUrl" ? "Subiendo..." : "Subir a S3"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "fotoInfanciaUrl", "images")}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-stone-700 block mb-1">Foto Actual (Hoy)</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.fotoActualUrl || ""}
                          onChange={(e) => updateField("fotoActualUrl", e.target.value)}
                          placeholder="URL foto actual o sube a S3"
                          className="flex-1 min-w-0 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                        />
                        <label className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer transition shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingField === "fotoActualUrl" ? "Subiendo..." : "Subir a S3"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "fotoActualUrl", "images")}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-600 block mb-1">Frase Emocional / Bendición</span>
                      <textarea
                        rows={2}
                        value={formData.frasePersonalizada || ""}
                        onChange={(e) => updateField("frasePersonalizada", e.target.value)}
                        placeholder="Mensaje de agradecimiento o bendición..."
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-600 block mb-1">Firma / Autor de la Bendición</span>
                      <input
                        type="text"
                        value={formData.autorBendicion || ""}
                        onChange={(e) => updateField("autorBendicion", e.target.value)}
                        placeholder="Ej. Con amor, tus padres o Mis Quince Años"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Música MP3 & Texto del Disco */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <label className="block text-xs font-bold text-stone-800">
                    Módulo Musical & Disco de Vinilo (Sección 2)
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
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">
                      Texto en Arco sobre el Vinilo
                    </label>
                    <input
                      type="text"
                      value={formData.textoDisco || ""}
                      onChange={(e) => updateField("textoDisco", e.target.value)}
                      placeholder="Ej. Click to Play Music o Toca para Escuchar Música"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={formData.fotoCierreUrl || ""}
                      onChange={(e) => updateField("fotoCierreUrl", e.target.value)}
                      placeholder="https://... URL de foto de cierre o sube a S3"
                      className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                    <label className="flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingField === "fotoCierreUrl" ? "Subiendo..." : "Subir a S3"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "fotoCierreUrl", "images")}
                      />
                    </label>
                  </div>
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

                {/* Placa de Fecha y Recinto (Sección 4 de la Plantilla) */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 block">
                      Placa Formal de Fecha y Recinto (Sección 4)
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                      Pergamino con Rosas
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Mes en Placa</label>
                      <input
                        type="text"
                        value={formData.fechaPlacaMes || ""}
                        onChange={(e) => updateField("fechaPlacaMes", e.target.value)}
                        placeholder="Ej. OCTUBRE / OCTOBER"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Hora en Placa</label>
                      <input
                        type="text"
                        value={formData.fechaPlacaHora || ""}
                        onChange={(e) => updateField("fechaPlacaHora", e.target.value)}
                        placeholder="Ej. A LAS 4:00 PM / AT 4 PM"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Nombre en Placa</label>
                      <input
                        type="text"
                        value={formData.fechaPlacaLugar || ""}
                        onChange={(e) => updateField("fechaPlacaLugar", e.target.value)}
                        placeholder="Ej. GRAN SALÓN REAL"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase"
                      />
                    </div>
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

                {/* WhatsApp & RSVP Límite */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-stone-800">
                      Recepción de Confirmaciones por WhatsApp & Control de Pases
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    <div className="bg-stone-50/80 p-3 rounded-2xl border border-stone-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-semibold text-stone-700">
                          Anticipación Límite para Confirmar (RSVP)
                        </label>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {formData.rsvpDiasAntes || 15} días antes
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          max={90}
                          value={formData.rsvpDiasAntes || 15}
                          onChange={(e) => handleRsvpDiasChange(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-stone-400 font-medium pointer-events-none">
                          días antes del evento
                        </span>
                      </div>

                      {/* Botones de Presets rápidos */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-stone-400">Rápido:</span>
                        {[7, 10, 15, 20, 30].map((dias) => (
                          <button
                            key={dias}
                            type="button"
                            onClick={() => handleRsvpDiasChange(dias)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition ${
                              (formData.rsvpDiasAntes || 15) === dias
                                ? "bg-stone-900 text-white shadow-xs"
                                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                            }`}
                          >
                            {dias}d
                          </button>
                        ))}
                      </div>

                      {/* Vista previa en vivo con texto fijo en ambos idiomas */}
                      {(() => {
                        const previewCalc = computeRsvpPhrases(formData.fechaEvento, formData.rsvpDiasAntes || 15);
                        return (
                          <div className="p-2 bg-white rounded-xl border border-stone-100 space-y-1 text-[10.5px]">
                            <div className="flex items-center gap-1.5 text-stone-600">
                              <span className="text-[10px]">🇲🇽</span>
                              <span className="font-semibold text-stone-800">{previewCalc.fraseEs}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-stone-600">
                              <span className="text-[10px]">🇺🇸</span>
                              <span className="font-semibold text-stone-800">{previewCalc.fraseEn}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Notificaciones Inmediatas por Correo al Anfitrión (AWS SES) */}
                  <div className="pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <label className="block text-[11px] font-semibold text-stone-700">
                          Email del Anfitrión / Mamá (Alertas en Tiempo Real)
                        </label>
                        <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                          AWS SES
                        </span>
                      </div>
                      <input
                        type="email"
                        value={formData.emailOrganizador || ""}
                        onChange={(e) => updateField("emailOrganizador", e.target.value)}
                        placeholder="mama.valeria@gmail.com"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <p className="text-[10px] text-stone-400 mt-1">
                        Recibe un correo breve al instante con el balance y el Magic Link por cada confirmación.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Aforo Total Estimado (Meta de Pases del Salón)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={1000}
                        value={formData.aforoTotal || 200}
                        onChange={(e) => updateField("aforoTotal", Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <p className="text-[10px] text-stone-400 mt-1">
                        Se muestra en la barra de progreso del correo: ej. "Llevas 142 de 200 pases".
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contador Regresivo */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Encabezado del Cronómetro / Countdown (Sección 5)
                  </label>
                  <input
                    type="text"
                    value={formData.countdownEncabezado || ""}
                    onChange={(e) => updateField("countdownEncabezado", e.target.value)}
                    placeholder="Ej. Faltan sólo... o Save The Date"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* Itinerario Flexible */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        Itinerario Flexible del Evento (Sección 6)
                      </span>
                      <p className="text-[11px] text-stone-500">
                        Añade o edita los hitos de tu evento. Si dejas la lista vacía, se cargarán los predeterminados.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = Array.isArray(formData.itinerarioJson) ? [...formData.itinerarioJson] : [];
                        current.push({ hora: "6:00 PM", titulo: "Nuevo Hito", tipoIcono: "crown" });
                        updateField("itinerarioJson", current);
                      }}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                    >
                      + Añadir Hito
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {((formData.itinerarioJson as any[]) || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                      >
                        <input
                          type="text"
                          value={item.hora || ""}
                          onChange={(e) => {
                            const updated = [...(formData.itinerarioJson as any[])];
                            updated[idx] = { ...updated[idx], hora: e.target.value };
                            updateField("itinerarioJson", updated);
                          }}
                          placeholder="Hora (ej. 4:30 PM)"
                          className="w-full sm:w-36 px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={item.titulo || ""}
                          onChange={(e) => {
                            const updated = [...(formData.itinerarioJson as any[])];
                            updated[idx] = { ...updated[idx], titulo: e.target.value };
                            updateField("itinerarioJson", updated);
                          }}
                          placeholder="Título del hito (ej. Grand entrance)"
                          className="flex-1 px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs"
                        />
                        <select
                          value={item.tipoIcono || "welcome"}
                          onChange={(e) => {
                            const updated = [...(formData.itinerarioJson as any[])];
                            updated[idx] = { ...updated[idx], tipoIcono: e.target.value };
                            updateField("itinerarioJson", updated);
                          }}
                          className="px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs bg-stone-50"
                        >
                          <option value="welcome">Bienvenida</option>
                          <option value="entrance">Entrada</option>
                          <option value="dinner">Cena</option>
                          <option value="waltz">Vals</option>
                          <option value="disco">Baile</option>
                          <option value="cake">Pastel</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.itinerarioJson as any[]).filter((_, i) => i !== idx);
                            updateField("itinerarioJson", updated);
                          }}
                          className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-bold transition text-xs text-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dress Code */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">Código de Vestimenta (Sección 7)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Etiqueta Formal</label>
                      <input
                        type="text"
                        value={formData.dressCodeEtiqueta || formData.dressCodeTitulo || ""}
                        onChange={(e) => {
                          updateField("dressCodeEtiqueta", e.target.value);
                          updateField("dressCodeTitulo", e.target.value);
                        }}
                        placeholder="Ej. Formal & Rigurosa Etiqueta"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Colores Reservados / Pautas</label>
                      <input
                        type="text"
                        value={formData.dressCodeColoresReservados || formData.dressCodeNota || ""}
                        onChange={(e) => {
                          updateField("dressCodeColoresReservados", e.target.value);
                          updateField("dressCodeNota", e.target.value);
                        }}
                        placeholder="Ej. Tonos azul celeste y blanco reservados para la quinceañera"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Lluvia de Sobres & Cuentas Digitales */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">Lluvia de Sobres & Cuentas Digitales (Sección 9)</span>
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Mensaje del Cofre / Regalos</label>
                    <textarea
                      rows={2}
                      value={formData.regalosMensaje || ""}
                      onChange={(e) => updateField("regalosMensaje", e.target.value)}
                      placeholder="Tu presencia es nuestro mayor regalo. Disponemos de un cofre en la recepción..."
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Cuenta o Teléfono Zelle (Opcional)</label>
                      <input
                        type="text"
                        value={formData.regalosZelle || ""}
                        onChange={(e) => updateField("regalosZelle", e.target.value)}
                        placeholder="Ej. 18181234567 o valeria.xv@example.com"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Cash App / Cashtag (Opcional)</label>
                      <input
                        type="text"
                        value={formData.regalosCashApp || ""}
                        onChange={(e) => updateField("regalosCashApp", e.target.value)}
                        placeholder="Ej. $ValeriaXV"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Corte de Honor */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">Corte de Honor & Padrinos (Sección 11)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        placeholder="Ej. Jeremiah Smith"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Padres de la Quinceañera</label>
                      <input
                        type="text"
                        value={formData.corteHonorJson?.parents || ""}
                        onChange={(e) =>
                          updateField("corteHonorJson", {
                            ...formData.corteHonorJson,
                            parents: e.target.value,
                          })
                        }
                        placeholder="Ej. Carlos Mendoza & Patricia Solís"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Damas de Honor (separadas por coma)</label>
                      <input
                        type="text"
                        value={(formData.corteHonorJson?.damas || []).join(", ")}
                        onChange={(e) =>
                          updateField("corteHonorJson", {
                            ...formData.corteHonorJson,
                            damas: e.target.value.split(",").map((d) => d.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Ej. Magdalena, Violeta, Tania"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Padrinos (separados por coma)</label>
                      <input
                        type="text"
                        value={(formData.corteHonorJson?.padrinos || []).join(", ")}
                        onChange={(e) =>
                          updateField("corteHonorJson", {
                            ...formData.corteHonorJson,
                            padrinos: e.target.value.split(",").map((p) => p.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Ej. Roberto & Andrea"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Mensaje de Despedida / Footer */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Mensaje de Despedida / Cierre (Footer)
                  </label>
                  <input
                    type="text"
                    value={formData.mensajeDespedida || ""}
                    onChange={(e) => updateField("mensajeDespedida", e.target.value)}
                    placeholder="Ej. Esperamos contar con tu valiosa presencia."
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                  />
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
                  {isSaving ? "Guardando..." : isEditMode ? "Guardar Cambios" : "Publicar Invitación"}
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

      {/* Modal de Éxito con las Dos URLs Generadas Automáticamente */}
      {createdLinks && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreatedLinks(null);
          }}
        >
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Botón de cerrar (X) en la esquina superior derecha */}
            <button
              type="button"
              onClick={() => setCreatedLinks(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5 pr-6">
              <span className="text-3xl block">🎉</span>
              <h3 className="text-lg font-bold text-stone-900">
                {isEditMode ? "¡Invitación Actualizada Exitosamente!" : "¡Invitación Publicada Exitosamente!"}
              </h3>
              <p className="text-xs text-stone-500">
                {isEditMode
                  ? "Los cambios ya están reflejados en tu invitación en vivo."
                  : "El sistema generó automáticamente las dos URLs únicas para tu evento."}
              </p>
            </div>

            <div className="space-y-4">
              {/* 1. URL PÚBLICA (Para los invitados) */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#5A3E44]" />
                    1. URL Pública (Para Invitados vía WhatsApp)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Sin login
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Enlace que los invitados abren para ver la invitación con música, mapas y confirmar asistencia.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={createdLinks.publicUrl}
                    className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono text-stone-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(createdLinks.publicUrl);
                      setCopiedPublic(true);
                      setTimeout(() => setCopiedPublic(false), 2000);
                    }}
                    className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedPublic ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPublic ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* 2. MAGIC LINK (Para la mamá / cliente) */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    2. Magic Link (Panel de la Mamá / Cliente)
                  </span>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    Monitoreo en vivo
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80">
                  Entrégale este link a la mamá. Ella podrá ver cuántos invitados han confirmado en tiempo real y descargar la lista en Excel sin crear cuentas ni contraseñas.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={createdLinks.magicLink}
                    className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-mono text-amber-900 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(createdLinks.magicLink);
                      setCopiedMagic(true);
                      setTimeout(() => setCopiedMagic(false), 2000);
                    }}
                    className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedMagic ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMagic ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <Link
                href={createdLinks.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 text-center bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition"
              >
                Abrir Invitación
              </Link>
              <Link
                href={createdLinks.magicLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 text-center bg-[#2F5A84] hover:bg-[#203e5c] text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                Abrir Panel Magic Link
              </Link>
              <button
                type="button"
                onClick={() => setCreatedLinks(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-center bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-semibold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NuevoEventoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500 flex items-center gap-2 shadow-sm">
            <span className="text-base animate-pulse">✨</span>
            <span>Cargando editor de invitación...</span>
          </div>
        </div>
      }
    >
      <NuevoEventoContent />
    </Suspense>
  );
}
