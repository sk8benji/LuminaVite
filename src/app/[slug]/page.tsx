import { Metadata } from "next";
import { sanitizePublicBaseUrl } from "@/lib/url-safety";
import { notFound } from "next/navigation";
import { InvitationData } from "@/components/invitation/InvitationMobileView";
import {
  DEMO_BUTTERFLY,
  DEMO_ISABELLA,
  DEMO_EMMA_LUCAS,
  DEMO_ELSY,
  DEMO_CORALINE,
  DEMO_BODA,
} from "@/lib/demo-data";
import TemplateDispatcher from "@/components/templates/TemplateDispatcher";
import ContactBanner from "@/components/invitation/ContactBanner";
import { normalizeSlug, getEventBySlug } from "@/lib/events";
import { formatFechaLimiteRsvp } from "@/lib/fecha-limite";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Los demos ya no se duplican aquí: vienen de "@/lib/demo-data"
// (la misma fuente que /demo/*), para que /<slug> y /demo/<slug>
// muestren siempre el mismo contenido.

export const EVENT_MAYDELIN_MENDEZ: InvitationData = {
  id: "client-maydelin-mendez",
  slug: "maydelin-mendez",
  tipoEvento: "QUINCEANERA",
  estiloPlantilla: "QUINCE_ROSADO",
  titulo: "Maydelin Mendez",
  subtitulo: "Mis Quinceaños",
  mostrarFrasePersonalizada: true,
  frasePersonalizada:
    "Hoy comienzo a escribir un nuevo capítulo al dejar atrás mi niñez para convertirme en mujer. En este día tan especial, rodeada del cariño de quienes más quiero, sería un honor contar con tu presencia para celebrar un momento que guardaré por siempre en mi corazón.",
  frasePersonalizadaEn:
    "Today I begin to write a new chapter as I leave childhood behind to become a young woman. On this special day, surrounded by the love of those I cherish most, it would be an honor to have your presence to celebrate a moment I will keep in my heart forever.",
  fechaEvento: new Date("2026-12-05T22:38:00Z"),
  fechaTextoPersonalizada: "SÁBADO 5 DE DICIEMBRE, 2026",
  mostrarFechaPlacaHora: true,
  fechaPlacaHora: "A LAS 10:38 PM",
  fechaPlacaHoraEn: "AT 10:38 PM",
  fotoPortadaUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.webp",
  fotoInfanciaUrl: "/assets/template-rose/722d78548334333072ad7200e4f8233e.webp",
  fotoActualUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.webp",
  fotoCierreUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.webp",
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  telefonoWhatsappRsvp: "18181234567",
  fechaLimiteRsvp: "15 de Noviembre, 2026",
  maxPasesPorInvitado: 4,
  ceremoniaNombre: "Parroquia San Juan Bautista",
  ceremoniaDireccion: "Av. Las Rosas 450",
  ceremoniaMapUrl: "https://maps.google.com",
  recepcionNombre: "Hacienda Real Gala",
  recepcionDireccion: "Km 12 Carretera Antigua",
  recepcionMapUrl: "https://maps.google.com",
  mostrarDressCode: true,
  dressCodeTitulo: "Rigurosa Etiqueta & Elegante",
  dressCodeTituloEn: "Formal & Elegant Attire",
  dressCodeNota: "Tono rosa pastel reservado para la quinceañera",
  dressCodeNotaEn: "Blush pink tones reserved exclusively for the quinceañera",
  coloresReservados: ["#F3C5D0", "#7A002A"],
  idiomaDefault: "bilingual",
  permitirConfirmacionTelefono: true,
  mostrarMesaRegalos: true,
  regalosMensaje: "Tu presencia es nuestro mayor regalo. Disponemos de un cofre en la recepción.",
  regalosMensajeEn: "Your presence is our greatest gift. A gift box will be available at the reception.",
  itinerarioJson: [
    {
      hora: "2:00 PM",
      titulo: "Ceremonia Religiosa en La Iglesia de San José Obrero",
      tituloEn: "Religious Ceremony at St. Joseph the Worker Church",
      tipoIcono: "church",
    },
    {
      hora: "5:00 PM",
      titulo: "Llegada De Los Invitados",
      tituloEn: "Guest Arrival",
      tipoIcono: "welcome",
    },
    {
      hora: "6:00 PM",
      titulo: "Cena y Brindis",
      tituloEn: "Dinner & Toast",
      tipoIcono: "dinner",
    },
    {
      hora: "8:00 PM",
      titulo: "Vals y Fiesta",
      tituloEn: "Waltz & Celebration",
      tipoIcono: "waltz",
    },
  ],
};

async function getEventoData(rawSlug: string): Promise<InvitationData | null> {
  const cleanSlug = decodeURIComponent(rawSlug || "").trim().toLowerCase();
  if (!cleanSlug) return null;

  // 1. Consultar base de datos PostgreSQL en Railway directamente (Única Fuente de Verdad)
  const dbEvento = await getEventBySlug(cleanSlug);

  if (dbEvento && dbEvento.activo !== false) {
    return {
      id: dbEvento.id,
      slug: dbEvento.slug,
      tipoEvento: dbEvento.tipoEvento as any,
      estiloPlantilla: dbEvento.estiloPlantilla as any,
      titulo: dbEvento.titulo,
      subtitulo: dbEvento.subtitulo,
      mostrarFrasePersonalizada: (dbEvento as any).mostrarFrasePersonalizada !== false,
      frasePersonalizada: dbEvento.frasePersonalizada,
      frasePersonalizadaEn: (dbEvento as any).frasePersonalizadaEn ?? null,
      fechaEvento: new Date(dbEvento.fechaEvento),
      fechaTextoPersonalizada: dbEvento.fechaTextoPersonalizada,
      fotoPortadaUrl: dbEvento.fotoPortadaUrl,
      fotoInfanciaUrl: dbEvento.fotoInfanciaUrl,
      fotoActualUrl: dbEvento.fotoActualUrl,
      fotoCierreUrl: dbEvento.fotoCierreUrl,
      fotoZapato1Url: (dbEvento as any).fotoZapato1Url ?? null,
      fotoZapato2Url: (dbEvento as any).fotoZapato2Url ?? null,
      ogTitulo: (dbEvento as any).ogTitulo ?? null,
      ogDescripcion: (dbEvento as any).ogDescripcion ?? null,
      ogImagenUrl: (dbEvento as any).ogImagenUrl ?? null,
      musicaUrl: dbEvento.musicaUrl,
      musicaTitulo: (dbEvento as any).musicaTitulo ?? null,
      reproducirMusicaAlAbrir: dbEvento.reproducirMusicaAlAbrir !== false,
      videoUrl: dbEvento.videoUrl,
      galeriaFotosUrls: dbEvento.galeriaFotosUrls,
      telefonoWhatsappRsvp: dbEvento.telefonoWhatsappRsvp,
      // Nunca exponer el ISO crudo: la fecha límite se formatea legible
      // (la frase completa, si existe, vive en rsvpFechaLimite y las
      // plantillas la prefieren sobre esta fecha).
      fechaLimiteRsvp: formatFechaLimiteRsvp(
        dbEvento.fechaLimiteRsvp,
        dbEvento.idiomaDefault === "en" ? "en" : "es"
      ),
      maxPasesPorInvitado: dbEvento.maxPasesPorInvitado,
      ceremoniaNombre: dbEvento.ceremoniaNombre,
      ceremoniaDireccion: dbEvento.ceremoniaDireccion,
      ceremoniaMapUrl: dbEvento.ceremoniaMapUrl,
      recepcionNombre: dbEvento.recepcionNombre,
      recepcionDireccion: dbEvento.recepcionDireccion,
      recepcionMapUrl: dbEvento.recepcionMapUrl,
      fechaPlacaMes: (dbEvento as any).fechaPlacaMes,
      mostrarFechaPlacaHora: (dbEvento as any).mostrarFechaPlacaHora !== false,
      fechaPlacaHora: (dbEvento as any).fechaPlacaHora,
      fechaPlacaHoraEn: (dbEvento as any).fechaPlacaHoraEn ?? null,
      fechaPlacaLugar: (dbEvento as any).fechaPlacaLugar,
      countdownEncabezado: (dbEvento as any).countdownEncabezado,
      dressCodeEtiqueta: (dbEvento as any).dressCodeEtiqueta,
      dressCodeColoresReservados: (dbEvento as any).dressCodeColoresReservados,
      regalosMensaje: (dbEvento as any).regalosMensaje,
      regalosMensajeEn: (dbEvento as any).regalosMensajeEn,
      mostrarMesaRegalos: (dbEvento as any).mostrarMesaRegalos !== false,
      regalosZelle: (dbEvento as any).regalosZelle,
      regalosCashApp: (dbEvento as any).regalosCashApp,
      rsvpFechaLimite: (dbEvento as any).rsvpFechaLimite,
      rsvpDiasAntes: (dbEvento as any).rsvpDiasAntes ?? 15,
      autorBendicion: (dbEvento as any).autorBendicion,
      textoDisco: (dbEvento as any).textoDisco,
      mensajeDespedida: (dbEvento as any).mensajeDespedida,
      mostrarDressCode: (dbEvento as any).mostrarDressCode !== false,
      dressCodeTitulo: dbEvento.dressCodeTitulo,
      dressCodeTituloEn: (dbEvento as any).dressCodeTituloEn,
      dressCodeNota: dbEvento.dressCodeNota,
      dressCodeNotaEn: (dbEvento as any).dressCodeNotaEn,
      emailOrganizador: (dbEvento as any).emailOrganizador ?? null,
      aforoTotal: (dbEvento as any).aforoTotal ?? null,
      coloresReservados: dbEvento.coloresReservados,
      celebrationGuideline: dbEvento.celebrationGuideline,
      wishlistUrl: dbEvento.wishlistUrl,
      idiomaDefault: dbEvento.idiomaDefault,
      itinerario:
        ((dbEvento as any).itinerarioJson as any) ||
        (dbEvento as any).itinerario ||
        undefined,
      itinerarioJson: dbEvento.itinerarioJson,
      corteHonorJson: dbEvento.corteHonorJson,
      mesaRegalosJson: dbEvento.mesaRegalosJson,
      hospedajeJson: dbEvento.hospedajeJson,
      transporteJson: dbEvento.transporteJson,
      historiaHitosJson: dbEvento.historiaHitosJson,
      configPlantilla: (dbEvento as any).configPlantilla ?? {},
      tipoPlan: (dbEvento as any).ordenesCompra?.[0]?.paqueteId?.toLowerCase() || "signature",
      permiteSms:
        !(dbEvento as any).ordenesCompra?.length ||
        (!((dbEvento as any).ordenesCompra?.[0]?.paqueteId?.toLowerCase() || "").includes("basic")),
      modalidadRsvp: (dbEvento as any).modalidadRsvp || "HIBRIDO",
      permitirConfirmacionTelefono: (dbEvento as any).permitirConfirmacionTelefono !== false,
      bannerContactoActivo: (dbEvento as any).bannerContactoActivo === true,
      bannerContactoTexto: (dbEvento as any).bannerContactoTexto ?? null,
      bannerContactoTelefono: (dbEvento as any).bannerContactoTelefono ?? null,
      bannerContactoLlamar: (dbEvento as any).bannerContactoLlamar !== false,
      bannerContactoSms: (dbEvento as any).bannerContactoSms !== false,
    };
  }

  // 2. Demos estáticos de catálogo (solo si no es un evento registrado en base de datos)
  if (cleanSlug === "maydelin-mendez") return EVENT_MAYDELIN_MENDEZ;
  if (cleanSlug === "quince-rosado") return EVENT_MAYDELIN_MENDEZ;
  if (cleanSlug === "elsy-xv") return DEMO_ELSY;
  if (cleanSlug === "isabella-xv") return DEMO_ISABELLA;
  if (cleanSlug === "emma-and-lucas") return DEMO_EMMA_LUCAS;
  if (cleanSlug === "mariposas-xv") return DEMO_BUTTERFLY;
  if (cleanSlug === "coraline-party") return DEMO_CORALINE;
  if (cleanSlug === "sofia-y-alejandro") return DEMO_BODA;

  return null;
}

/**
 * OpenGraph dinámico para Facebook, WhatsApp y redes sociales.
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const cleanSlug = decodeURIComponent(resolvedParams?.slug || "").trim().toLowerCase();
  const data = await getEventoData(cleanSlug);

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
  const title = (data as any).ogTitulo?.trim() || `${tituloEvento} • ¡Tú estás invitado!`;

  const description =
    (data as any).ogDescripcion?.trim() ||
    (fechaTexto
      ? `${tituloEvento} • 📅 ${fechaTexto} • ✨ ¡Estás cordialmente invitado a celebrar con nosotros!`
      : `${tituloEvento} • ✨ ¡Estás cordialmente invitado a celebrar con nosotros!`);

  // Asegurar que la imagen sea URL absoluta con https para Facebook y WhatsApp
  const baseUrl =
    sanitizePublicBaseUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null) ||
    "https://clickandlove.app";

  let coverImage = data.fotoPortadaUrl || "/assets/template-butterfly/foto-columpio-portada.webp";
  if (coverImage.startsWith("/")) {
    coverImage = `${baseUrl}${coverImage}`;
  }

  const eventUrl = `${baseUrl}/${data.slug}`;

  const ogImageUrl = `${baseUrl}/api/og?slug=${data.slug}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
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

// Demos de marketing (Semana 2 del plan): el banner de contacto va siempre
// encendido en ellas, vengan de evento en DB o de demo estático. Los eventos
// reales de clientes siguen usando su ajuste propio.
const DEMO_BANNER_SLUGS = new Set([
  "isabella-xv",
  "mariposas-xv",
  "blush-princess-xv",
  "era-pink-xv",
  "miss-15-xv",
  "baby-blue-xv",
  "beauty-quince-xv",
]);

export default async function InvitationPage(props: PageProps) {
  const resolvedParams = await props.params;
  const cleanSlug = decodeURIComponent(resolvedParams?.slug || "").trim().toLowerCase();
  let data = await getEventoData(cleanSlug);

  if (!data) {
    notFound();
  }

  if (DEMO_BANNER_SLUGS.has(cleanSlug)) {
    data = {
      ...data,
      bannerContactoActivo: true,
      bannerContactoTexto: "¿Te gustó esta invitación? Haz la tuya",
      bannerContactoTelefono: "(818) 299-4882",
      bannerContactoLlamar: true,
      bannerContactoSms: true,
    };
  }

  return (
    <>
      <TemplateDispatcher data={data} />
      {/* Barra fija comercial (solo si el evento la activó en Ajustes) */}
      <ContactBanner data={data} />
    </>
  );
}
