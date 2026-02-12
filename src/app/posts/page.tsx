import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostStatus, PostType } from "@prisma/client";
import { PostsFilters } from "@/components/posts/PostsFilters";

type Props = {
  searchParams: Promise<{ tag?: string; topic?: string; type?: string; status?: string }>;
};

export default async function PostsPage({ searchParams }: Props) {
  const params = await searchParams;
  const tag = params.tag;
  const topic = params.topic;
  const type = params.type as PostType | null;
  const status = params.status as PostStatus | null;
  const session = await getServerSession(authOptions);

  const isAdminOrAuthor = session?.user?.role === "ADMIN" || session?.user?.role === "AUTHOR";

  const where: Record<string, unknown> = {};

  if (isAdminOrAuthor) {
    if (status) where.status = status;
  } else if (session?.user?.id) {
    // MEMBER: see published + their own pending submissions
    where.OR = [
      { status: PostStatus.PUBLISHED },
      { status: PostStatus.PENDING_APPROVAL, authorId: session.user.id },
    ];
  } else {
    where.status = PostStatus.PUBLISHED;
  }

  if (type) where.type = type;
  if (tag) {
    where.postTags = {
      some: { tag: { slug: tag } },
    };
  }
  if (topic) {
    where.topicPosts = {
      some: { topic: { slug: topic } },
    };
  }

  const [posts, tags, topics] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        postTags: { include: { tag: true } },
        topicPosts: { include: { topic: true } },
      },
      orderBy: [{ status: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.topic.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Posts</h1>
        {session && (
          <Link
            href="/posts/new"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400 transition-colors w-fit"
          >
            New post
          </Link>
        )}
      </div>

      <Suspense fallback={null}>
        <PostsFilters
          tags={tags}
          topics={topics}
          currentTag={tag ?? null}
          currentTopic={topic ?? null}
          currentType={type ?? null}
          currentStatus={status ?? null}
          isAuthor={!!isAdminOrAuthor}
        />
      </Suspense>

      <div className="mt-8 space-y-8">
        {posts.length === 0 ? (
          <p className="text-slate-400">No posts found.</p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {post.postTags.map((pt) => (
                      <Link
                        key={pt.tag.id}
                        href={`/posts?tag=${pt.tag.slug}`}
                        className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                      >
                        {pt.tag.name}
                      </Link>
                    ))}
                    {post.topicPosts?.map((tp) => (
                      <Link
                        key={tp.topic.id}
                        href={`/topics/${tp.topic.slug}`}
                        className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                      >
                        {tp.topic.name}
                      </Link>
                    ))}
                    <span className="text-xs text-slate-500">{post.type}</span>
                    {post.status === PostStatus.DRAFT && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        Draft
                      </span>
                    )}
                    {post.status === PostStatus.PENDING_APPROVAL && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        Pending approval
                      </span>
                    )}
                  </div>
                  <Link href={`/posts/${post.slug}`} className="block group">
                    <h2 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h2>
                    {post.subtitle && (
                      <p className="mt-1 text-slate-400 text-sm">{post.subtitle}</p>
                    )}
                  </Link>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                    <span>{post.author.name ?? post.author.id}</span>
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt.toISOString()}>
                        {post.publishedAt.toLocaleDateString()}
                      </time>
                    )}
                    {post.readingTimeMinutes && (
                      <span>{post.readingTimeMinutes} min read</span>
                    )}
                  </div>
                </div>
                {(post.authorId === session?.user?.id ||
                  session?.user?.role === "ADMIN") && (
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="text-sm text-slate-400 hover:text-cyan-400"
                    >
                      Edit
                    </Link>
                  )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
