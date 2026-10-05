import prisma from "./db";

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
        CREATE TYPE "EstiloPlantilla" AS ENUM ('PRINCESA_ROSA', 'ELEGANT_ROSE', 'FAIRYTALE_CHATEAU', 'BLUE_BUTTERFLY', 'CORALINE_MYSTICAL', 'CLASICA_IMPERIAL', 'ESMERALDA_ROYAL', 'JARDIN_BOTANICA', 'MINIMALISTA_EDITORIAL');
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
          "musicaUrl" TEXT,
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
      );`
    ];

    for (const sql of sqlStatements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (sqlErr: any) {
        // Ignorar si el tipo o columna ya existe
      }
    }

    tablesInitialized = true;
    console.log("✅ Tablas de PostgreSQL inicializadas correctamente.");
    return true;
  } catch (err: any) {
    console.warn("⚠️ Error en inicialización directa de tablas:", err?.message);
    return false;
  }
}
