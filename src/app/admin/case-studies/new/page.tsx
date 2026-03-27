import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyUploader } from "@/components/admin/CaseStudyUploader";

export const metadata: Metadata = {
  title: "Admin Case Study Upload",
  description: "Upload new case studies to backend API.",
};

export default function AdminCaseStudyUploadPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Upload Case Study</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create case studies in MongoDB via your backend API.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-indigo-300 hover:text-indigo-200">
          Back to admin
        </Link>
      </div>

      <CaseStudyUploader />
    </div>
  );
}

