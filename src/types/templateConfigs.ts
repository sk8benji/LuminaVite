/**
 * Definiciones de Configuración Dinámica por Plantilla (JSONB: configPlantilla)
 * 
 * Cada plantilla almacena en este contenedor sus variables particulares,
 * decoraciones, textos auxiliares y fotos temáticas sin requerir columnas fijas en SQL.
 */

export interface QuinceRosadoConfig {
  nombreFestejada?: string;
  padres?: {
    mama?: string;
    papa?: string;
    textoCompleto?: string;
  };
  padrinos?: string[];
  chambelanes?: string[];
  cambioZapatillas?: {
    fotoZapato1Url?: string; // Zapatilla de Cristal previa a la Ceremonia
    fotoZapato2Url?: string; // Zapatilla en Cojín / Corte de Honor
    mensaje?: string;
  };
  colorVestidoReservado?: string;
  cancionVals?: string;
  fraseEmocional?: string;
  avisoNinos?: string;
}

export interface BlueButterflyConfig {
  nombreHomenajeada?: string;
  fraseBiblica?: string;
  animacionMariposas?: boolean;
  colorAcentoHex?: string;
  corteHonor?: Array<{ rol: string; nombre: string }>;
  reproductorViniloTexto?: string;
}

export interface ElegantRoseConfig {
  padres?: string;
  padrinos?: string[];
  chambelan?: string;
  damas?: string[];
  hitosVida?: Array<{
    anio: string;
    titulo: string;
    texto: string;
    fotoUrl?: string;
  }>;
}

export interface FairytaleChateauConfig {
  pareja?: {
    novio?: string;
    novia?: string;
  };
  hospedaje?: {
    hotelNombre?: string;
    suitesInfo?: string;
    tarifas?: string;
    link?: string;
  };
  transporte?: {
    shuttlesInfo?: string;
  };
  codigoVestimentaGala?: string;
}

export interface CoralineMysticalConfig {
  fraseMistica?: string;
  animacionBotones?: boolean;
  colorAcento?: string;
  puertaSecretaMsg?: string;
}

/**
 * Mapa de tipos tipado por identificador de plantilla
 */
export type TemplateConfigMap = {
  QUINCE_ROSADO: QuinceRosadoConfig;
  BLUE_BUTTERFLY: BlueButterflyConfig;
  ELEGANT_ROSE: ElegantRoseConfig;
  FAIRYTALE_CHATEAU: FairytaleChateauConfig;
  CORALINE_MYSTICAL: CoralineMysticalConfig;
  PRINCESA_ROSA: Record<string, any>;
  [key: string]: Record<string, any>;
};

/**
 * Helper para desempaquetar la configuración tipada de forma segura
 */
export function parseTemplateConfig<T = Record<string, any>>(
  rawConfig: unknown,
  fallback: Partial<T> = {}
): T {
  if (!rawConfig) return fallback as T;
  if (typeof rawConfig === "string") {
    try {
      return { ...fallback, ...JSON.parse(rawConfig) } as T;
    } catch {
      return fallback as T;
    }
  }
  if (typeof rawConfig === "object" && rawConfig !== null) {
    return { ...fallback, ...(rawConfig as Record<string, any>) } as T;
  }
  return fallback as T;
}
