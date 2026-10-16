import { NextRequest, NextResponse } from "next/server";
import { extractCleanMapUrl } from "@/lib/mapsUrlCleaner";
import { createShortMapLink } from "@/lib/shortener";
import { requireAdmin } from "@/lib/auth";
import { isSafeHttpUrl } from "@/lib/url-safety";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const { url, name, address } = body;

    // H4: solo URLs http(s) para evitar open-redirect a javascript:/data:
    if (url && !isSafeHttpUrl(url)) {
      return NextResponse.json(
        { error: "URL no permitida. Solo se aceptan URLs http(s)." },
        { status: 400 }
      );
    }

    if (!url && !name && !address) {
      return NextResponse.json(
        { error: "Se requiere URL o nombre/dirección de ubicación." },
        { status: 400 }
      );
    }

    const cleanUrl = extractCleanMapUrl(url, name, address);
    if (!cleanUrl) {
      return NextResponse.json(
        { error: "No se pudo generar un enlace válido." },
        { status: 400 }
      );
    }

    const shortUrl = await createShortMapLink(cleanUrl);

    return NextResponse.json({
      success: true,
      rawInput: url,
      cleanUrl,
      shortUrl,
    });
  } catch (err: any) {
    console.error("Error en /api/admin/shorten:", err);
    return NextResponse.json(
      { error: err?.message || "Error al procesar enlace." },
      { status: 500 }
    );
  }
}
