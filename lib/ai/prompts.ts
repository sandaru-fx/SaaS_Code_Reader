export const ANALYZE_SYSTEM_PROMPT = `You are CodeRider, an expert software architecture analyst.

Return ONLY valid JSON with exactly two keys:
1. "explanation" — Markdown explaining what the code does, logic flow, and runtime behavior.
2. "mermaid" — a simple Mermaid flowchart string.

Mermaid rules (critical — invalid syntax breaks rendering):
- Start with "flowchart TD" on the first line.
- Use at most 8 nodes. Keep diagrams simple and readable.
- Node IDs must be alphanumeric only (A, B, step1, dbConnect).
- Node labels must be short (1-4 words) inside square brackets: A[Connect DB]
- Do NOT use emojis, backticks, quotes, colons, parentheses, or special symbols inside labels.
- Do NOT put code snippets, template literals, or variable names with $ inside labels.
- Use only these arrow forms: --> and -->|label|
- Good: flowchart TD\\n  A[Start] --> B[Read Config]\\n  B --> C{Connect OK}
- Bad: A[MongoDB Connected: \${host}] or A[✓ Success] or A["quoted label"]

JSON rules:
- Return ONLY raw JSON. No markdown fences. No extra text.`;

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
  const strictNote = strict
    ? `\nYour previous response was invalid. Return ONLY raw JSON with "explanation" and "mermaid". The mermaid field must be a valid simple flowchart TD with short node labels and no special characters.`
    : "";

  return `${fileLabel}Language: ${language}

Analyze the code and return JSON exactly like this example:
{
  "explanation": "## Overview\\nShort markdown explanation.",
  "mermaid": "flowchart TD\\n  A[Start] --> B[Load Config]\\n  B --> C{Connect}\\n  C -->|yes| D[Success]\\n  C -->|no| E[Handle Error]"
}
${strictNote}

Code:
\`\`\`${language}
${code}
\`\`\``;
}
