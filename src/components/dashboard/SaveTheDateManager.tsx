"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CalendarHeart,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Eye,
  Users,
  Calendar,
  Sparkles,
  RefreshCw,
  Clock,
  Trash2,
  Edit3,
  Heart,
  X,
  MapPin,
  Music,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Play,
  Square,
} from "lucide-react";

// Foto del sobre abierto del demo (vestido rosado). El admin la puede
// cambiar desde el modal; si queda vacía, la vista pública usa esta.
// OJO: este archivo es cliente, no puede importar el helper del servidor
// (save-the-date-table.ts trae Prisma); por eso la URL va literal aquí.
const FOTO_SOBRE_ABIERTO_DEMO =
  "/assets/save-the-date/f291897753a9fc56f20003d177749b21.webp";

export interface SaveTheDateItem {
  id: string;
  slug: string;
  eventoId?: string | null;
  titulo: string;
  subtitulo?: string | null;
  mensaje?: string | null;
  fechaEvento: string;
  fechaTextoPersonalizada?: string | null;
  ciudad?: string | null;
  estiloPlantilla: string;
  colorSobre?: string | null;
  colorSello?: string | null;
  tipoLetra?: string | null;
  fotoPortadaUrl: string;
  fotoSobreAbiertoUrl?: string | null; // 2ª foto del hero, se ve al abrir el sobre
  galeriaFotosUrls: string[];
  musicaUrl?: string | null;
  musicaTitulo?: string | null;
  mostrarSobre: boolean;
  mostrarGaleria: boolean;
  mostrarContador: boolean;
  mostrarCalendario: boolean;
  mostrarPreRsvp: boolean;
  textoPreRsvp?: string | null;
  telefonoWhatsapp?: string | null;
  tituloCalendarioEs?: string | null;
  tituloCalendarioEn?: string | null;
  tituloContadorEs?: string | null;
  tituloContadorEn?: string | null;
  tituloRsvpEs?: string | null;
  tituloRsvpEn?: string | null;
  preguntaRsvpEs?: string | null;
  preguntaRsvpEn?: string | null;
  subtituloEn?: string | null;
  vistasContador: number;
  activo: boolean;
  createdAt: string;
  evento?: {
    id: string;
    slug: string;
    titulo: string;
    fechaEvento: string;
    tipoEvento: string;
    estiloPlantilla: string;
  } | null;
  _count?: {
    preRsvps: number;
  };
  preRsvps?: Array<{
    id: string;
    nombre: string;
    telefono?: string | null;
    email?: string | null;
    respuesta: string;
    pasesTentativos: number;
    notas?: string | null;
    createdAt: string;
  }>;
}

export default function SaveTheDateManager() {
  const [items, setItems] = useState<SaveTheDateItem[]>([]);
  const [eventos, setEventos] = useState<Array<{ id: string; slug: string; titulo: string; fechaEvento: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [copiadoSlug, setCopiadoSlug] = useState<string | null>(null);

  // Modal para ver confirmados
  const [verConfirmadosItem, setVerConfirmadosItem] = useState<SaveTheDateItem | null>(null);
  const [cargandoConfirmados, setCargandoConfirmados] = useState(false);

  // Modal Crear / Editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoItem, setEditandoItem] = useState<SaveTheDateItem | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [subiendoArchivo, setSubiendoArchivo] = useState<string | null>(null);
  const [reproduciendoAudio, setReproduciendoAudio] = useState(false);
  const audioDemoRef = useRef<HTMLAudioElement | null>(null);

  // Formulario local
  const [formData, setFormData] = useState({
    slug: "",
    eventoId: "",
    titulo: "",
    subtitulo: "Mis Quince Años",
    mensaje: "Guarda esta fecha especial en tu calendario. Muy pronto compartiremos todos los detalles y la invitación formal.",
    fechaEvento: "",
    fechaTextoPersonalizada: "Viernes 18 de Septiembre, 2026",
    ciudad: "Los Ángeles, California",
    estiloPlantilla: "QUINCE_ROSADO",
    colorSobre: "#FFE8EE",
    colorSello: "#D4AF37",
    fotoPortadaUrl: "/assets/save-the-date/principal.jpeg",
    fotoSobreAbiertoUrl: FOTO_SOBRE_ABIERTO_DEMO,
    galeriaFotosUrls: [
      "/assets/save-the-date/save1.webp",
      "/assets/save-the-date/save2.webp",
      "/assets/save-the-date/save3.webp",
    ] as string[],
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicaTitulo: "A Thousand Years (Instrumental)",
    mostrarSobre: true,
    mostrarGaleria: true,
    mostrarContador: true,
    mostrarCalendario: true,
    mostrarPreRsvp: true,
    textoPreRsvp: "¿Podrás Acompañarnos?",
    telefonoWhatsapp: "18181234567",
    tituloCalendarioEs: "RESERVA LA FECHA",
    tituloCalendarioEn: "SAVE THE DATE",
    tituloContadorEs: "Solo Faltan...",
    tituloContadorEn: "Countdown...",
    tituloRsvpEs: "Confirmación Anticipada",
    tituloRsvpEn: "Early RSVP",
    preguntaRsvpEs: "¿Podrás Acompañarnos?",
    preguntaRsvpEn: "Will You Join Us?",
    subtituloEn: "My Sweet Fifteen",
  });

  const toggleProbarAudio = (url: string) => {
    if (!url) return;
    if (audioDemoRef.current) {
      if (reproduciendoAudio) {
        audioDemoRef.current.pause();
        setReproduciendoAudio(false);
        return;
      }
    }
    const audio = new Audio(url);
    audioDemoRef.current = audio;
    audio.play().then(() => setReproduciendoAudio(true)).catch(() => {});
    audio.onended = () => setReproduciendoAudio(false);
  };

  const handleSubirArchivo = async (
    e: React.ChangeEvent<HTMLInputElement>,
    campo: string,
    esAudio: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoArchivo(campo);
    setFormError(null);

    try {
      const folder = esAudio ? "save-the-date/audio" : "save-the-date/images";
      const presignedRes = await fetch("/api/s3/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || (esAudio ? "audio/mpeg" : "image/jpeg"),
          folder,
          fileSize: file.size,
        }),
      });

      const presignedData = await presignedRes.json();
      if (!presignedRes.ok) throw new Error(presignedData.error || "No se pudo obtener enlace firmado de S3");

      await fetch(presignedData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (campo.startsWith("galeria-")) {
        const idx = parseInt(campo.split("-")[1], 10);
        setFormData((prev) => {
          const nuevas = [...prev.galeriaFotosUrls];
          nuevas[idx] = presignedData.fileUrl;
          return { ...prev, galeriaFotosUrls: nuevas };
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [campo]: presignedData.fileUrl,
          ...(esAudio && !prev.musicaTitulo ? { musicaTitulo: file.name.replace(/\.[^/.]+$/, "") } : {}),
        }));
      }
    } catch (err: any) {
      setFormError(err.message || "Error al subir archivo a AWS S3");
    } finally {
      setSubiendoArchivo(null);
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resStd, resEventos] = await Promise.all([
        fetch("/api/save-the-date").then((r) => r.json()),
        fetch("/api/eventos").then((r) => r.json()),
      ]);

      let stdItems = resStd.items || [];
      const hasDemo = stdItems.some((i: any) => i.slug === "demo");
      if (!hasDemo) {
        stdItems = [
          {
            id: "demo-master",
            slug: "demo",
            titulo: "Melissa",
            subtitulo: "Mis Quince Años",
            mensaje: "Guarda esta fecha especial en tu calendario. Muy pronto compartiremos todos los detalles y la invitación formal.",
            fechaEvento: "2027-09-18T20:00:00.000Z",
            fechaTextoPersonalizada: "Viernes 18 de Septiembre, 2026",
            ciudad: "Los Ángeles, California",
            estiloPlantilla: "QUINCE_ROSADO",
            colorSobre: "#FFE8EE",
            colorSello: "#D4AF37",
            tipoLetra: "Cinzel",
            fotoPortadaUrl: "/assets/save-the-date/principal.jpeg",
            fotoSobreAbiertoUrl: FOTO_SOBRE_ABIERTO_DEMO,
            galeriaFotosUrls: [
              "/assets/save-the-date/save1.webp",
              "/assets/save-the-date/save2.webp",
              "/assets/save-the-date/save3.webp",
            ],
            musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            musicaTitulo: "A Thousand Years (Instrumental)",
            mostrarSobre: true,
            mostrarGaleria: true,
            mostrarContador: true,
            mostrarCalendario: true,
            mostrarPreRsvp: true,
            textoPreRsvp: "¿Podrás Acompañarnos?",
            telefonoWhatsapp: "18181234567",
            vistasContador: 0,
            activo: true,
            createdAt: new Date().toISOString(),
          },
          ...stdItems,
        ];
      }
      setItems(stdItems);

      if (resEventos.eventos) {
        setEventos(resEventos.eventos);
      }
    } catch (err) {
      console.error("Error al cargar Save The Dates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirCrear = () => {
    setEditandoItem(null);
    setFormError(null);
    setFormData({
      slug: "",
      eventoId: eventos[0]?.id || "",
      titulo: eventos[0]?.titulo || "Valeria Sofía",
      subtitulo: "Mis Quince Años",
      mensaje: "Guarda esta fecha especial en tu calendario. Muy pronto compartiremos todos los detalles y la invitación formal.",
      fechaEvento: eventos[0]?.fechaEvento
        ? new Date(eventos[0].fechaEvento).toISOString().slice(0, 16)
        : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      fechaTextoPersonalizada: "Viernes 18 de Septiembre, 2026",
      ciudad: "Los Ángeles, California",
      estiloPlantilla: "QUINCE_ROSADO",
      colorSobre: "#FFE8EE",
      colorSello: "#D4AF37",
      fotoPortadaUrl: "/assets/save-the-date/principal.jpeg",
      fotoSobreAbiertoUrl: FOTO_SOBRE_ABIERTO_DEMO,
      galeriaFotosUrls: [
        "/assets/save-the-date/save1.webp",
        "/assets/save-the-date/save2.webp",
        "/assets/save-the-date/save3.webp",
      ],
      musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      musicaTitulo: "A Thousand Years (Instrumental)",
      mostrarSobre: true,
      mostrarGaleria: true,
      mostrarContador: true,
      mostrarCalendario: true,
      mostrarPreRsvp: true,
      textoPreRsvp: "¿Podrás Acompañarnos?",
      telefonoWhatsapp: "18181234567",
      tituloCalendarioEs: "RESERVA LA FECHA",
      tituloCalendarioEn: "SAVE THE DATE",
      tituloContadorEs: "Solo Faltan...",
      tituloContadorEn: "Countdown...",
      tituloRsvpEs: "Confirmación Anticipada",
      tituloRsvpEn: "Early RSVP",
      preguntaRsvpEs: "¿Podrás Acompañarnos?",
      preguntaRsvpEn: "Will You Join Us?",
      subtituloEn: "My Sweet Fifteen",
    });
    setModalAbierto(true);
  };

  const abrirEditar = (item: SaveTheDateItem) => {
    setEditandoItem(item);
    setFormError(null);
    setFormData({
      slug: item.slug,
      eventoId: item.eventoId || "",
      titulo: item.titulo,
      subtitulo: item.subtitulo || "Save Our Date",
      mensaje: item.mensaje || "",
      fechaEvento: new Date(item.fechaEvento).toISOString().slice(0, 16),
      fechaTextoPersonalizada: item.fechaTextoPersonalizada || "",
      ciudad: item.ciudad || "",
      estiloPlantilla: item.estiloPlantilla || "QUINCE_ROSADO",
      colorSobre: item.colorSobre || "#FFF0F3",
      colorSello: item.colorSello || "#C5A059",
      fotoPortadaUrl: item.fotoPortadaUrl,
      fotoSobreAbiertoUrl: item.fotoSobreAbiertoUrl || FOTO_SOBRE_ABIERTO_DEMO,
      galeriaFotosUrls: item.galeriaFotosUrls || [],
      musicaUrl: item.musicaUrl || "",
      musicaTitulo: item.musicaTitulo || "",
      mostrarSobre: item.mostrarSobre !== false,
      mostrarGaleria: item.mostrarGaleria !== false,
      mostrarContador: item.mostrarContador !== false,
      mostrarCalendario: item.mostrarCalendario !== false,
      mostrarPreRsvp: item.mostrarPreRsvp !== false,
      textoPreRsvp: item.textoPreRsvp || "¿Crees que podrás acompañarnos?",
      telefonoWhatsapp: item.telefonoWhatsapp || "",
      tituloCalendarioEs: item.tituloCalendarioEs || "RESERVA LA FECHA",
      tituloCalendarioEn: item.tituloCalendarioEn || "SAVE THE DATE",
      tituloContadorEs: item.tituloContadorEs || "Solo Faltan...",
      tituloContadorEn: item.tituloContadorEn || "Countdown...",
      tituloRsvpEs: item.tituloRsvpEs || "Confirmación Anticipada",
      tituloRsvpEn: item.tituloRsvpEn || "Early RSVP",
      preguntaRsvpEs: item.preguntaRsvpEs || item.textoPreRsvp || "¿Podrás Acompañarnos?",
      preguntaRsvpEn: item.preguntaRsvpEn || "Will You Join Us?",
      subtituloEn: item.subtituloEn || "My Sweet Fifteen",
    });
    setModalAbierto(true);
  };

  // Al seleccionar un evento del dropdown, auto-rellenar datos
  const handleSelectEvento = (eId: string) => {
    const sel = eventos.find((ev) => ev.id === eId);
    if (sel) {
      setFormData((prev) => ({
        ...prev,
        eventoId: sel.id,
        titulo: prev.titulo || sel.titulo,
        slug: prev.slug || `${sel.slug}-std`,
        fechaEvento: sel.fechaEvento ? new Date(sel.fechaEvento).toISOString().slice(0, 16) : prev.fechaEvento,
      }));
    } else {
      setFormData((prev) => ({ ...prev, eventoId: "" }));
    }
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setFormError(null);
    try {
      const url = editandoItem ? `/api/save-the-date/${editandoItem.slug}` : "/api/save-the-date";
      const method = editandoItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "No se pudo guardar");
      }

      setModalAbierto(false);
      await cargarDatos();
    } catch (err: any) {
      setFormError(err.message || "Error al procesar la solicitud");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (slug: string) => {
    if (!confirm(`¿Estás seguro de eliminar el Save The Date "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/save-the-date/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.slug !== slug));
      }
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const verConfirmados = async (item: SaveTheDateItem) => {
    setVerConfirmadosItem(item);
    setCargandoConfirmados(true);
    try {
      const res = await fetch(`/api/save-the-date/${item.slug}`).then((r) => r.json());
      if (res.item) {
        setVerConfirmadosItem(res.item);
      }
    } finally {
      setCargandoConfirmados(false);
    }
  };

  const getPublicUrl = (slug: string) => {
    if (typeof window === "undefined") return `/save-the-date/${slug}`;
    let origin = window.location.origin;
    if (window.location.host.startsWith("admin.")) {
      const publicHost = window.location.host.replace(/^admin\./, "");
      origin = `${window.location.protocol}//${publicHost}`;
    }
    return `${origin}/save-the-date/${slug}`;
  };

  const copiarEnlace = (slug: string) => {
    const url = getPublicUrl(slug);
    navigator.clipboard.writeText(url);
    setCopiadoSlug(slug);
    setTimeout(() => setCopiadoSlug(null), 2000);
  };

  const itemsFiltrados = items.filter((item) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      item.titulo.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      (item.ciudad || "").toLowerCase().includes(q) ||
      (item.evento?.titulo || "").toLowerCase().includes(q)
    );
  });

  const totalPreRsvps = items.reduce((acc, curr) => acc + (curr._count?.preRsvps || curr.preRsvps?.length || 0), 0);
  const totalVistas = items.reduce((acc, curr) => acc + (curr.vistasContador || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── ENCABEZADO Y MÉTRICAS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-serif">
              Save the Date Digital
            </h1>
            <span className="text-[11px] uppercase tracking-wider font-semibold bg-pink-100 text-[#7A002A] px-2.5 py-0.5 rounded-full border border-pink-200">
              💌 Pre-Invitaciones
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Crea tarjetas previas con sobre interactivo, fotos en vertical, cuenta regresiva, calendario y pre-confirmación conectada directamente a la lista de invitados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={cargarDatos}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl shadow-2xs hover:bg-stone-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Save the Date</span>
          </button>
        </div>
      </div>

      {/* ── TARJETAS DE MÉTRICAS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Save the Dates Activos
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{items.length}</p>
          </div>
          <div className="p-3 bg-pink-50 text-[#7A002A] rounded-xl">
            <CalendarHeart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Pre-Confirmaciones Recibidas
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{totalPreRsvps}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total de Vistas
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{totalVistas}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── BARRA DE BÚSQUEDA ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, enlace o evento vinculado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7A002A]"
          />
        </div>
        <p className="text-xs text-stone-400 font-medium px-2">
          Mostrando {itemsFiltrados.length} de {items.length}
        </p>
      </div>

      {/* ── LISTADO DE TARJETAS ── */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#7A002A]" />
          Cargando Save the Dates...
        </div>
      ) : itemsFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <CalendarHeart className="w-10 h-10 text-pink-300 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800">No hay Save the Dates creados aún</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Crea tu primer Save the Date para compartirlo con los invitados meses antes de la fiesta.
          </p>
          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7A002A] text-white rounded-xl text-xs font-bold hover:bg-[#5e0020] transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear mi primer Save the Date</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsFiltrados.map((item) => {
            const publicUrl = getPublicUrl(item.slug);
            const fechaStr = new Date(item.fechaEvento).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const totalRsvpItem = item._count?.preRsvps || item.preRsvps?.length || 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Foto Protagonista / Header */}
                  <div className="relative h-56 bg-stone-900 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.fotoPortadaUrl}
                      alt={item.titulo}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Badge Plantilla */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 text-[#7A002A] backdrop-blur-md shadow-xs">
                      💌 Save the Date
                    </span>

                    {/* Vistas */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.vistasContador}</span>
                    </div>

                    {/* Título y Fecha sobre imagen */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-pink-200">
                        {item.subtitulo || "Save Our Date"}
                      </p>
                      <h3 className="font-serif font-bold text-lg leading-tight mt-0.5 drop-shadow-md">
                        {item.titulo}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-stone-200">
                        <Calendar className="w-3 h-3 text-amber-300" />
                        <span>{fechaStr}</span>
                        {item.ciudad && (
                          <>
                            <span>•</span>
                            <span className="truncate">{item.ciudad}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div className="p-4 space-y-3">
                    {/* Evento vinculado */}
                    {item.evento ? (
                      <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-200/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Sparkles className="w-3.5 h-3.5 text-[#7A002A] shrink-0" />
                          <div className="truncate">
                            <span className="text-[10px] font-bold text-stone-400 uppercase block">Invitación Oficial</span>
                            <span className="font-bold text-stone-800 truncate block">
                              {item.evento.titulo}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`/${item.evento.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#7A002A] hover:underline shrink-0 ml-2"
                        >
                          Ver
                        </a>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center justify-between">
                        <span>Sin invitación vinculada</span>
                        <button
                          onClick={() => abrirEditar(item)}
                          className="text-[11px] font-bold text-[#7A002A] hover:underline"
                        >
                          Vincular
                        </button>
                      </div>
                    )}

                    {/* Pre-Confirmaciones y Enlace */}
                    <div className="flex items-center justify-between py-1 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-stone-900">{totalRsvpItem}</span>
                        <span>pre-confirmados</span>
                      </div>

                      <button
                        onClick={() => verConfirmados(item)}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        Ver lista
                      </button>
                    </div>

                    {/* Caja de URL */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                      <span className="text-stone-400 font-mono text-[11px] truncate flex-1 select-all">
                        clickandlove.app/save-the-date/{item.slug}
                      </span>
                      <button
                        onClick={() => copiarEnlace(item.slug)}
                        title="Copiar link"
                        className="p-1 rounded-lg hover:bg-stone-200 text-stone-600 transition cursor-pointer"
                      >
                        {copiadoSlug === item.slug ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Acciones de pie */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`/save-the-date/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver en Vivo</span>
                    </a>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `¡Hola! Reserva la fecha para ${item.titulo} 💌 Abre el Save the Date aquí: ${publicUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                    <button
                      onClick={() => abrirEditar(item)}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleEliminar(item.slug)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Eliminar Save the Date"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: VER PRE-CONFIRMACIONES ── */}
      {verConfirmadosItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setVerConfirmadosItem(null);
          }}
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Pre-Confirmaciones: {verConfirmadosItem.titulo}
                </h3>
                <p className="text-xs text-stone-500">
                  Invitados que confirmaron en el Save the Date (/save-the-date/{verConfirmadosItem.slug})
                </p>
              </div>
              <button
                onClick={() => setVerConfirmadosItem(null)}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2">
              {cargandoConfirmados ? (
                <div className="text-center py-8 text-xs text-stone-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#7A002A]" />
                  Cargando invitados...
                </div>
              ) : !verConfirmadosItem.preRsvps || verConfirmadosItem.preRsvps.length === 0 ? (
                <div className="text-center py-12 text-xs text-stone-500">
                  Aún no hay confirmaciones registradas para este Save the Date.
                </div>
              ) : (
                verConfirmadosItem.preRsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{rsvp.nombre}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rsvp.respuesta === "SI"
                              ? "bg-emerald-100 text-emerald-800"
                              : rsvp.respuesta === "TAL_VEZ"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {rsvp.respuesta === "SI" ? "✓ Asistirá" : rsvp.respuesta === "TAL_VEZ" ? "? Tentativo" : "✗ No asiste"}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          ({rsvp.pasesTentativos} pases)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-500">
                        {rsvp.telefono && <span>📞 {rsvp.telefono}</span>}
                        {rsvp.email && <span>✉️ {rsvp.email}</span>}
                        <span>• {new Date(rsvp.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                      {rsvp.notas && (
                        <p className="text-[11px] text-stone-600 mt-1 italic">&quot;{rsvp.notas}&quot;</p>
                      )}
                    </div>

                    {rsvp.telefono && (
                      <a
                        href={`https://wa.me/${rsvp.telefono.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs hover:bg-[#20ba5a] shrink-0"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end shrink-0">
              <button
                onClick={() => setVerConfirmadosItem(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CREAR / EDITAR SAVE THE DATE ── */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && !guardando) setModalAbierto(false);
          }}
        >
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Cabecera */}
            <div className="p-5 bg-gradient-to-r from-stone-900 via-[#420d20] to-stone-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-pink-300">
                  <CalendarHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base leading-tight">
                    {editandoItem ? `Editar Save the Date: ${editandoItem.titulo}` : "Crear Nuevo Save the Date"}
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Configura los datos del evento, sobre interactivo y módulos
                  </p>
                </div>
              </div>

              <button
                onClick={() => !guardando && setModalAbierto(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario con Scroll */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Vincular a Invitación Existente */}
              <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200/80 space-y-2">
                <label className="block text-xs font-bold text-[#7A002A] uppercase tracking-wider">
                  🔗 Vincular a una Invitación Oficial (Recomendado)
                </label>
                <p className="text-[11px] text-stone-600">
                  Al vincularlo, las pre-confirmaciones se sumarán a la lista de invitados (`guests`) del panel de la anfitriona.
                </p>
                <select
                  value={formData.eventoId}
                  onChange={(e) => handleSelectEvento(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#7A002A]"
                >
                  <option value="">-- Sin vincular (Independiente) --</option>
                  {eventos.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.titulo} (/{ev.slug}) • {new Date(ev.fechaEvento).toLocaleDateString("es-ES")}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Enlace, Título y Textos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Título / Festejada(s) *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Valeria Sofía o Melissa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#7A002A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Enlace Personalizado (Slug) *
                  </label>
                  <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:border-[#7A002A]">
                    <span className="px-3 py-2.5 text-[11px] text-stone-400 bg-stone-100 border-r border-stone-200 select-none">
                      /save-the-date/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      disabled={Boolean(editandoItem && editandoItem.slug === "demo")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                        })
                      }
                      placeholder="valeria-xv"
                      className="flex-1 px-3 py-2.5 text-xs text-stone-900 font-bold bg-transparent focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Subtítulo y Frase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Subtítulo (ej. dentro del sobre)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitulo || ""}
                    onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                    placeholder="Mis Quince Años o Save Our Date"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#7A002A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Frase o Mensaje de Cabecera
                  </label>
                  <input
                    type="text"
                    value={formData.mensaje || ""}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Guarda esta fecha especial en tu calendario..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#7A002A]"
                  />
                </div>
              </div>

              {/* 3. Fechas y Ubicación */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Fecha y Hora del Evento *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.fechaEvento}
                    onChange={(e) => setFormData({ ...formData, fechaEvento: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#7A002A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Texto Visible de Fecha
                  </label>
                  <input
                    type="text"
                    value={formData.fechaTextoPersonalizada || ""}
                    onChange={(e) => setFormData({ ...formData, fechaTextoPersonalizada: e.target.value })}
                    placeholder="Viernes 18 de Septiembre, 2026"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#7A002A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Ciudad / Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.ciudad || ""}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    placeholder="Los Ángeles, California"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#7A002A]"
                  />
                </div>
              </div>

              {/* 4. Música & Audio */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Música de Fondo
                    </span>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition">
                    <Upload className="w-3 h-3" />
                    <span>{subiendoArchivo === "musicaUrl" ? "Subiendo..." : "Subir MP3"}</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a"
                      onChange={(e) => handleSubirArchivo(e, "musicaUrl", true)}
                      disabled={subiendoArchivo === "musicaUrl"}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Título de la Canción:</label>
                    <input
                      type="text"
                      placeholder="Ej. A Thousand Years (Instrumental)"
                      value={formData.musicaTitulo || ""}
                      onChange={(e) => setFormData({ ...formData, musicaTitulo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">URL del Audio:</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://.../cancion.mp3"
                        value={formData.musicaUrl || ""}
                        onChange={(e) => setFormData({ ...formData, musicaUrl: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-mono"
                      />
                      {formData.musicaUrl && (
                        <button
                          type="button"
                          onClick={() => toggleProbarAudio(formData.musicaUrl || "")}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {reproduciendoAudio ? (
                            <Square className="w-3 h-3 fill-current text-red-600" />
                          ) : (
                            <Play className="w-3 h-3 fill-current text-emerald-600 ml-0.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Fotos: Portada y Galería Vertical */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Foto de Portada 9:16 (Festejada con Periódico) *
                  </label>
                  <div className="flex gap-3 items-center p-3 rounded-2xl border border-stone-200 bg-stone-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.fotoPortadaUrl || "/assets/save-the-date/principal.jpeg"}
                      alt="Portada"
                      className="w-14 h-20 rounded-xl object-cover border border-white shadow-xs shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.fotoPortadaUrl}
                      onChange={(e) => setFormData({ ...formData, fotoPortadaUrl: e.target.value })}
                      placeholder="URL de la foto de portada..."
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#7A002A] text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0">
                      <Upload className="w-3 h-3" />
                      <span>{subiendoArchivo === "fotoPortadaUrl" ? "Subiendo..." : "Subir Foto"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSubirArchivo(e, "fotoPortadaUrl", false)}
                        disabled={subiendoArchivo === "fotoPortadaUrl"}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Foto al Abrir el Sobre (se ve al abrirlo)
                  </label>
                  <div className="flex gap-3 items-center p-3 rounded-2xl border border-stone-200 bg-stone-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.fotoSobreAbiertoUrl || FOTO_SOBRE_ABIERTO_DEMO}
                      alt="Al abrir el sobre"
                      className="w-14 h-20 rounded-xl object-cover border border-white shadow-xs shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.fotoSobreAbiertoUrl || ""}
                      onChange={(e) => setFormData({ ...formData, fotoSobreAbiertoUrl: e.target.value })}
                      placeholder="URL de la foto al abrir el sobre..."
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#7A002A] text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0">
                      <Upload className="w-3 h-3" />
                      <span>{subiendoArchivo === "fotoSobreAbiertoUrl" ? "Subiendo..." : "Subir Foto"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSubirArchivo(e, "fotoSobreAbiertoUrl", false)}
                        disabled={subiendoArchivo === "fotoSobreAbiertoUrl"}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Galería de Fotos Verticales (Sección 2)
                  </label>
                  <p className="text-[11px] text-stone-500 mb-1.5">
                    Se ven 2 fotos a la vez; si hay más, el invitado las desliza de lado.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {formData.galeriaFotosUrls.map((urlFila, idx) => {
                      const url = urlFila || "";
                      return (
                        <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-700">Foto {idx + 1}</span>
                            <div className="flex items-center gap-1">
                              <label className="inline-flex items-center gap-1 px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[10px] font-semibold cursor-pointer">
                                <Upload className="w-2.5 h-2.5" />
                                <span>{subiendoArchivo === `galeria-${idx}` ? "Subiendo..." : "Subir"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleSubirArchivo(e, `galeria-${idx}`, false)}
                                  disabled={subiendoArchivo === `galeria-${idx}`}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const nuevas = formData.galeriaFotosUrls.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, galeriaFotosUrls: nuevas });
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-semibold"
                                title="Quitar esta foto"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                                <span>Quitar</span>
                              </button>
                            </div>
                          </div>
                          {url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={url}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-24 rounded-lg object-cover border border-white shadow-2xs"
                            />
                          )}
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              const nuevas = [...formData.galeriaFotosUrls];
                              nuevas[idx] = e.target.value;
                              setFormData({ ...formData, galeriaFotosUrls: nuevas });
                            }}
                            placeholder={`URL Foto ${idx + 1}...`}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded-lg text-[10px] font-mono"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, galeriaFotosUrls: [...formData.galeriaFotosUrls, ""] })
                    }
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar foto</span>
                  </button>
                </div>
              </div>

              {/* 6. Pre-RSVP y WhatsApp */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Pre-Confirmación (RSVP)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Pregunta / Título Pre-RSVP:
                    </label>
                    <input
                      type="text"
                      value={formData.textoPreRsvp || "¿Podrás Acompañarnos?"}
                      onChange={(e) => setFormData({ ...formData, textoPreRsvp: e.target.value })}
                      placeholder="¿Podrás Acompañarnos?"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Teléfono WhatsApp para Confirmaciones:
                    </label>
                    <input
                      type="tel"
                      value={formData.telefonoWhatsapp || ""}
                      onChange={(e) => setFormData({ ...formData, telefonoWhatsapp: e.target.value })}
                      placeholder="18181234567"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* TÍTULOS BILINGÜES DE SECCIONES (EN / ES) */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Títulos Principales de Secciones (Bilingüe EN / ES)
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Configura los títulos que aparecen al alternar entre inglés y español (por defecto inicia en inglés con el botón EN | ES en la esquina superior).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* 1. TÍTULO CALENDARIO */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-700 block">
                      1. Título Calendario:
                    </label>
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">Español (ES):</span>
                      <input
                        type="text"
                        value={formData.tituloCalendarioEs || ""}
                        onChange={(e) => setFormData({ ...formData, tituloCalendarioEs: e.target.value })}
                        placeholder="RESERVA LA FECHA"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 font-semibold uppercase">Inglés (EN - Default):</span>
                      <input
                        type="text"
                        value={formData.tituloCalendarioEn || ""}
                        onChange={(e) => setFormData({ ...formData, tituloCalendarioEn: e.target.value })}
                        placeholder="SAVE THE DATE"
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-medium text-amber-900"
                      />
                    </div>
                  </div>

                  {/* 2. TÍTULO CUENTA REGRESIVA */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-700 block">
                      2. Título Cuenta Regresiva:
                    </label>
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">Español (ES):</span>
                      <input
                        type="text"
                        value={formData.tituloContadorEs || ""}
                        onChange={(e) => setFormData({ ...formData, tituloContadorEs: e.target.value })}
                        placeholder="Solo Faltan..."
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 font-semibold uppercase">Inglés (EN - Default):</span>
                      <input
                        type="text"
                        value={formData.tituloContadorEn || ""}
                        onChange={(e) => setFormData({ ...formData, tituloContadorEn: e.target.value })}
                        placeholder="Countdown..."
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-medium text-amber-900"
                      />
                    </div>
                  </div>

                  {/* 3. TÍTULO PRE-RSVP */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-700 block">
                      3. Título Confirmación (Badge Pre-RSVP):
                    </label>
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">Español (ES):</span>
                      <input
                        type="text"
                        value={formData.tituloRsvpEs || ""}
                        onChange={(e) => setFormData({ ...formData, tituloRsvpEs: e.target.value })}
                        placeholder="Confirmación Anticipada"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 font-semibold uppercase">Inglés (EN - Default):</span>
                      <input
                        type="text"
                        value={formData.tituloRsvpEn || ""}
                        onChange={(e) => setFormData({ ...formData, tituloRsvpEn: e.target.value })}
                        placeholder="Early RSVP"
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-medium text-amber-900"
                      />
                    </div>
                  </div>

                  {/* 4. PREGUNTA PRE-RSVP Y SUBTÍTULO EN */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-700 block">
                      4. Pregunta RSVP & Subtítulo EN:
                    </label>
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">Pregunta (ES):</span>
                      <input
                        type="text"
                        value={formData.preguntaRsvpEs || ""}
                        onChange={(e) => setFormData({ ...formData, preguntaRsvpEs: e.target.value })}
                        placeholder="¿Podrás Acompañarnos?"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 font-semibold uppercase">Question (EN - Default):</span>
                      <input
                        type="text"
                        value={formData.preguntaRsvpEn || ""}
                        onChange={(e) => setFormData({ ...formData, preguntaRsvpEn: e.target.value })}
                        placeholder="Will You Join Us?"
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-medium text-amber-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 font-semibold uppercase">Subtítulo Sobre (EN):</span>
                      <input
                        type="text"
                        value={formData.subtituloEn || ""}
                        onChange={(e) => setFormData({ ...formData, subtituloEn: e.target.value })}
                        placeholder="My Sweet Fifteen"
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-medium text-amber-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Estilo y Sobre */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Plantilla Visual
                  </label>
                  <select
                    value={formData.estiloPlantilla}
                    onChange={(e) => setFormData({ ...formData, estiloPlantilla: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800"
                  >
                    <option value="QUINCE_ROSADO">Quince Rosado (Lujo y Rosa)</option>
                    <option value="COQUETTE_PINK">Coquette Pink (Negro & Blush)</option>
                    <option value="BLUE_BUTTERFLY">Blue Butterfly (Mariposas)</option>
                    <option value="ELEGANT_ROSE">Elegant Rose (Isabella)</option>
                    <option value="FAIRYTALE_CHATEAU">Fairytale Château (Boda)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Color del Sobre
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.colorSobre}
                      onChange={(e) => setFormData({ ...formData, colorSobre: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-stone-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.colorSobre}
                      onChange={(e) => setFormData({ ...formData, colorSobre: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Color del Sello
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.colorSello}
                      onChange={(e) => setFormData({ ...formData, colorSello: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-stone-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.colorSello}
                      onChange={(e) => setFormData({ ...formData, colorSello: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Módulos On/Off */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Interruptores de Secciones (On / Off)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: "mostrarSobre", label: "💌 Sobre Interactivo 3D" },
                    { key: "mostrarGaleria", label: "🖼️ Galería Vertical" },
                    { key: "mostrarContador", label: "⏳ Cuenta Regresiva" },
                    { key: "mostrarCalendario", label: "📅 Calendario Interactivo" },
                    { key: "mostrarPreRsvp", label: "✅ Pre-Confirmación" },
                  ].map((sw) => (
                    <label key={sw.key} className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                      <input
                        type="checkbox"
                        checked={Boolean((formData as any)[sw.key])}
                        onChange={(e) => setFormData({ ...formData, [sw.key]: e.target.checked })}
                        className="rounded text-[#7A002A] focus:ring-[#7A002A]"
                      />
                      <span>{sw.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200 transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={guardando || !formData.slug || !formData.titulo}
                onClick={handleGuardar}
                className="px-6 py-2.5 rounded-xl bg-[#7A002A] hover:bg-[#5e0020] text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {guardando ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{editandoItem ? "Guardar Cambios" : "Publicar Save the Date"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
