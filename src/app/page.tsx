import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { MetricCard } from "@/components/MetricCard";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ProjectCard } from "@/components/ProjectCard";
import { fetchCaseStudies } from "@/lib/case-studies-api";
import { fetchPublishedDrafts } from "@/lib/content-drafts-api";
import { fetchProjects } from "@/lib/projects-api";
import { brand, caseStudies, metrics, projects } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Professional Portfolio",
  description:
    "Turning data into strategy through analytics, dashboards, and business intelligence.",
};

export default async function HomePage() {
  const apiStudies = await fetchCaseStudies();
  const featuredCaseStudies =
    apiStudies.length > 0
      ? apiStudies.slice(0, 3).map((cs) => ({
          slug: cs.slug,
          title: cs.title,
          summary: cs.description,
        }))
      : caseStudies.slice(0, 3).map((cs) => ({
          slug: cs.slug,
          title: cs.title,
          summary: cs.summary,
        }));

  const apiProjects = await fetchProjects();
  const publishedDrafts = await fetchPublishedDrafts();
  const featuredProjects =
    apiProjects.length > 0
      ? apiProjects.slice(0, 3).map((p) => ({
          key: p.slug,
          title: p.title,
          description: p.description,
          tags: p.tags ?? [],
          githubUrl: p.github || undefined,
          liveDemoUrl: p.liveDemo || undefined,
        }))
      : projects.slice(0, 3).map((p) => ({
          key: p.title,
          title: p.title,
          description: p.description,
          tags: p.tags,
          githubUrl: p.githubUrl,
          liveDemoUrl: undefined,
        }));

  const featuredWriting = publishedDrafts.slice(0, 3);

  return (
    <div>
      <Hero />

      <section className="py-14 sm:py-16">
        <Layout>
          <SectionHeader
            eyebrow="Impact"
            title="Analytics outcomes you can measure"
            description="A pragmatic blend of KPI design, clean data modeling, and stakeholder-ready dashboards."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, idx) => (
              <MetricCard key={m.label} metric={m} index={idx} />
            ))}
          </div>
        </Layout>
      </section>

      <section className="py-8 sm:py-10">
        <Layout>
          <div className="flex items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Case Studies"
              title="Selected engagements"
              description="Problem-first work with clear architecture, measurable results, and reusable insights."
            />
            <Link
              href="/case-studies"
              className="hidden rounded-xl border border-slate-800/80 bg-slate-950/20 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900/40 hover:border-indigo-500/40 transition-colors sm:inline-flex"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featuredCaseStudies.map((cs, idx) => (
              <CaseStudyCard
                key={cs.slug}
                item={{ slug: cs.slug, title: cs.title, summary: cs.summary }}
                index={idx}
              />
            ))}
          </div>
        </Layout>
      </section>

      <section className="py-14 sm:py-16">
        <Layout>
          <SectionHeader
            eyebrow="Projects"
            title="Technical work"
            description="A sample of tools, workbooks, dashboards, and automation scripts."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredProjects.map((p, idx) => (
              <ProjectCard
                key={p.key}
                item={{
                  title: p.title,
                  description: p.description,
                  tags: p.tags,
                  githubUrl: p.githubUrl,
                  liveDemoUrl: p.liveDemoUrl,
                }}
                index={idx}
              />
            ))}
          </div>
        </Layout>
      </section>

      <section className="py-8 sm:py-10">
        <Layout>
          <div className="flex items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Writing"
              title="Published notes"
              description="Selected long-form writing published from the Studio."
            />
            <Link
              href="/writing"
              className="hidden rounded-xl border border-slate-800/80 bg-slate-950/20 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900/40 hover:border-indigo-500/40 transition-colors sm:inline-flex"
            >
              View all
            </Link>
          </div>

          {featuredWriting.length === 0 ? (
            <p className="text-sm text-slate-400">
              No published writing yet. Publish from Studio → Write tab.
            </p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {featuredWriting.map((post) => (
                <Link
                  key={post._id}
                  href={`/writing/${post.slug}`}
                  className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur hover:border-indigo-500/40"
                >
                  <h3 className="text-base font-semibold tracking-tight text-slate-50">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-xs text-slate-400">/{post.slug}</p>
                </Link>
              ))}
            </div>
          )}
        </Layout>
      </section>

      <section className="py-14 sm:py-16">
        <Layout>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <SectionHeader
                eyebrow="About"
                title="Analytical, structured, impact-driven"
                description="I build data systems that make decisions easier: clear KPI definitions, reliable models, and dashboards that support action—not just reporting."
              />
              <p className="text-sm leading-relaxed text-slate-300/90">
                My work sits at the intersection of strategy and engineering:
                turning messy data into coherent metrics, dashboards, and
                automation that teams can trust. I focus on governance, clarity,
                and repeatable workflows.
              </p>
              <div className="mt-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100 transition-colors"
                >
                  Read More <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
                <p className="text-sm font-semibold text-slate-50">
                  Focus areas
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300/90">
                  <li>• KPI frameworks & metric governance</li>
                  <li>• Executive dashboards & decision cadence</li>
                  <li>• Enterprise modeling & analytics engineering</li>
                  <li>• Automation for repeatable reporting workflows</li>
                </ul>
                <div className="mt-6 rounded-xl border border-slate-800/70 bg-slate-950/20 p-4 text-sm text-slate-300/90">
                  <p className="font-medium text-slate-100">Mission</p>
                  <p className="mt-2">
                    Build data systems that drive business impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </section>

      <section className="py-14 sm:py-16">
        <Layout>
          <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-r from-indigo-500/10 via-slate-900/30 to-slate-900/20 p-8 backdrop-blur sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-indigo-200/90">
                  Let’s work together
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
                  Ready to turn analytics into outcomes?
                </h2>
                <p className="mt-3 text-sm text-slate-300/90">
                  KPI design, dashboards, automation, and analytics engineering —
                  delivered with clarity and rigor.
                </p>
              </div>

              <Link
                href="/contact"
                className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-400 transition-colors"
              >
                Contact {brand.name.split(" ")[0]}
              </Link>
            </div>
          </div>
        </Layout>
      </section>
    </div>
  );
}
