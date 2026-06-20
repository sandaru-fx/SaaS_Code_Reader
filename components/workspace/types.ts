export type WorkspaceMode = "folder" | "paste";

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
