import { getBackendApiBase } from "@/lib/backend-api-base";

export type PublishedDraft = {
  _id: string;
  title: string;
  slug: string;
  body?: string;
  attachments?: string[];
  updatedAt?: string;
};

type ListResponse = { success: boolean; data: PublishedDraft[] };
type OneResponse = { success: boolean; data: PublishedDraft };

const base = () => getBackendApiBase();

export async function fetchPublishedDrafts(): Promise<PublishedDraft[]> {
  try {
    const res = await fetch(`${base()}/content-drafts/published`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ListResponse;
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchPublishedDraftBySlug(
  slug: string
): Promise<PublishedDraft | null> {
  try {
    const res = await fetch(`${base()}/content-drafts/published/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as OneResponse;
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}

