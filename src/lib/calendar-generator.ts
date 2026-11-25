/**
 * Genera enlaces y archivos de calendario para Save The Date
 */

export function generateGoogleCalendarUrl({
  titulo,
  descripcion,
  ciudad,
  fechaInicio,
}: {
  titulo: string;
  descripcion?: string;
  ciudad?: string;
  fechaInicio: Date;
}) {
  const start = fechaInicio.toISOString().replace(/-|:|\.\d\d\d/g, "");
  // Duración estimada de 6 horas por defecto para la fiesta
  const fechaFin = new Date(fechaInicio.getTime() + 6 * 60 * 60 * 1000);
  const end = fechaFin.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Save The Date: ${titulo}`,
    dates: `${start}/${end}`,
    details: descripcion || "¡Reserva este día tan especial para celebrar juntos!",
    location: ciudad || "Por confirmar",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile({
  titulo,
  descripcion,
  ciudad,
  fechaInicio,
}: {
  titulo: string;
  descripcion?: string;
  ciudad?: string;
  fechaInicio: Date;
}) {
  const start = fechaInicio.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const fechaFin = new Date(fechaInicio.getTime() + 6 * 60 * 60 * 1000);
  const end = fechaFin.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Click and Love//Save The Date//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:Save The Date: ${titulo}`,
    `DESCRIPTION:${(descripcion || "¡Reserva la fecha!").replace(/\n/g, "\\n")}`,
    `LOCATION:${ciudad || "Por confirmar"}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}`,
    `UID:std-${Date.now()}@clickandlove.app`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Save-The-Date-${titulo.replace(/\s+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
