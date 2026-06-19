"use client";

import Link from "next/link";
import { FolderOpen, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function TopBar() {
  const { isLoading, isSupported, openFolder } = useWorkspace();

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
        <Button
          variant="outline"
          size="sm"
          disabled={!isSupported || isLoading}
          onClick={openFolder}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <FolderOpen />}
          {isLoading ? "Opening..." : "Open Folder"}
        </Button>
        <Button size="sm" disabled>
          <Sparkles />
          Analyze
        </Button>
      </div>
    </header>
  );
}
