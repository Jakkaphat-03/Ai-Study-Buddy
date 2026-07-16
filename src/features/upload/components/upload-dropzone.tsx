"use client";

import { useEffect, useRef } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UploadFile } from "../types/upload";

type UploadDropzoneProps = {
  selectedFile: UploadFile | null;
  onFileSelect: (file: File) => void;
  onClear?: (clear: () => void) => void;
};

export function UploadDropzone({
  selectedFile,
  onFileSelect,
  onClear,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onClear) {
      onClear(clearFileInput);
    }
  }, [onClear]);

  function handleBrowse() {
    inputRef.current?.click();
  }

  function clearFileInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (!file) return;

    onFileSelect(file);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <Card className="p-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="rounded-2xl border-2 border-dashed border-white/10 bg-slate-950/30 p-10 text-center transition hover:border-emerald-400/40"
      >
        <UploadCloud className="mx-auto mb-4 size-12 text-emerald-300" />

        <h3 className="text-lg font-semibold text-white">
          Drag & Drop your file
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          PDF, DOCX and PPTX are supported.
        </p>

        <Button type="button" className="mt-6" onClick={handleBrowse}>
          Browse Files
        </Button>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf,.docx,.pptx"
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/40 p-4">
        {selectedFile ? (
          <div className="flex items-center gap-3">
            <FileText className="size-6 text-emerald-300" />

            <div>
              <p className="font-medium text-white">{selectedFile.name}</p>

              <p className="text-sm text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No file selected.</p>
        )}
      </div>
    </Card>
  );
}
