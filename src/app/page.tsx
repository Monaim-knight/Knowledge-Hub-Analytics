import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl md:text-6xl">
          Knowledge Hub & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Analytics</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          A platform combining publishing, data dashboards, community discussions,
          and structured learning—all in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/posts"
            className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-medium text-slate-900 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Browse Posts
          </Link>
          <Link
            href="/dashboards"
            className="rounded-lg border-2 border-violet-500/50 px-6 py-3 text-sm font-medium text-slate-100 hover:border-violet-400 hover:bg-violet-500/10 transition-colors"
          >
            View Dashboards
          </Link>
        </div>
      </section>

      <section className="mt-24 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          title="Posts & Essays"
          description="Blog posts, case studies, analyses, and long-form notes."
          href="/posts"
        />
        <FeatureCard
          title="Dashboards"
          description="Interactive data visualizations and analytical projects."
          href="/dashboards"
        />
        <FeatureCard
          title="Discussions"
          description="Community threads, comments, and collaborative dialogue."
          href="/discussions"
        />
        <FeatureCard
          title="Topics"
          description="Browse by topic—inequality, policy, ML, and more."
          href="/topics"
        />
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-cyan-500/5"
    >
      <h2 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </Link>
  );
}
