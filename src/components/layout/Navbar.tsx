"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/discussions", label: "Discussions" },
  { href: "/dashboards", label: "Dashboards" },
  { href: "/topics", label: "Topics" },
];

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors"
          >
            Islam Md Monaim
          </Link>
          <ul className="flex items-center gap-6 sm:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href="/posts/new"
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  Submit
                </Link>
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  {session.user?.name ?? session.user?.email}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
