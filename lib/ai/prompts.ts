export const ANALYZE_SYSTEM_PROMPT = `You are CodeRider, an expert software architecture analyst.

Your job is to analyze source code and return a structured JSON object with:
1. "explanation" — clear Markdown explaining what the code does, its logic flow, and runtime behavior.
2. "mermaid" — a valid Mermaid.js flowchart string that visualizes the code architecture or logic flow.

Rules:
- Return ONLY valid JSON. No prose before or after the JSON.
- Do not wrap the JSON in markdown code fences.
- "explanation" must use Markdown headings and bullet points where helpful.
- "mermaid" must start with "graph TD" or "flowchart TD".
- Keep Mermaid node labels short and avoid special characters that break Mermaid syntax.
- Do not use parentheses in Mermaid node labels unless escaped properly.
- Prefer simple, readable diagrams over overly complex ones.`;

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
    ? `\nIMPORTANT: Your previous response was invalid JSON. Return ONLY a raw JSON object with exactly these keys: "explanation" and "mermaid".`
    : "";

  return `${fileLabel}Language: ${language}

Analyze the code below and respond with JSON in this exact shape:
{
  "explanation": "Markdown explanation here",
  "mermaid": "graph TD\\n  A[Start] --> B[End]"
}
${strictNote}

Code:
\`\`\`${language}
${code}
\`\`\``;
}
