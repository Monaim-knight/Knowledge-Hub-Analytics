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

function sanitizeSegment(value, fallback = "misc") {
  const cleaned = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || fallback;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
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

const anyFileStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    try {
      ensureUploadsDir();
      const parentType = sanitizeSegment(req.params.parentType, "misc");
      const parentId = sanitizeSegment(req.params.parentId, "unassigned");
      const target = path.join(uploadsDir, parentType, parentId);
      ensureDir(target);
      cb(null, target);
    } catch (err) {
      cb(err, uploadsDir);
    }
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeBase = sanitizeBaseName(file.originalname) || "file";
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

const blockedExtensions = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".ps1",
  ".msi",
  ".com",
  ".dll",
  ".scr",
  ".jar",
]);

const blockedMimes = new Set([
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/x-bat",
  "application/x-sh",
  "text/x-shellscript",
  "application/x-dosexec",
]);

function genericFileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  if (blockedExtensions.has(ext) || blockedMimes.has((file.mimetype || "").toLowerCase())) {
    const err = new Error("This file type is not allowed for security reasons");
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
  fileFilter: genericFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1,
  },
}).single("file");

export const uploadAnyFilesForParent = multer({
  storage: anyFileStorage,
  fileFilter: genericFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 20,
  },
}).array("files", 20);

