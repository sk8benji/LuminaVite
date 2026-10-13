/**
 * Sanitiza y extrae URLs estándar y navegables de Google Maps.
 * Soporta etiquetas <iframe> completas, URLs embebidas con pb, enlaces cortos maps.app.goo.gl
 * y fallback automático a nombre de lugar o dirección física.
 */
export function extractCleanMapUrl(
  input?: string | null,
  nombreLugar?: string | null,
  direccionFallback?: string | null
): string {
  const raw = (input || "").trim();

  // 1. Si viene una etiqueta <iframe> completa, extraer el atributo src
  let candidate = raw;
  const iframeMatch = raw.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    candidate = iframeMatch[1].trim();
  }

  // 2. Si es enlace corto directo de Google Maps (ej. maps.app.goo.gl o goo.gl/maps)
  if (/^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(candidate)) {
    return candidate;
  }

  // 3. Si es un embed con parámetro pb de Google Maps
  if (candidate.includes("google.com/maps/embed") || candidate.includes("/maps/embed") || candidate.includes("pb=")) {
    // Intentar extraer el nombre del lugar: !2sNombre%20Del%20Lugar!
    const placeMatch = candidate.match(/!2s([^!]+)!/);
    if (placeMatch && placeMatch[1]) {
      try {
        const decodedPlace = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(decodedPlace)}`;
      } catch {
        const fallbackPlace = placeMatch[1].replace(/\+/g, " ");
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackPlace)}`;
      }
    }

    // Intentar extraer coordenadas: !3dLAT!2dLNG
    const latMatch = candidate.match(/!3d([-0-9.]+)/);
    const lngMatch = candidate.match(/!2d([-0-9.]+)/);
    if (latMatch && lngMatch) {
      return `https://www.google.com/maps/search/?api=1&query=${latMatch[1]},${lngMatch[1]}`;
    }

    // Intentar extraer parámetro q si existe
    try {
      const urlObj = new URL(candidate);
      const q = urlObj.searchParams.get("q");
      if (q) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
      }
    } catch {}
  }

  // 4. Si ya es una URL normal válida de Google Maps o Waze
  if (/^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|waze\.com)/i.test(candidate)) {
    return candidate;
  }

  // 5. Fallback a búsqueda con nombre del lugar y/o dirección
  const fallbackQuery = [nombreLugar, direccionFallback].filter(Boolean).join(", ").trim();
  if (fallbackQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
  }

  // Si candidate parece una URL cualquiera que no sea iframe
  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }

  return candidate || "";
}
