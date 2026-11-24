"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { brand } from "@/lib/portfolio-data";

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
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isValid = useMemo(() => {
    if (state.name.trim().length < 2) return false;
    if (!state.email.trim().includes("@")) return false;
    if (state.message.trim().length < 10) return false;
    return true;
  }, [state.email, state.message, state.name]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/backend/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          email: state.email.trim(),
          message: state.message.trim(),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        errors?: Array<{ msg?: string }>;
      };

      if (!res.ok || !data.success) {
        const validationMsg = data.errors?.map((err) => err.msg).filter(Boolean).join("; ");
        throw new Error(
          validationMsg || data.message || "Could not send message right now. Please try email directly."
        );
      }

      setStatus("sent");
      setState({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not send message right now. Please use the direct email link."
      );
    }
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
            minLength={2}
            maxLength={120}
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
            placeholder="Share details about the role, project, or analytics challenge (min. 10 characters)."
            minLength={10}
            maxLength={5000}
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
          Direct email:{" "}
          <a
            href={`mailto:${brand.email}`}
            className="text-indigo-200 hover:text-indigo-100 underline-offset-2 hover:underline"
          >
            {brand.email}
          </a>
        </p>
        <button
          type="submit"
          disabled={!isValid || status === "submitting"}
          className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors"
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
      </div>

      {status === "sent" ? (
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Thank you — your message has been received. I will reply as soon as possible.
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
          {errorMessage}{" "}
          <a href={`mailto:${brand.email}`} className="underline">
            Email {brand.email}
          </a>
        </div>
      ) : null}
    </motion.form>
  );
}

