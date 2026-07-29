"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { brand } from "@/lib/portfolio-data";

type Props = {
  profilePhotoUrl?: string;
};

export function Hero(_props: Props) {
  return (
    <section className="border-b border-slate-800/50 bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          Senior Analytics Portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.03 }}
          className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
        >
          {brand.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="mt-1.5 text-sm font-medium text-slate-300"
        >
          {brand.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.09 }}
          className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400"
        >
          Helping leadership teams act on trusted metrics — KPI frameworks,
          executive dashboards, and analytics systems built for clarity and
          accountability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mt-6 flex flex-wrap items-center gap-2.5"
        >
          <Link
            href="/case-studies"
            className="rounded-md bg-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-white transition-colors"
          >
            Case studies
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-slate-600 px-3.5 py-2 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 transition-colors"
          >
            Contact
          </Link>
          <a
            href={brand.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="/resume.txt"
            download
            className="px-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Résumé
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.16 }}
          className="mt-4 text-xs text-slate-500"
        >
          {brand.location}
        </motion.p>
      </div>
    </section>
  );
}
