"use client";

import React from "react";
import InvitationMobileView, { InvitationData } from "../invitation/InvitationMobileView";
import ElegantRoseTemplate from "./ElegantRoseTemplate";
import FairytaleWeddingTemplate from "./FairytaleWeddingTemplate";
import BlueButterflyTemplate from "./BlueButterflyTemplate";
import CoralineThemedTemplate from "./CoralineThemedTemplate";

export default function TemplateDispatcher({ data }: { data: InvitationData }) {
  switch (data.estiloPlantilla) {
    case "ELEGANT_ROSE":
      return <ElegantRoseTemplate data={data} />;
    case "FAIRYTALE_CHATEAU":
      return <FairytaleWeddingTemplate data={data} />;
    case "BLUE_BUTTERFLY":
      return <BlueButterflyTemplate data={data} />;
    case "CORALINE_MYSTICAL":
      return <CoralineThemedTemplate data={data} />;
    case "PRINCESA_ROSA":
    case "CLASICA_IMPERIAL":
    case "ESMERALDA_ROYAL":
    case "JARDIN_BOTANICA":
    case "MINIMALISTA_EDITORIAL":
    default:
      return <InvitationMobileView data={data} />;
  }
}
