import { getBackendApiBase } from "@/lib/backend-api-base";

export type ApiBlogPost = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  content: string;
  tags: string[];
  createdAt?: string;
};

type ApiListResponse = { success: boolean; data: ApiBlogPost[] };
type ApiOneResponse = { success: boolean; data: ApiBlogPost };

const base = () => getBackendApiBase();

export async function fetchBlogPosts(): Promise<ApiBlogPost[]> {
  try {
    const res = await fetch(`${base()}/blog`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse;
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<ApiBlogPost | null> {
  try {
    const res = await fetch(`${base()}/blog/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiOneResponse;
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}

/** Plain-text excerpt from stored HTML for list cards */
export function excerptFromHtml(html: string, maxLen = 180): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
}
