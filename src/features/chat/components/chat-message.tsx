"use client";

import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/features/chat/types/chat";

type Props = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: Props) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      {/* Avatar — assistant only (left side) */}
      {isAssistant && (
        <div className="shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2 h-fit">
          <Bot className="size-4 text-emerald-400" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-7 whitespace-pre-wrap ${
          isAssistant
            ? "bg-slate-900/60 border border-white/10 text-slate-200"
            : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-100"
        }`}
      >
        {message.content}
      </div>

      {/* Avatar — user only (right side) */}
      {!isAssistant && (
        <div className="shrink-0 rounded-xl bg-slate-800 border border-white/10 p-2 h-fit">
          <User className="size-4 text-slate-400" />
        </div>
      )}
    </div>
  );
}