/**
 * Utility for uploading files directly to S3 / Storage via presigned URLs from client components.
 */
export async function uploadClientFile(
  file: File,
  folder: string = "general"
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const isAudio = ["mp3", "wav", "m4a", "ogg"].includes(ext);

  let resolvedType = file.type;
  if (!resolvedType || resolvedType === "application/octet-stream") {
    if (["mp3"].includes(ext)) resolvedType = "audio/mpeg";
    else if (["wav"].includes(ext)) resolvedType = "audio/wav";
    else if (["m4a"].includes(ext)) resolvedType = "audio/m4a";
    else if (["ogg"].includes(ext)) resolvedType = "audio/ogg";
    else if (["jpg", "jpeg"].includes(ext)) resolvedType = "image/jpeg";
    else if (["png"].includes(ext)) resolvedType = "image/png";
    else if (["webp"].includes(ext)) resolvedType = "image/webp";
    else resolvedType = isAudio ? "audio/mpeg" : "image/jpeg";
  }

  const res = await fetch("/api/s3/presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: resolvedType,
      folder,
      fileSize: file.size,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Error al obtener URL presignada");
  }

  const uploadRes = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": resolvedType },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Falló la subida del archivo al almacenamiento.");
  }

  return data.fileUrl;
}
