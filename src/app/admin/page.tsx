import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { ModerationQueue } from "@/components/admin/ModerationQueue";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Admin</h1>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Moderation queue</h2>
        <p className="text-slate-400 mb-6">
          Review submissions before they appear on the site. Check authenticity and approve only
          verified content.
        </p>
        <ModerationQueue />
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Analytics</h2>
        <AdminAnalytics />
      </section>
    </div>
  );
}
