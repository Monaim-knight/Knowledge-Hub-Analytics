import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchPublishedDrafts } from "@/lib/content-drafts-api";

export const metadata: Metadata = {
  title: "Writing",
  description: "Published notes and long-form writing.",
};

export default async function WritingPage() {
  const items = await fetchPublishedDrafts();

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Writing"
          title="Published notes"
          description="Long-form posts written in the Studio Write tab."
        />

        {items.length === 0 ? (
          <p className="text-sm text-slate-400">No published writing yet.</p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item._id}
                href={`/writing/${item.slug}`}
                className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur hover:border-indigo-500/40"
              >
                <h3 className="text-base font-semibold tracking-tight text-slate-50">{item.title}</h3>
                <p className="mt-3 text-xs text-slate-400">/{item.slug}</p>
              </Link>
            ))}
          </div>
        )}
      </Layout>
    </div>
  );
}

