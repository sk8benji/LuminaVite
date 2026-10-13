import { NextRequest, NextResponse } from "next/server";
import { getPanelCookieName, verifyPanelAuth } from "@/lib/panel-auth";
import { normalizeSlug, getEventBySlug, validateEventKey } from "@/lib/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = context?.params ? await context.params : null;
    let slug = resolvedParams?.slug;
    if (!slug) {
      const url = new URL(req.url);
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.indexOf("eventos");
      if (idx !== -1 && parts[idx + 1] && parts[idx + 1] !== "panel") {
        slug = parts[idx + 1];
      }
    }
    const cleanSlug = normalizeSlug(slug);

    const { searchParams } = new URL(req.url);
    const queryKey = searchParams.get("key")?.trim();

    // 1. Validar autorización vía Cookie de Sesión HttpOnly o vía Clave en Query
    const cookieName = getPanelCookieName(cleanSlug);
    const sessionCookie = req.cookies.get(cookieName)?.value;

    let isAuthorized = false;
    if (sessionCookie) {
      isAuthorized = await verifyPanelAuth(cleanSlug, sessionCookie);
    }

    // 2. Consultar el evento directamente en PostgreSQL vía getEventBySlug
    const evento = await getEventBySlug(cleanSlug);

    if (!evento) {
      return NextResponse.json(
        { error: "Evento no encontrado en la base de datos." },
        { status: 404 }
      );
    }

    // Si aún no está autorizado por cookie, validar por queryKey
    if (!isAuthorized && queryKey) {
      isAuthorized = validateEventKey(queryKey, evento.panelToken);
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Acceso no autorizado. Inicia sesión en tu panel con tu clave." },
        { status: 401 }
      );
    }

    // 3. Calcular estadísticas en tiempo real
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
        modalidadRsvp: (evento as any).modalidadRsvp || "HIBRIDO",
        permitirConfirmacionTelefono: (evento as any).permitirConfirmacionTelefono !== false,
        mostrarMesaRegalos: (evento as any).mostrarMesaRegalos !== false,
        mostrarDressCode: (evento as any).mostrarDressCode !== false,
        mostrarFrasePersonalizada: (evento as any).mostrarFrasePersonalizada !== false,
        mostrarFechaPlacaHora: (evento as any).mostrarFechaPlacaHora !== false,
        fechaPlacaHora: (evento as any).fechaPlacaHora || "",
        telefonoWhatsappRsvp: evento.telefonoWhatsappRsvp || "",
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
  } catch (error: any) {
    console.error("Error al obtener panel de evento en PostgreSQL:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = context?.params ? await context.params : null;
    let slug = resolvedParams?.slug;
    if (!slug) {
      const url = new URL(req.url);
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.indexOf("eventos");
      if (idx !== -1 && parts[idx + 1] && parts[idx + 1] !== "panel") {
        slug = parts[idx + 1];
      }
    }
    const cleanSlug = normalizeSlug(slug);

    const { searchParams } = new URL(req.url);
    const queryKey = searchParams.get("key")?.trim();

    // 1. Validar autorización vía Cookie de Sesión HttpOnly o vía Clave en Query
    const cookieName = getPanelCookieName(cleanSlug);
    const sessionCookie = req.cookies.get(cookieName)?.value;

    let isAuthorized = false;
    if (sessionCookie) {
      isAuthorized = await verifyPanelAuth(cleanSlug, sessionCookie);
    }

    const evento = await getEventBySlug(cleanSlug);
    if (!evento) {
      return NextResponse.json(
        { error: "Evento no encontrado." },
        { status: 404 }
      );
    }

    if (!isAuthorized && queryKey) {
      isAuthorized = validateEventKey(queryKey, evento.panelToken);
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Acceso no autorizado al panel del anfitrión." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { modalidadRsvp, permitirConfirmacionTelefono, telefonoWhatsappRsvp, mostrarMesaRegalos, mostrarDressCode, mostrarFrasePersonalizada, mostrarFechaPlacaHora } = body;

    const validModalities = ["ESTRICTO", "HIBRIDO", "ABIERTO"];
    const updateData: any = {};

    if (modalidadRsvp !== undefined) {
      if (!validModalities.includes(modalidadRsvp)) {
        return NextResponse.json(
          { error: "Modalidad inválida. Debe ser ESTRICTO, HIBRIDO o ABIERTO." },
          { status: 400 }
        );
      }
      updateData.modalidadRsvp = modalidadRsvp;
    }

    if (permitirConfirmacionTelefono !== undefined) {
      updateData.permitirConfirmacionTelefono = Boolean(permitirConfirmacionTelefono);
    }

    if (mostrarMesaRegalos !== undefined) {
      updateData.mostrarMesaRegalos = Boolean(mostrarMesaRegalos);
    }

    if (mostrarDressCode !== undefined) {
      updateData.mostrarDressCode = Boolean(mostrarDressCode);
    }

    if (mostrarFrasePersonalizada !== undefined) {
      updateData.mostrarFrasePersonalizada = Boolean(mostrarFrasePersonalizada);
    }

    if (mostrarFechaPlacaHora !== undefined) {
      updateData.mostrarFechaPlacaHora = Boolean(mostrarFechaPlacaHora);
    }

    if (telefonoWhatsappRsvp !== undefined) {
      updateData.telefonoWhatsappRsvp = String(telefonoWhatsappRsvp).trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No se enviaron datos para actualizar." },
        { status: 400 }
      );
    }

    const prismaClient = (await import("@/lib/db")).default;
    const updated = await prismaClient.evento.update({
      where: { id: evento.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      modalidadRsvp: updated.modalidadRsvp,
      permitirConfirmacionTelefono: (updated as any).permitirConfirmacionTelefono !== false,
      mostrarMesaRegalos: (updated as any).mostrarMesaRegalos !== false,
      mostrarDressCode: (updated as any).mostrarDressCode !== false,
      mostrarFrasePersonalizada: (updated as any).mostrarFrasePersonalizada !== false,
      mostrarFechaPlacaHora: (updated as any).mostrarFechaPlacaHora !== false,
      telefonoWhatsappRsvp: updated.telefonoWhatsappRsvp,
      message: "Configuración actualizada correctamente.",
    });
  } catch (error: any) {
    console.error("Error al actualizar modalidad de RSVP en el panel:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la modalidad de RSVP.", details: error?.message },
      { status: 500 }
    );
  }
}
