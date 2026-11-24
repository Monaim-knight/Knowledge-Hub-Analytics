import type { MetadataRoute } from "next";
import { fetchCaseStudies } from "@/lib/case-studies-api";
import { fetchProjects } from "@/lib/projects-api";
import { fetchBlogPosts } from "@/lib/blog-api";
import { fetchPublishedDrafts } from "@/lib/content-drafts-api";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://knowledge-hub-analytics.vercel.app"
).replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const [caseStudies, projects, blogPosts, writing] = await Promise.all([
    fetchCaseStudies().catch(() => []),
    fetchProjects().catch(() => []),
    fetchBlogPosts().catch(() => []),
    fetchPublishedDrafts().catch(() => []),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...caseStudies.map((cs) => ({
      url: `${siteUrl}/case-studies/${encodeURIComponent(cs.slug)}`,
      lastModified: cs.createdAt ? new Date(cs.createdAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${encodeURIComponent(p.slug)}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogPosts.map((b) => ({
      url: `${siteUrl}/blog/${encodeURIComponent(b.slug)}`,
      lastModified: b.createdAt ? new Date(b.createdAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...writing.map((w) => ({
      url: `${siteUrl}/writing/${encodeURIComponent(w.slug)}`,
      lastModified: w.updatedAt ? new Date(w.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
