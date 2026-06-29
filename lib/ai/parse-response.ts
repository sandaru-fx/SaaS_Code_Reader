import { GeminiError } from "@/lib/ai/errors";
import { prepareMermaidForRender } from "@/lib/mermaid/prepare-diagram";
import type { AnalyzeResponseBody } from "@/lib/ai/types";

function stripOuterCodeFence(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:json|mermaid)?\s*([\s\S]*?)\s*```$/i);

  if (fenceMatch) {
    return fenceMatch[1].trim();
  }

  return trimmed;
}

function stripMermaidFence(value: string): string {
  return stripOuterCodeFence(value).replace(/^mermaid\s*/i, "").trim();
}

function extractJsonObject(raw: string): string {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new GeminiError(
      "generation-failed",
      "Gemini response did not contain a JSON object."
    );
  }

  return raw.slice(start, end + 1);
}

function isValidAnalyzeResponse(value: unknown): value is AnalyzeResponseBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.explanation === "string" &&
    record.explanation.trim().length > 0 &&
    typeof record.mermaid === "string" &&
    record.mermaid.trim().length > 0
  );
}

export function parseAnalyzeResponse(raw: string): AnalyzeResponseBody {
  const cleaned = stripOuterCodeFence(raw.trim());

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    try {
      parsed = JSON.parse(extractJsonObject(cleaned));
    } catch (error) {
      throw new GeminiError(
        "generation-failed",
        "Gemini returned malformed JSON.",
        { cause: error }
      );
    }
  }

  if (!isValidAnalyzeResponse(parsed)) {
    throw new GeminiError(
      "generation-failed",
      'Gemini JSON must include non-empty "explanation" and "mermaid" fields.'
    );
  }

  return {
    explanation: parsed.explanation.trim(),
    mermaid: prepareMermaidForRender(stripMermaidFence(parsed.mermaid)),
  };
}
