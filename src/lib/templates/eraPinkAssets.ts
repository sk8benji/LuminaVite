/**
 * Quince Era Pink Template - Asset Mappings (set de Abraham 2026-10-23,
 * réplica del "8 Quinceañera Pink" de The Hanger PH en Canva)
 * S3 (al migrar): luminavite-storage/templates/quince-era-pink/
 * Local: /assets/template-era-pink/
 */

const S3_BASE = "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/quince-era-pink";
const LOCAL_BASE = "/assets/template-era-pink";

const A = (file: string) => `${LOCAL_BASE}/${file}`;

export const ERA_ASSETS = {
  // Fotos demo (Abraham las cambia por las del cliente)
  photoPortrait: A("foto-retrato.webp"),
  photoFront: A("foto-frente.webp"),
  photoBack: A("foto-espalda.webp"),
  photoSeated: A("foto-sentada.webp"),
  photoVenue: A("foto-venue.webp"),
  photoChurch: A("foto-iglesia.webp"),

  // Sobre e intro
  envelope: A("sobre-rosa.webp"),
  seal: A("sello-rosa.webp"),
  musicNote: A("nota-musical.webp"),

  // Letras monograma con hojas (drop caps de sección)
  letterV: A("letra-v.webp"),
  letterP: A("letra-p.webp"),
  letterS: A("letra-s.webp"),
  letterR: A("letra-r.webp"),

  // Ilustraciones
  bowGirl: A("ilustracion-mono.webp"),
  ladyIllustration: A("ilustracion-dama.webp"),
  dancingCouple: A("pareja-vals.webp"),
  gifts: A("regalos-rosa.webp"),
  giftsIcon: A("icono-regalos.webp"),
  discoBall: A("bola-disco.webp"),
  tiara: A("tiara-plateada.webp"),
  flowers: A("flores-acuarela.webp"),
  darkCard: A("tarjeta-oscura.webp"),

  // Iconos del programa (SVG del set, rasterizados)
  cocktailIcon: A("icono-copas.webp"),
  dinnerIcon: A("icono-cena.webp"),
  divider: A("separador.webp"),
};

export { S3_BASE as ERA_S3_BASE, LOCAL_BASE as ERA_LOCAL_BASE };
