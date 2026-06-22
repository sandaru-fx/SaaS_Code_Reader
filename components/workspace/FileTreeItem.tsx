"use client";

import { useState } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
} from "lucide-react";

import { FileTypeIcon } from "@/components/workspace/FileTypeIcon";
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
          "flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-sm transition-colors hover:bg-slate-100",
          isSelected && "bg-blue-50 text-blue-900",
          !isSelected && "text-slate-700"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        title={node.path || node.name}
      >
        {isFolder ? (
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 text-slate-400 transition-transform",
              hasChildren && isExpanded && "rotate-90",
              !hasChildren && "opacity-0"
            )}
          />
        ) : (
          <span className="size-3.5 shrink-0" />
        )}

        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="size-4 shrink-0 text-amber-500" />
          ) : (
            <Folder className="size-4 shrink-0 text-amber-500" />
          )
        ) : (
          <FileTypeIcon fileName={node.name} />
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
