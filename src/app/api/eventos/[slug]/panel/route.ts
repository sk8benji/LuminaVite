import { NextRequest, NextResponse } from "next/server";
import { getPanelCookieName, verifyPanelAuth } from "@/lib/panel-auth";
import { normalizeSlug, getEventBySlug, validateEventKey } from "@/lib/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = context?.params ? await context.params : null;
    let slug = resolvedParams?.slug;
    if (!slug) {
      const url = new URL(req.url);
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.indexOf("eventos");
      if (idx !== -1 && parts[idx + 1] && parts[idx + 1] !== "panel") {
        slug = parts[idx + 1];
      }
    }
    const cleanSlug = normalizeSlug(slug);

    const { searchParams } = new URL(req.url);
    const queryKey = searchParams.get("key")?.trim();

    // 1. Validar autorización vía Cookie de Sesión HttpOnly o vía Clave en Query
    const cookieName = getPanelCookieName(cleanSlug);
    const sessionCookie = req.cookies.get(cookieName)?.value;

    let isAuthorized = false;
    if (sessionCookie) {
      isAuthorized = await verifyPanelAuth(cleanSlug, sessionCookie);
    }

    // 2. Consultar el evento directamente en PostgreSQL vía getEventBySlug
    const evento = await getEventBySlug(cleanSlug);

    if (!evento) {
      return NextResponse.json(
        { error: "Evento no encontrado en la base de datos." },
        { status: 404 }
      );
    }

    // Si aún no está autorizado por cookie, validar por queryKey
    if (!isAuthorized && queryKey) {
      isAuthorized = validateEventKey(queryKey, evento.panelToken);
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Acceso no autorizado. Inicia sesión en tu panel con tu clave." },
        { status: 401 }
      );
    }

    // 3. Calcular estadísticas en tiempo real
    const rsvps = evento.rsvps || [];
    const confirmados = rsvps.filter((r) => r.asistira);
    const declinados = rsvps.filter((r) => !r.asistira);
    const totalPases = confirmados.reduce((acc, r) => acc + (r.pases || 1), 0);

    return NextResponse.json({
      evento: {
        id: evento.id,
        titulo: evento.titulo,
        slug: evento.slug,
        fechaEvento: evento.fechaEvento,
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
      rsvps,
    });
  } catch (error: any) {
    console.error("Error al obtener panel de evento en PostgreSQL:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
