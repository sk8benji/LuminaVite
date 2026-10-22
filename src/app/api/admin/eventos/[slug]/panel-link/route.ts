import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  buildPanelShortUrl,
  getOrCreatePanelShortCode,
} from "@/lib/panel-link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/admin/eventos/:slug/panel-link
 * Devuelve el link corto del panel del evento (solo admin).
 * Si el evento aún no tiene código, lo genera en este momento (perezoso).
 * El código se resuelve contra el evento al redirigir, con el panelToken
 * ACTUAL: rotar la key NO rompe el link corto.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const limited = checkRateLimit(req, "panel-link", RATE_LIMITS.panelAuth);
  if (limited) return limited;

  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const resolvedParams = context?.params ? await context.params : null;
    const cleanSlug = normalizeSlug(resolvedParams?.slug || "");

    if (!cleanSlug) {
      return NextResponse.json(
        { error: "Slug de evento requerido." },
        { status: 400 }
      );
    }

    const evento = await prisma.evento.findUnique({
      where: { slug: cleanSlug },
      select: { id: true, slug: true },
    });

    if (!evento) {
      return NextResponse.json(
        { error: "Evento no encontrado." },
        { status: 404 }
      );
    }

    const panelShortCode = await getOrCreatePanelShortCode(evento.id);

    return NextResponse.json({
      success: true,
      slug: cleanSlug,
      panelShortCode,
      panelShortUrl: buildPanelShortUrl(panelShortCode),
    });
  } catch (error: any) {
    console.error("Error al obtener link corto del panel:", error);
    return NextResponse.json(
      { error: "Error al obtener el link corto del panel." },
      { status: 500 }
    );
  }
}
