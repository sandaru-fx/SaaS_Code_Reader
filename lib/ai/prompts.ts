export const ANALYZE_SYSTEM_PROMPT = `You are CodeRider, an expert software architecture analyst.

Return ONLY valid JSON with exactly two keys:
1. "explanation" — Markdown explaining what the code does, logic flow, and runtime behavior.
2. "mermaid" — a clean logic flowchart showing how the code RUNS.

CORE PRINCIPLE — Diagram the EXECUTION FLOW, not the code structure.
Bad: A list of every class / function / SVG shape / HTML tag as sibling boxes.
Good: Start → key steps → decision → outcome. Vertical, top-to-bottom.

HARD RULES (diagram is rejected and you will be re-prompted if any are broken):
- Total nodes: between 4 and 7 (inclusive).
- Maximum 3 children from any single node (no fan-out / no "star" diagrams).
- Use vertical "flowchart TD" only.
- Each node label: 2 to 5 plain English words. NO file extensions, NO element tag names (rect, path, ellipse, polygon, circle, svg, div, span), NO hex codes, NO "fill:" / "stroke:" / "opacity:", NO punctuation except a single space.
- Exactly ONE start node using stadium shape: A([Start]).
- Exactly ONE end node using stadium shape: F([Done]) or F([Output]).
- At most one decision node using curly braces: C{Valid Input}.
- Arrows: --> or -->|yes| or -->|no| only. No dotted lines, no thick arrows.
- Do NOT include classDef, class, style, or linkStyle — styling is added later.
- Do NOT include subgraphs, comments, or any text outside the flowchart.

JSON RULES:
- Return ONLY raw JSON. No markdown fences. No prose before or after.
- Both keys are required and must be non-empty strings.

PERFECT EXAMPLES (study the shape: linear with one optional branch):

Example 1 — backend API handler:
{
  "explanation": "## Overview\\nHandles a POST request to create a user.",
  "mermaid": "flowchart TD\\n  A([Start]) --> B[Parse Request Body]\\n  B --> C{Valid Input}\\n  C -->|yes| D[Save To Database]\\n  C -->|no| E[Return Error]\\n  D --> F([Done])"
}

Example 2 — SVG icon file:
{
  "explanation": "## Overview\\nDefines an icon graphic rendered by the browser.",
  "mermaid": "flowchart TD\\n  A([Start]) --> B[Open SVG Canvas]\\n  B --> C[Draw Background Shape]\\n  C --> D[Draw Foreground Shapes]\\n  D --> E[Apply Colors]\\n  E --> F([Render Icon])"
}

Example 3 — React component:
{
  "explanation": "## Overview\\nDisplays a list with a loading state.",
  "mermaid": "flowchart TD\\n  A([Start]) --> B[Read Props]\\n  B --> C{Data Loaded}\\n  C -->|yes| D[Render List]\\n  C -->|no| E[Show Skeleton]\\n  D --> F([Update UI])\\n  E --> F"
}

ANTI-EXAMPLES (NEVER produce these shapes):
- Root node with 5+ siblings ("SVG Root" → Rect, Path, Ellipse, Path, Path, Path)
- Labels like "Background Rectangle", "Main Body Path", "fill #1c1a17"
- A flat list of file parts
- Nodes containing colons, hex codes, or attribute names`;

function getDiagramHint(language: string, fileName?: string): string {
  const lowerName = fileName?.toLowerCase() ?? "";
  const lowerLanguage = language.toLowerCase();

  if (lowerLanguage === "xml" || lowerName.endsWith(".svg")) {
    return `\nFile-specific guidance: This is SVG markup. Diagram the RENDER PIPELINE (open canvas → draw shapes → apply colors → output icon). NEVER create one node per <rect>, <path>, <ellipse>, <polygon>, or <circle>. NEVER mention element tag names in labels.`;
  }

  if (lowerName.endsWith(".css") || lowerLanguage === "css") {
    return `\nFile-specific guidance: This is CSS. Diagram how styles cascade and apply (load rules → match selectors → resolve specificity → apply styles). Do NOT list selectors.`;
  }

  if (lowerLanguage === "json") {
    return `\nFile-specific guidance: This is JSON data. Diagram the data lifecycle (load → validate → transform → consume). Do NOT list JSON keys.`;
  }

  if (lowerLanguage === "html") {
    return `\nFile-specific guidance: This is HTML markup. Diagram the page lifecycle (parse → build DOM → load assets → render). Do NOT list HTML tags.`;
  }

  if (lowerLanguage === "markdown" || lowerName.endsWith(".md")) {
    return `\nFile-specific guidance: This is Markdown. Diagram the content flow (read sections → parse syntax → render output).`;
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
    ? `\nIMPORTANT: Your previous response was rejected. Common reasons: too many nodes, sibling fan-out, element names in labels, or non-flow structure. Return a vertical flowchart TD with 4-7 nodes following the perfect examples exactly. Labels must be plain English actions, never element names or attributes.`
    : "";

  return `${fileLabel}Language: ${language}${diagramHint}${strictNote}

Return the JSON now. Follow the perfect-example shape exactly. Code to analyze:
\`\`\`${language}
${code}
\`\`\``;
}
