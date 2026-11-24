import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { excerptFromHtml, fetchBlogPosts } from "@/lib/blog-api";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on analytics engineering, dashboards, KPI design, and strategy-led data work.",
};

export default async function BlogPage() {
  const fromApi = await fetchBlogPosts();

  if (fromApi.length === 0) {
    return (
      <div className="py-16 sm:py-20">
        <Layout>
          <SectionHeader
            eyebrow="Blog"
            title="Writing, analysis, and playbooks"
            description="Articles on analytics, experimentation, forecasting, and KPI design."
          />
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-8 backdrop-blur">
            <p className="text-sm text-slate-300">
              New articles are coming soon. In the meantime, explore my published
              case studies and technical projects.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/case-studies"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors"
              >
                View Case Studies
              </Link>
              <Link
                href="/projects"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 transition-colors"
              >
                View Projects
              </Link>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Blog"
          title="Writing, analysis, and playbooks"
          description="Posts from your CMS — published through the backend."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {fromApi.map((post) => (
            <div
              key={post._id}
              className="flex h-full flex-col rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur"
            >
              <h3 className="text-base font-semibold tracking-tight text-slate-50">
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300/90">
                {excerptFromHtml(post.content)}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(post.tags || []).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-800/70 bg-slate-950/20 px-2.5 py-1 text-xs text-slate-200/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100 transition-colors"
                >
                  Read <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </div>
  );
}
