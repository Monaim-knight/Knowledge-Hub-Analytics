/**
 * Split a field that may list http(s) URLs or data: URIs.
 * A naive `.split(",")` breaks `data:...;base64,...` values.
 */
export function splitAttachmentRefs(raw: string): string[] {
  const out: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    out.push(
      ...t
        .split(/,(?=https?:\/\/|data:)/i)
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }
  return out;
}
