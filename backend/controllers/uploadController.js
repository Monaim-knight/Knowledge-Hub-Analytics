import Media from "../models/Media.js";

function getPublicBaseUrl(req) {
  const fromEnv = process.env.BACKEND_PUBLIC_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

async function persistUpload(req, kind) {
  const fileUrl = `${getPublicBaseUrl(req)}/uploads/${req.file.filename}`;
  const media = await Media.create({
    url: fileUrl,
    fileName: req.file.filename,
    originalName: req.file.originalname || "",
    mimeType: req.file.mimetype || "",
    size: req.file.size || 0,
    kind,
  });
  return { fileUrl, media };
}

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required (field name: image)",
      });
    }

    const { fileUrl, media } = await persistUpload(req, "image");

    return res.status(201).json({
      success: true,
      fileUrl,
      data: media,
    });
  } catch (err) {
    return next(err);
  }
}

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required (field name: file)",
      });
    }
    const { fileUrl, media } = await persistUpload(req, "file");
    return res.status(201).json({
      success: true,
      fileUrl,
      data: media,
    });
  } catch (err) {
    return next(err);
  }
}

export async function listMedia(req, res, next) {
  try {
    const items = await Media.find().sort({ createdAt: -1 }).limit(200);
    return res.json({ success: true, data: items });
  } catch (err) {
    return next(err);
  }
}

