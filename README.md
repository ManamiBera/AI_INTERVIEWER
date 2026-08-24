<div align="center">

# 🎯 AI Interviewer

**An AI-powered resume analysis + interview preparation platform.**

Upload your resume → get an ATS score → fix it → practice interviews → track your progress.

### 🔗 [**Live Demo → ai-interviewer-vert-phi.vercel.app**](https://ai-interviewer-vert-phi.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

</div>

---

## ✨ What it does

AI Interviewer is a premium, dark-themed SaaS-style web app with two connected workspaces:

### 📄 Resume Intelligence
- **Upload** a PDF or DOCX resume (parsed in the browser — no server upload needed)
- **ATS scoring** — a weighted 0–100 recruiter-readiness score with a full breakdown
- **Keyword analysis** — matched / missing / overused / recommended keywords, role-aware
- **Experience rewriting** — per-bullet AI suggestions that strengthen weak verbs and prompt for metrics (never fabricated)
- **Formatting audit** — ATS-parsing checks with one-click fixes
- **ATS Verdict** — strengths, weaknesses, critical fixes, and an AI-generated executive summary
- **Resume editor** — a 3-panel editor with a live preview and AI assistant

### 🎤 Interview Prep
- **Readiness dashboard** — track technical, behavioral, and communication scores
- **Question bank** — searchable, filterable questions with hints and model answers
- **Mock interview** — a full setup → live interview → scored report flow
- **Interview history** — past sessions with a performance trend chart
- **7-day preparation plan** — a personalized, checkable roadmap

Plus: dashboard, analysis history, resume template marketplace, pricing, profile, settings (with light/dark theme), notifications, global search (⌘K), and a support center.

---

## 🧠 How the AI works

The analysis runs through a swappable service layer:

- **With a Google Gemini API key** (free tier) → real AI analysis of your resume against the job description and target role.
- **Without a key** → a deterministic, **role-aware offline engine** still scores your *actual* resume text using weighted keyword dictionaries. The app is fully functional either way.

> The AI never invents facts — missing metrics become *"Consider adding a measurable result if you have one"* rather than a made-up number.

---

## 🛠️ Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS (CSS-variable design tokens) |
| State | Zustand |
| Auth + Database | Supabase (Postgres + Row-Level Security) |
| AI | Google Gemini (`gemini-2.0-flash`) with offline fallback |
| Resume parsing | `pdfjs-dist` (PDF) + `mammoth` (DOCX) |
| Charts | Recharts |
| Icons | lucide-react |
| Toasts | sonner |

---

## 🚀 Getting started

### Prerequisites
- **Node.js 18+** and npm
- A free **[Supabase](https://supabase.com)** project
- *(Optional)* a free **[Google Gemini API key](https://aistudio.google.com/app/apikey)**

### 1. Clone & install
```bash
git clone https://github.com/ManamiBera/AI_INTERVIEWER.git
cd AI_INTERVIEWER
npm install
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the tables, row-level security policies, and the signup trigger.
3. Go to **Authentication → Sign In / Providers → Email** and turn **OFF** *"Confirm email"* (recommended for local dev — signups then log in instantly).
4. From **Project Settings → API**, copy your **Project URL** and **anon/publishable key**.

### 3. Configure environment
```bash
cp .env.local.example .env.local
```
Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_key_here
GEMINI_API_KEY=            # optional — leave blank for offline mode
```

### 4. Run
```bash
npm run dev
```
Open **http://localhost:3000**, create an account, and start analyzing.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Type-check with `tsc --noEmit` |

---

## 📁 Project structure

```
src/
├── app/
│   ├── (app)/            # Authenticated app (dashboard, resume/*, interview/*, …)
│   ├── login, signup/    # Auth pages
│   ├── api/analyze/      # Gemini analysis endpoint (server-only)
│   └── layout.tsx        # Root layout
├── components/           # UI primitives, shell, feature components
├── lib/
│   ├── supabase/         # Browser / server / middleware clients
│   └── nav.ts, cn.ts …   # Helpers
├── services/             # db.ts (Supabase access), analysis, resume parsing
├── store/                # Zustand stores (Supabase-backed)
├── data/                 # Seed data: questions, templates, keyword dictionaries
└── types/                # Shared TypeScript types
supabase/schema.sql       # Database setup
```

See [`CLAUDE.md`](CLAUDE.md) for deeper architecture notes.

---

## ☁️ Deployment

This app is **live on Vercel** at **[ai-interviewer-vert-phi.vercel.app](https://ai-interviewer-vert-phi.vercel.app)** and redeploys automatically on every push to `main`.

To deploy your own copy free on **[Vercel](https://vercel.com)**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManamiBera/AI_INTERVIEWER)

1. Import the GitHub repo (or click the button above).
2. Add the environment variables from `.env.local` (Supabase URL + anon key; Gemini key optional).
3. Deploy — then add your deployed URL to Supabase → Authentication → URL Configuration.

---

## 🔒 Security notes

- The Supabase **anon key is public by design** — data is protected by Row-Level Security, so users can only ever read/write their own rows.
- The **Gemini key is server-only** (`GEMINI_API_KEY`, never `NEXT_PUBLIC_`) and never reaches the browser.
- `.env.local` is git-ignored — your secrets never get committed.

---

## 📄 License

[MIT](LICENSE) © 2026 Manami Bera
