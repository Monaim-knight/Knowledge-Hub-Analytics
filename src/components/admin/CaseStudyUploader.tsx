"use client";

import { useEffect, useMemo, useState } from "react";
import { uploadBackendMediaFile } from "@/lib/backend-media-upload";

type Section = {
  heading: string;
  text: string;
  image: string;
};

const API_BASE = "/api/backend";
const TOKEN_KEY = "portfolio_backend_admin_token";

export function CaseStudyUploader() {
  const [token, setToken] = useState<string>("");

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change_me_123456");
  const [authLoading, setAuthLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { heading: "Problem", text: "", image: "" },
  ]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY) || "");
  }, []);

  const canSubmit = useMemo(() => {
    return (
      Boolean(token) &&
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      sections.every((s) => s.heading.trim() && s.text.trim())
    );
  }, [description, sections, title, token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult("");
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.token) {
        throw new Error(data?.message || "Login failed");
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setResult("Admin token saved. You can now upload case studies.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setResult("Logged out from backend admin token.");
    setError("");
  }

  function updateSection(idx: number, patch: Partial<Section>) {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  function addSection() {
    setSections((prev) => [...prev, { heading: "", text: "", image: "" }]);
  }

  function removeSection(idx: number) {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleCreateCaseStudy(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitLoading(true);
    setError("");
    setResult("");

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        heroImage: heroImage.trim(),
        sections: sections.map((s) => ({
          heading: s.heading.trim(),
          text: s.text.trim(),
          image: s.image.trim(),
        })),
      };

      const res = await fetch(`${API_BASE}/case-studies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create case study");

      setResult(`Created successfully: ${data?.data?.slug || "new case study"}`);
      setTitle("");
      setDescription("");
      setTags("");
      setHeroImage("");
      setSections([{ heading: "Problem", text: "", image: "" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create case study");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-800/70 bg-slate-900/30 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Backend Admin Login</h2>
        <p className="mt-2 text-sm text-slate-400">
          Logs into `http://localhost:5000/api/auth/login` and stores JWT in localStorage.
        </p>

        {!token ? (
          <form onSubmit={handleLogin} className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="admin email"
            />
            <input
              className="rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="password"
            />
            <button
              className="sm:col-span-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
              disabled={authLoading}
            >
              {authLoading ? "Signing in..." : "Sign in to backend"}
            </button>
          </form>
        ) : (
          <div className="mt-5">
            <p className="text-sm text-emerald-300">Authenticated for backend uploads.</p>
            <button
              onClick={logout}
              className="mt-3 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900/50"
            >
              Logout token
            </button>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-800/70 bg-slate-900/30 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Create Case Study</h2>
        <form onSubmit={handleCreateCaseStudy} className="mt-5 space-y-4">
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
            placeholder="Hero media URL (optional — image, PDF, etc.)"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
          />
          <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-3">
            <label className="mb-2 block text-xs text-slate-300">
              or upload a file (PDF, images, Word, R Markdown, …)
            </label>
            <input
              type="file"
              accept="*/*"
              disabled={fileLoading || !token}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !token) return;
                setFileLoading(true);
                setError("");
                try {
                  const url = await uploadBackendMediaFile(
                    file,
                    token,
                    "portfolio/case-studies"
                  );
                  setHeroImage(url);
                  setResult(`${file.name} uploaded.`);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Upload failed");
                } finally {
                  setFileLoading(false);
                  e.target.value = "";
                }
              }}
              className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
            />
          </div>

          <div className="space-y-4 rounded-lg border border-slate-800/70 bg-slate-950/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-200">Sections</p>
              <button
                type="button"
                onClick={addSection}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/40"
              >
                + Add section
              </button>
            </div>

            {sections.map((section, idx) => (
              <div key={idx} className="space-y-2 rounded-lg border border-slate-800/70 p-3">
                <input
                  className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-100"
                  placeholder="Section heading"
                  value={section.heading}
                  onChange={(e) => updateSection(idx, { heading: e.target.value })}
                  required
                />
                <textarea
                  className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-100"
                  placeholder="Section text"
                  value={section.text}
                  onChange={(e) => updateSection(idx, { text: e.target.value })}
                  rows={3}
                  required
                />
                <input
                  className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-100"
                  placeholder="Section image URL (optional)"
                  value={section.image}
                  onChange={(e) => updateSection(idx, { image: e.target.value })}
                />
                {sections.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeSection(idx)}
                    className="text-xs text-red-300 hover:text-red-200"
                  >
                    Remove section
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          <button
            disabled={!canSubmit || submitLoading}
            className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
          >
            {submitLoading ? "Uploading..." : "Create case study"}
          </button>
        </form>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}
      {result ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {result}
        </div>
      ) : null}
    </div>
  );
}

