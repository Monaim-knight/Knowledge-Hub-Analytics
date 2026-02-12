import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardsPage() {
  const session = await getServerSession(authOptions);
  const isAuthor = session?.user?.role === "ADMIN" || session?.user?.role === "AUTHOR";
  const isAdmin = session?.user?.role === "ADMIN";

  const where: Record<string, unknown> = {};
  if (!isAdmin) {
    where.approvalStatus = "APPROVED";
  }

  const dashboards = await prisma.dashboard.findMany({
    where,
    include: {
      author: { select: { id: true, name: true } },
      topicDashboards: { include: { topic: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Dashboards</h1>
        {session && (
          <Link
            href="/dashboards/new"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400 transition-colors w-fit"
          >
            New dashboard
          </Link>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dashboards.length === 0 ? (
          <p className="text-slate-400 col-span-full">No dashboards yet.</p>
        ) : (
          dashboards.map((d) => (
            <Link
              key={d.id}
              href={`/dashboards/${d.slug}`}
              className="block rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                {d.topicDashboards.map((td) => (
                  <span
                    key={td.topic.id}
                    className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400"
                  >
                    {td.topic.name}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">{d.title}</h2>
              {d.description && (
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                  {d.description}
                </p>
              )}
              <div className="mt-3 text-sm text-slate-500">
                {d.author.name ?? "Anonymous"}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
