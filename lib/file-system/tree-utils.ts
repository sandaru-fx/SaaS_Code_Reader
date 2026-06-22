import type { FileNode } from "@/lib/file-system/types";

export function countFileNodes(node: FileNode): number {
  if (node.type === "file") {
    return 1;
  }

  return (
    node.children?.reduce((total, child) => total + countFileNodes(child), 0) ??
    0
  );
}

export function serializeTreeForAI(node: FileNode, depth = 0, maxDepth = 4): string {
  if (depth > maxDepth) return "";

  const indent = "  ".repeat(depth);
  let result = `${indent}${node.type === "folder" ? "📁" : "📄"} ${node.name}\n`;

  if (node.type === "folder" && node.children) {
    // Sort folders first, then files
    const sortedChildren = [...node.children].sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "folder" ? -1 : 1;
    });

    for (const child of sortedChildren) {
      result += serializeTreeForAI(child, depth + 1, maxDepth);
    }
  }

  return result;
}

export function findNodeByPath(node: FileNode, targetPath: string): FileNode | null {
  if (node.path === targetPath || node.name === targetPath) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByPath(child, targetPath);
      if (found) return found;
    }
  }

  return null;
}
