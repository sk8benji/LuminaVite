/**
 * Miss 15 Template - Asset Mappings (descargados del Canva público
 * "Miss 15 Años" por instrucción de Abraham, 2026-10-23)
 * S3 (al migrar): luminavite-storage/templates/miss-15/
 * Local: /assets/template-miss15/
 */

const S3_BASE = "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/miss-15";
const LOCAL_BASE = "/assets/template-miss15";

const A = (file: string) => `${LOCAL_BASE}/${file}`;

export const MISS15_ASSETS = {
  // Fotos demo (el cliente las cambia por las suyas)
  swingPhoto: A("foto-columpio.webp"),
  swingPhotoAlt: A("foto-columpio-2.webp"),
  portraitPhoto: A("foto-retrato.webp"),
  damasPhoto: A("foto-damas.webp"),
  chambelanesPhoto: A("foto-chambelanes.webp"),

  // Ilustraciones e iconos
  gownIllustration: A("ilustracion-vestido.webp"),
  crownDivider: A("corona-divisor.webp"),
  crown: A("corona.webp"),
  churchIcon: A("icono-iglesia.webp"),
  coupleIcon: A("icono-pareja.webp"),
  dinnerIcon: A("icono-cena.webp"),
  discoIcon: A("icono-disco.webp"),
  heartsDivider: A("divisor-corazones.webp"),
  bow: A("mono.webp"),
  goldSeal: A("sello-oro.webp"),

  // Tarjeta acuarela de agradecimiento
  cloudCard: A("tarjeta-nube.webp"),
};

export { S3_BASE as MISS15_S3_BASE, LOCAL_BASE as MISS15_LOCAL_BASE };
