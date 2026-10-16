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
export function getSiteUrl(): string {
  const v = process.env.NEXT_PUBLIC_SITE_URL;
  if (v && v.trim()) return v.trim().replace(/\/+$/, "");
  // Fallback al dominio canónico de producción
  return "https://clickandlove.app";
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
