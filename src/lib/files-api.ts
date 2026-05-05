import { getBackendApiBase } from "@/lib/backend-api-base";

export type PublicAttachment = {
  _id: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
};

type FilesResponse = { success: boolean; data: PublicAttachment[] };

export async function fetchAttachments(
  parentType: "case-study" | "project" | "blog",
  parentId: string
): Promise<PublicAttachment[]> {
  if (!parentId) return [];
  try {
    const res = await fetch(
      `${getBackendApiBase()}/files/${encodeURIComponent(parentType)}/${encodeURIComponent(parentId)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as FilesResponse;
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

