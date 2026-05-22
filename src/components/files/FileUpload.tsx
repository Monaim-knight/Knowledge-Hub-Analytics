"use client";

import { useState } from "react";

type FileRecord = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

type Props = {
  fileIds: string[];
  onFileIdsChange: (ids: string[]) => void;
  attachTo?: { postId?: string; discussionId?: string; dashboardId?: string };
  initialFiles?: FileRecord[];
};

export function FileUpload({
  fileIds,
  onFileIdsChange,
  attachTo,
  initialFiles = [],
}: Props) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const allFiles = [...initialFiles.filter((f) => fileIds.includes(f.id)), ...files];
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected?.length) return;

    setError(null);
    setUploading(true);

    let newFileIds = [...fileIds];
    const newFiles: FileRecord[] = [];

    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      const formData = new FormData();
      formData.append("file", file);
      if (attachTo?.postId) formData.append("postId", attachTo.postId);
      if (attachTo?.discussionId) formData.append("discussionId", attachTo.discussionId);
      if (attachTo?.dashboardId) formData.append("dashboardId", attachTo.dashboardId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Upload failed");
        setUploading(false);
        return;
      }

      const data = await res.json();
      newFiles.push({
        id: data.id,
        fileName: data.fileName,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
      });
      newFileIds = [...newFileIds, data.id];
    }

    setFiles((prev) => [...prev, ...newFiles]);
    onFileIdsChange(newFileIds);
    setUploading(false);
    e.target.value = "";
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    onFileIdsChange(fileIds.filter((fid) => fid !== id));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">Attachments</label>
      <input
        type="file"
        multiple
        accept="*/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-slate-700 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-600"
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      {uploading && <p className="mt-1 text-sm text-slate-500">Uploading...</p>}
      {allFiles.length > 0 && (
        <ul className="mt-2 space-y-1">
          {allFiles.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between text-sm text-slate-400"
            >
              <span>
                {f.fileName} ({(f.sizeBytes / 1024).toFixed(1)} KB)
              </span>
              <button
                type="button"
                onClick={() => removeFile(f.id)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
