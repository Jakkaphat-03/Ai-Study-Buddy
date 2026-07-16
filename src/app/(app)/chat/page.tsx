import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ChatWindow } from "@/features/chat/components/chat-window";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch documents that have at least one summary
  const { data: rows } = await supabase
    .from("summaries")
    .select(
      `
      document_id,
      documents(id, file_name, user_id)
    `,
    )
    .order("created_at", { ascending: false });

  // Deduplicate by document_id + filter by ownership
  const seen = new Set<string>();
  const documents = (rows ?? [])
    .filter((row) => {
      const doc = row.documents as unknown as {
        id: string;
        file_name: string;
        user_id: string;
      } | null;

      if (!doc || doc.user_id !== user!.id) return false;
      if (seen.has(doc.id)) return false;

      seen.add(doc.id);
      return true;
    })
    .map((row) => {
      const doc = row.documents as unknown as {
        id: string;
        file_name: string;
      };
      return { id: doc.id, file_name: doc.file_name };
    });

  const hasDocuments = documents.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-cyan-300">AI Study Chat</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Chat
        </h1>

        <p className="mt-2 text-slate-400">
          Ask questions about your study materials and get instant AI-powered answers.
        </p>
      </section>

      {hasDocuments ? (
        <Card>
          <CardHeader>
            <CardTitle>Study Assistant</CardTitle>

            <CardDescription>
              Select a document and start asking questions. The AI will answer based on your generated summary.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ChatWindow documents={documents} />
          </CardContent>
        </Card>
      ) : (
        // Empty state — no documents with summaries
        <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
          <MessageCircle className="mx-auto size-12 text-slate-500" />

          <p className="mt-4 text-lg font-medium text-slate-300">
            No summaries available
          </p>

          <p className="mt-2 text-sm text-slate-500">
            You need to generate at least one AI summary before using the chat.
          </p>

          <Link href="/documents" className="mt-6 inline-block">
            <Button>Go to Documents</Button>
          </Link>
        </div>
      )}
    </div>
  );
}