const DIAGRAM_HEADER =
  /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline|journey)\b/i;

function stripCodeFence(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:mermaid)?\s*([\s\S]*?)\s*```$/i);

  if (fenceMatch) {
    return fenceMatch[1].trim();
  }

  return trimmed;
}

export function sanitizeMermaid(raw: string): string {
  let value = stripCodeFence(raw);
  value = value.replace(/^mermaid\s*/i, "").trim();
  value = value.replace(/\r\n/g, "\n");

  if (value.length === 0) {
    return value;
  }

  if (!DIAGRAM_HEADER.test(value)) {
    value = `flowchart TD\n${value}`;
  }

  return value;
}
