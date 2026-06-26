import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateAction = {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline";
};

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  iconClassName?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
        <Icon
          className={cn("size-7 text-slate-400 dark:text-[#e3e3e3]/40", iconClassName)}
        />
      </div>
      <p className="text-sm font-medium text-slate-800 dark:text-[#e3e3e3]">
        {title}
      </p>
      {description ? (
        <p className="max-w-xs text-xs leading-5 text-slate-500 dark:text-[#e3e3e3]/55">
          {description}
        </p>
      ) : null}
      {action || secondaryAction ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action ? (
            <Button
              type="button"
              size="sm"
              variant={action.variant ?? "default"}
              className={
                action.variant === "outline"
                  ? "rounded-full dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
                  : "rounded-full premium-btn-primary"
              }
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button
              type="button"
              size="sm"
              variant={secondaryAction.variant ?? "outline"}
              className="rounded-full dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
