import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateChatResponse } from "@/features/chat/services/generate-chat";
import type { ChatMessage } from "@/features/chat/types/chat";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const documentId = body.documentId as string;
    const messages = body.messages as ChatMessage[];
    const question = body.question as string;

    if (!documentId || !question) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Fetch summary and verify ownership
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .select("id, content, document_id, documents(user_id)")
      .eq("document_id", documentId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (summaryError || !summary) {
      return NextResponse.json(
        { error: "No summary found for this document. Please generate a summary first." },
        { status: 404 },
      );
    }

    const documentOwner = (
      summary.documents as unknown as { user_id: string }
    )?.user_id;

    if (documentOwner !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Generate chat response
    const answer = await generateChatResponse(
      summary.content,
      messages ?? [],
      question,
    );

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("========== CHAT ERROR ==========");
    console.error(error);
    console.error("================================");

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}