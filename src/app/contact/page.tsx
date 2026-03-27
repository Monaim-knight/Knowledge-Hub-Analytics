import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactForm } from "@/components/ContactForm";
import { brand } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Islam Md Monaim for analytics, dashboards, KPI design, automation, and analytics engineering work.",
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Contact"
          title="Let’s work together"
          description="Share your context, constraints, and what success looks like. I’ll respond with a clear next step."
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 backdrop-blur">
              <p className="text-sm font-semibold text-slate-50">
                Direct links
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <a
                  className="block text-slate-300 hover:text-slate-50"
                  href={`mailto:${brand.email}`}
                >
                  Email: <span className="text-indigo-200">{brand.email}</span>
                </a>
                <Link
                  className="block text-slate-300 hover:text-slate-50"
                  href={brand.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn:{" "}
                  <span className="text-indigo-200">Profile</span> ↗
                </Link>
                <Link
                  className="block text-slate-300 hover:text-slate-50"
                  href={brand.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub: <span className="text-indigo-200">Repos</span> ↗
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-6">
              <p className="text-sm font-semibold text-indigo-100">
                Typical engagements
              </p>
              <ul className="mt-3 space-y-2 text-sm text-indigo-100/90">
                <li>• KPI framework design & metric governance</li>
                <li>• Executive dashboards & operational reporting</li>
                <li>• Analytics engineering & enterprise modeling</li>
                <li>• Automation for repeatable data workflows</li>
              </ul>
            </div>
          </aside>
        </div>
      </Layout>
    </div>
  );
}

