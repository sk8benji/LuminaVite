import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ensurePostgresTables } from "@/lib/init-db";
import { headS3Object, publicFileUrl } from "@/lib/s3";
import { normalizeSlug, getEventBySlug } from "@/lib/events";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

async function cargarEvento(context: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await context.params;
  const cleanSlug = normalizeSlug(resolvedParams?.slug);
  const evento = await getEventBySlug(cleanSlug);
  return { cleanSlug, evento };
}

function limpiarTexto(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

// Registrar una subida ya completada en S3 (o un text post sin archivo).
// El fileKey se verifica contra S3: debe existir, ser imagen/video y respetar
// el tope de tamaño. Así nadie puede registrar URLs ajenas.
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const limited = checkRateLimit(req, "fotos-invitados", RATE_LIMITS.fotosInvitados);
  if (limited) return limited;

  await ensurePostgresTables();
  const { cleanSlug, evento } = await cargarEvento(context);
  if (!evento) {
    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }
  if ((evento as any).fotosInvitadosActivas === false) {
    return NextResponse.json(
      { error: "La subida de fotos está desactivada para este evento." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const nombre = limpiarTexto(body.nombre, 80);
    const mensaje = limpiarTexto(body.mensaje, 500);

    // Text post: mensaje de felicitación sin foto ni video.
    if (body.tipo === "mensaje") {
      if (!mensaje) {
        return NextResponse.json({ error: "Escribe tu mensaje." }, { status: 400 });
      }
      const row = await (prisma as any).fotoInvitado.create({
        data: { eventoId: evento.id, url: "", fileKey: "", tipo: "mensaje", nombre, mensaje },
      });
      return NextResponse.json({ ok: true, foto: row });
    }

    const fileKey = String(body.fileKey || "");
    const prefix = `clientes/fotos-invitados/${cleanSlug}/`;
    if (!fileKey.startsWith(prefix)) {
      return NextResponse.json({ error: "Archivo no válido." }, { status: 400 });
    }
    const head = await headS3Object(fileKey);
    if (!head) {
      return NextResponse.json(
        { error: "La subida no se completó. Intenta de nuevo." },
        { status: 400 }
      );
    }
    const isVideo = head.contentType.startsWith("video/");
    const isImage = head.contentType.startsWith("image/");
    if (!isVideo && !isImage) {
      return NextResponse.json({ error: "El archivo no es foto ni video." }, { status: 400 });
    }
    if (isImage && head.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "La foto supera 15 MB." }, { status: 400 });
    }
    if (isVideo && head.size > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: "El video supera 50 MB." }, { status: 400 });
    }

    const row = await (prisma as any).fotoInvitado.create({
      data: {
        eventoId: evento.id,
        url: publicFileUrl(fileKey),
        fileKey,
        tipo: isVideo ? "video" : "foto",
        nombre,
        mensaje,
      },
    });
    return NextResponse.json({ ok: true, foto: row });
  } catch (error) {
    console.error("Error al registrar foto de invitado:", error);
    return NextResponse.json({ error: "No se pudo guardar tu foto." }, { status: 500 });
  }
}

// Listado público por link (lo usan el muro y la galería del panel).
// La privacidad es por link, igual que la subida: quien tiene el link ve.
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  await ensurePostgresTables();
  const { evento } = await cargarEvento(context);
  if (!evento) {
    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }
  const activas = (evento as any).fotosInvitadosActivas !== false;
  if (!activas) {
    return NextResponse.json({ activas: false, fotos: [] });
  }
  const rows = await (prisma as any).fotoInvitado.findMany({
    where: { eventoId: evento.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({
    activas: true,
    fotos: rows.map((r: any) => ({
      id: r.id,
      url: r.url,
      tipo: r.tipo,
      nombre: r.nombre,
      mensaje: r.mensaje,
      createdAt: r.createdAt,
    })),
  });
}
