"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import { buildMermaidInkUrl, sanitizeMermaid } from "@/lib/mermaid";
import { DiagramImageSkeleton } from "@/components/workspace/LoadingSkeletons";

type MermaidDiagramProps = {
  mermaid: string;
};

function MermaidSource({ source }: { source: string }) {
  return (
    <details className="rounded-lg border border-border bg-muted/30 p-3">
      <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
        View Mermaid source
      </summary>
      <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-5 text-foreground/90">
        {source}
      </pre>
    </details>
  );
}

function DiagramError({
  message,
  source,
}: {
  message: string;
  source: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 text-center">
        <AlertCircle className="size-6 text-destructive/70" />
        <p className="text-sm text-destructive">{message}</p>
      </div>
      <MermaidSource source={source} />
    </div>
  );
}

export function MermaidDiagram({ mermaid }: MermaidDiagramProps) {
  const sanitizedSource = useMemo(() => sanitizeMermaid(mermaid), [mermaid]);
  const diagram = useMemo(() => buildMermaidInkUrl(mermaid), [mermaid]);

  if (!diagram.success) {
    return (
      <DiagramError message={diagram.error} source={sanitizedSource || mermaid} />
    );
  }

  return (
    <div className="space-y-3">
      <MermaidDiagramImage key={diagram.url} url={diagram.url} />
      <MermaidSource source={diagram.sanitized} />
    </div>
  );
}

function MermaidDiagramImage({ url }: { url: string }) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 text-center">
        <AlertCircle className="size-6 text-destructive/70" />
        <p className="text-sm text-destructive">
          Diagram could not be rendered. The Mermaid syntax may be invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-background">
      {isImageLoading ? <DiagramImageSkeleton /> : null}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Generated architecture flowchart"
        className={`h-auto w-full max-w-full ${isImageLoading ? "hidden" : "block"}`}
        onLoad={() => setIsImageLoading(false)}
        onError={() => {
          setIsImageLoading(false);
          setImageError(true);
        }}
      />
    </div>
  );
}
