// Optimiza una imagen en el navegador antes de subirla a S3: la redimensiona
// (sin recortar, manteniendo proporción) y la convierte a WebP.
// Devuelve null si algo falla: el llamador sube entonces el original intacto.
export async function optimizarImagen(
  file: File,
  maxWidth: number,
  quality = 0.82
): Promise<{ blob: Blob; name: string } | null> {
  try {
    let bitmap: ImageBitmap;
    try {
      // Respetar la orientación EXIF (fotos de teléfono) cuando el navegador lo soporta
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" } as any);
    } catch {
      bitmap = await createImageBitmap(file);
    }
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    if (!blob) return null;
    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return { blob, name };
  } catch {
    return null;
  }
}
