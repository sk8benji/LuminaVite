import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, contentType, folder } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename y contentType son obligatorios." },
        { status: 400 }
      );
    }

    // Validar tipo MIME permitido
    const allowedImages = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    const allowedAudio = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a"];

    if (folder === "audio" && !allowedAudio.includes(contentType)) {
      return NextResponse.json(
        { error: "Formato de audio no permitido. Usa MP3 o WAV." },
        { status: 400 }
      );
    }

    if (folder === "images" && !allowedImages.includes(contentType)) {
      return NextResponse.json(
        { error: "Formato de imagen no permitido. Usa JPEG, PNG o WebP." },
        { status: 400 }
      );
    }

    const presignedData = await getPresignedUploadUrl(
      filename,
      contentType,
      folder === "audio" ? "audio" : "images"
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
