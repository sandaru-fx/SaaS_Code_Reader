import { NextResponse } from "next/server";

import { deleteAnalysisById, listAnalyses } from "@/lib/supabase/analyses";
import {
  getAnalysisOwner,
  hasAnalysisOwner,
} from "@/lib/supabase/owner";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ items: [] });
  }

  const owner = await getAnalysisOwner(request);

  if (!hasAnalysisOwner(owner)) {
    return NextResponse.json({ items: [] });
  }

  const items = await listAnalyses({
    userId: owner.userId,
    sessionId: owner.sessionId,
  });

  return NextResponse.json({ items });
}

export async function DELETE(request: Request) {
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const id =
    typeof body === "object" && body !== null && "id" in body
      ? String((body as { id: unknown }).id)
      : "";

  if (!id) {
    return NextResponse.json({ error: "Analysis id is required." }, { status: 400 });
  }

  const deleted = await deleteAnalysisById(id, {
    userId: owner.userId,
    sessionId: owner.sessionId,
  });

  if (!deleted) {
    return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
