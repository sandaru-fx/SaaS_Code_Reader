# Launch day checklist — Phase 3

Run through this on launch day before publishing any posts.

## Pre-launch smoke test

- [ ] **Landing** — https://coderider.vercel.app loads
- [ ] **Privacy** — https://coderider.vercel.app/privacy loads
- [ ] **Workspace** — https://coderider.vercel.app/workspace opens
- [ ] **Paste mode** — https://coderider.vercel.app/workspace?mode=paste works
- [ ] **API health** — https://coderider.vercel.app/api/analyze returns `geminiConfigured: true`
- [ ] **Analyze flow** — paste snippet → Analyze → diagram + explanation appear
- [ ] **Mobile** — quick responsive check on phone
- [ ] **Links** — GitHub, privacy, workspace CTAs all work

## Publish sequence (suggested)

| Time | Action | File |
|------|--------|------|
| Morning | Final smoke test | This checklist |
| 9:00 | Twitter/X thread | [twitter-thread.md](./twitter-thread.md) |
| 9:30 | LinkedIn post | [linkedin-post.md](./linkedin-post.md) |
| 10:00 | Product Hunt (optional) | [product-hunt.md](./product-hunt.md) |
| 11:00 | Reddit r/SideProject | [reddit-posts.md](./reddit-posts.md) |
| 12:00 | Dev.to article (optional) | [devto-article.md](./devto-article.md) |
| All day | Reply to every comment | — |
| Evening | Recap post | [post-launch-recap.md](./post-launch-recap.md) |

## Monitor

- **Vercel** — deployment logs, errors, traffic
- **Gemini** — API quota on [Google AI Studio](https://aistudio.google.com)
- **GitHub** — issues and stars
- **Social** — DMs and comments

## Hotfix protocol

If something breaks in production:

```bash
# Fix locally → verify
npm run lint && npm run build

# Commit + push (triggers deploy if GitHub linked)
git add .
git commit -m "Fix production issue: <short description>"
git push

# Or deploy directly
npx vercel deploy --prod --yes
```

## MVP complete criteria

- [ ] Live URL working
- [ ] At least one public launch post published
- [ ] No critical production bugs
- [ ] Recap written
- [ ] **10-day MVP marked complete** 🎉
