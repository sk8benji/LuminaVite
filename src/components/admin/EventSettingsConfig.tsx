"use client";

import React from "react";
import {
  Globe,
  Link as LinkIcon,
  Palette,
  Calendar,
  Users,
  Bell,
  Mail,
  Phone,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type { InvitationData } from "@/components/invitation/InvitationMobileView";
import { TemplateId } from "@/lib/templates";
import { TEMPLATE_CATALOG } from "@/components/admin/TemplatePickerModal";
import OpenGraphPreview from "./OpenGraphPreview";

interface EventSettingsConfigProps {
  formData: InvitationData;
  updateField: (field: keyof InvitationData, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<InvitationData>>;
  computeRsvpPhrases: (
    dateStr: string,
    daysBefore: number
  ) => {
    fechaLimiteRsvp: string;
    fraseEs: string;
    fraseEn: string;
    fechaDestacadaEs: string;
  };
  handleRsvpDiasChange: (dias: number) => void;
  isEditMode: boolean;
  handleSave: () => void;
  isSaving: boolean;
  onSelectTemplate?: (tempKey: TemplateId) => void;
  onOpenTemplatePicker?: () => void;
}

export default function EventSettingsConfig({
  formData,
  updateField,
  computeRsvpPhrases,
  handleRsvpDiasChange,
  isEditMode,
  handleSave,
  isSaving,
  onSelectTemplate,
  onOpenTemplatePicker,
}: EventSettingsConfigProps) {
  const dateStr =
    typeof formData.fechaEvento === "string"
      ? formData.fechaEvento
      : new Date(formData.fechaEvento || Date.now()).toISOString();

  const rsvpCalc = computeRsvpPhrases(
    dateStr,
    Number(formData.rsvpDiasAntes) || 15
  );

  return (
    <div className="space-y-6">
      {/* Cabecera explicativa */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <span>⚙️ Ajustes y Configuración del Evento</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Configura los datos del sistema, enlace personalizado, idioma y las reglas del registro RSVP y notificaciones del anfitrión.
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TARJETA 1: IDENTIFICACIÓN, ENLACE E IDIOMA
      ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
        <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#7A002A]" />
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            1. Enlace, Tipo de Evento e Idioma
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tipo de Evento */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Tipo de Evento
            </label>
            <select
              value={formData.tipoEvento}
              onChange={(e) => updateField("tipoEvento", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-[#7A002A]"
            >
              <option value="QUINCEANERA">Mis XV Años / Quinceañera</option>
              <option value="BODA">Boda / Matrimonio</option>
              <option value="CUMPLEANOS">Cumpleaños / Sweet 16</option>
              <option value="BAUTIZO">Bautizo / Primera Comunión</option>
              <option value="OTRO">Gala / Evento Privado</option>
            </select>
          </div>

          {/* Enlace Personalizado / Slug */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Enlace Personalizado (Slug de la Invitación)
            </label>
            <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50/50 overflow-hidden focus-within:border-[#7A002A] focus-within:ring-1 focus-within:ring-[#7A002A]">
              <span className="px-3 py-2.5 text-xs text-stone-400 bg-stone-100/60 border-r border-stone-200 select-none">
                clickandlove.app/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  updateField(
                    "slug",
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-")
                  )
                }
                placeholder="maydelin-mendez"
                className="flex-1 px-3 py-2.5 text-xs text-stone-900 font-semibold bg-transparent focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Solo letras minúsculas, números y guiones.
            </p>
          </div>
        </div>

        {/* Idioma de la Invitación */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Idioma Predeterminado de la Invitación
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => updateField("idiomaDefault", "es")}
              className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                formData.idiomaDefault === "es"
                  ? "border-[#7A002A] bg-pink-50/50 text-[#7A002A] ring-1 ring-[#7A002A]"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              <span className="text-base">🇲🇽</span>
              <span className="text-xs font-bold">Solo Español</span>
              <span className="text-[10px] text-stone-400">Textos fijos en español</span>
            </button>

            <button
              type="button"
              onClick={() => updateField("idiomaDefault", "en")}
              className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                formData.idiomaDefault === "en"
                  ? "border-[#7A002A] bg-pink-50/50 text-[#7A002A] ring-1 ring-[#7A002A]"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              <span className="text-base">🇺🇸</span>
              <span className="text-xs font-bold">Only English</span>
              <span className="text-[10px] text-stone-400">Fixed texts in English</span>
            </button>

            <button
              type="button"
              onClick={() => updateField("idiomaDefault", "bilingual")}
              className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                formData.idiomaDefault === "bilingual" || !formData.idiomaDefault
                  ? "border-[#7A002A] bg-pink-50/50 text-[#7A002A] ring-1 ring-[#7A002A]"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              <span className="text-base">🌐</span>
              <span className="text-xs font-bold">Bilingüe (Recomendado)</span>
              <span className="text-[10px] text-stone-400">
                Selector ES / EN interactivo
              </span>
            </button>
          </div>
        </div>

        {/* Estilo Visual y Paleta de Colores */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Plantilla y Estilo Visual
            </label>
            {onOpenTemplatePicker && (
              <button
                type="button"
                onClick={onOpenTemplatePicker}
                className="text-xs font-bold text-[#7A002A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Explorar Galería Completa ({TEMPLATE_CATALOG.length})</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATE_CATALOG.slice(0, 6).map((p) => {
              const active =
                formData.estiloPlantilla === p.id ||
                (!formData.estiloPlantilla && p.id === "QUINCE_ROSADO");
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (onSelectTemplate) {
                      onSelectTemplate(p.id);
                    } else {
                      updateField("estiloPlantilla", p.id);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                    active
                      ? "border-[#7A002A] bg-pink-50/50 ring-1 ring-[#7A002A] shadow-xs"
                      : "border-stone-200 bg-white hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&q=80";
                      }}
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-800 leading-tight">{p.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {p.dots.map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <span className="text-[10px] text-stone-400 font-medium ml-1">
                          {p.badgeLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  {active && <CheckCircle className="w-4 h-4 text-[#7A002A] shrink-0" />}
                </button>
              );
            })}
          </div>

          {onOpenTemplatePicker && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={onOpenTemplatePicker}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#7A002A]/40 bg-pink-50/30 hover:bg-pink-50 text-[#7A002A] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Palette className="w-4 h-4 text-[#C5A059]" />
                <span>Ver y Elegir entre las {TEMPLATE_CATALOG.length} Plantillas Disponibles</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TARJETA 2: PREVISUALIZADOR DE OPENGRAPH (WHATSAPP & FACEBOOK)
      ────────────────────────────────────────────────────────── */}
      <OpenGraphPreview formData={formData} />

      {/* ──────────────────────────────────────────────────────────
          TARJETA 3: CONFIRMACIÓN DE ASISTENCIA (RSVP) Y NOTIFICACIONES
      ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
        <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#7A002A]" />
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            3. Confirmaciones RSVP y Contacto de la Anfitriona
          </h3>
        </div>

        {/* Modalidad RSVP */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Modalidad del Registro RSVP
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => updateField("modalidadRsvp", "HIBRIDO")}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                formData.modalidadRsvp === "HIBRIDO" || !formData.modalidadRsvp
                  ? "border-[#7A002A] bg-pink-50/50 ring-1 ring-[#7A002A]"
                  : "border-stone-200 bg-white hover:bg-stone-50"
              }`}
            >
              <p className="text-xs font-bold text-[#7A002A]">Híbrido (Recomendado)</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Busca en la lista precargada. Si el invitado no aparece, le permite registrarse libremente hasta llenar el aforo.
              </p>
            </button>

            <button
              type="button"
              onClick={() => updateField("modalidadRsvp", "ESTRICTO")}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                formData.modalidadRsvp === "ESTRICTO"
                  ? "border-[#7A002A] bg-pink-50/50 ring-1 ring-[#7A002A]"
                  : "border-stone-200 bg-white hover:bg-stone-50"
              }`}
            >
              <p className="text-xs font-bold text-[#7A002A]">Estricto</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Solo pueden confirmar las personas añadidas previamente en la lista de pases.
              </p>
            </button>

            <button
              type="button"
              onClick={() => updateField("modalidadRsvp", "ABIERTO")}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                formData.modalidadRsvp === "ABIERTO"
                  ? "border-[#7A002A] bg-pink-50/50 ring-1 ring-[#7A002A]"
                  : "border-stone-200 bg-white hover:bg-stone-50"
              }`}
            >
              <p className="text-xs font-bold text-[#7A002A]">Abierto</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Oculta el buscador de nombres. Muestra directamente el formulario simple para ingresar nombre y teléfono.
              </p>
            </button>
          </div>
        </div>

        {/* Contacto y Notificaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Teléfono Móvil / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Teléfono Móvil (SMS / WhatsApp)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.telefonoWhatsappRsvp || ""}
                onChange={(e) => updateField("telefonoWhatsappRsvp", e.target.value)}
                placeholder="18182973697"
                className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-none focus:border-[#7A002A]"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Número con código de país para alertas (+1 USA o internacional).
            </p>
          </div>

          {/* Correo para Notificaciones */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Correo para Notificaciones en Vivo
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.emailOrganizador || ""}
                onChange={(e) => updateField("emailOrganizador", e.target.value)}
                placeholder="mama.valeria@example.com"
                className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-none focus:border-[#7A002A]"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Recibe un correo breve al instante con el balance y acceso por cada confirmación.
            </p>
          </div>
        </div>

        {/* Aforo y Límites */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Aforo Total Estimado */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Aforo Total Estimado (Meta del Salón)
            </label>
            <input
              type="number"
              min={10}
              max={2000}
              value={formData.aforoTotal || 250}
              onChange={(e) => updateField("aforoTotal", Number(e.target.value))}
              placeholder="250"
              className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-none focus:border-[#7A002A]"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Se muestra en la barra de progreso del correo: ej. "Llevas 142 de 250 pases".
            </p>
          </div>

          {/* Máximo de Pases por Invitado */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Máximo de Pases por Invitado
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={formData.maxPasesPorInvitado || 4}
              onChange={(e) => updateField("maxPasesPorInvitado", Number(e.target.value))}
              placeholder="4"
              className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-none focus:border-[#7A002A]"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Límite sugerido por reserva individual.
            </p>
          </div>
        </div>

        {/* Anticipación Límite para Confirmar (RSVP) */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                Anticipación Límite para Confirmar (RSVP)
              </label>
              <p className="text-[11px] text-stone-500">
                Define cuántos días antes de la fiesta se cierra la recepción de confirmaciones.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-100 text-[#7A002A]">
              {formData.rsvpDiasAntes || 15} días antes
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={90}
              value={formData.rsvpDiasAntes || 15}
              onChange={(e) => handleRsvpDiasChange(parseInt(e.target.value) || 1)}
              className="w-24 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 text-center"
            />
            {/* Presets rápidos */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-stone-400 font-medium">Rápido:</span>
              {[7, 10, 15, 20, 30].map((dias) => (
                <button
                  key={dias}
                  type="button"
                  onClick={() => handleRsvpDiasChange(dias)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    (formData.rsvpDiasAntes || 15) === dias
                      ? "bg-[#7A002A] text-white shadow-xs"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {dias}d
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta de Fecha Calculada */}
          <div className="bg-white border border-pink-100 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Fecha Límite Calculada en la Invitación:
            </p>
            <p className="text-xs font-bold text-[#7A002A]">
              {rsvpCalc.fechaDestacadaEs}
            </p>
            <p className="text-[11px] text-stone-600 font-medium">
              🇲🇽 {rsvpCalc.fraseEs}
            </p>
            <p className="text-[11px] text-stone-400 font-medium">
              🇺🇸 {rsvpCalc.fraseEn}
            </p>
          </div>
        </div>

        {/* Switch Confirmación por Teléfono / Llamada */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-stone-800">
              Permitir Confirmación por Llamada / Teléfono Directo
            </p>
            <p className="text-[11px] text-stone-500">
              Muestra en la tarjeta RSVP el botón "¿Prefieres confirmar por teléfono? Llamar a la anfitriona".
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formData.permitirConfirmacionTelefono !== false}
            onClick={() =>
              updateField(
                "permitirConfirmacionTelefono",
                formData.permitirConfirmacionTelefono === false
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
              formData.permitirConfirmacionTelefono !== false
                ? "bg-[#7A002A]"
                : "bg-stone-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.permitirConfirmacionTelefono !== false
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Botón flotante / inferior de guardar cambios */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#7A002A] hover:bg-[#600021] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isSaving ? "Guardando..." : isEditMode ? "Guardar Cambios" : "Publicar Invitación"}</span>
        </button>
      </div>
    </div>
  );
}
