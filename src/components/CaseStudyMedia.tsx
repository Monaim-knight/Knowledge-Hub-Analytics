import Image from "next/image";

function isImageMediaUrl(url: string): boolean {
  if (!url) return false;
  if (/\.(png|jpe?g|gif|webp|svg|bmp|ico)(\?|#|$)/i.test(url)) return true;
  if (url.includes("/image/upload/")) return true;
  return false;
}

function fileLabelFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    const name = path.split("/").pop() || "file";
    return decodeURIComponent(name);
  } catch {
    return "Download file";
  }
}

type Props = {
  url: string;
  alt?: string;
  className?: string;
  unoptimized?: boolean;
};

export function CaseStudyHeroMedia({ url, alt = "", className = "", unoptimized }: Props) {
  if (isImageMediaUrl(url)) {
    return (
      <div
        className={`relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/40 ${className}`}
      >
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1152px) 100vw, 1152px"
          unoptimized={unoptimized}
        />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`mb-10 flex items-center gap-3 rounded-2xl border border-indigo-500/40 bg-indigo-500/10 px-5 py-4 text-sm font-medium text-indigo-200 hover:bg-indigo-500/20 ${className}`}
    >
      <span aria-hidden>📄</span>
      {fileLabelFromUrl(url)}
    </a>
  );
}

export function CaseStudySectionMedia({ url, alt = "", unoptimized }: Props) {
  if (isImageMediaUrl(url)) {
    return (
      <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-slate-800/70">
        <Image
          src={url}
          alt={alt}
          fill
          className="object-contain bg-slate-950/50"
          sizes="(max-width: 768px) 100vw, 768px"
          unoptimized={unoptimized}
        />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm text-indigo-200 hover:bg-slate-900/60"
    >
      <span aria-hidden>📄</span>
      {fileLabelFromUrl(url)}
    </a>
  );
}
