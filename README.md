# Portfolio — Sham Karthik S

Senior AI/ML Engineer portfolio built with React 19 + Vite + Tailwind CSS v4.

**Live:** [shamkarthik.github.io/portfolio](https://shamkarthik.github.io/portfolio/)

---

## Tech Stack

- **React 19** with React Compiler
- **Vite 8** + TypeScript
- **Tailwind CSS v4** + `@tailwindcss/vite` plugin
- **Framer Motion** — page/section animations
- **React Router** (HashRouter for GH Pages sub-path)
- **FormSubmit.co** — free contact form backend

## Pages

| Route | Content |
|-------|---------|
| `/` | Hero, Experience Timeline, Open Source Projects, Skills, AIGronomist features |
| `/blog` | Medium RSS feed via rss2json |
| `/contact` | Contact form + social links |
| `/contributions` | GitHub stats, language chart, contribution graph, recent activity |

## Features

- 🌓 Dark/Light theme toggle (persisted in localStorage)
- 📊 Animated stat counters (Years Exp, Projects Delivered)
- 📈 Skill proficiency bars with animated fill
- 📉 Language distribution bar chart
- 🏷️ AIGronomist features (top 15, filterable by category)
- 📱 Fully responsive (mobile-first)
- 🎯 E2E tests via Playwright (12 tests)

## Getting Started

```bash
npm install
npm run dev        # local dev at http://localhost:5173/portfolio/
npm run build      # production build → dist/
npm run preview    # preview build
```

## Test

```bash
npx playwright test
```

## Deploy

Push to `master` → GitHub Actions auto-builds and deploys to GitHub Pages via `peaceiris/actions-gh-pages`.

## License

MIT
