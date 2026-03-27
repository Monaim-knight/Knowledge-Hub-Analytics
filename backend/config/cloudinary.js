import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file, folder = "portfolio") {
  if (!file) return null;

  // Accept either an already-hosted URL or a data URI/base64 payload.
  if (typeof file !== "string") {
    throw new Error("Invalid image payload");
  }

  const isRemoteUrl = /^https?:\/\//i.test(file);
  if (isRemoteUrl && file.includes("res.cloudinary.com")) {
    return file;
  }

  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
  });

  return result.secure_url;
}

