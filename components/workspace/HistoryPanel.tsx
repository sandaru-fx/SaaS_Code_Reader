"use client";

import { Clock3, FileCode2, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/workspace/EmptyState";
import { HistoryDiagramThumb } from "@/components/workspace/HistoryDiagramThumb";
import type { AnalysisHistoryItem } from "@/lib/supabase/types";

function formatHistoryDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

type HistoryPanelProps = {
  items: AnalysisHistoryItem[];
  activeId: string | null;
  isLoading: boolean;
  isDeletingId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export function HistoryPanel({
  items,
  activeId,
  isLoading,
  isDeletingId,
  onSelect,
  onDelete,
}: HistoryPanelProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Clock3}
        title="No saved analyses yet"
        description="Run Analyze and your results will appear here."
        className="min-h-[220px]"
      />
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-3">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const isDeleting = isDeletingId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-3 transition-colors ${
                isActive
                  ? "border-blue-200 bg-blue-50/80"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => onSelect(item.id)}
              >
                <HistoryDiagramThumb mermaid={item.mermaid} />
                <div className="mt-3 flex items-start gap-2">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <FileCode2 className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">
                      {item.fileName ?? "Untitled snippet"}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-slate-500">
                      {item.language} · {formatHistoryDate(item.createdAt)}
                    </span>
                    <span className="mt-2 block line-clamp-2 text-xs leading-5 text-slate-600">
                      {item.preview}
                    </span>
                  </span>
                </div>
              </button>
              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full px-2 text-xs text-slate-500 hover:text-red-600"
                  disabled={isDeleting}
                  onClick={() => onDelete(item.id)}
                >
                  {isDeleting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
