// Portal de datos del cliente — configuración de preguntas.
//
// PREGUNTAS REALES del Google Form de Click and Love, transcritas de las
// capturas que pasó Abraham el 2026-11-01. La pregunta en inglés es la
// original del form, tal cual; la de español es su traducción.
//
// MEJORAS aplicadas por orden de Abraham (2026-11-01):
// - Las preguntas dobles ("¿quieres X?" + "si sí, escribe X") quedaron en
//   UNA sola: el campo de detalle, vacío = no lo quiere. Aplica a dress
//   code, Thank You, color reservado, canción y ceremonia de iglesia.
// - El detalle de Wish List / Wishing Well es CONDICIONAL: solo aparece
//   si no eligen "No" (ver `mostrarSi`).
// - Agregadas 2 que faltaban en el form: hora del evento y foto principal.
// - Fuera: una pregunta suelta "Option 1" que aparecía en el form y parece
//   un resto de edición.
// - Número de invitados era un dropdown sin opciones visibles en las
//   capturas: quedó como texto libre hasta que Abraham pase los rangos.
// - El estilo del tema del form (dropdown sin opciones visibles) quedó
//   REEMPLAZADO por el selector de plantilla (2026-11-01, orden de Abraham):
//   el cliente elige su plantilla en la primera pantalla, tomada de la base
//   de datos (MasterTemplate, solo catálogo público) y con "Ver demo" por
//   tarjeta. Al guardar, la elección también queda en plantillaDeseada de
//   la orden, para que el equipo la vea en la tarjeta del admin.

export type DatosFieldType =
  | "texto"
  | "texto_largo"
  | "fecha"
  | "telefono"
  | "email"
  | "url"
  | "opcion"
  | "opcion_otro"
  | "plantilla"
  | "foto";

export interface DatosCondicion {
  /** Id del campo del que depende. */
  campo: string;
  /** Mostrar solo si la respuesta es distinta de este valor. */
  distintoDe?: string;
  /** Mostrar solo si la respuesta es exactamente este valor. */
  igualA?: string;
}

export interface DatosField {
  id: string;
  pregunta: string;
  preguntaEn: string;
  tipo: DatosFieldType;
  opciones?: string[];
  ayuda?: string;
  ayudaEn?: string;
  requerido?: boolean;
  /** Si existe, el campo solo se muestra cuando se cumple la condición. */
  mostrarSi?: DatosCondicion;
}

export interface DatosSection {
  id: string;
  titulo: string;
  tituloEn: string;
  subtitulo?: string;
  subtituloEn?: string;
  campos: DatosField[];
}

export const DATOS_SECCIONES: DatosSection[] = [
  {
    id: "plantilla",
    titulo: "Elige tu plantilla",
    tituloEn: "Choose your template",
    campos: [
      {
        id: "plantillaElegida",
        pregunta: "Elige la plantilla que te gusta para tu invitación",
        preguntaEn: "Choose the template you like for your invitation",
        tipo: "plantilla",
        requerido: true,
        ayuda: "Toca Ver demo para ver cada plantilla en vivo antes de elegir.",
        ayudaEn: "Tap View demo to see each template live before choosing.",
      },
    ],
  },
  {
    id: "evento",
    titulo: "Tu evento",
    tituloEn: "Your event",
    subtitulo: "Lo básico para armar tu invitación.",
    subtituloEn: "The basics to build your invitation.",
    campos: [
      {
        id: "nombreFestejada",
        pregunta: "Nombre de la quinceañera",
        preguntaEn: "Name of the Birthday Girl",
        tipo: "texto",
        requerido: true,
      },
      {
        id: "tipoEvento",
        pregunta: "Tipo de evento",
        preguntaEn: "Type of Event",
        tipo: "opcion_otro",
        opciones: ["Quinceañera", "Sweet 16", "Wedding", "Other"],
        ayuda: "Elige de la lista; si es otro tipo, escríbelo.",
        ayudaEn: "Pick from the list; if it is another type, write it in.",
      },
      {
        id: "fechaEvento",
        pregunta: "Fecha de tu evento",
        preguntaEn: "Date of your Event",
        tipo: "fecha",
        requerido: true,
      },
      {
        id: "idiomaInvitacion",
        pregunta: "Idioma de la invitación",
        preguntaEn: "Language for the Invitation",
        tipo: "opcion",
        opciones: ["English", "Spanish", "Both"],
      },
      {
        id: "emailRsvp",
        pregunta: "Email para los avisos del RSVP",
        preguntaEn: "Email for RSVP notifications",
        tipo: "email",
        ayuda: "A este correo te llega un aviso por cada confirmación.",
        ayudaEn: "You will get an email notice for each confirmation at this address.",
      },
      {
        id: "telefonoRsvp",
        pregunta: "Teléfono de contacto para el RSVP",
        preguntaEn: "Contact phone number for RSVP",
        tipo: "telefono",
        ayuda: "El número que verán tus invitados para contactarte por su RSVP.",
        ayudaEn: "The number your guests will see to contact you about their RSVP.",
      },
    ],
  },
  {
    id: "lugar",
    titulo: "Lugar",
    tituloEn: "Venue",
    subtitulo: "Dónde será todo.",
    subtituloEn: "Where everything takes place.",
    campos: [
      {
        id: "nombreSalon",
        pregunta: "Nombre del salón donde será tu evento",
        preguntaEn: "Please provide the Name of the Banquet Hall where your Event will be held",
        tipo: "texto",
        requerido: true,
      },
      {
        id: "direccionSalon",
        pregunta: "Dirección completa del salón o lugar",
        preguntaEn: "Please provide the full address of the Banquet Hall or Venue",
        tipo: "texto",
      },
      {
        id: "nombreIglesia",
        pregunta: "Nombre de la iglesia",
        preguntaEn: "Church name",
        tipo: "texto",
        ayuda: "Si tu evento no tiene ceremonia de iglesia, deja estos tres campos en blanco.",
        ayudaEn: "If your event has no church ceremony, leave these three fields blank.",
      },
      {
        id: "direccionIglesia",
        pregunta: "Dirección de la iglesia",
        preguntaEn: "Church address",
        tipo: "texto",
      },
      {
        id: "horaIglesia",
        pregunta: "Hora de la ceremonia de iglesia",
        preguntaEn: "Church ceremony time",
        tipo: "texto",
      },
      {
        id: "fechaLimiteRsvp",
        pregunta: "Fecha límite para que tus invitados confirmen",
        preguntaEn: "For your Guests: Please submit your response no later than...",
        tipo: "fecha",
      },
    ],
  },
  {
    id: "personas",
    titulo: "Personas",
    tituloEn: "People",
    subtitulo: "Quiénes aparecen en la invitación.",
    subtituloEn: "Who appears on the invitation.",
    campos: [
      {
        id: "nombresPadres",
        pregunta: "Nombres completos de los papás de la festejada",
        preguntaEn: "Please provide the full names of the Parents of the honoree",
        tipo: "texto_largo",
        ayuda: "Corte de honor: Solo si tu plantilla incluye esta sección.",
        ayudaEn: "Court of honor: Only if your template includes this section.",
      },
      {
        id: "nombresPadrinos",
        pregunta: "Nombres de los padrinos",
        preguntaEn: "Please list the names of the Godparents (Padrinos)",
        tipo: "texto_largo",
        ayuda: "Corte de honor: Solo si tu plantilla incluye esta sección.",
        ayudaEn: "Court of honor: Only if your template includes this section.",
      },
      {
        id: "chambelan",
        pregunta: "Nombre del chambelán de honor",
        preguntaEn: "Name of the chambelan of honor",
        tipo: "texto",
        ayuda:
          "El chambelán va aparte para que la plantilla lo muestre con su título. Corte de honor: solo si tu plantilla incluye esta sección.",
        ayudaEn:
          "The chambelan goes separately so the template can show it with his title. Court of honor: only if your template includes this section.",
      },
      {
        id: "damasCorte",
        pregunta: "Damas, chambelanes y mini quinceañera (una por línea)",
        preguntaEn:
          "Damas, chambelanes and mini quinceañera (one per line)",
        tipo: "texto_largo",
        ayuda:
          "Corte de honor: solo si tu plantilla incluye esta sección.",
        ayudaEn:
          "Court of honor: only if your template includes this section.",
      },
      {
        id: "colorReservado",
        pregunta: "¿Qué color está reservado para la quinceañera? (deja en blanco si ninguno)",
        preguntaEn:
          "Which color is reserved for the quinceañera? (leave blank if none)",
        tipo: "texto",
        ayuda: "Si ningún color está reservado, déjalo en blanco.",
        ayudaEn: "If no color is reserved, leave it blank.",
      },
    ],
  },
  {
    id: "programa",
    titulo: "Programa y estilo",
    tituloEn: "Program & style",
    subtitulo: "Cómo será la fiesta y cómo se verá la invitación.",
    subtituloEn: "How the party goes and how the invitation looks.",
    campos: [
      {
        id: "horaEvento",
        pregunta: "¿A qué hora empieza la celebración?",
        preguntaEn: "What time does the celebration start?",
        tipo: "texto",
        ayuda: "La hora principal que se muestra en tu invitación. Los demás horarios (iglesia, fotos, recepción) van en el programa de abajo.",
        ayudaEn: "The main time shown on your invitation. The other times (church, photos, reception) go in the program below.",
      },
      {
        id: "programaEvento",
        pregunta: "Detalles del programa (llegada, cena, baile, pastel...)",
        preguntaEn:
          "Please provide the details for your event program (e.g., timeline of events like arrival, dinner, dance, cake cutting)",
        tipo: "texto_largo",
      },
      {
        id: "codigoVestimenta",
        pregunta: "Código de vestimenta (Formal, Black Tie, Theme Party, casual... o en blanco si ninguno)",
        preguntaEn:
          "Dress code for your event (e.g., Formal, Black Tie, Theme Party, casual — leave blank if none)",
        tipo: "texto",
        ayuda: "Si no hay código de vestimenta, déjalo en blanco.",
        ayudaEn: "If there is no dress code, leave it blank.",
      },
      {
        id: "cancion",
        pregunta: "Canción para tu invitación (nombre y link de YouTube; en blanco si ninguna)",
        preguntaEn:
          "Would you like to add a Song? If yes please write the name of the song and provide the YouTube link",
        tipo: "texto",
        ayuda: "El link de YouTube fija la versión exacta: hay muchas versiones de la misma canción. En blanco = sin canción.",
        ayudaEn: "The YouTube link pins the exact version: many versions of the same song exist. Blank = no song.",
      },
      {
        id: "numInvitados",
        pregunta: "Número aproximado de invitados",
        preguntaEn: "Please select the estimated number of guests for your event",
        tipo: "texto",
        ayuda: "Un número aproximado está bien.",
        ayudaEn: "An approximate number is fine.",
      },
      {
        id: "numPases",
        pregunta: "Pases que cada invitado podrá reservar",
        preguntaEn:
          "Please select the estimated number of passes that your guests can reserve for your event",
        tipo: "opcion",
        opciones: ["2", "4", "6", "10", "Unlimited"],
      },
    ],
  },
  {
    id: "regalos",
    titulo: "Mesa de regalos",
    tituloEn: "Gift table",
    subtitulo: "Cómo quieres recibir los regalos.",
    subtituloEn: "How you want to receive gifts.",
    campos: [
      {
        id: "tipoRegalos",
        pregunta: "¿Quieres incluir Wish List o Wishing Well en tu evento?",
        preguntaEn: "Would you like to include a Wish List or Wishing Well for your event?",
        tipo: "opcion",
        ayuda: "Solo si tu plantilla incluye mesa de regalos.",
        ayudaEn: "Only if your template includes a gift table section.",
        opciones: [
          "Yes, please include a Wish List link",
          "Yes, please include a Wishing Well (monetary gift) information",
          "Both, please include both options",
          "No, I do not wish to include these",
        ],
      },
      {
        id: "detallesRegalos",
        pregunta: "Detalles o link de tu Wish List / Wishing Well",
        preguntaEn:
          "If you selected to include a Wish List or Wishing Well, please provide the details or link you would like to be displayed",
        tipo: "texto_largo",
        mostrarSi: { campo: "tipoRegalos", distintoDe: "No, I do not wish to include these" },
      },
    ],
  },
  {
    id: "mensajes",
    titulo: "Mensajes",
    tituloEn: "Messages",
    subtitulo: "Las palabras que saldrán en tu invitación.",
    subtituloEn: "The words that will appear on your invitation.",
    campos: [
      {
        id: "dedicatoria",
        pregunta: "Dedicatoria o mensaje especial para tus invitados",
        preguntaEn: "Dedicatory or Special Message for your Guests",
        tipo: "texto_largo",
        ayuda: "Solo si tu plantilla incluye dedicatoria.",
        ayudaEn: "Only if your template includes a dedication section.",
      },
      {
        id: "mensajeAgradecimiento",
        pregunta: "Nota de agradecimiento o mensaje final para tus invitados (en blanco si no quieres)",
        preguntaEn:
          "Thank You note or final goodbye message for your guests (leave blank if you do not want one)",
        tipo: "texto_largo",
      },
      {
        id: "detalleEspecial",
        pregunta: "¿Quieres incluir algún detalle especial extra?",
        preguntaEn: "Do you want to include any Special Extra Detail?",
        tipo: "texto_largo",
      },
    ],
  },
  {
    id: "fotos",
    titulo: "Fotos",
    tituloEn: "Photos",
    subtitulo: "Las tres fotos que usan las plantillas.",
    subtituloEn: "The three photos the templates use.",
    campos: [
      {
        id: "fotoBebe",
        pregunta: "Foto de bebé",
        preguntaEn: "Baby photo",
        tipo: "foto",
        ayuda: "Las plantillas de hoy tienen un solo espacio de infancia (foto de niña); la de bebé se guarda para que el equipo la use en la historia o la portada según la plantilla.",
        ayudaEn: "Today's templates have a single childhood slot (girl photo); the baby photo is saved for the team to use in the story or cover depending on the template.",
      },
      {
        id: "fotoNina",
        pregunta: "Foto de niña",
        preguntaEn: "Childhood photo",
        tipo: "foto",
        ayuda: "Va a la foto de niña de la invitación.",
        ayudaEn: "Goes to the invitation's childhood photo slot.",
      },
      {
        id: "fotoActual",
        pregunta: "Foto actual",
        preguntaEn: "Current photo",
        tipo: "foto",
        ayuda: "Va a la foto actual y, si falta, también a la portada.",
        ayudaEn: "Goes to the current photo slot and, if missing, to the cover too.",
      },
    ],
  },
];

export interface DatosCampoPlano extends DatosField {
  seccionId: string;
  seccionTitulo: string;
  seccionTituloEn: string;
}

/** Todas las preguntas en orden, con su sección. */
export function datosCamposPlanos(): DatosCampoPlano[] {
  const out: DatosCampoPlano[] = [];
  for (const sec of DATOS_SECCIONES) {
    for (const campo of sec.campos) {
      out.push({
        ...campo,
        seccionId: sec.id,
        seccionTitulo: sec.titulo,
        seccionTituloEn: sec.tituloEn,
      });
    }
  }
  return out;
}

export type DatosRespuestas = Record<string, string>;

/** ¿Se muestra este campo con las respuestas actuales? (condicionales). */
export function campoVisible(
  campo: DatosField,
  respuestas: DatosRespuestas | null | undefined
): boolean {
  if (!campo.mostrarSi) return true;
  const v = (respuestas || {})[campo.mostrarSi.campo] || "";
  if (campo.mostrarSi.distintoDe !== undefined) return v !== campo.mostrarSi.distintoDe;
  if (campo.mostrarSi.igualA !== undefined) return v === campo.mostrarSi.igualA;
  return true;
}

/** Solo las preguntas visibles con las respuestas actuales (las condicionales ocultas no cuentan). */
export function camposVisibles(
  respuestas: DatosRespuestas | null | undefined
): DatosCampoPlano[] {
  return datosCamposPlanos().filter((c) => campoVisible(c, respuestas));
}

/**
 * Progreso real: campos visibles con respuesta (texto no vacío) sobre los
 * campos visibles totales. Un campo condicional oculto no baja el progreso.
 */
export function calcularProgresoDatos(
  respuestas: DatosRespuestas | null | undefined
): { contestadas: number; total: number; porcentaje: number } {
  const campos = camposVisibles(respuestas);
  const total = campos.length;
  const contestadas = campos.filter((c) => {
    const v = respuestas?.[c.id];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
  return {
    contestadas,
    total,
    porcentaje: total === 0 ? 0 : Math.round((contestadas / total) * 100),
  };
}

/** Solo se guardan ids que existen en la configuración: un cliente no puede inventar campos. */
export function filtrarRespuestasValidas(
  input: Record<string, unknown> | null | undefined
): DatosRespuestas {
  const validos = new Set(datosCamposPlanos().map((c) => c.id));
  const out: DatosRespuestas = {};
  if (!input) return out;
  for (const [k, v] of Object.entries(input)) {
    if (validos.has(k) && typeof v === "string") out[k] = v.slice(0, 4000);
  }
  return out;
}
