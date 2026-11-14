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
  mensaje:
    "Guarda esta fecha especial en tu calendario. Muy pronto compartiremos todos los detalles y la invitación formal.",
  fechaEvento: new Date("2026-09-18T20:00:00Z"),
  fechaTextoPersonalizada: "Viernes 18 de Septiembre, 2026",
  ciudad: "Los Ángeles, California",
  estiloPlantilla: "QUINCE_ROSADO",
  colorSobre: "#FFE8EE",
  colorSello: "#D4AF37",
  tipoLetra: "SERIF_ELEGANTE",
  fotoPortadaUrl: "/assets/save-the-date/principal.jpeg",
  galeriaFotosUrls: [
    "/assets/save-the-date/f291897753a9fc56f20003d177749b21.webp",
    "/assets/save-the-date/principal.jpeg",
    "/assets/template-rose/722d78548334333072ad7200e4f8233e.webp",
  ],
  musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  musicaTitulo: "A Thousand Years (Instrumental)",
  mostrarSobre: true,
  mostrarGaleria: true,
  mostrarContador: true,
  mostrarCalendario: true,
  mostrarPreRsvp: true,
  textoPreRsvp:
    "¿Crees que podrás acompañarnos? Ayúdanos confirmando tu asistencia tentativa.",
  telefonoWhatsapp: "18181234567",
};

async function getSaveTheDateData(rawSlug: string) {
  const cleanSlug = decodeURIComponent(rawSlug || "").trim().toLowerCase();
  if (!cleanSlug) return null;

  if (cleanSlug === "demo" || cleanSlug === "demo-quinceanera") {
    return DEMO_SAVE_THE_DATE;
  }

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
        galeriaFotosUrls: Array.isArray(item.galeriaFotosUrls)
          ? item.galeriaFotosUrls
          : [],
        musicaUrl: item.musicaUrl,
        musicaTitulo: item.musicaTitulo,
        mostrarSobre: item.mostrarSobre,
        mostrarGaleria: item.mostrarGaleria,
        mostrarContador: item.mostrarContador,
        mostrarCalendario: item.mostrarCalendario,
        mostrarPreRsvp: item.mostrarPreRsvp,
        textoPreRsvp: item.textoPreRsvp,
        telefonoWhatsapp:
          item.telefonoWhatsapp || item.evento?.telefonoWhatsappRsvp || null,
      };
    }
  } catch (error) {
    console.error("Error fetching SaveTheDate by slug:", error);
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
