# Long description

Use for Product Hunt, LinkedIn “about”, repo social preview, or launch emails.

---

## The problem

Reading unfamiliar code is slow. You jump between files, trace imports mentally, and still miss how everything connects — especially in vibe-coded or AI-generated projects.

## The solution

**CodeRider** is a browser-based workspace that turns code into **visual architecture flowcharts** and **plain-English explanations** with one click.

## How it works

1. **Open a local folder** (File System API — files stay on your machine) or **paste a snippet** in Quick Paste mode
2. **Select a file** and click **Analyze**
3. Get a **Mermaid flowchart** + **Markdown explanation** in the side panel

## Key features

- **Local-first folder mode** — browse projects in-browser, no repo upload
- **Quick Paste mode** — skip the file tree for fast debugging
- **Syntax highlighting** — Shiki-powered code viewer
- **AI analysis** — Google Gemini 1.5 Flash
- **Visual diagrams** — auto-generated Mermaid architecture charts
- **Guardrails** — per-file and project size limits for safe usage

## Tech stack ($0 MVP)

- Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui
- Gemini 1.5 Flash · Mermaid.ink · Clerk · Vercel

## Links

- **Try it:** https://coderider.vercel.app
- **Source:** https://github.com/sandaru-fx/SaaS_Code_Reader
- **Privacy:** https://coderider.vercel.app/privacy

## Built in 10 days

A solo MVP journey: layout → file ingestion → AI pipeline → auth → polish → deploy → launch.
