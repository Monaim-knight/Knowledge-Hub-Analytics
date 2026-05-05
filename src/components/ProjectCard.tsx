"use client";

import Link from "next/link";
import { motion } from "framer-motion";
export type ProjectCardItem = {
  slug?: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
};

export function ProjectCard({
  item,
  index,
}: {
  item: ProjectCardItem;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="h-full"
    >
      <div className="flex h-full flex-col rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-slate-900/45 hover:shadow-lg hover:shadow-indigo-500/10">
        <div className="flex-1">
          <h3 className="text-base font-semibold tracking-tight text-slate-50">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-800/70 bg-slate-950/20 px-2.5 py-1 text-xs text-slate-200/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {(item.slug || item.githubUrl || item.liveDemoUrl) ? (
          <div className="mt-5 flex flex-wrap gap-4">
            {item.slug ? (
              <Link
                href={`/projects/${item.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100 transition-colors"
              >
                Details <span aria-hidden>→</span>
              </Link>
            ) : null}
            {item.githubUrl ? (
              <Link
                href={item.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100 transition-colors"
              >
                GitHub <span aria-hidden>↗</span>
              </Link>
            ) : null}
            {item.liveDemoUrl ? (
              <Link
                href={item.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100 transition-colors"
              >
                Live demo <span aria-hidden>↗</span>
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

