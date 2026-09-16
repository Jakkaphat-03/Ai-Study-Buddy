import { z } from "zod";

import { SUMMARY_TYPES } from "@/features/summary/types/summary";

export const generateSummarySchema = z.object({
  documentId: z.string().uuid("Invalid document id."),
  summaryType: z.enum(SUMMARY_TYPES),
});
