"use client";

import React from "react";
import { QuinceRosadoFields } from "./template-configs/QuinceRosadoFields";
import { BlueButterflyFields } from "./template-configs/BlueButterflyFields";
import { ElegantRoseFields } from "./template-configs/ElegantRoseFields";
import { FairytaleChateauFields } from "./template-configs/FairytaleChateauFields";
import { CoralineMysticalFields } from "./template-configs/CoralineMysticalFields";
import { GatsbyFields } from "./template-configs/GatsbyFields";
import { BlushFields } from "./template-configs/BlushFields";
import { EraPinkFields } from "./template-configs/EraPinkFields";
import { BabyBlueFields } from "./template-configs/BabyBlueFields";
import { BeautyFields } from "./template-configs/BeautyFields";
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
    case "GATSBY_20S":
    case "GYBSY_20S":
    case "GYPSY_BURGUNDY":
      return <GatsbyFields value={value} onChange={onChange} slug={slug} />;
    case "BLUSH_PRINCESS":
    case "BLUSH_ENVELOPE":
      return <BlushFields value={value} onChange={onChange} slug={slug} />;
    case "QUINCE_ERA_PINK":
      return <EraPinkFields value={value} onChange={onChange} slug={slug} />;
    case "BABY_BLUE":
      return <BabyBlueFields value={value} onChange={onChange} slug={slug} />;
    case "BEAUTY_QUINCE":
      return <BeautyFields value={value} onChange={onChange} slug={slug} />;
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
