"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/lib/portfolio-data";

export function CaseStudyCard({
  item,
  index,
}: {
  item: Pick<CaseStudy, "slug" | "title" | "summary">;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/case-studies/${item.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-slate-900/45 hover:shadow-lg hover:shadow-indigo-500/10"
      >
        <div className="flex-1">
          <h3 className="text-base font-semibold tracking-tight text-slate-50 group-hover:text-indigo-200 transition-colors">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
            {item.summary}
          </p>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-200">
          <span className="underline decoration-indigo-400/50 underline-offset-4 group-hover:decoration-indigo-300 transition-colors">
            Read Case Study
          </span>
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

