import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  AnalysisHistoryItem,
  SaveAnalysisInput,
  SavedAnalysis,
} from "@/lib/supabase/types";
import { toHistoryItem } from "@/lib/supabase/types";

const HISTORY_LIMIT = 50;

export async function saveAnalysis(
  input: SaveAnalysisInput
): Promise<SavedAnalysis | null> {
  if (!input.userId && !input.sessionId) {
    return null;
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("analyses")
    .insert({
      user_id: input.userId ?? null,
      session_id: input.sessionId ?? null,
      file_name: input.fileName ?? null,
      language: input.language,
      code: input.code,
      explanation: input.explanation,
      mermaid: input.mermaid,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Failed to save analysis:", error?.message);
    return null;
  }

  return data as SavedAnalysis;
}

export async function listAnalyses(options: {
  userId?: string | null;
  sessionId?: string | null;
}): Promise<AnalysisHistoryItem[]> {
  if (!options.userId && !options.sessionId) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("analyses")
    .select("id, file_name, language, explanation, mermaid, created_at")
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT);

  if (options.userId) {
    query = query.eq("user_id", options.userId);
  } else if (options.sessionId) {
    query = query.eq("session_id", options.sessionId);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Failed to list analyses:", error?.message);
    return [];
  }

  return data.map((row) =>
    toHistoryItem({
      id: row.id,
      user_id: null,
      session_id: null,
      file_name: row.file_name,
      language: row.language,
      code: "",
      explanation: row.explanation,
      mermaid: row.mermaid ?? "",
      created_at: row.created_at,
    })
  );
}

export async function getAnalysisById(
  id: string,
  options: { userId?: string | null; sessionId?: string | null }
): Promise<SavedAnalysis | null> {
  if (!options.userId && !options.sessionId) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  let query = supabase.from("analyses").select("*").eq("id", id);

  if (options.userId) {
    query = query.eq("user_id", options.userId);
  } else if (options.sessionId) {
    query = query.eq("session_id", options.sessionId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as SavedAnalysis;
}

export async function deleteAnalysisById(
  id: string,
  options: { userId?: string | null; sessionId?: string | null }
): Promise<boolean> {
  if (!options.userId && !options.sessionId) {
    return false;
  }

  const supabase = getSupabaseAdmin();
  let query = supabase.from("analyses").delete().eq("id", id);

  if (options.userId) {
    query = query.eq("user_id", options.userId);
  } else if (options.sessionId) {
    query = query.eq("session_id", options.sessionId);
  }

  const { error } = await query;

  return !error;
}
