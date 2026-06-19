import { FileCode2 } from "lucide-react";

import { EmptyState } from "@/components/workspace/EmptyState";

export function CodeViewer() {
  return (
    <main className="flex min-w-0 flex-1 flex-col bg-muted/20">
      <div className="flex h-10 shrink-0 items-center border-b border-border bg-background px-4">
        <span className="font-mono text-xs text-muted-foreground">
          No file selected
        </span>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <div className="hidden w-12 shrink-0 border-r border-border bg-muted/40 sm:block">
          <div className="flex flex-col items-end gap-1 px-2 py-4 font-mono text-[10px] leading-5 text-muted-foreground/30">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i + 1}>{i + 1}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-background/80">
          <EmptyState
            icon={FileCode2}
            title="Select a file from the sidebar"
            description="File contents will appear here with syntax highlighting"
            iconClassName="size-10"
          />
        </div>
      </div>
    </main>
  );
}
