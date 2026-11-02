import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import prisma from "@/lib/db";
import { getS3ObjectBody } from "@/lib/s3";
import { normalizeSlug, getEventBySlug, validateEventKey } from "@/lib/events";
import { getPanelCookieName, verifyPanelAuth } from "@/lib/panel-auth";

// Descargar toda la galería en un ZIP (solo anfitrión, con llave del panel).
// Límite v1: 200 archivos por ZIP para no agotar memoria del servidor.
const MAX_ZIP_FILES = 200;

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as any));
  }
  return Buffer.concat(chunks);
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = await context.params;
  const cleanSlug = normalizeSlug(resolvedParams?.slug);
  const evento = await getEventBySlug(cleanSlug);
  if (!evento) {
    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }

  const cookieName = getPanelCookieName(cleanSlug);
  const sessionCookie = req.cookies.get(cookieName)?.value;
  let ok = false;
  if (sessionCookie && (await verifyPanelAuth(cleanSlug, sessionCookie))) {
    ok = true;
  }
  if (!ok) {
    const key = new URL(req.url).searchParams.get("key")?.trim();
    if (key) ok = validateEventKey(key, evento.panelToken);
  }
  if (!ok) {
    return NextResponse.json({ error: "Acceso no autorizado al panel del anfitrión." }, { status: 401 });
  }

  const rows = await (prisma as any).fotoInvitado.findMany({
    where: { eventoId: evento.id, url: { not: "" } },
    orderBy: { createdAt: "asc" },
    take: MAX_ZIP_FILES,
  });
  if (rows.length === 0) {
    return NextResponse.json({ error: "Aún no hay fotos para descargar." }, { status: 404 });
  }

  const zip = new JSZip();
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.fileKey) continue;
    try {
      const body = await getS3ObjectBody(row.fileKey);
      if (!body) continue;
      const buf = await streamToBuffer(body);
      const base = row.fileKey.split("/").pop()?.replace(/[^a-zA-Z0-9.-]/g, "_") || `foto-${i + 1}`;
      zip.file(`${String(i + 1).padStart(3, "0")}-${base}`, buf);
    } catch (err) {
      console.error("ZIP: no se pudo leer", row.fileKey, err);
    }
  }
  const buf = await zip.generateAsync({ type: "nodebuffer" });
  return new NextResponse(buf as any, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="fotos-${cleanSlug}.zip"`,
    },
  });
}
