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
  /** Reemplazos de arte por pieza (solo Beauty Quince por ahora): clave -> URL S3. Sin clave, se usa el default del mapa de arte. */
  arteBeautyQuince?: Record<string, string>;
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
    nombre: "Celestial Butterfly",
    categoria: "QUINCEANERA",
    estiloPlantilla: "BLUE_BUTTERFLY",
    titulo: "Valeria Sofía",
    subtitulo: "My Quinceañera",
    frasePersonalizada:
      "Doy gracias a Dios por cada instante de mi vida y a mis padres por su amor incondicional en esta noche tan soñada.",
    tipoLetra: "Cinzel",
    musicaUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
    nombre: "Vintage Quinceanera",
    categoria: "QUINCEANERA",
    estiloPlantilla: "ELEGANT_ROSE",
    titulo: "Isabella",
    subtitulo: "My Sweet Fifteen",
    frasePersonalizada: "Mr & Mrs Rodríguez warmly invite you to celebrate the Quinceañera of their daughter Isabella.",
    tipoLetra: "Playfair Display",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicaTitulo: "Photograph - Ed Sheeran",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
    fotoInfanciaUrl: "/assets/template-rose/722d78548334333072ad7200e4f8233e.webp",
    fotoActualUrl: "/assets/template-rose/5f24871f73b9424764387ef47bb5723e.webp",
    fotoCierreUrl: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
    activo: true,
    orden: 2,
  },
  {
    id: "tpl-chateau",
    slug: "emma-and-lucas",
    nombre: "Fairytale Castle",
    categoria: "BODA",
    estiloPlantilla: "FAIRYTALE_CHATEAU",
    titulo: "Emma & Lucas",
    subtitulo: "Nuestra Boda de Ensueño",
    frasePersonalizada:
      "Dos almas con un solo pensamiento, dos corazones que laten como uno solo.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    musicaTitulo: "A Thousand Years - Christina Perri",
    colorSobre: "#1E2B24",
    colorSello: "#D4AF37",
    fotoPortadaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    fotoInfanciaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
    fotoActualUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
    fotoCierreUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
    activo: true,
    orden: 3,
  },
  {
    id: "tpl-elsy",
    slug: "elsy-xv",
    nombre: "Royal Pink",
    categoria: "QUINCEANERA",
    estiloPlantilla: "PRINCESA_ROSA",
    titulo: "Sofía",
    subtitulo: "An Unforgettable Celebration Awaits",
    frasePersonalizada:
      "Hoy doy el hermoso paso de niña a señorita, rodeada de las personas que más amo en el mundo.",
    tipoLetra: "Great Vibes",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicaTitulo: "Vals de las Flores - Tchaikovsky",
    colorSobre: "#F4D2DE",
    colorSello: "#C5A059",
    fotoPortadaUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    fotoInfanciaUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    fotoActualUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    fotoCierreUrl:
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
    subtitulo: "Welcome to The Other World",
    frasePersonalizada: "Ten cuidado con lo que deseas... estás cordialmente invitado a cruzar la puerta secreta.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    musicaTitulo: "Coraline Exploration Theme",
    colorSobre: "#161329",
    colorSello: "#8E54E9",
    fotoPortadaUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    activo: true,
    orden: 5,
  },
  {
    id: "tpl-quince-rosado",
    slug: "quince-rosado",
    nombre: "Sweet Fifteen in Pink",
    categoria: "QUINCEANERA",
    estiloPlantilla: "QUINCE_ROSADO",
    titulo: "Magdalena",
    subtitulo: "Mis Quince Años",
    frasePersonalizada:
      "Con la bendición de Dios y el amor de mi familia, tengo el honor de invitarte a celebrar este día tan esperado.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicaTitulo: "Vals Romántico en Piano",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-quince-rosado/da616fa36a10f18a133b2dc0383a07d0.webp",
    fotoInfanciaUrl: "/assets/template-quince-rosado/083dc0c793669d4a4d4a782851e93f65.webp",
    fotoActualUrl: "/assets/template-quince-rosado/c0ec302539da1389b4c6b7d0b122ddd7.webp",
    fotoCierreUrl: "/assets/template-quince-rosado/4046b1a7e943f6186c4bd79419897578.webp",
    activo: true,
    orden: 6,
  },
  {
    id: "tpl-blush",
    slug: "blush-princess-xv",
    nombre: "Blush Princess",
    categoria: "QUINCEANERA",
    estiloPlantilla: "BLUSH_PRINCESS",
    titulo: "Isabella Sofia",
    subtitulo: "My Quinceañera",
    frasePersonalizada:
      "Con la bendición de Dios y el amor de mi familia, celebro mis quince años rodeada de quienes más quiero.",
    tipoLetra: "Cinzel",
    musicaUrl:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
    musicaTitulo: "Tiempo de Vals — Chayanne",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-blush/foto-1.webp",
    fotoInfanciaUrl: "/assets/template-blush/foto-nina.webp",
    fotoActualUrl: "/assets/template-blush/foto-2.webp",
    fotoCierreUrl: "/assets/template-blush/foto-3.webp",
    activo: true,
    orden: 7,
  },
  {
    id: "tpl-era-pink",
    slug: "era-pink-xv",
    nombre: "Quince Pink",
    categoria: "QUINCEANERA",
    estiloPlantilla: "QUINCE_ERA_PINK",
    titulo: "Issabella Gonzales",
    subtitulo: "My Quinceañera",
    frasePersonalizada: "I'm excited to share this special day with you.",
    tipoLetra: "Cinzel",
    musicaUrl:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
    musicaTitulo: "Never Grow Up (Taylor's Version) — Taylor Swift",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-era-pink/foto-sentada.webp",
    fotoInfanciaUrl: "/assets/template-era-pink/foto-retrato.webp",
    fotoActualUrl: "/assets/template-era-pink/foto-espalda.webp",
    fotoCierreUrl: "/assets/template-era-pink/foto-sentada.webp",
    activo: true,
    orden: 8,
  },
  {
    id: "tpl-miss15",
    slug: "miss-15-xv",
    nombre: "Mis 15 Cream & Gold",
    categoria: "QUINCEANERA",
    estiloPlantilla: "MISS_15",
    titulo: "Isabella Torres",
    subtitulo: "Mis 15 Años",
    frasePersonalizada: "I can't wait to celebrate with you!",
    tipoLetra: "Cinzel",
    musicaUrl:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
    musicaTitulo: "Slow Down, Little Heart — Linhy",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-miss15/foto-columpio.webp",
    fotoInfanciaUrl: "/assets/template-miss15/foto-damas.webp",
    fotoActualUrl: "/assets/template-miss15/foto-columpio-2.webp",
    fotoCierreUrl: "/assets/template-miss15/foto-retrato.webp",
    activo: true,
    orden: 9,
  },
  {
    id: "tpl-baby-blue",
    slug: "baby-blue-xv",
    nombre: "Garden Baby Blue",
    categoria: "QUINCEANERA",
    estiloPlantilla: "BABY_BLUE",
    titulo: "Elina Miguel",
    subtitulo: "My Quinceañera",
    frasePersonalizada: "You're invited!",
    tipoLetra: "Cinzel",
    musicaUrl:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
    musicaTitulo: "",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-baby-blue/foto-gazebo.webp",
    fotoInfanciaUrl: "/assets/template-baby-blue/foto-bebe.webp",
    fotoActualUrl: "/assets/template-baby-blue/foto-camara.webp",
    fotoCierreUrl: "/assets/template-baby-blue/foto-espalda.webp",
    activo: true,
    orden: 10,
  },
  {
    id: "tpl-beauty-quince",
    slug: "beauty-quince-xv",
    nombre: "Beauty Quince (XV Años)",
    categoria: "QUINCEANERA",
    estiloPlantilla: "BEAUTY_QUINCE",
    titulo: "Jasmine",
    subtitulo: "My Quinceañera",
    frasePersonalizada:
      "Fifteen candles softly glow, marking how much love you know. A touch of a woman, a heart still so sweet, the past and the future now dance at your feet.",
    tipoLetra: "Cinzel",
    musicaUrl:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
    musicaTitulo: "Vals Romántico en Piano",
    colorSobre: "#0A1E4A",
    colorSello: "#C5A059",
    fotoPortadaUrl: "/assets/template-beauty-quince/foto-carroza-atardecer.webp",
    fotoInfanciaUrl: "/assets/template-beauty-quince/foto-vestido-maniqui.webp",
    fotoActualUrl: "/assets/template-beauty-quince/foto-maquillaje.webp",
    fotoCierreUrl: "/assets/template-beauty-quince/arco-rosas-castillo.webp",
    activo: true,
    orden: 15,
  },
  {
    id: "tpl-clasica",
    slug: "sofia-y-alejandro",
    nombre: "Our Wedding",
    categoria: "BODA",
    estiloPlantilla: "CLASICA_IMPERIAL",
    titulo: "Sofía & Alejandro",
    subtitulo: "Nuestra Boda",
    frasePersonalizada: "Dos corazones, una promesa para siempre.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    musicaTitulo: "A Thousand Years - Christina Perri",
    colorSobre: "#1E2B24",
    colorSello: "#D4AF37",
    fotoPortadaUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    fotoInfanciaUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
    fotoActualUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
    fotoCierreUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
    activo: true,
    orden: 11,
  },
  {
    id: "tpl-esmeralda",
    slug: "esmeralda-royal",
    nombre: "Esmeralda Royal (Gala)",
    categoria: "QUINCEANERA",
    estiloPlantilla: "ESMERALDA_ROYAL",
    titulo: "Renata Villarreal",
    subtitulo: "Gala Esmeralda & Oro",
    frasePersonalizada: "Una noche mágica bajo el resplandor esmeralda y el oro real.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicaTitulo: "Vals Romántico en Piano",
    colorSobre: "#0F3D2E",
    colorSello: "#D4AF37",
    fotoPortadaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    fotoInfanciaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    fotoActualUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    fotoCierreUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    activo: true,
    orden: 12,
  },
  {
    id: "tpl-jardin",
    slug: "jardin-botanica",
    nombre: "Jardín Botánica (Boda)",
    categoria: "BODA",
    estiloPlantilla: "JARDIN_BOTANICA",
    titulo: "Camila & Mateo",
    subtitulo: "Amor en el Jardín",
    frasePersonalizada: "Donde florece nuestro amor eterno, entre hojas de olivo y brisa de otoño.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    musicaTitulo: "Vals Romántico en Piano",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
    fotoInfanciaUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
    fotoActualUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
    fotoCierreUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
    activo: true,
    orden: 13,
  },
  {
    id: "tpl-minimalista",
    slug: "minimalista-editorial",
    nombre: "Minimalista Editorial (Boda)",
    categoria: "BODA",
    estiloPlantilla: "MINIMALISTA_EDITORIAL",
    titulo: "Victoria & David",
    subtitulo: "The Modern Wedding",
    frasePersonalizada: "Simplicity is the keynote of all true elegance.",
    tipoLetra: "Cinzel",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    musicaTitulo: "Vals Romántico en Piano",
    colorSobre: "#E8D5C4",
    colorSello: "#C5A059",
    fotoPortadaUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    fotoInfanciaUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    fotoActualUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    fotoCierreUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    activo: true,
    orden: 14,
  },
];
