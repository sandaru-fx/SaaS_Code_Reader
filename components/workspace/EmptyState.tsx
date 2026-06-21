import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  iconClassName?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Icon className={cn("size-7 text-slate-400", iconClassName)} />
      </div>
      <p className="text-sm font-medium text-slate-800">{title}</p>
      {description ? (
        <p className="max-w-xs text-xs leading-5 text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}
