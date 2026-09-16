import { z } from "zod";

import {
  QUIZ_DIFFICULTIES,
  QUIZ_QUESTION_COUNTS,
  QUIZ_QUESTION_TYPES,
} from "@/features/quiz/types/quiz";

export const generateQuizSchema = z.object({
  summaryId: z.string().uuid("Invalid summary id."),
  difficulty: z.enum(QUIZ_DIFFICULTIES),
  questionType: z.enum(QUIZ_QUESTION_TYPES),
  // Restricted to the counts the UI offers so a crafted request cannot ask
  // Gemini for thousands of questions.
  questionCount: z
    .number()
    .int()
    .refine(
      (value) => (QUIZ_QUESTION_COUNTS as readonly number[]).includes(value),
      "Unsupported question count.",
    ),
});

export const saveQuizScoreSchema = z
  .object({
    quizId: z.string().uuid("Invalid quiz id."),
    score: z.number().int().min(0),
    total: z.number().int().min(1).max(100),
  })
  .refine((value) => value.score <= value.total, {
    message: "Score cannot exceed the number of questions.",
    path: ["score"],
  });
