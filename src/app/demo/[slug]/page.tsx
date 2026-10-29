import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMergedDemo } from "@/lib/template-demo-merge";
import TemplateDispatcher from "@/components/templates/TemplateDispatcher";
import DemoCtaBar from "@/components/demo/DemoCtaBar";

export const dynamic = "force-dynamic";
// Sin generateStaticParams: cada demo se resuelve en request con la DB (edits del admin).

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const data = await getMergedDemo(resolvedParams?.slug);

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
  const data = await getMergedDemo(resolvedParams?.slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="no-scrollbar overflow-x-hidden min-h-screen pb-24">
      <TemplateDispatcher data={data} />
      {/* Barra CTA fija (Semana 2): que la demo nunca sea un callejón sin salida */}
      <DemoCtaBar estiloPlantilla={data.estiloPlantilla} idioma={data.idiomaDefault} />
    </div>
  );
}
