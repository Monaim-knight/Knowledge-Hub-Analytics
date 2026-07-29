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
    <section className="relative overflow-hidden border-b border-slate-800/50 bg-slate-950">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-10">
          {/* LinkedIn-style corporate headshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="shrink-0"
          >
            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full border-[3px] border-slate-200/90 bg-slate-800 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.65)] sm:h-[136px] sm:w-[136px]">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={`${brand.name}, Senior Data Analyst`}
                  fill
                  className="object-cover object-[center_20%] contrast-[1.03] saturate-[0.96]"
                  sizes="136px"
                  priority
                  quality={92}
                  unoptimized={isLocalBackendUrl(photoUrl)}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-slate-800">
                  <span className="text-2xl font-semibold text-slate-400">
                    {brand.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="min-w-0 flex-1">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Senior Analytics Portfolio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.04 }}
              className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl lg:text-4xl"
            >
              {brand.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-1.5 text-sm font-medium text-slate-300 sm:text-base"
            >
              {brand.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400"
            >
              Helping leadership teams act on trusted metrics — KPI frameworks,
              executive dashboards, and analytics systems built for clarity and
              accountability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="mt-6 flex flex-wrap items-center gap-2.5"
            >
              <Link
                href="/case-studies"
                className="rounded-md bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004182] transition-colors"
              >
                View case studies
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-slate-600 bg-transparent px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 hover:border-slate-500 transition-colors"
              >
                Get in touch
              </Link>
              <a
                href={brand.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 text-sm font-medium text-slate-400 hover:text-[#0A66C2] transition-colors"
              >
                LinkedIn
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="mt-4 text-xs text-slate-500"
            >
              {brand.location}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
