import type { SupportedMimeType } from "@/features/upload/types/upload";

/**
 * The declared MIME type and the file extension both come from the client and
 * are trivially forged. Checking the leading bytes confirms the payload really
 * is the container we are about to hand to the extractor.
 */
const SIGNATURES: Record<SupportedMimeType, readonly number[][]> = {
  // "%PDF"
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
  // DOCX and PPTX are ZIP containers: "PK\x03\x04".
  // Empty and spanned archives use PK\x05\x06 and PK\x07\x08.
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    [0x50, 0x4b, 0x03, 0x04],
    [0x50, 0x4b, 0x05, 0x06],
    [0x50, 0x4b, 0x07, 0x08],
  ],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    [0x50, 0x4b, 0x03, 0x04],
    [0x50, 0x4b, 0x05, 0x06],
    [0x50, 0x4b, 0x07, 0x08],
  ],
};

export function hasValidSignature(
  buffer: Buffer,
  mimeType: SupportedMimeType,
): boolean {
  const candidates = SIGNATURES[mimeType];

  if (!candidates) return false;

  return candidates.some((signature) =>
    signature.every((byte, index) => buffer[index] === byte),
  );
}
