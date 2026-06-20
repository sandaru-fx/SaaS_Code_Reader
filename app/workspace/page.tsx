import { Suspense } from "react";

import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";

function WorkspaceFallback() {
  return (
    <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
      Loading workspace...
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<WorkspaceFallback />}>
      <WorkspaceLayout />
    </Suspense>
  );
}
