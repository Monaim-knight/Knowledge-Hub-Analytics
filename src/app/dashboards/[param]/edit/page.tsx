import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardEditForm } from "@/components/dashboards/DashboardEditForm";

type Props = {
  params: Promise<{ param: string }>;
};

export default async function DashboardEditPage({ params }: Props) {
  const { param } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboards");
  }

  const dashboard = await prisma.dashboard.findFirst({
    where: { OR: [{ id: param }, { slug: param }] },
    include: {
      topicDashboards: { include: { topic: true } },
    },
  });

  if (!dashboard) notFound();

  if (dashboard.authorId !== session.user!.id && session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const topics = await prisma.topic.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Edit dashboard</h1>
      <DashboardEditForm
        dashboard={dashboard}
        topics={topics}
      />
    </div>
  );
}
