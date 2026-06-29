"use client";

import { useEffect, useId, useState } from "react";

import { buildFallbackDiagram } from "@/lib/mermaid/fallback-diagram";
import { getMermaidConfig } from "@/lib/mermaid/mermaid-theme";
import { prepareMermaidForRender } from "@/lib/mermaid/prepare-diagram";

type RenderState =
  | { status: "loading" }
  | { status: "ready"; svg: string; source: string; usedFallback: boolean }
  | { status: "error"; message: string; source: string };

function isDarkMode(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
}

async function renderMermaidSource(source: string, renderId: string): Promise<string> {
  const mermaid = (await import("mermaid")).default;
  mermaid.initialize(getMermaidConfig(isDarkMode()));
  const { svg } = await mermaid.render(renderId, source);
  return svg;
}

export function useMermaidDiagram(
  raw: string,
  fallbackCode?: string,
  fallbackFileName?: string
): RenderState {
  const baseId = useId().replace(/:/g, "");
  const [state, setState] = useState<RenderState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    async function render() {
      const prepared = prepareMermaidForRender(raw);
      const attempts: Array<{ source: string; usedFallback: boolean }> = [
        { source: prepared, usedFallback: false },
      ];

      if (fallbackCode?.trim()) {
        attempts.push({
          source: prepareMermaidForRender(
            buildFallbackDiagram(fallbackCode, { fileName: fallbackFileName })
          ),
          usedFallback: true,
        });
      }

      for (let index = 0; index < attempts.length; index += 1) {
        const attempt = attempts[index];

        try {
          const svg = await renderMermaidSource(
            attempt.source,
            `coderider-mermaid-${baseId}-${index}`
          );

          if (!cancelled) {
            setState({
              status: "ready",
              svg,
              source: attempt.source,
              usedFallback: attempt.usedFallback,
            });
          }

          return;
        } catch {
          continue;
        }
      }

      if (!cancelled) {
        setState({
          status: "error",
          message: "Diagram could not be rendered.",
          source: prepared,
        });
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [raw, fallbackCode, fallbackFileName, baseId]);

  return state;
}
