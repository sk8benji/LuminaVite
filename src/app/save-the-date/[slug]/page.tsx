import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { ensureSaveTheDateTables } from "@/lib/save-the-date-table";
import QuinceRosadoSaveTheDate from "@/components/save-the-date/QuinceRosadoSaveTheDate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: Promise<{ preview?: string }>;
}

export const DEMO_SAVE_THE_DATE = {
  slug: "demo",
  titulo: "Melissa",
  subtitulo: "Mis Quince Años",
  subtituloEn: "My Sweet Fifteen",
  mensaje:
    "Guarda esta fecha especial en tu calendario. Muy pronto compartiremos todos los detalles y la invitación formal.",
  fechaEvento: new Date("2027-09-18T20:00:00Z"),
  fechaTextoPersonalizada: "Viernes 18 de Septiembre, 2026",
  fechaTextoPersonalizadaEn: "Friday, September 18, 2026",
  ciudad: "Los Ángeles, California",
  estiloPlantilla: "QUINCE_ROSADO",
  colorSobre: "#FFE8EE",
  colorSello: "#D4AF37",
  tipoLetra: "SERIF_ELEGANTE",
  fotoPortadaUrl: "/assets/save-the-date/principal.jpeg",
  fotoSobreAbiertoUrl: "/assets/save-the-date/f291897753a9fc56f20003d177749b21.webp",
  galeriaFotosUrls: [
    "/assets/save-the-date/save1.webp",
    "/assets/save-the-date/save2.webp",
    "/assets/save-the-date/save3.webp",
  ],
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  musicaTitulo: "A Thousand Years (Instrumental)",
  mostrarSobre: true,
  mostrarGaleria: true,
  mostrarContador: true,
  mostrarCalendario: true,
  mostrarPreRsvp: true,
  textoPreRsvp: "¿Podrás Acompañarnos?",
  telefonoWhatsapp: "18181234567",
  // Títulos bilingües configurables
  tituloCalendarioEs: "RESERVA LA FECHA",
  tituloCalendarioEn: "SAVE THE DATE",
  tituloContadorEs: "Solo Faltan...",
  tituloContadorEn: "Countdown...",
  tituloRsvpEs: "Confirmación Anticipada",
  tituloRsvpEn: "Early RSVP",
  preguntaRsvpEs: "¿Podrás Acompañarnos?",
  preguntaRsvpEn: "Will You Join Us?",
};

async function getSaveTheDateData(rawSlug: string) {
  const cleanSlug = decodeURIComponent(rawSlug || "").trim().toLowerCase();
  if (!cleanSlug) return null;

  try {
    await ensureSaveTheDateTables();
    const item = await prisma.saveTheDate.findUnique({
      where: { slug: cleanSlug },
      include: {
        evento: {
          select: {
            id: true,
            slug: true,
            titulo: true,
            telefonoWhatsappRsvp: true,
          },
        },
      },
    });

    if (item && item.activo) {
      // Incrementar contador de forma asíncrona
      prisma.saveTheDate
        .update({
          where: { id: item.id },
          data: { vistasContador: { increment: 1 } },
        })
        .catch(() => {});

      return {
        slug: item.slug,
        titulo: item.titulo,
        subtitulo: item.subtitulo,
        mensaje: item.mensaje,
        fechaEvento: item.fechaEvento,
        fechaTextoPersonalizada: item.fechaTextoPersonalizada,
        ciudad: item.ciudad,
        estiloPlantilla: item.estiloPlantilla,
        colorSobre: item.colorSobre,
        colorSello: item.colorSello,
        tipoLetra: item.tipoLetra,
        fotoPortadaUrl: item.fotoPortadaUrl,
        fotoSobreAbiertoUrl: (item as any).fotoSobreAbiertoUrl || "/assets/save-the-date/f291897753a9fc56f20003d177749b21.webp",
        galeriaFotosUrls: Array.isArray(item.galeriaFotosUrls) && item.galeriaFotosUrls.length > 0
          ? item.galeriaFotosUrls
          : DEMO_SAVE_THE_DATE.galeriaFotosUrls,
        musicaUrl: item.musicaUrl,
        musicaTitulo: item.musicaTitulo,
        mostrarSobre: item.mostrarSobre,
        mostrarGaleria: item.mostrarGaleria,
        mostrarContador: item.mostrarContador,
        mostrarCalendario: item.mostrarCalendario,
        mostrarPreRsvp: item.mostrarPreRsvp,
        textoPreRsvp: item.textoPreRsvp || "¿Podrás Acompañarnos?",
        telefonoWhatsapp:
          item.telefonoWhatsapp || item.evento?.telefonoWhatsappRsvp || null,
        tituloCalendarioEs: (item as any).tituloCalendarioEs || DEMO_SAVE_THE_DATE.tituloCalendarioEs,
        tituloCalendarioEn: (item as any).tituloCalendarioEn || DEMO_SAVE_THE_DATE.tituloCalendarioEn,
        tituloContadorEs: (item as any).tituloContadorEs || DEMO_SAVE_THE_DATE.tituloContadorEs,
        tituloContadorEn: (item as any).tituloContadorEn || DEMO_SAVE_THE_DATE.tituloContadorEn,
        tituloRsvpEs: (item as any).tituloRsvpEs || DEMO_SAVE_THE_DATE.tituloRsvpEs,
        tituloRsvpEn: (item as any).tituloRsvpEn || DEMO_SAVE_THE_DATE.tituloRsvpEn,
        preguntaRsvpEs: (item as any).preguntaRsvpEs || item.textoPreRsvp || DEMO_SAVE_THE_DATE.preguntaRsvpEs,
        preguntaRsvpEn: (item as any).preguntaRsvpEn || DEMO_SAVE_THE_DATE.preguntaRsvpEn,
        subtituloEn: (item as any).subtituloEn || DEMO_SAVE_THE_DATE.subtituloEn,
      };
    }
  } catch (error) {
    console.error("Error fetching SaveTheDate by slug:", error);
  }

  // Si no está en SaveTheDate pero se guardó en MasterTemplate (tab Templates del Admin)
  try {
    const isDemo = cleanSlug === "demo" || cleanSlug === "demo-quinceanera";
    const masterTpl = await (prisma as any).masterTemplate?.findFirst({
      where: {
        OR: [
          { slug: cleanSlug },
          { slug: `save-the-date-${cleanSlug}` },
          isDemo ? { slug: "save-the-date-quince-rosado" } : { id: "none" },
        ],
      },
    });

    if (masterTpl) {
      const extra = (masterTpl.configExtra as any) || {};
      const galeria = extra.galeriaFotosUrls || [
        masterTpl.fotoInfanciaUrl,
        masterTpl.fotoActualUrl,
        masterTpl.fotoCierreUrl,
      ].filter(Boolean);

      return {
        slug: cleanSlug,
        titulo: masterTpl.titulo || DEMO_SAVE_THE_DATE.titulo,
        subtitulo: masterTpl.subtitulo || DEMO_SAVE_THE_DATE.subtitulo,
        mensaje: masterTpl.frasePersonalizada || extra.mensaje || DEMO_SAVE_THE_DATE.mensaje,
        fechaEvento: extra.fechaEvento ? new Date(extra.fechaEvento) : DEMO_SAVE_THE_DATE.fechaEvento,
        fechaTextoPersonalizada: masterTpl.fechaTextoPersonalizada || DEMO_SAVE_THE_DATE.fechaTextoPersonalizada,
        ciudad: extra.ciudad || masterTpl.fechaPlacaLugar || DEMO_SAVE_THE_DATE.ciudad,
        estiloPlantilla: masterTpl.estiloPlantilla || "QUINCE_ROSADO",
        colorSobre: masterTpl.colorSobre || DEMO_SAVE_THE_DATE.colorSobre,
        colorSello: masterTpl.colorSello || DEMO_SAVE_THE_DATE.colorSello,
        tipoLetra: masterTpl.tipoLetra || "Cinzel",
        fotoPortadaUrl: masterTpl.fotoPortadaUrl || DEMO_SAVE_THE_DATE.fotoPortadaUrl,
        fotoSobreAbiertoUrl: extra.fotoSobreAbiertoUrl || DEMO_SAVE_THE_DATE.fotoSobreAbiertoUrl,
        galeriaFotosUrls: galeria.length > 0 ? galeria : DEMO_SAVE_THE_DATE.galeriaFotosUrls,
        musicaUrl: masterTpl.musicaUrl || DEMO_SAVE_THE_DATE.musicaUrl,
        musicaTitulo: masterTpl.musicaTitulo || DEMO_SAVE_THE_DATE.musicaTitulo,
        mostrarSobre: extra.mostrarSobre !== undefined ? extra.mostrarSobre : true,
        mostrarGaleria: extra.mostrarGaleria !== undefined ? extra.mostrarGaleria : true,
        mostrarContador: extra.mostrarContador !== undefined ? extra.mostrarContador : true,
        mostrarCalendario: extra.mostrarCalendario !== undefined ? extra.mostrarCalendario : true,
        mostrarPreRsvp: extra.mostrarPreRsvp !== undefined ? extra.mostrarPreRsvp : true,
        textoPreRsvp: extra.textoPreRsvp || DEMO_SAVE_THE_DATE.textoPreRsvp,
        telefonoWhatsapp: extra.telefonoWhatsapp || DEMO_SAVE_THE_DATE.telefonoWhatsapp,
        tituloCalendarioEs: extra.tituloCalendarioEs || DEMO_SAVE_THE_DATE.tituloCalendarioEs,
        tituloCalendarioEn: extra.tituloCalendarioEn || DEMO_SAVE_THE_DATE.tituloCalendarioEn,
        tituloContadorEs: extra.tituloContadorEs || DEMO_SAVE_THE_DATE.tituloContadorEs,
        tituloContadorEn: extra.tituloContadorEn || DEMO_SAVE_THE_DATE.tituloContadorEn,
        tituloRsvpEs: extra.tituloRsvpEs || DEMO_SAVE_THE_DATE.tituloRsvpEs,
        tituloRsvpEn: extra.tituloRsvpEn || DEMO_SAVE_THE_DATE.tituloRsvpEn,
        preguntaRsvpEs: extra.preguntaRsvpEs || extra.textoPreRsvp || DEMO_SAVE_THE_DATE.preguntaRsvpEs,
        preguntaRsvpEn: extra.preguntaRsvpEn || DEMO_SAVE_THE_DATE.preguntaRsvpEn,
        subtituloEn: extra.subtituloEn || DEMO_SAVE_THE_DATE.subtituloEn,
      };
    }
  } catch (mTplErr) {
    console.error("Error reading masterTemplate fallback for save the date:", mTplErr);
  }

  // Fallback a demo si el slug incluye 'demo'
  if (cleanSlug.includes("demo")) {
    return DEMO_SAVE_THE_DATE;
  }

  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getSaveTheDateData(resolvedParams.slug);

  if (!data) {
    return {
      title: "Save The Date | Click & Love",
    };
  }

  const title = `Save The Date - ${data.titulo}`;
  const description =
    data.subtitulo ||
    `Reserva la fecha para la gran celebración de ${data.titulo}.`;
  const image = data.fotoPortadaUrl || "/images/og-default.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: data.titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SaveTheDatePage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = await getSaveTheDateData(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  const skipIntro = resolvedSearchParams?.preview === "true";

  // Dispatcher por si agregamos más plantillas (de momento usa QuinceRosadoSaveTheDate)
  return <QuinceRosadoSaveTheDate data={data} skipIntro={skipIntro} />;
}
