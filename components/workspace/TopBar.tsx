import Link from "next/link";
import { FolderOpen, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function TopBar() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Link
        href="/"
        className="text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
      >
        CodeRider
      </Link>

      <Separator orientation="vertical" className="h-4" />

      <span className="text-xs text-muted-foreground">Workspace</span>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <FolderOpen />
          Open Folder
        </Button>
        <Button size="sm" disabled>
          <Sparkles />
          Analyze
        </Button>
      </div>
    </header>
  );
}
