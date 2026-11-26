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
  // Aviso niños (Sección 10 "Recomendación"): undefined = texto original;
  // título "" = oculta el recuadro; texto/cierre "" = oculta esa línea.
  ninosTitulo?: string;
  ninosTituloEn?: string;
  ninosTexto?: string;
  ninosTextoEn?: string;
  ninosCierre?: string;
  ninosCierreEn?: string;
  // Mensaje de cierre de la Dedicatoria (Sección 3): vacío = no se muestra.
  dedicatoriaCierre?: string;
  dedicatoriaCierreEn?: string;
  mostrarDedicatoriaCierre?: boolean;
}

export interface BlueButterflyConfig {
  nombreHomenajeada?: string;
  fraseBiblica?: string;
  animacionMariposas?: boolean;
  colorAcentoHex?: string;
  corteHonor?: Array<{ rol: string; nombre: string }>;
  reproductorViniloTexto?: string;
}

export interface BlushPrincessConfig {
  familiaAnfitriona?: string;
  familiaAnfitrionaEn?: string;
}

export interface QuinceEraPinkConfig {
  familiaAnfitriona?: string;
  familiaAnfitrionaEn?: string;
  ceremoniaHora?: string;
  recepcionHora?: string;
}

// Miss 15 no lee ninguna clave de config: su template solo usa
// configPlantilla.secciones (toggles) y los campos de nivel superior.
// (Antes declaraba ceremoniaHora/recepcionHora/fraseEmocional/
// colorAcentoHex; ninguna se leía.)
export interface Miss15Config {
  // Sin claves propias.
}

export interface BabyBlueConfig {
  ceremoniaHora?: string;
  familiaAnfitriona?: string;
  familiaAnfitrionaEn?: string;
  contactoNombre?: string;
  cartaTexto?: string;
  cartaTextoEn?: string;
}

export interface ElegantRoseConfig {
  padres?: string;
  padrinos?: string[];
  chambelan?: string;
  damas?: string[];
  /** Hitos de "Growing Up" editados en el admin (Sección 15: Historia).
      Sin hitos guardados se usan los 5 por defecto del template. */
  hitosVida?: Array<{
    anio: string;
    titulo: string;
    tituloEn?: string;
    texto: string;
    textoEn?: string;
    fotoUrl?: string;
  }>;
  /** Foto de fondo del sobre cerrado. Vacío = la foto principal de portada. */
  fotoFondoSobre?: string;
  /** Texto del bloque ACCOMMODATION (Details). Vacío = el bloque no se muestra
      (antes era un texto fijo que afirmaba un bloque de habitaciones). */
  accommodationTexto?: string;
  accommodationTextoEn?: string;
  /** Frase de cierre de "Growing Up". Vacío = texto por defecto del template. */
  growingUpCierre?: string;
  growingUpCierreEn?: string;
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

export interface Gatsby20sConfig {
  /** Nombre de la quinceañera en el ticket y la tarjeta (por defecto, el titulo de la invitacion). */
  nombreQuinceanera?: string;
  subtitulo?: string;
  subtituloEn?: string;
  fraseApertura?: string;
  fraseAperturaEn?: string;
  /** Hora propia de la recepcion ("6:19 PM"); vacia = usa la hora de la placa (seccion Fecha y Hora). */
  horaRecepcion?: string;
  /** Linea de bienvenida de la portada ("WELCOME TO THE" / "BIENVENIDOS A"); "" = oculta la linea. */
  portadaBienvenida?: string;
  portadaBienvenidaEn?: string;
  /** Linea de colores reservados (Vestimenta); "" = oculta la linea en ese idioma. */
  coloresReservados?: string;
  coloresReservadosEn?: string;
  ticketFechaTexto?: string;
  venueNombre?: string;
  venueDireccion?: string;
  dressCodeTitulo?: string;
  dressCodeTexto?: string;
  cocktailsTitulo?: string;
  cocktailsTexto?: string;
  agradecimientoTexto?: string;
  agradecimientoTextoEn?: string;
  colorAcentoHex?: string;
}

/**
 * Mapa de tipos tipado por identificador de plantilla
 */
export type TemplateConfigMap = {
  QUINCE_ROSADO: QuinceRosadoConfig;
  GATSBY_20S: Gatsby20sConfig;
  GYBSY_20S: Gatsby20sConfig;
  GYPSY_BURGUNDY: Gatsby20sConfig;
  BLUE_BUTTERFLY: BlueButterflyConfig;
  BLUSH_PRINCESS: BlushPrincessConfig;
  QUINCE_ERA_PINK: QuinceEraPinkConfig;
  MISS_15: Miss15Config;
  BABY_BLUE: BabyBlueConfig;
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
