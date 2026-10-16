import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// Límites de tamaño (bytes)
const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_AUDIO_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "presigned-url", RATE_LIMITS.presignedUrl);
  if (limited) return limited;

  // C5: solo administradores pueden generar URLs de subida
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    let { filename, contentType, folder, fileSize } = body;

    if (!filename) {
      return NextResponse.json(
        { error: "El nombre del archivo es obligatorio." },
        { status: 400 }
      );
    }

    const ext = filename.split(".").pop()?.toLowerCase() || "";

    // Inferir contentType si viene vacío o como octet-stream
    if (!contentType || contentType === "application/octet-stream" || contentType === "binary/octet-stream") {
      if (["mp3"].includes(ext)) contentType = "audio/mpeg";
      else if (["wav"].includes(ext)) contentType = "audio/wav";
      else if (["m4a"].includes(ext)) contentType = "audio/m4a";
      else if (["aac"].includes(ext)) contentType = "audio/aac";
      else if (["ogg"].includes(ext)) contentType = "audio/ogg";
      else if (["jpg", "jpeg"].includes(ext)) contentType = "image/jpeg";
      else if (["png"].includes(ext)) contentType = "image/png";
      else if (["webp"].includes(ext)) contentType = "image/webp";
    }

    const isAudio =
      Boolean(contentType && (contentType.startsWith("audio/") || contentType.includes("mpeg") || contentType.includes("mp3"))) ||
      ["mp3", "wav", "m4a", "aac", "ogg", "flac"].includes(ext) ||
      (typeof folder === "string" && folder.includes("audio"));

    // C5: SVG bloqueado — un SVG con JS embebido servido desde tu dominio es XSS almacenado
    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
      "image/gif",
    ];

    const allowedAudio = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/m4a",
      "audio/x-m4a",
      "audio/mp4",
      "audio/aac",
      "audio/ogg",
      "audio/webm",
      "audio/flac",
    ];

    if (isAudio) {
      if (!contentType || !allowedAudio.includes(contentType)) {
        if (ext === "mp3") contentType = "audio/mpeg";
        else if (ext === "wav") contentType = "audio/wav";
        else if (ext === "m4a") contentType = "audio/m4a";
        else if (ext === "ogg") contentType = "audio/ogg";
        else {
          return NextResponse.json(
            { error: "Formato de audio no permitido. Usa MP3, WAV, M4A o OGG." },
            { status: 400 }
          );
        }
      }
    } else {
      if (!allowedImages.includes(contentType)) {
        return NextResponse.json(
          { error: "Formato de imagen no permitido. Usa JPEG, PNG, WebP o HEIC." },
          { status: 400 }
        );
      }
    }

    // C5: límite de tamaño declarado por el cliente
    const maxBytes = isAudio ? MAX_AUDIO_BYTES : MAX_IMAGE_BYTES;
    const declaredSize = Number(fileSize);
    if (!Number.isFinite(declaredSize) || declaredSize <= 0) {
      return NextResponse.json(
        { error: "Debes indicar el tamaño del archivo (fileSize)." },
        { status: 400 }
      );
    }
    if (declaredSize > maxBytes) {
      return NextResponse.json(
        { error: `Archivo demasiado grande. Máximo ${Math.round(maxBytes / 1024 / 1024)} MB.` },
        { status: 400 }
      );
    }

    // C5: carpeta destino restringida a un patrón seguro
    const rawFolder = typeof folder === "string" ? folder.trim() : "";
    const safeFolder = /^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*$/.test(rawFolder)
      ? rawFolder
      : isAudio
        ? "audio"
        : "images";

    const presignedData = await getPresignedUploadUrl(
      filename,
      contentType,
      safeFolder
    );

    return NextResponse.json(presignedData);
  } catch (error) {
    console.error("Error al generar Presigned URL para S3:", error);
    return NextResponse.json(
      { error: "Error al generar la URL de subida." },
      { status: 500 }
    );
  }
}
