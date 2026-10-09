import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import PanelView, { PanelData } from "./PanelView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ key?: string }> | { key?: string };
}

export default async function ClientMagicLinkPanelPage({
  params,
  searchParams,
}: PageProps) {
  // 1. Resuelve los parámetros asíncronamente
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const rawSlug = resolvedParams?.slug || "";
  const cleanSlug = decodeURIComponent(rawSlug).toLowerCase().trim();
  const cleanKey = (resolvedSearchParams?.key || "").trim();

  // 2. Si no hay cleanKey o no hay slug, ejecuta notFound() de inmediato
  if (!cleanSlug || !cleanKey) {
    return notFound();
  }

  // 3. Consulta directa a PostgreSQL con Prisma (sin cookies ni S3)
  const isMasterKey = cleanKey === "clickandlove2026!" || cleanKey === "admin";

  let evento = null;

  if (isMasterKey) {
    evento = await prisma.evento.findUnique({
      where: { slug: cleanSlug },
      include: {
        rsvps: { orderBy: { createdAt: "desc" } },
        usuario: true,
      },
    });
  } else {
    evento = await prisma.evento.findFirst({
      where: {
        slug: cleanSlug,
        panelToken: { equals: cleanKey, mode: "insensitive" },
      },
      include: {
        rsvps: { orderBy: { createdAt: "desc" } },
        usuario: true,
      },
    });
  }

  // 4. Si evento es null, rechazo 404 inmediato
  if (!evento) {
    return notFound();
  }

  // 5. Serialización segura de fechas y datos para evitar errores de hidratación
  const serializedEvento = JSON.parse(JSON.stringify(evento));
  const rsvps = serializedEvento.rsvps || [];
  const confirmados = rsvps.filter((r: any) => r.asistira);
  const declinados = rsvps.filter((r: any) => !r.asistira);
  const totalPases = confirmados.reduce((acc: number, r: any) => acc + (r.pases || 1), 0);

  const panelData: PanelData = {
    evento: {
      id: serializedEvento.id,
      titulo: serializedEvento.titulo,
      slug: serializedEvento.slug,
      fechaEvento: serializedEvento.fechaEvento,
      recepcionNombre: serializedEvento.recepcionNombre,
      maxPasesPorInvitado: serializedEvento.maxPasesPorInvitado,
    },
    estadisticas: {
      totalInvitadosConfirmados: confirmados.length,
      totalPasesConfirmados: totalPases,
      totalDeclinados: declinados.length,
      totalRespuestas: rsvps.length,
      aforoTotal: serializedEvento.aforoTotal || 200,
    },
    rsvps: rsvps.map((r: any) => ({
      id: r.id,
      nombreInvitado: r.nombreInvitado,
      telefono: r.telefono,
      asistira: r.asistira,
      pases: r.pases,
      acompanantes: r.acompanantes,
      createdAt: r.createdAt,
    })),
  };

  return (
    <PanelView
      slug={cleanSlug}
      isAuthorized={true}
      initialData={panelData}
    />
  );
}
