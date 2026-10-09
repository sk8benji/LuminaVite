import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT;

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: endpoint || undefined,
  forcePathStyle: Boolean(endpoint || process.env.AWS_FORCE_PATH_STYLE === "true"),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const BUCKET_NAME =
  process.env.AWS_S3_BUCKET_NAME || process.env.BUCKET_NAME || "luminavite-storage";

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  fileUrl: string;
}

/**
 * Genera una URL prefirmada para subida directa cliente -> S3 / Storage.
 * Soporta AWS S3, Cloudflare R2 y Storage de Railway (MinIO/Tigris).
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder: string = "images"
): Promise<PresignedUrlResponse> {
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const fileKey = `${cleanFolder}/${uniquePrefix}-${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  });

  // Expira en 5 minutos (300 segundos)
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  // Si se usa un dominio personalizado o CDN (CloudFront / endpoint personalizado / S3 directo)
  let fileUrl: string;
  if (process.env.AWS_CLOUDFRONT_URL) {
    fileUrl = `${process.env.AWS_CLOUDFRONT_URL}/${fileKey}`;
  } else if (endpoint) {
    fileUrl = `${endpoint}/${BUCKET_NAME}/${fileKey}`;
  } else {
    fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${fileKey}`;
  }

  return {
    uploadUrl,
    fileKey,
    fileUrl,
  };
}

/**
 * Recupera un evento respaldado en S3.
 */
export async function getEventFromS3(slug: string): Promise<any | null> {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return null;
  }
  try {
    const cleanSlug = slug.toLowerCase().trim();
    const fileKey = `events-db/${cleanSlug}.json`;
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    const res = await s3Client.send(command);
    if (!res.Body) return null;
    const bodyStr = await res.Body.transformToString();
    return JSON.parse(bodyStr);
  } catch (err: any) {
    return null;
  }
}

/**
 * Lista todos los eventos respaldados en la carpeta events-db de S3.
 */
export async function listEventsFromS3(): Promise<any[]> {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return [];
  }
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "events-db/",
    });
    const response = await s3Client.send(command);
    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }

    const events: any[] = [];
    for (const item of response.Contents) {
      if (item.Key && item.Key.endsWith(".json")) {
        try {
          const getCmd = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: item.Key,
          });
          const res = await s3Client.send(getCmd);
          if (res.Body) {
            const bodyStr = await res.Body.transformToString();
            events.push(JSON.parse(bodyStr));
          }
        } catch (e) {
          // ignorar archivo individual no parseable
        }
      }
    }
    return events;
  } catch (err: any) {
    console.warn("⚠️ [S3] Error al listar eventos de S3:", err?.message);
    return [];
  }
}

export default s3Client;
