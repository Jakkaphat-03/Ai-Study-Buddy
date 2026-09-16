// src/app/(app)/quiz/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { BrainCircuit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { QuizForm } from "@/features/quiz/components/quiz-form";

export default async function QuizPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all summaries belonging to this user (via documents)
  const { data: rows } = await supabase
    .from("summaries")
    .select(
      `
      id,
      summary_type,
      created_at,
      documents!inner(file_name)
    `,
    )
    .eq("documents.user_id", user.id)
    .order("created_at", { ascending: false });

  const summaries = (rows ?? [])
    .map((row) => ({
      id: row.id,
      summary_type: row.summary_type,
      created_at: row.created_at,
      document_name: (row.documents as unknown as { file_name: string })
        .file_name,
    }));

  const hasSummaries = summaries.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-violet-300">AI Quiz Generator</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Quiz
        </h1>

        <p className="mt-2 text-slate-400">
          Generate a quiz from your AI summaries to test your understanding.
        </p>
      </section>

      {hasSummaries ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Quiz</CardTitle>

            <CardDescription>
              Select a summary, choose your settings, and let AI create a quiz for you.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <QuizForm summaries={summaries} />
          </CardContent>
        </Card>
      ) : (
        // Empty state — no summaries yet
        <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
          <BrainCircuit className="mx-auto size-12 text-slate-500" />

          <p className="mt-4 text-lg font-medium text-slate-300">
            No summaries available
          </p>

          <p className="mt-2 text-sm text-slate-500">
            You need to generate at least one AI summary before creating a quiz.
          </p>

          <Link href="/documents" className="mt-6 inline-block">
            <Button>Go to Documents</Button>
          </Link>
        </div>
      )}
    </div>
  );
}