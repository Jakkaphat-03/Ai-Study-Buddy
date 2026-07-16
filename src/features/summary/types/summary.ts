export const SUMMARY_TYPES = [
  "short",
  "detailed",
  "bullet",
  "key-concepts",
] as const;

export type SummaryType =
  (typeof SUMMARY_TYPES)[number];

export interface GenerateSummaryRequest {
  documentId: string;
  summaryType: SummaryType;
}

export interface GenerateSummaryResponse {
  summary: string;
}