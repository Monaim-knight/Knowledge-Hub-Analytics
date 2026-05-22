import { v2 as cloudinary } from "cloudinary";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  extensionFromMime,
  assertAllowedDataUrlMime,
  inferMimeFromFileName,
  isBlockedFileName,
} from "../utils/fileTypes.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadsDir = fileURLToPath(new URL("../uploads", import.meta.url));

function sanitizeFolder(folder = "portfolio") {
  return folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/\/+/g, "/");
}

function toPublicUploadsUrl(relativePath) {
  const base = process.env.BACKEND_PUBLIC_URL || "http://localhost:5000";
  return `${base.replace(/\/+$/, "")}/uploads/${relativePath.replace(/\\/g, "/")}`;
}

function parseDataUrl(dataUrl) {
  const s = String(dataUrl).trim();
  const marker = ";base64,";
  const idx = s.indexOf(marker);
  if (!s.startsWith("data:") || idx === -1) {
    throw new Error(
      "Invalid file payload: expected a base64 data URL (from file upload or paste)"
    );
  }
  const meta = s.slice("data:".length, idx);
  const mime = meta.split(";")[0].trim() || "application/octet-stream";
  const base64 = s.slice(idx + marker.length);
  if (!base64) throw new Error("Invalid file payload: empty base64 data");
  return { mime, base64 };
}

function cloudinaryResourceType(mime) {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "raw";
}

/** Save raw bytes to local uploads (PDF, Word, images, etc.). */
export async function saveBufferLocally(buffer, originalName, mimeType, folder) {
  if (isBlockedFileName(originalName)) {
    throw new Error(`File type not allowed: ${originalName}`);
  }
  const mime = inferMimeFromFileName(originalName, mimeType);
  assertAllowedDataUrlMime(mime);
  const ext = extensionFromMime(mime);
  const safeBase = String(originalName)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80);
  const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeBase}.${ext}`;

  const safeFolder = sanitizeFolder(folder);
  const relativeDir = safeFolder || "portfolio";
  const targetDir = path.join(uploadsDir, relativeDir);
  await mkdir(targetDir, { recursive: true });

  const relativePath = path.join(relativeDir, fileName);
  const fullPath = path.join(uploadsDir, relativePath);
  await writeFile(fullPath, buffer);
  return toPublicUploadsUrl(relativePath);
}

async function saveDataUrlLocally(dataUrl, folder) {
  const { mime, base64 } = parseDataUrl(dataUrl);
  assertAllowedDataUrlMime(mime);
  return saveBufferLocally(
    Buffer.from(base64, "base64"),
    `upload.${extensionFromMime(mime)}`,
    mime,
    folder
  );
}

export async function uploadToCloudinary(file, folder = "portfolio") {
  if (!file) return null;

  if (typeof file !== "string") {
    throw new Error("Invalid file payload");
  }

  const trimmed = file.trim();
  const isRemoteUrl = /^https?:\/\//i.test(trimmed);
  if (isRemoteUrl) {
    return trimmed;
  }

  const storageProvider = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
  if (storageProvider === "local") {
    if (!trimmed.startsWith("data:")) {
      throw new Error(
        "Invalid file payload: use file upload or a data: URL, not a local file path"
      );
    }
    return saveDataUrlLocally(trimmed, folder);
  }

  const isDataUrl = trimmed.startsWith("data:");
  let resource_type = "raw";
  if (isDataUrl) {
    const { mime } = parseDataUrl(trimmed);
    assertAllowedDataUrlMime(mime);
    resource_type = cloudinaryResourceType(mime);
  }

  const result = await cloudinary.uploader.upload(trimmed, {
    folder,
    resource_type,
  });

  return result.secure_url;
}
