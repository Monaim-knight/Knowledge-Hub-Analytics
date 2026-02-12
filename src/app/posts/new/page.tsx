import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/posts/PostEditor";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/posts/new");
  }

  // All logged-in users can submit posts; MEMBER submissions go to PENDING_APPROVAL

  const [tags, topics] = await Promise.all([
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.topic.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">New post</h1>
      <PostEditor tags={tags} topics={topics} mode="create" />
    </div>
  );
}
