import prisma from "./db";
import { INITIAL_MASTER_TEMPLATES } from "./templates-data";

let tablesInitialized = false;

export async function ensurePostgresTables(): Promise<boolean> {
  if (tablesInitialized) return true;

  try {
    console.log("⚡ [PostgreSQL] Creando tipos y tablas de forma nativa...");

    const sqlStatements = [
      `DO $$ BEGIN
        CREATE TYPE "TipoEvento" AS ENUM ('BODA', 'QUINCEANERA', 'CUMPLEANOS');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        CREATE TYPE "EstiloPlantilla" AS ENUM ('QUINCE_ROSADO', 'PRINCESA_ROSA', 'ELEGANT_ROSE', 'FAIRYTALE_CHATEAU', 'BLUE_BUTTERFLY', 'CORALINE_MYSTICAL', 'CLASICA_IMPERIAL', 'ESMERALDA_ROYAL', 'JARDIN_BOTANICA', 'MINIMALISTA_EDITORIAL', 'BLUSH_PRINCESS', 'QUINCE_ERA_PINK', 'MISS_15', 'BABY_BLUE', 'BEAUTY_QUINCE');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TYPE "EstiloPlantilla" ADD VALUE IF NOT EXISTS 'QUINCE_ROSADO';
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TYPE "EstiloPlantilla" ADD VALUE IF NOT EXISTS 'BLUSH_PRINCESS';
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TYPE "EstiloPlantilla" ADD VALUE IF NOT EXISTS 'QUINCE_ERA_PINK';
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TYPE "EstiloPlantilla" ADD VALUE IF NOT EXISTS 'MISS_15';
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TYPE "EstiloPlantilla" ADD VALUE IF NOT EXISTS 'BABY_BLUE';
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        ALTER TYPE "EstiloPlantilla" ADD VALUE IF NOT EXISTS 'BEAUTY_QUINCE';
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'SALON', 'CLIENTE');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `CREATE TABLE IF NOT EXISTS "Usuario" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT UNIQUE NOT NULL,
          "nombre" TEXT NOT NULL,
          "passwordHash" TEXT NOT NULL,
          "rol" "RolUsuario" NOT NULL DEFAULT 'CLIENTE',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Salon" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "usuarioId" TEXT NOT NULL REFERENCES "Usuario"("id") ON DELETE CASCADE,
          "nombre" TEXT NOT NULL,
          "slug" TEXT UNIQUE NOT NULL,
          "telefono" TEXT,
          "direccion" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Evento" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "usuarioId" TEXT NOT NULL REFERENCES "Usuario"("id") ON DELETE CASCADE,
          "salonId" TEXT REFERENCES "Salon"("id") ON DELETE SET NULL,
          "slug" TEXT UNIQUE NOT NULL,
          "panelToken" TEXT,
          "panelShortCode" TEXT,
          "esDemo" BOOLEAN NOT NULL DEFAULT false,
          "tipoEvento" "TipoEvento" NOT NULL DEFAULT 'QUINCEANERA',
          "estiloPlantilla" "EstiloPlantilla" NOT NULL DEFAULT 'PRINCESA_ROSA',
          "titulo" TEXT NOT NULL,
          "subtitulo" TEXT,
          "frasePersonalizada" TEXT,
          "fechaEvento" TIMESTAMP(3) NOT NULL,
          "fechaTextoPersonalizada" TEXT,
          "fotoPortadaUrl" TEXT NOT NULL,
          "fotoInfanciaUrl" TEXT,
          "fotoActualUrl" TEXT,
          "fotoCierreUrl" TEXT,
          "fotoZapato1Url" TEXT,
          "fotoZapato2Url" TEXT,
          "ogTitulo" TEXT,
          "ogDescripcion" TEXT,
          "ogImagenUrl" TEXT,
          "musicaUrl" TEXT,
          "musicaTitulo" TEXT,
          "reproducirMusicaAlAbrir" BOOLEAN DEFAULT true,
          "videoUrl" TEXT,
          "galeriaFotosUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
          "telefonoWhatsappRsvp" TEXT NOT NULL,
          "emailOrganizador" TEXT,
          "aforoTotal" INTEGER DEFAULT 200,
          "fechaLimiteRsvp" TIMESTAMP(3),
          "maxPasesPorInvitado" INTEGER NOT NULL DEFAULT 4,
          "ceremoniaNombre" TEXT,
          "ceremoniaDireccion" TEXT,
          "ceremoniaMapUrl" TEXT,
          "recepcionNombre" TEXT NOT NULL,
          "recepcionDireccion" TEXT NOT NULL,
          "recepcionMapUrl" TEXT NOT NULL,
          "fechaPlacaMes" TEXT,
          "fechaPlacaHora" TEXT,
          "fechaPlacaLugar" TEXT,
          "countdownEncabezado" TEXT,
          "dressCodeEtiqueta" TEXT,
          "dressCodeColoresReservados" TEXT,
          "regalosMensaje" TEXT,
          "regalosZelle" TEXT,
          "regalosCashApp" TEXT,
          "rsvpFechaLimite" TEXT,
          "rsvpDiasAntes" INTEGER DEFAULT 15,
          "autorBendicion" TEXT,
          "textoDisco" TEXT,
          "mensajeDespedida" TEXT,
          "dressCodeTitulo" TEXT,
          "dressCodeNota" TEXT,
          "coloresReservados" TEXT[] DEFAULT ARRAY[]::TEXT[],
          "celebrationGuideline" TEXT,
          "wishlistUrl" TEXT,
          "idiomaDefault" TEXT NOT NULL DEFAULT 'es',
          "itinerarioJson" JSONB,
          "corteHonorJson" JSONB,
          "mesaRegalosJson" JSONB,
          "hospedajeJson" JSONB,
          "transporteJson" JSONB,
          "historiaHitosJson" JSONB,
          "configPlantilla" JSONB DEFAULT '{}'::jsonb,
          "activo" BOOLEAN NOT NULL DEFAULT true,
          "vistasContador" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "rsvpDiasAntes" INTEGER DEFAULT 15;`,

      `CREATE TABLE IF NOT EXISTS "RsvpRegistro" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "eventoId" TEXT NOT NULL REFERENCES "Evento"("id") ON DELETE CASCADE,
          "nombreInvitado" TEXT NOT NULL,
          "telefono" TEXT,
          "asistira" BOOLEAN NOT NULL,
          "pases" INTEGER NOT NULL DEFAULT 1,
          "acompanantes" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "RsvpRegistro_eventoId_telefono_key" UNIQUE ("eventoId", "telefono")
      );`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "reproducirMusicaAlAbrir" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "fotoZapato1Url" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "configPlantilla" JSONB DEFAULT '{}'::jsonb;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "modalidadRsvp" TEXT DEFAULT 'HIBRIDO';`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "permitirConfirmacionTelefono" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "mostrarMesaRegalos" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "regalosMensajeEn" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "mostrarDressCode" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "dressCodeTituloEn" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "dressCodeNotaEn" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "mostrarFrasePersonalizada" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "frasePersonalizadaEn" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "mostrarFechaPlacaHora" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "fechaPlacaHoraEn" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "bannerContactoActivo" BOOLEAN DEFAULT false;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "bannerContactoTexto" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "bannerContactoTelefono" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "bannerContactoLlamar" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "bannerContactoSms" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "panelShortCode" TEXT;`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Evento_panelShortCode_key" ON "Evento"("panelShortCode");`,
      `ALTER TABLE "RsvpRegistro" ADD COLUMN IF NOT EXISTS "email" TEXT;`,
      `ALTER TABLE "guests" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);`,

      `DO $$ BEGIN
        CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO', 'FALLIDO', 'REEMBOLSADO');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `DO $$ BEGIN
        CREATE TYPE "EstadoPedido" AS ENUM ('NUEVO', 'CONTACTADO', 'RECOPILANDO_DATOS', 'EN_DISENO', 'PUBLICADO', 'CANCELADO');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;`,

      `CREATE TABLE IF NOT EXISTS "OrdenCompra" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "stripeSessionId" TEXT UNIQUE NOT NULL,
          "stripePaymentIntentId" TEXT,
          "montoTotal" DOUBLE PRECISION NOT NULL,
          "moneda" TEXT NOT NULL DEFAULT 'usd',
          "paqueteId" TEXT NOT NULL,
          "paqueteNombre" TEXT NOT NULL,
          "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
          "estadoPedido" "EstadoPedido" NOT NULL DEFAULT 'NUEVO',
          "nombreCliente" TEXT,
          "emailCliente" TEXT NOT NULL,
          "telefonoCliente" TEXT,
          "tipoEvento" "TipoEvento" DEFAULT 'QUINCEANERA',
          "fechaEvento" TIMESTAMP(3),
          "plantillaDeseada" "EstiloPlantilla",
          "comentarios" TEXT,
          "onboardingCompletado" BOOLEAN NOT NULL DEFAULT false,
          "eventoId" TEXT REFERENCES "Evento"("id") ON DELETE SET NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "ShortLink" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "code" TEXT UNIQUE NOT NULL,
          "url" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE INDEX IF NOT EXISTS "ShortLink_code_idx" ON "ShortLink"("code");`,

      `CREATE TABLE IF NOT EXISTS "QrCampaign" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "code" TEXT UNIQUE NOT NULL,
          "targetUrl" TEXT NOT NULL,
          "active" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "QrScan" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "campaignId" TEXT NOT NULL REFERENCES "QrCampaign"("id") ON DELETE CASCADE,
          "visitorHash" TEXT,
          "userAgent" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE INDEX IF NOT EXISTS "QrCampaign_code_idx" ON "QrCampaign"("code");`,
      `CREATE INDEX IF NOT EXISTS "QrScan_campaignId_idx" ON "QrScan"("campaignId");`,
      `CREATE INDEX IF NOT EXISTS "QrScan_createdAt_idx" ON "QrScan"("createdAt");`,

      `CREATE TABLE IF NOT EXISTS "MasterTemplate" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "slug" TEXT NOT NULL UNIQUE,
          "nombre" TEXT NOT NULL,
          "categoria" "TipoEvento" NOT NULL DEFAULT 'QUINCEANERA',
          "estiloPlantilla" "EstiloPlantilla" NOT NULL DEFAULT 'BLUE_BUTTERFLY',
          "titulo" TEXT NOT NULL,
          "subtitulo" TEXT,
          "frasePersonalizada" TEXT,
          "tipoLetra" TEXT DEFAULT 'Cinzel',
          "musicaUrl" TEXT,
          "musicaTitulo" TEXT,
          "fotoPortadaUrl" TEXT NOT NULL,
          "fotoInfanciaUrl" TEXT,
          "fotoActualUrl" TEXT,
          "fotoCierreUrl" TEXT,
          "colorSobre" TEXT DEFAULT '#E8D5C4',
          "colorSello" TEXT DEFAULT '#C5A059',
          "configExtra" JSONB,
          "activo" BOOLEAN NOT NULL DEFAULT true,
          "orden" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE INDEX IF NOT EXISTS "MasterTemplate_slug_idx" ON "MasterTemplate"("slug");`,
      `CREATE INDEX IF NOT EXISTS "MasterTemplate_estiloPlantilla_idx" ON "MasterTemplate"("estiloPlantilla");`,
      // Marca demo: columna en tablas viejas + las 3 invitaciones de muestra del evento (idempotente)
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "esDemo" BOOLEAN NOT NULL DEFAULT false;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "musicaTitulo" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "ogTitulo" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "ogDescripcion" TEXT;`,
      `ALTER TABLE "Evento" ADD COLUMN IF NOT EXISTS "ogImagenUrl" TEXT;`,
      `UPDATE "Evento" SET "esDemo" = true WHERE slug IN ('quinceano-evento', 'quinceano-evento2', 'quinceano-tarjeta');`,
      // Unificación nombres 2026-10-28 (catálogo público) -> tarjetas admin: solo renombra
      // si el nombre sigue siendo el viejo editorial; un rename manual del admin se respeta.
      `UPDATE "MasterTemplate" SET "nombre" = 'Celestial Butterfly' WHERE slug = 'mariposas-xv' AND "nombre" = 'Jardín de Mariposas Celestes (XV Años)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Vintage Quinceanera' WHERE slug = 'isabella-xv' AND "nombre" = 'Blush Rose Filmstrip (XV Años)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Fairytale Castle' WHERE slug = 'emma-and-lucas' AND "nombre" = 'Castillo de Cuento de Hadas (Boda)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Royal Pink' WHERE slug = 'elsy-xv' AND "nombre" = 'Princesa Rosa Gala Real (XV Años)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Sweet Fifteen in Pink' WHERE slug = 'quince-rosado' AND "nombre" = 'Quince Rosado (XV Años)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Our Wedding' WHERE slug = 'sofia-y-alejandro' AND "nombre" = 'Clásica Imperial (Boda)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Blush Princess' WHERE slug = 'blush-princess-xv' AND "nombre" = 'Blush Princess (XV Años)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Quince Pink' WHERE slug = 'era-pink-xv' AND "nombre" = 'Quince Pink (XV Años)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Mis 15 Cream & Gold' WHERE slug = 'miss-15-xv' AND "nombre" = 'Mis 15 Cream & Gold (XV Años)';`,
      `UPDATE "MasterTemplate" SET "nombre" = 'Garden Baby Blue' WHERE slug = 'baby-blue-xv' AND "nombre" = 'Garden Baby Blue (XV Años)';`,
    ];

    for (const sql of sqlStatements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (sqlErr: any) {
        // Ignorar si el tipo o columna ya existe
      }
    }

    // Sembrar plantillas maestras (solo las que falten; nunca sobrescribe ediciones del admin)
    try {
      const prismaAny = prisma as any;
      if (prismaAny.masterTemplate) {
        await prismaAny.masterTemplate.createMany({
          data: INITIAL_MASTER_TEMPLATES.map((t) => ({
            id: t.id,
            slug: t.slug,
            nombre: t.nombre,
            categoria: t.categoria as any,
            estiloPlantilla: t.estiloPlantilla as any,
            titulo: t.titulo,
            subtitulo: t.subtitulo,
            frasePersonalizada: t.frasePersonalizada,
            tipoLetra: t.tipoLetra,
            musicaUrl: t.musicaUrl,
            musicaTitulo: t.musicaTitulo,
            colorSobre: t.colorSobre,
            colorSello: t.colorSello,
            fotoPortadaUrl: t.fotoPortadaUrl,
            fotoInfanciaUrl: t.fotoInfanciaUrl || null,
            fotoActualUrl: t.fotoActualUrl || null,
            fotoCierreUrl: t.fotoCierreUrl || null,
            configExtra: t as any,
            activo: t.activo,
            orden: t.orden,
          })),
          skipDuplicates: true,
        });
      }
    } catch (seedErr: any) {
      console.warn("⚠️ No se pudieron sembrar las plantillas maestras:", seedErr?.message);
    }

    tablesInitialized = true;
    console.log("✅ Tablas de PostgreSQL inicializadas correctamente.");
    return true;
  } catch (err: any) {
    console.warn("⚠️ Error en inicialización directa de tablas:", err?.message);
    return false;
  }
}
