export type TemplateId =
  | "PRINCESA_ROSA"
  | "CLASICA_IMPERIAL"
  | "ESMERALDA_ROYAL"
  | "JARDIN_BOTANICA"
  | "MINIMALISTA_EDITORIAL";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  bgColor: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  accentSoft: string;
  borderSoft: string;
  buttonBg: string;
  buttonText: string;
  fontHeading: string;
  fontSubheading: string;
  fontBody: string;
  ribbonGradient: string;
  badgeBg: string;
}

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  PRINCESA_ROSA: {
    id: "PRINCESA_ROSA",
    name: "Princesa Rosa (XV Años)",
    bgColor: "#FFF9FA",
    cardBg: "#FFFFFF",
    textPrimary: "#5A3E44",
    textSecondary: "#7A6E70",
    accentColor: "#D4A59A",
    accentSoft: "#FCECEE",
    borderSoft: "#FADCE0",
    buttonBg: "#5A3E44",
    buttonText: "#FFFFFF",
    fontHeading: "'Great Vibes', cursive",
    fontSubheading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif",
    ribbonGradient: "from-pink-200 via-pink-100 to-rose-200",
    badgeBg: "#FCECEE",
  },
  CLASICA_IMPERIAL: {
    id: "CLASICA_IMPERIAL",
    name: "Clásica Imperial (Bodas / XV)",
    bgColor: "#FBFBF9",
    cardBg: "#FFFFFF",
    textPrimary: "#1A1A1A",
    textSecondary: "#636363",
    accentColor: "#BFA15F",
    accentSoft: "#F7F2E7",
    borderSoft: "#E8DECA",
    buttonBg: "#BFA15F",
    buttonText: "#FFFFFF",
    fontHeading: "'Playfair Display', serif",
    fontSubheading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif",
    ribbonGradient: "from-amber-200 via-yellow-100 to-amber-300",
    badgeBg: "#F7F2E7",
  },
  ESMERALDA_ROYAL: {
    id: "ESMERALDA_ROYAL",
    name: "Esmeralda Royal (Gala Nocturna)",
    bgColor: "#061A10",
    cardBg: "#0B2B1B",
    textPrimary: "#F2F4F3",
    textSecondary: "#A7B8B0",
    accentColor: "#E5C158",
    accentSoft: "#143C28",
    borderSoft: "#1D5238",
    buttonBg: "#E5C158",
    buttonText: "#061A10",
    fontHeading: "'Cormorant Garamond', serif",
    fontSubheading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif",
    ribbonGradient: "from-emerald-700 via-teal-800 to-emerald-900",
    badgeBg: "#143C28",
  },
  JARDIN_BOTANICA: {
    id: "JARDIN_BOTANICA",
    name: "Jardín Botánica (Romántica / Boho)",
    bgColor: "#F7F6F2",
    cardBg: "#FFFFFF",
    textPrimary: "#2A302A",
    textSecondary: "#667266",
    accentColor: "#8A9A86",
    accentSoft: "#EAEFEA",
    borderSoft: "#D5DDD4",
    buttonBg: "#4E614C",
    buttonText: "#FFFFFF",
    fontHeading: "'Alex Brush', cursive",
    fontSubheading: "'Cormorant Garamond', serif",
    fontBody: "'Montserrat', sans-serif",
    ribbonGradient: "from-emerald-200 via-green-100 to-teal-200",
    badgeBg: "#EAEFEA",
  },
  MINIMALISTA_EDITORIAL: {
    id: "MINIMALISTA_EDITORIAL",
    name: "Minimalista Editorial (Vogue / Modern)",
    bgColor: "#FFFFFF",
    cardBg: "#FAFAFA",
    textPrimary: "#111111",
    textSecondary: "#666666",
    accentColor: "#222222",
    accentSoft: "#EEEEEE",
    borderSoft: "#E0E0E0",
    buttonBg: "#111111",
    buttonText: "#FFFFFF",
    fontHeading: "'Prata', serif",
    fontSubheading: "'Cinzel', serif",
    fontBody: "'Inter', sans-serif",
    ribbonGradient: "from-zinc-200 via-stone-100 to-neutral-200",
    badgeBg: "#EEEEEE",
  },
};

export function getTemplate(id?: string): TemplateConfig {
  if (id && id in TEMPLATES) {
    return TEMPLATES[id as TemplateId];
  }
  return TEMPLATES.PRINCESA_ROSA;
}
