import { gemini } from "./gemini";
import { SUMMARY_PROMPTS, type SummaryType } from "./prompts";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorStatus(error: unknown): number | undefined {
  return (error as { status?: number })?.status;
}

function isRetryableError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 503 || status === 429;
}

function toUserFriendlyError(error: unknown): Error {
  const status = getErrorStatus(error);

  if (status === 429) {
    return new Error(
      "The AI service is currently busy. Please wait a moment and try again.",
    );
  }

  if (status === 503) {
    return new Error(
      "The AI service is temporarily unavailable. Please try again in a few minutes.",
    );
  }

  if (status === 400) {
    return new Error(
      "The document content could not be processed. Please try a different document.",
    );
  }

  if (status === 403) {
    return new Error(
      "Access to the AI service was denied. Please contact the administrator.",
    );
  }

  if (status === 500) {
    return new Error(
      "The AI service encountered an error. Please try again later.",
    );
  }

  // Network / unknown errors
  const message = (error as { message?: string })?.message ?? "";

  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("ECONNREFUSED")
  ) {
    return new Error(
      "Could not connect to the AI service. Please check your internet connection and try again.",
    );
  }

  return new Error(
    "Something went wrong while generating the summary. Please try again.",
  );
}

export async function generateSummary(
  extractedText: string,
  type: SummaryType,
): Promise<string> {
  const prompt = `
${SUMMARY_PROMPTS[type]}

Document:

${extractedText}
`;

  console.log("Using model:", MODEL);
  console.log("Prompt length:", prompt.length);

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await gemini.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      return response.text ?? "";
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === MAX_RETRIES) {
        throw toUserFriendlyError(error);
      }

      const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
      console.log(
        `Gemini request failed (attempt ${attempt}/${MAX_RETRIES}), retrying in ${delay}ms...`,
      );
      await sleep(delay);
    }
  }

  throw toUserFriendlyError(lastError);
}