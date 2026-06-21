import Link from "next/link";

import { GITHUB_URL, SITE_URL } from "@/lib/site";

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-muted-foreground">
          Local-first by design — folder files stay on your machine.
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <a
            href={SITE_URL}
            className="transition-colors hover:text-foreground"
          >
            Live demo
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
