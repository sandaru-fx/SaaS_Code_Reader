"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

import { GithubIcon } from "@/components/landing/BrandIcons";

import { Logo } from "@/components/landing/Logo";
import { isClerkPublishableKeySet } from "@/lib/clerk/is-configured";
import { GITHUB_URL } from "@/lib/site";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

const STANDALONE_NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;

function NavLinks({
  onSelect,
  standalone = false,
}: {
  onSelect?: () => void;
  standalone?: boolean;
}) {
  const links = standalone ? STANDALONE_NAV_LINKS : NAV_LINKS;

  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onSelect}
          className="text-sm font-medium text-white/65 transition-colors hover:text-white"
        >
          {link.label}
        </a>
      ))}
    </>
  );
}

function AuthActions() {
  const clerkConfigured = isClerkPublishableKeySet();

  if (!clerkConfigured) {
    return (
      <Link
        href="/workspace"
        className="landing-btn-primary inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold"
      >
        Open Workspace
      </Link>
    );
  }

  return <AuthActionsWithClerk />;
}

function AuthActionsWithClerk() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-9 w-32" aria-hidden />;
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/workspace"
          className="landing-btn-primary inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold"
        >
          Open Workspace
        </Link>
        <UserButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/sign-in"
        className="hidden h-9 items-center justify-center rounded-full px-4 text-sm font-medium text-white/70 transition-colors hover:text-white sm:inline-flex"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="landing-btn-primary inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold"
      >
        Get Started Free
      </Link>
    </div>
  );
}

export function LandingNav({ standalone = false }: { standalone?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = standalone ? STANDALONE_NAV_LINKS : NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#07090b]/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex">
            <NavLinks standalone={standalone} />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white sm:inline-flex"
            aria-label="GitHub"
          >
            <GithubIcon className="size-4" strokeWidth={1.75} />
          </a>
          <div className="hidden sm:flex">
            <AuthActions />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="inline-flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white sm:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" strokeWidth={1.75} />
            ) : (
              <Menu className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/[0.06] bg-[#07090b]/95 backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-5">
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <GithubIcon className="size-4" strokeWidth={1.75} />
                GitHub
              </a>
            </nav>
            <div className="mt-3 flex w-full">
              <AuthActions />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
