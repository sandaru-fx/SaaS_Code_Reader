import { enhanceMermaidWithStyles } from "@/lib/mermaid/enhance-mermaid-styles";
import { repairMermaid } from "@/lib/mermaid/repair-mermaid";
import { sanitizeMermaid } from "@/lib/mermaid/sanitize-mermaid";

export function prepareMermaidForRender(raw: string): string {
  const repaired = repairMermaid(sanitizeMermaid(raw));
  return enhanceMermaidWithStyles(repaired);
}
