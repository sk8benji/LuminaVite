import { NextRequest, NextResponse } from "next/server";
import { getOrderByDatosToken } from "@/lib/order-store";
import { getPresignedUploadUrl } from "@/lib/s3";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB, igual que el editor
const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif"];

/**
 * Subida de fotos del portal de datos. NO usa la ruta de admin: el token
 * de la orden es la autorización, y la carpeta queda fija a esa orden, así
 * que un cliente no puede escribir en la carpeta de otro.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const limited = checkRateLimit(req, "datos-upload", RATE_LIMITS.presignedUrl);
  if (limited) return limited;

  const { token } = await params;
  const order = await getOrderByDatosToken(token);
  if (!order) {
    return NextResponse.json({ error: "Link no válido o expirado." }, { status: 404 });
  }
  try {
    const body = await req.json();
    let { filename, contentType, fileSize } = body;
    if (!filename) {
      return NextResponse.json({ error: "Falta el nombre del archivo." }, { status: 400 });
    }
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    if (!contentType || contentType === "application/octet-stream") {
      if (["jpg", "jpeg"].includes(ext)) contentType = "image/jpeg";
      else if (ext === "png") contentType = "image/png";
      else if (ext === "webp") contentType = "image/webp";
    }
    if (!ALLOWED_IMAGES.includes(contentType)) {
      return NextResponse.json(
        { error: "Solo se permiten fotos JPG, PNG, WEBP o GIF." },
        { status: 400 }
      );
    }
    if (fileSize && fileSize > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "La foto no puede pesar más de 15 MB." }, { status: 400 });
    }
    const presigned = await getPresignedUploadUrl(
      filename,
      contentType,
      `clientes/datos/${token}`
    );
    return NextResponse.json({ success: true, ...presigned });
  } catch (err: any) {
    console.error("Error en /api/datos upload-url:", err?.message || err);
    return NextResponse.json({ error: "No se pudo preparar la subida." }, { status: 500 });
  }
}
