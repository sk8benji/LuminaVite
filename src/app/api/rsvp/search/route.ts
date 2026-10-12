import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import { ensureGuestsTable } from "@/lib/guests-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/rsvp/search?slug=:slug&q=:query (o ?eventoId=:eventoId&q=:query)
 * 
 * Búsqueda pública y segura de invitados por nombre o apellido.
 * Reglas de seguridad:
 * 1. Exige mínimo 3 caracteres en el query string antes de ejecutar la consulta en PostgreSQL.
 * 2. No retorna la lista completa si el término es genérico o vacío.
 * 3. Oculta de los resultados cualquier campo sensible (teléfonos, correos, notas privadas).
 * 4. Retorna únicamente: id, nombre (o name), pasesAsignados (o max_pax).
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const rawSlug = searchParams.get("slug") || searchParams.get("eventoId") || searchParams.get("event") || "";
    const cleanSlug = normalizeSlug(decodeURIComponent(rawSlug).toLowerCase().trim()).replace(/^slug-/, "");
    const query = (searchParams.get("q") || "").trim();

    if (!cleanSlug) {
      return NextResponse.json(
        { error: "Se requiere el identificador 'slug' del evento para buscar." },
        { status: 400 }
      );
    }

    // Exigir mínimo 3 caracteres antes de ejecutar la consulta en PostgreSQL
    if (!query || query.length < 3) {
      return NextResponse.json([], { status: 200 });
    }

    await ensureGuestsTable();

    // Buscar evento
    const evento = await prisma.evento.findFirst({
      where: {
        OR: [
          { slug: cleanSlug },
          { id: cleanSlug },
        ],
      },
      select: { id: true },
    });

    if (!evento) {
      return NextResponse.json(
        { error: "Evento no encontrado." },
        { status: 404 }
      );
    }

    // Buscar coincidencias parciales case-insensitive (ILIKE %query%) con límite estricto de 5
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

    // Ocultar cualquier dato sensible y retornar únicamente los campos necesarios
    const formatted = guests.map((g) => ({
      id: g.id,
      nombre: g.name,
      name: g.name,
      pasesAsignados: g.maxPax,
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
    console.error("Error en GET /api/rsvp/search:", err);
    return NextResponse.json(
      { error: "Error interno al buscar invitado." },
      { status: 500 }
    );
  }
}
