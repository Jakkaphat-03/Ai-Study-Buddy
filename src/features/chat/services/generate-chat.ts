import { gemini } from "@/features/summary/services/gemini";
import type { ChatMessage } from "../types/chat";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const MAX_HISTORY_MESSAGES = 10;

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
      "The request could not be processed. Please try again.",
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
    "Something went wrong while generating the response. Please try again.",
  );
}

function buildContents(
  summaryContent: string,
  history: ChatMessage[],
  question: string,
) {
  // ตัด history เหลือแค่ 10 messages ล่าสุด
  const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);

  // System context เป็น user turn แรก + assistant acknowledge
  const systemTurn = [
    {
      role: "user" as const,
      parts: [
        {
          text: `You are a helpful study assistant. Answer questions based on the following study summary only. If the question is not related to the content, politely let the user know.\n\nStudy Summary:\n${summaryContent}`,
        },
      ],
    },
    {
      role: "model" as const,
      parts: [
        {
          text: "Understood! I'm ready to help you with questions about this study material. What would you like to know?",
        },
      ],
    },
  ];

  // แปลง history เป็น Gemini contents format
  const historyTurns = trimmedHistory.map((msg) => ({
    role: msg.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: msg.content }],
  }));

  // คำถามปัจจุบัน
  const currentTurn = {
    role: "user" as const,
    parts: [{ text: question }],
  };

  return [...systemTurn, ...historyTurns, currentTurn];
}

export async function generateChatResponse(
  summaryContent: string,
  history: ChatMessage[],
  question: string,
): Promise<string> {
  const contents = buildContents(summaryContent, history, question);

  console.log("Using model:", MODEL);
  console.log("History length:", history.length);

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await gemini.models.generateContent({
        model: MODEL,
        contents,
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