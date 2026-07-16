import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { UploadForm } from "@/features/upload/components/upload-form";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-semibold text-white">
            Upload Study Material
          </h1>

          <p className="mt-2 text-slate-400">
            Upload a PDF, DOCX or PPTX file to generate AI summaries and quizzes.
          </p>
        </div>
      </div>

      <UploadForm />
    </div>
  );
}