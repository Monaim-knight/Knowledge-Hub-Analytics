import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { AttachmentList } from "@/components/AttachmentList";
import { fetchProjectBySlug } from "@/lib/projects-api";
import { fetchAttachments } from "@/lib/files-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) notFound();
  const attachments = await fetchAttachments("project", project._id);

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <p className="text-sm text-indigo-200/90">
          <Link href="/projects" className="hover:text-indigo-100">
            ← Projects
          </Link>
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">{project.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-300/90">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(project.tags || []).map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-800/70 bg-slate-950/20 px-2.5 py-1 text-xs text-slate-200/90"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <AttachmentList files={attachments} />
        </div>
      </Layout>
    </div>
  );
}

