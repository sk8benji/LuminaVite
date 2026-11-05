/**
 * Blush Princess Template - Asset Mappings (set de Abraham 2026-10-23,
 * réplica del "Blush Quinceanera Website Template" de CouCou Printables)
 * S3 (al migrar): luminavite-storage/templates/blush-princess/
 * Local: /assets/template-blush/
 */

const S3_BASE = "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/blush-princess";
const LOCAL_BASE = "/assets/template-blush";

const A = (file: string) => `${LOCAL_BASE}/${file}`;

export const BLUSH_ASSETS = {
  // Fondos
  silkA: A("fondo-seda-a.webp"),
  silkB: A("fondo-seda-b.webp"),
  floralBg: A("fondo-floral.webp"),
  floralWide: A("fondo-floral-ancho.webp"),

  // Sobre interactivo
  envelopeClosed: A("sobre-cerrado.png"),
  envelopeOpen: A("sobre-abierto.webp"),
  letterPaper: A("carta-papel.webp"),
  bowCard: A("tarjeta-mono.webp"),
  seal: A("sello-corona.webp"),

  // Marcos
  crownFrame: A("marco-corona.webp"),
  ovalFrame: A("marco-oval.webp"),
  mirrorFrame: A("marco-espejo.webp"),
  cameoFrame: A("marco-camafeo.webp"),

  // Fotos demo
  photo1: A("foto-1.webp"),
  photo2: A("foto-2.webp"),
  photo3: A("foto-3.webp"),
  photoGirl: A("foto-nina.webp"),

  // Piezas decorativas (fondo blanco retirado por bordes)
  butterflyA: A("mariposa-a.webp"),
  butterflyB: A("mariposa-b.webp"),
  crown: A("corona.webp"),
  goldCorner: A("esquina-oro.webp"),
  bouquetA: A("ramo-a.webp"),
  bouquetB: A("ramo-b.webp"),
  bouquetC: A("ramo-c.webp"),
  cross: A("cruz-oro.webp"),
  chandelier: A("candelabro.webp"),
  girlBack: A("ilustracion-espalda.webp"),
  girlCorset: A("ilustracion-corset.webp"),

  // Separador
  divider: A("separador-oro.webp"),

  // Adornos florales y lazos Quince Glamour
  monogramST: A("3e1051459899aa8daa665e1b97b64d87.png"),
  flowerCorner: A("f30fb73638774030da3d5d012f6f8810.png"),
  flowerCornerAlt: A("ddeaa00850e071459546b0aeaff0c4ee.png"),
  bowPink: A("34198773bf15aee1f3707882466e0db8.png"),
  wingsGold: A("18519ee7d320738ed143ab6aec0b1543.png"),
};

export { S3_BASE as BLUSH_S3_BASE, LOCAL_BASE as BLUSH_LOCAL_BASE };
