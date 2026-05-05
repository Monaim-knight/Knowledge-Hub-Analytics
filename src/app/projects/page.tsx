import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { fetchProjects } from "@/lib/projects-api";
import { projects as staticProjects } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Technical projects across dashboards, SQL workbooks, automation scripts, web tooling, and data pipelines.",
};

export default async function ProjectsPage() {
  const fromApi = await fetchProjects();
  const items =
    fromApi.length > 0
      ? fromApi.map((p) => ({
          key: p.slug,
          item: {
            slug: p.slug,
            title: p.title,
            description: p.description,
            tags: p.tags ?? [],
            githubUrl: p.github || undefined,
            liveDemoUrl: p.liveDemo || undefined,
          },
        }))
      : staticProjects.map((p) => ({
          key: p.title,
          item: {
            title: p.title,
            description: p.description,
            tags: p.tags,
            githubUrl: p.githubUrl,
            liveDemoUrl: undefined,
          },
        }));

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Projects"
          title="Engineering and analytics building blocks"
          description="Reusable components, practical workbooks, and automation that supports reliable analysis."
        />

        {fromApi.length === 0 && staticProjects.length > 0 ? (
          <p className="mb-6 text-sm text-amber-200/90">
            Showing sample content — start the backend API to load projects from your
            database.
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ key, item }, idx) => (
            <ProjectCard key={key} item={item} index={idx} />
          ))}
        </div>
      </Layout>
    </div>
  );
}
