"use client";

import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

type ResizeHandleProps = {
  onResize: (delta: number) => void;
  className?: string;
};

export function ResizeHandle({ onResize, className }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);

      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);

      let lastX = event.clientX;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - lastX;
        lastX = moveEvent.clientX;

        if (delta !== 0) {
          onResize(delta);
        }
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        handle.releasePointerCapture(event.pointerId);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [onResize]
  );

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panel"
      onPointerDown={handlePointerDown}
      className={cn(
        "group relative z-10 w-1.5 shrink-0 cursor-col-resize touch-none",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-200 transition-colors group-hover:bg-blue-400",
          isDragging && "bg-blue-500"
        )}
      />
    </div>
  );
}
