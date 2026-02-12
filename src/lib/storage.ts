/**
 * Storage abstraction for file uploads.
 * Currently uses local filesystem; can be swapped for S3/minio later.
 */
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/csv",
  "application/json",
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function getUploadDir(): string {
  return UPLOAD_DIR;
}

export function getAllowedTypes(): string[] {
  return ALLOWED_TYPES;
}

export function getMaxSize(): number {
  return MAX_SIZE_BYTES;
}

export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_TYPES.includes(mimeType);
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
}

export async function storeFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  id: string
): Promise<string> {
  const ext = path.extname(originalName) || "";
  const safeName = sanitizeFileName(path.basename(originalName, ext)) + ext;
  const now = new Date();
  const subdir = path.join(
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0")
  );
  const dir = path.join(UPLOAD_DIR, subdir);
  const filePath = path.join(dir, `${id}-${safeName}`);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  return path.relative(UPLOAD_DIR, filePath).replace(/\\/g, "/");
}

export async function getFilePath(relativePath: string): Promise<string> {
  // Prevent path traversal (e.g. ../../../etc/passwd)
  const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
    throw new Error("Invalid file path");
  }
  const fullPath = path.resolve(UPLOAD_DIR, normalized);
  const uploadRoot = path.resolve(UPLOAD_DIR);
  if (!fullPath.startsWith(uploadRoot)) {
    throw new Error("Invalid file path");
  }
  await fs.access(fullPath);
  return fullPath;
}

export async function deleteFile(relativePath: string): Promise<void> {
  const fullPath = await getFilePath(relativePath);
  await fs.unlink(fullPath);
}
