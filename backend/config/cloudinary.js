import { v2 as cloudinary } from "cloudinary";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

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

async function saveDataUrlLocally(dataUrl, folder) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid local image payload");

  const mime = match[1];
  const base64 = match[2];
  const ext = mime.split("/")[1]?.split("+")[0] || "png";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const safeFolder = sanitizeFolder(folder);
  const relativeDir = safeFolder || "portfolio";
  const targetDir = path.join(uploadsDir, relativeDir);
  await mkdir(targetDir, { recursive: true });

  const relativePath = path.join(relativeDir, fileName);
  const fullPath = path.join(uploadsDir, relativePath);
  await writeFile(fullPath, Buffer.from(base64, "base64"));
  return toPublicUploadsUrl(relativePath);
}

export async function uploadToCloudinary(file, folder = "portfolio") {
  if (!file) return null;

  // Accept either an already-hosted URL or a data URI/base64 payload.
  if (typeof file !== "string") {
    throw new Error("Invalid image payload");
  }

  const isRemoteUrl = /^https?:\/\//i.test(file);
  if (isRemoteUrl) {
    return file;
  }

  const storageProvider = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
  if (storageProvider === "local") {
    return saveDataUrlLocally(file, folder);
  }

  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
  });

  return result.secure_url;
}

