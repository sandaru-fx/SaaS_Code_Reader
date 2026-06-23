import Link from "next/link";

import { GithubIcon, TwitterIcon } from "@/components/landing/BrandIcons";

import { Logo } from "@/components/landing/Logo";
import { GITHUB_URL, SITE_NAME } from "@/lib/site";

const LINK_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Workspace", href: "/workspace" },
      { label: "Quick Paste", href: "/workspace?mode=paste" },
      { label: "Pricing", href: "/pricing" },
      { label: "Features", href: "/#features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", href: GITHUB_URL, external: true },
      { label: "Live demo", href: "/#live-demo" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/privacy" },
      { label: "Contact", href: GITHUB_URL, external: true },
    ],
  },
] as const;

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.05] bg-[#06080a]">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-[13.5px] leading-6 text-white/55">
              Visual code understanding for developers. Open folders locally,
              analyze with AI, see the architecture you couldn't see before.
            </p>
            <div className="flex items-center gap-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/[0.04] text-white/55 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <GithubIcon className="size-4" strokeWidth={1.75} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/[0.04] text-white/55 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <TwitterIcon className="size-4" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {LINK_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] text-white/55 transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[13px] text-white/55 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-white/[0.05] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {year} {SITE_NAME}. Local-first by design.
          </p>
          <p className="text-xs text-white/40">
            Built with Next.js · Gemini · Mermaid · Shiki
          </p>
        </div>
      </div>
    </footer>
  );
}
