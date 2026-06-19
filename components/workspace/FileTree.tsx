"use client";

import { FileTreeItem } from "@/components/workspace/FileTreeItem";
import type { FileNode } from "@/lib/file-system/types";

type FileTreeProps = {
  tree: FileNode;
  selectedPath: string | null;
  onSelectFile: (node: FileNode) => void;
};

export function FileTree({ tree, selectedPath, onSelectFile }: FileTreeProps) {
  if (!tree.children?.length) {
    return (
      <p className="px-3 py-4 text-center text-xs text-muted-foreground">
        No readable files found in this folder.
      </p>
    );
  }

  return (
    <div className="py-1">
      {tree.children.map((child) => (
        <FileTreeItem
          key={child.path || child.name}
          node={child}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}
