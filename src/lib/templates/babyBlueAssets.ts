/**
 * Baby Blue Template - Asset Mappings (descargados del Canva público
 * "Baby Blue Quinceañera" de Studio Eburnean por instrucción de Abraham, 2026-10-23)
 * S3 (al migrar): luminavite-storage/templates/baby-blue/
 * Local: /assets/template-baby-blue/
 */

const S3_BASE = "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/baby-blue";
const LOCAL_BASE = "/assets/template-baby-blue";

const A = (file: string) => `${LOCAL_BASE}/${file}`;

export const BABY_BLUE_ASSETS = {
  // Sobre y sello
  envelopeClosed: A("sobre-cerrado.webp"),
  envelopeOpen: A("sobre-abierto.webp"),
  silverSeal: A("sello-plata.webp"),

  // Mariposas e ilustraciones
  pinkButterflies: A("mariposas-rosas.webp"),
  blueButterflies: A("mariposas-azules.webp"),
  lavenderButterflies: A("mariposas-lavanda.webp"),
  quinceGirl: A("quince-ilustracion.webp"),
  fatherDance: A("baile-papa.webp"),
  glassSlipper: A("zapatilla.webp"),
  discoBall: A("bola-disco.webp"),
  dove: A("paloma.webp"),
  plate: A("plato.webp"),
  ovalFrame: A("marco-oval.webp"),
  blueBouquet: A("ramo-azul.webp"),
  floralBorder: A("borde-floral.webp"),
  mansion: A("casa-ilustracion.webp"),
  wave: A("onda.webp"),
  stardust: A("polvo-estrellas.webp"),
  script15: A("script-15.webp"),
  scriptQuinceanera: A("script-quinceanera.webp"),

  // Iconos blancos
  pinIcon: A("pin.webp"),
  phoneIcon: A("telefono.webp"),

  // Fotos demo y texturas
  castlePhoto: A("foto-castillo.webp"),
  gazeboPhoto: A("foto-gazebo.webp"),
  backPhoto: A("foto-espalda.webp"),
  babyPhoto: A("foto-bebe.webp"),
  cameraPhoto: A("foto-camara.webp"),
  certificatePhoto: A("foto-certificado.webp"),
  creamTexture: A("textura-crema.webp"),
  blueTexture: A("textura-azul.webp"),
  pinkTexture: A("textura-rosa.webp"),
};

export { S3_BASE as BABY_BLUE_S3_BASE, LOCAL_BASE as BABY_BLUE_LOCAL_BASE };
