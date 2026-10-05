import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { fallbackEventStore } from "@/lib/event-fallback-store";
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

    if (!evento) {
      const fallback = await fallbackEventStore.getEvent(slug);
      if (fallback) {
        return {
          ...fallback,
          fechaEvento: new Date(fallback.fechaEvento),
        } as any;
      }
      return null;
    }

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
      fechaPlacaMes: (evento as any).fechaPlacaMes,
      fechaPlacaHora: (evento as any).fechaPlacaHora,
      fechaPlacaLugar: (evento as any).fechaPlacaLugar,
      countdownEncabezado: (evento as any).countdownEncabezado,
      dressCodeEtiqueta: (evento as any).dressCodeEtiqueta,
      dressCodeColoresReservados: (evento as any).dressCodeColoresReservados,
      regalosMensaje: (evento as any).regalosMensaje,
      regalosZelle: (evento as any).regalosZelle,
      regalosCashApp: (evento as any).regalosCashApp,
      rsvpFechaLimite: (evento as any).rsvpFechaLimite,
      rsvpDiasAntes: (evento as any).rsvpDiasAntes ?? 15,
      autorBendicion: (evento as any).autorBendicion,
      textoDisco: (evento as any).textoDisco,
      mensajeDespedida: (evento as any).mensajeDespedida,
      dressCodeTitulo: evento.dressCodeTitulo,
      dressCodeNota: evento.dressCodeNota,
      coloresReservados: evento.coloresReservados,
      celebrationGuideline: evento.celebrationGuideline,
      wishlistUrl: evento.wishlistUrl,
      idiomaDefault: evento.idiomaDefault,
      itinerario: ((evento as any).itinerarioJson as any) || undefined,
      itinerarioJson: evento.itinerarioJson,
      corteHonorJson: evento.corteHonorJson,
      mesaRegalosJson: evento.mesaRegalosJson,
      hospedajeJson: evento.hospedajeJson,
      transporteJson: evento.transporteJson,
      historiaHitosJson: evento.historiaHitosJson,
    };
  } catch (error) {
    console.warn("Base de datos no disponible o error al consultar slug:", slug, error);
    const fallback = await fallbackEventStore.getEvent(slug);
    if (fallback) {
      return {
        ...fallback,
        fechaEvento: new Date(fallback.fechaEvento),
      } as any;
    }
    return null;
  }
}

/**
 * OpenGraph dinámico para Facebook, WhatsApp y redes sociales.
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

  const isEn = data.idiomaDefault === "en";

  // Formato de tipo de evento
  let tipoTexto = "Mis Quince Años";
  if (data.tipoEvento === "BODA") {
    tipoTexto = isEn ? "Our Wedding" : "Nuestra Boda";
  } else if (data.tipoEvento === "CUMPLEANOS") {
    tipoTexto = isEn ? "Birthday Celebration" : "Mi Cumpleaños";
  } else {
    tipoTexto = isEn ? "Mis Quince Años" : "Mis Quince Años";
  }

  // Texto formal de la fecha
  let fechaTexto = data.fechaTextoPersonalizada;
  if (!fechaTexto && data.fechaEvento) {
    const d = new Date(data.fechaEvento);
    if (!isNaN(d.getTime())) {
      fechaTexto = d.toLocaleDateString(isEn ? "en-US" : "es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  const tituloEvento = `${tipoTexto}: ${data.titulo}`;
  const title = `${tituloEvento} • ¡Tú estás invitado!`;

  const description = fechaTexto
    ? `${tituloEvento} • 📅 ${fechaTexto} • ✨ ¡Estás cordialmente invitado a celebrar con nosotros!`
    : `${tituloEvento} • ✨ ¡Estás cordialmente invitado a celebrar con nosotros!`;

  // Asegurar que la imagen sea URL absoluta con https para Facebook y WhatsApp
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null) ||
    "https://luminavite-production.up.railway.app";

  let coverImage = data.fotoPortadaUrl || "/assets/template-butterfly/foto-columpio-portada.png";
  if (coverImage.startsWith("/")) {
    coverImage = `${baseUrl}${coverImage}`;
  }

  const eventUrl = `${baseUrl}/${data.slug}`;

  const ogImageUrl = `${baseUrl}/api/og?slug=${data.slug}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: eventUrl,
    },
    openGraph: {
      title,
      description,
      url: eventUrl,
      siteName: "LuminaVite Invitaciones",
      locale: isEn ? "en_US" : "es_LA",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tituloEvento} - Invitación y Fotografía Principal`,
          type: "image/png",
        },
        {
          url: coverImage,
          secureUrl: coverImage,
          width: 800,
          height: 1200,
          alt: `${tituloEvento} - Portada Oficial`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
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
