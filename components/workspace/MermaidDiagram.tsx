"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { buildMermaidInkUrl } from "@/lib/mermaid";

type MermaidDiagramProps = {
  mermaid: string;
};

export function MermaidDiagram({ mermaid }: MermaidDiagramProps) {
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
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 text-center">
        <AlertCircle className="size-6 text-destructive/70" />
        <p className="text-sm text-destructive">{diagram.error}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-background">
      {isImageLoading && !imageError ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-6">
          <Loader2 className="size-6 animate-spin text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground">Rendering diagram...</p>
        </div>
      ) : null}

      {imageError ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-6 text-center">
          <AlertCircle className="size-6 text-destructive/70" />
          <p className="text-sm text-destructive">
            Diagram could not be rendered. The Mermaid syntax may be invalid.
          </p>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
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
      )}
    </div>
  );
}
