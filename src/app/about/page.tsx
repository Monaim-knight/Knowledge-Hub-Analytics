import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { brand } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Data analyst based in Germany combining Data Science & Policy with International Trade — SQL, R, Python, MySQL, and Tableau.",
};

export default function AboutPage() {
  const approach = [
    {
      step: "01",
      title: "Business Problem & Decision Framing",
      description:
        "Define the exact commercial or policy decision before choosing an analytical method or tool.",
    },
    {
      step: "02",
      title: "Data Provenance, Cleaning & Validation",
      description:
        "Audit completeness, duplicates, missing values, definitions, and data quality assumptions before modeling.",
    },
    {
      step: "03",
      title: "Statistical Reasoning, Forecasting & Experimentation",
      description:
        "Match the method to the question — SQL modeling, A/B testing, regression, time-series forecasting, or causal inference.",
    },
    {
      step: "04",
      title: "Executive Dashboards & Actionable Recommendations",
      description:
        "Translate technical results, uncertainty, and trade-offs into clear Tableau dashboards and concrete next steps.",
    },
  ];

  const skills = [
    "SQL & MySQL",
    "R & tidyverse",
    "Python (pandas, modeling)",
    "Tableau & BI Dashboards",
    "BigQuery & Data Modeling",
    "A/B Testing & Experimentation",
    "Time-Series Forecasting",
    "Marketing & Funnel Analytics",
    "Customer & Churn Analytics",
    "Economic & Trade Analysis",
  ];

  const targetRoles = [
    "Data Analyst",
    "Marketing Analytics",
    "Product Analytics",
    "Business Intelligence Analyst",
    "Digital & Customer Analytics",
  ];

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="About"
          title="Decision-oriented data & economic analytics"
          description="Turning complex commercial, customer, and economic data into clear, reproducible insights."
        />

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="space-y-4 text-sm leading-relaxed text-slate-300/90">
              <p>
                I am a data analyst based in Germany using{" "}
                <strong className="font-medium text-slate-100">
                  SQL, R, Python, MySQL, and Tableau
                </strong>{" "}
                to transform complex datasets into clear, decision-oriented
                insights.
              </p>
              <p>
                My academic background combines{" "}
                <strong className="font-medium text-slate-100">
                  Data Science &amp; Policy
                </strong>{" "}
                with master’s-level studies in{" "}
                <strong className="font-medium text-slate-100">
                  International Trade
                </strong>
                . This perspective helps me connect quantitative methods with
                commercial reality across marketing performance, customer
                behavior, experimentation, forecasting, and macroeconomic
                analysis.
              </p>
              <p>
                My work covers the full analytical lifecycle: business problem
                definition, data quality validation, SQL modeling, statistical
                analysis, interactive Tableau dashboarding, and stakeholder-ready
                recommendations.
              </p>
            </div>

            <div className="mt-10">
              <SectionHeader
                eyebrow="Methodology"
                title="How I approach analytics"
                description="Reproducible workflows designed around data quality, validation, and real business decisions."
              />

              <ol className="space-y-4">
                {approach.map((item) => (
                  <li
                    key={item.step}
                    className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur"
                  >
                    <p className="text-xs font-medium text-indigo-200/90">
                      Step {item.step}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-50">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-300/90">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <p className="text-sm font-semibold text-slate-50">
                Technical Toolkit
              </p>
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
                Target Roles in Germany
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300/90">
                {targetRoles.map((role) => (
                  <li key={role} className="flex items-start gap-2">
                    <span className="mt-0.5 text-indigo-200" aria-hidden>
                      •
                    </span>
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                {brand.location}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-6">
              <p className="text-sm font-semibold text-indigo-100">
                Get in touch
              </p>
              <p className="mt-2 text-sm text-indigo-100/90">
                Interested in discussing an analytics role or project in Germany?
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-400 transition-colors"
                >
                  Contact me
                </Link>
                <a
                  href={brand.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-indigo-400/30 px-4 py-2 text-xs font-medium text-indigo-100 hover:bg-indigo-500/20 transition-colors"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Layout>
    </div>
  );
}
