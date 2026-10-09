import { NextRequest, NextResponse } from "next/server";
import { getPanelCookieName, verifyPanelAuth } from "@/lib/panel-auth";
import { normalizeSlug, getEventBySlug } from "@/lib/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = context?.params ? await context.params : null;
  let slug = resolvedParams?.slug;
  if (!slug) {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("eventos");
    if (idx !== -1 && parts[idx + 1]) {
      slug = parts[idx + 1];
    }
  }
  const cleanSlug = normalizeSlug(slug);

  // Validar cookie de sesión HttpOnly
  const cookieName = getPanelCookieName(cleanSlug);
  const sessionCookie = req.cookies.get(cookieName)?.value;
  const isAuthorized = await verifyPanelAuth(cleanSlug, sessionCookie);

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Acceso no autorizado. Inicia sesión en tu panel para descargar la lista." },
      { status: 401 }
    );
  }

  try {
    const evento = await getEventBySlug(cleanSlug);

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
    }

    const headers = ["Nombre Invitado", "Telefono", "Asistencia", "Pases", "Acompanantes", "Fecha Confirmacion"];
    const rows = (evento.rsvps || []).map((r) => [
      `"${(r.nombreInvitado || "").replace(/"/g, '""')}"`,
      `"${(r.telefono || "").replace(/"/g, '""')}"`,
      r.asistira ? "Confirmado" : "Declinado",
      r.pases,
      `"${(r.acompanantes || "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString("es-ES")}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="invitados-${cleanSlug}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error al exportar CSV:", error);
    return NextResponse.json({ error: "Error al generar archivo CSV." }, { status: 500 });
  }
}
