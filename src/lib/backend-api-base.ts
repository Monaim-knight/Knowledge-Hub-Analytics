/**
 * Shared base URL for server-side calls to the Express API (`/api/...`).
 * Same resolution as documented in case-studies-api / Next proxy route.
 */
export function getBackendApiBase(): string {
  const explicit =
    process.env.BACKEND_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const origin =
    process.env.BACKEND_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL;
  if (origin) return `${origin.replace(/\/+$/, "")}/api`;

  return "http://127.0.0.1:5000/api";
}
