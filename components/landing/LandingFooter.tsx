import Link from "next/link";

import { GITHUB_URL, SITE_URL } from "@/lib/site";

export function LandingFooter() {
  return (
    <footer className="relative border-t border-white/80 bg-white/60 px-6 py-8 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-slate-500">
          Local-first by design. Folder files stay on your machine.
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-500">
          <a
            href={SITE_URL}
            className="transition-colors hover:text-slate-950"
          >
            Live demo
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-950"
          >
            GitHub
          </a>
          <Link href="/privacy" className="transition-colors hover:text-slate-950">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
