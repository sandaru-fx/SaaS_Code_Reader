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
        "flex flex-col items-center justify-center gap-2 p-6 text-center",
        className
      )}
    >
      <Icon
        className={cn("size-8 text-muted-foreground/40", iconClassName)}
      />
      <p className="text-sm text-muted-foreground">{title}</p>
      {description ? (
        <p className="max-w-xs text-xs text-muted-foreground/70">
          {description}
        </p>
      ) : null}
    </div>
  );
}
