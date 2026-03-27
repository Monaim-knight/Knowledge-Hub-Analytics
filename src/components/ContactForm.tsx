"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type FormState = {
  name: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const [state, setState] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const isValid = useMemo(() => {
    if (!state.name.trim()) return false;
    if (!state.email.trim()) return false;
    if (!state.message.trim()) return false;
    return true;
  }, [state.email, state.message, state.name]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;
    setStatus("sent");
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-800/80 bg-slate-950/20 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40";

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="text-xs font-medium text-slate-300">Name</label>
          <input
            className={`${fieldClass} mt-2`}
            placeholder="Your name"
            value={state.name}
            onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            required
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-xs font-medium text-slate-300">Email</label>
          <input
            className={`${fieldClass} mt-2`}
            placeholder="you@company.com"
            type="email"
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-300">Message</label>
          <textarea
            className={`${fieldClass} mt-2 min-h-[140px] resize-y`}
            placeholder="Tell me what you’re building and what success looks like."
            value={state.message}
            onChange={(e) =>
              setState((s) => ({ ...s, message: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          No backend yet — this form is a UI placeholder.
        </p>
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors"
        >
          Submit
        </button>
      </div>

      {status === "sent" ? (
        <div className="mt-5 rounded-xl border border-indigo-500/25 bg-indigo-500/10 p-4 text-sm text-indigo-100">
          Message captured (placeholder). Replace with an email service or API
          route when you’re ready.
        </div>
      ) : null}
    </motion.form>
  );
}

