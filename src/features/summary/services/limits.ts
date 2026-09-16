/**
 * Upper bound on the document text handed to Gemini in a single request.
 * Roughly 250 pages of dense text. Anything longer is truncated so a single
 * upload cannot turn into an enormous (and expensive) prompt.
 */
export const MAX_PROMPT_CHARACTERS = 120_000;

export type TruncationResult = {
  text: string;
  truncated: boolean;
};

export function truncateForPrompt(
  text: string,
  limit: number = MAX_PROMPT_CHARACTERS,
): TruncationResult {
  if (text.length <= limit) {
    return { text, truncated: false };
  }

  return { text: text.slice(0, limit), truncated: true };
}
