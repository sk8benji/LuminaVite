import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import InvitationMobileView, { InvitationData } from "@/components/invitation/InvitationMobileView";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Datos de demostración enriquecidos basados en la referencia solicitada
export const DEMO_ELSY: InvitationData = {
  id: "demo-elsy",
  slug: "elsy-xv",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "PRINCESA_ROSA",
  titulo: "Elsy",
  subtitulo: "An Unforgettable Celebration Awaits",
  frasePersonalizada:
    "Desde pequeña, Elsy soñó con este instante. Hoy celebramos el hermoso paso de niña a señorita, rodeada del cariño de quienes han guiado cada uno de sus pasos.",
  fechaEvento: new Date("2026-12-05T17:00:00Z"),
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  fotoInfanciaUrl:
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
  fotoActualUrl:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  telefonoWhatsappRsvp: "18181234567",
  fechaLimiteRsvp: "15 de Noviembre, 2026",
  maxPasesPorInvitado: 4,
  ceremoniaNombre: "Parroquia San Juan Bautista",
  ceremoniaDireccion: "Av. Las Rosas 450, Los Ángeles, CA",
  ceremoniaMapUrl: "https://maps.google.com",
  recepcionNombre: "Gran Salón Real",
  recepcionDireccion: "123 Forever Street, Los Ángeles, CA",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Elegante y Formal",
  dressCodeNota: "Nos reservamos el color rosa y tonos pastel para la quinceañera.",
  coloresReservados: ["#FCECEE", "#FFFFFF", "#D4A59A"],
  itinerarioJson: [
    { hora: "4:00 PM", titulo: "Llegada de invitados", tipoIcono: "car" },
    { hora: "5:00 PM", titulo: "Ceremonia Religiosa", tipoIcono: "church" },
    { hora: "7:00 PM", titulo: "Cena y Brindis", tipoIcono: "wine" },
    { hora: "8:30 PM", titulo: "Vals de Quinceañera y Fiesta", tipoIcono: "crown" },
  ],
  corteHonorJson: {
    chambelan: "Jeremiah",
    damas: ["Magdalena", "Violeta", "Tania"],
    padrinos: ["Padrinos de Brindis: Familia Morales", "Padrinos de Honor: Sr. y Sra. Gómez"],
  },
  mesaRegalosJson: {
    titulo: "Lluvia de Sobres",
    mensaje:
      "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con la quinceañera, dispondremos de un sobre en la recepción o vía Zelle.",
    datosBancarios: "Zelle: elsy.family@example.com",
  },
};

export const DEMO_BODA: InvitationData = {
  id: "demo-boda",
  slug: "sofia-y-alejandro",
  tipoEvento: "BODA",
  estiloPlantilla: "CLASICA_IMPERIAL",
  titulo: "Sofía & Alejandro",
  subtitulo: "Nuestra Boda",
  frasePersonalizada:
    "El amor no se mira con los ojos, sino con el corazón. Te invitamos a ser testigo del inicio de nuestra mayor aventura.",
  fechaEvento: new Date("2026-10-24T18:00:00Z"),
  fotoPortadaUrl:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  telefonoWhatsappRsvp: "18189876543",
  fechaLimiteRsvp: "01 de Octubre, 2026",
  maxPasesPorInvitado: 2,
  ceremoniaNombre: "Catedral Nuestra Señora del Pilar",
  ceremoniaDireccion: "Plaza Central 100",
  ceremoniaMapUrl: "https://maps.google.com",
  recepcionNombre: "Hacienda Los Laureles",
  recepcionDireccion: "Km 14 Carretera Antigua",
  recepcionMapUrl: "https://maps.google.com",
  dressCodeTitulo: "Rigurosa Etiqueta",
  dressCodeNota: "Traje formal oscuro para caballeros y vestido largo para damas. Reservado el color blanco para la novia.",
  coloresReservados: ["#FFFFFF", "#F5EDDC"],
  itinerarioJson: [
    { hora: "5:30 PM", titulo: "Recepción de Invitados", tipoIcono: "car" },
    { hora: "6:00 PM", titulo: "Ceremonia Nupcial", tipoIcono: "church" },
    { hora: "7:30 PM", titulo: "Cóctel de Bienvenida", tipoIcono: "wine" },
    { hora: "9:00 PM", titulo: "Primer Baile y Banquete", tipoIcono: "crown" },
    { hora: "11:00 PM", titulo: "Apertura de Barra Libre", tipoIcono: "party" },
  ],
};

async function getEventoData(rawSlug: string): Promise<InvitationData | null> {
  if (!rawSlug) return null;
  const slug = decodeURIComponent(rawSlug).toLowerCase().trim();

  // Demos instantáneos
  if (slug === "elsy-xv") return DEMO_ELSY;
  if (slug === "sofia-y-alejandro") return DEMO_BODA;

  try {
    const evento = await prisma.evento.findUnique({
      where: { slug, activo: true },
    });

    if (!evento) return null;

    return {
      id: evento.id,
      slug: evento.slug,
      tipoEvento: evento.tipoEvento,
      estiloPlantilla: evento.estiloPlantilla as any,
      titulo: evento.titulo,
      subtitulo: evento.subtitulo,
      frasePersonalizada: evento.frasePersonalizada,
      fechaEvento: evento.fechaEvento,
      fotoPortadaUrl: evento.fotoPortadaUrl,
      fotoInfanciaUrl: evento.fotoInfanciaUrl,
      fotoActualUrl: evento.fotoActualUrl,
      musicaUrl: evento.musicaUrl,
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
      itinerarioJson: evento.itinerarioJson,
      corteHonorJson: evento.corteHonorJson,
      mesaRegalosJson: evento.mesaRegalosJson,
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

  return <InvitationMobileView data={data} />;
}
