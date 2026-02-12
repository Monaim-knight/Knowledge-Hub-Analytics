import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { DashboardCharts } from "@/components/dashboards/DashboardCharts";
import { FileAttachments } from "@/components/files/FileAttachments";

type ChartConfig = {
  charts?: Array<{
    type: string;
    title: string;
    data?: Array<Record<string, unknown>>;
  }>;
};

type Props = {
  params: Promise<{ param: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { param } = await params;
  const session = await getServerSession(authOptions);

  const dashboard = await prisma.dashboard.findFirst({
    where: { OR: [{ slug: param }, { id: param }] },
    include: {
      author: { select: { id: true, name: true } },
      topicDashboards: { include: { topic: true } },
      files: true,
    },
  });

  if (!dashboard) notFound();

  const isAdmin = session?.user?.role === "ADMIN";
  if (dashboard.approvalStatus !== "APPROVED" && !isAdmin) {
    notFound();
  }

  const canEdit = dashboard.authorId === session?.user?.id || session?.user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <PageViewTracker entityType="DASHBOARD" entityId={dashboard.id} />

      <Link
        href="/dashboards"
        className="text-sm text-slate-400 hover:text-cyan-400 mb-6 inline-block"
      >
        ← Back to dashboards
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {dashboard.topicDashboards.map((td) => (
            <Link
              key={td.topic.id}
              href={`/topics/${td.topic.slug}`}
              className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
            >
              {td.topic.name}
            </Link>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-slate-100">{dashboard.title}</h1>
        {dashboard.description && (
          <p className="mt-2 text-slate-400">{dashboard.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {dashboard.author.name ?? "Anonymous"}
          </span>
          {canEdit && (
            <Link
              href={`/dashboards/${dashboard.id}/edit`}
              className="text-sm text-slate-400 hover:text-cyan-400"
            >
              Edit
            </Link>
          )}
        </div>
      </header>

      <DashboardCharts config={dashboard.configJson as ChartConfig | null} />

      {dashboard.files?.filter((f) => f.approvalStatus === "APPROVED").length > 0 && (
        <div className="mt-8">
          <FileAttachments files={dashboard.files.filter((f) => f.approvalStatus === "APPROVED")} />
        </div>
      )}
    </div>
  );
}
