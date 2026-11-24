import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { brand } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal notice (Impressum) for the portfolio of Islam Md Monaim.",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="Rechtliches / Legal Notice"
          title="Impressum"
          description="Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz) für dieses persönliche Bewerbungs- und Projektportfolio."
        />

        <div className="max-w-3xl space-y-6 rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 sm:p-8 text-sm leading-relaxed text-slate-300/90 backdrop-blur">
          <section>
            <h2 className="text-base font-semibold text-slate-100">
              Verantwortlich für den Inhalt
            </h2>
            <p className="mt-2">
              {brand.name}
              <br />
              Deutschland / Germany
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100">Kontakt</h2>
            <p className="mt-2">
              E-Mail:{" "}
              <a
                href={`mailto:${brand.email}`}
                className="text-indigo-200 hover:text-indigo-100 underline-offset-2 hover:underline"
              >
                {brand.email}
              </a>
              <br />
              LinkedIn:{" "}
              <a
                href={brand.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-200 hover:text-indigo-100 underline-offset-2 hover:underline"
              >
                {brand.linkedinUrl}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100">
              Hinweis zum Zweck dieser Website
            </h2>
            <p className="mt-2">
              Diese Website dient ausschließlich als nicht-kommerzielles, persönliches
              Portfolio zur Darstellung von Datenanalyse-Projekten und beruflichen
              Qualifikationen.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100">
              Haftung für Links
            </h2>
            <p className="mt-2">
              Dieses Portfolio enthält Links zu externen Websites Dritter (z. B.
              GitHub, LinkedIn, Tableau Public), auf deren Inhalte kein Einfluss
              besteht. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter oder Betreiber verantwortlich.
            </p>
          </section>
        </div>
      </Layout>
    </div>
  );
}
