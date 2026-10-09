import crypto from "crypto";
import prisma from "@/lib/db";
import { normalizeSlug, normalizeKey, validateEventKey } from "@/lib/events";

const SECRET = process.env.ADMIN_SECRET || process.env.PANEL_SECRET || "clickandlove-luxury-panel-salt-2026";

export function getPanelCookieName(slug: string): string {
  const cleanSlug = normalizeSlug(slug).replace(/[^a-z0-9]/g, "_");
  return `panel_session_${cleanSlug}`;
}

export function getPanelCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  };
}

/**
 * Genera un token firmado criptográficamente para la sesión de un anfitrión.
 * Usa claves normalizadas para evitar desajustes de mayúsculas/espacios.
 */
export function generatePanelToken(slug: string, panelToken: string): string {
  const cleanSlug = normalizeSlug(slug);
  const cleanToken = normalizeKey(panelToken);
  const payload = `${cleanSlug}:${cleanToken}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${hmac}`;
}

/**
 * Valida si un token de sesión o clave es válida para el evento en PostgreSQL.
 * Comparación case-insensitive y determinista.
 */
export async function verifyPanelAuth(slug: string, rawToken: string | undefined | null): Promise<boolean> {
  if (!rawToken || !slug) return false;
  const cleanSlug = normalizeSlug(slug);
  const cleanToken = normalizeKey(rawToken);

  try {
    const evento = await prisma.evento.findUnique({
      where: { slug: cleanSlug },
      select: { panelToken: true },
    });

    if (!evento || !evento.panelToken) {
      return false;
    }

    const expectedPanelToken = normalizeKey(evento.panelToken);

    // 1. Verificación directa si el token recibido es la clave en texto plano
    if (validateEventKey(cleanToken, expectedPanelToken)) {
      return true;
    }

    // 2. Verificación si es un token firmado (base64url.hmac)
    const parts = rawToken.trim().split(".");
    if (parts.length === 2) {
      const [encodedPayload, receivedHmac] = parts;
      const decodedPayload = Buffer.from(encodedPayload, "base64url").toString("utf-8");
      const [tokenSlug, tokenKey] = decodedPayload.split(":");

      if (tokenSlug === cleanSlug && tokenKey === expectedPanelToken) {
        const expectedHmac = crypto.createHmac("sha256", SECRET).update(decodedPayload).digest("hex");
        const a = Buffer.from(receivedHmac, "hex");
        const b = Buffer.from(expectedHmac, "hex");
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
          return true;
        }
      }
    }

    return false;
  } catch (err) {
    console.error("Error al validar autorización del panel:", err);
    return false;
  }
}
