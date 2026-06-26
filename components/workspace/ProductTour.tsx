"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import type { TourStep } from "@/lib/workspace/tour-steps";

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type ProductTourProps = {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
};

function getSpotlightRect(targetId: string): SpotlightRect | null {
  const element = document.querySelector(`[data-tour-id="${targetId}"]`);

  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const padding = 8;

  return {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

export function ProductTour({
  steps,
  isActive,
  onComplete,
  onSkip,
}: ProductTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex >= steps.length - 1;

  const updateSpotlight = useCallback(() => {
    if (!isActive || !currentStep) {
      setSpotlight(null);
      return;
    }

    setSpotlight(getSpotlightRect(currentStep.target));
  }, [isActive, currentStep]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setStepIndex(0);
      setSpotlight(null);
      return;
    }

    updateSpotlight();

    const handleResize = () => updateSpotlight();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    const retryId = window.setTimeout(updateSpotlight, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
      window.clearTimeout(retryId);
    };
  }, [isActive, stepIndex, updateSpotlight]);

  if (!mounted || !isActive || !currentStep) {
    return null;
  }

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }

    setStepIndex((index) => index + 1);
  };

  const tooltipTop = spotlight
    ? Math.min(spotlight.top + spotlight.height + 16, window.innerHeight - 200)
    : window.innerHeight / 2 - 80;
  const tooltipLeft = spotlight
    ? Math.min(Math.max(spotlight.left, 16), window.innerWidth - 336)
    : window.innerWidth / 2 - 160;

  return createPortal(
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        onClick={onSkip}
        aria-hidden
      />

      {spotlight ? (
        <div
          className="pointer-events-none absolute rounded-xl border-2 border-[#14d1a0] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-300"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
        />
      ) : null}

      <div
        className="absolute w-80 rounded-2xl border border-white/[0.1] bg-[#1c1c1c] p-5 shadow-2xl shadow-black/40"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#14d1a0]">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h3 className="mt-1 text-base font-semibold text-[#e3e3e3]">
          {currentStep.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#e3e3e3]/60">
          {currentStep.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-xs text-[#e3e3e3]/60"
            onClick={onSkip}
          >
            Skip tour
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-full px-4 text-xs premium-btn-primary"
            onClick={handleNext}
          >
            {isLastStep ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
