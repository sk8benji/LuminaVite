import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { filename, contentType, folder } = body;

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

    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
      "image/svg+xml",
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

    // Carpeta destino saneada: templates/*, clientes/* o carpeta por defecto
    const targetFolder =
      typeof folder === "string" && folder.trim().length > 0
        ? folder.trim()
        : isAudio
        ? "audio"
        : "images";

    const presignedData = await getPresignedUploadUrl(
      filename,
      contentType,
      targetFolder
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
