"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/portfolio-data";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="leading-tight">
          <div className="text-sm font-semibold text-slate-50">{brand.name}</div>
          <div className="hidden text-xs text-slate-400 lg:block">{brand.title}</div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-500/10 text-indigo-100 border border-indigo-500/20"
                    : "text-slate-200/90 hover:text-slate-50 hover:bg-slate-900/40 border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/contact"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

