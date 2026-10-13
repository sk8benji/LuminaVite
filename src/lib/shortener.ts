import prisma from "@/lib/db";
import crypto from "crypto";

/**
 * Genera o recupera un enlace corto interno para redirección de mapas.
 * Formato resultante: https://clickandlove.app/m/[code]
 */
export async function createShortMapLink(targetUrl: string): Promise<string> {
  const trimmed = (targetUrl || "").trim();
  if (!trimmed) return "";

  // Base URL de la app asegurando el dominio público oficial clickandlove.app
  // Los enlaces de mapas en SMS y admin deben apuntar a https://clickandlove.app (nunca a localhost)
  let rawBase =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://clickandlove.app";

  if (!rawBase || rawBase.includes("localhost") || rawBase.includes("127.0.0.1")) {
    rawBase = "https://clickandlove.app";
  }

  const normalizedBase = rawBase.startsWith("http")
    ? rawBase.replace(/\/$/, "")
    : `https://${rawBase.replace(/\/$/, "")}`;

  try {
    // 1. Reutilizar si ya existe un código para esta misma URL exacta
    const existing = await prisma.shortLink.findFirst({
      where: { url: trimmed },
      select: { code: true },
    });

    if (existing?.code) {
      return `${normalizedBase}/m/${existing.code}`;
    }

    // 2. Generar código único de 5 caracteres hex (1 millón de combinaciones)
    let code = crypto.randomBytes(3).toString("hex").slice(0, 5);

    // En caso improbable de colisión, intentar hasta 3 veces
    for (let i = 0; i < 3; i++) {
      const collision = await prisma.shortLink.findUnique({
        where: { code },
        select: { id: true },
      });
      if (!collision) break;
      code = crypto.randomBytes(3).toString("hex").slice(0, 5);
    }

    await prisma.shortLink.create({
      data: {
        code,
        url: trimmed,
      },
    });

    return `${normalizedBase}/m/${code}`;
  } catch (err: any) {
    console.warn("Aviso al crear ShortLink en BD:", err?.message || err);
    // Si la BD no está disponible o falla, devolver la URL original como fallback seguro
    return trimmed;
  }
}
