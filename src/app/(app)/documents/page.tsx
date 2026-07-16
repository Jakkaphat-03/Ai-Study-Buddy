import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { DocumentList } from "@/features/document/components/document-list";
import type { DocumentSummary } from "@/features/document/types/document";

export default async function DocumentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("documents")
    .select(
      `
      id,
      file_name,
      file_type,
      file_size,
      created_at,
      summaries(count)
    `,
    )
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const documents: DocumentSummary[] = (rows ?? []).map((doc) => ({
    id: doc.id,
    file_name: doc.file_name,
    file_type: doc.file_type,
    file_size: doc.file_size,
    created_at: doc.created_at,
    summary_count:
      (doc.summaries as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-200">
            Document Library
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            My Documents
          </h1>

          <p className="mt-2 text-slate-400">
            {documents.length > 0
              ? `${documents.length} ${documents.length === 1 ? "document" : "documents"} uploaded`
              : "Upload your study materials to get started."}
          </p>
        </div>

        <Link href="/upload">
          <Button>
            Upload Document
            <ArrowUpRight className="size-4" />
          </Button>
        </Link>
      </section>

      {/* Document list */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>

          <CardDescription>
            Your uploaded study materials. Click Summary to generate AI summaries.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DocumentList initialDocuments={documents} />
        </CardContent>
      </Card>
    </div>
  );
}