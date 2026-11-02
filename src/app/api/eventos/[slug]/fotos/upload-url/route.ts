import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";
import { normalizeSlug, getEventBySlug } from "@/lib/events";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// Fotos/videos de invitados: subida pública por link (sin login, como Kululu).
// La carpeta la fija el servidor (nunca el cliente) y el tipo/tamaño se validan
// aquí y de nuevo al registrar (HeadObject en S3).
const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB, igual que el editor
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB, clips cortos

const ALLOWED_IMAGES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
];
const ALLOWED_VIDEOS = ["video/mp4", "video/quicktime", "video/webm"];

function inferContentType(contentType: string, ext: string): string {
  if (contentType && contentType !== "application/octet-stream" && contentType !== "binary/octet-stream") {
    return contentType;
  }
  if (["jpg", "jpeg"].includes(ext)) return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "heic") return "image/heic";
  if (ext === "heif") return "image/heif";
  if (ext === "mp4") return "video/mp4";
  if (ext === "mov") return "video/quicktime";
  if (ext === "webm") return "video/webm";
  return contentType;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const limited = checkRateLimit(req, "fotos-invitados", RATE_LIMITS.fotosInvitados);
  if (limited) return limited;

  const resolvedParams = await context.params;
  const cleanSlug = normalizeSlug(resolvedParams?.slug);
  const evento = await getEventBySlug(cleanSlug);
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
    const filename = String(body.filename || "");
    if (!filename) {
      return NextResponse.json({ error: "Falta el nombre del archivo." }, { status: 400 });
    }
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = inferContentType(String(body.contentType || ""), ext);
    const isVideo = ALLOWED_VIDEOS.includes(contentType);
    const isImage = ALLOWED_IMAGES.includes(contentType);
    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa fotos (JPEG, PNG, WebP, HEIC, GIF) o video corto (MP4, MOV, WebM)." },
        { status: 400 }
      );
    }
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    const declaredSize = Number(body.fileSize);
    if (!Number.isFinite(declaredSize) || declaredSize <= 0) {
      return NextResponse.json({ error: "Debes indicar el tamaño del archivo (fileSize)." }, { status: 400 });
    }
    if (declaredSize > maxBytes) {
      return NextResponse.json(
        { error: `Archivo demasiado grande. Máximo ${Math.round(maxBytes / 1024 / 1024)} MB.` },
        { status: 400 }
      );
    }

    const data = await getPresignedUploadUrl(
      filename,
      contentType,
      `clientes/fotos-invitados/${cleanSlug}`
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al generar URL de subida de foto de invitado:", error);
    return NextResponse.json({ error: "Error al generar la URL de subida." }, { status: 500 });
  }
}
