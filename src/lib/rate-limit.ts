/**
 * Rate limiting simple en memoria (H1).
 * Suficiente para 1 réplica. Si se escala a múltiples réplicas,
 * migrar a Redis (Upstash).
 */

import { NextRequest, NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Limpieza periódica para no crecer sin límite
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k);
  }
}, 60_000).unref?.();

export interface RateLimitOptions {
  /** Ventana en milisegundos */
  windowMs: number;
  /** Máximo de requests por ventana */
  max: number;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Devuelve una respuesta 429 si se excede el límite, o null si puede continuar.
 */
export function checkRateLimit(
  req: NextRequest,
  key: string,
  opts: RateLimitOptions
): NextResponse | null {
  const ip = getClientIp(req);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();

  let bucket = buckets.get(bucketKey);
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + opts.windowMs };
    buckets.set(bucketKey, bucket);
  }

  bucket.count += 1;

  if (bucket.count > opts.max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  return null;
}

// Presets por endpoint
export const RATE_LIMITS = {
  login: { windowMs: 15 * 60_000, max: 10 }, // 10 intentos / 15 min
  panelAuth: { windowMs: 15 * 60_000, max: 20 }, // 20 intentos / 15 min
  rsvp: { windowMs: 60_000, max: 10 }, // 10 / minuto
  presignedUrl: { windowMs: 60_000, max: 20 }, // 20 / minuto
  translate: { windowMs: 60_000, max: 30 }, // 30 / minuto
  manualRequest: { windowMs: 60 * 60_000, max: 5 }, // 5 / hora
} satisfies Record<string, RateLimitOptions>;
