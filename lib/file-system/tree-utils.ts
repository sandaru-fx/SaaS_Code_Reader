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
