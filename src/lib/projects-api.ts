import { getBackendApiBase } from "@/lib/backend-api-base";

export type ApiProject = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  github?: string;
  liveDemo?: string;
  images?: string[];
  createdAt?: string;
};

type ApiListResponse = { success: boolean; data: ApiProject[] };
type ApiOneResponse = { success: boolean; data: ApiProject };

const base = () => getBackendApiBase();

export async function fetchProjects(): Promise<ApiProject[]> {
  try {
    const res = await fetch(`${base()}/projects`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse;
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchProjectBySlug(
  slug: string
): Promise<ApiProject | null> {
  try {
    const res = await fetch(
      `${base()}/projects/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as ApiOneResponse;
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}
