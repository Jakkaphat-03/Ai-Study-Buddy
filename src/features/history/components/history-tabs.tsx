"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, BrainCircuit, Search, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HistoryDocumentCard } from "@/features/history/components/history-document-card";
import { HistorySummaryCard } from "@/features/history/components/history-summary-card";
import { HistoryQuizCard } from "@/features/history/components/history-quiz-card";
import type {
  HistoryDocument,
  HistoryQuiz,
  HistorySummary,
} from "@/features/history/types/history";

type Tab = "documents" | "summaries" | "quizzes";

type Props = {
  documents: HistoryDocument[];
  summaries: HistorySummary[];
  quizzes: HistoryQuiz[];
};

const TABS: { key: Tab; label: string }[] = [
  { key: "documents", label: "Documents" },
  { key: "summaries", label: "Summaries" },
  { key: "quizzes", label: "Quizzes" },
];

export function HistoryTabs({ documents, summaries, quizzes }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("documents");
  const [search, setSearch] = useState("");

  // Reset search เมื่อเปลี่ยน tab
  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setSearch("");
  }

  // Filter ตาม search
  const filteredDocuments = documents.filter((d) =>
    d.file_name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredSummaries = summaries.filter((s) =>
    s.document_name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredQuizzes = quizzes.filter((q) =>
    q.document_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-slate-900/40 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-emerald-500/20 text-emerald-300"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by document name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
      </div>

      {/* Tab Content */}
      {activeTab === "documents" && (
        <TabContent isEmpty={filteredDocuments.length === 0} search={search}>
          {filteredDocuments.length > 0 && (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <HistoryDocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
          {filteredDocuments.length === 0 && !search && (
            <EmptyState
              icon={<Upload className="mx-auto size-10 text-slate-500" />}
              message="No documents uploaded yet"
              action={<Link href="/upload"><Button>Upload Document</Button></Link>}
            />
          )}
          {filteredDocuments.length === 0 && search && (
            <NoResults search={search} onClear={() => setSearch("")} />
          )}
        </TabContent>
      )}

      {activeTab === "summaries" && (
        <TabContent isEmpty={filteredSummaries.length === 0} search={search}>
          {filteredSummaries.length > 0 && (
            <div className="space-y-3">
              {filteredSummaries.map((summary) => (
                <HistorySummaryCard key={summary.id} summary={summary} />
              ))}
            </div>
          )}
          {filteredSummaries.length === 0 && !search && (
            <EmptyState
              icon={<BookOpen className="mx-auto size-10 text-slate-500" />}
              message="No summaries generated yet"
              action={<Link href="/documents"><Button>Go to Documents</Button></Link>}
            />
          )}
          {filteredSummaries.length === 0 && search && (
            <NoResults search={search} onClear={() => setSearch("")} />
          )}
        </TabContent>
      )}

      {activeTab === "quizzes" && (
        <TabContent isEmpty={filteredQuizzes.length === 0} search={search}>
          {filteredQuizzes.length > 0 && (
            <div className="space-y-3">
              {filteredQuizzes.map((quiz) => (
                <HistoryQuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          )}
          {filteredQuizzes.length === 0 && !search && (
            <EmptyState
              icon={<BrainCircuit className="mx-auto size-10 text-slate-500" />}
              message="No quizzes generated yet"
              action={<Link href="/quiz"><Button>Go to Quiz</Button></Link>}
            />
          )}
          {filteredQuizzes.length === 0 && search && (
            <NoResults search={search} onClear={() => setSearch("")} />
          )}
        </TabContent>
      )}
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function TabContent({
  children,
}: {
  isEmpty: boolean;
  search: string;
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

function EmptyState({
  icon,
  message,
  action,
}: {
  icon: React.ReactNode;
  message: string;
  action: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
      {icon}
      <p className="mt-4 text-slate-300">{message}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}

function NoResults({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
      <Search className="mx-auto size-10 text-slate-500" />
      <p className="mt-4 text-slate-300">
        No results matching &quot;{search}&quot;
      </p>
      <button
        onClick={onClear}
        className="mt-2 text-sm text-emerald-400 hover:underline"
      >
        Clear search
      </button>
    </div>
  );
}