import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { deleteS3Object } from "@/lib/s3";
import { normalizeSlug, getEventBySlug, validateEventKey } from "@/lib/events";
import { getPanelCookieName, verifyPanelAuth } from "@/lib/panel-auth";

// Borrar una foto del anfitrión: solo con la llave del panel (cookie o ?key=),
// igual que el PATCH del panel. Borra el registro y el objeto en S3.
async function autorizadoPanel(
  req: NextRequest,
  cleanSlug: string
): Promise<boolean> {
  const cookieName = getPanelCookieName(cleanSlug);
  const sessionCookie = req.cookies.get(cookieName)?.value;
  if (sessionCookie && (await verifyPanelAuth(cleanSlug, sessionCookie))) {
    return true;
  }
  const key = new URL(req.url).searchParams.get("key")?.trim();
  if (!key) return false;
  const evento = await getEventBySlug(cleanSlug);
  if (!evento) return false;
  return validateEventKey(key, evento.panelToken);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string; id: string }> | { slug: string; id: string } }
) {
  const resolvedParams = await context.params;
  const cleanSlug = normalizeSlug(resolvedParams?.slug);
  const id = String(resolvedParams?.id || "");
  const evento = await getEventBySlug(cleanSlug);
  if (!evento) {
    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }
  if (!(await autorizadoPanel(req, cleanSlug))) {
    return NextResponse.json({ error: "Acceso no autorizado al panel del anfitrión." }, { status: 401 });
  }
  const row = await (prisma as any).fotoInvitado.findFirst({
    where: { id, eventoId: evento.id },
  });
  if (!row) {
    return NextResponse.json({ error: "Foto no encontrada." }, { status: 404 });
  }
  if (row.fileKey) {
    await deleteS3Object(row.fileKey);
  }
  await (prisma as any).fotoInvitado.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
