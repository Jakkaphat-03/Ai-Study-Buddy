"use client";

import { useState, useTransition } from "react";
import { BrainCircuit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuizResult } from "@/features/quiz/components/quiz-result";
import type {
  Quiz,
  QuizDifficulty,
  QuizQuestionType,
} from "@/features/quiz/types/quiz";

type SummaryOption = {
  id: string;
  summary_type: string;
  document_name: string;
  created_at: string;
};

type Props = {
  summaries: SummaryOption[];
};

const SUMMARY_TYPE_LABELS: Record<string, string> = {
  short: "Short Summary",
  detailed: "Detailed Summary",
  bullet: "Bullet Summary",
  "key-concepts": "Key Concepts",
};

export function QuizForm({ summaries }: Props) {
  const [summaryId, setSummaryId] = useState(summaries[0]?.id ?? "");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");
  const [questionType, setQuestionType] =
    useState<QuizQuestionType>("multiple-choice");
  const [questionCount, setQuestionCount] = useState(10);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      setError("");
      setQuiz(null);
      setQuizId(null);

      try {
        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            summaryId,
            difficulty,
            questionType,
            questionCount,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Failed to generate quiz.");
        }

        setQuiz(result.quiz.content as Quiz);
        setQuizId(result.quiz.id);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unexpected error.");
      }
    });
  }

  function handleRetry() {
    setQuiz(null);
    setQuizId(null);
    setError("");
  }

  if (quiz && quizId) {
    return <QuizResult quiz={quiz} quizId={quizId} onRetry={handleRetry} />;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-5">
      {/* Summary selector */}
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Generate from Summary
        </label>

        <select
          value={summaryId}
          onChange={(e) => setSummaryId(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
        >
          {summaries.map((s) => (
            <option key={s.id} value={s.id}>
              {s.document_name} —{" "}
              {SUMMARY_TYPE_LABELS[s.summary_type] ?? s.summary_type}
            </option>
          ))}
        </select>
      </div>

      {/* Question type */}
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Question Type
        </label>

        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as QuizQuestionType)}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True / False</option>
          <option value="short-answer">Short Answer</option>
        </select>
      </div>

      {/* Difficulty */}
      <div>
        <label className="mb-2 block text-sm text-slate-400">Difficulty</label>

        <div className="grid grid-cols-3 gap-2">
          {(["easy", "medium", "hard"] as QuizDifficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`rounded-xl border py-2.5 text-sm font-medium capitalize transition ${
                difficulty === level
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 bg-slate-950/40 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Question count */}
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Number of Questions
        </label>

        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 20].map((count) => (
            <button
              key={count}
              onClick={() => setQuestionCount(count)}
              className={`rounded-xl border py-2.5 text-sm font-medium transition ${
                questionCount === count
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 bg-slate-950/40 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <Button
        className="w-full gap-2"
        onClick={handleGenerate}
        disabled={isPending || !summaryId}
      >
        <BrainCircuit className="size-4" />
        {isPending ? "Generating Quiz..." : "Generate Quiz"}
      </Button>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}