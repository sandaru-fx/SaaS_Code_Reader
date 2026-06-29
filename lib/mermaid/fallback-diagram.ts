type FallbackOptions = {
  fileName?: string;
  language?: string;
};

function escapeLabel(value: string): string {
  return value.replace(/[[\]{}()#;]/g, "").trim().slice(0, 32) || "Step";
}

export function buildFallbackDiagram(
  code: string,
  options: FallbackOptions = {}
): string {
  const title = escapeLabel(options.fileName ?? "Selected file");
  const lines: string[] = [
    "flowchart TD",
    `  start([${title}])`,
  ];

  let cursor = "start";

  if (/^\s*import\s/m.test(code) || /require\s*\(/.test(code)) {
    lines.push(`  ${cursor} --> imports[Load dependencies]`);
    cursor = "imports";
  }

  if (/\basync\b/.test(code)) {
    lines.push(`  ${cursor} --> asyncFlow[Async execution]`);
    cursor = "asyncFlow";
  }

  if (/\btry\s*\{/.test(code)) {
    lines.push(`  ${cursor} --> tryBlock{Try operation}`);
    cursor = "tryBlock";
  }

  if (/\bcatch\s*\(/.test(code)) {
    lines.push("  tryBlock -->|error| catchBlock[Handle error]");
    lines.push("  catchBlock --> exitNode[Exit or recover]");
  }

  if (/console\.(log|error)/.test(code)) {
    lines.push(`  ${cursor} --> logging[Log output]`);
    cursor = "logging";
  }

  if (/process\.env\./.test(code) || /getenv|ENV/.test(code)) {
    lines.push(`  ${cursor} --> envConfig[Read environment]`);
    cursor = "envConfig";
  }

  if (/\.connect\s*\(/.test(code) || /mongoose|mongodb|prisma|createConnection/.test(code)) {
    lines.push(`  ${cursor} --> dbConnect[Connect database]`);
    lines.push("  dbConnect -->|success| dbReady[Database ready]");
    lines.push("  dbConnect -->|failure| dbFail[Connection failed]");
  }

  if (/\breturn\b/.test(code)) {
    lines.push(`  ${cursor} --> result[Return result]`);
    cursor = "result";
  }

  if (/\bexport\b/.test(code)) {
    lines.push(`  ${cursor} --> exported[Export module]`);
  }

  if (lines.length <= 2) {
    lines.push(`  ${cursor} --> logic[Execute logic]`);
    lines.push("  logic --> output[Produce output]");
  }

  lines.push(
    "  classDef startNode fill:#4ade80,stroke:#16a34a,color:#052e16,stroke-width:2px",
    "  classDef actionNode fill:#60a5fa,stroke:#2563eb,color:#0f172a,stroke-width:2px",
    "  classDef errorNode fill:#f87171,stroke:#dc2626,color:#450a0a,stroke-width:2px",
    "  classDef successNode fill:#34d399,stroke:#059669,color:#052e16,stroke-width:2px",
    "  class start startNode",
    "  class imports,asyncFlow,envConfig,logging,logic actionNode",
    "  class catchBlock,dbFail,exitNode errorNode",
    "  class dbReady,result,exported,output successNode"
  );

  return lines.join("\n");
}
