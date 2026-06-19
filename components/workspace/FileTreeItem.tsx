"use client";

import { useState } from "react";
import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { FileNode } from "@/lib/file-system/types";

type FileTreeItemProps = {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (node: FileNode) => void;
};

export function FileTreeItem({
  node,
  depth,
  selectedPath,
  onSelectFile,
}: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFolder = node.type === "folder";
  const isSelected = !isFolder && selectedPath === node.path;
  const hasChildren = isFolder && (node.children?.length ?? 0) > 0;

  const handleClick = () => {
    if (isFolder) {
      if (hasChildren) {
        setIsExpanded((current) => !current);
      }
      return;
    }

    onSelectFile(node);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1 rounded-md py-1 pr-2 text-left text-sm transition-colors hover:bg-accent/60",
          isSelected && "bg-accent text-accent-foreground",
          !isSelected && "text-foreground/80"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        title={node.path || node.name}
      >
        {isFolder ? (
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform",
              hasChildren && isExpanded && "rotate-90",
              !hasChildren && "opacity-0"
            )}
          />
        ) : (
          <span className="size-3.5 shrink-0" />
        )}

        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="size-3.5 shrink-0 text-amber-500/80" />
          ) : (
            <Folder className="size-3.5 shrink-0 text-amber-500/80" />
          )
        ) : (
          <File className="size-3.5 shrink-0 text-muted-foreground" />
        )}

        <span className="truncate">{node.name}</span>
      </button>

      {isFolder && isExpanded && hasChildren ? (
        <div>
          {node.children!.map((child) => (
            <FileTreeItem
              key={child.path || child.name}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
