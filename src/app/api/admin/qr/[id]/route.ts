import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { isSafeHttpUrl } from "@/lib/url-safety";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/qr/[id]
 * Actualiza name, targetUrl (validada) y/o active de una campaña QR.
 * Cambiar targetUrl NO requiere reimprimir el QR: el código impreso
 * apunta a /q/[code] y la redirección usa el destino actual.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const body = await req.json();

    const data: { name?: string; targetUrl?: string; active?: boolean } = {};

    if (body?.name !== undefined) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name) {
        return NextResponse.json(
          { error: "El nombre de la campaña no puede estar vacío." },
          { status: 400 }
        );
      }
      data.name = name;
    }

    if (body?.targetUrl !== undefined) {
      const targetUrl = typeof body.targetUrl === "string" ? body.targetUrl.trim() : "";
      if (!targetUrl || !isSafeHttpUrl(targetUrl)) {
        return NextResponse.json(
          { error: "URL destino no permitida. Solo se aceptan URLs http(s)." },
          { status: 400 }
        );
      }
      data.targetUrl = targetUrl;
    }

    if (body?.active !== undefined) {
      data.active = !!body.active;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No hay cambios para aplicar." },
        { status: 400 }
      );
    }

    const existing = await prisma.qrCampaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Campaña no encontrada" }, { status: 404 });
    }

    const campaign = await prisma.qrCampaign.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, campaign });
  } catch (err: any) {
    console.error("Error en PATCH /api/admin/qr/[id]:", err);
    return NextResponse.json(
      { error: err?.message || "Error al actualizar la campaña QR." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/qr/[id]
 * Elimina la campaña; sus escaneos se borran por onDelete: Cascade.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;

    const existing = await prisma.qrCampaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Campaña no encontrada" }, { status: 404 });
    }

    await prisma.qrCampaign.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error en DELETE /api/admin/qr/[id]:", err);
    return NextResponse.json(
      { error: err?.message || "Error al eliminar la campaña QR." },
      { status: 500 }
    );
  }
}
