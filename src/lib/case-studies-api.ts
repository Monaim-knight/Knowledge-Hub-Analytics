import { getBackendApiBase } from "@/lib/backend-api-base";

/**
 * Server-side fetch to Express API (MongoDB).
 * Env resolution: see `getBackendApiBase` in `backend-api-base.ts`.
 */
function getApiBase(): string {
  return getBackendApiBase();
}

export type ApiCaseStudy = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  heroImage?: string;
  sections: { heading: string; text: string; image?: string }[];
  createdAt?: string;
};

type ApiListResponse = { success: boolean; data: ApiCaseStudy[] };
type ApiOneResponse = { success: boolean; data: ApiCaseStudy };

export async function fetchCaseStudies(): Promise<ApiCaseStudy[]> {
  try {
    const res = await fetch(`${getApiBase()}/case-studies`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse;
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchCaseStudyBySlug(
  slug: string
): Promise<ApiCaseStudy | null> {
  try {
    const res = await fetch(`${getApiBase()}/case-studies/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiOneResponse;
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}
