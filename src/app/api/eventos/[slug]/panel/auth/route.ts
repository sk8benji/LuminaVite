import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  generatePanelToken,
  getPanelCookieName,
  getPanelCookieOptions,
} from "@/lib/panel-auth";
import { normalizeSlug, validateEventKey } from "@/lib/events";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = context?.params ? await context.params : null;
  let slug = resolvedParams?.slug;
  if (!slug) {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("eventos");
    if (idx !== -1 && parts[idx + 1]) {
      slug = parts[idx + 1];
    }
  }
  const cleanSlug = normalizeSlug(slug);
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key")?.trim();

  const baseUrl = req.nextUrl.origin || "https://clickandlove.app";
  const panelRedirectUrl = new URL(`/${cleanSlug}/panel`, baseUrl);

  if (!key) {
    panelRedirectUrl.searchParams.set("error", "clave_requerida");
    return NextResponse.redirect(panelRedirectUrl);
  }

  try {
    const evento = await prisma.evento.findUnique({
      where: { slug: cleanSlug },
      select: { panelToken: true },
    });

    const isAuthorized = validateEventKey(key, evento?.panelToken);

    if (!isAuthorized || !evento?.panelToken) {
      panelRedirectUrl.searchParams.set("error", "clave_incorrecta");
      return NextResponse.redirect(panelRedirectUrl);
    }

    // Clave válida: generar sesión segura y redirigir limpiando la URL
    const signedToken = generatePanelToken(cleanSlug, evento.panelToken);
    const cookieName = getPanelCookieName(cleanSlug);
    const cookieOpts = getPanelCookieOptions();

    const response = NextResponse.redirect(panelRedirectUrl);
    response.cookies.set(cookieName, signedToken, cookieOpts);
    return response;
  } catch (error) {
    console.error("Error en auth GET de panel:", error);
    panelRedirectUrl.searchParams.set("error", "error_servidor");
    return NextResponse.redirect(panelRedirectUrl);
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = context?.params ? await context.params : null;
  let slug = resolvedParams?.slug;
  if (!slug) {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("eventos");
    if (idx !== -1 && parts[idx + 1]) {
      slug = parts[idx + 1];
    }
  }
  const cleanSlug = normalizeSlug(slug);

  try {
    const body = await req.json();
    const key = (body?.key || "").trim();

    if (!key) {
      return NextResponse.json(
        { error: "Por favor ingresa tu clave de anfitrión." },
        { status: 400 }
      );
    }

    const evento = await prisma.evento.findUnique({
      where: { slug: cleanSlug },
      select: { panelToken: true },
    });

    const isAuthorized = validateEventKey(key, evento?.panelToken);

    if (!isAuthorized || !evento?.panelToken) {
      return NextResponse.json(
        { error: "La clave ingresada no es válida para este evento." },
        { status: 401 }
      );
    }

    const signedToken = generatePanelToken(cleanSlug, evento.panelToken);
    const cookieName = getPanelCookieName(cleanSlug);
    const cookieOpts = getPanelCookieOptions();

    const response = NextResponse.json({
      success: true,
      message: "Acceso autorizado.",
    });
    response.cookies.set(cookieName, signedToken, cookieOpts);
    return response;
  } catch (error) {
    console.error("Error en auth POST de panel:", error);
    return NextResponse.json(
      { error: "Error al verificar la clave de acceso." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = context?.params ? await context.params : null;
  const slug = normalizeSlug(resolvedParams?.slug);
  const cookieName = getPanelCookieName(slug);

  const response = NextResponse.json({ success: true, message: "Sesión cerrada." });
  response.cookies.delete(cookieName);
  return response;
}
