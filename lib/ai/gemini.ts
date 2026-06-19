import { GoogleGenerativeAI } from "@google/generative-ai";

import { GeminiError } from "@/lib/ai/errors";

export const GEMINI_MODEL = "gemini-1.5-flash";

type GeminiModelOptions = {
  systemInstruction?: string;
};

export function getGeminiModel(options?: GeminiModelOptions) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new GeminiError(
      "missing-key",
      "Gemini API key is not configured on the server."
    );
  }

  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: options?.systemInstruction,
  });
}
