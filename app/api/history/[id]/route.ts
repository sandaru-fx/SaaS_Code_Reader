import { NextResponse } from "next/server";

import { getAnalysisById } from "@/lib/supabase/analyses";
import {
  getAnalysisOwner,
  hasAnalysisOwner,
} from "@/lib/supabase/owner";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "History is not available right now." },
      { status: 503 }
    );
  }

  const owner = await getAnalysisOwner(request);

  if (!hasAnalysisOwner(owner)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const analysis = await getAnalysisById(id, {
    userId: owner.userId,
    sessionId: owner.sessionId,
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: analysis.id,
    fileName: analysis.file_name,
    language: analysis.language,
    code: analysis.code,
    explanation: analysis.explanation,
    mermaid: analysis.mermaid,
    createdAt: analysis.created_at,
  });
}
