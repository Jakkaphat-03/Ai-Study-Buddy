import { Logo } from "@/components/common/logo";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col gap-5 border-t border-white/10 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <Logo />
      <p>Built for focused, confident learning.</p>
    </footer>
  );
}
