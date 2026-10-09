import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function syncMaydelinKey() {
  console.log("==========================================================");
  console.log("🔑 SINCRONIZANDO CLAVE DE ACCESO: maydelin-mendez");
  console.log("==========================================================");

  const TARGET_SLUG = "maydelin-mendez";
  const TARGET_KEY = "e6cfa17f6929aef0";

  try {
    let systemUser = await prisma.usuario.findFirst({
      where: { rol: "ADMIN" },
    });

    if (!systemUser) {
      systemUser = await prisma.usuario.upsert({
        where: { email: "admin@clickandlove.app" },
        update: {},
        create: {
          email: "admin@clickandlove.app",
          nombre: "Administrador Click & Love",
          passwordHash: "system-migrated-account",
          rol: "ADMIN",
        },
      });
    }

    const updated = await prisma.evento.upsert({
      where: { slug: TARGET_SLUG },
      update: {
        panelToken: TARGET_KEY,
        activo: true,
      },
      create: {
        usuarioId: systemUser.id,
        slug: TARGET_SLUG,
        titulo: "Maydelin Mendez",
        subtitulo: "Mis Quinceaños",
        frasePersonalizada: "Con la bendición de Dios y el amor de mi familia, tengo el honor de invitarte a celebrar este día tan esperado.",
        panelToken: TARGET_KEY,
        tipoEvento: "QUINCEANERA",
        estiloPlantilla: "QUINCE_ROSADO",
        fechaEvento: new Date("2026-12-05T22:38:00.000Z"),
        fechaTextoPersonalizada: "SÁBADO 5 DE DICIEMBRE, 2026",
        fotoPortadaUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
        fotoInfanciaUrl: "/assets/template-rose/722d78548334333072ad7200e4f8233e.jpg",
        fotoActualUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
        fotoCierreUrl: "/assets/template-quince-rosado/90043c428c5ec72c7adb26dce69dedd2.png",
        musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        telefonoWhatsappRsvp: "18181234567",
        fechaLimiteRsvp: new Date("2026-11-15T00:00:00.000Z"),
        maxPasesPorInvitado: 4,
        ceremoniaNombre: "Parroquia San Juan Bautista",
        ceremoniaDireccion: "Av. Las Rosas 450",
        recepcionNombre: "Hacienda Real Gala",
        recepcionDireccion: "Km 12 Carretera Antigua",
        dressCodeTitulo: "Rigurosa Etiqueta & Elegante",
        dressCodeNota: "Agradecemos reservar los tonos rosa para la quinceañera.",
        coloresReservados: ["#F3C5D0", "#7A002A"],
        idiomaDefault: "bilingual",
        aforoTotal: 200,
        activo: true,
      },
      select: { id: true, slug: true, titulo: true, panelToken: true },
    });

    console.log(`✅ Registro asegurado en PostgreSQL para "${updated.slug}":`);
    console.log(`👉 ID: ${updated.id}`);
    console.log(`👉 Título: ${updated.titulo}`);
    console.log(`👉 panelToken = "${updated.panelToken}"`);
  } catch (error: any) {
    console.error("❌ Error al sincronizar la clave en la base de datos:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

syncMaydelinKey();
