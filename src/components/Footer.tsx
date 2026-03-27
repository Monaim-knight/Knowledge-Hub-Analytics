import Link from "next/link";
import { brand } from "@/lib/portfolio-data";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/70">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-50">{brand.name}</p>
            <p className="mt-1 text-sm text-slate-400">{brand.title}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link className="text-slate-300 hover:text-slate-50" href="/about">
              About
            </Link>
            <Link
              className="text-slate-300 hover:text-slate-50"
              href="/case-studies"
            >
              Case Studies
            </Link>
            <Link
              className="text-slate-300 hover:text-slate-50"
              href="/projects"
            >
              Projects
            </Link>
            <Link
              className="text-slate-300 hover:text-slate-50"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href={brand.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-200"
            >
              LinkedIn
            </Link>
            <Link
              href={brand.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-200"
            >
              GitHub
            </Link>
            <a
              href={`mailto:${brand.email}`}
              className="text-slate-400 hover:text-slate-200"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

