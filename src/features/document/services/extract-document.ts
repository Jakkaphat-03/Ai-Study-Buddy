import { extractDocx } from "./extract-docx";
import { extractPdf } from "./extract-pdf";
import { extractPptx } from "./extract-pptx";

import type { SupportedMimeType } from "@/features/upload/types/upload";

export async function extractDocument(
  buffer: Buffer,
  mimeType: SupportedMimeType,
): Promise<string> {
  switch (mimeType) {
    case "application/pdf":
      return extractPdf(buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractDocx(buffer);

    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return extractPptx(buffer);

    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}