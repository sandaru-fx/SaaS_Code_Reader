const MIN_NODES = 3;
const MAX_NODES = 9;
const MAX_FANOUT = 3;

const FORBIDDEN_LABEL_TERMS = [
  "rect",
  "rectangle",
  "ellipse",
  "polygon",
  "polyline",
  "circle",
  "<svg",
  "<path",
  "<rect",
  "<g>",
  "tspan",
  "fill:",
  "stroke:",
  "opacity:",
  "transform:",
];

const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/;
const ARROW_PATTERN = /^([A-Za-z][A-Za-z0-9_]*)\s*-->/;
const NODE_LABEL_PATTERN = /\[([^\]]+)\]|\{([^}]+)\}|\(\(([^)]+)\)\)|\(\[([^\]]+)\]\)|\(([^)]+)\)/g;

export type DiagramValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

function extractNodeLabels(source: string): string[] {
  const labels: string[] = [];
  NODE_LABEL_PATTERN.lastIndex = 0;
  let match = NODE_LABEL_PATTERN.exec(source);

  while (match) {
    const label = match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5];
    if (label) {
      labels.push(label.trim());
    }
    match = NODE_LABEL_PATTERN.exec(source);
  }

  return labels;
}

function countNodes(source: string): number {
  return new Set(extractNodeLabels(source)).size;
}

function countFanout(source: string): Map<string, number> {
  const counts = new Map<string, number>();
  const lines = source.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const match = ARROW_PATTERN.exec(line);
    if (match) {
      const source = match[1];
      counts.set(source, (counts.get(source) ?? 0) + 1);
    }
  }

  return counts;
}

export function validateDiagramShape(source: string): DiagramValidationResult {
  const trimmed = source.trim();

  if (!trimmed) {
    return { ok: false, reason: "Diagram is empty." };
  }

  if (!/^flowchart\s+(TD|TB)/i.test(trimmed)) {
    return {
      ok: false,
      reason: "Diagram must start with 'flowchart TD' for vertical flow.",
    };
  }

  const labels = extractNodeLabels(trimmed);
  const nodeCount = new Set(labels).size;

  if (nodeCount < MIN_NODES) {
    return {
      ok: false,
      reason: `Diagram has only ${nodeCount} nodes; need at least ${MIN_NODES}.`,
    };
  }

  if (nodeCount > MAX_NODES) {
    return {
      ok: false,
      reason: `Diagram has ${nodeCount} nodes; max is ${MAX_NODES}. Simplify into a linear flow.`,
    };
  }

  for (const label of labels) {
    const lower = label.toLowerCase();

    for (const term of FORBIDDEN_LABEL_TERMS) {
      if (lower.includes(term)) {
        return {
          ok: false,
          reason: `Label "${label}" contains forbidden term "${term}". Use a plain English action instead.`,
        };
      }
    }

    if (HEX_PATTERN.test(label)) {
      return {
        ok: false,
        reason: `Label "${label}" contains a color hex code. Labels must be plain English actions only.`,
      };
    }

    const wordCount = label
      .replace(/[{}()\[\]]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (wordCount > 6) {
      return {
        ok: false,
        reason: `Label "${label}" has ${wordCount} words; keep labels to 2-5 words.`,
      };
    }
  }

  const fanout = countFanout(trimmed);
  for (const [nodeId, count] of fanout) {
    if (count > MAX_FANOUT) {
      return {
        ok: false,
        reason: `Node "${nodeId}" has ${count} outgoing edges; max fan-out is ${MAX_FANOUT}. Avoid star-shaped diagrams.`,
      };
    }
  }

  return { ok: true };
}
