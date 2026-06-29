import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";

import { GeminiError } from "@/lib/ai/errors";

export const GEMINI_MODEL_FAST = "gemini-2.5-flash";
export const GEMINI_MODEL_PRO = "gemini-2.5-pro";

export const GEMINI_MODEL = GEMINI_MODEL_FAST;

type GeminiModelOptions = {
  systemInstruction?: string;
  model?: string;
  generationConfig?: GenerationConfig;
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
    model: options?.model ?? GEMINI_MODEL_FAST,
    systemInstruction: options?.systemInstruction,
    generationConfig: options?.generationConfig,
  });
}
