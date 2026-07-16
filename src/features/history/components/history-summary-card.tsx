import Link from "next/link";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HistorySummary } from "@/features/history/types/history";

type Props = {
  summary: HistorySummary;
};

const SUMMARY_TYPE_LABELS: Record<string, string> = {
  short: "Short Summary",
  detailed: "Detailed Summary",
  bullet: "Bullet Summary",
  "key-concepts": "Key Concepts",
};

export function HistorySummaryCard({ summary }: Props) {
  const preview = summary.content.slice(0, 120).trim();
  const hasMore = summary.content.length > 120;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-white/20 sm:flex-row sm:items-center sm:justify-between">
      {/* Summary info */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-violet-300/10 p-2 text-violet-300">
          <FileText className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium text-white">
            {summary.document_name}
          </p>

          <p className="mt-0.5 text-xs text-violet-400">
            {SUMMARY_TYPE_LABELS[summary.summary_type] ?? summary.summary_type}
            {" · "}
            {new Date(summary.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>

          <p className="mt-1.5 text-xs leading-relaxed text-slate-400 line-clamp-2">
            {preview}
            {hasMore && "…"}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0">
        <Link href={`/summary/${summary.document_id}`}>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}