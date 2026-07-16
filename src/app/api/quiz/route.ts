import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateQuiz } from "@/features/quiz/services/generate-quiz";
import type {
  QuizDifficulty,
  QuizQuestionType,
} from "@/features/quiz/types/quiz";

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

    const summaryId = body.summaryId as string;
    const difficulty = body.difficulty as QuizDifficulty;
    const questionType = body.questionType as QuizQuestionType;
    const questionCount = Number(body.questionCount);

    if (!summaryId || !difficulty || !questionType || !questionCount) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Fetch summary and verify ownership via document
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .select("id, content, document_id, documents(user_id)")
      .eq("id", summaryId)
      .single();

    if (summaryError || !summary) {
      return NextResponse.json(
        { error: "Summary not found." },
        { status: 404 },
      );
    }

    const documentOwner = (
      summary.documents as unknown as { user_id: string }
    )?.user_id;

    if (documentOwner !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Generate quiz from summary content
    const quiz = await generateQuiz(
      summary.content,
      difficulty,
      questionType,
      questionCount,
    );

    // Save quiz to database
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
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      quiz: savedQuiz,
    });
  } catch (error) {
    console.error("========== QUIZ ERROR ==========");
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

// ← เพิ่มตรงนี้
export async function PATCH(request: Request) {
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
    const { quizId, score, total } = body as {
      quizId: string;
      score: number;
      total: number;
    };

    if (!quizId || score === undefined || total === undefined) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Verify ownership via document → quizzes RLS จะ block อยู่แล้ว
    // แต่ verify ซ้ำฝั่ง app layer เพื่อความปลอดภัย
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, document_id, documents(user_id)")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    const documentOwner = (
      quiz.documents as unknown as { user_id: string }
    )?.user_id;

    if (documentOwner !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Update score
    const { error: updateError } = await supabase
      .from("quizzes")
      .update({ score, total })
      .eq("id", quizId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("========== QUIZ PATCH ERROR ==========");
    console.error(error);
    console.error("======================================");

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}