"use client";

import { FileText } from "lucide-react";
import type { ChatDocument } from "@/features/chat/types/chat";

type Props = {
  documents: ChatDocument[];
  selectedId: string;
  onChange: (documentId: string) => void;
};

export function ChatDocumentSelector({ documents, selectedId, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-slate-400 shrink-0">
        <FileText className="size-4 text-emerald-400" />
        <span>Document</span>
      </div>

      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
      >
        {documents.length === 0 && (
          <option value="">No documents available</option>
        )}
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.file_name}
          </option>
        ))}
      </select>

      {documents.length === 0 && (
        <p className="text-xs text-slate-500 shrink-0">
          Upload a document first
        </p>
      )}
    </div>
  );
}