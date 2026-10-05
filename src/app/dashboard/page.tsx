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
} from "lucide-react";

interface EventoItem {
  id: string;
  slug: string;
  titulo: string;
  tipoEvento: "QUINCEANERA" | "BODA" | "CUMPLEANOS";
  fechaEvento: string;
  fotoPortadaUrl: string;
  activo: boolean;
  telefonoWhatsappRsvp: string;
  _count?: {
    rsvps: number;
  };
}

export default function DashboardPage() {
  const [eventos, setEventos] = useState<EventoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/eventos")
      .then((res) => res.json())
      .then((data) => {
        if (data.eventos && data.eventos.length > 0) {
          setEventos(data.eventos);
        } else {
          // Si la base de datos aún no tiene eventos, mostramos los demos predeterminados
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
            {
              id: "demo-t3",
              slug: "mariposas-xv",
              titulo: "Jardín de Mariposas (Blue Butterfly - Canva T3)",
              tipoEvento: "QUINCEANERA",
              fechaEvento: "2026-10-15T18:00:00Z",
              fotoPortadaUrl:
                "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80",
              activo: true,
              telefonoWhatsappRsvp: "18181234567",
              _count: { rsvps: 45 },
            },
            {
              id: "demo-t4",
              slug: "coraline-party",
              titulo: "Coraline Other World (Mundo Secreto - Canva T4)",
              tipoEvento: "QUINCEANERA",
              fechaEvento: "2026-10-31T19:00:00Z",
              fotoPortadaUrl:
                "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
              activo: true,
              telefonoWhatsappRsvp: "18181234567",
              _count: { rsvps: 18 },
            },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const totalRsvps = eventos.reduce((acc, curr) => acc + (curr._count?.rsvps || 0), 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Barra superior de navegación */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="text-base font-bold tracking-tight text-stone-900 font-serif">
            LuminaVite SaaS
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-pink-100 text-[#5A3E44] px-2 py-0.5 rounded-full ml-2">
            Panel de Salones & Anfitriones
          </span>
        </div>

        <Link
          href="/eventos/nuevo"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5A3E44] hover:bg-[#432d32] text-white rounded-xl text-xs font-semibold shadow transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Invitación
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Banner de Bienvenida y Métricas */}
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Panel de Control</h1>
          <p className="text-xs text-stone-500 mt-1">
            Gestiona tus invitaciones interactivas, revisa confirmaciones y obtén enlaces directos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Invitaciones Creadas
                </p>
                <p className="text-2xl font-bold text-stone-900 mt-1">{eventos.length}</p>
              </div>
              <div className="p-3 bg-pink-50 text-[#5A3E44] rounded-xl">
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900">Tus Invitaciones Activas</h2>
            <Link
              href="/eventos/nuevo"
              className="text-xs font-semibold text-[#5A3E44] hover:underline flex items-center gap-1"
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
                      src={ev.fotoPortadaUrl}
                      alt={ev.titulo}
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

                    <div className="absolute top-3 right-3">
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
                    <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100">
                      <Link
                        href={`/${ev.slug}`}
                        target="_blank"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ver Pública
                      </Link>

                      <button
                        onClick={() => handleCopyLink(ev.slug)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#5A3E44] hover:bg-[#432d32] text-white rounded-xl text-xs font-semibold shadow-sm transition"
                      >
                        {copiedSlug === ev.slug ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            ¡Copiado!
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            Compartir
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
