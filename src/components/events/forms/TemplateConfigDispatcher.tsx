"use client";

import React from "react";
import { QuinceRosadoFields } from "./template-configs/QuinceRosadoFields";
import { BlueButterflyFields } from "./template-configs/BlueButterflyFields";
import { ElegantRoseFields } from "./template-configs/ElegantRoseFields";
import { FairytaleChateauFields } from "./template-configs/FairytaleChateauFields";
import { CoralineMysticalFields } from "./template-configs/CoralineMysticalFields";
import { Info } from "lucide-react";

interface Props {
  estiloPlantilla: string;
  value: Record<string, any>;
  onChange: (updatedConfig: Record<string, any>) => void;
  slug?: string;
}

export const TemplateConfigDispatcher: React.FC<Props> = ({
  estiloPlantilla,
  value,
  onChange,
  slug,
}) => {
  switch (estiloPlantilla) {
    case "QUINCE_ROSADO":
      return <QuinceRosadoFields value={value} onChange={onChange} slug={slug} />;
    case "BLUE_BUTTERFLY":
      return <BlueButterflyFields value={value} onChange={onChange} slug={slug} />;
    case "ELEGANT_ROSE":
      return <ElegantRoseFields value={value} onChange={onChange} slug={slug} />;
    case "FAIRYTALE_CHATEAU":
      return <FairytaleChateauFields value={value} onChange={onChange} slug={slug} />;
    case "CORALINE_MYSTICAL":
      return <CoralineMysticalFields value={value} onChange={onChange} slug={slug} />;
    default:
      return (
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-500 text-xs flex items-center gap-2.5">
          <Info className="w-4 h-4 text-stone-400 shrink-0" />
          <span>
            Esta plantilla utiliza los campos universales del evento y no requiere personalizaciones visuales exclusivas adicionales.
          </span>
        </div>
      );
  }
};

export default TemplateConfigDispatcher;
