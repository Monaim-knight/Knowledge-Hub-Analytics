"use client";

import { useEffect, useMemo, useState } from "react";

type Section = {
  heading: string;
  text: string;
  image: string;
};

const API_BASE = "/api/backend";
const TOKEN_KEY = "portfolio_backend_admin_token";

export function BackendContentStudio() {
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change_me_123456");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"case" | "project" | "blog">("case");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loginHint, setLoginHint] = useState("Not signed in");

  // Case study fields
  const [csTitle, setCsTitle] = useState("");
  const [csDescription, setCsDescription] = useState("");
  const [csTags, setCsTags] = useState("");
  const [csHeroImage, setCsHeroImage] = useState("");
  const [csSections, setCsSections] = useState<Section[]>([
    { heading: "Problem", text: "", image: "" },
  ]);

  // Project fields
  const [pTitle, setPTitle] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pTags, setPTags] = useState("");
  const [pThumbnail, setPThumbnail] = useState("");
  const [pGithub, setPGithub] = useState("");
  const [pLiveDemo, setPLiveDemo] = useState("");
  const [pImages, setPImages] = useState("");

  // Blog fields
  const [bTitle, setBTitle] = useState("");
  const [bCoverImage, setBCoverImage] = useState("");
  const [bTags, setBTags] = useState("");
  const [bContent, setBContent] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY) || "";
    setToken(storedToken);
    setLoginHint(storedToken ? "Signed in" : "Not signed in");
  }, []);

  const canSaveCaseStudy = useMemo(
    () =>
      Boolean(token) &&
      csTitle.trim().length > 0 &&
      csDescription.trim().length > 0 &&
      csSections.every((s) => s.heading.trim() && s.text.trim()),
    [csDescription, csSections, csTitle, token]
  );

  const canSaveProject = useMemo(
    () => Boolean(token) && pTitle.trim().length > 0 && pDescription.trim().length > 0,
    [pDescription, pTitle, token]
  );

  const canSaveBlog = useMemo(
    () => Boolean(token) && bTitle.trim().length > 0 && bContent.trim().length > 0,
    [bContent, bTitle, token]
  );

  async function handleBackendLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoginHint("Signing in...");
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data: { token?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        // Fallback message when backend returns non-JSON unexpectedly.
      }
      if (!res.ok || !data?.token) {
        throw new Error(data?.message || "Login failed");
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setLoginHint("Signed in");
      setMessage("Backend login successful. You can now upload content.");
    } catch (err) {
      setLoginHint("Sign in failed");
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setLoginHint("Not signed in");
    setMessage("Logged out from backend.");
    setError("");
  }

  function updateCaseSection(idx: number, patch: Partial<Section>) {
    setCsSections((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  function addCaseSection() {
    setCsSections((prev) => [...prev, { heading: "", text: "", image: "" }]);
  }

  function removeCaseSection(idx: number) {
    setCsSections((prev) => prev.filter((_, i) => i !== idx));
  }

  async function saveCaseStudy(e: React.FormEvent) {
    e.preventDefault();
    if (!canSaveCaseStudy) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        title: csTitle.trim(),
        description: csDescription.trim(),
        tags: csTags.split(",").map((t) => t.trim()).filter(Boolean),
        heroImage: csHeroImage.trim(),
        sections: csSections.map((s) => ({
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
      if (!res.ok) throw new Error(data?.message || "Case study upload failed");
      setMessage(`Case study uploaded: ${data?.data?.slug || "created"}`);
      setCsTitle("");
      setCsDescription("");
      setCsTags("");
      setCsHeroImage("");
      setCsSections([{ heading: "Problem", text: "", image: "" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Case study upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveProject(e: React.FormEvent) {
    e.preventDefault();
    if (!canSaveProject) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        title: pTitle.trim(),
        description: pDescription.trim(),
        tags: pTags.split(",").map((t) => t.trim()).filter(Boolean),
        thumbnail: pThumbnail.trim(),
        github: pGithub.trim(),
        liveDemo: pLiveDemo.trim(),
        images: pImages.split(",").map((img) => img.trim()).filter(Boolean),
      };
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Project upload failed");
      setMessage(`Project uploaded: ${data?.data?.slug || "created"}`);
      setPTitle("");
      setPDescription("");
      setPTags("");
      setPThumbnail("");
      setPGithub("");
      setPLiveDemo("");
      setPImages("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Project upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!canSaveBlog) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        title: bTitle.trim(),
        coverImage: bCoverImage.trim(),
        content: bContent.trim(),
        tags: bTags.split(",").map((t) => t.trim()).filter(Boolean),
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
      if (!res.ok) throw new Error(data?.message || "Blog upload failed");
      setMessage(`Blog post uploaded: ${data?.data?.slug || "created"}`);
      setBTitle("");
      setBCoverImage("");
      setBTags("");
      setBContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Blog upload failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6">
        <h2 className="text-lg font-semibold text-slate-100">1) Backend Login</h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in once, then upload case studies, projects, and blog posts from this single page.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          API: <span className="text-slate-300">{API_BASE}</span> • Status:{" "}
          <span className="text-slate-200">{loginHint}</span>
        </p>

        {!token ? (
          <form onSubmit={handleBackendLogin} className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Admin email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Admin password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="sm:col-span-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
              disabled={authLoading}
            >
              {authLoading ? "Signing in..." : "Sign in to backend"}
            </button>
          </form>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-emerald-300">Connected to backend.</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/50"
            >
              Logout
            </button>
          </div>
        )}

        {error ? (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("case")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "case"
                ? "bg-indigo-500 text-white"
                : "border border-slate-700 text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            Case Study
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "project"
                ? "bg-indigo-500 text-white"
                : "border border-slate-700 text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            Project
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "blog"
                ? "bg-indigo-500 text-white"
                : "border border-slate-700 text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            Blog Post
          </button>
        </div>

        {activeTab === "case" ? (
          <form onSubmit={saveCaseStudy} className="space-y-4">
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Case study title"
              value={csTitle}
              onChange={(e) => setCsTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Case study description"
              value={csDescription}
              onChange={(e) => setCsDescription(e.target.value)}
              rows={4}
              required
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Tags (comma separated)"
              value={csTags}
              onChange={(e) => setCsTags(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Hero image URL (optional)"
              value={csHeroImage}
              onChange={(e) => setCsHeroImage(e.target.value)}
            />

            <div className="space-y-3 rounded-lg border border-slate-800/70 bg-slate-950/20 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-200">Sections</p>
                <button
                  type="button"
                  onClick={addCaseSection}
                  className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-900/40"
                >
                  + Add section
                </button>
              </div>
              {csSections.map((s, idx) => (
                <div key={idx} className="space-y-2 rounded-md border border-slate-800/70 p-3">
                  <input
                    className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-100"
                    placeholder="Section heading"
                    value={s.heading}
                    onChange={(e) => updateCaseSection(idx, { heading: e.target.value })}
                    required
                  />
                  <textarea
                    className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-100"
                    placeholder="Section text"
                    value={s.text}
                    onChange={(e) => updateCaseSection(idx, { text: e.target.value })}
                    rows={3}
                    required
                  />
                  <input
                    className="w-full rounded-md border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-100"
                    placeholder="Section image URL (optional)"
                    value={s.image}
                    onChange={(e) => updateCaseSection(idx, { image: e.target.value })}
                  />
                  {csSections.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeCaseSection(idx)}
                      className="text-xs text-red-300 hover:text-red-200"
                    >
                      Remove section
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <button
              disabled={!canSaveCaseStudy || saving}
              className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Upload case study"}
            </button>
          </form>
        ) : null}

        {activeTab === "project" ? (
          <form onSubmit={saveProject} className="space-y-4">
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Project title"
              value={pTitle}
              onChange={(e) => setPTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Project description"
              value={pDescription}
              onChange={(e) => setPDescription(e.target.value)}
              rows={4}
              required
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Tags (comma separated)"
              value={pTags}
              onChange={(e) => setPTags(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Thumbnail URL (optional)"
              value={pThumbnail}
              onChange={(e) => setPThumbnail(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="GitHub URL (optional)"
              value={pGithub}
              onChange={(e) => setPGithub(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Live demo URL (optional)"
              value={pLiveDemo}
              onChange={(e) => setPLiveDemo(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Additional image URLs (comma separated)"
              value={pImages}
              onChange={(e) => setPImages(e.target.value)}
            />
            <button
              disabled={!canSaveProject || saving}
              className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Upload project"}
            </button>
          </form>
        ) : null}

        {activeTab === "blog" ? (
          <form onSubmit={saveBlog} className="space-y-4">
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Blog title"
              value={bTitle}
              onChange={(e) => setBTitle(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Cover image URL (optional)"
              value={bCoverImage}
              onChange={(e) => setBCoverImage(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Tags (comma separated)"
              value={bTags}
              onChange={(e) => setBTags(e.target.value)}
            />
            <textarea
              className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
              placeholder="Blog content (HTML/text)"
              value={bContent}
              onChange={(e) => setBContent(e.target.value)}
              rows={12}
              required
            />
            <button
              disabled={!canSaveBlog || saving}
              className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Upload blog post"}
            </button>
          </form>
        ) : null}
      </section>

    </div>
  );
}

