"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { buildMermaidInkUrl, sanitizeMermaid } from "@/lib/mermaid";

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
  const imageUrl = diagram.success ? diagram.url : null;
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsImageLoading(true);
    setImageError(false);
  }, [imageUrl]);

  if (!diagram.success) {
    return (
      <DiagramError message={diagram.error} source={sanitizedSource || mermaid} />
    );
  }

  if (imageError) {
    return (
      <DiagramError
        message="Diagram could not be rendered. The Mermaid syntax may be invalid."
        source={diagram.sanitized}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-lg border border-border bg-background">
        {isImageLoading ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-6">
            <Loader2 className="size-6 animate-spin text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">Rendering diagram...</p>
          </div>
        ) : null}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={diagram.url}
          alt="Generated architecture flowchart"
          className={`h-auto w-full max-w-full ${isImageLoading ? "hidden" : "block"}`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setIsImageLoading(false);
            setImageError(true);
          }}
        />
      </div>

      <MermaidSource source={diagram.sanitized} />
    </div>
  );
}
