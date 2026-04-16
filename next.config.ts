import type { NextConfig } from "next";
import path from "path";

/**
 * Note: Next.js requires `distDir` to be a relative path.
 * Keep configurable, but default to `.next`.
 */
const distDir = process.env.NEXT_DIST_DIR || ".next";

function getBackendImageRemotePattern():
  | { protocol: "http" | "https"; hostname: string; port?: string }
  | null {
  const raw = process.env.BACKEND_PUBLIC_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    const protocol = parsed.protocol.replace(":", "");
    if (protocol !== "http" && protocol !== "https") return null;
    return {
      protocol,
      hostname: parsed.hostname,
      port: parsed.port || undefined,
    };
  } catch {
    return null;
  }
}

const backendPattern = getBackendImageRemotePattern();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir,
  outputFileTracingRoot: path.join(process.cwd()),
  images: {
    remotePatterns: [
      ...(backendPattern ? [backendPattern] : []),
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
