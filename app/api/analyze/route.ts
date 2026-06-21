import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { analyzeCode } from "@/lib/ai/analyze-code";
import { isClerkConfigured } from "@/lib/clerk/is-configured";
import { isGeminiError } from "@/lib/ai/errors";
import type {
  AnalyzeErrorResponse,
  AnalyzeHealthResponse,
} from "@/lib/ai/types";
import {
  isGeminiConfigured,
  validateAnalyzeRequest,
} from "@/lib/ai/validate-request";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { saveAnalysis } from "@/lib/supabase/analyses";
import { getAnalysisOwner } from "@/lib/supabase/owner";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

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
  // Rate limiting — applied before auth to block bots early
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    const errorResponse: AnalyzeErrorResponse = {
      error: `Too many requests. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
    };
    return NextResponse.json(errorResponse, {
      status: 429,
      headers: {
        "Retry-After": String(rateLimit.retryAfterSeconds),
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  if (isClerkConfigured()) {
    const { userId } = await auth();

    if (!userId) {
      const errorResponse: AnalyzeErrorResponse = {
        error: "Please sign in to analyze code.",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }
  }

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

    if (isSupabaseConfigured()) {
      const owner = await getAnalysisOwner(request);

      await saveAnalysis({
        userId: owner.userId,
        sessionId: owner.sessionId,
        fileName: validation.data.fileName,
        language: validation.data.language,
        code: validation.data.code,
        explanation: analysis.explanation,
        mermaid: analysis.mermaid,
      });
    }

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
      error:
        "AI analysis is temporarily unavailable. Please try again in a moment.",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
