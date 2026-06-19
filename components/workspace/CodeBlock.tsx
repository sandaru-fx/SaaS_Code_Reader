"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
  const [html, setHtml] = useState<string | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(true);
  const lines = content.length > 0 ? content.split("\n") : [""];

  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    setIsHighlighting(true);

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
    <div className="flex min-h-0 flex-1 overflow-hidden">
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
      </ScrollArea>
    </div>
  );
}
