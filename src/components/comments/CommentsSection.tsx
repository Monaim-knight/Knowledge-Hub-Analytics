"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

function CommentModActions({
  commentId,
  onAction,
}: {
  commentId: string;
  onAction: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function hide() {
    setLoading(true);
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: true }),
    });
    setLoading(false);
    if (res.ok) onAction();
  }

  async function remove() {
    if (!confirm("Delete this comment?")) return;
    setLoading(true);
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) onAction();
  }

  return (
    <span className="ml-2 flex gap-2">
      <button
        type="button"
        onClick={hide}
        disabled={loading}
        className="text-xs text-amber-400 hover:text-amber-300"
      >
        Hide
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={loading}
        className="text-xs text-red-400 hover:text-red-300"
      >
        Delete
      </button>
    </span>
  );
}

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null };
  upvotes: { userId: string }[];
  replies: Comment[];
};

type Props = {
  postId: string;
  initialComments?: Comment[];
  isAdmin?: boolean;
};

export function CommentsSection({ postId, initialComments = [], isAdmin = false }: Props) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchComments() {
    const res = await fetch(`/api/posts/${postId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.content?.[0] ?? "Failed to post comment");
      setLoading(false);
      return;
    }

    setContent("");
    setLoading(false);
    fetchComments();
  }

  async function handleReply(e: React.FormEvent, parentId: string) {
    e.preventDefault();
    if (!session) return;
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, parentCommentId: parentId }),
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
    fetchComments();
  }

  async function toggleUpvote(commentId: string) {
    if (!session) return;

    const res = await fetch(`/api/comments/${commentId}/upvote`, {
      method: "POST",
    });

    if (res.ok) {
      fetchComments();
    }
  }

  return (
    <section className="mt-16 pt-8 border-t border-slate-800">
      <h2 className="text-xl font-semibold text-slate-100 mb-6">
        Comments ({comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)})
      </h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {error && (
            <p className="text-sm text-red-400 mb-2">{error}</p>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
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
            {loading ? "Posting..." : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-slate-400">
          <Link href={`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`} className="text-cyan-400 underline hover:no-underline">
            Log in
          </Link>{" "}
          to comment.
        </p>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={session?.user?.id}
            onReply={() => setReplyingTo(comment.id)}
            onUpvote={toggleUpvote}
            isReplying={replyingTo === comment.id}
            replyContent={replyContent}
            onReplyContentChange={setReplyContent}
            onReplySubmit={(e) => handleReply(e, comment.id)}
            onCancelReply={() => {
              setReplyingTo(null);
              setReplyContent("");
            }}
            loading={loading}
            isAdmin={isAdmin}
            onRefresh={fetchComments}
          />
        ))}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onReply,
  onUpvote,
  isReplying,
  replyContent,
  onReplyContentChange,
  onReplySubmit,
  onCancelReply,
  loading,
  depth = 0,
  isAdmin = false,
  onRefresh,
}: {
  comment: Comment;
  currentUserId?: string;
  onReply: () => void;
  onUpvote: (id: string) => void;
  isReplying: boolean;
  replyContent: string;
  onReplyContentChange: (v: string) => void;
  onReplySubmit: (e: React.FormEvent) => void;
  onCancelReply: () => void;
  loading: boolean;
  depth?: number;
  isAdmin?: boolean;
  onRefresh?: () => void;
}) {
  const upvoteCount = comment.upvotes.length;
  const hasUpvoted = currentUserId && comment.upvotes.some((u) => u.userId === currentUserId);

  return (
    <div className={depth > 0 ? "mt-4" : ""}>
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="font-medium text-slate-300">{comment.user.name ?? "Anonymous"}</span>
            <time dateTime={comment.createdAt}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </time>
          </div>
          <p className="text-slate-300 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => onUpvote(comment.id)}
              disabled={!currentUserId}
              className={`text-sm ${hasUpvoted ? "text-cyan-400" : "text-slate-500 hover:text-cyan-400"}`}
            >
              ▲ {upvoteCount}
            </button>
            {currentUserId && depth === 0 && (
              <button
                type="button"
                onClick={onReply}
                className="text-sm text-slate-500 hover:text-cyan-400"
              >
                Reply
              </button>
            )}
            {isAdmin && onRefresh && (
              <CommentModActions commentId={comment.id} onAction={onRefresh} />
            )}
          </div>
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

      {comment.replies.length > 0 && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-slate-700 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={() => {}}
              onUpvote={onUpvote}
              isReplying={false}
              replyContent=""
              onReplyContentChange={() => {}}
              onReplySubmit={() => {}}
            onCancelReply={() => {}}
            loading={false}
            depth={depth + 1}
            isAdmin={isAdmin}
            onRefresh={onRefresh}
          />
          ))}
        </div>
      )}
    </div>
  );
}
