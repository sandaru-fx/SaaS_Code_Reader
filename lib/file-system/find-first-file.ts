import type { FileNode } from "@/lib/file-system/types";

export function findFirstFileInTree(node: FileNode): FileNode | null {
  if (node.type === "file") {
    return node;
  }

  for (const child of node.children ?? []) {
    const match = findFirstFileInTree(child);
    if (match) {
      return match;
    }
  }

  return null;
}
