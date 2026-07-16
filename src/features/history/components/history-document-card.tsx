import Link from "next/link";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HistoryDocument } from "@/features/history/types/history";

type Props = {
  document: HistoryDocument;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFileType(mimeType: string): string {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  };
  return map[mimeType] ?? mimeType;
}

export function HistoryDocumentCard({ document: doc }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-white/20 sm:flex-row sm:items-center sm:justify-between">
      {/* File info */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-emerald-300/10 p-2 text-emerald-200">
          <FileText className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium text-white">{doc.file_name}</p>

          <p className="mt-0.5 text-xs text-slate-500">
            {formatFileType(doc.file_type)} &middot;{" "}
            {formatFileSize(doc.file_size)} &middot;{" "}
            {new Date(doc.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>

          {doc.summary_count > 0 && (
            <p className="mt-1 text-xs text-emerald-400">
              {doc.summary_count}{" "}
              {doc.summary_count === 1 ? "summary" : "summaries"} generated
            </p>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0">
        <Link href={`/summary/${doc.id}`}>
          <Button size="sm">View Summary</Button>
        </Link>
      </div>
    </div>
  );
}