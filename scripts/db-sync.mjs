import { execSync } from "child_process";

const dbUrl = process.env.DATABASE_URL || "";

if (dbUrl) {
  try {
    console.log("⚡ Sincronizando esquema de base de datos PostgreSQL (prisma db push)...");
    execSync("npx --no-install prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("✅ Esquema de base de datos PostgreSQL sincronizado con éxito.");
  } catch (err) {
    console.warn("⚠️ Aviso al sincronizar base de datos con prisma db push (se usará sincronización nativa en tiempo de ejecución):", err.message);
  }
} else {
  console.log("ℹ️ No hay DATABASE_URL configurada en el entorno actual.");
}
