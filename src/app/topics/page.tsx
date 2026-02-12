import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const topics = await prisma.topic.findMany({
    include: {
      _count: {
        select: {
          postLinks: true,
          dashboardLinks: true,
          discussionLinks: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Topics</h1>
      <p className="text-slate-400 mb-10">
        Browse content by topic—posts, dashboards, and discussions organized by theme.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topics.length === 0 ? (
          <p className="text-slate-400 col-span-full">No topics yet.</p>
        ) : (
          topics.map((topic) => {
            const total =
              topic._count.postLinks +
              topic._count.dashboardLinks +
              topic._count.discussionLinks;
            return (
              <Link
                key={topic.id}
                href={`/topics/${topic.slug}`}
                className="block rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 hover:border-violet-500/50 hover:bg-slate-800/80 transition-colors"
              >
                <h2 className="text-xl font-semibold text-slate-100 hover:text-violet-400 transition-colors">{topic.name}</h2>
                {topic.description && (
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                    {topic.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span>{topic._count.postLinks} posts</span>
                  <span>{topic._count.dashboardLinks} dashboards</span>
                  <span>{topic._count.discussionLinks} discussions</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
