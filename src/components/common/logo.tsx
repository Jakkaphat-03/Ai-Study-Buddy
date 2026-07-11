import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="AI Study Buddy home">
      <span className="grid size-9 place-items-center rounded-xl bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span>AI Study Buddy</span>
    </a>
  );
}
