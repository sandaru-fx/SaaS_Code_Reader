"use client";

import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE_BYTES } from "@/lib/file-system/constants";
import { formatFileSize } from "@/lib/file-system/format-bytes";
import { PASTE_LANGUAGE_OPTIONS } from "@/components/workspace/types";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function PastePanel() {
  const {
    pastedCode,
    pastedLanguage,
    setPastedCode,
    setPastedLanguage,
    showPasteHint,
    dismissPasteHintPanel,
  } = useWorkspace();

  const byteLength = new TextEncoder().encode(pastedCode).length;
  const isOverLimit = byteLength > MAX_FILE_SIZE_BYTES;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {showPasteHint ? (
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#14d1a0]/20 bg-[#14d1a0]/10 px-4 py-3 dark:bg-[#14d1a0]/[0.08]">
          <div className="min-w-0 text-left">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#14d1a0]">
              <Sparkles className="size-3.5" strokeWidth={1.75} />
              Quick Paste — 2 steps
            </p>
            <p className="mt-1 text-xs leading-5 text-[#e3e3e3]/70">
              1. Paste your code below &nbsp;·&nbsp; 2. Click Analyze in the top
              bar
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 shrink-0 rounded-full p-0 text-[#e3e3e3]/60"
            onClick={dismissPasteHintPanel}
            aria-label="Dismiss paste hint"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : null}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-white/70 px-4 py-3 dark:border-white/[0.06] dark:bg-[#121212]/80">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          Language
          <select
            value={pastedLanguage}
            onChange={(event) => setPastedLanguage(event.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 shadow-sm outline-none transition focus:border-slate-400"
          >
            {PASTE_LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>

        <span
          className={`ml-auto rounded-full px-2.5 py-1 text-[11px] ${
            isOverLimit
              ? "bg-red-50 text-destructive"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {formatFileSize(byteLength)} / {formatFileSize(MAX_FILE_SIZE_BYTES)}
        </span>
      </div>

      <textarea
        value={pastedCode}
        onChange={(event) => setPastedCode(event.target.value)}
        placeholder="Paste your code snippet here..."
        spellCheck={false}
        className="min-h-0 flex-1 resize-none bg-white/80 p-6 font-mono text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 dark:bg-[#0f0f0f] dark:text-[#e3e3e3] dark:placeholder:text-[#e3e3e3]/35"
      />

      {isOverLimit ? (
        <p className="shrink-0 border-t border-border px-4 py-2 text-xs text-destructive">
          Snippet exceeds the {formatFileSize(MAX_FILE_SIZE_BYTES)} limit.
          Shorten the code before analyzing.
        </p>
      ) : null}
    </div>
  );
}
