/** Strip emojis and symbols that break Mermaid.ink / Mermaid parsers. */
function stripUnsafeCharacters(value: string): string {
  return value
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[✓✔✕✖→←↔]/g, "")
    .replace(/\$\{[^}]*\}/g, "var")
    .replace(/`/g, "'");
}

function cleanNodeLabel(label: string): string {
  return stripUnsafeCharacters(label)
    .replace(/["']/g, "")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 48);
}

function repairBracketNodes(value: string): string {
  return value.replace(/\[([^\]]*)\]/g, (_match, label: string) => {
    const cleaned = cleanNodeLabel(label);
    return `[${cleaned || "Step"}]`;
  });
}

function repairParenNodes(value: string): string {
  return value.replace(
    /\b([A-Za-z][A-Za-z0-9_]*)\(([^)]*)\)/g,
    (_match, id: string, label: string) => {
      const cleaned = cleanNodeLabel(label);
      return `${id}(${cleaned || "Step"})`;
    }
  );
}

function repairCurlyNodes(value: string): string {
  return value.replace(/\{([^}]*)\}/g, (_match, label: string) => {
    const cleaned = cleanNodeLabel(label);
    return `{${cleaned || "Decision"}}`;
  });
}

function repairArrows(value: string): string {
  return value
    .replace(/--\s*>/g, "-->")
    .replace(/-\s*-\s*/g, "--")
    .replace(/--+\s*([|][^|]*[|])\s*-->/g, "--$1-->");
}

function limitNodes(value: string, maxNodes = 12): string {
  const lines = value.split("\n");
  const nodeLinePattern =
    /^\s*\w+\s*(\[|\(|\{|-->|---|==>|-.->)/;

  let nodeCount = 0;
  const kept: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      kept.push(line);
      continue;
    }

    if (/^(graph|flowchart|classDef|style|linkStyle|subgraph|end)\b/i.test(trimmed)) {
      kept.push(line);
      continue;
    }

    if (nodeLinePattern.test(trimmed)) {
      nodeCount += 1;
      if (nodeCount > maxNodes) {
        continue;
      }
    }

    kept.push(line);
  }

  return kept.join("\n");
}

export function repairMermaid(raw: string): string {
  if (!raw.trim()) {
    return raw;
  }

  let value = stripUnsafeCharacters(raw);
  value = value.replace(/\r\n/g, "\n");
  value = repairArrows(value);
  value = repairBracketNodes(value);
  value = repairParenNodes(value);
  value = repairCurlyNodes(value);
  value = limitNodes(value);

  return value.trim();
}
