import { NextResponse } from "next/server";

import { analyzeCode } from "@/lib/ai/analyze-code";
import { isGeminiError } from "@/lib/ai/errors";
import type {
  AnalyzeErrorResponse,
  AnalyzeHealthResponse,
} from "@/lib/ai/types";
import {
  isGeminiConfigured,
  validateAnalyzeRequest,
} from "@/lib/ai/validate-request";

function geminiErrorStatus(code: string): number {
  switch (code) {
    case "missing-key":
      return 503;
    case "quota-exceeded":
      return 429;
    case "network-error":
      return 502;
    default:
      return 500;
  }
}

export async function GET() {
  const health: AnalyzeHealthResponse = {
    status: "ok",
    service: "analyze",
    geminiConfigured: isGeminiConfigured(),
  };

  return NextResponse.json(health);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const errorResponse: AnalyzeErrorResponse = {
      error: "Request body must be valid JSON.",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const validation = validateAnalyzeRequest(body);

  if (!validation.success) {
    const errorResponse: AnalyzeErrorResponse = {
      error: validation.error,
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  if (!isGeminiConfigured()) {
    const errorResponse: AnalyzeErrorResponse = {
      error: "Gemini API key is not configured on the server.",
    };
    return NextResponse.json(errorResponse, { status: 503 });
  }

  try {
    const analysis = await analyzeCode(validation.data);
    return NextResponse.json(analysis);
  } catch (error) {
    if (isGeminiError(error)) {
      const errorResponse: AnalyzeErrorResponse = {
        error: error.message,
      };
      return NextResponse.json(errorResponse, {
        status: geminiErrorStatus(error.code),
      });
    }

    const errorResponse: AnalyzeErrorResponse = {
      error: "Something went wrong while analyzing the code.",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
