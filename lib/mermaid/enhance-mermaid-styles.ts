const NODE_ID_PATTERN =
  /\b([A-Za-z][A-Za-z0-9_]*)\s*(?:\[|\{|\(|\[\[)/g;

const EDGE_TARGET_PATTERN = /-->\s*(?:\|[^|]*\|)?\s*([A-Za-z][A-Za-z0-9_]*)/g;
const EDGE_SOURCE_PATTERN = /\b([A-Za-z][A-Za-z0-9_]*)\s*-->/g;

const STYLE_CLASSES = [
  "crStart",
  "crProcess",
  "crData",
  "crDecision",
  "crAction",
  "crSuccess",
  "crOutput",
] as const;

const CLASS_DEFS = [
  "classDef crStart fill:#22c55e,stroke:#15803d,color:#ffffff,stroke-width:2px,rx:12,ry:12",
  "classDef crProcess fill:#3b82f6,stroke:#1d4ed8,color:#ffffff,stroke-width:2px",
  "classDef crData fill:#8b5cf6,stroke:#6d28d9,color:#ffffff,stroke-width:2px",
  "classDef crDecision fill:#f59e0b,stroke:#d97706,color:#1f2937,stroke-width:2px",
  "classDef crAction fill:#06b6d4,stroke:#0891b2,color:#0f172a,stroke-width:2px",
  "classDef crSuccess fill:#10b981,stroke:#059669,color:#ffffff,stroke-width:2px",
  "classDef crOutput fill:#14b8a6,stroke:#0f766e,color:#ffffff,stroke-width:2px",
] as const;

function extractNodeIds(source: string): string[] {
  const ids = new Set<string>();

  for (const pattern of [
    NODE_ID_PATTERN,
    EDGE_TARGET_PATTERN,
    EDGE_SOURCE_PATTERN,
  ]) {
    pattern.lastIndex = 0;
    let match = pattern.exec(source);

    while (match) {
      const id = match[1];
      if (
        id &&
        !["graph", "flowchart", "classDef", "class", "style", "linkStyle", "subgraph", "end"].includes(
          id
        )
      ) {
        ids.add(id);
      }
      match = pattern.exec(source);
    }
  }

  return Array.from(ids);
}

function groupIdsByClass(ids: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  ids.forEach((id, index) => {
    const className = STYLE_CLASSES[Math.min(index, STYLE_CLASSES.length - 1)];
    const bucket = groups.get(className) ?? [];
    bucket.push(id);
    groups.set(className, bucket);
  });

  return groups;
}

export function enhanceMermaidWithStyles(source: string): string {
  if (!source.trim() || source.includes("classDef crStart")) {
    return source;
  }

  const ids = extractNodeIds(source);
  if (ids.length === 0) {
    return source;
  }

  const lines = [source.trim(), ...CLASS_DEFS];

  const groups = groupIdsByClass(ids);
  for (const [className, nodeIds] of groups) {
    if (nodeIds.length > 0) {
      lines.push(`  class ${nodeIds.join(",")} ${className}`);
    }
  }

  const edgeCount = (source.match(/-->/g) ?? []).length;
  for (let index = 0; index < edgeCount; index += 1) {
    lines.push(
      `  linkStyle ${index} stroke:#64748b,stroke-width:2.5px,fill:none`
    );
  }

  return lines.join("\n");
}
