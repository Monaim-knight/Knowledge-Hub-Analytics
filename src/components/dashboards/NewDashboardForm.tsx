"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Topic } from "@prisma/client";

type Props = {
  topics: Topic[];
};

export function NewDashboardForm({ topics }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTopic(id: string) {
    setTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/dashboards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || undefined,
        topicIds: topicIds.length ? topicIds : undefined,
        configJson: {
          charts: [
            { type: "line", title: "Sample Trend", data: [] },
            { type: "bar", title: "Sample Comparison", data: [] },
          ],
        },
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.title?.[0] ?? data.error ?? "Failed to create");
      setLoading(false);
      return;
    }

    const dashboard = await res.json();
    router.push(`/dashboards/${dashboard.slug}`);
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100"
        />
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

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-500 px-6 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create dashboard"}
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
