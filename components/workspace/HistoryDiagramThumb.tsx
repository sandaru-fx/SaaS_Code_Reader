"use client";

import { useMemo, useState } from "react";
import { GitBranch } from "lucide-react";

import { buildMermaidInkUrl } from "@/lib/mermaid";

type HistoryDiagramThumbProps = {
  mermaid?: string | null;
};

export function HistoryDiagramThumb({ mermaid }: HistoryDiagramThumbProps) {
  const diagram = useMemo(
    () => (mermaid ? buildMermaidInkUrl(mermaid, "svg") : null),
    [mermaid]
  );
  const [hasError, setHasError] = useState(false);

  if (!diagram?.success || hasError) {
    return (
      <div className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <GitBranch className="size-5 text-slate-300" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={diagram.url}
        alt=""
        className="h-20 w-full object-contain object-center p-2"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
