"use client";

import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Eye,
  Sparkles,
  Globe,
} from "lucide-react";
import type { InvitationData } from "@/components/invitation/InvitationMobileView";

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

interface OpenGraphPreviewProps {
  formData: InvitationData;
}

type PreviewPlatform = "whatsapp" | "facebook" | "imessage";

export default function OpenGraphPreview({ formData }: OpenGraphPreviewProps) {
  const [platform, setPlatform] = useState<PreviewPlatform>("whatsapp");
  const [copied, setCopied] = useState(false);

  const isEn = formData.idiomaDefault === "en";

  // Determinar texto del tipo de evento
  let tipoTexto = isEn ? "My Quinceañera" : "Mis Quince Años";
  if ((formData.tipoEvento as string) === "BODA") {
    tipoTexto = isEn ? "Our Wedding" : "Nuestra Boda";
  } else if ((formData.tipoEvento as string) === "CUMPLEANOS") {
    tipoTexto = isEn ? "Birthday Celebration" : "Mi Cumpleaños";
  } else if ((formData.tipoEvento as string) === "BAUTIZO") {
    tipoTexto = isEn ? "Christening & Baptism" : "Mi Bautizo";
  } else if ((formData.tipoEvento as string) === "OTRO") {
    tipoTexto = isEn ? "Exclusive Gala" : "Celebración Especial";
  }

  const titulo = formData.titulo?.trim() || (isEn ? "Celebrant" : "Nombre de la Festejada");
  const displayTitle = `${titulo} • ${tipoTexto}`;

  const displayDescription =
    formData.subtitulo?.trim() ||
    formData.frasePersonalizada?.trim() ||
    (isEn
      ? "✨ You are cordially invited to celebrate with us! Tap to view details, photos, maps, and RSVP."
      : "✨ ¡Estás cordialmente invitado a celebrar con nosotros! Toca para abrir la invitación, mapas y confirmar tu asistencia.");

  const slug = formData.slug?.trim() || "mi-evento";
  const displayDomain = "clickandlove.app";
  const fullUrl = `https://${displayDomain}/${slug}`;

  // Imagen para la tarjeta OG
  const imageUrl =
    formData.fotoPortadaUrl ||
    formData.fotoActualUrl ||
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `💌 ¡Estás cordialmente invitado a celebrar con nosotros! ${fullUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
      {/* Cabecera de la sección */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#7A002A]" />
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Previsualizador de Enlace en Redes Sociales (OpenGraph)
          </h3>
        </div>

        {/* Selector de plataforma */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setPlatform("whatsapp")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              platform === "whatsapp"
                ? "bg-[#25D366] text-white shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatform("facebook")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              platform === "facebook"
                ? "bg-[#1877F2] text-white shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <FacebookIcon className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatform("imessage")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              platform === "imessage"
                ? "bg-stone-900 text-white shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iMessage</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-stone-500">
        Así es como tus invitados verán la tarjeta con imagen, título y enlace al compartir la invitación por WhatsApp, Facebook o mensajes directos:
      </p>

      {/* ──────────────────────────────────────────────────────────
          CONTENEDOR DE LA VISTA PREVIA
      ────────────────────────────────────────────────────────── */}
      <div className="flex justify-center py-2">
        {/* PLATAFORMA 1: WHATSAPP */}
        {platform === "whatsapp" && (
          <div className="w-full max-w-sm bg-[#EFEAE2] p-4 rounded-2xl shadow-inner border border-stone-200/80">
            {/* Burbuja de mensaje enviado */}
            <div className="ml-auto max-w-[310px] bg-[#E7FFDB] rounded-2xl rounded-tr-xs p-2 shadow-xs border border-[#C6E7B6] space-y-1.5">
              {/* Tarjeta de enlace OpenGraph */}
              <div className="rounded-xl overflow-hidden bg-white/95 border border-black/5 shadow-2xs">
                {/* Imagen 16:9 / Banner */}
                <div className="relative aspect-[16/9] w-full bg-stone-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white tracking-wide">
                    👑 {tipoTexto}
                  </div>
                </div>

                {/* Contenido textual */}
                <div className="p-2.5 space-y-1">
                  <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                    {displayDomain}
                  </p>
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1 leading-tight">
                    {displayTitle}
                  </h4>
                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                    {displayDescription}
                  </p>
                </div>
              </div>

              {/* Mensaje de texto acompañante */}
              <div className="px-1 pt-0.5 flex items-end justify-between gap-2 text-stone-800 text-xs">
                <span className="text-[#006699] underline text-[11px] font-medium break-all truncate">
                  {fullUrl}
                </span>
                <span className="text-[10px] text-stone-400 font-sans shrink-0 flex items-center gap-0.5">
                  10:42 PM
                  <span className="text-[#53BDEB] font-bold">✓✓</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PLATAFORMA 2: FACEBOOK */}
        {platform === "facebook" && (
          <div className="w-full max-w-md bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            {/* Header simulado de post de Facebook */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#7A002A] to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                {titulo.charAt(0) || "C"}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">
                  Invitación Oficial • {titulo}
                </p>
                <p className="text-[11px] text-stone-400">Hace un momento · 🌐</p>
              </div>
            </div>

            {/* Tarjeta de enlace Facebook */}
            <div className="rounded-xl overflow-hidden border border-stone-200/90 shadow-2xs bg-[#F0F2F5]">
              <div className="relative aspect-[1.91/1] w-full bg-stone-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 bg-white space-y-1">
                <p className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                  {displayDomain.toUpperCase()}
                </p>
                <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                  {displayTitle}
                </h4>
                <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                  {displayDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PLATAFORMA 3: iMESSAGE (APPLE) */}
        {platform === "imessage" && (
          <div className="w-full max-w-sm bg-stone-100/80 p-4 rounded-2xl shadow-inner border border-stone-200">
            <div className="ml-auto max-w-[280px] bg-[#007AFF] text-white rounded-2xl rounded-br-xs p-2.5 shadow-sm space-y-2">
              <div className="rounded-xl overflow-hidden bg-white text-stone-900 shadow-2xs">
                <div className="relative aspect-[16/9] w-full bg-stone-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5 space-y-0.5">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    {displayDomain}
                  </p>
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                    {displayTitle}
                  </h4>
                  <p className="text-[10px] text-stone-500 line-clamp-2">
                    {displayDescription}
                  </p>
                </div>
              </div>
              <p className="text-[11px] font-medium text-white/95 px-1 truncate">
                {fullUrl}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────
          BARRA DE ACCIONES RÁPIDAS
      ────────────────────────────────────────────────────────── */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-700">
            Enlace para compartir:
          </span>
          <code className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-mono font-bold border border-stone-200">
            {fullUrl}
          </code>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Enlace</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5C] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>Probar en WhatsApp</span>
          </button>

          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <span>Ver Invitación</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
