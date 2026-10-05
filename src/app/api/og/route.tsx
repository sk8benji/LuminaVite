import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { fallbackEventStore } from "@/lib/event-fallback-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug")?.toLowerCase().trim();

    if (!slug) {
      return new Response("Slug parameter is required", { status: 400 });
    }

    // 1. Obtener datos del evento desde DB o fallback
    let evento: any = null;
    try {
      evento = await prisma.evento.findUnique({
        where: { slug },
      });
    } catch {}

    if (!evento) {
      evento = await fallbackEventStore.getEvent(slug);
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null) ||
      "https://luminavite-production.up.railway.app";

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
    let photoUrl = evento?.fotoPortadaUrl || "/assets/template-butterfly/foto-columpio-portada.png";
    if (photoUrl.startsWith("/")) {
      photoUrl = `${baseUrl}${photoUrl}`;
    }

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
                width: "fit-content",
              }}
            >
              ✨ ¡Tú estás invitado! • Toca para abrir
            </div>
          </div>

          {/* Lado Derecho: Fotografía Principal de la Festejada */}
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
              src={photoUrl}
              alt={nombre}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
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
