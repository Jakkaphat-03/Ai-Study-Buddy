"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { uploadSchema } from "../schemas/upload-schema";
import { UploadDropzone } from "./upload-dropzone";
import type { UploadFile } from "../types/upload";
import { useRef } from "react";

export function UploadForm() {
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleFileSelect(file: File) {
    const result = uploadSchema.safeParse({
      file,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setError("");

    setSelectedFile({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) return;

    startTransition(async () => {
      setError("");
      setSuccess("");

      try {
        const formData = new FormData();

        formData.append("file", selectedFile.file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Upload failed.");
        }

        setSuccess("File uploaded successfully.");

        setSelectedFile(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unexpected error.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <UploadDropzone
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      {success && <p className="text-sm text-emerald-400">{success}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={!selectedFile || isPending}>
          {isPending ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </form>
  );
}
