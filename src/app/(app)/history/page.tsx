import { redirect } from "next/navigation";
import { History } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { HistoryTabs } from "@/features/history/components/history-tabs";
import type {
  HistoryDocument,
  HistoryQuiz,
  HistorySummary,
} from "@/features/history/types/history";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ── Documents ──────────────────────────────────────────────────────────────
  const { data: documentRows } = await supabase
    .from("documents")
    .select(`
      id,
      file_name,
      file_type,
      file_size,
      created_at,
      summaries(count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const documents: HistoryDocument[] = (documentRows ?? []).map((doc) => ({
    id: doc.id,
    file_name: doc.file_name,
    file_type: doc.file_type,
    file_size: doc.file_size,
    created_at: doc.created_at,
    summary_count:
      (doc.summaries as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  // ── Summaries ──────────────────────────────────────────────────────────────
  const { data: summaryRows } = await supabase
    .from("summaries")
    .select(`
      id,
      summary_type,
      content,
      created_at,
      document_id,
      documents!inner(file_name)
    `)
    .eq("documents.user_id", user.id)
    .order("created_at", { ascending: false });

  const summaries: HistorySummary[] = (summaryRows ?? [])
    .map((row) => ({
      id: row.id,
      summary_type: row.summary_type,
      content: row.content,
      created_at: row.created_at,
      document_id: row.document_id,
      document_name: (row.documents as unknown as { file_name: string })
        .file_name,
    }));

  // ── Quizzes ────────────────────────────────────────────────────────────────
  const { data: quizRows } = await supabase
    .from("quizzes")
    .select(`
      id,
      difficulty,
      score,
      total,
      created_at,
      document_id,
      documents!inner(file_name)
    `)
    .eq("documents.user_id", user.id)
    .order("created_at", { ascending: false });

  const quizzes: HistoryQuiz[] = (quizRows ?? [])
    .map((row) => ({
      id: row.id,
      difficulty: row.difficulty,
      score: row.score,
      total: row.total,
      created_at: row.created_at,
      document_id: row.document_id,
      document_name: (row.documents as unknown as { file_name: string })
        .file_name,
    }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-cyan-300">Learning History</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          History
        </h1>

        <p className="mt-2 text-slate-400">
          Review all your uploaded documents, summaries, and quizzes.
        </p>
      </section>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Documents", value: documents.length, color: "text-emerald-400" },
          { label: "Summaries", value: summaries.length, color: "text-violet-400" },
          { label: "Quizzes", value: quizzes.length, color: "text-cyan-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5 text-cyan-400" />
            Activity
          </CardTitle>

          <CardDescription>
            Select a tab to browse your activity by type.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <HistoryTabs
            documents={documents}
            summaries={summaries}
            quizzes={quizzes}
          />
        </CardContent>
      </Card>
    </div>
  );
}