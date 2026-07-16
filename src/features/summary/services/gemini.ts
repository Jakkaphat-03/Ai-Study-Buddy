import { GoogleGenAI } from "@google/genai";

console.log(
  "Gemini Key:",
  process.env.GEMINI_API_KEY?.substring(0, 12),
);

export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});