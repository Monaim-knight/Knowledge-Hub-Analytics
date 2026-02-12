import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/posts/PostEditor";

type Props = {
  params: Promise<{ param: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { param } = await params;
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const post = await prisma.post.findFirst({
    where: { OR: [{ id: param }, { slug: param }] },
    include: {
      postTags: { include: { tag: true } },
      topicPosts: { include: { topic: true } },
      files: true,
    },
  });

  if (!post) notFound();

  if (post.authorId !== session.user!.id && session.user?.role !== "ADMIN") {
    notFound();
  }

  const [tags, topics] = await Promise.all([
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.topic.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Edit post</h1>
      <PostEditor
        post={post}
        tags={tags}
        topics={topics}
        mode="edit"
      />
    </div>
  );
}
