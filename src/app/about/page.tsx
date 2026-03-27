import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Academic background, analytics and consulting expertise, and mission-driven work focused on KPI design, dashboards, and automation.",
};

export default function AboutPage() {
  const timeline = [
    {
      period: "2024–Now",
      title: "Analytics Engineering & Strategy",
      description:
        "Building end-to-end analytics systems: modeling, KPI definitions, dashboards, and automation for decision-making.",
    },
    {
      period: "2021–2024",
      title: "Consulting & Research",
      description:
        "Delivered analytical frameworks and evidence-based insights across business and policy topics with stakeholder-ready outputs.",
    },
    {
      period: "2018–2021",
      title: "Foundations in Data & International Trade",
      description:
        "Combined quantitative methods with market and trade analysis—forming a practical bridge between strategy and data.",
    },
  ];

  const skills = [
    "KPI design & metric governance",
    "Enterprise data modeling",
    "Dashboarding (Power BI / Tableau)",
    "SQL (joins, windows, performance patterns)",
    "Python automation & analysis",
    "Data quality checks & validation",
    "Stakeholder communication",
    "Documentation & enablement",
  ];

  const certifications = [
    "Google Data Analytics (placeholder)",
    "Microsoft Power BI (placeholder)",
    "SQL & Analytics Engineering (placeholder)",
  ];

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Biography"
          title="Data, strategy, and systems thinking"
          description="I build data systems that drive business impact—through clear KPIs, reliable models, and dashboards that support action."
        />

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="space-y-4 text-sm leading-relaxed text-slate-300/90">
              <p>
                My background combines analytics engineering with strategy
                consulting. I focus on practical outcomes: teams need consistent
                metrics, governed definitions, and automation that reduces manual
                reporting while increasing trust.
              </p>
              <p>
                Academically, I’ve pursued three master’s degrees across Data
                Science, Analytics, and International Trade. This mix helps me
                translate business priorities into measurable KPI frameworks and
                robust data models.
              </p>
              <p>
                Strengths: KPI design, enterprise modeling, dashboards, and
                workflow automation—delivered with professional documentation
                and a bias toward clarity.
              </p>
            </div>

            <div className="mt-10">
              <SectionHeader
                eyebrow="Timeline"
                title="Experience highlights"
                description="A structured, outcome-first progression across analytics, consulting, and research."
              />

              <ol className="space-y-5">
                {timeline.map((t) => (
                  <li
                    key={t.period}
                    className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur"
                  >
                    <p className="text-xs font-medium text-indigo-200/90">
                      {t.period}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-50">
                      {t.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-300/90">
                      {t.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <p className="text-sm font-semibold text-slate-50">Skills</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {skills.map((s) => (
                  <div
                    key={s}
                    className="rounded-xl border border-slate-800/70 bg-slate-950/20 px-3 py-2 text-xs text-slate-200/90"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <p className="text-sm font-semibold text-slate-50">
                Certifications
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300/90">
                {certifications.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className="mt-0.5 text-indigo-200" aria-hidden>
                      •
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                Replace placeholders with your verified certifications.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-6">
              <p className="text-sm font-semibold text-indigo-100">Mission</p>
              <p className="mt-2 text-sm text-indigo-100/90">
                Build data systems that drive business impact.
              </p>
            </div>
          </aside>
        </div>
      </Layout>
    </div>
  );
}
