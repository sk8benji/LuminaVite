"use client";

import React from "react";
import {
  Car,
  Church,
  Wine,
  Crown,
  Sparkles,
  Music,
  PartyPopper,
  Clock,
} from "lucide-react";
import { TemplateConfig } from "@/lib/templates";

export interface TimelineItem {
  hora: string;
  titulo: string;
  descripcion?: string;
  tipoIcono?: string;
}

interface TimelineSectionProps {
  items?: TimelineItem[] | null;
  template: TemplateConfig;
}

const defaultItems: TimelineItem[] = [
  { hora: "4:00 PM", titulo: "Llegada de Invitados", tipoIcono: "car" },
  { hora: "5:00 PM", titulo: "Ceremonia Religiosa", tipoIcono: "church" },
  { hora: "7:00 PM", titulo: "Cena y Brindis", tipoIcono: "wine" },
  { hora: "8:30 PM", titulo: "Vals Oficial y Coronación", tipoIcono: "crown" },
  { hora: "9:30 PM", titulo: "Apertura de Pista y Fiesta", tipoIcono: "party" },
];

export default function TimelineSection({ items, template }: TimelineSectionProps) {
  const timelineData = items && items.length > 0 ? items : defaultItems;

  const renderIcon = (tipo?: string) => {
    const props = { className: "w-3.5 h-3.5" };
    switch (tipo) {
      case "car":
        return <Car {...props} />;
      case "church":
        return <Church {...props} />;
      case "wine":
        return <Wine {...props} />;
      case "crown":
        return <Crown {...props} />;
      case "party":
        return <PartyPopper {...props} />;
      case "music":
        return <Music {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <section className="px-6 py-8">
      <div className="text-center mb-6">
        <span className="text-2xl">⏳</span>
        <h3
          className="text-xs uppercase tracking-widest font-semibold mt-2"
          style={{
            color: template.textPrimary,
            fontFamily: template.fontSubheading,
          }}
        >
          Itinerario del Evento
        </h3>
        <p
          className="text-[11px] opacity-75 mt-0.5"
          style={{
            color: template.textSecondary,
            fontFamily: template.fontBody,
          }}
        >
          Cada momento fue pensado con amor para ti
        </p>
      </div>

      <div className="relative border-l-2 ml-6 space-y-6 text-xs" style={{ borderColor: template.borderSoft }}>
        {timelineData.map((item, idx) => (
          <div key={idx} className="relative pl-6 group">
            {/* Nodo circular */}
            <div
              className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
              style={{
                backgroundColor: template.cardBg,
                borderColor: template.accentColor,
                color: template.accentColor,
              }}
            >
              {renderIcon(item.tipoIcono)}
            </div>

            {/* Hora */}
            <div className="flex items-center gap-1.5 font-bold tracking-wider" style={{ color: template.textPrimary }}>
              <Clock className="w-3 h-3 opacity-60" />
              <span>{item.hora}</span>
            </div>

            {/* Título */}
            <p className="font-medium text-stone-700 mt-0.5 text-xs" style={{ fontFamily: template.fontSubheading }}>
              {item.titulo}
            </p>

            {/* Descripción opcional */}
            {item.descripcion && (
              <p className="text-[11px] opacity-70 mt-0.5 leading-relaxed" style={{ color: template.textSecondary }}>
                {item.descripcion}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
