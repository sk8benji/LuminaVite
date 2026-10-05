import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { InvitationData } from "@/components/invitation/InvitationMobileView";
import TemplateDispatcher from "@/components/templates/TemplateDispatcher";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// ==========================================
// 1. DEMO ELSY (Réplica Video de Referencia)
// ==========================================
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
  fotoInfanciaUrl:
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
  fotoActualUrl:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
  fotoCierreUrl:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  telefonoWhatsappRsvp: "18181234567",
  fechaLimiteRsvp: "November 15, 2026",
  maxPasesPorInvitado: 4,
  ceremoniaNombre: "Parroquia San Juan Bautista",
  ceremoniaDireccion: "Av. Las Rosas 450, Los Ángeles, CA",
  ceremoniaMapUrl: "https://maps.google.com",
  recepcionNombre: "123 Forever Street, Los Ángeles, CA",
  recepcionDireccion: "123 Forever Street, City, State",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "BRING YOUR DANCING SHOES - DRESS CODE: Elegant & Formal",
  dressCodeNota: "Guests are encouraged to wear shades of white/formal to match the celebration.",
  coloresReservados: ["#FFFFFF", "#FCECEE", "#D4A59A"],
  celebrationGuideline:
    "OUR LITTLE GUESTS: We lovingly welcome children to celebrate with us. During special dances and performances, we kindly ask that children remain seated.",
  itinerarioJson: [
    { hora: "2:00 PM", titulo: "Llegada de invitados", tipoIcono: "car" },
    { hora: "3:00 PM", titulo: "Ceremonia Religiosa", tipoIcono: "church" },
    { hora: "5:30 PM", titulo: "Recepción y Brindis", tipoIcono: "wine" },
    { hora: "7:00 PM", titulo: "Entrada y Vals / Protocolo", tipoIcono: "crown" },
    { hora: "8:30 PM", titulo: "Apertura de pista de baile", tipoIcono: "party" },
  ],
  corteHonorJson: {
    chambelan: "Jeremiah",
    damas: ["Magdalena", "Violeta", "Tania"],
    chambelanes: ["James"],
    parents: "Magdalena & Adrian",
    padrinos: ["Tania & Carl"],
    mensajeGratitud: "Un agradecimiento de todo corazón a nuestros padres y padrinos por su generosidad y apoyo.",
  },
  mesaRegalosJson: {
    titulo: "THE REGISTRY",
    mensaje:
      "Celebrating with you is the greatest gift of all. For guests who wish to bring a contribution, is warmly appreciated.",
    plataformas: ["Zelle", "CashApp", "Urna de sobres"],
    datosBancarios: "Zelle: elsy.family@example.com",
  },
};

// ==========================================
// 2. DEMO ISABELLA (Canva T1: Elegant Rose)
// ==========================================
export const DEMO_ISABELLA: InvitationData = {
  id: "demo-isabella",
  slug: "isabella-xv",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "ELEGANT_ROSE",
  titulo: "Isabella",
  subtitulo: "BLG 2UPT Elegant Rose Themed Quinceanera",
  frasePersonalizada: "Celebrating Fifteen Amazing Years—The Best Is Yet to Come.",
  fechaEvento: new Date("2026-07-18T16:00:00Z"),
  fechaTextoPersonalizada: "SUNDAY, JULY 18 • 4:00 PM",
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  fotoInfanciaUrl:
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
  fotoActualUrl:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  videoUrl: "https://www.youtube.com/embed/0ZVsGVE1qCg",
  telefonoWhatsappRsvp: "18181234567",
  fechaLimiteRsvp: "June 20th",
  maxPasesPorInvitado: 4,
  recepcionNombre: "St. Mary's Church & Grand Ballroom",
  recepcionDireccion: "Any City, Any Street, AZ 12345",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Formal & Elegant Attire",
  dressCodeNota: "We invite our guests to dress in elegant formal attire as we celebrate together.",
  wishlistUrl: "https://www.amazon.com/baby-reg",
  idiomaDefault: "en",
  itinerarioJson: [
    { hora: "4:00 PM", titulo: "Mass - St. Mary's Church", tipoIcono: "church" },
    { hora: "5:00 PM", titulo: "Entrance - Grand Ballroom", tipoIcono: "car" },
    { hora: "6:00 PM", titulo: "Waltz", tipoIcono: "crown" },
    { hora: "7:00 PM", titulo: "Dinner", tipoIcono: "wine" },
    { hora: "9:00 PM", titulo: "Party", tipoIcono: "party" },
  ],
  corteHonorJson: {
    chambelan: "Emilio Salazar (Chamberlain of Honor)",
    damas: ["Isabella", "Valeria", "Sofia", "Emilia", "Camila", "Maria", "Regina", "Natalia"],
    chambelanes: ["Diego", "Santiago", "Francisco", "Mateo", "Alejandro"],
    padrinos: ["Miguel & Daniela Herrera"],
  },
};

// ==========================================
// 3. DEMO EMMA & LUCAS (Canva T2: Fairytale Wedding)
// ==========================================
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

// ==========================================
// 4. DEMO MARIPOSAS (Canva T3: Blue Butterfly Garden)
// ==========================================
export const DEMO_BUTTERFLY: InvitationData = {
  id: "demo-butterfly",
  slug: "mariposas-xv",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "BLUE_BUTTERFLY",
  titulo: "Valeria",
  subtitulo: "Blue Butterfly Enchanted Garden",
  frasePersonalizada:
    "“Doy gracias a Dios por concederme la dicha de celebrar mis quince primaveras, y a mis padres por guiar cada uno de mis pasos con amor incondicional.”",
  fechaEvento: new Date("2026-11-14T17:00:00Z"),
  fechaTextoPersonalizada: "14 NOVIEMBRE 2026 • 5:00 PM",
  fotoPortadaUrl: "/assets/template-butterfly/foto-columpio-portada.png",
  fotoInfanciaUrl: "/assets/template-butterfly/foto-sesion-1.jpg",
  fotoActualUrl: "/assets/template-butterfly/foto-sesion-2.jpg",
  fotoCierreUrl: "/assets/template-butterfly/foto-zapatilla-original.png",
  musicaUrl:
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
  telefonoWhatsappRsvp: "18181234567",
  fechaLimiteRsvp: "20 de Octubre",
  maxPasesPorInvitado: 3,
  recepcionNombre: "Gran Salón Real",
  recepcionDireccion: "123 Forever Street, Los Ángeles, CA",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Formal & Rigurosa Etiqueta",
  dressCodeNota:
    "Agradecemos reservar los tonos azul celeste y blanco exclusivamente para la quinceañera.",
  coloresReservados: ["#7FA2C6", "#2B4C7E", "#FFFFFF"],
};

// ==========================================
// 5. DEMO CORALINE (Canva T4: Coraline Other World)
// ==========================================
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
  fechaLimiteRsvp: "October 20",
  maxPasesPorInvitado: 2,
  recepcionNombre: "The Pink Palace Apartments & Secret Garden",
  recepcionDireccion: "123 Oregon Fall Way, Ashland, OR",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Other World Attire: Yellow & Deep Blue",
  dressCodeNota: "Guests are encouraged to wear shades of yellow, deep blue, or whimsical vintage attire!",
  coloresReservados: ["#FFD700", "#0A1956", "#3A0443", "#000000"],
};

// Boda clásica adicional
export const DEMO_BODA: InvitationData = {
  id: "demo-boda",
  slug: "sofia-y-alejandro",
  tipoEvento: "BODA",
  estiloPlantilla: "CLASICA_IMPERIAL",
  titulo: "Sofía & Alejandro",
  subtitulo: "Nuestra Boda",
  fechaEvento: new Date("2026-10-24T18:00:00Z"),
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  telefonoWhatsappRsvp: "18189876543",
  recepcionNombre: "Hacienda Los Laureles",
  recepcionDireccion: "Km 14 Carretera Antigua",
  recepcionMapUrl: "https://maps.google.com",
};

async function getEventoData(rawSlug: string): Promise<InvitationData | null> {
  if (!rawSlug) return null;
  const slug = decodeURIComponent(rawSlug).toLowerCase().trim();

  // Demos instantáneos con las 4 réplicas de Canva + Elsy
  if (slug === "elsy-xv") return DEMO_ELSY;
  if (slug === "isabella-xv") return DEMO_ISABELLA;
  if (slug === "emma-and-lucas") return DEMO_EMMA_LUCAS;
  if (slug === "mariposas-xv") return DEMO_BUTTERFLY;
  if (slug === "coraline-party") return DEMO_CORALINE;
  if (slug === "sofia-y-alejandro") return DEMO_BODA;

  try {
    const evento = await prisma.evento.findUnique({
      where: { slug, activo: true },
    });

    if (!evento) return null;

    return {
      id: evento.id,
      slug: evento.slug,
      tipoEvento: evento.tipoEvento as any,
      estiloPlantilla: evento.estiloPlantilla as any,
      titulo: evento.titulo,
      subtitulo: evento.subtitulo,
      frasePersonalizada: evento.frasePersonalizada,
      fechaEvento: evento.fechaEvento,
      fechaTextoPersonalizada: evento.fechaTextoPersonalizada,
      fotoPortadaUrl: evento.fotoPortadaUrl,
      fotoInfanciaUrl: evento.fotoInfanciaUrl,
      fotoActualUrl: evento.fotoActualUrl,
      fotoCierreUrl: evento.fotoCierreUrl,
      musicaUrl: evento.musicaUrl,
      videoUrl: evento.videoUrl,
      galeriaFotosUrls: evento.galeriaFotosUrls,
      telefonoWhatsappRsvp: evento.telefonoWhatsappRsvp,
      fechaLimiteRsvp: evento.fechaLimiteRsvp ? evento.fechaLimiteRsvp.toLocaleDateString() : null,
      maxPasesPorInvitado: evento.maxPasesPorInvitado,
      ceremoniaNombre: evento.ceremoniaNombre,
      ceremoniaDireccion: evento.ceremoniaDireccion,
      ceremoniaMapUrl: evento.ceremoniaMapUrl,
      recepcionNombre: evento.recepcionNombre,
      recepcionDireccion: evento.recepcionDireccion,
      recepcionMapUrl: evento.recepcionMapUrl,
      dressCodeTitulo: evento.dressCodeTitulo,
      dressCodeNota: evento.dressCodeNota,
      coloresReservados: evento.coloresReservados,
      celebrationGuideline: evento.celebrationGuideline,
      wishlistUrl: evento.wishlistUrl,
      idiomaDefault: evento.idiomaDefault,
      itinerarioJson: evento.itinerarioJson,
      corteHonorJson: evento.corteHonorJson,
      mesaRegalosJson: evento.mesaRegalosJson,
      hospedajeJson: evento.hospedajeJson,
      transporteJson: evento.transporteJson,
      historiaHitosJson: evento.historiaHitosJson,
    };
  } catch (error) {
    console.warn("Base de datos no disponible o error al consultar slug:", slug, error);
    return null;
  }
}

/**
 * OpenGraph dinámico para WhatsApp y redes sociales.
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const data = await getEventoData(resolvedParams?.slug);

  if (!data) {
    return {
      title: "Invitación no encontrada | LuminaVite",
      description: "Esta invitación no existe o ha sido desactivada.",
    };
  }

  const eventDate = new Date(data.fechaEvento).toLocaleDateString("es-ES", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const title = `${data.titulo} | Invitación Digital`;
  const description = `${data.subtitulo || "Acompáñanos a celebrar"} - ${eventDate}. Confirma tu asistencia por WhatsApp.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: data.fotoPortadaUrl,
          width: 800,
          height: 1200,
          alt: data.titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [data.fotoPortadaUrl],
    },
  };
}

export default async function InvitationPage(props: PageProps) {
  const resolvedParams = await props.params;
  const data = await getEventoData(resolvedParams?.slug);

  if (!data) {
    notFound();
  }

  return <TemplateDispatcher data={data} />;
}
