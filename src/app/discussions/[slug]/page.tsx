import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DiscussionReplies } from "@/components/discussions/DiscussionReplies";
import { FileAttachments } from "@/components/files/FileAttachments";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DiscussionPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const discussion = await prisma.discussion.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
      topicDiscussions: { include: { topic: true } },
      files: true,
      replies: {
        include: {
          user: { select: { id: true, name: true } },
          replies: {
            include: {
              user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        where: { parentReplyId: null },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!discussion) notFound();

  const isAdmin = session?.user?.role === "ADMIN";
  if (discussion.approvalStatus !== "APPROVED" && !isAdmin) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/discussions"
        className="text-sm text-slate-400 hover:text-cyan-400 mb-6 inline-block"
      >
        ← Back to discussions
      </Link>

      <article className="mb-12">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {discussion.tags.map((t) => (
            <Link
              key={t.tag.id}
              href={`/discussions?tag=${t.tag.slug}`}
              className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
            >
              {t.tag.name}
            </Link>
          ))}
          {discussion.topicDiscussions?.map((td) => (
            <Link
              key={td.topic.id}
              href={`/topics/${td.topic.slug}`}
              className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
            >
              {td.topic.name}
            </Link>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-slate-100">{discussion.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <span>{discussion.author.name ?? "Anonymous"}</span>
          <time dateTime={discussion.createdAt.toISOString()}>
            {discussion.createdAt.toLocaleDateString()}
          </time>
        </div>
        <div className="mt-6 text-slate-300 whitespace-pre-wrap">{discussion.content}</div>
        {discussion.files?.filter((f) => f.approvalStatus === "APPROVED").length > 0 && (
          <FileAttachments files={discussion.files.filter((f) => f.approvalStatus === "APPROVED")} />
        )}
      </article>

      <DiscussionReplies
        discussionSlug={slug}
        replies={discussion.replies.map((r) => ({
          ...r,
          replies: r.replies?.map((rr) => ({ ...rr, replies: [] })) ?? [],
        }))}
        currentUserId={session?.user?.id}
      />
    </div>
  );
}
