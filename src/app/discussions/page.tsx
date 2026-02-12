import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DiscussionsFilters } from "@/components/discussions/DiscussionsFilters";

type Props = {
  searchParams: Promise<{ tag?: string; topic?: string }>;
};

export default async function DiscussionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const tag = params.tag ?? null;
  const topic = params.topic ?? null;
  const session = await getServerSession(authOptions);

  const where: Record<string, unknown> = {};
  const isAdmin = session?.user?.role === "ADMIN";
  if (!isAdmin) {
    where.approvalStatus = "APPROVED";
  }
  if (tag) {
    where.tags = {
      some: { tag: { slug: tag } },
    };
  }
  if (topic) {
    where.topicDiscussions = {
      some: { topic: { slug: topic } },
    };
  }

  const [discussions, tags, topics] = await Promise.all([
    prisma.discussion.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
        topicDiscussions: { include: { topic: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.topic.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Discussions</h1>
        {session && (
          <Link
            href="/discussions/new"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400 transition-colors w-fit"
          >
            New discussion
          </Link>
        )}
      </div>

      <Suspense fallback={null}>
        <DiscussionsFilters tags={tags} topics={topics} currentTag={tag} currentTopic={topic} />
      </Suspense>

      <div className="mt-8 space-y-6">
        {discussions.length === 0 ? (
          <p className="text-slate-400">No discussions yet.</p>
        ) : (
          discussions.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {d.tags.map((t) => (
                  <Link
                    key={t.tag.id}
                    href={`/discussions?tag=${t.tag.slug}`}
                    className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                  >
                    {t.tag.name}
                  </Link>
                ))}
                {d.topicDiscussions?.map((td) => (
                  <Link
                    key={td.topic.id}
                    href={`/topics/${td.topic.slug}`}
                    className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                  >
                    {td.topic.name}
                  </Link>
                ))}
              </div>
              <Link href={`/discussions/${d.slug}`} className="block group">
                <h2 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {d.title}
                </h2>
                <p className="mt-1 text-slate-400 text-sm line-clamp-2">{d.content}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                  <span>{d.author.name ?? "Anonymous"}</span>
                  <time dateTime={d.createdAt.toISOString()}>
                    {d.createdAt.toLocaleDateString()}
                  </time>
                  <span>{d._count.replies} replies</span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
