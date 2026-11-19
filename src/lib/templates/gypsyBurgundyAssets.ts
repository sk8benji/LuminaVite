/**
 * Gypsy Burgundy Template - Asset Mappings (clon de Gatsby 20's, paleta burgundy)
 * Local base: /assets/templates/gypsy-burgundy/
 * S3 base: https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/gypsy-burgundy/
 * Assets optimizados a WebP (excepto sparklers.gif, animado).
 * Subida a S3 con el boton "Migrar assets a AWS" del dashboard (ruta migrate-template-assets).
 */

const S3_BASE = "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/gypsy-burgundy";
const LOCAL_BASE = "/assets/templates/gypsy-burgundy";

export const GYPSY_BURGUNDY_ASSETS = {
  // Backgrounds & Textures
  bgTexture: `${LOCAL_BASE}/bg-texture.webp`,
  bgCrumpled: `${LOCAL_BASE}/bg-crumpled.webp`,
  artDecoPattern: `${LOCAL_BASE}/art-deco-pattern.webp`,
  artDecoFrame: `${LOCAL_BASE}/art-deco-frame.webp`,
  goldOval: `${LOCAL_BASE}/gold-oval.webp`,

  // Envelopes & Sparklers
  envelopeClosed: `${LOCAL_BASE}/envelope-closed.webp`,
  envelopeOpen: `${LOCAL_BASE}/sobre-abierto.webp`,
  envelopePocketV: `${LOCAL_BASE}/envelope-flap.webp`,
  envelopeThankYou: `${LOCAL_BASE}/envelope-thank-you.webp`,
  waxSeal: `${LOCAL_BASE}/wax-seal.webp`,
  selloXv: `${LOCAL_BASE}/sello-xv.webp`,
  sparklersGif: `${LOCAL_BASE}/sparklers.gif`,
  sparklerStar: `${LOCAL_BASE}/sparkler-star.webp`,

  // Roaring 20s Accents
  headbandFeathers: `${LOCAL_BASE}/headband-feathers.webp`,
  vinylRecord: `${LOCAL_BASE}/vinyl-record.webp`,
  ticketBadge: `${LOCAL_BASE}/ticket-badge.webp`,
  coupleDance: `${LOCAL_BASE}/couple-dance.webp`,
  goldFrame: `${LOCAL_BASE}/gold-frame.webp`,
  photoStrip: `${LOCAL_BASE}/photo-chloe-portrait.webp`,
  goldFeather: `${LOCAL_BASE}/gold-feather.webp`,
  pearls: `${LOCAL_BASE}/pearls.webp`,
  starSparkle: `${LOCAL_BASE}/star-sparkle.webp`,
  florituraChloe: `${LOCAL_BASE}/floritura-chloe.webp`,
  tiaraArtDeco: `${LOCAL_BASE}/tiara-art-deco.webp`,
  divisorArtDeco: `${LOCAL_BASE}/divisor-art-deco.webp`,
  esquineroArtDeco: `${LOCAL_BASE}/esquinero-art-deco.webp`,
  abanicoPlumas: `${LOCAL_BASE}/abanico-plumas.webp`,

  // Photos
  quinceanera: `${LOCAL_BASE}/quinceanera-gatsby.webp`,
  quinceaneraGatsby: `${LOCAL_BASE}/quinceanera-gatsby.webp`,
  quinceaneraDorado: `${LOCAL_BASE}/quinceanera-dorado.webp`,
  photobooth1: `${LOCAL_BASE}/photobooth-1.webp`,
  photobooth2: `${LOCAL_BASE}/photobooth-2.webp`,
  photobooth3: `${LOCAL_BASE}/photobooth-3.webp`,
  damasGatsby: `${LOCAL_BASE}/damas-gatsby.webp`,
  chambelanesGatsby: `${LOCAL_BASE}/chambelanes-gatsby.webp`,
  photoChloeDress: `${LOCAL_BASE}/photo-chloe-dress.webp`,
  photoChloeCake: `${LOCAL_BASE}/photo-chloe-cake.webp`,
  photoChloePortrait: `${LOCAL_BASE}/photo-strip.webp`,

  // S3 Fallbacks (mismo nombre de archivo; se materializa con la migracion del dashboard)
  s3: {
    bgTexture: `${S3_BASE}/bg-texture.webp`,
    bgCrumpled: `${S3_BASE}/bg-crumpled.webp`,
    artDecoPattern: `${S3_BASE}/art-deco-pattern.webp`,
    artDecoFrame: `${S3_BASE}/art-deco-frame.webp`,
    goldOval: `${S3_BASE}/gold-oval.webp`,
    envelopeClosed: `${S3_BASE}/envelope-closed.webp`,
    envelopeOpen: `${S3_BASE}/sobre-abierto.webp`,
    envelopePocketV: `${S3_BASE}/envelope-flap.webp`,
    envelopeThankYou: `${S3_BASE}/envelope-thank-you.webp`,
    waxSeal: `${S3_BASE}/wax-seal.webp`,
    selloXv: `${S3_BASE}/sello-xv.webp`,
    sparklersGif: `${S3_BASE}/sparklers.gif`,
    sparklerStar: `${S3_BASE}/sparkler-star.webp`,
    headbandFeathers: `${S3_BASE}/headband-feathers.webp`,
    vinylRecord: `${S3_BASE}/vinyl-record.webp`,
    ticketBadge: `${S3_BASE}/ticket-badge.webp`,
    coupleDance: `${S3_BASE}/couple-dance.webp`,
    goldFrame: `${S3_BASE}/gold-frame.webp`,
    photoStrip: `${S3_BASE}/photo-chloe-portrait.webp`,
    goldFeather: `${S3_BASE}/gold-feather.webp`,
    pearls: `${S3_BASE}/pearls.webp`,
    starSparkle: `${S3_BASE}/star-sparkle.webp`,
    florituraChloe: `${S3_BASE}/floritura-chloe.webp`,
    tiaraArtDeco: `${S3_BASE}/tiara-art-deco.webp`,
    divisorArtDeco: `${S3_BASE}/divisor-art-deco.webp`,
    esquineroArtDeco: `${S3_BASE}/esquinero-art-deco.webp`,
    abanicoPlumas: `${S3_BASE}/abanico-plumas.webp`,
    quinceanera: `${S3_BASE}/quinceanera-gatsby.webp`,
    quinceaneraGatsby: `${S3_BASE}/quinceanera-gatsby.webp`,
    quinceaneraDorado: `${S3_BASE}/quinceanera-dorado.webp`,
    photobooth1: `${S3_BASE}/photobooth-1.webp`,
    photobooth2: `${S3_BASE}/photobooth-2.webp`,
    photobooth3: `${S3_BASE}/photobooth-3.webp`,
    damasGatsby: `${S3_BASE}/damas-gatsby.webp`,
    chambelanesGatsby: `${S3_BASE}/chambelanes-gatsby.webp`,
    photoChloeDress: `${S3_BASE}/photo-chloe-dress.webp`,
    photoChloeCake: `${S3_BASE}/photo-chloe-cake.webp`,
    photoChloePortrait: `${S3_BASE}/photo-strip.webp`,
  },
};

export { S3_BASE as GYPSY_BURGUNDY_S3_BASE, LOCAL_BASE as GYPSY_BURGUNDY_LOCAL_BASE };
