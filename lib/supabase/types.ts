export type SavedAnalysis = {
  id: string;
  user_id: string | null;
  session_id: string | null;
  file_name: string | null;
  language: string;
  code: string;
  explanation: string;
  mermaid: string;
  created_at: string;
};

export type AnalysisHistoryItem = {
  id: string;
  fileName: string | null;
  language: string;
  createdAt: string;
  preview: string;
  mermaid?: string;
};

export type SaveAnalysisInput = {
  userId?: string | null;
  sessionId?: string | null;
  fileName?: string;
  language: string;
  code: string;
  explanation: string;
  mermaid: string;
};

export function toHistoryItem(row: SavedAnalysis): AnalysisHistoryItem {
  const preview = row.explanation.trim().replace(/\s+/g, " ").slice(0, 120);

  return {
    id: row.id,
    fileName: row.file_name,
    language: row.language,
    createdAt: row.created_at,
    preview: preview.length < row.explanation.trim().length ? `${preview}...` : preview,
    mermaid: row.mermaid || undefined,
  };
}
