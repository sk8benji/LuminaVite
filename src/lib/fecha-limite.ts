// Formatea la fecha límite de RSVP para mostrarla al invitado.
//
// Desde el fix de persistencia, `fechaLimiteRsvp` se guarda como fecha real
// (ISO en la base), mientras que la frase legible vive en `rsvpFechaLimite`.
// Este helper garantiza que NUNCA se vea un ISO crudo en el front público:
// - Si el valor ya es texto legible ("20 de Octubre", "July 15"), lo devuelve tal cual.
// - Si es una fecha (Date, string ISO o numérico tipo 12/4/2026), la formatea
//   legible: "4 de diciembre" (es) / "December 4" (en).
export function formatFechaLimiteRsvp(
  value: string | Date | null | undefined,
  lang: "es" | "en" = "es"
): string | null {
  if (value === null || value === undefined) return null;

  let date: Date | null = null;

  if (value instanceof Date) {
    date = value;
  } else {
    const text = String(value).trim();
    if (!text) return null;

    const looksIso = /^\d{4}-\d{2}-\d{2}([T ]|$)/.test(text);
    const looksNumeric = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(text);
    if (!looksIso && !looksNumeric) {
      return text; // ya es texto legible
    }
    const parsed = new Date(text);
    if (isNaN(parsed.getTime())) return text;
    date = parsed;
  }

  if (isNaN(date.getTime())) return null;

  try {
    return lang === "en"
      ? date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        })
      : date.toLocaleDateString("es-MX", {
          day: "numeric",
          month: "long",
          timeZone: "UTC",
        });
  } catch {
    return null;
  }
}
