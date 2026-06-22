"use client";

import { useState } from "react";
import {
  ChevronRight,
  File as FileIcon,
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
          "group flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-[13px] transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.04]",
          isSelected && "bg-blue-50 text-blue-900 dark:bg-[#14d1a0]/10 dark:text-[#14d1a0]",
          !isSelected && "text-slate-700 dark:text-[#e3e3e3]/75"
        )}
        style={{ paddingLeft: `${depth * 12 + 10}px` }}
        title={node.path || node.name}
      >
        {isFolder ? (
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 text-slate-400 transition-transform dark:text-[#e3e3e3]/40",
              hasChildren && isExpanded && "rotate-90",
              !hasChildren && "opacity-0"
            )}
            strokeWidth={1.5}
          />
        ) : (
          <span className="size-3.5 shrink-0" />
        )}

        {isFolder ? (
          isExpanded ? (
            <FolderOpen
              className="size-4 shrink-0 text-amber-500 dark:text-[#e3e3e3]/55"
              strokeWidth={1.5}
            />
          ) : (
            <Folder
              className="size-4 shrink-0 text-amber-500 dark:text-[#e3e3e3]/55"
              strokeWidth={1.5}
            />
          )
        ) : (
          <span className="relative flex size-4 shrink-0 items-center justify-center">
            <FileIcon
              className={cn(
                "size-3.5 text-slate-400 dark:text-[#e3e3e3]/45",
                isSelected && "dark:text-[#14d1a0]"
              )}
              strokeWidth={1.5}
            />
            <span
              className={cn(
                "absolute -right-0.5 -bottom-0.5 size-1.5 rounded-full bg-slate-300 dark:bg-[#14d1a0]/70 premium-status-saved",
                isSelected && "dark:bg-[#14d1a0]"
              )}
              aria-hidden
            />
          </span>
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
