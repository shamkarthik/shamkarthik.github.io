# portfolio

Personal portfolio — Sham Karthik S · Senior AI/ML Engineer · Full-Stack Software Engineer

Built with React 19 + Vite + Tailwind CSS v4.

**Live at [shamkarthik.github.io/portfolio](https://shamkarthik.github.io/portfolio)**

---

## Tech Stack

- **React 19** with React Compiler
- **Vite 8** + TypeScript
- **Tailwind CSS v4** + `@tailwindcss/vite` plugin
- **Framer Motion** — page/section animations
- **React Router** (HashRouter)
- **WebLLM** — on-device LLM inference via WebGPU
- **FormSubmit.co** — free contact form backend

## Pages

| Route | Content |
|-------|---------|
| `/` | Hero, What I Do, Experience Timeline, Open Source Projects, Edge AI Capabilities, Skills |
| `/blog` | Medium RSS feed via rss2json |
| `/contact` | Contact form + social links |
| `/contributions` | GitHub stats, language chart, contribution graph, recent activity |

## Features

- 🌓 Dark/Light theme toggle (persisted in localStorage)
- 🤖 On-device AI chat popup via WebLLM (WebGPU, no server needed)
- 📊 Animated stat counters (Years Exp, Projects Delivered)
- 📈 Skill proficiency bars with animated fill
- 📉 Language distribution bar chart
- 🏷️ Edge AI capabilities (filterable by category)
- 📱 Fully responsive (mobile-first)

## Getting Started

```bash
npm install
npm run dev        # local dev at http://localhost:5173/
npm run build      # production build → dist/
npm run preview    # preview build
```

## Test

```bash
npx playwright test
```

## Deploy

Push to `master` → GitHub Actions builds and deploys to GitHub Pages via `actions/deploy-pages`.

## License

MIT
