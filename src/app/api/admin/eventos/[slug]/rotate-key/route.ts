import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/admin/eventos/:slug/rotate-key
 * Rota el panelToken de un evento (solo admin).
 * Genera un token nuevo de 32 bytes aleatorios e invalida el anterior.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const limited = checkRateLimit(req, "rotate-key", RATE_LIMITS.panelAuth);
  if (limited) return limited;

  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const resolvedParams = context?.params ? await context.params : null;
    const rawSlug = resolvedParams?.slug || "";
    const cleanSlug = normalizeSlug(rawSlug);

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

    // Token nuevo de 32 bytes aleatorios (64 hex) — fuerza bruta inviable
    const newPanelToken = randomBytes(32).toString("hex");

    await prisma.evento.update({
      where: { slug: cleanSlug },
      data: { panelToken: newPanelToken },
    });

    return NextResponse.json({
      success: true,
      slug: cleanSlug,
      panelToken: newPanelToken,
    });
  } catch (error: any) {
    console.error("Error al rotar panelToken:", error);
    return NextResponse.json(
      { error: "Error al rotar la clave del panel." },
      { status: 500 }
    );
  }
}
