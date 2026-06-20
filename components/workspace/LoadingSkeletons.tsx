import { Skeleton } from "@/components/ui/skeleton";

const CODE_LINE_WIDTHS = ["92%", "78%", "88%", "64%", "95%", "72%", "84%", "58%"];

export function CodeBlockSkeleton({
  message = "Loading file content...",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-full min-h-[280px] flex-col p-4">
      <div className="flex min-h-0 flex-1 gap-4">
        <div className="hidden w-10 shrink-0 space-y-2 sm:block">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="mx-auto h-3 w-5" />
          ))}
        </div>
        <div className="flex-1 space-y-2">
          {CODE_LINE_WIDTHS.map((width, index) => (
            <Skeleton
              key={index}
              className="h-3"
              style={{ width }}
            />
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export function FileTreeSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
          style={{ paddingLeft: `${(index % 3) * 12}px` }}
        >
          <Skeleton className="size-3.5 shrink-0 rounded-sm" />
          <Skeleton
            className="h-3"
            style={{ width: `${48 + (index % 4) * 12}%` }}
          />
        </div>
      ))}
      <p className="pt-3 text-center text-xs text-muted-foreground">
        Scanning project structure...
      </p>
    </div>
  );
}

export function DiagramPanelSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-3 w-32" />
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mx-auto flex max-w-[220px] flex-col items-center gap-4">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-px w-full" />
          <div className="flex w-full justify-between gap-3">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Generating flowchart...
      </p>
    </div>
  );
}

export function ExplanationPanelSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-3 w-28" />
      <div className="space-y-2 rounded-lg border border-border bg-background p-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-[88%]" />
        <Skeleton className="h-3 w-[76%]" />
        <Skeleton className="h-3 w-[84%]" />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Writing explanation...
      </p>
    </div>
  );
}

export function DiagramImageSkeleton() {
  return (
    <div className="space-y-3 p-1">
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mx-auto flex max-w-[220px] flex-col items-center gap-4 py-4">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-px w-full" />
          <div className="flex w-full justify-between gap-3">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Rendering diagram...
      </p>
    </div>
  );
}
