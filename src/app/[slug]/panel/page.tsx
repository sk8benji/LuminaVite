import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/db";
import {
  generatePanelToken,
  getPanelCookieName,
  getPanelCookieOptions,
  verifyPanelAuth,
} from "@/lib/panel-auth";
import { normalizeSlug, getEventBySlug, validateEventKey } from "@/lib/events";
import PanelView, { PanelData } from "./PanelView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ key?: string; error?: string }> | { key?: string; error?: string };
}

export default async function ClientMagicLinkPanelPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const rawSlug = resolvedParams?.slug || "";
  const slug = normalizeSlug(rawSlug);
  const key = resolvedSearchParams?.key ? String(resolvedSearchParams.key).trim() : undefined;
  const errorParam = resolvedSearchParams?.error ? String(resolvedSearchParams.error).trim() : undefined;

  if (!slug) {
    notFound();
  }

  const cookieStore = await cookies();
  const cookieName = getPanelCookieName(slug);
  const sessionCookie = cookieStore.get(cookieName)?.value;

  // Clave maestra de soporte o clave enviada en query params
  const cleanKey = key || "";
  const isMasterKey = cleanKey === "clickandlove2026!" || cleanKey === "admin";

  let evento = null;

  // 1. Si viene con ?key=... en la URL
  if (cleanKey) {
    if (isMasterKey) {
      evento = await prisma.evento.findUnique({
        where: { slug },
        include: { rsvps: { orderBy: { createdAt: "desc" } } },
      });
    } else {
      // VALIDACIÓN SQL DIRECTA: La base de datos valida la coincidencia en la misma consulta
      evento = await prisma.evento.findFirst({
        where: {
          slug,
          panelToken: { equals: cleanKey, mode: "insensitive" },
        },
        include: {
          rsvps: { orderBy: { createdAt: "desc" } },
        },
      });
    }

    if (!evento) {
      // Si la key no coincide con la BD, 404 inmediato
      return notFound();
    }

    // Si coincide, asentar cookie HttpOnly para visitas posteriores sin requerir volver a escribir la clave
    if (evento.panelToken) {
      try {
        const signedToken = generatePanelToken(slug, evento.panelToken);
        const cookieOpts = getPanelCookieOptions();
        cookieStore.set(cookieName, signedToken, cookieOpts);
      } catch (e) {
        // En Next.js Server Components, si las cabeceras ya se enviaron, ignorar error de cookie
      }
    }
  } else {
    // 2. Si no viene key en la URL, verificar la cookie de sesión previa
    const isSessionValid = await verifyPanelAuth(slug, sessionCookie);
    if (!isSessionValid) {
      return (
        <PanelView
          slug={slug}
          isAuthorized={false}
          errorMessage={errorParam}
        />
      );
    }

    evento = await prisma.evento.findUnique({
      where: { slug },
      include: {
        rsvps: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!evento) {
      return notFound();
    }
  }

  const rsvps = evento.rsvps || [];
  const confirmados = rsvps.filter((r) => r.asistira);
  const declinados = rsvps.filter((r) => !r.asistira);
  const totalPases = confirmados.reduce((acc, r) => acc + (r.pases || 1), 0);

  const fechaEventoStr = evento.fechaEvento instanceof Date
    ? evento.fechaEvento.toISOString()
    : evento.fechaEvento
    ? new Date(evento.fechaEvento).toISOString()
    : new Date().toISOString();

  const panelData: PanelData = {
    evento: {
      id: evento.id,
      titulo: evento.titulo,
      slug: evento.slug,
      fechaEvento: fechaEventoStr,
      recepcionNombre: evento.recepcionNombre,
      maxPasesPorInvitado: evento.maxPasesPorInvitado,
    },
    estadisticas: {
      totalInvitadosConfirmados: confirmados.length,
      totalPasesConfirmados: totalPases,
      totalDeclinados: declinados.length,
      totalRespuestas: rsvps.length,
      aforoTotal: evento.aforoTotal || 200,
    },
    rsvps: rsvps.map((r) => ({
      id: r.id,
      nombreInvitado: r.nombreInvitado,
      telefono: r.telefono,
      asistira: r.asistira,
      pases: r.pases,
      acompanantes: r.acompanantes,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return (
    <PanelView
      slug={slug}
      isAuthorized={true}
      initialData={panelData}
    />
  );
}
