"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostStatus, PostType } from "@prisma/client";
import { FileUpload } from "@/components/files/FileUpload";
import type { Post, Tag, Topic } from "@prisma/client";
import type { PostTag, TopicPost } from "@prisma/client";

type FileRecord = { id: string; fileName: string; mimeType: string; sizeBytes: number };
type PostWithTags = Post & {
  postTags: (PostTag & { tag: Tag })[];
  topicPosts?: (TopicPost & { topic: Topic })[];
  files?: FileRecord[];
};

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: "ANALYSIS", label: "Analysis" },
  { value: "CASE_STUDY", label: "Case Study" },
  { value: "NOTE", label: "Note" },
  { value: "NEWS", label: "News" },
  { value: "OTHER", label: "Other" },
];

type Props = {
  post?: PostWithTags | null;
  tags: Tag[];
  topics: Topic[];
  mode: "create" | "edit";
};

export function PostEditor({ post, tags, topics, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [type, setType] = useState<PostType>(post?.type ?? "OTHER");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "DRAFT");
  const [tagIds, setTagIds] = useState<string[]>(
    post?.postTags.map((pt) => pt.tagId) ?? []
  );
  const [topicIds, setTopicIds] = useState<string[]>(
    post?.topicPosts?.map((tp) => tp.topicId) ?? []
  );
  const [fileIds, setFileIds] = useState<string[]>(
    post?.files?.map((f) => f.id) ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body = {
        title,
        subtitle: subtitle || undefined,
        content,
        coverImageUrl: coverImageUrl || undefined,
        type,
        status,
        tagIds,
        topicIds,
        fileIds,
      };

      if (mode === "create") {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error?.title?.[0] ?? data.error ?? "Failed to create");
        }

        const created = await res.json();
        router.push(`/posts/${created.slug}`);
      } else {
        const res = await fetch(`/api/posts/${post!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error?.title?.[0] ?? data.error ?? "Failed to update");
        }

        const updated = await res.json();
        router.push(`/posts/${updated.slug}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
        <label className="block text-sm font-medium text-slate-300 mb-1">Subtitle</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Content (Markdown)</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 font-mono text-sm"
          placeholder="# Heading&#10;&#10;Your content here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Cover image URL</label>
        <input
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as PostType)}
          className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100"
        >
          {POST_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
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

      <FileUpload
        fileIds={fileIds}
        onFileIdsChange={setFileIds}
        attachTo={mode === "edit" && post ? { postId: post.id } : undefined}
        initialFiles={post?.files}
      />

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PostStatus)}
          className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-500 px-6 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
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
