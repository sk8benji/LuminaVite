import fs from "fs";
import path from "path";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient, TipoEvento, EstiloPlantilla } from "@prisma/client";

// Cargar variables de entorno locales de .env de forma nativa si existen
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const k = trimmed.substring(0, eqIdx).trim();
          let v = trimmed.substring(eqIdx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    }
  }
} catch {}

const prisma = new PrismaClient();

const BUCKET_NAME =
  process.env.AWS_S3_BUCKET_NAME || process.env.BUCKET_NAME || "luminavite-storage";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT || undefined,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

interface EventPayload {
  id?: string;
  slug: string;
  panelToken?: string | null;
  tipoEvento?: string;
  estiloPlantilla?: string;
  titulo: string;
  subtitulo?: string | null;
  frasePersonalizada?: string | null;
  fechaEvento: string | Date;
  fechaTextoPersonalizada?: string | null;
  fotoPortadaUrl: string;
  fotoInfanciaUrl?: string | null;
  fotoActualUrl?: string | null;
  fotoCierreUrl?: string | null;
  musicaUrl?: string | null;
  reproducirMusicaAlAbrir?: boolean;
  videoUrl?: string | null;
  galeriaFotosUrls?: string[];
  wishlistUrl?: string | null;
  idiomaDefault?: string;
  celebrationGuideline?: string | null;
  telefonoWhatsappRsvp?: string;
  emailOrganizador?: string | null;
  aforoTotal?: number;
  fechaLimiteRsvp?: string | Date | null;
  maxPasesPorInvitado?: number;
  ceremoniaNombre?: string | null;
  ceremoniaDireccion?: string | null;
  ceremoniaMapUrl?: string | null;
  recepcionNombre?: string;
  recepcionDireccion?: string;
  recepcionMapUrl?: string;
  dressCodeTitulo?: string | null;
  dressCodeNota?: string | null;
  coloresReservados?: string[];
  itinerarioJson?: any;
  corteHonorJson?: any;
  mesaRegalosJson?: any;
  hospedajeJson?: any;
  transporteJson?: any;
  historiaHitosJson?: any;
  rsvps?: Array<{
    id?: string;
    nombreInvitado: string;
    telefono?: string | null;
    asistira: boolean;
    pases?: number;
    acompanantes?: string | null;
    createdAt?: string;
  }>;
}

async function loadEventsFromS3(): Promise<EventPayload[]> {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("⚠️ [MIGRATION] Credenciales de AWS no configuradas; saltando lectura directa de S3.");
    return [];
  }

  const events: EventPayload[] = [];
  try {
    console.log(`📦 [MIGRATION] Listando objetos en S3: bucket "${BUCKET_NAME}", prefijo "events-db/"...`);
    const listCmd = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "events-db/",
    });
    const listRes = await s3Client.send(listCmd);

    if (!listRes.Contents || listRes.Contents.length === 0) {
      console.log("ℹ️ [MIGRATION] No se encontraron archivos en events-db/ en S3.");
      return [];
    }

    for (const item of listRes.Contents) {
      if (item.Key && item.Key.endsWith(".json")) {
        try {
          const getCmd = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: item.Key,
          });
          const objRes = await s3Client.send(getCmd);
          if (objRes.Body) {
            const raw = await objRes.Body.transformToString();
            const parsed = JSON.parse(raw);
            if (parsed && parsed.slug) {
              events.push(parsed);
              console.log(`   📄 Leído de S3: ${item.Key} (${parsed.slug})`);
            }
          }
        } catch (e: any) {
          console.warn(`   ⚠️ Error al leer ${item.Key}:`, e.message);
        }
      }
    }
  } catch (err: any) {
    console.warn("⚠️ [MIGRATION] Error al consultar S3:", err.message);
  }

  return events;
}

function loadEventsFromLocalFile(): EventPayload[] {
  const filePath = path.join(process.cwd(), "data", "fallback-events.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      console.log(`📂 [MIGRATION] Se cargaron ${parsed.length} eventos desde data/fallback-events.json.`);
      return parsed;
    }
  } catch (err: any) {
    console.warn("⚠️ [MIGRATION] No se pudo leer fallback-events.json:", err.message);
  }
  return [];
}

async function migrate() {
  console.log("==========================================================");
  console.log("🚀 INICIANDO MIGRACIÓN: S3 / JSON -> POSTGRESQL (RAILWAY)");
  console.log("==========================================================");

  // 1. Verificar conexión a PostgreSQL
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Conexión a PostgreSQL establecida con éxito.");
  } catch (dbErr: any) {
    console.error("❌ ERROR CRÍTICO: No se pudo conectar a la base de datos PostgreSQL.");
    console.error("Verifica que DATABASE_URL esté correctamente configurada en Railway o en tu .env.");
    console.error(dbErr.message);
    process.exit(1);
  }

  // 2. Garantizar que exista un Usuario administrador para asociar los eventos
  const systemUser = await prisma.usuario.upsert({
    where: { email: "admin@clickandlove.app" },
    update: {},
    create: {
      email: "admin@clickandlove.app",
      nombre: "Administrador Click & Love",
      passwordHash: "system-migrated-account",
      rol: "ADMIN",
    },
  });
  console.log(`👤 Usuario anfitrión del sistema verificado (ID: ${systemUser.id}).`);

  // 3. Recopilar eventos de S3 y del archivo local sin duplicar
  const s3Events = await loadEventsFromS3();
  const localEvents = loadEventsFromLocalFile();

  const eventsMap = new Map<string, EventPayload>();
  for (const ev of [...localEvents, ...s3Events]) {
    if (ev && ev.slug) {
      eventsMap.set(ev.slug.toLowerCase().trim(), ev);
    }
  }

  const allEvents = Array.from(eventsMap.values());
  console.log(`\n📊 Total de eventos únicos a migrar/sincronizar: ${allEvents.length}`);

  let eventosMigrados = 0;
  let rsvpsMigrados = 0;

  for (const ev of allEvents) {
    const cleanSlug = ev.slug.toLowerCase().trim();
    console.log(`\n⏳ Procesando evento: "${ev.titulo}" (${cleanSlug})...`);

    // Validar enums compatibles
    const tipoEventoValido = Object.values(TipoEvento).includes(ev.tipoEvento as any)
      ? (ev.tipoEvento as TipoEvento)
      : TipoEvento.QUINCEANERA;

    const estiloPlantillaValido = Object.values(EstiloPlantilla).includes(ev.estiloPlantilla as any)
      ? (ev.estiloPlantilla as EstiloPlantilla)
      : EstiloPlantilla.QUINCE_ROSADO;

    const parsedFecha = ev.fechaEvento ? new Date(ev.fechaEvento) : new Date();
    const fechaValida = isNaN(parsedFecha.getTime()) ? new Date() : parsedFecha;

    // Upsert Evento en PostgreSQL
    const dbEvento = await prisma.evento.upsert({
      where: { slug: cleanSlug },
      update: {
        titulo: ev.titulo,
        subtitulo: ev.subtitulo ?? null,
        frasePersonalizada: ev.frasePersonalizada ?? null,
        panelToken: cleanSlug === "maydelin-mendez" ? (ev.panelToken || "e6cfa17f6929aef0") : (ev.panelToken ?? null),
        tipoEvento: tipoEventoValido,
        estiloPlantilla: estiloPlantillaValido,
        fechaEvento: fechaValida,
        fechaTextoPersonalizada: ev.fechaTextoPersonalizada ?? null,
        fotoPortadaUrl: ev.fotoPortadaUrl || "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
        fotoInfanciaUrl: ev.fotoInfanciaUrl ?? null,
        fotoActualUrl: ev.fotoActualUrl ?? null,
        fotoCierreUrl: ev.fotoCierreUrl ?? null,
        musicaUrl: ev.musicaUrl ?? null,
        reproducirMusicaAlAbrir: ev.reproducirMusicaAlAbrir ?? true,
        videoUrl: ev.videoUrl ?? null,
        galeriaFotosUrls: ev.galeriaFotosUrls ?? [],
        wishlistUrl: ev.wishlistUrl ?? null,
        idiomaDefault: ev.idiomaDefault || "es",
        celebrationGuideline: ev.celebrationGuideline ?? null,
        telefonoWhatsappRsvp: ev.telefonoWhatsappRsvp || "18181234567",
        emailOrganizador: ev.emailOrganizador ?? null,
        aforoTotal: ev.aforoTotal || 200,
        fechaLimiteRsvp: ev.fechaLimiteRsvp ? new Date(ev.fechaLimiteRsvp) : null,
        maxPasesPorInvitado: ev.maxPasesPorInvitado || 4,
        ceremoniaNombre: ev.ceremoniaNombre ?? null,
        ceremoniaDireccion: ev.ceremoniaDireccion ?? null,
        ceremoniaMapUrl: ev.ceremoniaMapUrl ?? null,
        recepcionNombre: ev.recepcionNombre || "Recepción Principal",
        recepcionDireccion: ev.recepcionDireccion || "",
        recepcionMapUrl: ev.recepcionMapUrl || "",
        dressCodeTitulo: ev.dressCodeTitulo ?? null,
        dressCodeNota: ev.dressCodeNota ?? null,
        coloresReservados: ev.coloresReservados ?? [],
        itinerarioJson: ev.itinerarioJson ?? null,
        corteHonorJson: ev.corteHonorJson ?? null,
        mesaRegalosJson: ev.mesaRegalosJson ?? null,
        hospedajeJson: ev.hospedajeJson ?? null,
        transporteJson: ev.transporteJson ?? null,
        historiaHitosJson: ev.historiaHitosJson ?? null,
        activo: true,
      },
      create: {
        usuarioId: systemUser.id,
        slug: cleanSlug,
        titulo: ev.titulo,
        subtitulo: ev.subtitulo ?? null,
        frasePersonalizada: ev.frasePersonalizada ?? null,
        panelToken: cleanSlug === "maydelin-mendez" ? (ev.panelToken || "e6cfa17f6929aef0") : (ev.panelToken ?? null),
        tipoEvento: tipoEventoValido,
        estiloPlantilla: estiloPlantillaValido,
        fechaEvento: fechaValida,
        fechaTextoPersonalizada: ev.fechaTextoPersonalizada ?? null,
        fotoPortadaUrl: ev.fotoPortadaUrl || "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
        fotoInfanciaUrl: ev.fotoInfanciaUrl ?? null,
        fotoActualUrl: ev.fotoActualUrl ?? null,
        fotoCierreUrl: ev.fotoCierreUrl ?? null,
        musicaUrl: ev.musicaUrl ?? null,
        reproducirMusicaAlAbrir: ev.reproducirMusicaAlAbrir ?? true,
        videoUrl: ev.videoUrl ?? null,
        galeriaFotosUrls: ev.galeriaFotosUrls ?? [],
        wishlistUrl: ev.wishlistUrl ?? null,
        idiomaDefault: ev.idiomaDefault || "es",
        celebrationGuideline: ev.celebrationGuideline ?? null,
        telefonoWhatsappRsvp: ev.telefonoWhatsappRsvp || "18181234567",
        emailOrganizador: ev.emailOrganizador ?? null,
        aforoTotal: ev.aforoTotal || 200,
        fechaLimiteRsvp: ev.fechaLimiteRsvp ? new Date(ev.fechaLimiteRsvp) : null,
        maxPasesPorInvitado: ev.maxPasesPorInvitado || 4,
        ceremoniaNombre: ev.ceremoniaNombre ?? null,
        ceremoniaDireccion: ev.ceremoniaDireccion ?? null,
        ceremoniaMapUrl: ev.ceremoniaMapUrl ?? null,
        recepcionNombre: ev.recepcionNombre || "Recepción Principal",
        recepcionDireccion: ev.recepcionDireccion || "",
        recepcionMapUrl: ev.recepcionMapUrl || "",
        dressCodeTitulo: ev.dressCodeTitulo ?? null,
        dressCodeNota: ev.dressCodeNota ?? null,
        coloresReservados: ev.coloresReservados ?? [],
        itinerarioJson: ev.itinerarioJson ?? null,
        corteHonorJson: ev.corteHonorJson ?? null,
        mesaRegalosJson: ev.mesaRegalosJson ?? null,
        hospedajeJson: ev.hospedajeJson ?? null,
        transporteJson: ev.transporteJson ?? null,
        historiaHitosJson: ev.historiaHitosJson ?? null,
        activo: true,
      },
    });

    eventosMigrados++;
    console.log(`   ✅ Evento guardado en BD con ID: ${dbEvento.id}`);

    // Migrar confirmaciones (RSVPs) asociadas si existen
    if (Array.isArray(ev.rsvps) && ev.rsvps.length > 0) {
      console.log(`   📋 Sincronizando ${ev.rsvps.length} confirmaciones RSVP...`);
      for (const rsvp of ev.rsvps) {
        if (!rsvp.nombreInvitado) continue;
        const normalizedPhone = rsvp.telefono ? String(rsvp.telefono).replace(/[^0-9]/g, "") : null;

        if (normalizedPhone) {
          await prisma.rsvpRegistro.upsert({
            where: {
              eventoId_telefono: {
                eventoId: dbEvento.id,
                telefono: normalizedPhone,
              },
            },
            update: {
              nombreInvitado: rsvp.nombreInvitado,
              asistira: Boolean(rsvp.asistira),
              pases: Number(rsvp.pases) || 1,
              acompanantes: rsvp.acompanantes ?? null,
            },
            create: {
              eventoId: dbEvento.id,
              nombreInvitado: rsvp.nombreInvitado,
              telefono: normalizedPhone,
              asistira: Boolean(rsvp.asistira),
              pases: Number(rsvp.pases) || 1,
              acompanantes: rsvp.acompanantes ?? null,
            },
          });
        } else {
          // Si no tiene teléfono, buscar por nombre o crear
          const existing = await prisma.rsvpRegistro.findFirst({
            where: {
              eventoId: dbEvento.id,
              nombreInvitado: rsvp.nombreInvitado,
            },
          });
          if (existing) {
            await prisma.rsvpRegistro.update({
              where: { id: existing.id },
              data: {
                asistira: Boolean(rsvp.asistira),
                pases: Number(rsvp.pases) || 1,
                acompanantes: rsvp.acompanantes ?? null,
              },
            });
          } else {
            await prisma.rsvpRegistro.create({
              data: {
                eventoId: dbEvento.id,
                nombreInvitado: rsvp.nombreInvitado,
                telefono: null,
                asistira: Boolean(rsvp.asistira),
                pases: Number(rsvp.pases) || 1,
                acompanantes: rsvp.acompanantes ?? null,
              },
            });
          }
        }
        rsvpsMigrados++;
      }
    }
  }

  console.log("\n==========================================================");
  console.log("🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE");
  console.log(`   - Eventos sincronizados en PostgreSQL: ${eventosMigrados}`);
  console.log(`   - RSVPs confirmados registrados: ${rsvpsMigrados}`);
  console.log("==========================================================");

  await prisma.$disconnect();
}

migrate().catch(async (e) => {
  console.error("❌ Error inesperado durante la migración:", e);
  await prisma.$disconnect();
  process.exit(1);
});
