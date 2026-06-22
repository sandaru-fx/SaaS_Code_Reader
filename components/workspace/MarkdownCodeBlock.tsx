"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MarkdownCodeBlockProps = {
  code: string;
  language: string;
  variant?: "card" | "inline";
};

function getShikiTheme(): string {
  if (typeof document !== "undefined" && document.querySelector(".dark")) {
    return "github-dark";
  }

  return "github-light";
}

function normalizeLanguage(language: string): string {
  const normalized = language.toLowerCase();

  if (normalized === "plaintext") {
    return "text";
  }

  const aliases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    sh: "bash",
    shell: "bash",
    yml: "yaml",
    md: "markdown",
  };

  return aliases[normalized] ?? normalized;
}

export function MarkdownCodeBlock({
  code,
  language,
  variant = "inline",
}: MarkdownCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      setIsHighlighting(true);
      const { codeToHtml } = await import("shiki");
      const theme = getShikiTheme();
      const lang = normalizeLanguage(language);

      try {
        const result = await codeToHtml(code, { lang, theme });
        if (!cancelled) {
          setHtml(result);
        }
        return;
      } catch {
        try {
          const result = await codeToHtml(code, { lang: "text", theme });
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
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/95 dark:border-white/[0.08]",
        variant === "card" ? "my-4" : "my-2"
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 dark:border-white/[0.06]">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
          {normalizeLanguage(language)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:bg-white/10 hover:text-slate-200"
          onClick={() => void handleCopy()}
          aria-label={copied ? "Copied code" : "Copy code"}
        >
          {copied ? (
            <Check className="size-3.5 text-[#14d1a0]" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>

      {html ? (
        <div
          className={cn(
            "overflow-x-auto [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-3",
            "[&_code]:font-mono [&_code]:text-xs [&_code]:leading-5"
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-3 font-mono text-xs leading-5 text-slate-100">
          <code>{code}</code>
        </pre>
      )}

      {isHighlighting ? (
        <div className="absolute right-3 top-10 flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400">
          <Loader2 className="size-3 animate-spin" />
          Highlighting
        </div>
      ) : null}
    </div>
  );
}
