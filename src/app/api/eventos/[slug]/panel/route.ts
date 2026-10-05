import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await context.params;
    const slug = resolvedParams.slug;
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    // Seguridad estricta: Se requiere token secreto para acceder al panel
    if (!key) {
      return NextResponse.json(
        { error: "Acceso denegado. Se requiere clave secreta (?key=...)." },
        { status: 404 }
      );
    }

    // Buscar evento
    const evento = await prisma.evento.findUnique({
      where: { slug },
      include: {
        rsvps: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!evento) {
      // Mock demo si no existe en BD
      if (slug.startsWith("demo-") || slug === "valeria-xv" || slug === "mariposas-xv") {
        return NextResponse.json({
          evento: {
            titulo: "Valeria Sofía",
            slug,
            fechaEvento: "2026-10-24T16:30:00Z",
            maxPasesPorInvitado: 4,
          },
          estadisticas: {
            totalInvitadosConfirmados: 36,
            totalPasesConfirmados: 94,
            totalDeclinados: 4,
            capacidadEstimada: 150,
          },
          rsvps: [
            {
              id: "demo-r1",
              nombreInvitado: "Familia Ramírez",
              asistira: true,
              pases: 4,
              createdAt: new Date().toISOString(),
            },
            {
              id: "demo-r2",
              nombreInvitado: "Carlos & Andrea Gómez",
              asistira: true,
              pases: 2,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "demo-r3",
              nombreInvitado: "Tía Rosalía",
              asistira: false,
              pases: 0,
              createdAt: new Date(Date.now() - 7200000).toISOString(),
            },
          ],
        });
      }

      return NextResponse.json(
        { error: "Evento no encontrado." },
        { status: 404 }
      );
    }

    // Validar token de seguridad contra el registrado en base de datos
    if (evento.panelToken && key !== evento.panelToken) {
      return NextResponse.json(
        { error: "Clave de acceso inválida o expirada." },
        { status: 404 }
      );
    }

    // Calcular estadísticas en tiempo real
    const rsvps = evento.rsvps || [];
    const confirmados = rsvps.filter((r) => r.asistira);
    const declinados = rsvps.filter((r) => !r.asistira);
    const totalPases = confirmados.reduce((acc, r) => acc + (r.pases || 1), 0);

    return NextResponse.json({
      evento: {
        id: evento.id,
        titulo: evento.titulo,
        slug: evento.slug,
        fechaEvento: evento.fechaEvento,
        recepcionNombre: evento.recepcionNombre,
        maxPasesPorInvitado: evento.maxPasesPorInvitado,
      },
      estadisticas: {
        totalInvitadosConfirmados: confirmados.length,
        totalPasesConfirmados: totalPases,
        totalDeclinados: declinados.length,
        totalRespuestas: rsvps.length,
        aforoTotal: evento.aforoTotal || 200,
      },
      rsvps,
    });
  } catch (error) {
    console.error("Error al obtener panel de evento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
