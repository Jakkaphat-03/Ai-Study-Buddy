// src/features/summary/components/summary-form.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { BookOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type SummaryItem = {
  id: string;
  summary_type: string;
  content: string;
  created_at: string;
};

const SUMMARY_TYPE_LABELS: Record<string, string> = {
  short: "Short Summary",
  detailed: "Detailed Summary",
  bullet: "Bullet Summary",
  "key-concepts": "Key Concepts",
};

type Props = {
  documentId: string;
};

export function SummaryForm({ documentId }: Props) {
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summaryType, setSummaryType] = useState("short");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Load existing summaries on mount
  useEffect(() => {
    async function loadSummaries() {
      try {
        const supabase = createClient();

        const { data } = await supabase
          .from("summaries")
          .select("id, summary_type, content, created_at")
          .eq("document_id", documentId)
          .order("created_at", { ascending: false });

        setSummaries(data ?? []);
      } catch (error) {
        console.error("Failed to load summaries:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSummaries();
  }, [documentId]);

  function handleGenerate() {
    startTransition(async () => {
      setError("");

      try {
        const response = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, summaryType }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Failed to generate summary.");
        }

        // Prepend new summary to the list
        const newSummary: SummaryItem = {
          id: crypto.randomUUID(),
          summary_type: summaryType,
          content: result.summary,
          created_at: new Date().toISOString(),
        };

        setSummaries((prev) => [newSummary, ...prev]);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unexpected error.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Generate panel */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-sm font-medium text-slate-300">
          Generate New Summary
        </h2>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Summary Type
          </label>

          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="short">Short Summary</option>
            <option value="detailed">Detailed Summary</option>
            <option value="bullet">Bullet Summary</option>
            <option value="key-concepts">Key Concepts</option>
          </select>
        </div>

        <Button
          className="w-full gap-2"
          onClick={handleGenerate}
          disabled={isPending}
        >
          <Plus className="size-4" />
          {isPending ? "Generating..." : "Generate Summary"}
        </Button>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>

      {/* Existing summaries */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-slate-400">
          {isLoading
            ? "Loading summaries..."
            : summaries.length > 0
              ? `${summaries.length} ${summaries.length === 1 ? "summary" : "summaries"} generated`
              : "No summaries yet"}
        </h2>

        {!isLoading && summaries.length > 0 && (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className="rounded-xl border border-white/10 bg-slate-950/40 p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-cyan-300/10 p-1.5 text-cyan-200">
                    <BookOpen className="size-3.5" />
                  </div>

                  <span className="text-sm font-medium text-white">
                    {SUMMARY_TYPE_LABELS[summary.summary_type] ?? summary.summary_type}
                  </span>

                  <span className="ml-auto text-xs text-slate-500">
                    {new Date(summary.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className="whitespace-pre-wrap leading-7 text-slate-300 text-sm">
                  {summary.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}