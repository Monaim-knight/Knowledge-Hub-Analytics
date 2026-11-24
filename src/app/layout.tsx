import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { brand } from "@/lib/portfolio-data";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://knowledge-hub-analytics.vercel.app"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  title: {
    default: "Islam Md Monaim — Data Analyst (Germany)",
    template: "%s — Islam Md Monaim",
  },
  description:
    "Portfolio of Islam Md Monaim — Data Analyst based in Germany specializing in SQL, R, Python, MySQL, Tableau, marketing analytics, forecasting, and business intelligence.",
  keywords: [
    "Islam Md Monaim",
    "Md Monaim Islam",
    "Data Analyst Germany",
    "Marketing Analytics",
    "Customer Analytics",
    "Business Intelligence",
    "SQL",
    "R",
    "Python",
    "Tableau",
    "MySQL",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Islam Md Monaim — Data Analyst | Marketing, Customer & Economic Analytics",
    description:
      "Decision-oriented analytics projects across SQL, R, Python, MySQL, and Tableau — from data quality and statistical modeling to executive dashboards.",
    url: siteUrl,
    siteName: "Islam Md Monaim — Portfolio",
    type: "website",
  },
  robots: { index: true, follow: true },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    other: {
      "msvalidate.01": "36223596F2526919D5EBF668CA9BB44A",
    },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: brand.name,
  alternateName: ["Md Monaim Islam", "Monaim Islam"],
  jobTitle: brand.title,
  description: brand.summary,
  url: siteUrl,
  email: `mailto:${brand.email}`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "DE",
  },
  sameAs: [brand.linkedinUrl, brand.githubUrl],
  knowsAbout: [
    "SQL",
    "MySQL",
    "BigQuery",
    "R",
    "Python",
    "Tableau",
    "Marketing Analytics",
    "Customer Analytics",
    "A/B Testing",
    "Time-Series Forecasting",
    "Business Intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col antialiased selection:bg-indigo-500/25 selection:text-slate-50"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
