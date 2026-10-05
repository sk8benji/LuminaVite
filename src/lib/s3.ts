import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "luminavite-storage";

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  fileUrl: string;
}

/**
 * Genera una URL prefirmada para subida directa cliente -> S3.
 * Evita la saturación del servidor de Railway.
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder: "images" | "audio" = "images"
): Promise<PresignedUrlResponse> {
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const fileKey = `${folder}/${uniquePrefix}-${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  });

  // Expira en 5 minutos (300 segundos)
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  // Si se usa un dominio personalizado o CDN (CloudFront / S3 URL directa)
  const cdnBase = process.env.AWS_CLOUDFRONT_URL || `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`;
  const fileUrl = `${cdnBase}/${fileKey}`;

  return {
    uploadUrl,
    fileKey,
    fileUrl,
  };
}

export default s3Client;
