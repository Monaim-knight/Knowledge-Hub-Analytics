/**
 * Upload a file to the Express API via multipart (PDF, images, Office, etc.).
 */
export async function uploadBackendMediaFile(
  file: File,
  authToken: string,
  _folder = "portfolio/uploads"
): Promise<string> {
  const token = authToken.trim();
  if (!token) throw new Error("Not signed in — log in to the backend first.");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/backend/upload/file", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as {
    fileUrl?: string;
    message?: string;
  };

  if (!res.ok) {
    throw new Error(data.message || `Upload failed (${res.status})`);
  }

  const url = data.fileUrl?.trim();
  if (!url) throw new Error("Upload succeeded but no file URL was returned");
  return url;
}
