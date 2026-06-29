import { repairMermaid } from "@/lib/mermaid/repair-mermaid";
import { sanitizeMermaid } from "@/lib/mermaid/sanitize-mermaid";

export function prepareMermaidForRender(raw: string): string {
  return repairMermaid(sanitizeMermaid(raw));
}
