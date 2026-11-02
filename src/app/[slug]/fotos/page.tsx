import { notFound } from "next/navigation";
import { normalizeSlug, getEventBySlug } from "@/lib/events";
import FotosUploadClient from "./FotosUploadClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FotosPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const cleanSlug = normalizeSlug(resolvedParams?.slug);
  const evento = await getEventBySlug(cleanSlug);
  if (!evento) notFound();

  const activas = (evento as any).fotosInvitadosActivas !== false;
  if (!activas) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-3 shadow">
          <p className="text-4xl">📸</p>
          <h1 className="text-2xl font-bold">Subir fotos</h1>
          <p className="text-stone-600">
            La subida de fotos está desactivada para este evento.
          </p>
          <a
            href={`/${cleanSlug}`}
            className="inline-block mt-2 px-6 py-3 rounded-2xl bg-[#7A002A] text-white font-bold"
          >
            Ver invitación
          </a>
        </div>
      </main>
    );
  }

  return (
    <FotosUploadClient
      slug={cleanSlug}
      titulo={evento.titulo}
      idiomaDefault={evento.idiomaDefault === "en" ? "en" : "es"}
    />
  );
}
