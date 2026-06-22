export type WorkspaceMode = "folder" | "paste" | "guide";

export interface ChatContextData {
  type: "code" | "explanation" | "general";
  content: string;
  file?: string;
}

export type SelectFileOptions = {
  autoAnalyze?: boolean;
  keepGuideMode?: boolean;
};

export const DEFAULT_PASTE_LANGUAGE = "javascript";

export const PASTE_LANGUAGE_OPTIONS = [
  "javascript",
  "typescript",
  "tsx",
  "jsx",
  "python",
  "go",
  "rust",
  "java",
  "ruby",
  "php",
  "html",
  "css",
  "json",
  "markdown",
  "bash",
] as const;

export type PasteLanguage = (typeof PASTE_LANGUAGE_OPTIONS)[number];
