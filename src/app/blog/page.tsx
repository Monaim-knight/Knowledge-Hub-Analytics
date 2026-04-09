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

export default async function BlogPage() {
  const fromApi = await fetchBlogPosts();

  if (fromApi.length === 0) {
    return (
      <div className="py-16 sm:py-20">
        <Layout>
          <SectionHeader
            eyebrow="Blog"
            title="Writing, analysis, and playbooks"
            description="Sample cards below — add posts via the admin API or Studio when the backend is running."
          />
          <p className="mb-6 text-sm text-amber-200/90">
            No posts in the database yet, or the API is unreachable. Showing placeholders.
          </p>
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
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                    Read (add a post first) <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            ))}
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
