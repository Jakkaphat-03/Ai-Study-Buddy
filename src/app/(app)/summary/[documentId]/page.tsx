import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { SummaryForm } from "@/features/summary/components/summary-form";

type PageProps = {
  params: Promise<{
    documentId: string;
  }>;
};

export default async function SummaryPage({
  params,
}: PageProps) {
  const { documentId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: document } = await supabase
    .from("documents")
    .select("id, file_name, user_id")
    .eq("id", documentId)
    .single();

  if (!document) {
    notFound();
  }

  if (document.user_id !== user.id) {
    notFound();
  }

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
            {document.file_name}
          </h1>

          <p className="mt-2 text-slate-400">
            Generate an AI summary from your uploaded study material.
          </p>
        </div>
      </div>

      <SummaryForm
        documentId={document.id}
      />
    </div>
  );
}