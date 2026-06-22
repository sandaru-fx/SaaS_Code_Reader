"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type WorkspaceErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WorkspaceError({
  error,
  reset,
}: WorkspaceErrorProps) {
  useEffect(() => {
    console.error("Workspace route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertCircle className="size-10 text-destructive/70" />
      <div className="max-w-md space-y-1">
        <h2 className="text-lg font-semibold">Workspace failed to load</h2>
        <p className="text-sm text-muted-foreground">
          CodeRider ran into a problem while loading the workspace. You can try
          again or return home.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
