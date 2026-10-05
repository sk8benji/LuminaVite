/**
 * Generador de enlaces RSVP directos a WhatsApp con codificación adecuada.
 */
export interface RsvpMessageParams {
  telefono: string;
  eventoTitulo: string;
  nombreInvitado: string;
  asistencia: "SI" | "NO";
  pases: number;
  acompanantes?: string;
  comentarios?: string;
}

export function generateWhatsAppRsvpUrl(params: RsvpMessageParams): string {
  // Limpiar número (solo números sin signos + ni espacios)
  const cleanPhone = params.telefono.replace(/[^0-9]/g, "");

  const statusText =
    params.asistencia === "SI"
      ? "✅ *¡SÍ ASISTIRÉ CON GUSTO!*"
      : "❌ *Lamentablemente no podré asistir.*";

  const passesText =
    params.asistencia === "SI" ? `\n🎟️ *Pases Confirmados:* ${params.pases}` : "";

  const companionsText =
    params.asistencia === "SI" && params.acompanantes?.trim()
      ? `\n👥 *Acompañantes:* ${params.acompanantes.trim()}`
      : "";

  const notesText = params.comentarios?.trim()
    ? `\n💌 *Mensaje / Felicitación:* ${params.comentarios.trim()}`
    : "";

  const message =
    `✨ *CONFIRMACIÓN DE ASISTENCIA (RSVP)* ✨\n` +
    `🎉 *Evento:* ${params.eventoTitulo}\n` +
    `👤 *Invitado:* ${params.nombreInvitado}\n` +
    `📋 *Respuesta:* ${statusText}` +
    passesText +
    companionsText +
    notesText +
    `\n\n_Enviado desde la invitación digital_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
}
