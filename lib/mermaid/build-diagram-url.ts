import {
  MAX_MERMAID_INK_URL_LENGTH,
  MAX_MERMAID_SOURCE_CHARS,
  MERMAID_INK_IMG_BASE_URL,
  MERMAID_INK_SVG_BASE_URL,
} from "@/lib/mermaid/constants";
import { encodeMermaidForInk } from "@/lib/mermaid/encode-mermaid";
import { sanitizeMermaid } from "@/lib/mermaid/sanitize-mermaid";

export type DiagramFormat = "img" | "svg";

export type MermaidInkUrlResult =
  | { success: true; url: string; sanitized: string }
  | { success: false; error: string; sanitized: string };

function getBaseUrl(format: DiagramFormat): string {
  return format === "svg" ? MERMAID_INK_SVG_BASE_URL : MERMAID_INK_IMG_BASE_URL;
}

export function buildMermaidInkUrl(
  raw: string,
  format: DiagramFormat = "img"
): MermaidInkUrlResult {
  const sanitized = sanitizeMermaid(raw);

  if (sanitized.length === 0) {
    return {
      success: false,
      error: "Mermaid diagram text is empty.",
      sanitized,
    };
  }

  if (sanitized.length > MAX_MERMAID_SOURCE_CHARS) {
    return {
      success: false,
      error: `Mermaid diagram exceeds the maximum size of ${MAX_MERMAID_SOURCE_CHARS} characters.`,
      sanitized,
    };
  }

  const encoded = encodeMermaidForInk(sanitized);
  const url = `${getBaseUrl(format)}${encoded}`;

  if (url.length > MAX_MERMAID_INK_URL_LENGTH) {
    return {
      success: false,
      error: "Encoded Mermaid diagram URL is too long to render.",
      sanitized,
    };
  }

  return {
    success: true,
    url,
    sanitized,
  };
}
