type IconProps = {
  className?: string;
  strokeWidth?: number;
};

export function GithubIcon({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5A10.3 10.3 0 0 0 12 4.8c-1.16 0-2.33.15-3.45.45C6.5 3.3 5.5 3.3 5.5 3.3c-.28 1.15-.28 2.35 0 3.5A4.17 4.17 0 0 0 4.5 10.5C4.5 14 7.5 16 10.5 16a4.8 4.8 0 0 0-1 3.5v4" />
      <path d="M9 20c-5 1.5-5-2.5-7-3" />
    </svg>
  );
}

export function TwitterIcon({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 4l16 16" />
      <path d="M20 4 4 20" />
      <path d="M9.5 4H4v5.5" />
      <path d="M20 14.5V20h-5.5" />
      <path d="M4 9.5V4h5.5" />
      <path d="M14.5 20H20v-5.5" />
    </svg>
  );
}
