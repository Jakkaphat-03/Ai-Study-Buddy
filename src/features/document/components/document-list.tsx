"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Search, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DocumentDeleteButton } from "@/features/document/components/document-delete-button";
import type { DocumentSummary } from "@/features/document/types/document";

type Props = {
  initialDocuments: DocumentSummary[];
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFileType(mimeType: string): string {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
  };
  return map[mimeType] ?? mimeType;
}

export function DocumentList({ initialDocuments }: Props) {
  const [documents, setDocuments] =
    useState<DocumentSummary[]>(initialDocuments);
  const [search, setSearch] = useState("");

  const filtered = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleDeleted(id: string) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* File info */}
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-emerald-300/10 p-2 text-emerald-200">
                  <FileText className="size-4" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {doc.file_name}
                  </p>

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
                      {doc.summary_count === 1 ? "summary" : "summaries"}{" "}
                      generated
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                <DocumentDeleteButton
                  documentId={doc.id}
                  documentName={doc.file_name}
                  onDeleted={handleDeleted}
                />

                <Link href={`/summary/${doc.id}`}>
                  <Button size="sm">
                    Summary
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : search ? (
        // No search results
        <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
          <Search className="mx-auto size-10 text-slate-500" />

          <p className="mt-4 text-slate-300">
            No documents matching &quot;{search}&quot;
          </p>

          <button
            onClick={() => setSearch("")}
            className="mt-2 text-sm text-emerald-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        // Empty state
        <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
          <Upload className="mx-auto size-10 text-slate-500" />

          <p className="mt-4 text-slate-300">No documents uploaded yet</p>

          <Link href="/upload" className="mt-6 inline-block">
            <Button>Upload your first document</Button>
          </Link>
        </div>
      )}
    </div>
  );
}