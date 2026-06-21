"use client";

import { MAX_FILE_SIZE_BYTES } from "@/lib/file-system/constants";
import { formatFileSize } from "@/lib/file-system/format-bytes";
import { PASTE_LANGUAGE_OPTIONS } from "@/components/workspace/types";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function PastePanel() {
  const { pastedCode, pastedLanguage, setPastedCode, setPastedLanguage } =
    useWorkspace();

  const byteLength = new TextEncoder().encode(pastedCode).length;
  const isOverLimit = byteLength > MAX_FILE_SIZE_BYTES;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-white/70 px-4 py-3">
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
        className="min-h-0 flex-1 resize-none bg-white/80 p-6 font-mono text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400"
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
