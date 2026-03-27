import type { Metadata } from "next";
import { BackendContentStudio } from "@/components/admin/BackendContentStudio";

export const metadata: Metadata = {
  title: "Content Studio",
  description: "Single-page backend login and uploader for case studies, projects, and blog posts.",
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-100">Content Studio</h1>
      <p className="mt-2 text-sm text-slate-400">
        One place to sign in to backend and upload case studies, projects, and blog posts.
      </p>

      <div className="mt-8">
        <BackendContentStudio />
      </div>
    </div>
  );
}

