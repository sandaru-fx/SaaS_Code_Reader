"use client";

import { MAX_FILE_SIZE_BYTES } from "@/lib/file-system/constants";
import { PASTE_LANGUAGE_OPTIONS } from "@/components/workspace/types";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function PastePanel() {
  const { pastedCode, pastedLanguage, setPastedCode, setPastedLanguage } =
    useWorkspace();

  const byteLength = new TextEncoder().encode(pastedCode).length;
  const isOverLimit = byteLength > MAX_FILE_SIZE_BYTES;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border px-4 py-2">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Language
          <select
            value={pastedLanguage}
            onChange={(event) => setPastedLanguage(event.target.value)}
            className="h-8 rounded-md border border-border bg-background px-2 font-mono text-xs text-foreground capitalize"
          >
            {PASTE_LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>

        <span
          className={`ml-auto text-[10px] ${
            isOverLimit ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {byteLength.toLocaleString()} / {MAX_FILE_SIZE_BYTES.toLocaleString()}{" "}
          bytes
        </span>
      </div>

      <textarea
        value={pastedCode}
        onChange={(event) => setPastedCode(event.target.value)}
        placeholder="Paste your code snippet here..."
        spellCheck={false}
        className="min-h-0 flex-1 resize-none bg-background/80 p-4 font-mono text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
      />

      {isOverLimit ? (
        <p className="shrink-0 border-t border-border px-4 py-2 text-xs text-destructive">
          Snippet exceeds the 100KB limit. Shorten the code before analyzing.
        </p>
      ) : null}
    </div>
  );
}
