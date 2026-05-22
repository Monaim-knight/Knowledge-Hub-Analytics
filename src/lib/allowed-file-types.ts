/**
 * Upload policy: allow common document/media types; block obvious executables.
 */

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
  ".app",
  ".deb",
  ".rpm",
]);

const BLOCKED_MIME_TYPES = new Set([
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/vnd.microsoft.portable-executable",
  "application/x-executable",
  "application/x-sharedlib",
]);

/** Infer MIME from extension when the browser reports octet-stream or empty. */
const MIME_BY_EXTENSION: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".zip": "application/zip",
  ".rar": "application/vnd.rar",
  ".7z": "application/x-7z-compressed",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".ico": "image/x-icon",
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

export function extensionFromFileName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return "";
  return fileName.slice(dot).toLowerCase();
}

export function inferMimeType(fileName: string, reportedMime?: string): string {
  const mime = (reportedMime || "").trim().toLowerCase();
  if (mime && mime !== "application/octet-stream") return mime;

  const ext = extensionFromFileName(fileName);
  return MIME_BY_EXTENSION[ext] || mime || "application/octet-stream";
}

export function isBlockedFile(fileName: string, mimeType: string): boolean {
  const ext = extensionFromFileName(fileName);
  if (ext && BLOCKED_EXTENSIONS.has(ext)) return true;
  if (BLOCKED_MIME_TYPES.has(mimeType.toLowerCase())) return true;
  return false;
}

export function isAllowedUpload(fileName: string, reportedMime?: string): boolean {
  const mimeType = inferMimeType(fileName, reportedMime);
  if (isBlockedFile(fileName, mimeType)) return false;
  // Permissive: any non-blocked file with a name or known MIME
  if (!fileName.trim()) return false;
  return true;
}

export const UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

export function getUploadMaxBytes(): number {
  return UPLOAD_MAX_BYTES;
}
