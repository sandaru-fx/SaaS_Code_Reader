"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Loader2, Play, Sparkles } from "lucide-react";

import { useReveal } from "@/components/landing/useReveal";
import { buildMermaidInkUrl } from "@/lib/mermaid";

type DemoLanguage = "typescript" | "python" | "javascript";

type DemoSample = {
  id: DemoLanguage;
  label: string;
  fileName: string;
  code: string;
  mermaid: string;
  explanation: readonly string[];
};

const TS_SAMPLE = `export async function checkout(cart: Cart) {
  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (total <= 0) {
    throw new Error("Empty cart");
  }

  const intent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  await sendReceipt(cart.userEmail, intent.id);
  return intent;
}`;

const PY_SAMPLE = `def login(email: str, password: str):
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        raise AuthError("Invalid credentials")

    token = create_jwt(user.id, expires_in=900)
    redis.setex(f"session:{user.id}", 3600, token)

    return {
        "token": token,
        "user": user.serialize(),
    }`;

const JS_SAMPLE = `document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetch("/api/products").then((r) => r.json());
  const grid = document.querySelector("#grid");

  for (const product of products) {
    const card = renderCard(product);
    grid.appendChild(card);
  }

  grid.addEventListener("click", handleAddToCart);
});`;

const SAMPLES: readonly DemoSample[] = [
  {
    id: "typescript",
    label: "TypeScript",
    fileName: "checkout.ts",
    code: TS_SAMPLE,
    mermaid: `flowchart TD
    A[checkout cart] --> B[Sum totals]
    B --> C{Total > 0?}
    C -->|No| E[Throw EmptyCart]
    C -->|Yes| D[Stripe paymentIntent]
    D --> F[Send receipt email]
    F --> G[Return intent]`,
    explanation: [
      "Sums every cart item into a single total.",
      "Rejects empty carts before calling Stripe.",
      "Creates a Stripe paymentIntent in USD.",
      "Emails the user a receipt and returns the intent.",
    ],
  },
  {
    id: "python",
    label: "Python",
    fileName: "auth.py",
    code: PY_SAMPLE,
    mermaid: `flowchart TD
    A[login: email, password] --> B[Lookup user]
    B --> C{Password valid?}
    C -->|No| E[Raise AuthError]
    C -->|Yes| D[Create JWT 15m]
    D --> F[Store session in Redis]
    F --> G[Return token + user]`,
    explanation: [
      "Looks up the user by email in the database.",
      "Verifies the password hash.",
      "Issues a short-lived JWT access token.",
      "Stores the session in Redis and returns the token.",
    ],
  },
  {
    id: "javascript",
    label: "JavaScript",
    fileName: "main.js",
    code: JS_SAMPLE,
    mermaid: `flowchart TD
    A[DOMContentLoaded] --> B[Fetch /api/products]
    B --> C[Loop products]
    C --> D[Render card]
    D --> E[Append to grid]
    E --> F[Wire add-to-cart listener]`,
    explanation: [
      "Waits for DOMContentLoaded to bootstrap.",
      "Fetches product data from the catalog API.",
      "Renders a card for each product.",
      "Wires up the add-to-cart click handler.",
    ],
  },
];

type Stage = "idle" | "loading" | "ready";

export function LiveDemo() {
  const ref = useReveal<HTMLDivElement>();
  const [activeId, setActiveId] = useState<DemoLanguage>("typescript");
  const [stage, setStage] = useState<Stage>("idle");
  const [imageLoaded, setImageLoaded] = useState(false);

  const sample = useMemo(
    () => SAMPLES.find((s) => s.id === activeId) ?? SAMPLES[0],
    [activeId]
  );

  const diagram = useMemo(
    () => buildMermaidInkUrl(sample.mermaid, "svg"),
    [sample.mermaid]
  );

  const handleRun = () => {
    if (stage === "loading") {
      return;
    }
    setStage("loading");
    setImageLoaded(false);
    window.setTimeout(() => {
      setStage("ready");
    }, 900);
  };

  const handleTabChange = (id: DemoLanguage) => {
    setActiveId(id);
    setStage("idle");
    setImageLoaded(false);
  };

  return (
    <section id="live-demo" className="relative py-24">
      <div
        ref={ref}
        className="landing-reveal mx-auto w-full max-w-6xl px-6"
      >
        <div className="mb-10 flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="landing-chip landing-chip-accent">
              <Sparkles className="size-3.5" strokeWidth={1.75} />
              Try it instantly
            </span>
            <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[40px] sm:leading-[1.1]">
              See your code as a flowchart in seconds
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/55">
              Pick a language, hit Run, and watch a real Mermaid diagram
              render right here. No signup, no setup.
            </p>
          </div>
          <Link
            href="/workspace"
            className="landing-btn-ghost inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-medium"
          >
            Use your own code
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>

        <div className="landing-surface-elevated overflow-hidden rounded-3xl">
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.015] px-3 py-3 sm:px-5">
            <div className="flex flex-1 items-center gap-1 overflow-x-auto">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleTabChange(s.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeId === s.id
                      ? "bg-white/[0.08] text-white"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      activeId === s.id ? "bg-[#14d1a0]" : "bg-white/25"
                    }`}
                  />
                  {s.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleRun}
              disabled={stage === "loading"}
              className="landing-btn-primary inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-semibold disabled:opacity-70"
            >
              {stage === "loading" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Analyzing
                </>
              ) : stage === "ready" ? (
                <>
                  <Play className="size-3.5 fill-current" strokeWidth={1.5} />
                  Run again
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" strokeWidth={1.5} />
                  Run analysis
                </>
              )}
            </button>
          </div>

          <div className="grid divide-white/[0.06] lg:grid-cols-[0.92fr_1.08fr] lg:divide-x">
            <div className="border-b border-white/[0.06] lg:border-b-0">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/20 px-4 py-2.5">
                <span className="font-mono text-[11px] text-white/45">
                  {sample.fileName}
                </span>
                <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-white/55">
                  {sample.label}
                </span>
              </div>
              <pre className="max-h-[420px] overflow-auto bg-black/30 p-5 font-mono text-[12.5px] leading-6 text-white/80">
                <code>{sample.code}</code>
              </pre>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/20 px-4 py-2.5">
                <span className="font-mono text-[11px] text-white/45">
                  flowchart preview
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    stage === "ready"
                      ? "border border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                      : stage === "loading"
                        ? "border border-amber-400/25 bg-amber-400/10 text-amber-200"
                        : "border border-white/10 bg-white/[0.04] text-white/55"
                  }`}
                >
                  <span
                    className={`size-1 rounded-full ${
                      stage === "ready"
                        ? "bg-emerald-400"
                        : stage === "loading"
                          ? "landing-pulse bg-amber-300"
                          : "bg-white/40"
                    }`}
                  />
                  {stage === "ready"
                    ? "Ready"
                    : stage === "loading"
                      ? "Generating"
                      : "Idle"}
                </span>
              </div>

              <div className="relative flex min-h-[300px] flex-1 items-center justify-center bg-[#08100e] p-5">
                {stage === "idle" ? (
                  <div className="text-center">
                    <div className="landing-icon-tile mx-auto">
                      <Play
                        className="size-5 fill-current"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="mt-4 text-sm font-medium text-white/75">
                      Click Run to generate the flowchart
                    </p>
                    <p className="mt-1 max-w-xs text-xs text-white/40">
                      We pre-cached this sample so you can preview the output
                      without using a free analysis credit.
                    </p>
                  </div>
                ) : null}

                {stage === "loading" ? (
                  <div className="w-full max-w-sm space-y-3">
                    <div className="landing-skeleton-line h-3 w-2/3" />
                    <div className="landing-skeleton-line h-3 w-5/6" />
                    <div className="landing-skeleton-line h-3 w-1/2" />
                    <div className="landing-skeleton-line h-3 w-3/4" />
                  </div>
                ) : null}

                {stage === "ready" && diagram.success ? (
                  <div className="flex w-full justify-center">
                    {!imageLoaded ? (
                      <div className="w-full max-w-sm space-y-3">
                        <div className="landing-skeleton-line h-3 w-2/3" />
                        <div className="landing-skeleton-line h-3 w-5/6" />
                        <div className="landing-skeleton-line h-3 w-1/2" />
                      </div>
                    ) : null}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={diagram.url}
                      src={diagram.url}
                      alt={`Generated flowchart for ${sample.fileName}`}
                      onLoad={() => setImageLoaded(true)}
                      className={`max-h-[280px] w-auto rounded-lg bg-white/95 p-3 transition-opacity duration-500 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                ) : null}

                {stage === "ready" && !diagram.success ? (
                  <p className="text-sm text-rose-300">
                    Failed to render diagram.
                  </p>
                ) : null}
              </div>

              {stage === "ready" ? (
                <div className="border-t border-white/[0.06] px-5 py-4">
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
                    AI explanation
                  </p>
                  <ol className="space-y-2">
                    {sample.explanation.map((line, i) => (
                      <li
                        key={`${sample.id}-${i}`}
                        className="flex items-start gap-2 text-[12.5px] leading-relaxed text-white/70"
                      >
                        <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#14d1a0]/15 text-[10px] font-semibold text-[#7eecd0]">
                          {i + 1}
                        </span>
                        {line}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Like what you see?{" "}
          <Link
            href="/workspace"
            className="font-semibold text-[#5beac8] underline-offset-4 hover:underline"
          >
            Open the workspace
          </Link>{" "}
          and run it against your own project.
        </p>
      </div>
    </section>
  );
}
