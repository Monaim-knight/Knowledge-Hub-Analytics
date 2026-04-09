import Media from "../models/Media.js";

function getPublicBaseUrl(req) {
  const fromEnv = process.env.BACKEND_PUBLIC_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required (field name: image)",
      });
    }

    const fileUrl = `${getPublicBaseUrl(req)}/uploads/${req.file.filename}`;
    const media = await Media.create({ url: fileUrl });

    return res.status(201).json({
      success: true,
      fileUrl,
      data: media,
    });
  } catch (err) {
    return next(err);
  }
}

