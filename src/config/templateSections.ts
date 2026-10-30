/**
 * Catálogo de Secciones Modulares por Plantilla
 * 
 * Cada sección define su identificador, etiqueta, icono, orden visual
 * y su sincronización con columnas existentes de la base de datos.
 */

export type SeccionId =
  | 'musica'
  | 'portada'
  | 'medallonFecha'
  | 'dedicatoria'
  | 'rsvp'
  | 'fotoZapatos1'
  | 'ubicaciones'
  | 'dressCode'
  | 'mesaRegalos'
  | 'itinerario'
  | 'fotoZapatos2'
  | 'corteHonor'
  | 'cuentaRegresiva'
  | 'videoDespedida';

export interface SeccionMeta {
  id: SeccionId;
  numero: number;
  label: string;
  descripcion: string;
  icono: string;
  defaultEnabled: boolean;
  legacyColumn?: string; // Mapeo a columna booleana existente en Evento
}

export const SECCIONES_QUINCE_ROSADO: SeccionMeta[] = [
  {
    id: 'portada',
    numero: 1,
    label: 'Portada',
    descripcion: 'Arco con nubes, "CON Amor LE INVITAMOS", foto principal de portada y nombre de la festejada.',
    icono: 'Sparkles',
    defaultEnabled: true,
  },
  {
    id: 'medallonFecha',
    numero: 2,
    label: 'Fecha y Hora',
    descripcion: 'Medallón circular "15 Años", día, mes, año y hora con formato formal.',
    icono: 'Calendar',
    defaultEnabled: true,
    legacyColumn: 'mostrarFechaPlacaHora',
  },
  {
    id: 'dedicatoria',
    numero: 3,
    label: 'Dedicatoria',
    descripcion: 'Mensaje emotivo bilingüe y las 2 fotos polaroids (Infancia y Quinceañera).',
    icono: 'Heart',
    defaultEnabled: true,
    legacyColumn: 'mostrarFrasePersonalizada',
  },
  {
    id: 'fotoZapatos1',
    numero: 4,
    label: 'Zapato Cristal',
    descripcion: 'Fotografía vertical de transición hacia los templos y recepciones.',
    icono: 'Image',
    defaultEnabled: true,
  },
  {
    id: 'ubicaciones',
    numero: 5,
    label: 'Ubicaciones',
    descripcion: 'Detalles de la iglesia y salón de fiesta con botones directos hacia Google Maps.',
    icono: 'MapPin',
    defaultEnabled: true,
  },
  {
    id: 'dressCode',
    numero: 6,
    label: 'Vestimenta',
    descripcion: 'Etiqueta formal o de gala y especificación de colores reservados para la festejada.',
    icono: 'Sliders',
    defaultEnabled: true,
    legacyColumn: 'mostrarDressCode',
  },
  {
    id: 'mesaRegalos',
    numero: 7,
    label: 'Mesa de Regalos',
    descripcion: 'Aviso de cofre en recepción, enlaces de wishlist y cuentas Zelle, Venmo, PayPal.',
    icono: 'Gift',
    defaultEnabled: true,
    legacyColumn: 'mostrarMesaRegalos',
  },
  {
    id: 'itinerario',
    numero: 8,
    label: 'Plan de la Fiesta',
    descripcion: 'Línea de tiempo vertical con rosas decorativas e hitos de la fiesta (ES / EN).',
    icono: 'Clock',
    defaultEnabled: true,
  },
  {
    id: 'fotoZapatos2',
    numero: 9,
    label: 'Foto en Cojín',
    descripcion: 'Fotografía en cojín, mensaje de despedida y pautas para pequeños invitados.',
    icono: 'Image',
    defaultEnabled: true,
  },
  {
    id: 'corteHonor',
    numero: 10,
    label: 'Corte de Honor',
    descripcion: 'Quinceañera, Chambelanes, Damiselas, Damitas de Hojitas, Padres, Padrinos y Agradecimiento.',
    icono: 'Crown',
    defaultEnabled: true,
  },
  {
    id: 'cuentaRegresiva',
    numero: 11,
    label: 'Cuenta Regresiva',
    descripcion: 'Cronómetro en vivo hacia el evento y calendario mensual con lazo de seda en el día de la fiesta.',
    icono: 'Hourglass',
    defaultEnabled: true,
  },
  {
    id: 'videoDespedida',
    numero: 12,
    label: 'Video',
    descripcion: 'Reproductor de video (YouTube o MP4) y foto final arqueada de despedida.',
    icono: 'Video',
    defaultEnabled: true,
  },
  {
    id: 'musica',
    numero: 13,
    label: 'Música',
    descripcion: 'Reproductor de audio flotante y música instrumental de fondo.',
    icono: 'Music',
    defaultEnabled: true,
  },
];

/**
 * Secciones que cada plantilla renderiza de verdad (auditoría 2026-10-30).
 * Las plantillas fijas (BlueButterfly, BabyBlue, Miss15, EraPink, Blush,
 * BeautyQuince) y la vista genérica NO tienen bloque de zapato (fotoZapatos1),
 * ni de cojín (fotoZapatos2), ni de video de despedida: esos campos existen
 * en el editor pero la plantilla nunca los muestra. BabyBlue tampoco tiene
 * dedicatoria; ElegantRose tampoco; Coraline no tiene mesa de regalos ni
 * corte; Fairytale (boda) no tiene dedicatoria ni corte. QuinceRosado es
 * la única con las 13. Si una plantilla no está aquí, se listan las 13
 * (comportamiento anterior) para no desactivar nada sin evidencia.
 */
const TODAS_MENOS_ZAPATOS_VIDEO: SeccionId[] = [
  'portada',
  'medallonFecha',
  'dedicatoria',
  'ubicaciones',
  'dressCode',
  'mesaRegalos',
  'itinerario',
  'corteHonor',
  'cuentaRegresiva',
  'musica',
];

export const SECCIONES_POR_PLANTILLA: Record<string, SeccionId[]> = {
  QUINCE_ROSADO: [
    'portada',
    'medallonFecha',
    'dedicatoria',
    'fotoZapatos1',
    'ubicaciones',
    'dressCode',
    'mesaRegalos',
    'itinerario',
    'fotoZapatos2',
    'corteHonor',
    'cuentaRegresiva',
    'videoDespedida',
    'musica',
  ],
  BLUE_BUTTERFLY: TODAS_MENOS_ZAPATOS_VIDEO,
  MISS_15: TODAS_MENOS_ZAPATOS_VIDEO,
  QUINCE_ERA_PINK: TODAS_MENOS_ZAPATOS_VIDEO,
  BLUSH_PRINCESS: TODAS_MENOS_ZAPATOS_VIDEO,
  BEAUTY_QUINCE: TODAS_MENOS_ZAPATOS_VIDEO,
  PRINCESA_ROSA: TODAS_MENOS_ZAPATOS_VIDEO,
  CLASICA_IMPERIAL: TODAS_MENOS_ZAPATOS_VIDEO,
  ESMERALDA_ROYAL: TODAS_MENOS_ZAPATOS_VIDEO,
  JARDIN_BOTANICA: TODAS_MENOS_ZAPATOS_VIDEO,
  MINIMALISTA_EDITORIAL: TODAS_MENOS_ZAPATOS_VIDEO,
  BABY_BLUE: [
    'portada',
    'medallonFecha',
    'ubicaciones',
    'dressCode',
    'mesaRegalos',
    'itinerario',
    'corteHonor',
    'cuentaRegresiva',
    'musica',
  ],
  ELEGANT_ROSE: [
    'portada',
    'medallonFecha',
    'ubicaciones',
    'dressCode',
    'mesaRegalos',
    'itinerario',
    'corteHonor',
    'cuentaRegresiva',
    'musica',
  ],
  CORALINE_MYSTICAL: [
    'portada',
    'medallonFecha',
    'dedicatoria',
    'ubicaciones',
    'dressCode',
    'itinerario',
    'cuentaRegresiva',
    'musica',
  ],
  FAIRYTALE_CHATEAU: [
    'portada',
    'medallonFecha',
    'ubicaciones',
    'dressCode',
    'mesaRegalos',
    'itinerario',
    'cuentaRegresiva',
    'musica',
  ],
};

export function seccionesSoportadas(estiloPlantilla?: string | null): SeccionId[] {
  const todas = SECCIONES_QUINCE_ROSADO.map((s) => s.id);
  if (!estiloPlantilla) return todas;
  return SECCIONES_POR_PLANTILLA[estiloPlantilla] ?? todas;
}

/**
 * Obtener estado de habilitación de una sección dado el objeto de invitación
 */
export function isSectionEnabledInEvent(
  sectionId: SeccionId,
  configPlantilla: any,
  fallbackCols: {
    mostrarFrasePersonalizada?: boolean | null;
    mostrarFechaPlacaHora?: boolean | null;
    mostrarDressCode?: boolean | null;
    mostrarMesaRegalos?: boolean | null;
    permitirConfirmacionTelefono?: boolean | null;
  }
): boolean {
  const secciones = configPlantilla?.secciones;
  if (secciones && secciones[sectionId]?.enabled !== undefined) {
    return Boolean(secciones[sectionId].enabled);
  }

  // Fallbacks con columnas existentes
  if (sectionId === 'dedicatoria' && fallbackCols.mostrarFrasePersonalizada !== undefined && fallbackCols.mostrarFrasePersonalizada !== null) {
    return fallbackCols.mostrarFrasePersonalizada;
  }
  if (sectionId === 'medallonFecha' && fallbackCols.mostrarFechaPlacaHora !== undefined && fallbackCols.mostrarFechaPlacaHora !== null) {
    return fallbackCols.mostrarFechaPlacaHora;
  }
  if (sectionId === 'dressCode' && fallbackCols.mostrarDressCode !== undefined && fallbackCols.mostrarDressCode !== null) {
    return fallbackCols.mostrarDressCode;
  }
  if (sectionId === 'mesaRegalos' && fallbackCols.mostrarMesaRegalos !== undefined && fallbackCols.mostrarMesaRegalos !== null) {
    return fallbackCols.mostrarMesaRegalos;
  }

  return true;
}
