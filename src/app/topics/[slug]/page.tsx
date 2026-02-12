import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostStatus } from "@prisma/client";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      postLinks: {
        include: {
          post: {
            include: {
              author: { select: { id: true, name: true } },
              postTags: { include: { tag: true } },
            },
          },
        },
      },
      dashboardLinks: {
        include: {
          dashboard: {
            include: {
              author: { select: { id: true, name: true } },
            },
          },
        },
      },
      discussionLinks: {
        include: {
          discussion: {
            include: {
              author: { select: { id: true, name: true } },
              _count: { select: { replies: true } },
            },
          },
        },
      },
    },
  });

  if (!topic) notFound();

  const isAuthor = session?.user?.role === "ADMIN" || session?.user?.role === "AUTHOR";
  const isAdmin = session?.user?.role === "ADMIN";

  const posts = topic.postLinks
    .map((lp) => lp.post)
    .filter((p) => p.status === PostStatus.PUBLISHED || isAuthor);
  const dashboards = topic.dashboardLinks
    .map((ld) => ld.dashboard)
    .filter((d) => d.approvalStatus === "APPROVED" || isAdmin);
  const discussions = topic.discussionLinks
    .map((ld) => ld.discussion)
    .filter((d) => d.approvalStatus === "APPROVED" || isAdmin);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/topics"
        className="text-sm text-slate-400 hover:text-cyan-400 mb-6 inline-block"
      >
        ← Back to topics
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-100">{topic.name}</h1>
        {topic.description && (
          <p className="mt-2 text-slate-400">{topic.description}</p>
        )}
      </header>

      <div className="space-y-12">
        {posts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Posts</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="block rounded-lg border border-slate-700/50 bg-slate-800/50 p-6 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {post.postTags.map((pt) => (
                      <span
                        key={pt.tag.id}
                        className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400"
                      >
                        {pt.tag.name}
                      </span>
                    ))}
                    <span className="text-xs text-slate-500">{post.type}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100">{post.title}</h3>
                  {post.subtitle && (
                    <p className="mt-1 text-sm text-slate-400">{post.subtitle}</p>
                  )}
                  <div className="mt-2 text-sm text-slate-500">
                    {post.author.name ?? "Anonymous"}
                    {post.publishedAt && (
                      <> · {post.publishedAt.toLocaleDateString()}</>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {dashboards.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Dashboards</h2>
            <div className="space-y-4">
              {dashboards.map((d) => (
                <Link
                  key={d.id}
                  href={`/dashboards/${d.slug}`}
                  className="block rounded-lg border border-slate-700/50 bg-slate-800/50 p-6 hover:border-cyan-500/50 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-slate-100">{d.title}</h3>
                  {d.description && (
                    <p className="mt-1 text-sm text-slate-400">{d.description}</p>
                  )}
                  <div className="mt-2 text-sm text-slate-500">
                    {d.author.name ?? "Anonymous"}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {discussions.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Discussions</h2>
            <div className="space-y-4">
              {discussions.map((d) => (
                <Link
                  key={d.id}
                  href={`/discussions/${d.slug}`}
                  className="block rounded-lg border border-slate-700/50 bg-slate-800/50 p-6 hover:border-cyan-500/50 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-slate-100">{d.title}</h3>
                  <p className="mt-1 text-sm text-slate-400 line-clamp-2">{d.content}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                    <span>{d.author.name ?? "Anonymous"}</span>
                    <span>{d._count.replies} replies</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && dashboards.length === 0 && discussions.length === 0 && (
          <p className="text-slate-400">No content linked to this topic yet.</p>
        )}
      </div>
    </div>
  );
}
