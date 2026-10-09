/**
 * Click and love - Admin Authentication & Token Utilities
 * Uses Web Crypto API for compatibility across Edge Runtime & Node.js
 */

export const ADMIN_COOKIE_NAME = "clickandlove_admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "ClickAndLove2026!";
}

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || "click-and-love-secret-admin-key-2026";
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

  return hashHex === expectedHash;
}
