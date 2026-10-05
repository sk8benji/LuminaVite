import { execSync } from "child_process";

const dbUrl = process.env.DATABASE_URL || "";

// Solo ejecutar prisma db push si estamos en Railway o producción (no localhost)
if (dbUrl && !dbUrl.includes("localhost") && !dbUrl.includes("127.0.0.1")) {
  try {
    console.log("⚡ [Railway/Production] Sincronizando esquema de base de datos PostgreSQL...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("✅ Esquema de base de datos sincronizado con éxito.");
  } catch (err) {
    console.warn("⚠️ Aviso al sincronizar base de datos:", err.message);
  }
} else {
  console.log("ℹ️ [Local/Development] Omitiendo db push en build local.");
}
