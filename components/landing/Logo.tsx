import Link from "next/link";

type LogoProps = {
  href?: string;
  showWordmark?: boolean;
};

export function Logo({ href = "/", showWordmark = true }: LogoProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight"
      aria-label="CodeRider home"
    >
      <span className="landing-logo-mark transition-transform group-hover:rotate-[-6deg]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 4h6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H5z" />
          <path d="M11 12l8 8" />
          <circle cx="6" cy="18" r="2" />
        </svg>
      </span>
      {showWordmark ? (
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">
          CodeRider
        </span>
      ) : null}
    </Link>
  );
}
