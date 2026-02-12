"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tag, Topic } from "@prisma/client";
import { FileUpload } from "@/components/files/FileUpload";

type Props = {
  tags: Tag[];
  topics: Topic[];
};

export function NewDiscussionForm({ tags, topics }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(id: string) {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function toggleTopic(id: string) {
    setTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, tagIds, topicIds, fileIds }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.title?.[0] ?? data.error ?? "Failed to create");
      setLoading(false);
      return;
    }

    const discussion = await res.json();
    router.push(`/discussions/${discussion.slug}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
        <input
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
        <textarea
          required
          maxLength={5000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded text-sm ${
                tagIds.includes(tag.id)
                  ? "bg-cyan-500 text-slate-900"
                  : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Topics</label>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggleTopic(topic.id)}
              className={`px-3 py-1 rounded text-sm ${
                topicIds.includes(topic.id)
                  ? "bg-cyan-500 text-slate-900"
                  : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      <FileUpload fileIds={fileIds} onFileIdsChange={setFileIds} />

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-500 px-6 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create discussion"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-slate-600 px-6 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
