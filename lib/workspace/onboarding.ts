export const ONBOARDING_DISMISSED_KEY = "coderider-onboarding-dismissed";

export function isOnboardingDismissed(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return window.localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "true";
}

export function dismissOnboarding(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
}
