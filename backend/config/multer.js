import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadsDir = path.resolve("uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

function sanitizeBaseName(filename) {
  const parsed = path.parse(filename);
  return parsed.name.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      ensureUploadsDir();
      cb(null, uploadsDir);
    } catch (err) {
      cb(err, uploadsDir);
    }
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeBase = sanitizeBaseName(file.originalname) || "image";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}-${safeBase}${ext}`);
  },
});

const allowedMimes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function imageFileFilter(_req, file, cb) {
  if (!allowedMimes.has(file.mimetype)) {
    const err = new Error("Only jpg, jpeg, png, and webp files are allowed");
    err.statusCode = 400;
    return cb(err);
  }
  cb(null, true);
}

export const uploadSingleImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
}).single("image");

export const uploadSingleFile = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1,
  },
}).single("file");

