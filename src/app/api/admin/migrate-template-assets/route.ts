import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client, { BUCKET_NAME } from "@/lib/s3";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

/**
 * Migración única de assets de plantillas a AWS S3 (solo admin).
 *
 * El arte fijo de las plantillas vivía en public/assets (servido por Railway,
 * 226 MB sin optimizar). Este endpoint hace que el PROPIO servidor (que ya
 * tiene las credenciales AWS en sus variables, las mismas con las que sube
 * las fotos de los clientes) copie cada archivo a su carpeta en el bucket:
 *   templates/blue-butterfly/  templates/elegant-rose/
 *   templates/quince-rosado/   templates/sobre-rosa/
 * con Cache-Control inmutable de 1 año. Ninguna credencial sale del servidor.
 *
 * GET  -> inventario (dry-run): qué se subiría y cuánto pesa.
 * POST -> ejecuta la subida (idempotente: sobrescribe con el mismo contenido).
 */

const MAPPINGS: { localDir: string; s3Folder: string }[] = [
  { localDir: "template-butterfly", s3Folder: "blue-butterfly" },
  { localDir: "template-rose", s3Folder: "elegant-rose" },
  { localDir: "template-quince-rosado", s3Folder: "quince-rosado" },
  { localDir: "sobre-rosa", s3Folder: "sobre-rosa" },
];

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".mp3": "audio/mpeg",
};

async function resolveAssetsRoot(): Promise<string | null> {
  const candidates = [
    path.join(process.cwd(), "public", "assets"),
    path.join(process.cwd(), ".next", "standalone", "public", "assets"),
  ];
  for (const c of candidates) {
    try {
      const st = await fs.stat(c);
      if (st.isDirectory()) return c;
    } catch {
      /* siguiente candidato */
    }
  }
  return null;
}

async function walk(dir: string, base: string, out: string[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, base, out);
    else if (e.isFile()) out.push(path.relative(base, full));
  }
}

async function inventory() {
  const root = await resolveAssetsRoot();
  if (!root) return { error: "No se encontró public/assets en el servidor." };
  const plan: { s3Folder: string; files: { rel: string; bytes: number }[] }[] = [];
  let totalFiles = 0;
  let totalBytes = 0;
  for (const m of MAPPINGS) {
    const dir = path.join(root, m.localDir);
    const rels: string[] = [];
    try {
      await walk(dir, dir, rels);
    } catch {
      continue;
    }
    const files = [];
    for (const rel of rels) {
      const st = await fs.stat(path.join(dir, rel));
      files.push({ rel, bytes: st.size });
      totalFiles += 1;
      totalBytes += st.size;
    }
    plan.push({ s3Folder: m.s3Folder, files });
  }
  return { root, plan, totalFiles, totalBytes };
}

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  const inv = await inventory();
  if ("error" in inv) {
    return NextResponse.json({ error: inv.error }, { status: 500 });
  }
  return NextResponse.json({
    bucket: BUCKET_NAME,
    totalFiles: inv.totalFiles,
    totalMB: Math.round((inv.totalBytes / 1048576) * 10) / 10,
    folders: inv.plan.map((p) => ({
      s3: `templates/${p.s3Folder}/`,
      files: p.files.length,
    })),
  });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  const inv = await inventory();
  if ("error" in inv || !inv.plan || !inv.root) {
    return NextResponse.json(
      { error: "No se encontró public/assets en el servidor." },
      { status: 500 }
    );
  }

  const results: {
    s3Folder: string;
    uploaded: number;
    failed: { rel: string; error: string }[];
  }[] = [];

  for (const p of inv.plan) {
    const localDir = MAPPINGS.find((m) => m.s3Folder === p.s3Folder)!.localDir;
    const dir = path.join(inv.root, localDir);
    let uploaded = 0;
    const failed: { rel: string; error: string }[] = [];
    // Subida en lotes de 8 en paralelo
    for (let i = 0; i < p.files.length; i += 8) {
      const batch = p.files.slice(i, i + 8);
      await Promise.all(
        batch.map(async (f) => {
          const key = `templates/${p.s3Folder}/${f.rel.split(path.sep).join("/")}`;
          const ext = path.extname(f.rel).toLowerCase();
          try {
            const body = await fs.readFile(path.join(dir, f.rel));
            await s3Client.send(
              new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                Body: body,
                ContentType: CONTENT_TYPES[ext] || "application/octet-stream",
                CacheControl: "public, max-age=31536000, immutable",
              })
            );
            uploaded += 1;
          } catch (err) {
            failed.push({
              rel: f.rel,
              error: err instanceof Error ? err.message : String(err),
            });
          }
        })
      );
    }
    results.push({ s3Folder: p.s3Folder, uploaded, failed });
  }

  const totalUploaded = results.reduce((a, r) => a + r.uploaded, 0);
  const totalFailed = results.reduce((a, r) => a + r.failed.length, 0);
  return NextResponse.json({
    bucket: BUCKET_NAME,
    totalUploaded,
    totalFailed,
    results,
  });
}
