import { NextResponse } from "next/server";

import { aiError } from "@/lib/api-error";
import { rateLimitResponse } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { chatRequestSchema } from "@/features/chat/schemas/chat-schema";
import { generateChatResponse } from "@/features/chat/services/generate-chat";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimitResponse("chat", user.id);

  if (limited) return limited;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { documentId, question, messages } = parsed.data;

  try {
    // Ownership is enforced through the parent document, on top of RLS.
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .select("id, content, document_id, documents!inner(user_id)")
      .eq("document_id", documentId)
      .eq("documents.user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (summaryError || !summary) {
      return NextResponse.json(
        {
          error:
            "No summary found for this document. Please generate a summary first.",
        },
        { status: 404 },
      );
    }

    const answer = await generateChatResponse(
      summary.content,
      messages,
      question,
    );

    return NextResponse.json({ success: true, answer });
  } catch (error) {
    return aiError("chat", error);
  }
}
