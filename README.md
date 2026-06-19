# CodeRider

AI-powered visual code workspace manager for developers who want to understand codebases through flowcharts and logic explanations.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **AI:** Google Gemini 1.5 Flash (planned)
- **Auth:** Clerk (planned)
- **Deploy:** Vercel (planned)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                  # Next.js App Router pages
components/
  ui/                 # shadcn/ui components
  workspace/          # IDE workspace components
lib/                  # Utilities
```

## MVP Roadmap

- [x] **Phase 1:** Next.js + Tailwind + shadcn/ui bootstrap
- [x] **Phase 2:** 3-column workspace layout
- [x] **Phase 3:** Routes, polish & empty states
- [ ] **Day 2:** Local folder ingestion (File System API)
- [ ] Code viewer + syntax highlighting
- [ ] Gemini AI analysis pipeline
- [ ] Mermaid diagram rendering
- [ ] Quick paste snippet mode
- [ ] Clerk authentication
- [ ] Production deployment
