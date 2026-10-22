import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  buildPanelShortUrl,
  regeneratePanelShortCode,
} from "@/lib/panel-link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/admin/eventos/:slug/panel-link/regenerate
 * Regenera el link corto del panel (solo admin): emite un código nuevo y el
 * anterior deja de funcionar de inmediato (la resolución usa el valor actual
 * de Evento.panelShortCode). NO toca el panelToken: el Magic Link largo
 * sigue válido; esto rota solo el atajo corto.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const limited = checkRateLimit(req, "panel-link-regenerate", RATE_LIMITS.panelAuth);
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

    const panelShortCode = await regeneratePanelShortCode(evento.id);

    return NextResponse.json({
      success: true,
      slug: cleanSlug,
      panelShortCode,
      panelShortUrl: buildPanelShortUrl(panelShortCode),
    });
  } catch (error: any) {
    console.error("Error al regenerar link corto del panel:", error);
    return NextResponse.json(
      { error: "Error al regenerar el link corto del panel." },
      { status: 500 }
    );
  }
}
