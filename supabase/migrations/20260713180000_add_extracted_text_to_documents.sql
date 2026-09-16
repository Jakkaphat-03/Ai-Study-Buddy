-- Stores the plain text extracted from an uploaded PDF / DOCX / PPTX.
-- The extracted text is what gets sent to Gemini, so the original file never
-- has to be re-parsed or re-uploaded for summaries and quizzes.

alter table public.documents
  add column if not exists extracted_text text;

-- Byte size of the uploaded file, shown in the document library and history.
alter table public.documents
  add column if not exists file_size bigint;
