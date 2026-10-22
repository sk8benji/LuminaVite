import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isPanelShortCode, resolvePanelShortCode } from "@/lib/panel-link";
import { getSiteUrl } from "@/lib/url-safety";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> | { code: string } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const code = (resolvedParams?.code || "").trim();

  if (!code) {
    return NextResponse.redirect(new URL("/", getSiteUrl()));
  }

  // Link corto del PANEL del anfitrión (10 caracteres, alfabeto sin ambiguos):
  // se resuelve contra el evento y redirige con el panelToken ACTUAL.
  // Código inexistente o revocado → 404 limpio, sin filtrar información.
  // (Los códigos de mapas de ShortLink son 5 hex y siguen su flujo de abajo.)
  if (isPanelShortCode(code)) {
    try {
      const target = await resolvePanelShortCode(code);
      if (!target) {
        return new NextResponse("Enlace no encontrado.", { status: 404 });
      }
      const path = target.panelToken
        ? `/${target.slug}/panel?key=${encodeURIComponent(target.panelToken)}`
        : `/${target.slug}/panel`;
      return NextResponse.redirect(new URL(path, getSiteUrl()), 302);
    } catch (err) {
      console.warn("Error en redirección de link corto de panel:", err);
      return new NextResponse("Enlace no encontrado.", { status: 404 });
    }
  }

  try {
    const shortLink = await prisma.shortLink.findUnique({
      where: { code },
    });

    if (!shortLink?.url) {
      return NextResponse.redirect(new URL("/", getSiteUrl()));
    }

    return NextResponse.redirect(shortLink.url, 302);
  } catch (err) {
    console.warn("Error en redirección de ShortLink:", err);
    return NextResponse.redirect(new URL("/", getSiteUrl()));
  }
}
