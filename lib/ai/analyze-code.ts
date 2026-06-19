import { GeminiError } from "@/lib/ai/errors";
import { getGeminiModel } from "@/lib/ai/gemini";
import { parseAnalyzeResponse } from "@/lib/ai/parse-response";
import {
  ANALYZE_SYSTEM_PROMPT,
  buildAnalyzeUserPrompt,
} from "@/lib/ai/prompts";
import type { AnalyzeRequestBody, AnalyzeResponseBody } from "@/lib/ai/types";

function mapGeminiFailure(error: unknown): GeminiError {
  if (error instanceof GeminiError) {
    return error;
  }

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error);

  if (
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("429")
  ) {
    return new GeminiError(
      "quota-exceeded",
      "Gemini API quota exceeded. Please try again later."
    );
  }

  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("econnreset")
  ) {
    return new GeminiError(
      "network-error",
      "Unable to reach the Gemini API. Check your connection and try again."
    );
  }

  return new GeminiError(
    "generation-failed",
    "Gemini failed to analyze the selected code.",
    { cause: error }
  );
}

async function requestStructuredAnalysis(
  request: AnalyzeRequestBody,
  strict: boolean
): Promise<AnalyzeResponseBody> {
  const model = getGeminiModel({ systemInstruction: ANALYZE_SYSTEM_PROMPT });
  const prompt = buildAnalyzeUserPrompt(request, strict);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  if (!text) {
    throw new GeminiError(
      "generation-failed",
      "Gemini returned an empty analysis response."
    );
  }

  return parseAnalyzeResponse(text);
}

export async function analyzeCode(
  request: AnalyzeRequestBody
): Promise<AnalyzeResponseBody> {
  try {
    try {
      return await requestStructuredAnalysis(request, false);
    } catch (firstError) {
      if (
        firstError instanceof GeminiError &&
        firstError.code !== "generation-failed"
      ) {
        throw firstError;
      }

      return await requestStructuredAnalysis(request, true);
    }
  } catch (error) {
    throw mapGeminiFailure(error);
  }
}
