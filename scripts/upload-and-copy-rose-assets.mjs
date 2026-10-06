import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Parse .env manually
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const SOURCE_DIR = 'C:/Users/sk8be/Desktop/Antigravity apps/invitacion/fotos/elegant rose';
const LOCAL_TARGET_DIR = path.resolve(process.cwd(), 'public/assets/template-rose');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'luminavite-storage';

// Ensure local target dir exists
if (!fs.existsSync(LOCAL_TARGET_DIR)) {
  fs.mkdirSync(LOCAL_TARGET_DIR, { recursive: true });
}

async function main() {
  console.log(`🚀 Starting asset processing...`);
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Local Target: ${LOCAL_TARGET_DIR}`);
  console.log(`S3 Bucket: ${BUCKET_NAME} (Folder: templates/elegant-rose/)`);

  const files = fs.readdirSync(SOURCE_DIR);
  console.log(`Found ${files.length} files.`);

  // 1. Copy locally
  for (const file of files) {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(LOCAL_TARGET_DIR, file);
    fs.copyFileSync(src, dest);
  }
  console.log(`✅ Copied all ${files.length} files to public/assets/template-rose/`);

  // 2. Upload to S3
  let uploadedCount = 0;
  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(file).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';
    const s3Key = `templates/elegant-rose/${file}`;

    try {
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: contentType,
      }));
      uploadedCount++;
      console.log(`[${uploadedCount}/${files.length}] Uploaded: ${s3Key}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err.message);
    }
  }

  console.log(`\n🎉 Upload complete! ${uploadedCount}/${files.length} uploaded to S3.`);
}

main().catch(console.error);
