"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Share2,
  ExternalLink,
  Users,
  Eye,
  Calendar,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Edit3,
  LogOut,
  ShoppingBag,
  DollarSign,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { OrderData } from "@/lib/order-store";

interface EventoItem {
  id: string;
  slug: string;
  titulo: string;
  tipoEvento: "QUINCEANERA" | "BODA" | "CUMPLEANOS";
  fechaEvento: string;
  fotoPortadaUrl: string;
  activo: boolean;
  telefonoWhatsappRsvp: string;
  panelToken?: string | null;
  _count?: {
    rsvps: number;
  };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"eventos" | "ordenes">("ordenes");
  const [eventos, setEventos] = useState<EventoItem[]>([]);
  const [ordenes, setOrdenes] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [busquedaOrdenes, setBusquedaOrdenes] = useState<string>("");
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);

  const getPublicEventUrl = (path: string) => {
    if (typeof window !== "undefined" && window.location.host.startsWith("admin.")) {
      const publicHost = window.location.host.replace(/^admin\./, "");
      return `${window.location.protocol}//${publicHost}/${path.replace(/^\//, "")}`;
    }
    return `/${path.replace(/^\//, "")}`;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  };

  const cargarOrdenes = () => {
    setLoadingOrdenes(true);
    fetch("/api/admin/ordenes")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrdenes(data.orders);
        }
      })
      .catch((err) => console.error("Error cargando órdenes:", err))
      .finally(() => setLoadingOrdenes(false));
  };

  useEffect(() => {
    // Cargar eventos
    fetch("/api/eventos")
      .then((res) => res.json())
      .then((data) => {
        if (data.eventos && data.eventos.length > 0) {
          setEventos(data.eventos);
        } else {
          // Demos de respaldo
          setEventos([
            {
              id: "demo-1",
              slug: "elsy-xv",
              titulo: "Mis XV Años - Elsy (Clásica)",
              tipoEvento: "QUINCEANERA",
              fechaEvento: "2026-12-05T17:00:00Z",
              fotoPortadaUrl:
                "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
              activo: true,
              telefonoWhatsappRsvp: "18181234567",
              _count: { rsvps: 24 },
            },
            {
              id: "demo-t1",
              slug: "isabella-xv",
              titulo: "Isabella XV (Elegant Rose - Canva T1)",
              tipoEvento: "QUINCEANERA",
              fechaEvento: "2026-11-20T17:00:00Z",
              fotoPortadaUrl:
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
              activo: true,
              telefonoWhatsappRsvp: "18181234567",
              _count: { rsvps: 38 },
            },
            {
              id: "demo-t2",
              slug: "emma-and-lucas",
              titulo: "Emma & Lucas (Fairytale Château - Canva T2)",
              tipoEvento: "BODA",
              fechaEvento: "2026-09-18T16:30:00Z",
              fotoPortadaUrl:
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
              activo: true,
              telefonoWhatsappRsvp: "18181234567",
              _count: { rsvps: 92 },
            },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Cargar órdenes
    cargarOrdenes();
  }, []);

  const handleCopyLink = (slug: string) => {
    let origin = window.location.origin;
    if (window.location.host.startsWith("admin.")) {
      const publicHost = window.location.host.replace(/^admin\./, "");
      origin = `${window.location.protocol}//${publicHost}`;
    }
    const url = `${origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleUpdateStatus = async (orderId: string, nuevoEstado: string) => {
    setActualizandoId(orderId);
    try {
      const res = await fetch(`/api/admin/ordenes/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estadoPedido: nuevoEstado }),
      });
      const data = await res.json();
      if (data.success) {
        setOrdenes((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, estadoPedido: nuevoEstado as any } : o))
        );
      }
    } catch (err) {
      console.error("Error actualizando estado:", err);
    } finally {
      setActualizandoId(null);
    }
  };

  const totalRsvps = eventos.reduce((acc, curr) => acc + (curr._count?.rsvps || 0), 0);
  const totalIngresos = ordenes
    .filter((o) => o.estadoPago === "PAGADO")
    .reduce((acc, curr) => acc + curr.montoTotal, 0);
  const ordenesNuevas = ordenes.filter((o) => o.estadoPedido === "NUEVO" || !o.estadoPedido).length;
  const ordenesEnDiseno = ordenes.filter((o) => o.estadoPedido === "EN_DISENO").length;

  const ordenesFiltradas = ordenes.filter((o) => {
    if (filtroEstado !== "TODOS" && o.estadoPedido !== filtroEstado) return false;
    if (busquedaOrdenes) {
      const q = busquedaOrdenes.toLowerCase();
      const matchName = (o.nombreCliente || "").toLowerCase().includes(q);
      const matchEmail = (o.emailCliente || "").toLowerCase().includes(q);
      const matchPhone = (o.telefonoCliente || "").toLowerCase().includes(q);
      const matchPkg = (o.paqueteNombre || "").toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchPkg;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Barra superior de navegación */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎀</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-stone-900 font-serif">
                Click and love
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-pink-100 text-[#7A002A] px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden sm:block">Panel de Ventas & Eventos</p>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("ordenes")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
              activeTab === "ordenes"
                ? "bg-white text-[#7A002A] shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Compradores & Ventas</span>
            {ordenes.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#7A002A] text-white text-[10px]">
                {ordenes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("eventos")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
              activeTab === "eventos"
                ? "bg-white text-stone-900 shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Invitaciones ({eventos.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/eventos/nuevo"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-xl text-xs font-semibold shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Invitación</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ============================================================== */}
        {/* VISTA 1: COMPRADORES & VENTAS (STRIPE CHECKOUT) */}
        {/* ============================================================== */}
        {activeTab === "ordenes" && (
          <div className="space-y-6">
            {/* Métricas de Ventas */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-stone-900">Órdenes & Compradores</h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Gestiona compras de Stripe, datos de onboarding y abre WhatsApp con tus clientes en 1 clic.
                  </p>
                </div>
                <button
                  onClick={cargarOrdenes}
                  disabled={loadingOrdenes}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOrdenes ? "animate-spin" : ""}`} />
                  Actualizar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Ingresos Totales
                    </p>
                    <p className="text-2xl font-bold text-[#C5A059] mt-1">
                      ${totalIngresos.toFixed(2)} <span className="text-xs text-stone-400">USD</span>
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Órdenes Pagadas
                    </p>
                    <p className="text-2xl font-bold text-stone-900 mt-1">
                      {ordenes.filter((o) => o.estadoPago === "PAGADO").length}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Nuevos por Contactar
                    </p>
                    <p className="text-2xl font-bold text-[#7A002A] mt-1">{ordenesNuevas}</p>
                  </div>
                  <div className="p-3 bg-pink-50 text-[#7A002A] rounded-xl">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      En Proceso de Diseño
                    </p>
                    <p className="text-2xl font-bold text-stone-900 mt-1">{ordenesEnDiseno}</p>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, email o teléfono..."
                  value={busquedaOrdenes}
                  onChange={(e) => setBusquedaOrdenes(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-none text-stone-800"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-stone-400 text-[11px] mr-1">Estado:</span>
                {[
                  { id: "TODOS", label: "Todos" },
                  { id: "NUEVO", label: "Nuevos" },
                  { id: "RECOPILANDO_DATOS", label: "Datos Recibidos" },
                  { id: "EN_DISENO", label: "En Diseño" },
                  { id: "PUBLICADO", label: "Entregados" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFiltroEstado(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      filtroEstado === f.id
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listado de Compradores */}
            {ordenesFiltradas.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800">No hay órdenes para mostrar</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Cuando un cliente realice una compra en la Home a través de Stripe, aparecerá aquí inmediatamente con sus datos de contacto.
                </p>
                <div className="mt-5">
                  <button
                    onClick={async () => {
                      const res = await fetch("/api/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ plan: "signature" }),
                      });
                      const data = await res.json();
                      if (data.url) window.open(data.url, "_blank");
                      setTimeout(cargarOrdenes, 1500);
                    }}
                    className="px-4 py-2 bg-[#C5A059] text-white rounded-xl text-xs font-semibold hover:brightness-105 transition shadow-xs"
                  >
                    Simular una Compra Demo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {ordenesFiltradas.map((order) => {
                  const rawPhone = (order.telefonoCliente || "").replace(/\D/g, "");
                  const whatsappMessage = encodeURIComponent(
                    `Hola ${order.nombreCliente || ""}! Te saluda el equipo de Click and love. Muchas gracias por tu compra del paquete ${order.paqueteNombre}. Estoy a tu disposición para comenzar el diseño de tu invitación.`
                  );
                  const whatsappUrl = rawPhone ? `https://wa.me/${rawPhone}?text=${whatsappMessage}` : null;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                    >
                      {/* Columna 1: Cliente e Información */}
                      <div className="space-y-2 min-w-[260px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">
                            {order.nombreCliente || "Cliente Pendiente de Nombre"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                            {order.paqueteNombre} (${order.montoTotal} USD)
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-stone-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            <a href={`mailto:${order.emailCliente}`} className="hover:underline text-stone-700">
                              {order.emailCliente || "Sin correo"}
                            </a>
                          </div>
                          {order.telefonoCliente && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <span>{order.telefonoCliente}</span>
                            </div>
                          )}
                          <div className="text-[11px] text-stone-400">
                            Orden: #{order.id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString("es-ES")}
                          </div>
                        </div>
                      </div>

                      {/* Columna 2: Detalles del Evento Elegido */}
                      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 flex-1 min-w-[240px] text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-stone-400">Detalles de Onboarding</span>
                          {order.onboardingCompletado ? (
                            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Datos completos
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pendiente de formulario
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-stone-700">
                          <div>
                            <span className="text-stone-400 block text-[10px]">Tipo & Fecha:</span>
                            <span className="font-semibold">
                              {order.tipoEvento || "XV Años"} • {order.fechaEvento ? new Date(order.fechaEvento).toLocaleDateString("es-ES") : "Por definir"}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">Plantilla Deseada:</span>
                            <span className="font-semibold text-[#7A002A]">
                              {order.plantillaDeseada || "A coordinar"}
                            </span>
                          </div>
                        </div>

                        {order.comentarios && (
                          <div className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200/60 line-clamp-2">
                            "{order.comentarios}"
                          </div>
                        )}
                      </div>

                      {/* Columna 3: Estado y Acciones Rápidas */}
                      <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-2.5">
                        {/* Selector de Estado */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-stone-400 mb-1">
                            Estado del Pedido
                          </label>
                          <select
                            value={order.estadoPedido || "NUEVO"}
                            disabled={actualizandoId === order.id}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="text-xs font-semibold py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:border-[#7A002A]"
                          >
                            <option value="NUEVO">🟡 Nuevo</option>
                            <option value="CONTACTADO">🔵 Contactado</option>
                            <option value="RECOPILANDO_DATOS">🟣 Recopilando Fotos</option>
                            <option value="EN_DISENO">🟠 En Diseño</option>
                            <option value="PUBLICADO">🟢 Entregado / Listo</option>
                            <option value="CANCELADO">⚪ Cancelado</option>
                          </select>
                        </div>

                        {/* Botón WhatsApp */}
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-semibold transition shadow-xs"
                            title="Abrir chat de WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        )}

                        {/* Botón Crear Invitación */}
                        <Link
                          href={`/eventos/nuevo?nombre=${encodeURIComponent(
                            order.nombreCliente || ""
                          )}&tipo=${encodeURIComponent(order.tipoEvento || "QUINCEANERA")}&plantilla=${encodeURIComponent(
                            order.plantillaDeseada || "QUINCE_ROSADO"
                          )}&telefono=${encodeURIComponent(order.telefonoCliente || "")}`}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Crear Invitación
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VISTA 2: INVITACIONES & EVENTOS EXISTENTES */}
        {/* ============================================================== */}
        {activeTab === "eventos" && (
          <div>
            {/* Banner de Bienvenida y Métricas */}
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Invitaciones Creadas</h1>
              <p className="text-xs text-stone-500 mt-1">
                Gestiona tus invitaciones interactivas publicadas, revisa confirmaciones y obtén enlaces directos.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Invitaciones Activas
                    </p>
                    <p className="text-2xl font-bold text-stone-900 mt-1">{eventos.length}</p>
                  </div>
                  <div className="p-3 bg-pink-50 text-[#7A002A] rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Confirmaciones RSVP
                    </p>
                    <p className="text-2xl font-bold text-stone-900 mt-1">{totalRsvps} pases</p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Almacenamiento Conectado
                    </p>
                    <p className="text-2xl font-bold text-stone-900 mt-1">AWS S3</p>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Share2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Listado de Invitaciones */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-stone-900">Tus Invitaciones Activas</h2>
                <Link
                  href="/eventos/nuevo"
                  className="text-xs font-semibold text-[#7A002A] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Crear otra invitación
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventos.map((ev) => {
                  const formattedDate = new Date(ev.fechaEvento).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={ev.id}
                      className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition"
                    >
                      {/* Foto de Portada con badge de tipo */}
                      <div className="relative h-48 bg-stone-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ev.fotoPortadaUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"}
                          alt={ev.titulo}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80";
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm">
                            {ev.tipoEvento === "QUINCEANERA"
                              ? "XV Años"
                              : ev.tipoEvento === "BODA"
                              ? "Boda"
                              : "Cumpleaños"}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <Link
                            href={`/eventos/nuevo?editar=${encodeURIComponent(ev.slug)}`}
                            className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-sm transition hover:scale-105"
                            title="Editar invitación"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-stone-800" />
                          </Link>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow">
                            Activa
                          </span>
                        </div>
                      </div>

                      {/* Cuerpo de la Tarjeta */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-stone-900">{ev.titulo}</h3>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                          </div>

                          <div className="mt-3 p-2 bg-stone-50 rounded-xl text-xs font-mono text-stone-600 truncate border border-stone-100 flex items-center justify-between">
                            <span className="truncate">/{ev.slug}</span>
                            <button
                              onClick={() => handleCopyLink(ev.slug)}
                              title="Copiar enlace"
                              className="p-1 hover:bg-stone-200 rounded-lg transition text-stone-700 ml-1"
                            >
                              {copiedSlug === ev.slug ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Acciones de la tarjeta */}
                        <div className="space-y-2 mt-4 pt-4 border-t border-stone-100">
                          <Link
                            href={`/eventos/nuevo?editar=${encodeURIComponent(ev.slug)}`}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Editar Invitación
                          </Link>

                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={getPublicEventUrl(ev.slug)}
                              target="_blank"
                              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Invitados
                            </Link>

                            <button
                              onClick={() => handleCopyLink(ev.slug)}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#7A002A] hover:bg-[#5e0020] text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                            >
                              {copiedSlug === ev.slug ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  ¡Copiado!
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3.5 h-3.5" />
                                  WhatsApp
                                </>
                              )}
                            </button>
                          </div>

                          <Link
                            href={getPublicEventUrl(`${ev.slug}/panel?key=${ev.panelToken || "demo"}`)}
                            target="_blank"
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold transition"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            Magic Link (Panel de la Mamá)
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
