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
  Bell,
  Music,
  Eye,
  Sliders,
  Share2,
  X,
  Copy,
  Edit3,
  Volume2,
  VolumeX,
  Lock,
  Globe,
  Users,
  PhoneCall,
  Loader2,
  Settings,
  Palette,
} from "lucide-react";
import { TEMPLATES, TemplateId } from "@/lib/templates";
import { InvitationData } from "@/components/invitation/InvitationMobileView";
import MobileSimulator from "@/components/preview/MobileSimulator";
import TemplateConfigDispatcher from "@/components/events/forms/TemplateConfigDispatcher";
import TemplateSectionBuilder from "@/components/admin/TemplateSectionBuilder";
import EventSettingsConfig from "@/components/admin/EventSettingsConfig";
import TemplatePickerModal from "@/components/admin/TemplatePickerModal";

// Valores de ejemplo con los que arranca el formulario en modo crear (hallazgo 15)
const DEMO_INITIAL_VALUES = {
  titulo: "Magdalena",
  slug: "mi-celebracion",
  telefonoWhatsappRsvp: "18181234567",
  recepcionNombre: "Gran Salón Diamante",
};

// Una foto es "de plantilla/stock" si NO fue subida por el usuario a S3 (hallazgo 12)
function esFotoDePreset(url?: string | null): boolean {
  if (!url) return true;
  return !(
    url.includes("s3.") ||
    url.includes("amazonaws.com") ||
    url.includes("clientes/")
  );
}

function NuevoEventoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("editar") || searchParams.get("slug");
  const isEditMode = Boolean(editSlug);
  const [isLoadingEdit, setIsLoadingEdit] = useState(Boolean(editSlug));
  // Hallazgo 1: si al guardar en modo "crear" el slug ya existía y se actualizó
  // ese evento, el editor pasa visualmente a modo edición ("Guardar Cambios")
  const [existingEventMode, setExistingEventMode] = useState(false);
  const effectiveEditMode = isEditMode || existingEventMode;
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingS3, setUploadingS3] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [editorMode, setEditorMode] = useState<"sections" | "settings">("sections");
  const [showTemplatePicker, setShowTemplatePicker] = useState(
    !isEditMode && !searchParams.get("plantilla") && !searchParams.get("nombre")
  );

  // Estados locales para inputs de corte de honor (evitar pérdida de comas al teclear)
  const [damasRaw, setDamasRaw] = useState<string | null>(null);
  const [damitasRaw, setDamitasRaw] = useState<string | null>(null);
  const [padrinosRaw, setPadrinosRaw] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<InvitationData>({
    slug: "mi-celebracion",
    tipoEvento: "QUINCEANERA",
    estiloPlantilla: "QUINCE_ROSADO",
    titulo: "Magdalena",
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
    fotoZapato1Url: "",
    fotoZapato2Url: "",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    reproducirMusicaAlAbrir: true,
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
      quinceanera: "Magdalena",
      showQuinceanera: true,
      miniQuinceanera: "Elsy",
      showMiniQuinceanera: true,
      chambelan: "Jeremiah",
      showChambelan: true,
      miniChambelan: "Jose",
      showMiniChambelan: true,
      damas: ["Violeta", "Zoe", "Elsy Magdalena", "Tania", "Yani"],
      showDamas: true,
      damitasHojitas: ["Violet", "Zoe", "Green"],
      showDamitasHojitas: true,
      parents: "Magdalena & Adrian",
      showParents: true,
      padrinos: ["Tania", "Carl"],
      showPadrinos: true,
    },
    mesaRegalosJson: {
      titulo: "Lluvia de Sobres",
      mensaje: "Tu presencia es nuestro mayor regalo. Disponemos de un cofre en la recepción.",
    },
    configPlantilla: {},
    modalidadRsvp: "HIBRIDO",
    permitirConfirmacionTelefono: true,
    mostrarMesaRegalos: true,
    regalosMensajeEn: "",
    idiomaDefault: "es",
  });

  // Presets con fotos reales y textos para la previsualización de cada plantilla
  const TEMPLATE_PRESETS: Partial<Record<TemplateId, Partial<InvitationData>>> = {
    QUINCE_ROSADO: {
      estiloPlantilla: "QUINCE_ROSADO",
      tipoEvento: "QUINCEANERA",
      idiomaDefault: "es",
      permitirConfirmacionTelefono: true,
      mostrarMesaRegalos: true,
      mostrarDressCode: true,
      mostrarFrasePersonalizada: true,
      titulo: "Magdalena",
      subtitulo: "La Quinceañera",
      frasePersonalizada:
        "Hoy comienzo a escribir un nuevo capítulo al dejar atrás mi niñez para convertirme en mujer. En este día tan especial, rodeada del cariño de quienes más quiero, sería un honor contar con tu presencia para celebrar un momento que guardaré por siempre en mi corazón.",
      frasePersonalizadaEn:
        "Today I begin to write a new chapter as I leave childhood behind to become a young woman. On this special day, surrounded by the love of those I cherish most, it would be an honor to have your presence to celebrate a moment I will keep in my heart forever.",
      fechaTextoPersonalizada: "SÁBADO 15 DE MAYO, 2027 • 4:00 PM",
      fechaPlacaMes: "MAYO",
      fechaPlacaHora: "A las 4:00 PM 2027",
      fotoPortadaUrl: "/assets/template-quince-rosado/da616fa36a10f18a133b2dc0383a07d0.png",
      fotoInfanciaUrl: "/assets/template-quince-rosado/083dc0c793669d4a4d4a782851e93f65.png",
      fotoActualUrl: "/assets/template-quince-rosado/c0ec302539da1389b4c6b7d0b122ddd7.png",
      fotoCierreUrl: "/assets/template-quince-rosado/4046b1a7e943f6186c4bd79419897578.png",
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      dressCodeTitulo: "Elegante y Formal",
      dressCodeTituloEn: "Elegant & Formal",
      dressCodeNota: "Se invita a los invitados a vestir elegantemente. Por favor, NO usar atuendos ROSADOS ni BLANCOS.",
      dressCodeNotaEn: "Blush pink tones reserved exclusively for the quinceañera. Guests are encouraged to wear elegant formal attire.",
      ceremoniaNombre: "St. Mary's Church",
      ceremoniaDireccion: "Any City, Any Street, AZ 12345",
      ceremoniaMapUrl: "https://maps.google.com/?q=St.+Mary's+Church",
      recepcionNombre: "Grand Ballroom Palace",
      recepcionDireccion: "Any City, Any Street, AZ 12345",
      recepcionMapUrl: "https://maps.google.com/?q=Grand+Ballroom",
      rsvpFechaLimite: "Por favor, confirma tu asistencia antes del 20 de Octubre de 2026",
      itinerarioJson: [
        { hora: "11:00 am", titulo: "Ceremonia de la iglesia", tipoIcono: "church" },
        { hora: "12:00 am", titulo: "Llegada en carruaje", tipoIcono: "carriage" },
        { hora: "1:00 pm", titulo: "Llegada al salón", tipoIcono: "hall" },
        { hora: "3:00 pm", titulo: "Se servira la comida", tipoIcono: "dinner" },
        { hora: "4:00 pm", titulo: "Vals, Baile Sorpresa", tipoIcono: "waltz" },
        { hora: "5:00 pm", titulo: "Vals de padre e hija", tipoIcono: "father_dance" },
        { hora: "6:00 pm", titulo: "Padrinos de honor", tipoIcono: "crown" },
        { hora: "7:00 pm", titulo: "Hora de bailar", tipoIcono: "party" },
      ],
      corteHonorJson: {
        quinceanera: "Magdalena",
        showQuinceanera: true,
        miniQuinceanera: "Elsy",
        showMiniQuinceanera: true,
        chambelan: "Jeremiah",
        showChambelan: true,
        miniChambelan: "Jose",
        showMiniChambelan: true,
        damas: ["Violeta", "Zoe", "Elsy Magdalena", "Tania", "Yani"],
        showDamas: true,
        damitasHojitas: ["Violet", "Zoe", "Green"],
        showDamitasHojitas: true,
        parents: "Magdalena & Adrian",
        showParents: true,
        padrinos: ["Tania", "Carl"],
        showPadrinos: true,
      },
    },
    BLUE_BUTTERFLY: {
      estiloPlantilla: "BLUE_BUTTERFLY",
      tipoEvento: "QUINCEANERA",
      idiomaDefault: "bilingual",
      permitirConfirmacionTelefono: true,
      mostrarMesaRegalos: true,
      mostrarDressCode: true,
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
      dressCodeTituloEn: "Elegant & Formal",
      dressCodeNota: "Agradecemos reservar los tonos azul celeste y blanco para la quinceañera.",
      dressCodeNotaEn: "Blue and white tones reserved exclusively for the quinceañera.",
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
      idiomaDefault: "bilingual",
      permitirConfirmacionTelefono: true,
      mostrarMesaRegalos: true,
      titulo: "Isabella",
      subtitulo: "My Sweet Fifteen",
      frasePersonalizada:
        "Mr & Mrs Rodríguez warmly invite you to celebrate the Quinceañera of their daughter Isabella.",
      fechaTextoPersonalizada: "SUNDAY, JULY 18, 2026 • 4:00 PM",
      fotoPortadaUrl: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
      fotoInfanciaUrl: "/assets/template-rose/722d78548334333072ad7200e4f8233e.jpg",
      fotoActualUrl: "/assets/template-rose/5f24871f73b9424764387ef47bb5723e.png",
      fotoCierreUrl: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      musicaTitulo: "Photograph - Ed Sheeran",
      dressCodeTitulo: "Formal & Elegant Attire",
      dressCodeNota: "We invite our guests to dress in elegant formal attire. Reserved color: Blush pink for the Quinceañera.",
      ceremoniaNombre: "St. Mary's Church",
      ceremoniaDireccion: "Any City, Any Street, AZ 12345",
      ceremoniaMapUrl: "https://maps.google.com/?q=St.+Mary's+Church",
      recepcionNombre: "Grand Ballroom",
      recepcionDireccion: "Any City, Any Street, AZ 12345",
      recepcionMapUrl: "https://maps.google.com/?q=Grand+Ballroom",
      itinerarioJson: [
        { hora: "4:00 PM", titulo: "Mass Ceremony", lugar: "St. Mary's Church", tipoIcono: "church" },
        { hora: "5:00 PM", titulo: "Grand Entrance", lugar: "Grand Ballroom", tipoIcono: "entrance" },
        { hora: "6:00 PM", titulo: "The Waltz", lugar: "With Parents & Court", tipoIcono: "waltz" },
        { hora: "7:00 PM", titulo: "Dinner Banquet", lugar: "Formal toast & dining", tipoIcono: "dinner" },
        { hora: "9:00 PM", titulo: "Party & Dance", lugar: "Open floor celebration", tipoIcono: "party" },
      ],
      corteHonorJson: {
        padrinos: ["Miguel Herrera", "Daniela Herrera"],
        chambelan: "Emilio Salazar",
        damas: [
          "Isabella Cordero",
          "Valeria Morales",
          "Sofia Villanueva",
          "Emilia Rodriguez",
          "Camila Aguilar",
          "Maria Paz Leon",
          "Alondra Jimenez",
          "Regina Castro",
          "Natalia Sanchez",
        ],
        chambelanes: [
          "Diego Alvarez",
          "Santiago Lopez",
          "Francisco Ruiz",
          "Mateo Ramírez",
          "Alejandro Torres",
        ],
      },
      historiaHitosJson: [
        {
          foto: "/assets/template-rose/722d78548334333072ad7200e4f8233e.jpg",
          fecha: "2011",
          titulo: "First Steps",
          texto: "Every story has a beginning, and mine started with the love of family, the comfort of home, and countless little moments that became treasured memories.",
        },
        {
          foto: "/assets/template-rose/94a9fcddf0e62c3f0ffe60a5a769dd9c.jpg",
          fecha: "2016",
          titulo: "New Adventures",
          texto: "With each new adventure came exciting firsts, growing confidence, and friendships that would become an important part of my journey.",
        },
        {
          foto: "/assets/template-rose/97da854ac288883d24133acda9d854ca.jpg",
          fecha: "2020",
          titulo: "Treasured Memories",
          texto: "From laughter-filled days to unforgettable memories, these special people helped shape the person I am today.",
        },
        {
          foto: "/assets/template-rose/39e6d693ec9d82a484d96df04a0cffd3.jpg",
          fecha: "2024",
          titulo: "Loyal Companion",
          texto: "And through every chapter, there was one loyal companion by my side—sharing the cuddles, the adventures, and all of life's happiest moments.",
        },
      ],
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
    const deadlineYear = deadlineDate.getFullYear();

    return {
      deadlineDay,
      deadlineYear,
      monthEs,
      monthEn,
      fechaDestacadaEs: `${deadlineDay} de ${monthEs}, ${deadlineYear}`,
      fechaDestacadaEn: `${monthEn} ${deadlineDay}, ${deadlineYear}`,
      fraseEs: `Favor de confirmar antes del ${deadlineDay} de ${monthEs}`,
      fraseEn: `Please confirm before ${monthEn} ${deadlineDay}`,
      fechaLimiteRsvp: `${deadlineDay} de ${monthEs.toLowerCase()}`,
      // Hallazgo 5: la fecha límite real como ISO (el texto va en rsvpFechaLimite)
      fechaLimiteIso: deadlineDate.toISOString(),
    };
  };

  // Estado de carga para traducciones automáticas individuales o globales
  const [translatingField, setTranslatingField] = useState<string | null>(null);

  // Helper para traducir textos usando el endpoint con OpenAI gpt-4o-mini
  const translateTextWithAI = async (text: string, targetLang: "en" | "es" = "en"): Promise<string> => {
    if (!text || !text.trim()) return "";
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await res.json();
      if (data.success && data.translatedText) {
        return data.translatedText;
      }
      return "";
    } catch (err) {
      console.error("Error al traducir texto:", err);
      return "";
    }
  };

  // Helper para sugerir traducción rápida de hitos clásicos de quinceañera/boda
  const translateItinerarioTitle = (text: string): string => {
    if (!text) return "";
    const lower = text.toLowerCase().trim();
    if (lower.includes("ceremonia") || lower.includes("iglesia") || lower.includes("misa")) {
      if (lower.includes("san josé") || lower.includes("san jose")) {
        return "Religious Ceremony at St. Joseph the Worker Church";
      }
      return "Religious Ceremony";
    }
    if (lower.includes("llegada") && lower.includes("invitados")) return "Guest Arrival";
    if (lower.includes("llegada") && lower.includes("salón")) return "Arrival at Banquet Hall";
    if (lower.includes("llegada") && lower.includes("carruaje")) return "Carriage Arrival";
    if (lower.includes("cena") && lower.includes("brindis")) return "Dinner & Toast";
    if (lower.includes("cena") || lower.includes("comida")) return "Dinner Service";
    if (lower.includes("vals") && (lower.includes("fiesta") || lower.includes("baile"))) return "Waltz & Celebration";
    if (lower.includes("vals") && lower.includes("padre")) return "Father & Daughter Waltz";
    if (lower.includes("vals")) return "The Waltz";
    if (lower.includes("padrinos")) return "Court of Honor Presentation";
    if (lower.includes("bailar") || lower.includes("baile") || lower.includes("fiesta")) return "Party Time & Open Dance";
    if (lower.includes("pastel")) return "Cake Cutting";
    return text;
  };

  // Traducir un hito del itinerario individualmente (IA con fallback)
  const handleTranslateItinerarioItem = async (idx: number) => {
    const items = [...((formData.itinerarioJson as any[]) || [])];
    const item = items[idx];
    if (!item?.titulo) return;

    setTranslatingField(`itinerario-${idx}`);
    try {
      const aiResult = await translateTextWithAI(item.titulo, "en");
      const finalTranslation = aiResult || translateItinerarioTitle(item.titulo);
      items[idx] = { ...items[idx], tituloEn: finalTranslation };
      updateField("itinerarioJson", items);
    } finally {
      setTranslatingField(null);
    }
  };

  // Traducir todos los hitos del itinerario en lote con IA
  const handleTranslateAllItinerario = async () => {
    const items = [...((formData.itinerarioJson as any[]) || [])];
    if (items.length === 0) return;

    setTranslatingField("itinerario-all");
    try {
      const updated = await Promise.all(
        items.map(async (item) => {
          if (!item.titulo) return item;
          const aiResult = await translateTextWithAI(item.titulo, "en");
          return {
            ...item,
            tituloEn: aiResult || translateItinerarioTitle(item.titulo),
          };
        })
      );
      updateField("itinerarioJson", updated);
    } finally {
      setTranslatingField(null);
    }
  };

  // Manejar cambio en los días de anticipación RSVP
  const handleRsvpDiasChange = (dias: number) => {
    const val = Math.max(1, Math.min(90, dias || 1));
    const rsvpCalc = computeRsvpPhrases(formData.fechaEvento, val);
    setFormData((prev) => ({
      ...prev,
      rsvpDiasAntes: val,
      fechaLimiteRsvp: rsvpCalc.fechaLimiteIso,
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
      fechaLimiteRsvp: rsvpCalc.fechaLimiteIso,
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

  // Cargar parámetros de URL si vienen desde el Dashboard o Stripe Checkout
  useEffect(() => {
    if (isEditMode) return;
    const plantillaUrl = searchParams.get("plantilla") as TemplateId | null;
    if (plantillaUrl && (plantillaUrl in TEMPLATES || (plantillaUrl in TEMPLATE_PRESETS))) {
      handleSelectTemplate(plantillaUrl);
    }
    const nombreUrl = searchParams.get("nombre");
    if (nombreUrl) {
      updateField("titulo", nombreUrl);
      updateField(
        "slug",
        nombreUrl
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
    const tipoUrl = searchParams.get("tipo");
    if (tipoUrl) {
      updateField("tipoEvento", tipoUrl);
    }
    const telUrl = searchParams.get("telefono");
    if (telUrl) {
      updateField("telefonoWhatsappRsvp", telUrl);
    }
  }, [searchParams, isEditMode]);

  // Al seleccionar plantilla, se actualizan el estilo y los datos de demo/preview preservando datos del usuario
  const handleSelectTemplate = (tempKey: TemplateId) => {
    setDamasRaw(null);
    setDamitasRaw(null);
    setPadrinosRaw(null);
    const preset = TEMPLATE_PRESETS[tempKey];
    if (preset) {
      setFormData((prev) => {
        const isCustomName =
          isEditMode ||
          (prev.titulo &&
            prev.titulo !== "Valeria Sofía" &&
            prev.titulo !== "Isabella" &&
            prev.titulo !== "Isabella Rose" &&
            prev.titulo !== "Emma & Lucas" &&
            prev.titulo !== "Coraline Jones" &&
            prev.titulo !== "Sofía" &&
            prev.titulo !== "Magdalena");

        const formatted = formatFormalDate(
          prev.fechaEvento,
          (prev.idiomaDefault || preset.idiomaDefault || "es") as any
        );

        // Si el usuario subió una foto propia a S3, respetarla; si es una foto de plantilla por defecto, adoptar la del nuevo template
        const isUserUploadedPhoto =
          prev.fotoPortadaUrl &&
          (prev.fotoPortadaUrl.includes("s3.") ||
            prev.fotoPortadaUrl.includes("amazonaws.com") ||
            prev.fotoPortadaUrl.includes("clientes/"));

        // Si el usuario no ha puesto un nombre propio aún, adoptar completamente el preset
        if (!isCustomName) {
          return {
            ...prev,
            ...preset,
            estiloPlantilla: tempKey,
            fechaEvento: prev.fechaEvento,
            fechaTextoPersonalizada: formatted.formalText || preset.fechaTextoPersonalizada || prev.fechaTextoPersonalizada,
            fechaPlacaMes: formatted.mes || preset.fechaPlacaMes || prev.fechaPlacaMes,
            fechaPlacaHora: formatted.horaPlaca || preset.fechaPlacaHora || prev.fechaPlacaHora,
            fotoPortadaUrl: isUserUploadedPhoto ? prev.fotoPortadaUrl : (preset.fotoPortadaUrl || prev.fotoPortadaUrl),
          };
        }

        // Si ya tiene datos personalizados, mantenerlos y aplicar el estilo y multimedia del template
        return {
          ...preset,
          ...prev,
          estiloPlantilla: tempKey,
          titulo: prev.titulo,
          slug: prev.slug,
          fechaEvento: prev.fechaEvento,
          fechaTextoPersonalizada: formatted.formalText || prev.fechaTextoPersonalizada,
          fechaPlacaMes: formatted.mes || prev.fechaPlacaMes,
          fechaPlacaHora: formatted.horaPlaca || prev.fechaPlacaHora,
          fotoPortadaUrl: isUserUploadedPhoto ? prev.fotoPortadaUrl : (preset.fotoPortadaUrl || prev.fotoPortadaUrl),
          // Hallazgo 12: mismo criterio que la portada para las demás fotos —
          // foto de plantilla/stock se reemplaza por la del preset nuevo; subida S3 del usuario se conserva
          fotoInfanciaUrl: esFotoDePreset(prev.fotoInfanciaUrl) ? (preset.fotoInfanciaUrl || prev.fotoInfanciaUrl) : prev.fotoInfanciaUrl,
          fotoActualUrl: esFotoDePreset(prev.fotoActualUrl) ? (preset.fotoActualUrl || prev.fotoActualUrl) : prev.fotoActualUrl,
          fotoCierreUrl: esFotoDePreset(prev.fotoCierreUrl) ? (preset.fotoCierreUrl || prev.fotoCierreUrl) : prev.fotoCierreUrl,
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
    field:
      | "fotoPortadaUrl"
      | "fotoInfanciaUrl"
      | "fotoActualUrl"
      | "musicaUrl"
      | "fotoCierreUrl"
      | "fotoZapato1Url"
      | "fotoZapato2Url",
    mediaType: "images" | "audio" = "images"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingS3(true);
    setUploadingField(field);
    setErrorMsg(null);

    try {
      // Determinar si es audio y resolver el contentType exacto
      const isAudio = mediaType === "audio" || field === "musicaUrl";
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let resolvedType = file.type;
      if (!resolvedType || resolvedType === "application/octet-stream") {
        if (["mp3"].includes(ext)) resolvedType = "audio/mpeg";
        else if (["wav"].includes(ext)) resolvedType = "audio/wav";
        else if (["m4a"].includes(ext)) resolvedType = "audio/m4a";
        else if (["ogg"].includes(ext)) resolvedType = "audio/ogg";
        else if (["jpg", "jpeg"].includes(ext)) resolvedType = "image/jpeg";
        else if (["png"].includes(ext)) resolvedType = "image/png";
        else if (["webp"].includes(ext)) resolvedType = "image/webp";
        else resolvedType = isAudio ? "audio/mpeg" : "image/jpeg";
      }

      // Carpeta estructurada dentro del bucket luminavite-storage
      const subFolder = isAudio ? "audio" : "images";
      const clientFolder = `clientes/invitaciones/${formData.slug || "general"}/${subFolder}`;

      // 1. Pedir presigned URL a la API
      const res = await fetch("/api/s3/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: resolvedType,
          folder: clientFolder,
          fileSize: file.size,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar URL para S3");
      }

      // 2. Subir binario directo a S3 usando PUT con el Content-Type firmado
      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": resolvedType },
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
    shortLink: string;
    titulo: string;
  } | null>(null);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedMagic, setCopiedMagic] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  // Cargar datos del evento si estamos en modo edición (?editar=slug o ?slug=slug)
  useEffect(() => {
    if (!editSlug) return;
    setIsLoadingEdit(true);
    fetch(`/api/eventos?slug=${encodeURIComponent(editSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.evento) {
          const ev = data.evento;
          const parsedConfig =
            typeof ev.configPlantilla === "string"
              ? JSON.parse(ev.configPlantilla || "{}")
              : { ...(ev.configPlantilla || {}) };

          if (!parsedConfig.cambioZapatillas && (ev.fotoZapato1Url || ev.fotoZapato2Url)) {
            parsedConfig.cambioZapatillas = {
              fotoZapato1Url: ev.fotoZapato1Url || "",
              fotoZapato2Url: ev.fotoZapato2Url || "",
            };
          }

          const paquete = ev.ordenesCompra?.[0]?.paqueteId || ev.tipoPlan || null;

          // Hallazgo 7: el input datetime-local trabaja en hora LOCAL del navegador;
          // construir su valor con componentes locales (toISOString es UTC y corre la hora)
          const feDate = ev.fechaEvento ? new Date(ev.fechaEvento) : null;
          const fechaEventoLocal =
            feDate && !isNaN(feDate.getTime())
              ? `${feDate.getFullYear()}-${String(feDate.getMonth() + 1).padStart(2, "0")}-${String(feDate.getDate()).padStart(2, "0")}T${String(feDate.getHours()).padStart(2, "0")}:${String(feDate.getMinutes()).padStart(2, "0")}`
              : null;

          setFormData((prev) => ({
            ...prev,
            ...ev,
            tipoPlan: paquete || prev.tipoPlan,
            configPlantilla: parsedConfig,
            fechaEvento: fechaEventoLocal ?? prev.fechaEvento,
          }));
        }
      })
      .catch((err) => {
        console.error("Error al cargar evento para edición:", err);
        setErrorMsg("No se pudieron cargar los datos del evento para editar.");
      })
      .finally(() => setIsLoadingEdit(false));
  }, [editSlug]);

  // Hallazgo 15: ¿el formulario sigue EXACTAMENTE con los datos de ejemplo iniciales?
  const isStillDemoData = () =>
    formData.titulo === DEMO_INITIAL_VALUES.titulo &&
    formData.slug === DEMO_INITIAL_VALUES.slug &&
    formData.telefonoWhatsappRsvp === DEMO_INITIAL_VALUES.telefonoWhatsappRsvp &&
    formData.recepcionNombre === DEMO_INITIAL_VALUES.recepcionNombre;

  // Guardar en la base de datos (POST para crear, PUT para actualizar)
  const handleSave = async () => {
    // Hallazgo 15: en modo crear, no publicar con los datos de ejemplo intactos
    if (!effectiveEditMode && isStillDemoData()) {
      setErrorMsg("⚠️ Estás usando los datos de ejemplo: personalízalos antes de publicar.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      // Hallazgo 7: el valor del input datetime-local es hora LOCAL del navegador → ISO real
      const fechaEventoIso = formData.fechaEvento
        ? new Date(formData.fechaEvento).toISOString()
        : formData.fechaEvento;

      // Hallazgo 5: fechaLimiteRsvp viaja como ISO real (fechaEvento − rsvpDiasAntes);
      // el texto de la frase va en rsvpFechaLimite
      const rsvpCalc = computeRsvpPhrases(formData.fechaEvento, Number(formData.rsvpDiasAntes) || 15);
      const limiteParsed = formData.fechaLimiteRsvp ? new Date(formData.fechaLimiteRsvp) : null;
      const payload = {
        ...formData,
        fechaEvento: fechaEventoIso,
        fechaLimiteRsvp:
          limiteParsed && !isNaN(limiteParsed.getTime())
            ? limiteParsed.toISOString()
            : rsvpCalc.fechaLimiteIso,
        rsvpFechaLimite:
          formData.rsvpFechaLimite ||
          (formData.idiomaDefault === "en" ? rsvpCalc.fraseEn : rsvpCalc.fraseEs),
      };

      // Hallazgo 1: en modo crear, verificar primero si el slug ya existe;
      // si existe, se ACTUALIZA ese evento con PUT en vez de perder el formulario en un 409
      let method = effectiveEditMode ? "PUT" : "POST";
      let slugAlreadyExists = false;
      if (!effectiveEditMode && formData.slug) {
        try {
          const checkRes = await fetch(`/api/eventos?slug=${encodeURIComponent(formData.slug)}`);
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            if (checkData.evento) {
              method = "PUT";
              slugAlreadyExists = true;
            }
          }
        } catch {}
      }

      const res = await fetch("/api/eventos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "No se pudo guardar la invitación.");
      }

      if (slugAlreadyExists) {
        setExistingEventMode(true);
        setSaveSuccessMsg("Esta invitación ya existía: se actualizaron sus datos.");
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      } else if (isEditMode) {
        setSaveSuccessMsg("¡Cambios guardados con éxito en la invitación!");
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        let origin = typeof window !== "undefined" ? window.location.origin : "";
        if (typeof window !== "undefined" && window.location.host.startsWith("admin.")) {
          const publicHost = window.location.host.replace(/^admin\./, "");
          origin = `${window.location.protocol}//${publicHost}`;
        }
        const panelKey = result.evento?.panelToken || result.panelToken || "";
        const shortCode = result.evento?.panelShortCode || "";
        setCreatedLinks({
          publicUrl: `${origin}/${formData.slug}`,
          magicLink: `${origin}/${formData.slug}/panel?key=${panelKey}`,
          shortLink: shortCode ? `${origin}/m/${shortCode}` : "",
          titulo: formData.titulo,
        });
      }
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
              {effectiveEditMode ? (
                <>
                  <span className="text-amber-600">✏️</span>
                  <span>Editar Invitación: {formData.titulo}</span>
                </>
              ) : (
                "Crear Invitación Digital"
              )}
            </h1>
            <p className="text-xs text-stone-500">
              {editorMode === "sections"
                ? `Diseño y Secciones Modulares • clickandlove.app/${formData.slug}`
                : `Ajustes del Evento • clickandlove.app/${formData.slug}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Selector y botón interactivo para cambiar plantilla */}
          <button
            type="button"
            onClick={() => setShowTemplatePicker(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-stone-50 text-[#7A002A] rounded-xl text-xs font-semibold border border-stone-200 transition shadow-2xs cursor-pointer"
            title="Cambiar la plantilla visual de la invitación"
          >
            <Palette className="w-3.5 h-3.5 text-[#7A002A]" />
            <span className="hidden md:inline text-stone-500 font-normal">Plantilla:</span>
            <span className="font-bold max-w-[120px] sm:max-w-[180px] truncate">
              {TEMPLATES[formData.estiloPlantilla as TemplateId]?.name?.split("(")[0]?.trim() || formData.estiloPlantilla}
            </span>
            <span className="text-[10px] text-[#7A002A] underline font-bold">Cambiar</span>
          </button>

          {/* Botón ver en vivo si existe slug */}
          {formData.slug && (
            <a
              href={`/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-[#7A002A] rounded-xl text-xs font-semibold border border-stone-200 transition"
            >
              <Eye className="w-4 h-4" />
              <span>Ver en Vivo</span>
            </a>
          )}

          {/* Botón ver preview en móvil */}
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium"
          >
            <Eye className="w-4 h-4" />
            {showMobilePreview ? "Ocultar Vista" : "Previsualizar"}
          </button>

          {/* Botón GUARDAR CAMBIOS siempre disponible y prominente */}
          <button
            type="button"
            disabled={isSaving || isLoadingEdit}
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{isSaving ? "Guardando..." : effectiveEditMode ? "Guardar Cambios" : "Publicar Invitación"}</span>
          </button>
        </div>
      </header>

      {/* Alerta de éxito al guardar cambios */}
      {saveSuccessMsg && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex justify-between items-center shadow-sm">
            <span>✅ {saveSuccessMsg}</span>
            <button
              onClick={() => setSaveSuccessMsg(null)}
              className="font-bold ml-2 text-emerald-600 hover:text-emerald-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

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

      {/* Hallazgo 15: aviso permanente en modo crear — el formulario parte de datos de ejemplo */}
      {!effectiveEditMode && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium shadow-sm">
            📝 Estás partiendo de datos de ejemplo: cambia el nombre, el enlace, el teléfono y el salón por los datos reales de tu evento antes de publicar.
          </div>
        </div>
      )}

      {/* Contenedor principal: Formulario a la izquierda + Live Phone Simulator a la derecha */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario Wizard / Organizador Modular (7 Columnas en escritorio) */}
        <div className={`lg:col-span-7 ${showMobilePreview ? "hidden lg:block" : "block"}`}>
          {/* Selector de Pestañas Unificado: Diseño y Secciones vs Ajustes del Evento */}
          <div className="flex items-center justify-between bg-white p-1 rounded-2xl border border-stone-200 shadow-xs mb-6">
            <button
              type="button"
              onClick={() => setEditorMode("sections")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                editorMode === "sections"
                  ? "bg-[#7A002A] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>🎨 Diseño y Secciones</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("settings")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                editorMode === "settings"
                  ? "bg-[#7A002A] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>⚙️ Ajustes del Evento</span>
            </button>
          </div>

          {editorMode === "sections" ? (
            <TemplateSectionBuilder
              formData={formData}
              updateField={updateField}
              setFormData={setFormData}
              handleFileUpload={handleFileUpload}
              uploadingS3={uploadingS3}
              uploadingField={uploadingField}
              formatFormalDate={formatFormalDate}
              computeRsvpPhrases={computeRsvpPhrases}
              onOpenTemplatePicker={() => setShowTemplatePicker(true)}
            />
          ) : (
            <EventSettingsConfig
              formData={formData}
              updateField={updateField}
              setFormData={setFormData}
              computeRsvpPhrases={computeRsvpPhrases}
              handleRsvpDiasChange={handleRsvpDiasChange}
              isEditMode={effectiveEditMode}
              handleSave={handleSave}
              isSaving={isSaving}
              onSelectTemplate={handleSelectTemplate}
              onOpenTemplatePicker={() => setShowTemplatePicker(true)}
            />
          )}
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
                  <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
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
                {createdLinks.shortLink && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-[11px] text-amber-900/80 mb-2">
                      <strong>Link corto (recomendado para la mamá):</strong> abre el mismo
                      panel, pero es corto y fácil de guardar o dictar. Si algún día hay que
                      cambiarlo, se regenera desde el Dashboard sin tocar la clave.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={createdLinks.shortLink}
                        className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-mono text-amber-900 select-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(createdLinks.shortLink);
                          setCopiedShort(true);
                          setTimeout(() => setCopiedShort(false), 2000);
                        }}
                        className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                      >
                        {copiedShort ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedShort ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>
                  </div>
                )}
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
      {/* Modal Interactivo de Selección de Plantilla */}
      <TemplatePickerModal
        isOpen={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        currentTemplateId={formData.estiloPlantilla || "QUINCE_ROSADO"}
        onSelectTemplate={(newId) => handleSelectTemplate(newId)}
        isInitialSelection={!isEditMode && !searchParams.get("plantilla")}
      />
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
