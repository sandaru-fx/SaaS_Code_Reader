import { auth } from "@clerk/nextjs/server";

import { isClerkConfigured } from "@/lib/clerk/is-configured";

const SESSION_HEADER = "x-session-id";

export type AnalysisOwner = {
  userId: string | null;
  sessionId: string | null;
};

export async function getAnalysisOwner(
  request: Request
): Promise<AnalysisOwner> {
  if (isClerkConfigured()) {
    const { userId } = await auth();

    if (userId) {
      return { userId, sessionId: null };
    }
  }

  const sessionId = request.headers.get(SESSION_HEADER)?.trim() ?? null;

  return {
    userId: null,
    sessionId: sessionId || null,
  };
}

export function hasAnalysisOwner(owner: AnalysisOwner): boolean {
  return Boolean(owner.userId || owner.sessionId);
}
