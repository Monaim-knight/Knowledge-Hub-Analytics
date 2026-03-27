"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const TOKEN_KEY = "portfolio_backend_admin_token";

export function BlogUploader() {
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change_me_123456");
  const [authLoading, setAuthLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY) || "");
  }, []);

  const canSubmit = useMemo(
    () => Boolean(token) && title.trim().length > 0 && content.trim().length > 0,
    [content, title, token]
  );

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
      if (!res.ok || !data?.token) throw new Error(data?.message || "Login failed");
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setResult("Admin token saved. You can now upload blog posts.");
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

  async function handleCreateBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitLoading(true);
    setError("");
    setResult("");

    try {
      const payload = {
        title: title.trim(),
        coverImage: coverImage.trim(),
        content: content.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch(`${API_BASE}/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create blog post");

      setResult(`Created successfully: ${data?.data?.slug || "new blog post"}`);
      setTitle("");
      setCoverImage("");
      setTags("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog post");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-800/70 bg-slate-900/30 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Backend Admin Login</h2>
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
        <h2 className="text-lg font-semibold text-slate-100">Create Blog Post</h2>
        <form onSubmit={handleCreateBlog} className="mt-5 space-y-4">
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
            placeholder="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
            placeholder="Cover image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
            placeholder="Blog content (HTML or text)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />

          <button
            disabled={!canSubmit || submitLoading}
            className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
          >
            {submitLoading ? "Uploading..." : "Create blog post"}
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

