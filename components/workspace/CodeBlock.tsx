"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

type CodeBlockProps = {
  content: string;
  language: string;
};

function getEditorTheme(): string {
  if (typeof window === "undefined") {
    return "github-light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "github-dark"
    : "github-light";
}

function normalizeLanguage(language: string): string {
  if (language === "plaintext") {
    return "text";
  }

  return language;
}

export function CodeBlock({ content, language }: CodeBlockProps) {
  return (
    <CodeBlockContent
      key={`${language}:${content}`}
      content={content}
      language={language}
    />
  );
}

function CodeBlockContent({ content, language }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(true);
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openChat } = useWorkspace();
  const lines = content.length > 0 ? content.split("\n") : [""];

  useEffect(() => {
    const handleSelectionChange = () => {
      const activeSelection = window.getSelection();
      if (!activeSelection || activeSelection.isCollapsed) {
        setSelection(null);
        return;
      }

      const text = activeSelection.toString().trim();
      if (!text) {
        setSelection(null);
        return;
      }

      // Check if selection is within our container
      if (containerRef.current && containerRef.current.contains(activeSelection.anchorNode)) {
        const range = activeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Position the button slightly above and centered on the selection
        setSelection({
          text,
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      } else {
        setSelection(null);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      const { codeToHtml } = await import("shiki");
      const theme = getEditorTheme();
      const lang = normalizeLanguage(language);

      try {
        const result = await codeToHtml(content, { lang, theme });
        if (!cancelled) {
          setHtml(result);
        }
        return;
      } catch {
        try {
          const result = await codeToHtml(content, { lang: "text", theme });
          if (!cancelled) {
            setHtml(result);
          }
        } catch {
          if (!cancelled) {
            setHtml(null);
          }
        }
      } finally {
        if (!cancelled) {
          setIsHighlighting(false);
        }
      }
    }

    void highlight();

    return () => {
      cancelled = true;
    };
  }, [content, language]);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden" ref={containerRef}>
      <div className="hidden w-12 shrink-0 border-r border-border bg-muted/40 sm:block">
        <div className="flex flex-col items-end gap-0 px-2 py-4 font-mono text-[10px] leading-5 text-muted-foreground/50">
          {lines.map((_, index) => (
            <span key={index + 1}>{index + 1}</span>
          ))}
        </div>
      </div>

      <ScrollArea className="relative min-h-0 flex-1">
        {html ? (
          <div
            className={cn(
              "code-block text-xs leading-5",
              "[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent [&_pre]:p-4",
              "[&_code]:font-mono [&_code]:text-xs [&_code]:leading-5"
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="p-4 font-mono text-xs leading-5 text-foreground/90">
            <code>{content}</code>
          </pre>
        )}

        {isHighlighting ? (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-border bg-background/90 px-2 py-1 text-[10px] text-muted-foreground shadow-sm">
            <Loader2 className="size-3 animate-spin" />
            Highlighting
          </div>
        ) : null}

        {selection && (
          <div
            className="fixed z-50 -translate-x-1/2 -translate-y-full pb-2"
            style={{ left: selection.x, top: selection.y }}
          >
            <Button
              size="sm"
              className="h-8 gap-1.5 rounded-full bg-slate-900 px-3 text-xs font-medium text-white shadow-lg hover:bg-slate-800 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
              onClick={() => {
                openChat({ type: "code", content: selection.text });
                setSelection(null);
                window.getSelection()?.removeAllRanges();
              }}
            >
              <Sparkles className="size-3.5" />
              Ask AI
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
