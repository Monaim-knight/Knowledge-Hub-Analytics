import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { prisma } from "./db";
import { rateLimit } from "./rate-limit";
import { getBackendApiBase } from "@/lib/backend-api-base";

function getReqIp(req: { headers?: { get?: (name: string) => string | null } }): string {
  const forwarded = req.headers?.get?.("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (req) {
          const { success } = rateLimit(getReqIp(req), {
            prefix: "login",
            max: 10,
            windowMs: 15 * 60 * 1000,
          });
          if (!success) throw new Error("Too many login attempts. Try again later.");
        }

        if (!credentials?.email || !credentials?.password) return null;

        // First, try the Express admin auth so /login matches Studio login.
        try {
          const res = await fetch(`${getBackendApiBase()}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            cache: "no-store",
          });

          if (res.ok) {
            const json = (await res.json()) as { token?: string };
            if (json?.token) {
              return {
                id: `backend-admin:${credentials.email}`,
                email: credentials.email,
                name: "Backend Admin",
                role: "ADMIN" as UserRole,
                backendToken: json.token,
              };
            }
          }
        } catch {
          // Fall through to Prisma user auth for community accounts.
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) return null;

          const valid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            backendToken: "",
          };
        } catch {
          // If Prisma DB is not initialized (e.g. missing tables), do not fail login with server errors.
          // Backend-admin auth above remains the primary path for Studio and /login parity.
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.backendToken = user.backendToken || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.backendToken = token.backendToken || "";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-dev-secret",
  debug: process.env.NODE_ENV === "development",
};
