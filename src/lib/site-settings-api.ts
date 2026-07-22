import { getBackendApiBase } from "@/lib/backend-api-base";

export type SiteSettings = {
  profilePhotoUrl: string;
};

type ApiResponse = { success: boolean; data?: SiteSettings };

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const fallback =
    process.env.NEXT_PUBLIC_PROFILE_PHOTO_URL?.trim() ||
    process.env.PROFILE_PHOTO_URL?.trim() ||
    "";

  try {
    const res = await fetch(`${getBackendApiBase()}/site-settings`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return { profilePhotoUrl: fallback };
    const json = (await res.json()) as ApiResponse;
    const url = json.data?.profilePhotoUrl?.trim() || "";
    return { profilePhotoUrl: url || fallback };
  } catch {
    return { profilePhotoUrl: fallback };
  }
}
