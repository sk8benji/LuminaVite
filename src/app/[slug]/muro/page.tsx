import { notFound } from "next/navigation";
import { normalizeSlug, getEventBySlug } from "@/lib/events";
import MuroClient from "./MuroClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MuroPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const cleanSlug = normalizeSlug(resolvedParams?.slug);
  const evento = await getEventBySlug(cleanSlug);
  if (!evento) notFound();

  if ((evento as any).fotosInvitadosActivas === false) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <p className="text-center text-stone-300">
          El muro de fotos está desactivado para este evento.
        </p>
      </main>
    );
  }

  return <MuroClient slug={cleanSlug} titulo={evento.titulo} />;
}
