const NODE_ID_PATTERN =
  /\b([A-Za-z][A-Za-z0-9_]*)\s*(?:\[|\{|\(|\[\[)/g;

const EDGE_TARGET_PATTERN = /-->\s*(?:\|[^|]*\|)?\s*([A-Za-z][A-Za-z0-9_]*)/g;
const EDGE_SOURCE_PATTERN = /\b([A-Za-z][A-Za-z0-9_]*)\s*-->/g;

const DECISION_NODE_PATTERN = /\b([A-Za-z][A-Za-z0-9_]*)\s*\{/g;
const STADIUM_NODE_PATTERN = /\b([A-Za-z][A-Za-z0-9_]*)\s*\(\[/g;

const CLASS_DEFS = [
  "classDef crStart fill:#10b981,stroke:#047857,color:#ffffff,stroke-width:2.5px,rx:24,ry:24,font-weight:600",
  "classDef crEnd fill:#0ea5e9,stroke:#0369a1,color:#ffffff,stroke-width:2.5px,rx:24,ry:24,font-weight:600",
  "classDef crProcess fill:#6366f1,stroke:#4338ca,color:#ffffff,stroke-width:2px,rx:8,ry:8,font-weight:500",
  "classDef crProcessAlt fill:#8b5cf6,stroke:#6d28d9,color:#ffffff,stroke-width:2px,rx:8,ry:8,font-weight:500",
  "classDef crDecision fill:#f59e0b,stroke:#b45309,color:#1f2937,stroke-width:2.5px,font-weight:600",
  "classDef crSuccess fill:#22c55e,stroke:#15803d,color:#ffffff,stroke-width:2px,rx:8,ry:8,font-weight:500",
  "classDef crError fill:#ef4444,stroke:#b91c1c,color:#ffffff,stroke-width:2px,rx:8,ry:8,font-weight:500",
] as const;

const RESERVED_TOKENS = new Set([
  "graph",
  "flowchart",
  "classDef",
  "class",
  "style",
  "linkStyle",
  "subgraph",
  "end",
  "TD",
  "TB",
  "BT",
  "LR",
  "RL",
]);

function extractMatches(source: string, pattern: RegExp): string[] {
  const ids: string[] = [];
  pattern.lastIndex = 0;
  let match = pattern.exec(source);

  while (match) {
    const id = match[1];
    if (id && !RESERVED_TOKENS.has(id)) {
      ids.push(id);
    }
    match = pattern.exec(source);
  }

  return ids;
}

function extractNodeIdsInOrder(source: string): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const pattern of [
    NODE_ID_PATTERN,
    EDGE_TARGET_PATTERN,
    EDGE_SOURCE_PATTERN,
  ]) {
    for (const id of extractMatches(source, pattern)) {
      if (!seen.has(id)) {
        seen.add(id);
        ordered.push(id);
      }
    }
  }

  return ordered;
}

function classifyNodes(source: string, allIds: string[]) {
  const decisionIds = new Set(extractMatches(source, DECISION_NODE_PATTERN));
  const stadiumIds = new Set(extractMatches(source, STADIUM_NODE_PATTERN));

  const lowerSource = source.toLowerCase();
  const errorIds = new Set<string>();
  const successIds = new Set<string>();

  for (const id of allIds) {
    const labelPattern = new RegExp(
      `\\b${id}\\b\\s*[\\[\\(\\{]([^\\]\\)\\}]+)`
    );
    const match = labelPattern.exec(source);
    const label = match?.[1]?.toLowerCase() ?? "";

    if (
      label.includes("error") ||
      label.includes("fail") ||
      label.includes("reject") ||
      label.includes("invalid")
    ) {
      errorIds.add(id);
    } else if (
      label.includes("success") ||
      label.includes("done") ||
      label.includes("complete") ||
      label.includes("output") ||
      label.includes("render") ||
      label.includes("return")
    ) {
      successIds.add(id);
    }

    void lowerSource;
  }

  const start = stadiumIds.size > 0 ? allIds.find((id) => stadiumIds.has(id)) : allIds[0];
  const endCandidates = allIds.filter(
    (id) => stadiumIds.has(id) && id !== start
  );
  const end = endCandidates[endCandidates.length - 1] ?? allIds[allIds.length - 1];

  return {
    startId: start,
    endId: end,
    decisionIds,
    errorIds,
    successIds,
  };
}

export function enhanceMermaidWithStyles(source: string): string {
  if (!source.trim() || source.includes("classDef crStart")) {
    return source;
  }

  const ids = extractNodeIdsInOrder(source);
  if (ids.length === 0) {
    return source;
  }

  const { startId, endId, decisionIds, errorIds, successIds } = classifyNodes(
    source,
    ids
  );

  const assignments = new Map<string, string[]>();
  const assign = (className: string, nodeId: string | undefined) => {
    if (!nodeId) return;
    const bucket = assignments.get(className) ?? [];
    if (!bucket.includes(nodeId)) {
      bucket.push(nodeId);
      assignments.set(className, bucket);
    }
  };

  assign("crStart", startId);
  if (endId !== startId) {
    assign("crEnd", endId);
  }

  let processAlt = false;
  for (const id of ids) {
    if (id === startId || id === endId) continue;
    if (decisionIds.has(id)) {
      assign("crDecision", id);
    } else if (errorIds.has(id)) {
      assign("crError", id);
    } else if (successIds.has(id)) {
      assign("crSuccess", id);
    } else {
      assign(processAlt ? "crProcessAlt" : "crProcess", id);
      processAlt = !processAlt;
    }
  }

  const lines = [source.trim(), ...CLASS_DEFS];

  for (const [className, nodeIds] of assignments) {
    if (nodeIds.length > 0) {
      lines.push(`  class ${nodeIds.join(",")} ${className}`);
    }
  }

  const edgeCount = (source.match(/-->/g) ?? []).length;
  for (let index = 0; index < edgeCount; index += 1) {
    lines.push(
      `  linkStyle ${index} stroke:#94a3b8,stroke-width:2.5px,fill:none`
    );
  }

  return lines.join("\n");
}
