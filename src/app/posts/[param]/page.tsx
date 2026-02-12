import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostStatus } from "@prisma/client";
import { MarkdownContent } from "@/components/posts/MarkdownContent";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { FileAttachments } from "@/components/files/FileAttachments";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

type Props = {
  params: Promise<{ param: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { param } = await params;
  const post = await prisma.post.findFirst({
    where: { OR: [{ slug: param }, { id: param }], status: PostStatus.PUBLISHED },
    select: { title: true, subtitle: true },
  });

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.subtitle ?? post.title,
  };
}

export default async function PostPage({ params }: Props) {
  const { param } = await params;
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findFirst({
    where: { OR: [{ slug: param }, { id: param }] },
    include: {
      author: { select: { id: true, name: true } },
      postTags: { include: { tag: true } },
      topicPosts: { include: { topic: true } },
      files: true,
      comments: {
        where: { isHidden: false },
        include: {
          user: { select: { id: true, name: true } },
          upvotes: { select: { userId: true } },
        },
      },
    },
  });

  if (!post) notFound();

  const isAuthor = session?.user?.role === "ADMIN" || session?.user?.role === "AUTHOR";
  const canEdit = isAuthor && post.authorId === session?.user?.id;

  const isAdmin = session?.user?.role === "ADMIN";
  if (post.status === PostStatus.DRAFT && !canEdit) {
    notFound();
  }
  if (post.status === PostStatus.PENDING_APPROVAL && !canEdit && !isAdmin) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      {post.status === PostStatus.PUBLISHED && (
        <PageViewTracker entityType="POST" entityId={post.id} />
      )}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
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
              className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
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
        <h1 className="text-4xl font-bold text-slate-100">{post.title}</h1>
        {post.subtitle && (
          <p className="mt-2 text-xl text-slate-400">{post.subtitle}</p>
        )}
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <span>{post.author.name ?? "Anonymous"}</span>
          {post.publishedAt && (
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString()}
            </time>
          )}
          {post.readingTimeMinutes && (
            <span>{post.readingTimeMinutes} min read</span>
          )}
        </div>
        {canEdit && (
          <Link
            href={`/posts/${post.id}/edit`}
            className="mt-4 inline-block text-sm text-slate-400 hover:text-slate-100"
          >
            Edit post
          </Link>
        )}
      </header>

      {post.coverImageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt=""
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div className="prose prose-invert prose-zinc max-w-none">
        <MarkdownContent content={post.content} />
      </div>

      {post.files?.filter((f) => f.approvalStatus === "APPROVED").length > 0 && (
        <FileAttachments files={post.files.filter((f) => f.approvalStatus === "APPROVED")} />
      )}

      {post.status === PostStatus.PUBLISHED && (
        <CommentsSection
          postId={post.id}
          isAdmin={session?.user?.role === "ADMIN"}
          initialComments={
            post.comments
              ?.filter((c) => !c.parentCommentId)
              .map((c) => ({
                id: c.id,
                content: c.content,
                createdAt: c.createdAt.toISOString(),
                user: c.user,
                upvotes: c.upvotes,
                replies: (post.comments ?? [])
                  .filter((r) => r.parentCommentId === c.id)
                  .map((r) => ({
                    id: r.id,
                    content: r.content,
                    createdAt: r.createdAt.toISOString(),
                    user: r.user,
                    upvotes: r.upvotes,
                    replies: [],
                  })),
              })) ?? []
          }
        />
      )}
    </article>
  );
}
