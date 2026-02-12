"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Tag, Topic } from "@prisma/client";

type Props = {
  tags: Tag[];
  topics: Topic[];
  currentTag: string | null;
  currentTopic: string | null;
};

export function DiscussionsFilters({ tags, topics, currentTag, currentTopic }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/discussions?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Tag:</span>
        <select
          value={currentTag ?? ""}
          onChange={(e) => updateFilter("tag", e.target.value || null)}
          className="rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200"
        >
          <option value="">All</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Topic:</span>
        <select
          value={currentTopic ?? ""}
          onChange={(e) => updateFilter("topic", e.target.value || null)}
          className="rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200"
        >
          <option value="">All</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.slug}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
