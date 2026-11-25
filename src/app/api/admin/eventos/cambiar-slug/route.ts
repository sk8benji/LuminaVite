import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Cambiar el enlace (slug) de una invitación ya creada, desde el admin.
// Antes (2026-10-20) el slug era de solo lectura al editar para no romper
// links publicados; Abraham autorizó 2026-11-03 el cambio intencional desde
// el admin, con verificación de único y aviso de que el enlace viejo, el QR
// y el link del panel dejan de funcionar.
// La limpieza replica la de creación (route.ts:194): minúsculas, solo a-z0-9-.
function limpiarSlug(v: string): string {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const actual = limpiarSlug(String(body.slugActual || ""));
    const nuevo = limpiarSlug(String(body.nuevoSlug || ""));
    if (!actual || !nuevo) {
      return NextResponse.json(
        { error: "Indica el enlace actual y el nuevo enlace." },
        { status: 400 }
      );
    }
    if (actual === nuevo) {
      return NextResponse.json(
        { error: "El nuevo enlace es igual al actual." },
        { status: 400 }
      );
    }
    if (nuevo === "mi-celebracion") {
      return NextResponse.json(
        { error: "Ese enlace está reservado (es el ejemplo del creador)." },
        { status: 400 }
      );
    }
    const evento = await prisma.evento.findUnique({ where: { slug: actual } });
    if (!evento) {
      return NextResponse.json(
        { error: "No existe una invitación con ese enlace." },
        { status: 404 }
      );
    }
    const ocupado = await prisma.evento.findUnique({ where: { slug: nuevo } });
    if (ocupado) {
      return NextResponse.json(
        { error: "Ya existe una invitación con ese enlace. Elige otro diferente." },
        { status: 409 }
      );
    }
    const updated = await prisma.evento.update({
      where: { slug: actual },
      data: { slug: nuevo },
    });
    return NextResponse.json({
      ok: true,
      slugAnterior: actual,
      slugNuevo: updated.slug,
      url: `/${updated.slug}`,
    });
  } catch (error) {
    console.error("Error al cambiar slug:", error);
    return NextResponse.json(
      { error: "No se pudo cambiar el enlace." },
      { status: 500 }
    );
  }
}
