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
    url.startsWith("/uploads/")
  );
}

export function Hero({ profilePhotoUrl = "" }: Props) {
  const photoUrl = profilePhotoUrl.trim();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-[380px] w-[380px] rounded-full bg-slate-600/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="text-sm font-medium tracking-wide text-indigo-200/90"
            >
              {brand.name} • {brand.title}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
              className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl"
            >
              {brand.tagline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300/90 sm:text-lg"
            >
              {brand.summary}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/case-studies"
                className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-400 transition-colors"
              >
                View Case Studies
              </Link>
              <a
                href="/resume.txt"
                download
                className="rounded-xl border border-slate-800/80 bg-slate-950/20 px-5 py-3 text-sm font-medium text-slate-100 hover:bg-slate-900/40 hover:border-indigo-500/40 transition-colors"
              >
                Download Resume
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-6 text-sm text-slate-400"
            >
              {brand.location}
            </motion.p>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
              className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-b from-slate-900/70 to-slate-950/40 shadow-xl shadow-slate-950/40"
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={`${brand.name} — professional photo`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 384px"
                  priority
                  unoptimized={isLocalBackendUrl(photoUrl)}
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(circle_at_70%_75%,rgba(148,163,184,0.18),transparent_55%)]" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center px-6">
                      <div className="mx-auto h-20 w-20 rounded-2xl border border-slate-800/70 bg-slate-950/30" />
                      <p className="mt-4 text-sm font-medium text-slate-200">
                        Professional photo
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Upload in Studio → Home tab
                      </p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
