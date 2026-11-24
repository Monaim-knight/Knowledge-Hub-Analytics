import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { SectionHeader } from "@/components/SectionHeader";
import { brand } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Privacy notice (Datenschutzerklärung / DSGVO) for this portfolio.",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <div className="py-16 sm:py-20">
      <Layout>
        <SectionHeader
          eyebrow="DSGVO / GDPR"
          title="Datenschutzerklärung (Privacy Policy)"
          description="Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO."
        />

        <div className="max-w-3xl space-y-6 rounded-2xl border border-slate-800/70 bg-slate-900/30 p-6 sm:p-8 text-sm leading-relaxed text-slate-300/90 backdrop-blur">
          <section>
            <h2 className="text-base font-semibold text-slate-100">
              1. Verantwortlicher
            </h2>
            <p className="mt-2">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist{" "}
              {brand.name} (E-Mail:{" "}
              <a
                href={`mailto:${brand.email}`}
                className="text-indigo-200 hover:text-indigo-100 underline-offset-2 hover:underline"
              >
                {brand.email}
              </a>
              ).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100">
              2. Hosting &amp; Server-Logfiles
            </h2>
            <p className="mt-2">
              Diese Website wird über Vercel (Frontend) und Render (API) betrieben.
              Beim Aufruf der Seiten werden durch die Hosting-Anbieter technisch
              notwendige Server-Logdaten (z. B. IP-Adresse, Zeitpunkt des Zugriffs,
              Browsertyp) verarbeitet, um einen sicheren und stabilen Betrieb zu
              gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100">
              3. Kontaktformular
            </h2>
            <p className="mt-2">
              Wenn Sie über das Kontaktformular eine Nachricht senden, werden Ihr
              Name, Ihre E-Mail-Adresse und Ihre Nachricht ausschließlich zur
              Bearbeitung Ihrer Anfrage gespeichert (Art. 6 Abs. 1 lit. b bzw. f
              DSGVO). Eine Weitergabe an Dritte zu Werbezwecken erfolgt nicht.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100">
              4. Cookies &amp; Webanalyse (Vercel Web Analytics)
            </h2>
            <p className="mt-2">
              Diese Website verwendet keine Werbe-Cookies und kein
              Drittanbieter-Werbetracking (kein Google Analytics). Zur
              statistischen Auswertung von Seitenaufrufen wird{" "}
              <strong className="font-medium text-slate-100">
                Vercel Web Analytics
              </strong>{" "}
              ohne Cookies und ohne Speicherung personenbezogener Profile
              eingesetzt (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100">
              5. Ihre Rechte (Art. 15–21 DSGVO)
            </h2>
            <p className="mt-2">
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung
              oder Einschränkung der Verarbeitung Ihrer gespeicherten
              personenbezogenen Daten. Schreiben Sie dazu einfach an{" "}
              <a
                href={`mailto:${brand.email}`}
                className="text-indigo-200 hover:text-indigo-100 underline-offset-2 hover:underline"
              >
                {brand.email}
              </a>
              .
            </p>
          </section>
        </div>
      </Layout>
    </div>
  );
}
