import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { fetchCaseStudies } from "@/lib/case-studies-api";
import { caseStudies as staticCaseStudies } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "A selection of analytics and strategy case studies with clear problems, solutions, tools, and results.",
};

export default async function CaseStudiesPage() {
  const fromApi = await fetchCaseStudies();
  const items =
    fromApi.length > 0
      ? fromApi.map((cs) => ({
          slug: cs.slug,
          title: cs.title,
          summary: cs.description,
        }))
      : staticCaseStudies.map((cs) => ({
          slug: cs.slug,
          title: cs.title,
          summary: cs.summary,
        }));

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Case Studies"
          title="Problem-first analytics work"
          description="Each case study is structured around the decision problem, the system design, and measurable outcomes."
        />

        {fromApi.length === 0 && staticCaseStudies.length > 0 ? (
          <p className="mb-6 text-sm text-amber-200/90">
            Showing sample content — start the backend API to load case studies from
            your database.
          </p>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-3">
          {items.map((cs, idx) => (
            <CaseStudyCard
              key={cs.slug}
              item={{ slug: cs.slug, title: cs.title, summary: cs.summary }}
              index={idx}
            />
          ))}
        </div>
      </Layout>
    </div>
  );
}
