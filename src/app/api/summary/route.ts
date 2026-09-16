import { NextResponse } from "next/server";

import { aiError, serverError } from "@/lib/api-error";
import { rateLimitResponse } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { generateSummary } from "@/features/summary/services/generate-summary";
import { generateSummarySchema } from "@/features/summary/schemas/summary-schema";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimitResponse("summary", user.id);

  if (limited) return limited;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = generateSummarySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { documentId, summaryType } = parsed.data;

  try {
    const { data: document, error: documentError } = await supabase
      .from("documents")
      .select("id, user_id, extracted_text")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (documentError || !document) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 },
      );
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
      .select("content")
      .single();

    if (insertError) {
      return serverError("summary:insert", insertError);
    }

    return NextResponse.json({
      success: true,
      summary: savedSummary.content,
    });
  } catch (error) {
    return aiError("summary", error);
  }
}
