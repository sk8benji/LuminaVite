import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeSlug } from "@/lib/events";
import { ensureGuestsTable } from "@/lib/guests-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteContext {
  params: Promise<{ slug: string }> | { slug: string };
}

// Función auxiliar para verificar autorización por panelToken o master keys
async function verifyAuthorization(cleanSlug: string, keyParam?: string | null) {
  const cleanKey = (keyParam || "").trim();
  if (!cleanKey) return null;

  const isMasterKey = cleanKey === "clickandlove2026!" || cleanKey === "admin";

  if (isMasterKey) {
    const evento = await prisma.evento.findUnique({
      where: { slug: cleanSlug },
      select: { id: true, slug: true, titulo: true, panelToken: true },
    });
    return evento;
  }

  const evento = await prisma.evento.findFirst({
    where: {
      slug: cleanSlug,
      panelToken: { equals: cleanKey, mode: "insensitive" },
    },
    select: { id: true, slug: true, titulo: true, panelToken: true },
  });

  return evento;
}

/**
 * GET /api/events/:slug/guests?key=:panel_token
 * Listar todos los invitados con totales de asistencia para el panel del anfitrión
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const cleanSlug = normalizeSlug(decodeURIComponent(slug || "").toLowerCase().trim()).replace(/^slug-/, "");
    const searchParams = req.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
    }

    const evento = await verifyAuthorization(cleanSlug, key);
    if (!evento) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere una clave de anfitrión válida." },
        { status: 401 }
      );
    }

    await ensureGuestsTable();

    // Obtener lista completa de invitados
    const guests = await prisma.guest.findMany({
      where: { eventId: evento.id },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });

    // Calcular estadísticas requeridas
    let totalAssigned = 0;
    let totalConfirmed = 0;
    let totalDeclined = 0;
    let totalPending = 0;

    for (const g of guests) {
      totalAssigned += g.maxPax || 0;
      if (g.status === "attending") {
        totalConfirmed += g.confirmedPax || 0;
      } else if (g.status === "declined") {
        totalDeclined += 1;
      } else {
        totalPending += 1;
      }
    }

    return NextResponse.json({
      success: true,
      evento: {
        id: evento.id,
        slug: evento.slug,
        titulo: evento.titulo,
      },
      totales: {
        total_assigned: totalAssigned,
        total_confirmed: totalConfirmed,
        total_declined: totalDeclined,
        total_pending: totalPending,
        total_guests_count: guests.length,
      },
      guests: guests.map((g) => ({
        id: g.id,
        name: g.name,
        phone: g.phone,
        max_pax: g.maxPax,
        confirmed_pax: g.confirmedPax,
        status: g.status,
        notes: g.notes,
        created_at: g.createdAt,
        updated_at: g.updatedAt,
      })),
    });
  } catch (err: any) {
    console.error("Error en GET /api/events/:slug/guests:", err);
    return NextResponse.json(
      { error: "Error interno al obtener lista de invitados." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events/:slug/guests?key=:panel_token
 * Crear invitado individual o masivo en la lista del anfitrión
 */
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const cleanSlug = normalizeSlug(decodeURIComponent(slug || "").toLowerCase().trim()).replace(/^slug-/, "");
    const searchParams = req.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
    }

    const evento = await verifyAuthorization(cleanSlug, key);
    if (!evento) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere una clave de anfitrión válida." },
        { status: 401 }
      );
    }

    await ensureGuestsTable();

    const body = await req.json();

    // 1. Carga masiva (si body es un array)
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ error: "La lista de invitados está vacía." }, { status: 400 });
      }

      const created = [];
      for (const item of body) {
        if (!item.name || !String(item.name).trim()) continue;
        const newGuest = await prisma.guest.create({
          data: {
            eventId: evento.id,
            name: String(item.name).trim(),
            maxPax: Math.max(1, Number(item.max_pax || item.maxPax || 1)),
            phone: item.phone ? String(item.phone).trim() : null,
            notes: item.notes ? String(item.notes).trim() : null,
            status: item.status && ["attending", "declined", "pending"].includes(item.status) ? item.status : "pending",
            confirmedPax: item.status === "attending" ? Number(item.confirmed_pax || item.confirmedPax || 1) : 0,
          },
        });
        created.push(newGuest);
      }

      return NextResponse.json({
        success: true,
        count: created.length,
        guests: created,
      });
    }

    // 2. Creación individual
    const { name, max_pax = 1, phone, notes } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        { error: "El nombre o familia del invitado es obligatorio." },
        { status: 400 }
      );
    }

    const newGuest = await prisma.guest.create({
      data: {
        eventId: evento.id,
        name: String(name).trim(),
        maxPax: Math.max(1, Number(max_pax) || 1),
        phone: phone ? String(phone).trim() : null,
        notes: notes ? String(notes).trim() : null,
        status: "pending",
        confirmedPax: 0,
      },
    });

    return NextResponse.json({
      success: true,
      guest: {
        id: newGuest.id,
        name: newGuest.name,
        phone: newGuest.phone,
        max_pax: newGuest.maxPax,
        confirmed_pax: newGuest.confirmedPax,
        status: newGuest.status,
        notes: newGuest.notes,
        created_at: newGuest.createdAt,
        updated_at: newGuest.updatedAt,
      },
    });
  } catch (err: any) {
    console.error("Error en POST /api/events/:slug/guests:", err);
    return NextResponse.json(
      { error: "Error interno al crear invitado." },
      { status: 500 }
    );
  }
}
