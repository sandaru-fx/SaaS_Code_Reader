export const ANALYZE_SYSTEM_PROMPT = `You are CodeRider, an expert software architecture analyst.

Return ONLY valid JSON with exactly two keys:
1. "explanation" — Markdown explaining what the code does, logic flow, and runtime behavior.
2. "mermaid" — a colorful logic flowchart (NOT a flat component inventory).

Diagram intent:
- Show how the code RUNS: start → steps → decisions → outputs/errors.
- Do NOT list every class, SVG shape, HTML tag, or file part as separate sibling boxes.
- For markup or SVG files, diagram the build/render pipeline (parse → build → style → output), not every element name.
- Use a vertical top-to-bottom flow with at most one branching decision.
- Maximum 7 nodes. Prefer depth over width.

Mermaid rules (critical):
- Start with "flowchart TD" on line 1.
- Node IDs: alphanumeric only (A, B, step1).
- Labels: 2-4 words in square brackets, e.g. A[Load Config]
- Use one decision node with curly braces when helpful: C{Valid?}
- Use stadium start node when possible: A([Start])
- Arrows only: --> and -->|yes| or -->|no|
- No emojis, quotes, colons, code, or special symbols in labels.

JSON rules:
- Return ONLY raw JSON. No markdown fences. No extra text.`;

function getDiagramHint(language: string, fileName?: string): string {
  const lowerName = fileName?.toLowerCase() ?? "";
  const lowerLanguage = language.toLowerCase();

  if (lowerLanguage === "xml" || lowerName.endsWith(".svg")) {
    return `\nDiagram hint: This is SVG/markup. Show the render pipeline (open document → define canvas → draw layers → finish output). Do NOT create one box per rect/path/element.`;
  }

  if (lowerName.endsWith(".css") || lowerLanguage === "css") {
    return `\nDiagram hint: Show how styles are applied in order, not every CSS selector as a separate row.`;
  }

  if (lowerLanguage === "json") {
    return `\nDiagram hint: Show how the data is read, validated, and consumed — not every JSON key as a box.`;
  }

  return "";
}

export function buildAnalyzeUserPrompt(
  {
    code,
    language,
    fileName,
  }: {
    code: string;
    language: string;
    fileName?: string;
  },
  strict = false
): string {
  const fileLabel = fileName ? `File name: ${fileName}\n` : "";
  const diagramHint = getDiagramHint(language, fileName);
  const strictNote = strict
    ? `\nYour previous response was invalid or too flat. Return ONLY raw JSON. The mermaid field must be a vertical flowchart TD with 4-7 nodes showing logic flow, not a component list.`
    : "";

  return `${fileLabel}Language: ${language}${diagramHint}

Analyze the code and return JSON exactly like this example:
{
  "explanation": "## Overview\\nShort markdown explanation.",
  "mermaid": "flowchart TD\\n  A([Start]) --> B[Read Input]\\n  B --> C{Valid Input}\\n  C -->|yes| D[Process Data]\\n  C -->|no| E[Return Error]\\n  D --> F([Done])"
}
${strictNote}

Code:
\`\`\`${language}
${code}
\`\`\``;
}
