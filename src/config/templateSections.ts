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
  | 'videoDespedida'
  | 'historia';

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
    id: 'rsvp',
    numero: 4,
    label: 'RSVP',
    descripcion: 'Títulos de la tarjeta de confirmación en español e inglés y la frase de fecha límite.',
    icono: 'Users',
    defaultEnabled: true,
  },
  {
    id: 'fotoZapatos1',
    numero: 5,
    label: 'Zapato Cristal',
    descripcion: 'Fotografía vertical de transición hacia los templos y recepciones.',
    icono: 'Image',
    defaultEnabled: true,
  },
  {
    id: 'ubicaciones',
    numero: 6,
    label: 'Ubicaciones',
    descripcion: 'Detalles de la iglesia y salón de fiesta con botones directos hacia Google Maps.',
    icono: 'MapPin',
    defaultEnabled: true,
  },
  {
    id: 'dressCode',
    numero: 7,
    label: 'Vestimenta',
    descripcion: 'Etiqueta formal o de gala y especificación de colores reservados para la festejada.',
    icono: 'Sliders',
    defaultEnabled: true,
    legacyColumn: 'mostrarDressCode',
  },
  {
    id: 'mesaRegalos',
    numero: 8,
    label: 'Mesa de Regalos',
    descripcion: 'Aviso de cofre en recepción, enlaces de wishlist y cuentas Zelle, Venmo, PayPal.',
    icono: 'Gift',
    defaultEnabled: true,
    legacyColumn: 'mostrarMesaRegalos',
  },
  {
    id: 'itinerario',
    numero: 9,
    label: 'Plan de la Fiesta',
    descripcion: 'Línea de tiempo vertical con rosas decorativas e hitos de la fiesta (ES / EN).',
    icono: 'Clock',
    defaultEnabled: true,
  },
  {
    id: 'fotoZapatos2',
    numero: 10,
    label: 'Recomendación',
    descripcion: 'Foto en cojín, mensaje de despedida y recomendaciones para los invitados.',
    icono: 'Image',
    defaultEnabled: true,
  },
  {
    id: 'corteHonor',
    numero: 11,
    label: 'Corte de Honor',
    descripcion: 'Quinceañera, Chambelanes, Damiselas, Damitas de Hojitas, Padres, Padrinos y Agradecimiento.',
    icono: 'Crown',
    defaultEnabled: true,
  },
  {
    id: 'cuentaRegresiva',
    numero: 12,
    label: 'Cuenta Regresiva',
    descripcion: 'Cronómetro en vivo hacia el evento y calendario mensual con lazo de seda en el día de la fiesta.',
    icono: 'Hourglass',
    defaultEnabled: true,
  },
  {
    id: 'videoDespedida',
    numero: 13,
    label: 'Video',
    descripcion: 'Reproductor de video (YouTube o MP4) y foto final arqueada de despedida.',
    icono: 'Video',
    defaultEnabled: true,
  },
  {
    id: 'musica',
    numero: 14,
    label: 'Música',
    descripcion: 'Reproductor de audio flotante y música instrumental de fondo.',
    icono: 'Music',
    defaultEnabled: true,
  },
  {
    id: 'historia',
    numero: 15,
    label: 'Historia / Growing Up',
    descripcion: 'Marcos de película con las fotos de su infancia, fecha, título y texto por hito, más la frase de cierre.',
    icono: 'BookOpen',
    defaultEnabled: true,
  },
];

/**
 * Secciones que cada plantilla renderiza de verdad (auditoría 2026-10-30).
 * Las plantillas fijas (BlueButterfly, BabyBlue, Miss15, EraPink, Blush,
 * BeautyQuince) y la vista genérica NO tienen bloque de zapato (fotoZapatos1),
 * ni de cojín (fotoZapatos2), ni de video de despedida: esos campos existen
 * en el editor pero la plantilla nunca los muestra. BabyBlue tampoco tiene
 * dedicatoria; Coraline no tiene mesa de regalos ni corte; Fairytale (boda)
 * no tiene dedicatoria ni corte. ElegantRose SÍ tiene dedicatoria e historia
 * (Growing Up) desde nov 2026. QuinceRosado es la única con las 14
 * originales. Si una plantilla no está aquí, se listan las 14
 * (comportamiento anterior) para no desactivar nada sin evidencia.
 */
const TODAS_MENOS_ZAPATOS_VIDEO: SeccionId[] = [
  'portada',
  'medallonFecha',
  'dedicatoria',
  'rsvp',
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
    'rsvp',
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
    'rsvp',
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
    'dedicatoria',
    'rsvp',
    'ubicaciones',
    'dressCode',
    'mesaRegalos',
    'itinerario',
    'corteHonor',
    'cuentaRegresiva',
    'musica',
    'historia',
  ],
  CORALINE_MYSTICAL: [
    'portada',
    'medallonFecha',
    'dedicatoria',
    'rsvp',
    'ubicaciones',
    'dressCode',
    'itinerario',
    'cuentaRegresiva',
    'musica',
  ],
  FAIRYTALE_CHATEAU: [
    'portada',
    'medallonFecha',
    'rsvp',
    'ubicaciones',
    'dressCode',
    'mesaRegalos',
    'itinerario',
    'cuentaRegresiva',
    'musica',
  ],
  GATSBY_20S: [
    'portada',
    'medallonFecha',
    'rsvp',
    'ubicaciones',
    'dressCode',
    'mesaRegalos',
    'itinerario',
    'corteHonor',
    'cuentaRegresiva',
    'musica',
  ],
  GYPSY_BURGUNDY: [
    'portada',
    'medallonFecha',
    'rsvp',
    'ubicaciones',
    'dressCode',
    'mesaRegalos',
    'itinerario',
    'corteHonor',
    'cuentaRegresiva',
    'musica',
  ],
};

export function seccionesSoportadas(estiloPlantilla?: string | null): SeccionId[] {
  const todas = SECCIONES_QUINCE_ROSADO.map((s) => s.id);
  if (!estiloPlantilla) return todas;
  return SECCIONES_POR_PLANTILLA[estiloPlantilla] ?? todas;
}

// =========================================================================
// MÁSTER PROPIO DE SAVE THE DATE (separado del de invitaciones)
// -------------------------------------------------------------------------
// SAVE_THE_DATE_QUINCE_ROSADO NO pertenece al máster de invitaciones:
// sus secciones son otras (las que renderiza QuinceRosadoSaveTheDate +
// los flags del modelo SaveTheDate) y el editor de invitaciones nunca
// debe ofrecerle las 15 secciones de invitaciones. Las futuras
// plantillas de Save the Date se cuelgan de este máster, no del otro.
// El orden de esta lista ES el orden por defecto del STD (fallback para
// invitaciones viejas sin ordenSecciones): sobre → música → galería →
// calendario → contador → pre-RSVP, igual que el JSX actual.
// =========================================================================

export type SeccionSaveTheDateId =
  | 'sobre'
  | 'musica'
  | 'galeria'
  | 'calendario'
  | 'contador'
  | 'preRsvp';

export interface SeccionSaveTheDateMeta {
  id: SeccionSaveTheDateId;
  numero: number;
  label: string;
  descripcion: string;
  icono: string;
  defaultEnabled: boolean;
  /** Campo del modelo SaveTheDate (o dato) que controla esta sección. */
  campoModelo?: string;
}

export const SECCIONES_SAVE_THE_DATE: SeccionSaveTheDateMeta[] = [
  {
    id: 'sobre',
    numero: 1,
    label: 'Sobre y Portada',
    descripcion: 'Hero con la foto de portada y el sobre interactivo (foto al abrirlo).',
    icono: 'Sparkles',
    defaultEnabled: true,
    campoModelo: 'mostrarSobre',
  },
  {
    id: 'musica',
    numero: 2,
    label: 'Música',
    descripcion: 'Reproductor con la canción del Save the Date. Sin URL de música no se muestra.',
    icono: 'Music',
    defaultEnabled: true,
    campoModelo: 'musicaUrl',
  },
  {
    id: 'galeria',
    numero: 3,
    label: 'Galería de Fotos',
    descripcion: 'Tira de fotos verticales, 2 a la vez y deslizable si hay más.',
    icono: 'Image',
    defaultEnabled: true,
    campoModelo: 'mostrarGaleria',
  },
  {
    id: 'calendario',
    numero: 4,
    label: 'Calendario',
    descripcion: 'Calendario del mes con el día marcado y botón de agregar al calendario.',
    icono: 'Calendar',
    defaultEnabled: true,
    campoModelo: 'mostrarCalendario',
  },
  {
    id: 'contador',
    numero: 5,
    label: 'Cuenta Regresiva',
    descripcion: 'Cronómetro en vivo hacia la fecha del evento.',
    icono: 'Hourglass',
    defaultEnabled: true,
    campoModelo: 'mostrarContador',
  },
  {
    id: 'preRsvp',
    numero: 6,
    label: 'Pre-Confirmación',
    descripcion: 'Pregunta de pre-confirmación con respuesta por WhatsApp.',
    icono: 'Users',
    defaultEnabled: true,
    campoModelo: 'mostrarPreRsvp',
  },
];

/** Orden por defecto de las secciones STD (el de su JSX actual). */
export const ORDEN_POR_DEFECTO_STD: SeccionSaveTheDateId[] =
  SECCIONES_SAVE_THE_DATE.map((s) => s.id);

/**
 * Secciones que cada plantilla de Save the Date renderiza.
 * QuinceRosadoSaveTheDate es la primera plantilla de este máster.
 */
export const SECCIONES_POR_PLANTILLA_STD: Record<string, SeccionSaveTheDateId[]> = {
  SAVE_THE_DATE_QUINCE_ROSADO: [
    'sobre',
    'musica',
    'galeria',
    'calendario',
    'contador',
    'preRsvp',
  ],
};

export function esEstiloSaveTheDate(estiloPlantilla?: string | null): boolean {
  return estiloPlantilla === 'SAVE_THE_DATE_QUINCE_ROSADO';
}

export function seccionesSoportadasStd(estiloPlantilla?: string | null): SeccionSaveTheDateId[] {
  const todas = SECCIONES_SAVE_THE_DATE.map((s) => s.id);
  if (!estiloPlantilla) return todas;
  return SECCIONES_POR_PLANTILLA_STD[estiloPlantilla] ?? todas;
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
