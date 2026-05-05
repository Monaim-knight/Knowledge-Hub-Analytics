import type { PublicAttachment } from "@/lib/files-api";

function formatBytes(size = 0) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function fileBadge(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext || "")) return "PDF";
  if (["doc", "docx"].includes(ext || "")) return "DOC";
  if (["xls", "xlsx", "csv"].includes(ext || "")) return "XLS";
  if (["zip", "rar", "7z"].includes(ext || "")) return "ZIP";
  if (["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext || "")) return "IMG";
  return "FILE";
}

export function AttachmentList({ files }: { files: PublicAttachment[] }) {
  if (!files.length) return null;

  return (
    <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
      <h3 className="text-sm font-semibold text-slate-50">Attachments</h3>
      <div className="mt-4 space-y-2">
        {files.map((f) => (
          <div
            key={f._id}
            className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-950/30 p-3"
          >
            <div>
              <p className="text-sm text-slate-100">
                [{fileBadge(f.originalName)}] {f.originalName}
              </p>
              <p className="text-xs text-slate-400">{formatBytes(f.fileSize)}</p>
            </div>
            <div className="flex gap-3 text-xs">
              <a href={f.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-200 hover:text-indigo-100">
                Open
              </a>
              <a href={f.fileUrl} download className="text-indigo-200 hover:text-indigo-100">
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

