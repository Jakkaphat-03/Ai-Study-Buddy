import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "../types/upload";

export const uploadSchema = z.object({
  file: z
    .instanceof(File, {
      message: "Please select a file.",
    })
    .refine(
      (file) =>
        ACCEPTED_FILE_TYPES.includes(
          file.type as (typeof ACCEPTED_FILE_TYPES)[number],
        ),
      {
        message: "Only PDF, DOCX and PPTX files are supported.",
      },
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must not exceed 20 MB.",
    }),
});

export type UploadSchema = z.infer<typeof uploadSchema>;
