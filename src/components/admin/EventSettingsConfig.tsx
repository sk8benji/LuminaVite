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
  Megaphone,
} from "lucide-react";
import type { InvitationData } from "@/components/invitation/InvitationMobileView";
import { TemplateId, TEMPLATES } from "@/lib/templates";
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

/** Switch reutilizable con el mismo estilo de "Permitir Confirmación por Teléfono". */
function SettingsSwitch({
  checked,
  onToggle,
  title,
  desc,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold text-stone-800">{title}</p>
        <p className="text-[11px] text-stone-500">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
          checked ? "bg-[#7A002A]" : "bg-stone-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function EventSettingsConfig({
  formData,
  updateField,
  computeRsvpPhrases,
  handleRsvpDiasChange,
  isEditMode,
  handleSave,
  isSaving,
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
                readOnly={isEditMode}
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
                className={`flex-1 px-3 py-2.5 text-xs text-stone-900 font-semibold bg-transparent focus:outline-none ${
                  isEditMode ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
            {isEditMode ? (
              <p className="text-[11px] text-stone-400 mt-1">
                🔒 El enlace no se puede cambiar una vez creado.
              </p>
            ) : (
              <p className="text-[11px] text-stone-400 mt-1">
                Solo letras minúsculas, números y guiones.
              </p>
            )}
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
                  ? "border-[#7A002A] bg-stone-50 text-[#7A002A] ring-1 ring-[#7A002A]"
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
                  ? "border-[#7A002A] bg-stone-50 text-[#7A002A] ring-1 ring-[#7A002A]"
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
                  ? "border-[#7A002A] bg-stone-50 text-[#7A002A] ring-1 ring-[#7A002A]"
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

        {/* Plantilla actual — el único selector de plantillas es el modal */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3">
          <div className="flex items-center gap-2 text-xs min-w-0">
            <Palette className="w-4 h-4 text-[#7A002A] shrink-0" />
            <span className="font-bold text-stone-700 uppercase tracking-wider shrink-0">
              Plantilla actual:
            </span>
            <span className="font-semibold text-stone-900 truncate">
              {TEMPLATES[formData.estiloPlantilla as TemplateId]?.name ||
                formData.estiloPlantilla ||
                "Quince Rosado (Magdalena)"}
            </span>
          </div>
          {onOpenTemplatePicker && (
            <button
              type="button"
              onClick={onOpenTemplatePicker}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7A002A] hover:bg-[#600021] text-white text-xs font-bold transition cursor-pointer shrink-0"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Cambiar Plantilla</span>
            </button>
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
                  ? "border-[#7A002A] bg-stone-50 ring-1 ring-[#7A002A]"
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
                  ? "border-[#7A002A] bg-stone-50 ring-1 ring-[#7A002A]"
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
                  ? "border-[#7A002A] bg-stone-50 ring-1 ring-[#7A002A]"
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
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
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
          <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-1">
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

      {/* ──────────────────────────────────────────────────────────
          TARJETA 4: BANNER DE CONTACTO (BARRA FIJA COMERCIAL)
      ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
        <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#7A002A]" />
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            4. Banner de Contacto (Barra Fija en la Invitación)
          </h3>
        </div>

        <p className="text-[11px] text-stone-500">
          Barra comercial fija al pie de la invitación pública, con botones para
          llamar o mandar texto. Úsala en invitaciones de marketing (ej. la que
          abre el QR de las tarjetas impresas) para que quien la vea en casa
          pueda contactarte. En invitaciones de clientes normalmente va apagada.
        </p>

        <SettingsSwitch
          checked={formData.bannerContactoActivo === true}
          onToggle={() =>
            updateField("bannerContactoActivo", formData.bannerContactoActivo !== true)
          }
          title="Mostrar Banner de Contacto"
          desc="Activa la barra fija borgoña al pie de la invitación pública."
        />

        {formData.bannerContactoActivo === true && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Texto del Banner
                </label>
                <input
                  type="text"
                  value={formData.bannerContactoTexto || ""}
                  onChange={(e) => updateField("bannerContactoTexto", e.target.value)}
                  placeholder="¿Te gustó esta invitación? Haz la tuya"
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-none focus:border-[#7A002A]"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  La frase comercial que se lee junto a los botones.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Teléfono de Contacto (Llamar / Texto)
                </label>
                <input
                  type="text"
                  value={formData.bannerContactoTelefono || ""}
                  onChange={(e) => updateField("bannerContactoTelefono", e.target.value)}
                  placeholder="(818) 299-4882"
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-none focus:border-[#7A002A]"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Número comercial visible en el banner; los botones marcan y
                  mandan SMS a este número. Si lo dejas vacío, se usa el teléfono
                  RSVP del evento.
                </p>
              </div>
            </div>

            <SettingsSwitch
              checked={formData.bannerContactoLlamar !== false}
              onToggle={() =>
                updateField("bannerContactoLlamar", formData.bannerContactoLlamar === false)
              }
              title="Botón Llamar"
              desc="Botón dorado que abre el marcador del teléfono (tel:)."
            />

            <SettingsSwitch
              checked={formData.bannerContactoSms !== false}
              onToggle={() =>
                updateField("bannerContactoSms", formData.bannerContactoSms === false)
              }
              title="Botón Texto (SMS)"
              desc="Botón que abre la app de mensajes con el número listo (sms:). En EE.UU. es la vía principal — sin WhatsApp."
            />
          </>
        )}
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
