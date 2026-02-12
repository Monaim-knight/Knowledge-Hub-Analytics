"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Reply = {
  id: string;
  content: string;
  createdAt: Date | string;
  user: { id: string; name: string | null };
  replies?: Reply[];
};

type Props = {
  discussionSlug: string;
  replies: Reply[];
  currentUserId?: string;
};

export function DiscussionReplies({
  discussionSlug,
  replies: initialReplies,
  currentUserId,
}: Props) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [replies, setReplies] = useState(initialReplies);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchReplies() {
    const res = await fetch(`/api/discussions/${discussionSlug}`);
    if (res.ok) {
      const data = await res.json();
      setReplies(data.replies);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/discussions/${discussionSlug}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.content?.[0] ?? "Failed to post reply");
      setLoading(false);
      return;
    }

    setContent("");
    setLoading(false);
    fetchReplies();
  }

  async function handleNestedReply(e: React.FormEvent, parentId: string) {
    e.preventDefault();
    if (!session) return;
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/discussions/${discussionSlug}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, parentReplyId: parentId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.content?.[0] ?? "Failed to post reply");
      setLoading(false);
      return;
    }

    setReplyContent("");
    setReplyingTo(null);
    setLoading(false);
    fetchReplies();
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-100 mb-6">
        Replies ({replies.reduce((acc, r) => acc + 1 + (r.replies?.length ?? 0), 0)})
      </h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            maxLength={2000}
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post reply"}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-slate-400">
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`}
            className="text-cyan-400 underline hover:no-underline"
          >
            Log in
          </Link>{" "}
          to reply.
        </p>
      )}

      <div className="space-y-6">
        {replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            currentUserId={currentUserId}
            onReply={() => setReplyingTo(reply.id)}
            isReplying={replyingTo === reply.id}
            replyContent={replyContent}
            onReplyContentChange={setReplyContent}
            onReplySubmit={(e) => handleNestedReply(e, reply.id)}
            onCancelReply={() => {
              setReplyingTo(null);
              setReplyContent("");
            }}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}

function ReplyItem({
  reply,
  currentUserId,
  onReply,
  isReplying,
  replyContent,
  onReplyContentChange,
  onReplySubmit,
  onCancelReply,
  loading,
}: {
  reply: Reply;
  currentUserId?: string;
  onReply: () => void;
  isReplying: boolean;
  replyContent: string;
  onReplyContentChange: (v: string) => void;
  onReplySubmit: (e: React.FormEvent) => void;
  onCancelReply: () => void;
  loading: boolean;
}) {
  const createdAt =
    typeof reply.createdAt === "string"
      ? new Date(reply.createdAt)
      : reply.createdAt;

  return (
    <div>
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="font-medium text-slate-300">
              {reply.user.name ?? "Anonymous"}
            </span>
            <time dateTime={createdAt.toISOString()}>
              {createdAt.toLocaleDateString()}
            </time>
          </div>
          <p className="text-slate-300 whitespace-pre-wrap">{reply.content}</p>
          {currentUserId && (
            <button
              type="button"
              onClick={onReply}
              className="mt-2 text-sm text-slate-500 hover:text-slate-300"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {isReplying && (
        <form onSubmit={onReplySubmit} className="mt-4 ml-4 pl-4 border-l-2 border-slate-700">
          <textarea
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            maxLength={2000}
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 text-sm"
            required
          />
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-cyan-500 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
            >
              Reply
            </button>
            <button
              type="button"
              onClick={onCancelReply}
              className="rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {(reply.replies?.length ?? 0) > 0 && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-slate-700 space-y-4">
          {(reply.replies ?? []).map((r) => (
            <ReplyItem
              key={r.id}
              reply={r}
              currentUserId={currentUserId}
              onReply={() => {}}
              isReplying={false}
              replyContent=""
              onReplyContentChange={() => {}}
              onReplySubmit={() => {}}
              onCancelReply={() => {}}
              loading={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
