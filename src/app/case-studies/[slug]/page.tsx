import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { caseStudies } from "@/lib/portfolio-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Case Study" };
  return {
    title: cs.title,
    description: cs.summary,
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader eyebrow="Case Study" title={cs.title} description={cs.summary} />

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-8">
            <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-50">Problem</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
                {cs.problem}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-50">Solution</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
                {cs.solution}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-50">Architecture</h3>
              <div className="mt-4 rounded-xl border border-slate-800/70 bg-slate-950/20 p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-4 text-xs text-slate-200/90">
                    Data sources
                  </div>
                  <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-4 text-xs text-slate-200/90">
                    Modeling / ETL
                  </div>
                  <div className="rounded-lg border border-slate-800/70 bg-slate-950/20 p-4 text-xs text-slate-200/90">
                    Dashboards & insights
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Placeholder diagram — replace with your real architecture image
                  or SVG.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-50">Results</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300/90">
                {cs.results.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-indigo-200" aria-hidden>
                      ✓
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-50">Tools used</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {cs.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-800/70 bg-slate-950/20 px-2.5 py-1 text-xs text-slate-200/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-50">Key insights</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300/90">
                {cs.insights.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-indigo-200" aria-hidden>
                      •
                    </span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </Layout>
    </div>
  );
}

