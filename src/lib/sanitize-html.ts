// Limpia HTML escrito en el admin (p. ej. el texto de Hospedaje de Elegant
// Rose) antes de mostrarlo en la invitación: deja solo formato de texto
// (negrita, cursiva, subrayado, saltos, párrafos, listas y enlaces) y
// quita todo lo demás (scripts, iframes, estilos incrustados, manejadores
// de eventos). El contenido lo escribe Abraham en el admin; esto además
// limpia el HTML basura que llega al pegar desde Word u otra web.
import DOMPurify from "isomorphic-dompurify";

export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "b",
      "strong",
      "i",
      "em",
      "u",
      "br",
      "p",
      "ul",
      "ol",
      "li",
      "span",
      "a",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "style"],
  });
}
