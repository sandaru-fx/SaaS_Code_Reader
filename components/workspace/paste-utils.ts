import {
  PASTE_LANGUAGE_OPTIONS,
  type PasteLanguage,
} from "@/components/workspace/types";

export function getPasteSnippetFileName(language: string): string {
  const normalized = PASTE_LANGUAGE_OPTIONS.includes(language as PasteLanguage)
    ? language
    : "javascript";

  const extensionMap: Record<string, string> = {
    typescript: "ts",
    javascript: "js",
    python: "py",
    markdown: "md",
    bash: "sh",
  };

  const extension = extensionMap[normalized] ?? normalized;
  return `snippet.${extension}`;
}
