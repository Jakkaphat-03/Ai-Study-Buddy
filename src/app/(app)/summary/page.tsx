import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { SummaryList } from "@/features/summary/components/summary-list";

export default async function SummaryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: rows } = await supabase
    .from("summaries")
    .select(
      `
      id,
      document_id,
      summary_type,
      content,
      created_at,
      documents!inner(file_name)
    `,
    )
    .eq("documents.user_id", user.id)
    .order("created_at", { ascending: false });

  const summaries = (rows ?? [])
    .map((row) => ({
      id: row.id,
      document_id: row.document_id,
      summary_type: row.summary_type,
      content: row.content,
      created_at: row.created_at,
      document_name: (row.documents as unknown as { file_name: string })
        .file_name,
    }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-cyan-200">AI Summary</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            My Summaries
          </h1>

          <p className="mt-2 text-slate-400">
            {summaries.length > 0
              ? `${summaries.length} ${summaries.length === 1 ? "summary" : "summaries"} generated`
              : "Generate summaries from your uploaded documents."}
          </p>
        </div>

        <Link href="/documents">
          <Button>
            Go to Documents
            <ArrowUpRight className="size-4" />
          </Button>
        </Link>
      </section>

      {/* Summary list */}
      <Card>
        <CardHeader>
          <CardTitle>All Summaries</CardTitle>

          <CardDescription>
            AI-generated summaries from your study materials.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SummaryList initialSummaries={summaries} />
        </CardContent>
      </Card>
    </div>
  );
}