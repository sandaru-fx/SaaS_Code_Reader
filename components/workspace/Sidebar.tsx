import { FolderTree } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/workspace/EmptyState";

export function Sidebar() {
  return (
    <aside className="flex h-full min-h-0 w-[250px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-10 shrink-0 items-center gap-2 px-3">
        <FolderTree className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          File Explorer
        </span>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <EmptyState
          icon={FolderTree}
          title="No folder opened yet"
          description='Use "Open Folder" to load a local project'
          className="min-h-[280px]"
        />
      </ScrollArea>
    </aside>
  );
}
