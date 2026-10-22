import { randomInt } from "crypto";
import prisma from "@/lib/db";
import { getPublicBaseUrl } from "@/lib/shortener";

/**
 * Link corto del panel del anfitrión (la "Mamá"): https://clickandlove.app/m/<code>
 *
 * Diseño:
 * - El código (10 caracteres, alfabeto amplio sin ambiguos 0/O/1/l/I) vive en
 *   `Evento.panelShortCode` (único, nullable) — NO se guarda la URL larga en
 *   ShortLink. La ruta /m/<code> resuelve el código contra el EVENTO en el
 *   momento de redirigir y construye /<slug>/panel?key=<panelToken ACTUAL>.
 * - Consecuencias: si el panelToken rota (rotate-key), el link corto sigue
 *   funcionando; "regenerar" = escribir un código nuevo en la columna, y el
 *   anterior deja de resolver al instante (404).
 * - Los códigos de mapas de ShortLink son 5 hex; los de panel son 10 del
 *   alfabeto de abajo: los dos espacios nunca colisionan.
 */

export const PANEL_SHORT_CODE_LENGTH = 10;

// Sin caracteres ambiguos: fuera 0, O, 1, l, I.
const PANEL_CODE_ALPHABET =
  "23456789" + // dígitos sin 0 ni 1
  "ABCDEFGHJKLMNPQRSTUVWXYZ" + // mayúsculas sin I ni O
  "abcdefghijkmnopqrstuvwxyz"; // minúsculas sin l

const PANEL_CODE_RE = /^[23456789A-HJ-NP-Za-km-z]{10}$/;

/** ¿El código tiene forma de link corto de panel? (los de mapas son 5 hex) */
export function isPanelShortCode(code: string): boolean {
  return PANEL_CODE_RE.test(code || "");
}

export function generatePanelShortCode(): string {
  let code = "";
  for (let i = 0; i < PANEL_SHORT_CODE_LENGTH; i++) {
    code += PANEL_CODE_ALPHABET[randomInt(PANEL_CODE_ALPHABET.length)];
  }
  return code;
}

export function buildPanelShortUrl(code: string): string {
  return `${getPublicBaseUrl()}/m/${code}`;
}

// ---------------------------------------------------------------------------
// Asegurar la columna en PostgreSQL (mismo patrón perezoso que qr-table.ts:
// en producción el `prisma db push` del arranque no siempre agrega columnas).
// ---------------------------------------------------------------------------
let isEnsured = false;
let ensuringPromise: Promise<void> | null = null;

export async function ensurePanelShortCodeColumn(): Promise<void> {
  if (isEnsured) return;
  if (ensuringPromise) return ensuringPromise;

  ensuringPromise = (async () => {
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "panelShortCode" TEXT;`
      );
      await prisma.$executeRawUnsafe(
        `CREATE UNIQUE INDEX IF NOT EXISTS "Evento_panelShortCode_key" ON "Evento"("panelShortCode");`
      );
      isEnsured = true;
    } catch (err) {
      // No marcar como asegurado si falló: el siguiente request lo reintenta.
      ensuringPromise = null;
      console.warn("Aviso al asegurar columna panelShortCode:", err);
    }
  })();

  return ensuringPromise;
}

/** Genera un código que ningún otro evento tenga (reintenta ante colisión). */
async function generateUniquePanelShortCode(exclude?: string | null): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generatePanelShortCode();
    if (exclude && code === exclude) continue;
    const taken = await prisma.evento.findUnique({
      where: { panelShortCode: code },
      select: { id: true },
    });
    if (!taken) return code;
  }
  throw new Error("No se pudo generar un código corto único para el panel.");
}

/**
 * Devuelve el código corto del evento, generándolo si aún no tiene.
 * Se usa al crear el evento y cuando el admin pide el link por primera vez.
 */
export async function getOrCreatePanelShortCode(eventoId: string): Promise<string> {
  await ensurePanelShortCodeColumn();

  const evento = await prisma.evento.findUnique({
    where: { id: eventoId },
    select: { panelShortCode: true },
  });
  if (!evento) throw new Error("Evento no encontrado.");
  if (evento.panelShortCode) return evento.panelShortCode;

  const code = await generateUniquePanelShortCode();
  await prisma.evento.update({
    where: { id: eventoId },
    data: { panelShortCode: code },
  });
  return code;
}

/**
 * Emite un código nuevo e invalida el anterior de inmediato
 * (la resolución compara contra el valor ACTUAL de la columna).
 */
export async function regeneratePanelShortCode(eventoId: string): Promise<string> {
  await ensurePanelShortCodeColumn();

  const evento = await prisma.evento.findUnique({
    where: { id: eventoId },
    select: { panelShortCode: true },
  });
  if (!evento) throw new Error("Evento no encontrado.");

  const code = await generateUniquePanelShortCode(evento.panelShortCode);
  await prisma.evento.update({
    where: { id: eventoId },
    data: { panelShortCode: code },
  });
  return code;
}

/** Código para un evento recién creado (sin escribir aún: va en el create). */
export async function generatePanelShortCodeForNewEvent(): Promise<string> {
  await ensurePanelShortCodeColumn();
  return generateUniquePanelShortCode();
}

/**
 * Resuelve un código corto al destino del panel con el panelToken ACTUAL.
 * Devuelve null si el código no existe o fue revocado (→ 404 limpio).
 */
export async function resolvePanelShortCode(
  code: string
): Promise<{ slug: string; panelToken: string | null } | null> {
  await ensurePanelShortCodeColumn();

  const evento = await prisma.evento.findUnique({
    where: { panelShortCode: code },
    select: { slug: true, panelToken: true },
  });
  if (!evento) return null;
  return { slug: evento.slug, panelToken: evento.panelToken };
}
