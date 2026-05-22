const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".scr",
  ".dll",
  ".vbs",
  ".ps1",
  ".jar",
]);

const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/x-icon": "ico",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "text/plain": "txt",
  "text/markdown": "md",
  "text/html": "html",
  "text/csv": "csv",
  "text/css": "css",
  "text/javascript": "js",
  "text/x-python": "py",
  "text/typescript": "ts",
  "application/json": "json",
  "application/xml": "xml",
  "application/zip": "zip",
  "application/x-7z-compressed": "7z",
  "application/vnd.rar": "rar",
  "application/rtf": "rtf",
  "application/x-tex": "tex",
  "application/x-ipynb+json": "ipynb",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
};

const EXT_TO_MIME = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".zip": "application/zip",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".markdown": "text/markdown",
  ".rmd": "text/plain",
  ".qmd": "text/plain",
  ".csv": "text/csv",
  ".json": "application/json",
  ".html": "text/html",
  ".htm": "text/html",
  ".xml": "application/xml",
  ".tex": "application/x-tex",
  ".rtf": "application/rtf",
  ".ipynb": "application/x-ipynb+json",
  ".r": "text/plain",
  ".py": "text/x-python",
  ".js": "text/javascript",
  ".ts": "text/typescript",
  ".css": "text/css",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

export function extensionFromMime(mime) {
  if (MIME_TO_EXT[mime]) return MIME_TO_EXT[mime];
  const sub = mime.split("/")[1];
  if (!sub) return "bin";
  const base = sub.split("+")[0];
  return base.replace(/[^a-zA-Z0-9]/g, "") || "bin";
}

export function extensionFromFileName(fileName) {
  const dot = String(fileName).lastIndexOf(".");
  if (dot === -1) return "";
  return String(fileName).slice(dot).toLowerCase();
}

export function inferMimeFromFileName(fileName, reportedMime = "") {
  const mime = String(reportedMime || "").trim().toLowerCase();
  if (mime && mime !== "application/octet-stream") return mime;
  const ext = extensionFromFileName(fileName);
  return EXT_TO_MIME[ext] || mime || "application/octet-stream";
}

export function isBlockedFileName(fileName) {
  const ext = extensionFromFileName(fileName);
  return Boolean(ext && BLOCKED_EXTENSIONS.has(ext));
}

export function assertAllowedDataUrlMime(mime) {
  if (!mime || mime === "application/octet-stream") return;
  const sub = mime.split("/")[1] || "";
  if (sub.includes("executable") || mime.includes("msdownload")) {
    throw new Error(`File type not allowed: ${mime}`);
  }
}

export { MIME_TO_EXT, EXT_TO_MIME, BLOCKED_EXTENSIONS };
