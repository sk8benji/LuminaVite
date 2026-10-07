export type TemplateId =
  | "QUINCE_ROSADO"
  | "PRINCESA_ROSA"
  | "ELEGANT_ROSE"
  | "FAIRYTALE_CHATEAU"
  | "BLUE_BUTTERFLY"
  | "CORALINE_MYSTICAL"
  | "CLASICA_IMPERIAL"
  | "ESMERALDA_ROYAL"
  | "JARDIN_BOTANICA"
  | "MINIMALISTA_EDITORIAL";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  category: "QUINCEANERA" | "BODA" | "CUMPLEANOS" | "UNIVERSAL";
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
  previewThumbnail?: string;
  description?: string;
}

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  QUINCE_ROSADO: {
    id: "QUINCE_ROSADO",
    name: "Quince Rosado (Magdalena - Canva)",
    category: "QUINCEANERA",
    bgColor: "#FFFFFF",
    cardBg: "#FFFFFF",
    textPrimary: "#7A002A",
    textSecondary: "#B74F5F",
    accentColor: "#CE2962",
    accentSoft: "#FDF0F3",
    borderSoft: "#F3C5D0",
    buttonBg: "#7A002A",
    buttonText: "#FFFFFF",
    fontHeading: "'Great Vibes', cursive",
    fontSubheading: "'Libre Baskerville', serif",
    fontBody: "'Lora', serif",
    ribbonGradient: "from-pink-300 via-rose-200 to-pink-400",
    badgeBg: "#FDF0F3",
    previewThumbnail: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
    description: "Sobre interactivo 3D con lazo de seda y rosas, arco de princesa a caballo, línea de tiempo floral, dress code, regalos y confirmación.",
  },
  ELEGANT_ROSE: {
    id: "ELEGANT_ROSE",
    name: "Elegant Rose (Isabella - Canva T1)",
    category: "QUINCEANERA",
    bgColor: "#FFF5F6",
    cardBg: "#FFFFFF",
    textPrimary: "#5A3E44",
    textSecondary: "#8A6B70",
    accentColor: "#CE8486",
    accentSoft: "#FDECEF",
    borderSoft: "#EAB7B8",
    buttonBg: "#CE8486",
    buttonText: "#FFFFFF",
    fontHeading: "'Great Vibes', cursive",
    fontSubheading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif",
    ribbonGradient: "from-rose-300 via-pink-200 to-rose-400",
    badgeBg: "#FDECEF",
    previewThumbnail: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
    description: "Bilingüe (EN/ES), video embed YouTube, línea de tiempo 'Growing Up' con fotos por año y wishlist.",
  },
  FAIRYTALE_CHATEAU: {
    id: "FAIRYTALE_CHATEAU",
    name: "Fairytale Château (Emma & Lucas - Canva T2)",
    category: "BODA",
    bgColor: "#FBF5EB",
    cardBg: "#FFFFFF",
    textPrimary: "#19223D",
    textSecondary: "#655A4E",
    accentColor: "#AF936A",
    accentSoft: "#EFE6D7",
    borderSoft: "#EFD2A6",
    buttonBg: "#19223D",
    buttonText: "#FFFFFF",
    fontHeading: "'Playfair Display', serif",
    fontSubheading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif",
    ribbonGradient: "from-amber-200 via-stone-100 to-amber-300",
    badgeBg: "#EFE6D7",
    description: "Boda de lujo en castillo, suites de hotel, servicio de transporte/shuttle y wedding registry.",
  },
  BLUE_BUTTERFLY: {
    id: "BLUE_BUTTERFLY",
    name: "Blue Butterfly Garden (Canva T3)",
    category: "QUINCEANERA",
    bgColor: "#F4F7FB",
    cardBg: "#FFFFFF",
    textPrimary: "#1E3A5F",
    textSecondary: "#4E6688",
    accentColor: "#7FA2C6",
    accentSoft: "#E8EFF8",
    borderSoft: "#BD9FC5",
    buttonBg: "#2B4C7E",
    buttonText: "#FFFFFF",
    fontHeading: "'Alex Brush', cursive",
    fontSubheading: "'Playfair Display', serif",
    fontBody: "'Montserrat', sans-serif",
    ribbonGradient: "from-sky-300 via-blue-200 to-purple-200",
    badgeBg: "#E8EFF8",
    description: "Mariposas celestiales flotantes en CSS, arco celestial, carta emotiva de los padres e itinerario de cuento.",
  },
  CORALINE_MYSTICAL: {
    id: "CORALINE_MYSTICAL",
    name: "Coraline Other World (Canva T4)",
    category: "CUMPLEANOS",
    bgColor: "#0A1956",
    cardBg: "#121A42",
    textPrimary: "#F5F2EB",
    textSecondary: "#D8D4BF",
    accentColor: "#FFD700",
    accentSoft: "#3A0443",
    borderSoft: "#2F0087",
    buttonBg: "#FFD700",
    buttonText: "#0A1956",
    fontHeading: "'Cinzel', serif",
    fontSubheading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif",
    ribbonGradient: "from-indigo-950 via-purple-900 to-blue-900",
    badgeBg: "#3A0443",
    description: "Temática mágica/gótica con puerta secreta, llave dorada, botones negros, gato y dinámica de libros.",
  },
  PRINCESA_ROSA: {
    id: "PRINCESA_ROSA",
    name: "Princesa Rosa (XV Años Clásica - Elsy)",
    category: "QUINCEANERA",
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
    description: "Réplica clásica del video de referencia con sobre 3D, cuenta regresiva magenta y 13 bloques.",
  },
  CLASICA_IMPERIAL: {
    id: "CLASICA_IMPERIAL",
    name: "Clásica Imperial (Bodas / XV)",
    category: "UNIVERSAL",
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
    category: "UNIVERSAL",
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
    category: "UNIVERSAL",
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
    category: "UNIVERSAL",
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
