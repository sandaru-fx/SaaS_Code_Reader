import { GeminiError } from "@/lib/ai/errors";
import { getGeminiModel } from "@/lib/ai/gemini";
import type { AnalyzeRequestBody } from "@/lib/ai/types";

function buildBasicAnalysisPrompt({
  code,
  language,
  fileName,
}: AnalyzeRequestBody): string {
  const fileLabel = fileName ? `File: ${fileName}\n` : "";

  return `${fileLabel}Language: ${language}

Analyze the following code. Explain what it does, its main logic flow, and any important architecture notes in clear Markdown.

Code:
\`\`\`${language}
${code}
\`\`\``;
}

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

export async function analyzeCode(request: AnalyzeRequestBody): Promise<string> {
  try {
    const model = getGeminiModel();
    const prompt = buildBasicAnalysisPrompt(request);
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    if (!text) {
      throw new GeminiError(
        "generation-failed",
        "Gemini returned an empty analysis response."
      );
    }

    return text;
  } catch (error) {
    throw mapGeminiFailure(error);
  }
}
