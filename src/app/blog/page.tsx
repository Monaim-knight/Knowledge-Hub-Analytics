import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on analytics engineering, dashboards, KPI design, and strategy-led data work.",
};

const placeholderPosts = [
  {
    title: "Designing KPI systems that leaders trust",
    description:
      "A framework for KPI governance, definitions, and decision cadence.",
    href: "#",
  },
  {
    title: "Dashboards: from reporting to decision support",
    description: "How to structure executive dashboards for action.",
    href: "#",
  },
  {
    title: "Data quality checks that pay for themselves",
    description: "Practical validation patterns you can measure and maintain.",
    href: "#",
  },
];

export default function BlogPage() {
  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Blog"
          title="Writing, analysis, and playbooks"
          description="This section is ready for posts whenever you want to publish."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {placeholderPosts.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur"
            >
              <h3 className="text-base font-semibold tracking-tight text-slate-50">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
                {p.description}
              </p>
              <div className="mt-5">
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100 transition-colors"
                >
                  Read (coming soon) <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </div>
  );
}

