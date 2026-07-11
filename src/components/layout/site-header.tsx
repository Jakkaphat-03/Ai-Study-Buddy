import Link from "next/link";
import { Logo } from "@/components/common/logo";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
      <Logo />
      <Link href="/register" className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200">
        Get started
      </Link>
    </header>
  );
}
