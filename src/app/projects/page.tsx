import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Technical projects across dashboards, SQL workbooks, automation scripts, web tooling, and data pipelines.",
};

export default function ProjectsPage() {
  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Projects"
          title="Engineering and analytics building blocks"
          description="Reusable components, practical workbooks, and automation that supports reliable analysis."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, idx) => (
            <ProjectCard key={p.title} item={p} index={idx} />
          ))}
        </div>
      </Layout>
    </div>
  );
}

