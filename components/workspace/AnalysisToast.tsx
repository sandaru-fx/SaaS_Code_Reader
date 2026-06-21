"use client";

import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function AnalysisToast() {
  const { analysisToast, dismissAnalysisToast } = useWorkspace();

  if (!analysisToast) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl shadow-slate-950/10">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900">
            {analysisToast.title}
          </p>
          {analysisToast.description ? (
            <p className="mt-0.5 text-xs text-slate-500">
              {analysisToast.description}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 shrink-0 rounded-full p-0 text-slate-400 hover:text-slate-700"
          onClick={dismissAnalysisToast}
          aria-label="Dismiss notification"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
