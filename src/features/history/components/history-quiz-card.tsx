import { BrainCircuit } from "lucide-react";
import type { HistoryQuiz } from "@/features/history/types/history";

type Props = {
  quiz: HistoryQuiz;
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

function ScoreBadge({ score, total }: { score: number | null; total: number | null }) {
  if (score === null || total === null) {
    return <p className="text-xs text-slate-500">ยังไม่ได้ทำ</p>;
  }

  const pct = Math.round((score / total) * 100);
  const color =
    pct >= 80
      ? "text-emerald-400"
      : pct >= 50
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <p className={`text-sm font-semibold ${color}`}>
      {score} / {total}{" "}
      <span className="text-xs font-normal text-slate-400">({pct}%)</span>
    </p>
  );
}

export function HistoryQuizCard({ quiz }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-white/20 sm:flex-row sm:items-center sm:justify-between">
      {/* Quiz info */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-cyan-300/10 p-2 text-cyan-300">
          <BrainCircuit className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium text-white">
            {quiz.document_name}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            <span className={`capitalize ${DIFFICULTY_COLORS[quiz.difficulty] ?? "text-slate-400"}`}>
              {quiz.difficulty}
            </span>
            {" · "}
            {new Date(quiz.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>

          <div className="mt-1.5">
            <ScoreBadge score={quiz.score} total={quiz.total} />
          </div>
        </div>
      </div>
    </div>
  );
}