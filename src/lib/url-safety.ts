/**
 * Utilidades de sanitización de URLs (C6).
 * Previene XSS almacenado vía javascript:/data:/vbscript: en campos de URL
 * que el anfitrión (o un atacante) puede guardar en el evento.
 */

/**
 * Devuelve true solo si la URL usa esquema http: o https:.
 * Rechaza javascript:, data:, vbscript:, file:, etc.
 */
export function isSafeHttpUrl(raw: unknown): boolean {
  if (typeof raw !== "string") return false;
  const url = raw.trim();
  if (!url) return false;
  // Bloquea esquemas peligrosos incluso con mayúsculas, espacios o entidades
  const lower = url.toLowerCase().replace(/[\s\u200b-\u200d\ufeff]/g, "");
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    // URLs relativas (ej. /fotos/x.jpg) se consideran seguras
    return url.startsWith("/") && !url.startsWith("//");
  }
}

/**
 * Devuelve la URL si es segura, o null si debe descartarse.
 */
export function sanitizeUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const url = raw.trim();
  if (!url) return null;
  return isSafeHttpUrl(url) ? url : null;
}

/**
 * URL base del sitio para magic links, emails y redirects (H3).
 * NUNCA usar headers host/origin del request: un atacante puede inyectar
 * un dominio malicioso y robar panelTokens vía phishing.
 */
export const CANONICAL_SITE_URL = "https://clickandlove.app";

/**
 * Sanea una URL base candidata (de env vars): devuelve null si no es una URL
 * pública válida (localhost, 127.*, 0.0.0.0, ::1, *.local, sin TLD, esquema
 * no-http). Las env vars de desarrollo JAMÁS deben filtrarse a links que
 * reciben clientes (magic links, emails, redirects): en Railway quedó
 * NEXT_PUBLIC_SITE_URL=http://localhost:3000 y los /m redirigían a localhost.
 */
export function sanitizePublicBaseUrl(raw?: string | null): string | null {
  if (!raw || !raw.trim()) return null;
  let v = raw.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.startsWith("127.") ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      !host.includes(".")
    ) {
      return null;
    }
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  return sanitizePublicBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? CANONICAL_SITE_URL;
}

/**
 * ÚNICA fuente de verdad para las URLs de cara al invitado: canonical,
 * og:url, og:image, QR de invitados y enlaces cortos /m/ y /q/.
 * Es getSiteUrl() (NEXT_PUBLIC_SITE_URL saneada, fallback
 * https://clickandlove.app — variable confirmada en Railway).
 *
 * NUNCA usar NEXT_PUBLIC_APP_URL ni RAILWAY_PUBLIC_DOMAIN aquí: el dominio
 * público de Railway del servicio es el del admin (admin.clickandlove.app),
 * y con esa base el canonical/OG de cada invitación anunciaba el admin al
 * compartir por WhatsApp/Facebook. Tampoco usar host/origin del request
 * (ver comentario en getSiteUrl: riesgo de phishing con panelTokens).
 *
 * Cuando se migre a invitaciones.clickandlove.app, ESTE es el único punto
 * a cambiar (la base pasará a ese subdominio).
 */
export function getInvitationBaseUrl(): string {
  return getSiteUrl();
}
export const EVENT_URL_FIELDS = [
  "fotoPortadaUrl",
  "fotoInfanciaUrl",
  "fotoActualUrl",
  "fotoCierreUrl",
  "fotoZapato1Url",
  "fotoZapato2Url",
  "musicaUrl",
  "videoUrl",
  "wishlistUrl",
  "ceremoniaMapUrl",
  "recepcionMapUrl",
] as const;

/**
 * Sanitiza in-place los campos URL de un body de evento.
 */
export function sanitizeEventUrls(body: Record<string, any>): void {
  for (const f of EVENT_URL_FIELDS) {
    const v = body[f];
    if (v !== undefined && v !== null && v !== "") {
      body[f] = sanitizeUrl(v);
    }
  }
  // Galería: filtrar URLs inseguras
  if (Array.isArray(body.galeriaFotosUrls)) {
    body.galeriaFotosUrls = body.galeriaFotosUrls.filter((u: unknown) =>
      isSafeHttpUrl(u)
    );
  }
}
