"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";

import { GithubIcon } from "@/components/landing/BrandIcons";

import { useReveal } from "@/components/landing/useReveal";
import { GITHUB_URL } from "@/lib/site";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  initials: string;
};

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      "I onboarded onto a 4-year-old monolith in a single afternoon. The flowcharts made the data flow obvious where prose just wasn't landing.",
    author: "Priya N.",
    role: "Staff engineer, fintech",
    initials: "PN",
  },
  {
    quote:
      "Quick Paste alone replaced about three of my ChatGPT tabs. The Mermaid output is exportable too, so I drop diagrams straight into RFCs.",
    author: "Marcus L.",
    role: "Tech lead, devtools",
    initials: "ML",
  },
  {
    quote:
      "Local-first is the killer feature. I can analyze client code without uploading the whole repo to a third-party model.",
    author: "Aiko T.",
    role: "Solo consultant",
    initials: "AT",
  },
];

const GITHUB_REPO = (() => {
  try {
    const url = new URL(GITHUB_URL);
    return url.pathname.replace(/^\//, "").replace(/\/$/, "");
  } catch {
    return null;
  }
})();

function GithubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    if (!GITHUB_REPO) {
      return;
    }
    let cancelled = false;

    fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) {
          return;
        }
        const count = Number(data.stargazers_count);
        if (Number.isFinite(count)) {
          setStars(count);
        }
      })
      .catch(() => {
        /* ignore — show static fallback */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="landing-btn-ghost inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-white"
    >
      <GithubIcon className="size-4" strokeWidth={1.75} />
      <span>Star on GitHub</span>
      <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10.5px] text-white/65">
        <Star
          className="size-3 fill-current text-amber-300"
          strokeWidth={1.5}
        />
        {stars !== null ? stars.toLocaleString() : "—"}
      </span>
    </a>
  );
}

export function SocialProof() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative py-24">
      <div
        ref={ref}
        className="landing-reveal mx-auto w-full max-w-6xl px-6"
      >
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center gap-5 text-center">
          <span className="landing-chip landing-chip-accent">
            <Quote className="size-3.5" strokeWidth={1.75} />
            Loved by developers
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[40px] sm:leading-[1.1]">
            Built in public, shipped fast, used daily
          </h2>
          <p className="text-[15px] leading-7 text-white/55">
            From staff engineers onboarding into legacy code to solo
            consultants reading client codebases — CodeRider keeps the loop
            short.
          </p>
          <GithubStars />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.author}
              className="landing-surface relative flex h-full flex-col gap-5 rounded-2xl p-6"
            >
              <Quote
                className="size-5 text-[#5beac8]/40"
                strokeWidth={1.5}
                aria-hidden
              />
              <blockquote className="text-[13.5px] leading-6 text-white/75">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-white/[0.05] pt-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#14d1a0]/35 to-[#0a8e6a]/35 text-[11px] font-semibold text-white">
                  {t.initials}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    {t.author}
                  </p>
                  <p className="text-[11.5px] text-white/45">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
