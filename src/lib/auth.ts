/**
 * Click and love - Admin Authentication & Token Utilities
 * Uses Web Crypto API for compatibility across Edge Runtime & Node.js
 *
 * SECURITY: ADMIN_PASSWORD y ADMIN_SECRET NO tienen valores por defecto.
 * Si faltan, se lanza un error claro. Configúralos en Railway (Variables).
 */

import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "clickandlove_admin_session";

function missingEnvError(name: string): Error {
  return new Error(
    `[SEGURIDAD] Falta la variable de entorno ${name}. ` +
      `Configúrala en Railway (Variables del servicio) y redeploya. ` +
      `La app no arranca sin secretos de admin.`
  );
}

export function getAdminPassword(): string {
  const v = process.env.ADMIN_PASSWORD;
  if (!v) throw missingEnvError("ADMIN_PASSWORD");
  return v;
}

export function getAdminSecret(): string {
  const v = process.env.ADMIN_SECRET;
  if (!v) throw missingEnvError("ADMIN_SECRET");
  return v;
}

/**
 * Llave maestra opcional para el panel del anfitrión (solo Abraham).
 * Si MASTER_PANEL_KEY no está configurada, no existe llave maestra.
 * NUNCA hardcodear valores aquí.
 */
export function getMasterPanelKey(): string | null {
  const v = process.env.MASTER_PANEL_KEY;
  return v && v.trim() ? v.trim() : null;
}

export async function createAdminToken(): Promise<string> {
  const secret = getAdminSecret();
  const password = getAdminPassword();
  const time = Date.now().toString();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${time}:${password}`)
  );
  const hashHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${time}.${hashHex}`;
}

export async function verifyAdminToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timeStr, hashHex] = parts;
  const time = parseInt(timeStr, 10);
  if (isNaN(time)) return false;

  // Sesión válida por 14 días
  if (Date.now() - time > 14 * 24 * 60 * 60 * 1000) return false;

  const secret = getAdminSecret();
  const password = getAdminPassword();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${time}:${password}`)
  );
  const expectedHash = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Comparación timing-safe (constante en tiempo, sin node:crypto para Edge)
  if (hashHex.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < hashHex.length; i++) {
    diff |= hashHex.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Guard para rutas API de administración.
 * Devuelve null si el request está autorizado, o una respuesta 401 si no.
 *
 * Uso:
 *   const unauthorized = await requireAdmin(req);
 *   if (unauthorized) return unauthorized;
 */
export async function requireAdmin(
  req: NextRequest
): Promise<NextResponse | null> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifyAdminToken(token);
  if (!ok) {
    return NextResponse.json(
      { error: "No autorizado. Inicia sesión como administrador." },
      { status: 401 }
    );
  }
  return null;
}
