// Limpia HTML escrito en el admin (p. ej. el texto de Hospedaje de Elegant
// Rose) antes de mostrarlo en la invitación: deja solo formato de texto
// (negrita, cursiva, subrayado, saltos, párrafos, listas y enlaces) y
// quita todo lo demás (scripts, iframes, imágenes, estilos incrustados,
// manejadores de eventos, enlaces javascript:). El contenido lo escribe
// Abraham en el admin; esto además limpia el HTML basura que llega al
// pegar desde Word u otra web.
//
// Sin dependencias: la versión anterior usaba isomorphic-dompurify, cuyo
// jsdom 31 exige Node >= 22 y el servidor corre Node 20 — el import
// reventaba en producción y TODAS las invitaciones daban 500
// (28 nov 2026, hotfix). No instalar sanitizadores con jsdom sin
// verificar antes su engines contra el Node de Railway (20.20.2).
const ALLOWED_TAGS = new Set([
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
]);

// Elementos que se borran con todo su contenido (si queda solo la
// etiqueta de cierre, el paso de la lista permitida ya la quita).
const BLOCKED_WITH_CONTENT =
  /<(script|style|iframe|object|embed|form|title|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

// Etiquetas sueltas peligrosas o sin uso (img, video, input, etc.).
const BLOCKED_VOID = /<(img|video|audio|input|button|link|meta|base|source|track|canvas|svg|math)\b[^>]*>/gi;

export function sanitizeRichText(html: string): string {
  let out = html.replace(/<!--[\s\S]*?-->/g, "");
  out = out.replace(BLOCKED_WITH_CONTENT, "");
  out = out.replace(BLOCKED_VOID, "");
  // Solo quedan etiquetas de la lista permitida, y solo con atributos seguros.
  out = out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (match, tagName: string, attrs: string) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (match.startsWith("</")) return `</${tag}>`;
    if (tag === "br") return "<br>";
    let safeAttrs = "";
    if (tag === "a") {
      const href = attrs.match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      if (href) {
        const url = (href[2] ?? href[3] ?? href[4] ?? "").trim();
        if (/^(https?:|mailto:)/i.test(url)) {
          safeAttrs += ` href="${url.replace(/"/g, "")}"`;
        }
      }
      safeAttrs += ' target="_blank" rel="noopener noreferrer"';
    }
    if (tag === "p" || tag === "span") {
      const style = attrs.match(/style\s*=\s*("([^"]*)"|'([^']*)')/i);
      if (style) {
        const s = style[2] ?? style[3] ?? "";
        const m = s.match(/text-align\s*:\s*(left|center|right|justify)/i);
        if (m) safeAttrs += ` style="text-align:${m[1].toLowerCase()}"`;
      }
    }
    return `<${tag}${safeAttrs}>`;
  });
  return out;
}
