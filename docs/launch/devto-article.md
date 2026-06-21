# Dev.to article draft

**Suggested title:** I Built an AI Code Visualizer in 10 Days — Here's the Full Stack

**Tags:** `nextjs`, `ai`, `webdev`, `saas`, `gemini`

---

## Introduction

What if you could open any codebase and instantly see how it flows — not by reading every file, but with an auto-generated architecture diagram?

That's what I set out to build with **CodeRider**. Ten days later, it's live at [coderider.vercel.app](https://coderider.vercel.app).

## The problem

Developers spend hours tracing logic through unfamiliar projects. Documentation is often missing or outdated. AI-generated code makes this worse — it works, but the structure is opaque.

I wanted a tool that answers one question fast: **"How does this code flow?"**

## The solution

CodeRider is a 3-column workspace:

```
┌─────────────┬──────────────────┬─────────────────────┐
│  File Tree  │  Code Viewer     │  AI Panel           │
│  (Left)     │  (Center)        │  Diagram | Explain  │
└─────────────┴──────────────────┴─────────────────────┘
```

Two ways to get code in:
1. **Folder mode** — File System API, local-first
2. **Quick Paste** — drop a snippet, skip the tree

Click **Analyze** → Gemini returns JSON with a Mermaid diagram + Markdown explanation.

## Tech stack ($0 MVP)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16, TypeScript |
| UI | Tailwind v4, shadcn/ui |
| Highlighting | Shiki |
| AI | Gemini 1.5 Flash |
| Diagrams | Mermaid.ink |
| Auth | Clerk |
| Deploy | Vercel |

## 10-day build log (summary)

| Days | Focus |
|------|-------|
| 1–3 | Layout, file ingestion, syntax highlighting |
| 4–5 | Gemini API, Mermaid rendering |
| 6 | Quick Paste mode |
| 7 | Clerk authentication |
| 8 | Guardrails, skeletons, error handling |
| 9 | Vercel production deploy |
| 10 | Launch polish + marketing |

## Interesting challenges

**File System API in the browser** — no backend storage, but great for privacy.

**Structured AI output** — prompt engineering for reliable `{ explanation, mermaid }` JSON.

**Mermaid rendering** — Mermaid.ink for serverless-friendly diagram images.

**Size guardrails** — 100KB per file, 500KB per project to control token costs.

## Try it

- **Live:** https://coderider.vercel.app
- **GitHub:** https://github.com/sandaru-fx/SaaS_Code_Reader

## What's next

- GitHub repo sync
- Whole-project analysis
- Diagram PNG/SVG export

---

If you built something similar or want a feature prioritized — drop a comment!
