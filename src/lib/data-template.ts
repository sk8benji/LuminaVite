// Data-template como única base al crear una invitación (auditoría §5.3).
//
// Antes había tres fuentes que competían: TEMPLATE_PRESETS (local, incompleto),
// la fila MasterTemplate en DB vía /api/templates y demo-data.ts. La base es
// ahora el data-template = la entrada tpl-<slug> de templates-data.ts
// fusionada con el demo correspondiente (demo-data.ts). Las claves de
// configExtra van DENTRO de configPlantilla, nunca esparcidas a nivel superior:
// los templates solo leen data.configPlantilla (parseTemplateConfig).
import { INITIAL_MASTER_TEMPLATES } from "@/lib/templates-data";
import { ALL_SYSTEM_DEMOS, getSystemDemo } from "@/lib/demo-data";

/** Alias de estilo que comparten data-template. */
const ESTILO_ALIAS: Record<string, string> = {
  GYBSY_20S: "GATSBY_20S",
};

/**
 * Claves que viven en configPlantilla (unión de las *Config de
 * src/types/templateConfigs.ts + claves leídas vía `(configPlantilla as any)`).
 *
 * NO incluye las duplicidades de §5.3 paso 6 (subtitulo, dressCodeTitulo,
 * coloresReservados, fotoZapato1Url, fotoZapato2Url, titulo): esas quedan a
 * nivel superior, que es su casa canónica hoy en el editor; los templates
 * ya hacen fallback a data.<campo> cuando no están en configPlantilla.
 * Tampoco incluye las claves de los ítems de hitosVida (anio, titulo,
 * tituloEn, texto, textoEn, fotoUrl): son sub-claves, no claves de config.
 */
export const TEMPLATE_CONFIG_KEYS: ReadonlySet<string> = new Set([
  // QuinceRosadoConfig
  "nombreFestejada",
  "padres",
  "mama",
  "papa",
  "textoCompleto",
  "padrinos",
  "chambelanes",
  "cambioZapatillas",
  "mensaje",
  "colorVestidoReservado",
  "cancionVals",
  "fraseEmocional",
  "avisoNinos",
  "ninosTitulo",
  "ninosTituloEn",
  "ninosTexto",
  "ninosTextoEn",
  "ninosCierre",
  "ninosCierreEn",
  "dedicatoriaCierre",
  "dedicatoriaCierreEn",
  "mostrarDedicatoriaCierre",
  // BlueButterflyConfig
  "nombreHomenajeada",
  "fraseBiblica",
  "animacionMariposas",
  "colorAcentoHex",
  "corteHonor",
  "reproductorViniloTexto",
  // BlushPrincessConfig / QuinceEraPinkConfig / Miss15Config / BabyBlueConfig
  "familiaAnfitriona",
  "familiaAnfitrionaEn",
  "ceremoniaHora",
  "recepcionHora",
  "contactoNombre",
  "cartaTexto",
  "cartaTextoEn",
  // ElegantRoseConfig
  "chambelan",
  "damas",
  "hitosVida",
  "fotoFondoSobre",
  "accommodationTexto",
  "accommodationTextoEn",
  "growingUpCierre",
  "growingUpCierreEn",
  // FairytaleChateauConfig
  "pareja",
  "novio",
  "novia",
  "hospedaje",
  "hotelNombre",
  "suitesInfo",
  "tarifas",
  "link",
  "transporte",
  "shuttlesInfo",
  "codigoVestimentaGala",
  // CoralineMysticalConfig
  "fraseMistica",
  "animacionBotones",
  "colorAcento",
  "puertaSecretaMsg",
  // Gatsby20sConfig
  "subtituloEn",
  "fraseApertura",
  "fraseAperturaEn",
  "horaRecepcion",
  "portadaBienvenida",
  "portadaBienvenidaEn",
  "coloresReservadosEn",
  "ticketFechaTexto",
  "venueNombre",
  "venueDireccion",
  "dressCodeTexto",
  "cocktailsTitulo",
  "cocktailsTexto",
  "agradecimientoTexto",
  "agradecimientoTextoEn",
  // Leídas vía (configPlantilla as any) fuera de las interfaces
  "nombreQuinceanera",
  // Estructura de secciones dentro de configPlantilla
  "secciones",
  "ordenSecciones",
]);

export interface SplitTemplate {
  topLevel: Record<string, any>;
  configPlantilla: Record<string, any>;
}

/**
 * Parte un payload de plantilla (INITIAL, fila DB o configExtra aplanado):
 * las claves de config van a configPlantilla; el resto queda a nivel superior.
 * Los valores vacíos (null/undefined/"") no pisan nada: se descartan.
 */
export function splitTemplatePayload(
  payload: Record<string, any> | null | undefined
): SplitTemplate {
  const topLevel: Record<string, any> = {};
  const configPlantilla: Record<string, any> = {};
  for (const [k, v] of Object.entries(payload || {})) {
    if (v === null || v === undefined || v === "") continue;
    if (TEMPLATE_CONFIG_KEYS.has(k)) configPlantilla[k] = v;
    else topLevel[k] = v;
  }
  return { topLevel, configPlantilla };
}

function getDemoByEstilo(estilo: string): any | null {
  const seen = new Set<any>();
  for (const demo of Object.values(ALL_SYSTEM_DEMOS)) {
    if (seen.has(demo)) continue;
    seen.add(demo);
    if ((demo as any)?.estiloPlantilla === estilo) return demo;
  }
  return null;
}

/**
 * Base del data-template para un estilo: demo + entrada tpl (la entrada gana)
 * con su configExtra dentro de configPlantilla. null si el estilo no tiene
 * ni entrada tpl ni demo.
 */
export function getDataTemplateBase(estilo: string): SplitTemplate | null {
  const canonical = ESTILO_ALIAS[estilo] || estilo;
  const initial: any = INITIAL_MASTER_TEMPLATES.find(
    (t) => t.estiloPlantilla === canonical
  );
  const demo: any = (initial ? getSystemDemo(initial.slug) : null) ?? getDemoByEstilo(canonical);
  if (!initial && !demo) return null;
  const { configExtra: initialExtra, ...initialTop } = initial || {};
  const { configPlantilla: demoConfig, ...demoTop } = demo || {};
  // El demo aporta los valores de ejemplo; la entrada tpl gana.
  const mergedTop: Record<string, any> = { ...demoTop, ...initialTop };
  // Meta de la plantilla (no son campos de la invitación): fuera.
  for (const k of ["id", "slug", "nombre", "categoria", "activo", "orden", "createdAt", "updatedAt"]) {
    if (k === "categoria" && mergedTop.categoria) {
      mergedTop.tipoEvento = mergedTop.categoria;
    }
    delete mergedTop[k];
  }
  // configExtra de la entrada tpl dentro de configPlantilla (nunca arriba).
  const mergedConfig = { ...(demoConfig || {}), ...(initialExtra || {}) };
  // Por si el demo trae claves de config a nivel superior, partirlas también.
  const split = splitTemplatePayload(mergedTop);
  return {
    topLevel: split.topLevel,
    configPlantilla: { ...split.configPlantilla, ...mergedConfig },
  };
}

/** Títulos de ejemplo de todos los data-templates (para detectar "aún no personalizó el nombre"). */
export function getDataTemplateTitles(): Set<string> {
  const titles = new Set<string>();
  const estilos = new Set<string>();
  for (const t of INITIAL_MASTER_TEMPLATES) estilos.add(t.estiloPlantilla);
  for (const demo of Object.values(ALL_SYSTEM_DEMOS)) {
    if ((demo as any)?.estiloPlantilla) estilos.add((demo as any).estiloPlantilla);
  }
  for (const estilo of estilos) {
    const base = getDataTemplateBase(estilo);
    if (base?.topLevel?.titulo) titles.add(base.topLevel.titulo);
  }
  return titles;
}
