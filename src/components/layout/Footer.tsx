import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/posts", label: "Posts" },
  { href: "/discussions", label: "Discussions" },
  { href: "/dashboards", label: "Dashboards" },
  { href: "/topics", label: "Topics" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-700/50 bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Islam Md Monaim. All rights reserved.
          </p>
          <nav className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
