import { S3Client, PutObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno de .env
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

const region = process.env.AWS_REGION || "us-east-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const bucketName = process.env.AWS_S3_BUCKET_NAME || "luminavite-storage";
const cloudfrontUrl = process.env.AWS_CLOUDFRONT_URL || "";

console.log("==========================================");
console.log("       VERIFICADOR Y UPLOADER DE S3       ");
console.log("==========================================");
console.log(`• Región:        ${region}`);
console.log(`• Bucket:        ${bucketName}`);
console.log(`• Access Key ID: ${accessKeyId ? accessKeyId.substring(0, 5) + "..." : "(VACÍO)"}`);
console.log(`• Secret Key:    ${secretAccessKey ? "********" : "(VACÍO)"}`);
console.log(`• CloudFront:    ${cloudfrontUrl || "(No configurado)"}`);
console.log("------------------------------------------");

if (!accessKeyId || accessKeyId === "demo_key" || accessKeyId === "TU_AWS_ACCESS_KEY_ID") {
  console.error("❌ ERROR: Las credenciales en .env son credenciales de prueba ('demo_key').");
  console.error("Por favor, ingresa tus credenciales reales de AWS en el archivo .env:");
  console.error("  AWS_ACCESS_KEY_ID=AKIA...");
  console.error("  AWS_SECRET_ACCESS_KEY=...");
  console.error("  AWS_S3_BUCKET_NAME=tu-bucket");
  console.error("  AWS_REGION=us-east-1");
  process.exit(1);
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function run() {
  try {
    console.log("🔍 1. Probando conexión con AWS...");
    await s3.send(new ListBucketsCommand({}));
    console.log("✅ Conexión con AWS S3 establecida con éxito!\n");

    const assetsDir = path.resolve(__dirname, "../public/assets/template-butterfly");
    if (!fs.existsSync(assetsDir)) {
      console.error(`❌ Directorio de assets no encontrado: ${assetsDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(assetsDir);
    console.log(`📦 2. Subiendo ${files.length} archivos a 'templates/blue-butterfly/' en S3...`);

    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp3": "audio/mpeg",
    };

    let uploaded = 0;
    for (const file of files) {
      const filePath = path.join(assetsDir, file);
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;

      const ext = path.extname(file).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";
      const s3Key = `templates/blue-butterfly/${file}`;
      const fileBuffer = fs.readFileSync(filePath);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: contentType,
        })
      );

      uploaded++;
      process.stdout.write(`\r   [${uploaded}/${files.length}] Subido: ${file}`);
    }

    console.log("\n\n🎉 ¡Todos los assets fueron subidos exitosamente a S3!");
    const baseUrl = cloudfrontUrl || `https://${bucketName}.s3.${region}.amazonaws.com`;
    console.log(`URL base de los assets: ${baseUrl}/templates/blue-butterfly/`);
  } catch (err) {
    console.error("\n❌ Falló la conexión con S3:", err.name, err.message);
    process.exit(1);
  }
}

run();
