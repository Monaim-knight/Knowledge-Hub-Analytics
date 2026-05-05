"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ParentType = "case-study" | "project" | "blog";

type FileItem = {
  _id: string;
  fileName: string;
  originalName: string;
  fileType?: string;
  fileSize?: number;
  fileUrl: string;
};

function formatBytes(size = 0) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function iconFor(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext || "")) return "PDF";
  if (["doc", "docx"].includes(ext || "")) return "DOC";
  if (["xls", "xlsx", "csv"].includes(ext || "")) return "XLS";
  if (["zip", "rar", "7z"].includes(ext || "")) return "ZIP";
  if (["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext || "")) return "IMG";
  return "FILE";
}

type Props = {
  parentType: ParentType;
  parentId: string;
  authToken: string;
};

export function EntityFileUploader({ parentType, parentId, authToken }: Props) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  const ready = useMemo(() => Boolean(parentId && authToken), [parentId, authToken]);

  const loadFiles = useCallback(async () => {
    if (!ready) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/backend/files/${parentType}/${parentId}`);
      const json = (await res.json()) as { success?: boolean; data?: FileItem[]; message?: string };
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to load attachments");
      setFiles(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attachments");
    } finally {
      setLoading(false);
    }
  }, [parentId, parentType, ready]);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  async function upload(fileList: FileList | File[]) {
    if (!ready) return;
    const picked = Array.from(fileList);
    if (!picked.length) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      picked.forEach((f) => form.append("files", f));
      const res = await fetch(`/api/backend/files/${parentType}/${parentId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: form,
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !json.success) throw new Error(json.message || "Upload failed");
      setMessage(`${picked.length} file(s) uploaded`);
      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function removeFile(id: string) {
    if (!confirm("Delete this attachment?")) return;
    setError("");
    try {
      const res = await fetch(`/api/backend/files/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !json.success) throw new Error(json.message || "Delete failed");
      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (!ready) {
    return (
      <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-4 text-xs text-slate-400">
        Save this item first, then upload attachments.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-4">
      <p className="text-sm font-medium text-slate-100">Attachments</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        className={`mt-3 rounded-lg border border-dashed p-4 text-center ${dragging ? "border-indigo-400 bg-indigo-500/10" : "border-slate-700"}`}
      >
        <p className="text-xs text-slate-300">Drag & drop files here</p>
        <p className="mt-1 text-[11px] text-slate-500">or</p>
        <label className="mt-2 inline-block cursor-pointer rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-400">
          Browse files
          <input type="file" multiple className="hidden" onChange={(e) => e.target.files && void upload(e.target.files)} />
        </label>
      </div>

      {uploading ? <p className="mt-2 text-xs text-slate-400">Uploading...</p> : null}
      {message ? <p className="mt-2 text-xs text-emerald-300">{message}</p> : null}
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-xs text-slate-400">Loading attachments...</p>
        ) : files.length === 0 ? (
          <p className="text-xs text-slate-400">No attachments yet.</p>
        ) : (
          files.map((f) => (
            <div key={f._id} className="flex items-center justify-between rounded-md border border-slate-800/70 bg-slate-900/40 p-2">
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-100">
                  [{iconFor(f.originalName)}] {f.originalName}
                </p>
                <p className="text-[11px] text-slate-400">{formatBytes(f.fileSize)}</p>
              </div>
              <div className="ml-2 flex gap-2">
                <a href={f.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-200 hover:text-indigo-100">
                  Open
                </a>
                <a href={f.fileUrl} download className="text-xs text-indigo-200 hover:text-indigo-100">
                  Download
                </a>
                <button type="button" onClick={() => void removeFile(f._id)} className="text-xs text-red-300 hover:text-red-200">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

