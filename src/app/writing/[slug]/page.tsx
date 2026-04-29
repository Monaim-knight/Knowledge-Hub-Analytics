import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { fetchPublishedDraftBySlug } from "@/lib/content-drafts-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchPublishedDraftBySlug(slug);
  if (!item) return { title: "Writing" };
  return {
    title: item.title,
    description: (item.body || "").slice(0, 160),
  };
}

export default async function WritingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await fetchPublishedDraftBySlug(slug);
  if (!item) notFound();

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <p className="text-sm text-indigo-200/90">
          <Link href="/writing" className="hover:text-indigo-100">
            ← Writing
          </Link>
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">{item.title}</h1>
        <article className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-slate-300/90">
          {item.body || ""}
        </article>

        {(item.attachments || []).length > 0 ? (
          <section className="mt-10 rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6">
            <h2 className="text-sm font-semibold text-slate-50">Attachments</h2>
            <div className="mt-3 space-y-2">
              {(item.attachments || []).map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-sm text-indigo-200 hover:text-indigo-100"
                >
                  {url}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </Layout>
    </div>
  );
}

