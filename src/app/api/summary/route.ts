import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateSummary } from "@/features/summary/services/generate-summary";
import type { SummaryType } from "@/features/summary/services/prompts";

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
    const summaryType = body.summaryType as SummaryType;

    if (!documentId || !summaryType) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const { data: document, error: documentError } = await supabase
      .from("documents")
      .select("id, user_id, extracted_text")
      .eq("id", documentId)
      .single();

    if (documentError || !document) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 },
      );
    }

    if (document.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (!document.extracted_text?.trim()) {
      return NextResponse.json(
        { error: "Document has no extracted text." },
        { status: 400 },
      );
    }

    const summary = await generateSummary(document.extracted_text, summaryType);

    const { data: savedSummary, error: insertError } = await supabase
      .from("summaries")
      .insert({
        document_id: document.id,
        summary_type: summaryType,
        content: summary,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      summary: savedSummary.content,
    });
  } catch (error) {
    console.error("========== SUMMARY ERROR ==========");
    console.error(error);
    console.error("===================================");

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
      {
        status: 500,
      },
    );
  }
}
