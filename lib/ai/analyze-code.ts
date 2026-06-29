import { GeminiError } from "@/lib/ai/errors";
import { getGeminiModel, GEMINI_MODEL_PRO } from "@/lib/ai/gemini";
import { parseAnalyzeResponse } from "@/lib/ai/parse-response";
import {
  ANALYZE_SYSTEM_PROMPT,
  buildAnalyzeUserPrompt,
} from "@/lib/ai/prompts";
import type { AnalyzeRequestBody, AnalyzeResponseBody } from "@/lib/ai/types";
import { validateDiagramShape } from "@/lib/mermaid/validate-diagram";

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
    message.includes("not found") ||
    message.includes("404") ||
    message.includes("is not supported for generatecontent")
  ) {
    return new GeminiError(
      "generation-failed",
      "The configured AI model is unavailable. Please try again later."
    );
  }

  if (
    message.includes("econnreset") ||
    message.includes("enotfound") ||
    message.includes("etimedout") ||
    message.includes("network request failed")
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
  const model = getGeminiModel({
    systemInstruction: ANALYZE_SYSTEM_PROMPT,
    model: GEMINI_MODEL_PRO,
    generationConfig: {
      temperature: strict ? 0.15 : 0.35,
      topP: 0.9,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });
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

async function analyzeWithValidation(
  request: AnalyzeRequestBody,
  strict: boolean
): Promise<AnalyzeResponseBody> {
  const response = await requestStructuredAnalysis(request, strict);
  const validation = validateDiagramShape(response.mermaid);

  if (!validation.ok) {
    throw new GeminiError(
      "generation-failed",
      `Diagram failed quality check: ${validation.reason}`
    );
  }

  return response;
}

export async function analyzeCode(
  request: AnalyzeRequestBody
): Promise<AnalyzeResponseBody> {
  try {
    try {
      return await analyzeWithValidation(request, false);
    } catch (firstError) {
      if (
        firstError instanceof GeminiError &&
        firstError.code !== "generation-failed"
      ) {
        throw firstError;
      }

      try {
        return await analyzeWithValidation(request, true);
      } catch (secondError) {
        if (
          secondError instanceof GeminiError &&
          secondError.code !== "generation-failed"
        ) {
          throw secondError;
        }

        return await requestStructuredAnalysis(request, true);
      }
    }
  } catch (error) {
    throw mapGeminiFailure(error);
  }
}
