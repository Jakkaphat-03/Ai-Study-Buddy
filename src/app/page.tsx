import { MotionReveal } from "@/components/common/motion-reveal";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import Link from "next/link";
import { ArrowRight, BrainCircuit, FileText, Layers3, MessageSquareText } from "lucide-react";

const features = [
  { icon: FileText, title: "Understand faster", description: "Turn dense study materials into clear, focused insights." },
  { icon: MessageSquareText, title: "Ask better questions", description: "Explore difficult ideas with a learning companion in context." },
  { icon: Layers3, title: "Study actively", description: "Revisit concepts through useful practice and recall tools." },
];

export default function HomePage() {
  return (
    <main id="top" className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_50%_-10%,rgba(16,185,129,0.22),transparent_48%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_26%)]" />
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pb-32 lg:pt-28">
        <MotionReveal>
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-4 py-2 text-sm text-emerald-200">
            <BrainCircuit className="size-4" aria-hidden="true" />
            Your study space, reimagined
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Study with <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">clarity</span>, not chaos.
          </h1>
        </MotionReveal>
        <MotionReveal delay={0.16}>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-300 sm:text-xl">
            AI Study Buddy is your calm workspace for transforming study materials into understanding that sticks.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.24}>
          <Link id="get-started" href="/register" className="mt-10 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3.5 font-semibold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950">
            Start learning smarter <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </MotionReveal>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <MotionReveal key={title} delay={0.1 + index * 0.08}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-left shadow-2xl shadow-black/10 backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-300/25">
                <span className="mb-5 grid size-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><Icon className="size-5" aria-hidden="true" /></span>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 leading-7 text-slate-400">{description}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
