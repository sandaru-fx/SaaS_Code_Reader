"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Download,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMermaidDiagram } from "@/components/workspace/useMermaidDiagram";
import { DiagramImageSkeleton } from "@/components/workspace/LoadingSkeletons";
import { downloadTextFile } from "@/lib/workspace/download-file";

type MermaidDiagramProps = {
  mermaid: string;
  fallbackCode?: string;
  fallbackFileName?: string;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

function MermaidSource({ source }: { source: string }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <summary className="cursor-pointer text-xs font-medium text-slate-500 dark:text-[#e3e3e3]/60">
        View Mermaid source
      </summary>
      <pre className="mt-2 max-h-48 overflow-auto font-mono text-[11px] leading-5 text-slate-700 dark:text-[#e3e3e3]/80">
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
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-white/[0.08] dark:bg-[#161616]">
        <AlertCircle className="size-6 text-destructive/70" />
        <p className="text-sm text-destructive">{message}</p>
      </div>
      <MermaidSource source={source} />
    </div>
  );
}

function DiagramToolbar({
  zoom,
  isFullscreen,
  svg,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleFullscreen,
}: {
  zoom: number;
  isFullscreen: boolean;
  svg: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
}) {
  const handleDownloadSvg = () => {
    downloadTextFile(svg, "coderider-diagram.svg");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/90 p-1.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 rounded-lg p-0"
          onClick={onZoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
        >
          <ZoomOut className="size-4" />
        </Button>
        <span className="min-w-12 text-center text-xs font-medium text-slate-600 dark:text-[#e3e3e3]/70">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 rounded-lg p-0"
          onClick={onZoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
        >
          <ZoomIn className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 rounded-lg p-0"
          onClick={onReset}
          aria-label="Reset zoom"
        >
          <RotateCcw className="size-4" />
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 rounded-lg px-2 text-xs"
        onClick={onToggleFullscreen}
      >
        {isFullscreen ? (
          <>
            <Minimize2 className="size-4" />
            Exit
          </>
        ) : (
          <>
            <Maximize2 className="size-4" />
            Fullscreen
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 rounded-lg px-2 text-xs"
        onClick={handleDownloadSvg}
      >
        <Download className="size-3.5" />
        SVG
      </Button>
    </div>
  );
}

export function MermaidDiagram({
  mermaid,
  fallbackCode,
  fallbackFileName,
}: MermaidDiagramProps) {
  const renderState = useMermaidDiagram(mermaid, fallbackCode, fallbackFileName);

  if (renderState.status === "loading") {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-[#161616]">
          <DiagramImageSkeleton />
        </div>
      </div>
    );
  }

  if (renderState.status === "error") {
    return (
      <DiagramError message={renderState.message} source={renderState.source} />
    );
  }

  return (
    <div className="space-y-3">
      {renderState.usedFallback ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Showing a simplified diagram because the AI-generated syntax could not
          be rendered.
        </p>
      ) : null}
      <MermaidDiagramCanvas
        svg={renderState.svg}
        source={renderState.source}
      />
      <MermaidSource source={renderState.source} />
    </div>
  );
}

function MermaidDiagramCanvas({
  svg,
  source,
}: {
  svg: string;
  source: string;
}) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const zoomIn = useCallback(() => {
    setZoom((current) => Math.min(MAX_ZOOM, current + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((current) => Math.max(MIN_ZOOM, current - ZOOM_STEP));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isFullscreen]);

  const canvas = (
    <>
      <DiagramToolbar
        zoom={zoom}
        isFullscreen={isFullscreen}
        svg={svg}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
        onToggleFullscreen={toggleFullscreen}
      />
      <div
        className={`overflow-auto rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/80 p-4 dark:border-white/[0.08] dark:from-[#0f1f1a] dark:via-[#121212] dark:to-[#101827] ${
          isFullscreen ? "max-h-[calc(100vh-8rem)] flex-1" : "max-h-[min(80vh,640px)] min-h-[400px]"
        }`}
      >
        <div
          className="mx-auto min-w-full origin-top transition-transform duration-150 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-none"
          style={{ transform: `scale(${zoom})` }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 p-4 backdrop-blur-sm">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3">
          {canvas}
          <MermaidSource source={source} />
        </div>
      </div>
    );
  }

  return <div className="space-y-3">{canvas}</div>;
}
