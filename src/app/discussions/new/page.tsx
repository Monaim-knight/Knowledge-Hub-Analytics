import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NewDiscussionForm } from "@/components/discussions/NewDiscussionForm";

export default async function NewDiscussionPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/discussions/new");
  }

  const [tags, topics] = await Promise.all([
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.topic.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">New discussion</h1>
      <NewDiscussionForm tags={tags} topics={topics} />
    </div>
  );
}
