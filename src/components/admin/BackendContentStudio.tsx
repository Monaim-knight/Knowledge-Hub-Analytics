"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Section = {
  heading: string;
  text: string;
  image: string;
};

type MediaItem = {
  _id: string;
  url: string;
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
};

type DraftItem = {
  _id: string;
  title: string;
  slug: string;
  body: string;
  status: "draft" | "published";
  attachments: string[];
  updatedAt?: string;
};

const API_BASE = "/api/backend";
const TOKEN_KEY = "portfolio_backend_admin_token";

function getStoredToken(): string {
  if (typeof window === "undefined") return "";
  return (localStorage.getItem(TOKEN_KEY) || "").trim();
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function BackendContentStudio() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change_me_123456");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "case" | "project" | "blog" | "files" | "write"
  >("case");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loginHint, setLoginHint] = useState("Not signed in");
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // File library
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Manual writing
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [dId, setDId] = useState("");
  const [dTitle, setDTitle] = useState("");
  const [dSlug, setDSlug] = useState("");
  const [dBody, setDBody] = useState("");
  const [dStatus, setDStatus] = useState<"draft" | "published">("draft");
  const [dAttachments, setDAttachments] = useState("");

  useEffect(() => {
    setMounted(true);
    const storedToken = getStoredToken();
    setToken(storedToken);
    setLoginHint(storedToken ? "Signed in" : "Not signed in");
  }, []);

  /** After mount, treat either React state or localStorage as signed in (avoids missing Logout when state lags). */
  const isSignedIn =
    mounted && Boolean((token || "").trim() || getStoredToken());

  const canSaveCaseStudy = useMemo(
    () =>
      Boolean((token || "").trim() || getStoredToken()) &&
      csTitle.trim().length > 0 &&
      csDescription.trim().length > 0 &&
      csSections.every((s) => s.heading.trim() && s.text.trim()),
    [csDescription, csSections, csTitle, token]
  );

  const canSaveProject = useMemo(
    () =>
      Boolean((token || "").trim() || getStoredToken()) &&
      pTitle.trim().length > 0 &&
      pDescription.trim().length > 0,
    [pDescription, pTitle, token]
  );

  const canSaveBlog = useMemo(
    () =>
      Boolean((token || "").trim() || getStoredToken()) &&
      bTitle.trim().length > 0 &&
      bContent.trim().length > 0,
    [bContent, bTitle, token]
  );

  const canSaveDraft = useMemo(
    () =>
      Boolean((token || "").trim() || getStoredToken()) &&
      dTitle.trim().length > 0 &&
      dBody.trim().length > 0,
    [dBody, dTitle, token]
  );

  const getAuthTokenOrThrow = useCallback(() => {
    const authToken = getStoredToken() || token.trim();
    if (!authToken) throw new Error("Not signed in — use Backend Login above.");
    return authToken;
  }, [token]);

  async function safeJson(res: Response) {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error(text.slice(0, 180) || "Unexpected non-JSON response");
    }
  }

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
      const cleanToken = String(data.token).trim();
      localStorage.setItem(TOKEN_KEY, cleanToken);
      setToken(cleanToken);
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

  const loadMedia = useCallback(async () => {
    try {
      const authToken = getAuthTokenOrThrow();
      setLoadingMedia(true);
      const res = await fetch(`${API_BASE}/upload`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = (await safeJson(res)) as { data?: MediaItem[]; message?: string };
      if (!res.ok) throw new Error(data?.message || "Failed to load files");
      setMediaItems(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoadingMedia(false);
    }
  }, [getAuthTokenOrThrow]);

  async function uploadLibraryFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const authToken = getAuthTokenOrThrow();
      setSaving(true);
      setError("");
      setMessage("");
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE}/upload/file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: form,
      });
      const data = (await safeJson(res)) as { fileUrl?: string; data?: MediaItem; message?: string };
      if (!res.ok) throw new Error(data?.message || "File upload failed");
      setMessage(`File uploaded: ${data.fileUrl || data?.data?.url || file.name}`);
      await loadMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  }

  const loadDrafts = useCallback(async () => {
    try {
      const authToken = getAuthTokenOrThrow();
      setLoadingDrafts(true);
      const res = await fetch(`${API_BASE}/content-drafts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = (await safeJson(res)) as { data?: DraftItem[]; message?: string };
      if (!res.ok) throw new Error(data?.message || "Failed to load drafts");
      setDrafts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drafts");
    } finally {
      setLoadingDrafts(false);
    }
  }, [getAuthTokenOrThrow]);

  useEffect(() => {
    if (!isSignedIn) return;
    if (activeTab === "files") void loadMedia();
    if (activeTab === "write") void loadDrafts();
  }, [activeTab, isSignedIn, loadDrafts, loadMedia]);

  function clearDraftForm() {
    setDId("");
    setDTitle("");
    setDSlug("");
    setDBody("");
    setDStatus("draft");
    setDAttachments("");
  }

  function loadDraftIntoForm(d: DraftItem) {
    setDId(d._id);
    setDTitle(d.title || "");
    setDSlug(d.slug || "");
    setDBody(d.body || "");
    setDStatus(d.status || "draft");
    setDAttachments((d.attachments || []).join(", "));
  }

  async function saveDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!canSaveDraft) return;
    try {
      const authToken = getAuthTokenOrThrow();
      setSaving(true);
      setError("");
      setMessage("");
      const payload = {
        title: dTitle.trim(),
        slug: dSlug.trim() || undefined,
        body: dBody,
        status: dStatus,
        attachments: dAttachments
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      };
      const url = dId ? `${API_BASE}/content-drafts/${dId}` : `${API_BASE}/content-drafts`;
      const method = dId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await safeJson(res)) as { data?: DraftItem; message?: string };
      if (!res.ok) throw new Error(data?.message || "Failed to save draft");
      setMessage(dId ? "Content updated." : "Draft created.");
      if (data.data) loadDraftIntoForm(data.data);
      await loadDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save draft");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDraft(id: string) {
    if (!confirm("Delete this draft?")) return;
    try {
      const authToken = getAuthTokenOrThrow();
      const res = await fetch(`${API_BASE}/content-drafts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = (await safeJson(res)) as { message?: string };
      if (!res.ok) throw new Error(data?.message || "Failed to delete draft");
      setMessage("Draft deleted.");
      if (dId === id) clearDraftForm();
      await loadDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete draft");
    }
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
      const authToken = getAuthTokenOrThrow();
      const res = await fetch(`${API_BASE}/case-studies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await safeJson(res)) as { data?: { slug?: string }; message?: string };
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken("");
          setLoginHint("Not signed in");
        }
        throw new Error(data?.message || "Case study upload failed");
      }
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

  async function handleSingleImageSelect(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError("");
    setMessage("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setter(dataUrl);
      setMessage(`${file.name} selected. It will upload on save.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image selection failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleMultipleImageSelect(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (values: string[]) => void
  ) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingImage(true);
    setError("");
    setMessage("");
    try {
      const converted = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setter(converted);
      setMessage(`${files.length} image(s) selected. They will upload on save.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image selection failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
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
      const authToken = getAuthTokenOrThrow();
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await safeJson(res)) as { data?: { slug?: string }; message?: string };
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken("");
          setLoginHint("Not signed in");
        }
        throw new Error(data?.message || "Project upload failed");
      }
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
      const authToken = getAuthTokenOrThrow();
      const res = await fetch(`${API_BASE}/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await safeJson(res)) as { data?: { slug?: string }; message?: string };
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken("");
          setLoginHint("Not signed in");
        }
        throw new Error(data?.message || "Blog upload failed");
      }
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

        {!isSignedIn ? (
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
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-emerald-300">
              Connected to backend — you can upload content below.
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-200 hover:bg-red-500/20"
            >
              Sign out
            </button>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Stuck or bad token?{" "}
          <button
            type="button"
            onClick={handleLogout}
            className="font-medium text-indigo-300 underline decoration-indigo-500/40 underline-offset-2 hover:text-indigo-200"
          >
            Clear saved backend session
          </button>{" "}
          (same as sign out — removes the token from this browser).
        </p>

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
          <button
            onClick={() => setActiveTab("files")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "files"
                ? "bg-indigo-500 text-white"
                : "border border-slate-700 text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            Files
          </button>
          <button
            onClick={() => setActiveTab("write")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "write"
                ? "bg-indigo-500 text-white"
                : "border border-slate-700 text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            Write
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
            <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-3">
              <label className="mb-2 block text-xs text-slate-300">
                or select hero image from your computer
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSingleImageSelect(e, setCsHeroImage)}
                className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-400"
              />
            </div>

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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingImage(true);
                      try {
                        const dataUrl = await readFileAsDataUrl(file);
                        updateCaseSection(idx, { image: dataUrl });
                        setMessage(`${file.name} selected for section image.`);
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Section image selection failed");
                      } finally {
                        setUploadingImage(false);
                        e.target.value = "";
                      }
                    }}
                    className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-400"
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
              {saving ? "Saving..." : uploadingImage ? "Preparing images..." : "Upload case study"}
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
            <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-3">
              <label className="mb-2 block text-xs text-slate-300">
                or select thumbnail from your computer
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSingleImageSelect(e, setPThumbnail)}
                className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-400"
              />
            </div>
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
            <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-3">
              <label className="mb-2 block text-xs text-slate-300">
                or select additional images from your computer
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  handleMultipleImageSelect(e, (values) => setPImages(values.join(",")))
                }
                className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-400"
              />
            </div>
            <button
              disabled={!canSaveProject || saving}
              className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : uploadingImage ? "Preparing images..." : "Upload project"}
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
            <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-3">
              <label className="mb-2 block text-xs text-slate-300">
                or select cover image from your computer
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSingleImageSelect(e, setBCoverImage)}
                className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-400"
              />
            </div>
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
              {saving ? "Saving..." : uploadingImage ? "Preparing images..." : "Upload blog post"}
            </button>
          </form>
        ) : null}

        {activeTab === "files" ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-4">
              <p className="text-sm text-slate-200">Upload any file</p>
              <p className="mt-1 text-xs text-slate-400">
                Supported: images, PDFs, docs, and other common files up to 20MB.
              </p>
              <input
                type="file"
                onChange={uploadLibraryFile}
                className="mt-3 block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-400"
              />
              <button
                type="button"
                onClick={() => void loadMedia()}
                className="mt-3 rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/40"
              >
                Refresh library
              </button>
            </div>

            <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-4">
              <p className="text-sm font-medium text-slate-100">File Library</p>
              {loadingMedia ? (
                <p className="mt-3 text-xs text-slate-400">Loading files...</p>
              ) : mediaItems.length === 0 ? (
                <p className="mt-3 text-xs text-slate-400">No files uploaded yet.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {mediaItems.map((m) => (
                    <div
                      key={m._id}
                      className="rounded-md border border-slate-800/70 bg-slate-900/40 p-3 text-xs text-slate-200"
                    >
                      <p className="font-medium text-slate-100">{m.originalName || m.fileName || "File"}</p>
                      <p className="mt-1 break-all text-slate-400">{m.url}</p>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(m.url)}
                        className="mt-2 rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-900/40"
                      >
                        Copy URL
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "write" ? (
          <div className="grid gap-5 lg:grid-cols-12">
            <form onSubmit={saveDraft} className="space-y-4 lg:col-span-7">
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
                placeholder="Content title"
                value={dTitle}
                onChange={(e) => setDTitle(e.target.value)}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
                placeholder="Slug (optional)"
                value={dSlug}
                onChange={(e) => setDSlug(e.target.value)}
              />
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
                value={dStatus}
                onChange={(e) => setDStatus(e.target.value as "draft" | "published")}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
              <textarea
                className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
                placeholder="Write your markdown or plain text here..."
                value={dBody}
                onChange={(e) => setDBody(e.target.value)}
                rows={12}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950/30 px-4 py-2.5 text-sm text-slate-100"
                placeholder="Attachment URLs (comma separated)"
                value={dAttachments}
                onChange={(e) => setDAttachments(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={!canSaveDraft || saving}
                  className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
                >
                  {saving ? "Saving..." : dId ? "Update content" : "Save draft"}
                </button>
                <button
                  type="button"
                  onClick={clearDraftForm}
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-900/40"
                >
                  New draft
                </button>
              </div>
            </form>

            <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-4 lg:col-span-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-100">Saved drafts</p>
                <button
                  type="button"
                  onClick={() => void loadDrafts()}
                  className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-900/40"
                >
                  Refresh
                </button>
              </div>
              {loadingDrafts ? (
                <p className="mt-3 text-xs text-slate-400">Loading drafts...</p>
              ) : drafts.length === 0 ? (
                <p className="mt-3 text-xs text-slate-400">No drafts yet.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {drafts.map((d) => (
                    <div
                      key={d._id}
                      className="rounded-md border border-slate-800/70 bg-slate-900/40 p-3 text-xs text-slate-200"
                    >
                      <p className="font-medium text-slate-100">{d.title}</p>
                      <p className="mt-1 text-slate-400">
                        /{d.slug} • {d.status}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => loadDraftIntoForm(d)}
                          className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-900/40"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteDraft(d._id)}
                          className="rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs text-red-200 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>

    </div>
  );
}

