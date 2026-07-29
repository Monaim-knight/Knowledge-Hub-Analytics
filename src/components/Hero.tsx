"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { brand } from "@/lib/portfolio-data";

type Props = {
  profilePhotoUrl?: string;
};

function isLocalBackendUrl(url: string): boolean {
  return (
    url.startsWith("http://localhost") ||
    url.startsWith("http://127.0.0.1") ||
    url.startsWith("/uploads/") ||
    url.startsWith("/")
  );
}

export function Hero({ profilePhotoUrl = "" }: Props) {
  const photoUrl = profilePhotoUrl.trim();

  return (
    <section className="relative overflow-hidden border-b border-slate-800/60">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(51,65,85,0.35),transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="order-2 lg:order-1 lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
            >
              Senior Data Analyst · Analytics Strategy
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              {brand.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="mt-3 text-base font-medium text-slate-200 sm:text-lg"
            >
              {brand.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-[0.95rem]"
            >
              {brand.summary} Focused on KPI design, decision-ready dashboards,
              and analytics systems that leadership can trust.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/case-studies"
                className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white transition-colors"
              >
                View case studies
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900/50 transition-colors"
              >
                Discuss a project
              </Link>
              <a
                href="/resume.txt"
                download
                className="text-sm font-medium text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
              >
                Download résumé
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-6 text-xs tracking-wide text-slate-500"
            >
              {brand.location}
            </motion.p>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
              className="mx-auto flex w-full max-w-[11.5rem] flex-col items-center sm:max-w-[13rem] lg:ml-auto lg:mr-0"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/5">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={`${brand.name} — senior data analyst`}
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="(max-width: 640px) 184px, 208px"
                    priority
                    unoptimized={isLocalBackendUrl(photoUrl)}
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-slate-900">
                    <div className="text-center px-4">
                      <div className="mx-auto h-12 w-12 rounded-full border border-slate-700 bg-slate-950/50" />
                      <p className="mt-3 text-[11px] text-slate-500">
                        Studio → Home
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Portfolio
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
