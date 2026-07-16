"use client";

import { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
};

export function ChatInput({ value, onChange, onSubmit, isLoading, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isLoading && value.trim()) {
        onSubmit();
      }
    }
  }

  return (
    <div className="flex gap-3 items-end rounded-2xl border border-white/10 bg-slate-900/40 p-3">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Select a document to start chatting..." : "Type your question... (Enter to send, Shift+Enter for new line)"}
        disabled={disabled || isLoading}
        className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none max-h-40 leading-6 py-1"
      />

      <Button
        onClick={onSubmit}
        disabled={disabled || isLoading || !value.trim()}
        size="sm"
        className="shrink-0 gap-2"
      >
        <Send className="size-4" />
        <span className="hidden sm:inline">
          {isLoading ? "Sending..." : "Send"}
        </span>
      </Button>
    </div>
  );
}