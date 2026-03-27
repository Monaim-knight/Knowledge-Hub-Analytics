import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "Islam Md Monaim — Data Analyst & Analytics Engineer",
    template: "%s — Islam Md Monaim",
  },
  description:
    "Professional portfolio of Islam Md Monaim — Data Analyst • Strategy Consultant • Analytics Engineer. Turning data into strategy through analytics, dashboards, and business intelligence.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Islam Md Monaim — Turning Data Into Strategy",
    description:
      "Analytics, dashboards, KPI design, enterprise modeling, and automation for measurable business impact.",
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
