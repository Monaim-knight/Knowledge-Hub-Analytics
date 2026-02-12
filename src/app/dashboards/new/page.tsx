import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NewDashboardForm } from "@/components/dashboards/NewDashboardForm";

export default async function NewDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboards/new");
  }

  // All logged-in users can submit dashboards; MEMBER submissions go to PENDING approval

  const topics = await prisma.topic.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">New dashboard</h1>
      <NewDashboardForm topics={topics} />
    </div>
  );
}
