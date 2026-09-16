import { z } from "zod";

export const MAX_QUESTION_LENGTH = 2000;
export const MAX_HISTORY_MESSAGES = 20;

export const chatRequestSchema = z.object({
  documentId: z.string().uuid("Invalid document id."),
  question: z
    .string()
    .trim()
    .min(1, "Question cannot be empty.")
    .max(MAX_QUESTION_LENGTH, "Question is too long."),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(MAX_QUESTION_LENGTH),
      }),
    )
    .max(MAX_HISTORY_MESSAGES)
    .default([]),
});
