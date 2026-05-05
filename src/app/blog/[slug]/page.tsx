import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { AttachmentList } from "@/components/AttachmentList";
import { fetchBlogPostBySlug } from "@/lib/blog-api";
import { fetchAttachments } from "@/lib/files-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) return { title: "Blog post" };
  return {
    title: post.title,
    description: post.content.replace(/<[^>]*>/g, " ").slice(0, 160),
  };
}

function unoptimizedSrc(url: string) {
  return (
    url.startsWith("http://localhost") || url.startsWith("http://127.0.0.1")
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) notFound();
  const attachments = await fetchAttachments("blog", post._id);

  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <p className="text-sm text-indigo-200/90">
          <Link href="/blog" className="hover:text-indigo-100">
            ← Blog
          </Link>
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {(post.tags || []).map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-800/70 bg-slate-950/20 px-2.5 py-1 text-xs text-slate-200/90"
            >
              {t}
            </span>
          ))}
        </div>

        {post.coverImage ? (
          <div className="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/40">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
              unoptimized={unoptimizedSrc(post.coverImage)}
            />
          </div>
        ) : null}

        <article
          className="blog-content mt-10 max-w-none space-y-4 text-sm leading-relaxed text-slate-300/90 [&_a]:text-indigo-200 [&_a]:underline [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-slate-50 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-50 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-50 [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="mt-8">
          <AttachmentList files={attachments} />
        </div>
      </Layout>
    </div>
  );
}
