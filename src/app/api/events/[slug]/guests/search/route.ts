import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import { ensureGuestsTable } from "@/lib/guests-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteContext {
  params: Promise<{ slug: string }> | { slug: string };
}

/**
 * GET /api/events/:slug/guests/search?q=:query
 * Búsqueda pública de invitados por nombre o apellido (Debounce)
 * Retorna máximo 5 resultados con: id, name, max_pax, status
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const cleanSlug = normalizeSlug(decodeURIComponent(slug || "").toLowerCase().trim()).replace(/^slug-/, "");
    const searchParams = req.nextUrl.searchParams;
    const query = (searchParams.get("q") || "").trim();
    const directId = (
      searchParams.get("id") ||
      searchParams.get("guest") ||
      searchParams.get("guest_id") ||
      ""
    ).trim();

    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
    }

    await ensureGuestsTable();

    // Buscar evento
    const evento = await prisma.evento.findFirst({
      where: { slug: cleanSlug },
      select: { id: true },
    });

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    // 1. Si viene búsqueda directa por ID de invitado (?id=UUID o ?guest=UUID)
    if (directId) {
      const guest = await prisma.guest.findFirst({
        where: {
          id: directId,
          eventId: evento.id,
        },
        select: {
          id: true,
          name: true,
          maxPax: true,
          status: true,
        },
      });

      if (!guest) {
        return NextResponse.json(
          { error: "Invitado no encontrado con ese identificador" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: guest.id,
        name: guest.name,
        max_pax: guest.maxPax,
        status: guest.status,
      }, {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    // Buscar coincidencias parciales case-insensitive (ILIKE %query%)
    const guests = await prisma.guest.findMany({
      where: {
        eventId: evento.id,
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
        maxPax: true,
        status: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const formatted = guests.map((g) => ({
      id: g.id,
      name: g.name,
      max_pax: g.maxPax,
      status: g.status,
    }));

    return NextResponse.json(formatted, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("Error en GET /api/events/:slug/guests/search:", err);
    return NextResponse.json(
      { error: "Error interno al buscar invitados" },
      { status: 500 }
    );
  }
}
