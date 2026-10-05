"use client";

import React from "react";
import { Calendar, Download } from "lucide-react";
import { TemplateConfig } from "@/lib/templates";

interface AddToCalendarButtonProps {
  titulo: string;
  descripcion?: string;
  ubicacion: string;
  fechaEvento: string | Date;
  template: TemplateConfig;
}

export default function AddToCalendarButton({
  titulo,
  descripcion = "¡Acompáñanos a celebrar este gran momento!",
  ubicacion,
  fechaEvento,
  template,
}: AddToCalendarButtonProps) {
  const eventDate = new Date(fechaEvento);
  const endDate = new Date(eventDate.getTime() + 6 * 60 * 60 * 1000); // Duración estimada 6 horas

  // Formato YYYYMMDDTHHmmssZ
  const formatIsoForCalendar = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const startIso = formatIsoForCalendar(eventDate);
  const endIso = formatIsoForCalendar(endDate);

  // Enlace directo a Google Calendar
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    titulo
  )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(
    descripcion
  )}&location=${encodeURIComponent(ubicacion)}`;

  // Generador de archivo .ics descargable
  const handleDownloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LuminaVite//Invitaciones Digitales//ES
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${titulo}
DESCRIPTION:${descripcion}
LOCATION:${ubicacion}
DTSTART:${startIso}
DTEND:${endIso}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${titulo.replace(/[^a-zA-Z0-9]/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold shadow-md transition transform active:scale-95"
        style={{
          backgroundColor: template.buttonBg,
          color: template.buttonText,
          fontFamily: template.fontSubheading,
        }}
      >
        <Calendar className="w-4 h-4" />
        Google Calendar
      </a>

      <button
        onClick={handleDownloadIcs}
        type="button"
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-medium border shadow-sm transition transform active:scale-95"
        style={{
          backgroundColor: template.cardBg,
          borderColor: template.borderSoft,
          color: template.textPrimary,
          fontFamily: template.fontSubheading,
        }}
      >
        <Download className="w-4 h-4 opacity-75" />
        Apple / Outlook (.ics)
      </button>
    </div>
  );
}
