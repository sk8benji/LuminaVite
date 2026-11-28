import { ImageResponse } from "next/og";
import { getInvitationBaseUrl } from "@/lib/url-safety";
import { NextRequest } from "next/server";
import { normalizeSlug, getEventBySlug } from "@/lib/events";

export const runtime = "nodejs";

// La foto de portada para el OG: satori (next/og) solo acepta PNG/JPEG.
// Las fotos webp (Maydelin y el fallback del template) hay que convertirlas
// a JPEG con el optimizador de Next antes de incrustarlas. Si la descarga
// falla (S3 a veces aborta la conexión), se devuelve null y la tarjeta se
// renderiza sin foto en vez de dar 500.
async function getOgPhotoSrc(photoUrl: string, baseUrl: string): Promise<string | null> {
  try {
    const res = await fetch(photoUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") || "").toLowerCase();
    if (type.includes("image/jpeg") || type.includes("image/png")) {
      return photoUrl; // satori lo carga directo
    }
    // webp u otro formato: convertir a JPEG vía el optimizador de Next
    const toOptimize = photoUrl.startsWith(baseUrl) ? photoUrl.slice(baseUrl.length) : photoUrl;
    const optUrl = `${baseUrl}/_next/image?url=${encodeURIComponent(toOptimize)}&w=828&q=75`;
    const optRes = await fetch(optUrl, {
      headers: { Accept: "image/jpeg" },
      signal: AbortSignal.timeout(10000),
    });
    if (!optRes.ok) return null;
    const buf = Buffer.from(await optRes.arrayBuffer());
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get("slug");
    const slug = normalizeSlug(rawSlug);

    if (!slug) {
      return new Response("Slug parameter is required", { status: 400 });
    }

    // 1. Obtener datos del evento desde PostgreSQL vía getEventBySlug
    const evento = await getEventBySlug(slug);

    const baseUrl = getInvitationBaseUrl();

    const isEn = evento?.idiomaDefault === "en";

    // Tipo de evento
    let tipoTexto = "Mis Quince Años";
    if (evento?.tipoEvento === "BODA") {
      tipoTexto = isEn ? "Our Wedding" : "Nuestra Boda";
    } else if (evento?.tipoEvento === "CUMPLEANOS") {
      tipoTexto = isEn ? "Birthday Celebration" : "Mi Cumpleaños";
    }

    const nombre = evento?.titulo || "Celebración Especial";

    // Fecha
    let fechaTexto = evento?.fechaTextoPersonalizada;
    if (!fechaTexto && evento?.fechaEvento) {
      const d = new Date(evento.fechaEvento);
      if (!isNaN(d.getTime())) {
        fechaTexto = d.toLocaleDateString(isEn ? "en-US" : "es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
    if (!fechaTexto) {
      fechaTexto = isEn ? "Special Date" : "Fecha Especial";
    }

    // Foto de portada
    let photoUrl = (evento as any)?.ogImagenUrl || evento?.fotoPortadaUrl || "/assets/template-butterfly/foto-columpio-portada.webp";
    if (photoUrl.startsWith("/")) {
      photoUrl = `${baseUrl}${photoUrl}`;
    }
    const photoSrc = await getOgPhotoSrc(photoUrl, baseUrl);

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            backgroundColor: "#0F172A",
            backgroundImage: "radial-gradient(circle at 75% 30%, #1E3A8A 0%, #0F172A 70%)",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "45px 55px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Lado Izquierdo: Información del evento */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "620px",
              paddingRight: "25px",
            }}
          >
            {/* Badge de tipo de evento */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
                letterSpacing: "4px",
                color: "#93C5FD",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: "14px",
              }}
            >
              👑 {tipoTexto.toUpperCase()}
            </div>

            {/* Nombre de la Festejada / Pareja */}
            <div
              style={{
                fontSize: "58px",
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.1,
                marginBottom: "20px",
                textShadow: "0 4px 16px rgba(0,0,0,0.6)",
              }}
            >
              {nombre}
            </div>

            {/* Fecha destacada */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "24px",
                color: "#FDE047",
                fontWeight: 600,
                marginBottom: "26px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              📅 {fechaTexto}
            </div>

            {/* Call to action "Tú estás invitado" */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
                fontWeight: 600,
                color: "#FFFFFF",
                backgroundColor: "rgba(216, 183, 114, 0.25)",
                border: "2px solid #D8B772",
                padding: "12px 24px",
                borderRadius: "9999px",
                alignSelf: "flex-start",
              }}
            >
              ✨ ¡Tú estás invitado! • Toca para abrir
            </div>
          </div>

          {/* Lado Derecho: Fotografía Principal de la Festejada */}
          {photoSrc ? (
            <div
              style={{
                display: "flex",
                width: "420px",
                height: "540px",
                borderRadius: "28px",
                overflow: "hidden",
                border: "5px solid #D8B772",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.7)",
                backgroundColor: "#1E293B",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc}
                alt={nombre}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                width: "420px",
                height: "540px",
                borderRadius: "28px",
                border: "5px solid #D8B772",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.7)",
                backgroundColor: "#1E293B",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "120px",
              }}
            >
              👑
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (err: any) {
    console.error("Error generating OG image:", err);
    return new Response("Error generating image", { status: 500 });
  }
}
