import { InvitationData } from "@/components/invitation/InvitationMobileView";

// =========================================================================
// 1. BLUE BUTTERFLY GARDEN (Valeria Morales - Quinceañera & Gala)
// =========================================================================
export const DEMO_BUTTERFLY: InvitationData = {
  id: "demo-butterfly",
  slug: "mariposas-xv",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "BLUE_BUTTERFLY",
  titulo: "Valeria Morales",
  subtitulo: "My Quinceañera",
  frasePersonalizada:
    "“Doy gracias a Dios por concederme la dicha de celebrar mis quince primaveras, y a mis padres por guiar cada uno de mis pasos con amor incondicional.”",
  autorBendicion: "Con amor, tu familia",
  textoDisco: "Click to Play Music",
  fechaEvento: new Date("2026-10-24T15:00:00Z"),
  fechaTextoPersonalizada: "SATURDAY, OCTOBER 24, 2026 AT 3 PM",
  fotoPortadaUrl: "/assets/template-butterfly/foto-columpio-portada.png",
  fotoInfanciaUrl: "/assets/template-butterfly/foto-sesion-1.jpg",
  fotoActualUrl: "/assets/template-butterfly/foto-sesion-2.jpg",
  fotoCierreUrl: "/assets/template-butterfly/foto-gala-vestido.jpg",
  musicaUrl:
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
  telefonoWhatsappRsvp: "18181234567",
  fechaLimiteRsvp: "20 de Octubre",
  maxPasesPorInvitado: 3,
  recepcionNombre: "QUINCE PALACE",
  recepcionDireccion: "123 Quince St, City, ST 90210",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Formal & Elegant",
  dressCodeNota:
    "Agradecemos reservar los tonos azul celeste y blanco exclusivamente para la quinceañera.",
  coloresReservados: ["#7FA2C6", "#FFFFFF"],
  fechaPlacaMes: "OCTUBRE",
  fechaPlacaHora: "A LAS 3:00 PM",
  fechaPlacaLugar: "QUINCE PALACE",
  countdownEncabezado: "Faltan sólo...",
  dressCodeEtiqueta: "Formal & Rigurosa Etiqueta",
  dressCodeColoresReservados: "Tonos azul celeste y blanco reservados exclusivamente para la quinceañera",
  regalosMensaje: "Tu presencia es nuestro mayor regalo. Si deseas tener un detalle con la quinceañera, dispondremos de un cofre en la recepción.",
  regalosZelle: "valeria.xv@example.com",
  regalosCashApp: "$ValeriaXV",
  rsvpFechaLimite: "Favor de confirmar antes del 20 de Octubre",
  rsvpDiasAntes: 15,
  mensajeDespedida: "See You Soon! With love and gratitude for being part of this fairytale day.",
  itinerarioJson: [
    { hora: "04:30 PM", titulo: "Llegada & Recepción", tipoIcono: "car" },
    { hora: "05:30 PM", titulo: "Misa Solemne de Acción de Gracias", tipoIcono: "church" },
    { hora: "07:00 PM", titulo: "Cena & Brindis de Honor", tipoIcono: "wine" },
    { hora: "08:30 PM", titulo: "Vals de Gala & Pista de Baile", tipoIcono: "crown" },
  ],
  corteHonorJson: {
    chambelan: "Sebastián Ramos",
    damas: ["Camila", "Valentina", "Sofía", "Isabella"],
    parents: "Carlos & Elena Morales",
    padrinos: ["Roberto & Patricia Méndez"],
  },
};

// =========================================================================
// 2. BLUSH ROSE FILMSTRIP (Isabella Cordero - Canva T1)
// =========================================================================
export const DEMO_ISABELLA: InvitationData = {
  id: "demo-isabella",
  slug: "isabella-xv",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "ELEGANT_ROSE",
  titulo: "Isabella Cordero",
  subtitulo: "BLG 2UPT Elegant Rose Themed Quinceanera",
  frasePersonalizada: "Celebrating Fifteen Amazing Years—The Best Is Yet to Come.",
  fechaEvento: new Date("2026-07-18T16:00:00Z"),
  fechaTextoPersonalizada: "SUNDAY, JULY 18 • 4:00 PM",
  fotoPortadaUrl: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
  fotoInfanciaUrl: "/assets/template-rose/722d78548334333072ad7200e4f8233e.jpg",
  fotoActualUrl: "/assets/template-rose/5f24871f73b9424764387ef47bb5723e.png",
  fotoCierreUrl: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  musicaTitulo: "Photograph - Ed Sheeran",
  videoUrl: "https://www.youtube.com/embed/0ZVsGVE1qCg",
  telefonoWhatsappRsvp: "18181234567",
  fechaLimiteRsvp: "June 20th",
  maxPasesPorInvitado: 4,
  ceremoniaNombre: "St. Mary's Church",
  ceremoniaDireccion: "Any City, Any Street, AZ 12345",
  ceremoniaMapUrl: "https://maps.google.com/?q=St.+Mary's+Church",
  recepcionNombre: "Grand Ballroom",
  recepcionDireccion: "Any City, Any Street, AZ 12345",
  recepcionMapUrl: "https://maps.google.com/?q=Grand+Ballroom",
  dressCodeTitulo: "Formal & Elegant Attire",
  dressCodeNota: "We invite our guests to dress in elegant formal attire as we celebrate together. Reserved color: Blush pink for the Quinceañera.",
  wishlistUrl: "https://www.amazon.com/baby-reg",
  idiomaDefault: "bilingual",
  itinerarioJson: [
    { hora: "4:00 PM", titulo: "Mass - St. Mary's Church", tipoIcono: "church" },
    { hora: "5:00 PM", titulo: "Entrance - Grand Ballroom", tipoIcono: "car" },
    { hora: "6:00 PM", titulo: "Waltz", tipoIcono: "crown" },
    { hora: "7:00 PM", titulo: "Dinner", tipoIcono: "wine" },
    { hora: "9:00 PM", titulo: "Party", tipoIcono: "party" },
  ],
  corteHonorJson: {
    chambelan: "Emilio Salazar",
    damas: ["Isabella Cordero", "Valeria Morales", "Sofia Villanueva", "Emilia Rodriguez", "Camila Aguilar", "Maria Paz Leon", "Alondra Jimenez", "Regina Castro", "Natalia Sanchez"],
    chambelanes: ["Diego Alvarez", "Santiago Lopez", "Francisco Ruiz", "Mateo Ramírez", "Alejandro Torres"],
    padrinos: ["Miguel Herrera", "Daniela Herrera"],
  },
  historiaHitosJson: [
    {
      foto: "/assets/template-rose/722d78548334333072ad7200e4f8233e.jpg",
      fecha: "2011",
      titulo: "First Steps",
      texto: "Every story has a beginning, and mine started with the love of family, the comfort of home, and countless little moments that became treasured memories.",
    },
    {
      foto: "/assets/template-rose/94a9fcddf0e62c3f0ffe60a5a769dd9c.jpg",
      fecha: "2016",
      titulo: "New Adventures",
      texto: "With each new adventure came exciting firsts, growing confidence, and friendships that would become an important part of my journey.",
    },
    {
      foto: "/assets/template-rose/97da854ac288883d24133acda9d854ca.jpg",
      fecha: "2020",
      titulo: "Treasured Memories",
      texto: "From laughter-filled days to unforgettable memories, these special people helped shape the person I am today.",
    },
    {
      foto: "/assets/template-rose/39e6d693ec9d82a484d96df04a0cffd3.jpg",
      fecha: "2024",
      titulo: "Loyal Companion",
      texto: "And through every chapter, there was one loyal companion by my side—sharing the cuddles, the adventures, and all of life's happiest moments.",
    },
  ],
};

// =========================================================================
// 3. FAIRYTALE CHÂTEAU (Emma & Lucas - Canva T2)
// =========================================================================
export const DEMO_EMMA_LUCAS: InvitationData = {
  id: "demo-emma-lucas",
  slug: "emma-and-lucas",
  tipoEvento: "BODA",
  estiloPlantilla: "FAIRYTALE_CHATEAU",
  titulo: "Emma & Lucas",
  subtitulo: "Fairytale Château Wedding at Oheka Castle",
  frasePersonalizada: "Together with their families, invite you to their wedding celebration.",
  fechaEvento: new Date("2030-07-22T15:30:00Z"),
  fechaTextoPersonalizada: "SATURDAY, JULY 22, 2030 AT 3:30 PM",
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  telefonoWhatsappRsvp: "18189876543",
  fechaLimiteRsvp: "July 15",
  maxPasesPorInvitado: 2,
  recepcionNombre: "Oheka Castle Estate",
  recepcionDireccion: "8221 Sunset Blvd, West Hollywood, CA",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Semi-Formal and Elegant",
  dressCodeNota: "Feel free to add a touch of pastel to match our theme.",
  wishlistUrl: "https://www.zola.com/registry",
};

// =========================================================================
// 4. QUINCE ROSADO (Magdalena - Canva)
// =========================================================================
export const DEMO_QUINCE_ROSADO: InvitationData = {
  id: "demo-quince-rosado",
  slug: "quince-rosado",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "QUINCE_ROSADO",
  titulo: "Magdalena",
  subtitulo: "Mis Quince Años",
  frasePersonalizada:
    "Con la bendición de Dios y el amor de mi familia, tengo el honor de invitarte a celebrar este día tan esperado.",
  fechaEvento: new Date("2026-12-05T16:00:00Z"),
  fechaTextoPersonalizada: "SÁBADO 5 DE DICIEMBRE, 2026 • 4:00 PM",
  fotoPortadaUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
  fotoInfanciaUrl: "/assets/template-rose/722d78548334333072ad7200e4f8233e.jpg",
  fotoActualUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
  fotoCierreUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  telefonoWhatsappRsvp: "18181234567",
  fechaLimiteRsvp: "15 de Noviembre",
  maxPasesPorInvitado: 4,
  ceremoniaNombre: "Parroquia San Juan Bautista",
  ceremoniaDireccion: "Av. Las Rosas 450",
  ceremoniaMapUrl: "https://maps.google.com",
  recepcionNombre: "Hacienda Real Gala",
  recepcionDireccion: "Km 12 Carretera Antigua",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Rigurosa Etiqueta & Elegante",
  dressCodeNota: "Agradecemos reservar los tonos rosa para la quinceañera.",
  coloresReservados: ["#F3C5D0", "#7A002A"],
};

// =========================================================================
// 5. PRINCESA ROSA (Elsy - XV Años Clásica)
// =========================================================================
export const DEMO_ELSY: InvitationData = {
  id: "demo-elsy",
  slug: "elsy-xv",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "PRINCESA_ROSA",
  titulo: "Elsy",
  subtitulo: "An Unforgettable Celebration Awaits",
  frasePersonalizada:
    "Desde pequeña, Elsy soñó con este instante. Hoy celebramos el hermoso paso de niña a señorita, rodeada del cariño y bendición de quienes han guiado cada uno de sus pasos.",
  fechaEvento: new Date("2026-12-05T14:00:00Z"),
  fechaTextoPersonalizada: "DECEMBER 05, 2026 AT 2 PM",
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  telefonoWhatsappRsvp: "18181234567",
  recepcionNombre: "Grand Ballroom Estate",
  recepcionDireccion: "123 Forever Street, Los Ángeles, CA",
  recepcionMapUrl: "https://maps.google.com",
};

// =========================================================================
// 6. CORALINE OTHER WORLD (Canva T4 - Místico)
// =========================================================================
export const DEMO_CORALINE: InvitationData = {
  id: "demo-coraline",
  slug: "coraline-party",
  tipoEvento: "CUMPLEANOS",
  estiloPlantilla: "CORALINE_MYSTICAL",
  titulo: "Valeria's 15th Mystery",
  subtitulo: "Coraline Other World Secret Party",
  frasePersonalizada: "You have found the secret door... be careful what you wish for!",
  fechaEvento: new Date("2026-10-31T18:00:00Z"),
  fechaTextoPersonalizada: "OCTOBER 31, 2026 • 6:00 PM",
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  telefonoWhatsappRsvp: "18181234567",
  recepcionNombre: "The Pink Palace Apartments & Secret Garden",
  recepcionDireccion: "123 Oregon Fall Way, Ashland, OR",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Other World Attire: Yellow & Deep Blue",
};

// =========================================================================
// 7. CLÁSICA IMPERIAL (Sofía & Alejandro - Boda de Gala)
// =========================================================================
export const DEMO_BODA: InvitationData = {
  id: "demo-boda",
  slug: "sofia-y-alejandro",
  tipoEvento: "BODA",
  estiloPlantilla: "CLASICA_IMPERIAL",
  titulo: "Sofía & Alejandro",
  subtitulo: "Nuestra Boda",
  fechaEvento: new Date("2026-10-24T18:00:00Z"),
  fechaTextoPersonalizada: "SÁBADO 24 DE OCTUBRE • 6:00 PM",
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  telefonoWhatsappRsvp: "18189876543",
  recepcionNombre: "Hacienda Los Laureles",
  recepcionDireccion: "Km 14 Carretera Antigua",
  recepcionMapUrl: "https://maps.google.com",
};

// =========================================================================
// 8. ESMERALDA ROYAL (Gala Nocturna de Lujo)
// =========================================================================
export const DEMO_ESMERALDA: InvitationData = {
  id: "demo-esmeralda",
  slug: "esmeralda-royal",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "ESMERALDA_ROYAL",
  titulo: "Renata Villarreal",
  subtitulo: "Gala Esmeralda & Oro",
  frasePersonalizada: "Una noche mágica bajo el resplandor esmeralda y el oro real.",
  fechaEvento: new Date("2026-11-14T19:00:00Z"),
  fechaTextoPersonalizada: "SÁBADO 14 DE NOVIEMBRE • 7:00 PM",
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  telefonoWhatsappRsvp: "18181234567",
  recepcionNombre: "Salón Real Esmeralda",
  recepcionDireccion: "Av. Las Palmas 880",
  recepcionMapUrl: "https://maps.google.com",
};

// =========================================================================
// 9. JARDÍN BOTÁNICA (Romántica / Boho)
// =========================================================================
export const DEMO_JARDIN: InvitationData = {
  id: "demo-jardin",
  slug: "jardin-botanica",
  tipoEvento: "BODA",
  estiloPlantilla: "JARDIN_BOTANICA",
  titulo: "Camila & Mateo",
  subtitulo: "Amor en el Jardín",
  frasePersonalizada: "Donde florece nuestro amor eterno, entre hojas de olivo y brisa de otoño.",
  fechaEvento: new Date("2026-09-19T17:00:00Z"),
  fechaTextoPersonalizada: "SÁBADO 19 DE SEPTIEMBRE • 5:00 PM",
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  telefonoWhatsappRsvp: "18189876543",
  recepcionNombre: "Jardín Botánico Los Olivos",
  recepcionDireccion: "Camino del Bosque 102",
  recepcionMapUrl: "https://maps.google.com",
};

// =========================================================================
// 10. MINIMALISTA EDITORIAL (Vogue / Alta Moda)
// =========================================================================
export const DEMO_MINIMALISTA: InvitationData = {
  id: "demo-minimalista",
  slug: "minimalista-editorial",
  tipoEvento: "BODA",
  estiloPlantilla: "MINIMALISTA_EDITORIAL",
  titulo: "Victoria & David",
  subtitulo: "The Modern Wedding",
  frasePersonalizada: "Simplicity is the keynote of all true elegance.",
  fechaEvento: new Date("2026-10-10T18:00:00Z"),
  fechaTextoPersonalizada: "OCTOBER 10, 2026 • 6:00 PM",
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  telefonoWhatsappRsvp: "18189876543",
  recepcionNombre: "The Modern Loft Studio",
  recepcionDireccion: "500 Soho Street, New York, NY",
  recepcionMapUrl: "https://maps.google.com",
};

// Diccionario centralizado de los 8+ Demos del Sistema
export const ALL_SYSTEM_DEMOS: Record<string, InvitationData> = {
  "mariposas-xv": DEMO_BUTTERFLY,
  "blue-butterfly": DEMO_BUTTERFLY,
  "isabella-xv": DEMO_ISABELLA,
  "elegant-rose": DEMO_ISABELLA,
  "emma-and-lucas": DEMO_EMMA_LUCAS,
  "fairytale-chateau": DEMO_EMMA_LUCAS,
  "quince-rosado": DEMO_QUINCE_ROSADO,
  "elsy-xv": DEMO_ELSY,
  "princesa-rosa": DEMO_ELSY,
  "coraline-party": DEMO_CORALINE,
  "coraline-mystical": DEMO_CORALINE,
  "sofia-y-alejandro": DEMO_BODA,
  "clasica-imperial": DEMO_BODA,
  "esmeralda-royal": DEMO_ESMERALDA,
  "jardin-botanica": DEMO_JARDIN,
  "minimalista-editorial": DEMO_MINIMALISTA,
};

export function getSystemDemo(slug: string): InvitationData | null {
  if (!slug) return null;
  const clean = decodeURIComponent(slug).toLowerCase().trim().replace(/^\/demo\//, "");
  return ALL_SYSTEM_DEMOS[clean] || null;
}
