export interface MasterTemplateItem {
  id: string;
  slug: string;
  nombre: string;
  categoria: "QUINCEANERA" | "BODA" | "CUMPLEANOS";
  estiloPlantilla: string;
  titulo: string;
  subtitulo: string;
  frasePersonalizada: string;
  tipoLetra: string;
  musicaUrl: string;
  musicaTitulo: string;
  colorSobre: string;
  colorSello: string;
  fotoPortadaUrl: string;
  fotoInfanciaUrl?: string;
  fotoActualUrl?: string;
  fotoCierreUrl?: string;
  videoUrl?: string;
  
  // Fecha y Medallón
  fechaTextoPersonalizada?: string;
  fechaPlacaMes?: string;
  fechaPlacaHora?: string;
  fechaPlacaLugar?: string;
  countdownEncabezado?: string;

  // Lugares
  recepcionNombre?: string;
  recepcionDireccion?: string;
  recepcionMapUrl?: string;
  ceremoniaNombre?: string;
  ceremoniaDireccion?: string;
  ceremoniaMapUrl?: string;

  // Protocolo y Código de Vestimenta
  dressCodeTitulo?: string;
  dressCodeEtiqueta?: string;
  dressCodeNota?: string;
  dressCodeColoresReservados?: string;

  // Regalos & RSVP
  regalosMensaje?: string;
  regalosZelle?: string;
  regalosCashApp?: string;
  telefonoWhatsappRsvp?: string;
  rsvpFechaLimite?: string;
  // Pases que un invitado puede confirmar por RSVP. CONVENCIÓN: 0 = SIN LÍMITE
  // (el anfitrión lo elige al crear el evento); en ese caso la API solo aplica
  // un tope de sanidad de 200 por confirmación. Nunca usar `|| N` sobre este
  // campo: convertiría el 0 (sin límite) de vuelta en un límite.
  maxPasesPorInvitado?: number;

  // Cierre y Extras
  mensajeDespedida?: string;
  autorBendicion?: string;
  textoDisco?: string;

  // Protocolos JSON
  corteHonorJson?: any;
  itinerarioJson?: any;
  configExtra?: any;

  activo: boolean;
  orden: number;
}

export const INITIAL_MASTER_TEMPLATES: MasterTemplateItem[] = [
  {
    id: "tpl-butterfly",
    slug: "mariposas-xv",
    nombre: "Jardín de Mariposas Celestes (XV Años)",
    categoria: "QUINCEANERA",
    estiloPlantilla: "BLUE_BUTTERFLY",
    titulo: "Valeria Morales",
    subtitulo: "My Quinceañera",
    frasePersonalizada:
      "Doy gracias a Dios por concederme la dicha de celebrar mis quince primaveras, y a mis padres por guiar cada uno de mis pasos con amor incondicional.",
    tipoLetra: "Cinzel",
    musicaUrl:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
    musicaTitulo: "Vals Romántico en Piano",
    colorSobre: "#2C405A",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-butterfly/foto-columpio-portada.webp",
    fotoInfanciaUrl: "/assets/template-butterfly/foto-sesion-1.webp",
    fotoActualUrl: "/assets/template-butterfly/foto-sesion-2.webp",
    fotoCierreUrl: "/assets/template-butterfly/foto-gala-vestido.webp",
    activo: true,
    orden: 1,
  },
  {
    id: "tpl-rose",
    slug: "isabella-xv",
    nombre: "Blush Rose Filmstrip (XV Años)",
    categoria: "QUINCEANERA",
    estiloPlantilla: "ELEGANT_ROSE",
    titulo: "Isabella Cordero",
    subtitulo: "BLG 2UPT Elegant Rose Themed Quinceanera",
    frasePersonalizada: "Celebrating Fifteen Amazing Years — The Best Is Yet to Come.",
    tipoLetra: "Playfair Display",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    musicaTitulo: "Photograph - Ed Sheeran",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
    fotoInfanciaUrl: "/assets/template-rose/722d78548334333072ad7200e4f8233e.jpg",
    fotoActualUrl: "/assets/template-rose/5f24871f73b9424764387ef47bb5723e.png",
    fotoCierreUrl: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
    activo: true,
    orden: 2,
  },
  {
    id: "tpl-chateau",
    slug: "emma-and-lucas",
    nombre: "Castillo de Cuento de Hadas (Boda)",
    categoria: "BODA",
    estiloPlantilla: "FAIRYTALE_CHATEAU",
    titulo: "Emma & Lucas",
    subtitulo: "Together with our families, we invite you to celebrate our wedding",
    frasePersonalizada:
      "Two lives, two hearts, joined together in friendship, united forever in love.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicaTitulo: "A Thousand Years - Christina Perri",
    colorSobre: "#1E2B24",
    colorSello: "#D4AF37",
    fotoPortadaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    fotoInfanciaUrl: "/assets/template-chateau/oheka-castle.png",
    fotoActualUrl: "/assets/template-chateau/reception-hall.jpg",
    fotoCierreUrl: "/assets/template-chateau/castle-gardens.jpg",
    activo: true,
    orden: 3,
  },
  {
    id: "tpl-elsy",
    slug: "elsy-xv",
    nombre: "Princesa Rosa Gala Real (XV Años)",
    categoria: "QUINCEANERA",
    estiloPlantilla: "PRINCESA_ROSA",
    titulo: "Mis XV Años Elsy",
    subtitulo: "Una noche mágica bajo las estrellas",
    frasePersonalizada:
      "Hoy dejo atrás mis muñecas y sueños infantiles para comenzar a construir mi destino.",
    tipoLetra: "Great Vibes",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    musicaTitulo: "Vals de las Flores - Tchaikovsky",
    colorSobre: "#F4D2DE",
    colorSello: "#C5A059",
    fotoPortadaUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    activo: true,
    orden: 4,
  },
  {
    id: "tpl-coraline",
    slug: "coraline-mystical",
    nombre: "El Otro Mundo Místico (XV Años Temáticos)",
    categoria: "QUINCEANERA",
    estiloPlantilla: "CORALINE_MYSTICAL",
    titulo: "Coraline Jones",
    subtitulo: "A Mystical Fifteenth Celebration",
    frasePersonalizada: "Ten cuidado con lo que deseas... Una noche inolvidable te espera.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    musicaTitulo: "Coraline Exploration Theme",
    colorSobre: "#161329",
    colorSello: "#8E54E9",
    fotoPortadaUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    activo: true,
    orden: 5,
  },
];
