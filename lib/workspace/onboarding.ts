export const ONBOARDING_DISMISSED_KEY = "coderider-onboarding-dismissed";
export const TOUR_COMPLETED_KEY = "coderider-tour-completed";
export const MODE_CHOSEN_KEY = "coderider-mode-chosen";
export const PASTE_HINT_DISMISSED_KEY = "coderider-paste-hint-dismissed";

function readStorage(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}

export function isOnboardingDismissed(): boolean {
  return readStorage(ONBOARDING_DISMISSED_KEY) === "true";
}

export function dismissOnboarding(): void {
  writeStorage(ONBOARDING_DISMISSED_KEY, "true");
}

export function isTourCompleted(): boolean {
  return readStorage(TOUR_COMPLETED_KEY) === "true";
}

export function markTourCompleted(): void {
  writeStorage(TOUR_COMPLETED_KEY, "true");
}

export function resetTour(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOUR_COMPLETED_KEY);
}

export function hasChosenMode(): boolean {
  return readStorage(MODE_CHOSEN_KEY) === "true";
}

export function markModeChosen(): void {
  writeStorage(MODE_CHOSEN_KEY, "true");
}

export function isPasteHintDismissed(): boolean {
  return readStorage(PASTE_HINT_DISMISSED_KEY) === "true";
}

export function dismissPasteHint(): void {
  writeStorage(PASTE_HINT_DISMISSED_KEY, "true");
}
