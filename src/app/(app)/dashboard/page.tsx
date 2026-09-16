import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, BookOpen, BrainCircuit, FileText } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("id,file_name,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const overviewCards = [
    {
      label: "Documents",
      value: documents?.length ?? 0,
      icon: FileText,
      tone: "text-emerald-200 bg-emerald-300/10",
    },
    {
      label: "Summary",
      value: "AI",
      icon: BookOpen,
      tone: "text-cyan-200 bg-cyan-300/10",
    },
    {
      label: "Quiz",
      value: "AI",
      icon: BrainCircuit,
      tone: "text-violet-200 bg-violet-300/10",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-200">AI Study Buddy</p>

          <h1 className="mt-2 text-3xl font-semibold text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-slate-400">
            Upload your learning materials and let AI help you study faster.
          </p>
        </div>

        <Link href="/upload">
          <Button>
            Upload Document
            <ArrowUpRight className="size-4" />
          </Button>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-slate-400">{label}</p>

                <p className="mt-3 text-3xl font-bold text-white">{value}</p>
              </div>

              <div className={`rounded-xl p-3 ${tone}`}>
                <Icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>

          <CardDescription>
            Your latest uploaded study materials.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/40 p-4"
                >
                  <div>
                    <p className="font-medium text-white">{doc.file_name}</p>

                    <p className="text-sm text-slate-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <Link href={`/summary/${doc.id}`}>
                    <Button size="sm">Summary</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
              <FileText className="mx-auto size-10 text-slate-500" />

              <p className="mt-4 text-slate-300">No documents uploaded yet</p>

              <Link href="/upload" className="mt-6 inline-block">
                <Button>Upload your first document</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
