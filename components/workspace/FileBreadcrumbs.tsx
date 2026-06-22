import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type FileBreadcrumbsProps = {
  projectName?: string | null;
  filePath?: string | null;
  className?: string;
};

export function FileBreadcrumbs({
  projectName,
  filePath,
  className,
}: FileBreadcrumbsProps) {
  const segments = [
    ...(projectName ? [projectName] : []),
    ...(filePath ? filePath.split("/").filter(Boolean) : []),
  ];

  if (segments.length === 0) {
    return (
      <span className={cn("truncate text-xs font-medium text-slate-500 dark:text-[#e3e3e3]/45", className)}>
        No file selected
      </span>
    );
  }

  return (
    <nav
      aria-label="File path"
      className={cn("flex min-w-0 items-center gap-1", className)}
    >
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;

        return (
          <span key={`${segment}-${index}`} className="flex min-w-0 items-center gap-1">
            {index > 0 ? (
              <ChevronRight className="size-3 shrink-0 text-slate-300 dark:text-[#e3e3e3]/30" strokeWidth={1.5} />
            ) : null}
            <span
              className={cn(
                "truncate font-mono text-xs",
                isLast
                  ? "font-medium text-slate-800 dark:text-[#e3e3e3]"
                  : "text-slate-500 dark:text-[#e3e3e3]/55"
              )}
              title={segment}
            >
              {segment}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
