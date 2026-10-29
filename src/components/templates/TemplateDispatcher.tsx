"use client";

import React from "react";
import InvitationMobileView, { InvitationData } from "../invitation/InvitationMobileView";
import ElegantRoseTemplate from "./ElegantRoseTemplate";
import FairytaleWeddingTemplate from "./FairytaleWeddingTemplate";
import BlueButterflyTemplate from "./BlueButterflyTemplate";
import BlushPrincessTemplate from "./BlushPrincessTemplate";
import BeautyQuinceTemplate from "./BeautyQuinceTemplate";
import QuinceEraPinkTemplate from "./QuinceEraPinkTemplate";
import Miss15Template from "./Miss15Template";
import BabyBlueTemplate from "./BabyBlueTemplate";
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
    case "BABY_BLUE":
      return <BabyBlueTemplate data={data} skipIntro={skipIntro} />;
    case "MISS_15":
      return <Miss15Template data={data} skipIntro={skipIntro} />;
    case "QUINCE_ERA_PINK":
      return <QuinceEraPinkTemplate data={data} skipIntro={skipIntro} />;
    case "BLUSH_PRINCESS":
      return <BlushPrincessTemplate data={data} skipIntro={skipIntro} />;
    case "BEAUTY_QUINCE":
      return <BeautyQuinceTemplate data={data} skipIntro={skipIntro} />;
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
