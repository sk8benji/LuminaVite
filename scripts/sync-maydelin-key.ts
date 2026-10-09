import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function syncMaydelinKey() {
  console.log("==========================================================");
  console.log("🔑 SINCRONIZANDO CLAVE DE ACCESO: maydelin-mendez");
  console.log("==========================================================");

  const TARGET_SLUG = "maydelin-mendez";
  const TARGET_KEY = "e6cfa17f6929aef0";

  try {
    const evento = await prisma.evento.findUnique({
      where: { slug: TARGET_SLUG },
      select: { id: true, slug: true, titulo: true, panelToken: true },
    });

    if (!evento) {
      console.log(`ℹ️ El evento "${TARGET_SLUG}" no existe aún en la base de datos local/remota.`);
      console.log(`Ejecuta: npm run migrate:s3 para crearlo automáticamente con la clave asignada.`);
      return;
    }

    console.log(`📋 Evento encontrado: "${evento.titulo}" (ID: ${evento.id})`);
    console.log(`Clave previa en BD: "${evento.panelToken || "(vacío)"}"`);

    const updated = await prisma.evento.update({
      where: { slug: TARGET_SLUG },
      data: {
        panelToken: TARGET_KEY,
      },
      select: { slug: true, panelToken: true },
    });

    console.log(`✅ Clave actualizada con éxito para "${updated.slug}":`);
    console.log(`👉 panelToken = "${updated.panelToken}"`);
  } catch (error: any) {
    console.error("❌ Error al sincronizar la clave en la base de datos:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

syncMaydelinKey();
