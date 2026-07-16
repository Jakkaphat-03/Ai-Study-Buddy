"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, FileText, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type SummaryItem = {
  id: string;
  document_id: string;
  summary_type: string;
  content: string;
  created_at: string;
  document_name: string;
};

type Props = {
  initialSummaries: SummaryItem[];
};

const SUMMARY_TYPE_LABELS: Record<string, string> = {
  short: "Short Summary",
  detailed: "Detailed Summary",
  bullet: "Bullet Summary",
  "key-concepts": "Key Concepts",
};

function formatSummaryType(type: string): string {
  return SUMMARY_TYPE_LABELS[type] ?? type;
}

export function SummaryList({ initialSummaries }: Props) {
  const [search, setSearch] = useState("");

  const filtered = initialSummaries.filter(
    (s) =>
      s.document_name.toLowerCase().includes(search.toLowerCase()) ||
      formatSummaryType(s.summary_type)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          placeholder="Search summaries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((summary) => (
            <div
              key={summary.id}
              className="rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-white/20"
            >
              {/* Header row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-cyan-300/10 p-2 text-cyan-200">
                    <BookOpen className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {formatSummaryType(summary.summary_type)}
                    </p>

                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <FileText className="size-3" />
                      <span className="truncate">{summary.document_name}</span>
                      <span>&middot;</span>
                      <span>
                        {new Date(summary.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href={`/summary/${summary.document_id}`} className="shrink-0">
                  <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                    View / Generate
                  </Button>
                </Link>
              </div>

              {/* Preview */}
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-400">
                {summary.content}
              </p>
            </div>
          ))}
        </div>
      ) : search ? (
        <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
          <Search className="mx-auto size-10 text-slate-500" />

          <p className="mt-4 text-slate-300">
            No summaries matching &quot;{search}&quot;
          </p>

          <button
            onClick={() => setSearch("")}
            className="mt-2 text-sm text-emerald-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
          <BookOpen className="mx-auto size-10 text-slate-500" />

          <p className="mt-4 text-slate-300">No summaries generated yet</p>

          <p className="mt-1 text-sm text-slate-500">
            Go to Documents and click Summary to get started.
          </p>

          <Link href="/documents" className="mt-6 inline-block">
            <Button>Go to Documents</Button>
          </Link>
        </div>
      )}
    </div>
  );
}