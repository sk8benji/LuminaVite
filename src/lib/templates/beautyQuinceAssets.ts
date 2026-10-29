/**
 * Beauty Quince Template - Asset Mappings (set de Abraham 2026-10-29,
 * réplica de la "Beauty Quince Invitation" de Canva)
 * S3 (al migrar): luminavite-storage/templates/beauty-quince/
 * Local: /assets/template-beauty-quince/
 *
 * ARTE EDITABLE SIN TOCAR CÓDIGO:
 * Cada pieza vive en este único mapa. El componente resuelve el arte con
 * resolveBeautyQuinceAssets(): primero el default de aquí y encima cualquier
 * reemplazo guardado en la plantilla (admin Templates > Arte Beauty Quince,
 * que sube a S3 en templates/beauty-quince/images y lo guarda en
 * arteBeautyQuince). Sin reemplazo, se usa el default. Reemplazar un archivo
 * con el mismo nombre en S3 también funciona sin tocar código.
 */

const S3_BASE = "https://luminavite-storage.s3.us-east-1.amazonaws.com/templates/beauty-quince";
const LOCAL_BASE = "/assets/template-beauty-quince";

const A = (file: string) => `${LOCAL_BASE}/${file}`;

export const BEAUTY_QUINCE_ASSETS = {
  // Sobre interactivo
  sobreCerradoSello: A("sobre-cerrado-sello.webp"),
  sobreAzulAbierto: A("sobre-azul-abierto.webp"),
  solapaSobreDorada: A("solapa-sobre-dorada.webp"),

  // Fondos y marcos
  bibliotecaDorada: A("biblioteca-dorada.webp"),
  bibliotecaAzul: A("biblioteca-azul.webp"),
  marcoAzulRosas: A("marco-azul-rosas.webp"),
  marcoAzulSuperior: A("marco-azul-superior.webp"),
  marcoAzulInferior: A("marco-azul-inferior.webp"),
  // Important Details: marco extensible en 3 partes (Abraham 2026-10-29).
  // Superior = rosas esquina superior izquierda; central = rieles dorados
  // + fondo azul noche, se repite en vertical; inferior = rosas esquina
  // inferior derecha. Así el marco crece con el texto sin cortar flores.
  detailsFrameTop: A("details-frame-top.webp"),
  detailsFrameMiddle: A("details-frame-middle.webp"),
  detailsFrameBottom: A("details-frame-bottom.webp"),
  marcoCortinaDorada: A("marco-cortina-dorada.webp"),
  marcoCremaCinta: A("marco-crema-cinta.webp"),
  marcoCremaEsquinas: A("marco-crema-esquinas.webp"),
  cartaPapelCinta: A("carta-papel-cinta.webp"),

  // Escenas
  puertasPalacio: A("puertas-palacio.webp"),
  castillo: A("castillo.webp"),
  castilloLuna: A("castillo-luna.webp"),
  arcoRosasCastillo: A("arco-rosas-castillo.webp"),

  // Piezas decorativas
  rosaEncantada: A("rosa-encantada.webp"),
  rosaCampana: A("rosa-campana.webp"),
  llaveReal: A("llave-real.webp"),
  corona: A("corona.webp"),
  coronaTiara: A("corona-tiara.webp"),
  cetroReal: A("cetro-real.webp"),
  carroza: A("carroza.webp"),
  discoMusica: A("disco-musica.webp"),
  copaBrindis: A("copa-brindis.webp"),
  candelabro: A("candelabro.webp"),
  libroCuento: A("libro-cuento.webp"),
  espejoMano: A("espejo-mano.webp"),
  abanico: A("abanico.webp"),
  zapatoOro: A("zapato-oro.webp"),
  trajePrincipe: A("traje-principe.webp"),
  vestidoBella: A("vestido-bella.webp"),
  destellosDorados: A("destellos-dorados.webp"),
  brilloDoradoMarco: A("brillo-dorado-marco.webp"),

  // Fotos demo (la quinceañera real las reemplaza desde su evento)
  fotoCarrozaAtardecer: A("foto-carroza-atardecer.webp"),
  fotoVestidoManiqui: A("foto-vestido-maniqui.webp"),
  fotoMaquillaje: A("foto-maquillaje.webp"),
  fotoMaquillajeRasgado: A("foto-maquillaje-rasgado.webp"),
  baseFloralRosas: A("base-floral-rosas.webp"),
};

export type BeautyQuinceArtKey = keyof typeof BEAUTY_QUINCE_ASSETS;
export type BeautyQuinceArtOverrides = Partial<Record<BeautyQuinceArtKey, string>>;

/** Etiquetas en español para el editor del admin (una por pieza). */
export const BEAUTY_QUINCE_ASSET_LABELS: Record<BeautyQuinceArtKey, string> = {
  sobreCerradoSello: "Sobre cerrado con sello",
  sobreAzulAbierto: "Sobre azul abierto",
  solapaSobreDorada: "Solapa dorada del sobre",
  bibliotecaDorada: "Biblioteca dorada (fondo)",
  bibliotecaAzul: "Biblioteca azul (fondo)",
  marcoAzulRosas: "Marco azul con rosas",
  marcoAzulSuperior: "Marco azul superior (rosas)",
  marcoAzulInferior: "Marco azul inferior (rosas)",
  detailsFrameTop: "Marco Details superior (rosas)",
  detailsFrameMiddle: "Marco Details central (repetible)",
  detailsFrameBottom: "Marco Details inferior (rosas)",
  marcoCortinaDorada: "Marco cortina dorada",
  marcoCremaCinta: "Marco crema con cinta azul",
  marcoCremaEsquinas: "Marco crema esquinas doradas",
  cartaPapelCinta: "Papel carta con cinta",
  puertasPalacio: "Puertas del palacio",
  castillo: "Castillo",
  castilloLuna: "Castillo a la luz de la luna",
  arcoRosasCastillo: "Arco de rosas con castillo",
  rosaEncantada: "Rosa encantada",
  rosaCampana: "Rosa en campana de cristal",
  llaveReal: "Llave real",
  corona: "Corona",
  coronaTiara: "Tiara de la corte",
  cetroReal: "Cetro real",
  carroza: "Carroza",
  discoMusica: "Disco de música",
  copaBrindis: "Copa de brindis",
  candelabro: "Candelabro",
  libroCuento: "Libro de cuento",
  espejoMano: "Espejo de mano",
  abanico: "Abanico",
  zapatoOro: "Zapato dorado",
  trajePrincipe: "Traje del príncipe",
  vestidoBella: "Vestido Bella",
  destellosDorados: "Destellos dorados",
  brilloDoradoMarco: "Brillo dorado (marco)",
  fotoCarrozaAtardecer: "Foto: carroza al atardecer",
  fotoVestidoManiqui: "Foto: vestido en maniquí",
  fotoMaquillaje: "Foto: maquillaje / arreglo",
  fotoMaquillajeRasgado: "Foto: maquillaje con bordes rasgados (countdown)",
  baseFloralRosas: "Base floral dorada con rosas (countdown)",
};

/** Defaults + reemplazos no vacíos. Nunca rompe si el override viene incompleto. */
export function resolveBeautyQuinceAssets(
  overrides?: BeautyQuinceArtOverrides | null
): Record<BeautyQuinceArtKey, string> {
  const out: Record<string, string> = { ...BEAUTY_QUINCE_ASSETS };
  if (overrides) {
    for (const [k, v] of Object.entries(overrides)) {
      if (typeof v === "string" && v.trim() && k in out) out[k] = v;
    }
  }
  return out as Record<BeautyQuinceArtKey, string>;
}

export { S3_BASE as BEAUTY_QUINCE_S3_BASE, LOCAL_BASE as BEAUTY_QUINCE_LOCAL_BASE };
