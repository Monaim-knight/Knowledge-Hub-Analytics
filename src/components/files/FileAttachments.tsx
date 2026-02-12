import Link from "next/link";

type File = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

type Props = {
  files: File[];
};

export function FileAttachments({ files }: Props) {
  if (!files?.length) return null;

  return (
    <div className="mt-8 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
      <h3 className="text-sm font-medium text-slate-400 mb-2">Attachments</h3>
      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f.id}>
            <Link
              href={`/api/files/${f.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-cyan-400 flex items-center gap-2"
            >
              <span className="text-slate-500">↓</span>
              {f.fileName}
              <span className="text-xs text-slate-500">
                ({(f.sizeBytes / 1024).toFixed(1)} KB)
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
