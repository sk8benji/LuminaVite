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
    label: 'Portada y Encabezado Principal',
    descripcion: 'Arco con nubes, "CON Amor LE INVITAMOS", foto principal de portada y nombre de la festejada.',
    icono: 'Sparkles',
    defaultEnabled: true,
  },
  {
    id: 'medallonFecha',
    numero: 2,
    label: 'Medallón de Fecha y Hora',
    descripcion: 'Medallón circular "15 Años", día, mes, año y hora con formato formal.',
    icono: 'Calendar',
    defaultEnabled: true,
    legacyColumn: 'mostrarFechaPlacaHora',
  },
  {
    id: 'dedicatoria',
    numero: 3,
    label: 'Dedicatoria ("De Niña a Señorita")',
    descripcion: 'Mensaje emotivo bilingüe y las 2 fotos polaroids (Infancia y Quinceañera).',
    icono: 'Heart',
    defaultEnabled: true,
    legacyColumn: 'mostrarFrasePersonalizada',
  },
  {
    id: 'rsvp',
    numero: 4,
    label: 'Confirmación de Asistencia (RSVP)',
    descripcion: 'Formulario dinámico con búsqueda de invitados por nombre, pases asignados y confirmación telefónica.',
    icono: 'Users',
    defaultEnabled: true,
  },
  {
    id: 'fotoZapatos1',
    numero: 5,
    label: 'Foto Zapatillas de Cristal / Ceremonia',
    descripcion: 'Fotografía vertical de transición hacia los templos y recepciones.',
    icono: 'Image',
    defaultEnabled: true,
  },
  {
    id: 'ubicaciones',
    numero: 6,
    label: 'Ubicaciones (Ceremonia y Recepción)',
    descripcion: 'Detalles de la iglesia y salón de fiesta con botones directos hacia Google Maps.',
    icono: 'MapPin',
    defaultEnabled: true,
  },
  {
    id: 'dressCode',
    numero: 7,
    label: 'Código de Vestimenta (Dress Code)',
    descripcion: 'Etiqueta formal o de gala y especificación de colores reservados para la festejada.',
    icono: 'Sliders',
    defaultEnabled: true,
    legacyColumn: 'mostrarDressCode',
  },
  {
    id: 'mesaRegalos',
    numero: 8,
    label: 'Mesa de Regalos / Lluvia de Sobres',
    descripcion: 'Aviso de cofre en recepción, enlaces de wishlist y cuentas Zelle, Venmo, PayPal.',
    icono: 'Gift',
    defaultEnabled: true,
    legacyColumn: 'mostrarMesaRegalos',
  },
  {
    id: 'itinerario',
    numero: 9,
    label: 'El Plan de la Fiesta (Itinerario)',
    descripcion: 'Línea de tiempo vertical con rosas decorativas e hitos de la fiesta (ES / EN).',
    icono: 'Clock',
    defaultEnabled: true,
  },
  {
    id: 'fotoZapatos2',
    numero: 10,
    label: 'Foto en Cojín & Aviso "Para Nuestros Niños"',
    descripcion: 'Fotografía en cojín, mensaje de despedida y pautas para pequeños invitados.',
    icono: 'Image',
    defaultEnabled: true,
  },
  {
    id: 'corteHonor',
    numero: 11,
    label: 'La Corte de Honor & Padres / Padrinos',
    descripcion: 'Quinceañera, Chambelanes, Damiselas, Damitas de Hojitas, Padres, Padrinos y Agradecimiento.',
    icono: 'Crown',
    defaultEnabled: true,
  },
  {
    id: 'cuentaRegresiva',
    numero: 12,
    label: 'Cuenta Regresiva & Calendario',
    descripcion: 'Cronómetro en vivo hacia el evento y calendario mensual con lazo de seda en el día de la fiesta.',
    icono: 'Hourglass',
    defaultEnabled: true,
  },
  {
    id: 'videoDespedida',
    numero: 13,
    label: 'Video Embed & Retrato de Despedida',
    descripcion: 'Reproductor de video (YouTube o MP4) y foto final arqueada de despedida.',
    icono: 'Video',
    defaultEnabled: true,
  },
  {
    id: 'musica',
    numero: 14,
    label: 'Música de Fondo Ambiental',
    descripcion: 'Reproductor de audio flotante y música instrumental de fondo.',
    icono: 'Music',
    defaultEnabled: true,
  },
];

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
