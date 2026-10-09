import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSystemDemo, ALL_SYSTEM_DEMOS } from "@/lib/demo-data";
import TemplateDispatcher from "@/components/templates/TemplateDispatcher";

export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateStaticParams() {
  return Object.keys(ALL_SYSTEM_DEMOS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const data = getSystemDemo(resolvedParams?.slug);

  if (!data) {
    return {
      title: "Demo no encontrada | Click & Love",
      description: "Esta plantilla de demostración no existe.",
    };
  }

  return {
    title: `${data.titulo} • Demo Oficial Click & Love`,
    description: `Demostración interactiva de alta costura: ${data.subtitulo || data.titulo}`,
    openGraph: {
      title: `${data.titulo} • Demostración Interactiva`,
      description: `Experimenta el sobre 3D, música y RSVP de la colección ${data.titulo}.`,
      images: [data.fotoPortadaUrl],
    },
  };
}

export default async function DemoPage(props: PageProps) {
  const resolvedParams = await props.params;
  const data = getSystemDemo(resolvedParams?.slug);

  if (!data) {
    notFound();
  }

  return <TemplateDispatcher data={data} />;
}
