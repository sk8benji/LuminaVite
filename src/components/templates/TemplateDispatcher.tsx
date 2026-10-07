"use client";

import React from "react";
import InvitationMobileView, { InvitationData } from "../invitation/InvitationMobileView";
import ElegantRoseTemplate from "./ElegantRoseTemplate";
import FairytaleWeddingTemplate from "./FairytaleWeddingTemplate";
import BlueButterflyTemplate from "./BlueButterflyTemplate";
import CoralineThemedTemplate from "./CoralineThemedTemplate";
import QuinceRosadoTemplate from "./QuinceRosadoTemplate";

export default function TemplateDispatcher({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  switch (data.estiloPlantilla) {
    case "QUINCE_ROSADO":
      return <QuinceRosadoTemplate data={data} skipIntro={skipIntro} />;
    case "ELEGANT_ROSE":
      return <ElegantRoseTemplate data={data} skipIntro={skipIntro} />;
    case "FAIRYTALE_CHATEAU":
      return <FairytaleWeddingTemplate data={data} skipIntro={skipIntro} />;
    case "BLUE_BUTTERFLY":
      return <BlueButterflyTemplate data={data} skipIntro={skipIntro} />;
    case "CORALINE_MYSTICAL":
      return <CoralineThemedTemplate data={data} skipIntro={skipIntro} />;
    case "PRINCESA_ROSA":
    case "CLASICA_IMPERIAL":
    case "ESMERALDA_ROYAL":
    case "JARDIN_BOTANICA":
    case "MINIMALISTA_EDITORIAL":
    default:
      return <InvitationMobileView data={data} skipIntro={skipIntro} />;
  }
}
