import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { analyzeProject } from "@/lib/ai/analyze-project";
import { isClerkConfigured } from "@/lib/clerk/is-configured";
import { isGeminiError } from "@/lib/ai/errors";
import type { AnalyzeErrorResponse } from "@/lib/ai/types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceUsageLimit, recordUsage } from "@/lib/usage";
import type { AnalyzeProjectRequestBody } from "@/lib/ai/project-types";

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

export async function POST(request: Request) {
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

  let userId: string | null = null;

  if (isClerkConfigured()) {
    const authState = await auth();
    userId = authState.userId;

    if (!userId) {
      const errorResponse: AnalyzeErrorResponse = {
        error: "Please sign in to analyze projects.",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const usageBlock = await enforceUsageLimit(userId, "analyze_project");
    if (usageBlock) {
      return usageBlock;
    }
  }

  let body: AnalyzeProjectRequestBody;

  try {
    body = await request.json();
  } catch {
    const errorResponse: AnalyzeErrorResponse = {
      error: "Request body must be valid JSON.",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  if (!body.projectName || !body.treeStructure) {
    const errorResponse: AnalyzeErrorResponse = {
      error: "projectName and treeStructure are required.",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    const analysis = await analyzeProject(body);

    if (userId) {
      await recordUsage(userId, "analyze_project");
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
      error: "AI analysis is temporarily unavailable. Please try again in a moment.",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
