import { enhanceMermaidWithStyles } from "@/lib/mermaid/enhance-mermaid-styles";
import { repairMermaid } from "@/lib/mermaid/repair-mermaid";
import { sanitizeMermaid } from "@/lib/mermaid/sanitize-mermaid";

/**
 * Clean + repair raw Mermaid syntax from the AI. Does NOT add styling.
 * Use this before validation so the validator sees nodes the AI produced.
 */
export function cleanMermaidSource(raw: string): string {
  return repairMermaid(sanitizeMermaid(raw));
}

/**
 * Final prep before render: clean + repair + auto colors.
 */
export function prepareMermaidForRender(raw: string): string {
  return enhanceMermaidWithStyles(cleanMermaidSource(raw));
}
