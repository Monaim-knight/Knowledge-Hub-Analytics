"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PendingItem = {
  id: string;
  title?: string;
  fileName?: string;
  slug?: string;
  createdAt: string;
  author?: { id: string; name: string | null; email: string };
  uploader?: { id: string; name: string | null; email: string };
};

type QueueData = {
  posts: PendingItem[];
  discussions: PendingItem[];
  dashboards: PendingItem[];
  files: PendingItem[];
};

function ItemCard({
  entity,
  item,
  onApprove,
  onReject,
}: {
  entity: "post" | "discussion" | "dashboard" | "file";
  item: PendingItem;
  onApprove: () => void;
  onReject: () => void;
}) {
  const author = item.author ?? item.uploader;
  const label = item.title ?? item.fileName ?? item.id;
  const href =
    entity === "post"
      ? `/posts/${item.slug ?? item.id}`
      : entity === "discussion"
        ? `/discussions/${item.slug}`
        : entity === "dashboard"
          ? `/dashboards/${item.slug ?? item.id}`
          : null;

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        {href ? (
          <Link href={href} className="text-slate-100 hover:text-cyan-400 truncate block">
            {label}
          </Link>
        ) : (
          <span className="text-slate-100 truncate block">{label}</span>
        )}
        <p className="text-sm text-slate-500 mt-0.5">
          by {author?.name ?? author?.email ?? "Unknown"} •{" "}
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onApprove}
          className="rounded px-3 py-1.5 text-sm font-medium bg-cyan-600 text-slate-900 hover:bg-cyan-500"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="rounded px-3 py-1.5 text-sm font-medium bg-red-600/80 text-white hover:bg-red-500"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export function ModerationQueue() {
  const [data, setData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function fetchQueue() {
    setLoading(true);
    fetch("/api/moderation/queue")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchQueue();
  }, []);

  async function handleAction(
    entity: "post" | "discussion" | "dashboard" | "file",
    id: string,
    action: "approve" | "reject"
  ) {
    const endpoint = action === "approve" ? "/api/moderation/approve" : "/api/moderation/reject";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, id }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Action failed");
      return;
    }
    setError(null);
    fetchQueue();
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-8 text-center text-slate-500">
        Loading moderation queue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const total =
    data.posts.length +
    data.discussions.length +
    data.dashboards.length +
    data.files.length;

  if (total === 0) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-8 text-center text-slate-500">
        No pending submissions. All content has been reviewed.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-slate-100">
        Moderation queue ({total} pending)
      </h2>

      {data.posts.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-300 mb-3">Posts (publications)</h3>
          <div className="space-y-3">
            {data.posts.map((item) => (
              <ItemCard
                key={item.id}
                entity="post"
                item={item}
                onApprove={() => handleAction("post", item.id, "approve")}
                onReject={() => handleAction("post", item.id, "reject")}
              />
            ))}
          </div>
        </div>
      )}

      {data.discussions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-300 mb-3">Discussions</h3>
          <div className="space-y-3">
            {data.discussions.map((item) => (
              <ItemCard
                key={item.id}
                entity="discussion"
                item={item}
                onApprove={() => handleAction("discussion", item.id, "approve")}
                onReject={() => handleAction("discussion", item.id, "reject")}
              />
            ))}
          </div>
        </div>
      )}

      {data.dashboards.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-300 mb-3">Dashboards</h3>
          <div className="space-y-3">
            {data.dashboards.map((item) => (
              <ItemCard
                key={item.id}
                entity="dashboard"
                item={item}
                onApprove={() => handleAction("dashboard", item.id, "approve")}
                onReject={() => handleAction("dashboard", item.id, "reject")}
              />
            ))}
          </div>
        </div>
      )}

      {data.files.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-300 mb-3">Standalone files</h3>
          <div className="space-y-3">
            {data.files.map((item) => (
              <ItemCard
                key={item.id}
                entity="file"
                item={item}
                onApprove={() => handleAction("file", item.id, "approve")}
                onReject={() => handleAction("file", item.id, "reject")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
