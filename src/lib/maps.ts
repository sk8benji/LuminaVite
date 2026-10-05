/**
 * Utilidades para procesar enlaces y códigos embebidos (iframe) de Google Maps / Waze.
 */

export function getMapEmbedUrl(
  mapUrlOrIframe?: string | null,
  fallbackAddress?: string | null
): string | null {
  const raw = (mapUrlOrIframe || "").trim();

  // 1. Si el usuario pegó el código HTML del <iframe> completo de Google Maps
  if (raw.toLowerCase().includes("<iframe")) {
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // 2. Si ya es una URL de embed directa de Google Maps
  if (raw.includes("/maps/embed") || raw.includes("output=embed")) {
    return raw;
  }

  // 3. Si es una URL estándar de Google Maps con query 'q'
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const url = new URL(raw);
      const q = url.searchParams.get("q") || url.searchParams.get("query");
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
      const placeMatch = raw.match(/\/maps\/place\/([^/@]+)/);
      if (placeMatch && placeMatch[1]) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
    } catch {
      // Ignorar errores de URL parse
    }
  }

  // 4. Si contamos con una dirección de respaldo o texto de búsqueda
  const query = (fallbackAddress || raw || "").trim();
  if (query) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  return null;
}

export function getMapDirectionsUrl(
  mapUrlOrIframe?: string | null,
  fallbackAddress?: string | null
): string {
  const raw = (mapUrlOrIframe || "").trim();

  // Si pegó un <iframe>
  if (raw.toLowerCase().includes("<iframe")) {
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      if (fallbackAddress && fallbackAddress.trim()) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackAddress.trim())}`;
      }
      return srcMatch[1];
    }
  }

  // Si ya es un enlace directo a Google Maps, Waze o URL externa
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    // Si es un embed directo sin app, redirigir a búsqueda si hay fallbackAddress
    if (raw.includes("/maps/embed") && fallbackAddress && fallbackAddress.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackAddress.trim())}`;
    }
    return raw;
  }

  const query = (fallbackAddress || raw || "").trim();
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return "#";
}
