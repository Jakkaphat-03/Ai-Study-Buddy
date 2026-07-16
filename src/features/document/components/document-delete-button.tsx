"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  documentId: string;
  documentName: string;
  onDeleted: (id: string) => void;
};

export function DocumentDeleteButton({
  documentId,
  documentName,
  onDeleted,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/documents?id=${documentId}`,
          { method: "DELETE" },
        );

        if (!response.ok) {
          const result = await response.json();
          console.error("Delete failed:", result.error);
          return;
        }

        onDeleted(documentId);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-xs text-slate-400">Delete &quot;{documentName}&quot;?</p>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirming(false)}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
        >
          {isPending ? "Deleting..." : "Confirm"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setConfirming(true)}
      className="text-slate-500 hover:text-red-400"
      aria-label={`Delete ${documentName}`}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}