import { NextResponse } from "next/server";

import { aiError, serverError } from "@/lib/api-error";
import { rateLimitResponse } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { generateQuiz } from "@/features/quiz/services/generate-quiz";
import {
  generateQuizSchema,
  saveQuizScoreSchema,
} from "@/features/quiz/schemas/quiz-schema";

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// POST /api/quiz — generate a quiz from an existing summary
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimitResponse("quiz", user.id);

  if (limited) return limited;

  const body = await readJson(request);

  if (body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = generateQuizSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { summaryId, difficulty, questionType, questionCount } = parsed.data;

  try {
    // Ownership is enforced through the parent document, on top of RLS.
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .select("id, content, document_id, documents!inner(user_id)")
      .eq("id", summaryId)
      .eq("documents.user_id", user.id)
      .single();

    if (summaryError || !summary) {
      return NextResponse.json({ error: "Summary not found." }, { status: 404 });
    }

    const quiz = await generateQuiz(
      summary.content,
      difficulty,
      questionType,
      questionCount,
    );

    const { data: savedQuiz, error: insertError } = await supabase
      .from("quizzes")
      .insert({
        document_id: summary.document_id,
        difficulty,
        content: quiz,
      })
      .select()
      .single();

    if (insertError) {
      return serverError("quiz:insert", insertError);
    }

    return NextResponse.json({ success: true, quiz: savedQuiz });
  } catch (error) {
    return aiError("quiz", error);
  }
}

// PATCH /api/quiz — save the score for a completed quiz
export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimitResponse("quiz-score", user.id, {
    limit: 30,
    windowMs: 60_000,
  });

  if (limited) return limited;

  const body = await readJson(request);

  if (body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = saveQuizScoreSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { quizId, score, total } = parsed.data;

  try {
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, documents!inner(user_id)")
      .eq("id", quizId)
      .eq("documents.user_id", user.id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("quizzes")
      .update({ score, total })
      .eq("id", quizId);

    if (updateError) {
      return serverError("quiz:update-score", updateError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError("quiz:patch", error);
  }
}
