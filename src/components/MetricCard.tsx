"use client";

import { motion } from "framer-motion";
import type { Metric } from "@/lib/portfolio-data";

function Icon({ name }: { name: Metric["icon"] }) {
  const common = "h-5 w-5 text-indigo-200";
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none">
          <path
            d="M4 4h7v7H4V4Zm9 0h7v10h-7V4ZM4 13h7v7H4v-7Zm9 3h7v4h-7v-4Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "briefcase":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none">
          <path
            d="M9 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4 13h16"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.7"
          />
        </svg>
      );
    case "degree":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none">
          <path
            d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 12.5V16c0 1 2.2 3 5 3s5-2 5-3v-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M21 8.5v6"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none">
          <path
            d="m9 18-6-6 6-6M15 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
      className="group rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5 shadow-sm backdrop-blur hover:bg-slate-900/55 hover:border-indigo-500/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-slate-800/70 bg-slate-950/30 p-2 group-hover:border-indigo-500/30 transition-colors">
          <Icon name={metric.icon} />
        </div>
        <div>
          <p className="text-xl font-semibold tracking-tight text-slate-50">
            {metric.value}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300/90">
            {metric.label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

