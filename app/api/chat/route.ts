import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { sendChatMessage } from "@/lib/ai/chat";
import type { ChatErrorResponse, ChatHealthResponse } from "@/lib/ai/chat-types";
import { isClerkConfigured } from "@/lib/clerk/is-configured";
import { isGeminiError } from "@/lib/ai/errors";
import { isGeminiConfigured } from "@/lib/ai/validate-request";
import { validateChatRequest } from "@/lib/ai/validate-chat-request";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceUsageLimit, recordUsage } from "@/lib/usage";

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
  const health: ChatHealthResponse = {
    status: "ok",
    service: "chat",
    geminiConfigured: isGeminiConfigured(),
  };

  return NextResponse.json(health);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    const errorResponse: ChatErrorResponse = {
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
      const errorResponse: ChatErrorResponse = {
        error: "Please sign in to use AI chat.",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const usageBlock = await enforceUsageLimit(userId, "chat");
    if (usageBlock) {
      return usageBlock;
    }
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const errorResponse: ChatErrorResponse = {
      error: "Request body must be valid JSON.",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const validation = validateChatRequest(body);

  if (!validation.success) {
    const errorResponse: ChatErrorResponse = {
      error: validation.error,
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  if (!isGeminiConfigured()) {
    const errorResponse: ChatErrorResponse = {
      error: "Gemini API key is not configured on the server.",
    };
    return NextResponse.json(errorResponse, { status: 503 });
  }

  try {
    const response = await sendChatMessage(validation.data);

    if (userId) {
      await recordUsage(userId, "chat");
    }

    return NextResponse.json(response);
  } catch (error) {
    if (isGeminiError(error)) {
      const errorResponse: ChatErrorResponse = {
        error: error.message,
      };
      return NextResponse.json(errorResponse, {
        status: geminiErrorStatus(error.code),
      });
    }

    const errorResponse: ChatErrorResponse = {
      error: "AI chat is temporarily unavailable. Please try again in a moment.",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
