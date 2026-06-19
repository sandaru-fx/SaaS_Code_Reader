import { MAX_ANALYZE_CODE_BYTES } from "@/lib/ai/constants";
import type { AnalyzeRequestBody } from "@/lib/ai/types";

type ValidationResult =
  | { success: true; data: AnalyzeRequestBody }
  | { success: false; error: string };

function getByteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

export function validateAnalyzeRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { success: false, error: "Request body must be a JSON object." };
  }

  const record = body as Record<string, unknown>;
  const code = record.code;
  const language = record.language;
  const fileName = record.fileName;

  if (typeof code !== "string") {
    return { success: false, error: "Field `code` must be a string." };
  }

  if (code.trim().length === 0) {
    return { success: false, error: "Field `code` cannot be empty." };
  }

  if (getByteLength(code) > MAX_ANALYZE_CODE_BYTES) {
    return {
      success: false,
      error: `Code exceeds the maximum size of ${MAX_ANALYZE_CODE_BYTES} bytes.`,
    };
  }

  if (typeof language !== "string" || language.trim().length === 0) {
    return {
      success: false,
      error: "Field `language` must be a non-empty string.",
    };
  }

  if (fileName !== undefined && typeof fileName !== "string") {
    return { success: false, error: "Field `fileName` must be a string." };
  }

  return {
    success: true,
    data: {
      code,
      language: language.trim(),
      fileName: typeof fileName === "string" ? fileName : undefined,
    },
  };
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}
