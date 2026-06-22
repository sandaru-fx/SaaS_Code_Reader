"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { buildMermaidInkUrl, sanitizeMermaid } from "@/lib/mermaid";
import { downloadFromUrl } from "@/lib/workspace/download-file";
import { DiagramImageSkeleton } from "@/components/workspace/LoadingSkeletons";

type MermaidDiagramProps = {
  mermaid: string;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

function MermaidSource({ source }: { source: string }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
      <summary className="cursor-pointer text-xs font-medium text-slate-500">
        View Mermaid source
      </summary>
      <pre className="mt-2 max-h-48 overflow-auto font-mono text-[11px] leading-5 text-slate-700">
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
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center">
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
  mermaidSource,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleFullscreen,
}: {
  zoom: number;
  isFullscreen: boolean;
  mermaidSource: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: "img" | "svg") => {
    const result = buildMermaidInkUrl(mermaidSource, format);

    if (!result.success) {
      return;
    }

    setIsDownloading(true);

    try {
      const extension = format === "svg" ? "svg" : "png";
      const filename = `coderider-diagram.${extension}`;
      const downloaded = await downloadFromUrl(result.url, filename);

      if (!downloaded) {
        window.open(result.url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/90 p-1.5 dark:border-slate-700 dark:bg-slate-800/90">
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
        <span className="min-w-12 text-center text-xs font-medium text-slate-600">
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
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg px-2 text-xs"
          disabled={isDownloading}
          onClick={() => void handleDownload("img")}
        >
          <Download className="size-3.5" />
          PNG
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg px-2 text-xs"
          disabled={isDownloading}
          onClick={() => void handleDownload("svg")}
        >
          <Download className="size-3.5" />
          SVG
        </Button>
      </div>
    </div>
  );
}

export function MermaidDiagram({ mermaid }: MermaidDiagramProps) {
  const sanitizedSource = useMemo(() => sanitizeMermaid(mermaid), [mermaid]);
  const diagram = useMemo(
    () => buildMermaidInkUrl(mermaid, "svg"),
    [mermaid]
  );

  if (!diagram.success) {
    return (
      <DiagramError message={diagram.error} source={sanitizedSource || mermaid} />
    );
  }

  return (
    <div className="space-y-3">
      <MermaidDiagramCanvas
        key={diagram.url}
        url={diagram.url}
        source={diagram.sanitized}
        mermaidSource={mermaid}
      />
      <MermaidSource source={diagram.sanitized} />
    </div>
  );
}

function MermaidDiagramCanvas({
  url,
  source,
  mermaidSource,
}: {
  url: string;
  source: string;
  mermaidSource: string;
}) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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

  if (imageError) {
    return (
      <DiagramError
        message="Diagram could not be rendered. The Mermaid syntax may be invalid."
        source={source}
      />
    );
  }

  const canvas = (
    <>
      <DiagramToolbar
        zoom={zoom}
        isFullscreen={isFullscreen}
        mermaidSource={mermaidSource}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
        onToggleFullscreen={toggleFullscreen}
      />
      <div
        className={`overflow-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 ${
          isFullscreen ? "max-h-[calc(100vh-8rem)] flex-1" : "max-h-[min(80vh,640px)] min-h-[400px]"
        }`}
      >
        <div className="flex min-h-full min-w-full items-start justify-center p-4">
          {isImageLoading ? <DiagramImageSkeleton /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Generated architecture flowchart"
            className={`max-w-none origin-top transition-transform duration-150 ${
              isImageLoading ? "hidden" : "block"
            }`}
            style={{ transform: `scale(${zoom})` }}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setIsImageLoading(false);
              setImageError(true);
            }}
          />
        </div>
      </div>
    </>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 p-4 backdrop-blur-sm">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3">
          {canvas}
        </div>
      </div>
    );
  }

  return <div className="space-y-3">{canvas}</div>;
}
