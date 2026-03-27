import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { caseStudies } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "A selection of analytics and strategy case studies with clear problems, solutions, tools, and results.",
};

export default function CaseStudiesPage() {
  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Case Studies"
          title="Problem-first analytics work"
          description="Each case study is structured around the decision problem, the system design, and measurable outcomes."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {caseStudies.map((cs, idx) => (
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

