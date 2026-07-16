"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Bot } from "lucide-react";

import { ChatDocumentSelector } from "./chat-document-selector";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import type { ChatDocument, ChatMessage as ChatMessageType } from "@/features/chat/types/chat";

const SUGGESTED_QUESTIONS = [
  "สรุปเนื้อหาให้หน่อย",
  "อธิบาย concept หลัก",
  "มีอะไรสำคัญบ้าง",
  "ยกตัวอย่างให้หน่อย",
];

type Props = {
  documents: ChatDocument[];
};

export function ChatWindow({ documents }: Props) {
  const [selectedDocumentId, setSelectedDocumentId] = useState(
    documents[0]?.id ?? "",
  );
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const bottomRef = useRef<HTMLDivElement>(null);
  const isDocumentSelected = !!selectedDocumentId;
  const hasMessages = messages.length > 0;

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  // Reset chat when document changes
  function handleDocumentChange(documentId: string) {
    setSelectedDocumentId(documentId);
    setMessages([]);
    setError("");
    setInput("");
  }

  function handleSend(question?: string) {
    const text = (question ?? input).trim();
    if (!text || !isDocumentSelected) return;

    const userMessage: ChatMessageType = { role: "user", content: text };

    setInput("");
    setError("");
    setMessages((prev) => [...prev, userMessage]);

    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: selectedDocumentId,
            messages, // history before this message
            question: text,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Failed to get response.");
        }

        const assistantMessage: ChatMessageType = {
          role: "assistant",
          content: result.answer,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        // Remove the optimistic user message on error
        setMessages((prev) => prev.slice(0, -1));
        setError(
          error instanceof Error ? error.message : "Unexpected error.",
        );
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Document selector */}
      <ChatDocumentSelector
        documents={documents}
        selectedId={selectedDocumentId}
        onChange={handleDocumentChange}
      />

      {/* Chat area */}
      <div className="h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-4">
        {!hasMessages && !isPending && (
          /* Welcome state */
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <Bot className="size-8 text-emerald-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-300">
                {isDocumentSelected
                  ? "Ready to help you study!"
                  : "Select a document to start"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {isDocumentSelected
                  ? "Ask anything about your study material below."
                  : "Choose a document from the selector above."}
              </p>
            </div>

            {/* Suggested questions */}
            {isDocumentSelected && (
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={isPending}
                    className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 hover:border-emerald-500/30 hover:text-emerald-300 transition text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {hasMessages && (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {/* Typing indicator */}
            {isPending && (
              <div className="flex gap-3 justify-start">
                <div className="shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2 h-fit">
                  <Bot className="size-4 text-emerald-400" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                    <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                    <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => handleSend()}
        isLoading={isPending}
        disabled={!isDocumentSelected}
      />
    </div>
  );
}