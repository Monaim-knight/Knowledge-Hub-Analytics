import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://knowledge-hub-analytics.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Islam Md Monaim — Data Analyst (Germany)",
    template: "%s — Islam Md Monaim",
  },
  description:
    "Portfolio of Islam Md Monaim — Data Analyst based in Germany specializing in SQL, R, Python, MySQL, Tableau, marketing analytics, forecasting, and business intelligence.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Islam Md Monaim — Data Analyst | Marketing, Customer & Economic Analytics",
    description:
      "Decision-oriented analytics projects across SQL, R, Python, MySQL, and Tableau — from data quality and statistical modeling to executive dashboards.",
    type: "website",
  },
  robots: { index: true, follow: true },
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
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
