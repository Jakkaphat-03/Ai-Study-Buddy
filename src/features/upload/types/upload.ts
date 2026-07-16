export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
] as const;

export const ACCEPTED_EXTENSIONS = [
  "pdf",
  "docx",
  "pptx",
] as const;

export type SupportedMimeType =
  (typeof ACCEPTED_FILE_TYPES)[number];

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export interface UploadFile {
  file: File;
  name: string;
  size: number;
  type: string;
}