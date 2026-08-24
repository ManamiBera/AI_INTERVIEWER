# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**The Editorial Intelligence** — an AI-powered resume analysis + interview preparation platform (Next.js 14 App Router, TypeScript, Tailwind). Dark navy/cyan "premium SaaS" aesthetic. Two workspaces: **Resume Intelligence** (`/resume/*`) and **Interview Prep** (`/interview/*`), plus top-level pages (dashboard, history, templates, pricing, profile, settings, notifications, support).

Design goal: every nav item, button, and page is functional — no "Coming Soon" placeholders. Every page has loading/empty/error states.

## Environment gotcha (important)

Node/npm are **not on the default Bash tool PATH** on this machine. Prefix commands:
```bash
export PATH="/c/Program Files/nodejs:$PATH"
```
PowerShell needs a PATH refresh from Machine+User env. Node was installed via winget (`C:\Program Files\nodejs`). The C: drive has run **completely full** before (Downloads ≈ 70 GB) causing `ENOSPC` build failures — if the dev server errors with `ENOSPC`, the disk is full, not the code.

## Commands

```bash
npm run dev        # dev server on :3000 (falls to :3001+ if port busy — kill stale node procs)
npm run build      # production build
npm run typecheck  # tsc --noEmit — run this to verify; there is NO test suite
npm run lint       # next lint
```

There are **no automated tests**. Verify changes with `npm run typecheck` (must be clean) and by hitting routes (all should return 200). Kill zombie servers with `Get-Process node | Stop-Process -Force` (PowerShell) before restarting — multiple instances race on `.next` and cause spurious `ENOSPC`.

## Architecture

### The analysis pipeline (the core of the app)

This is the one flow that spans many files — understand it first:

1. **`src/app/(app)/resume/overview/page.tsx`** — user uploads a file. `parseResumeFile()` (in `src/services/resumeClient.ts`) extracts text client-side: **PDF via `pdfjs-dist`** (also sends base64 so Gemini can see layout), **DOCX via `mammoth`**. Then `analyzeResume()` POSTs to the API.
2. **`src/app/api/analyze/route.ts`** (server, `runtime: "nodejs"`) — if `GEMINI_API_KEY` is set, calls Gemini (`src/lib/gemini.ts`) with a strict-JSON prompt; otherwise (or on **any** failure) returns `buildMockAnalysis()`. The `coerce()` function merges model output onto a mock baseline so the returned `Analysis` shape is **always complete and valid**.
3. **`src/services/mockAnalysis.ts`** — the deterministic fallback. Reads the *real* resume text, cross-references **`src/data/keywordDictionaries.ts`** (role → weighted keywords) to score keyword coverage, extract/rewrite experience bullets, and detect formatting issues. It is role-aware and **never fabricates metrics** — missing numbers become "Consider adding a measurable result if you have one."
4. The result is saved to the **`resumeStore`** and read by all four report pages: `keywords`, `experience`, `formatting`, `ats-verdict`. Each shows an `EmptyState` (CTA → overview) when no analysis exists.

Key invariant: the app **works end-to-end with no API key**. Never assume Gemini is available; the mock fallback must always produce a full report. `hasGeminiKey()` gates the AI path.

### Auth & persistence (Supabase)

Data lives in **Supabase Postgres**, per-user via **row-level security** (project `kyzcdqzfjpajzujaatpb`). Email/password auth via `@supabase/ssr`.

- **Clients**: `src/lib/supabase/{client,server,middleware}.ts`. Root `src/middleware.ts` runs `updateSession` on every non-static, non-`/api` route — **unauthenticated users redirect to `/login`**; the `(app)` layout re-checks server-side too.
- **Auth UI**: `/login`, `/signup` (outside `(app)`, no shell). Shared `src/components/auth/AuthForm.tsx`. Email confirmation is **enabled**, so signup shows a "check your email" step and returns no session until confirmed. Supabase **rejects invalid email domains** — use real domains when testing.
- **Data access**: `src/services/db.ts` — all Supabase reads/writes, scoped to `auth.uid()` by RLS. INSERTs must pass `user_id` (via `getUserId()`) to satisfy the RLS `with check`.
- **Stores** (`src/store/`, no longer localStorage): in-memory caches. `hydrate()` loads from Supabase; mutations are **async write-throughs** to `db.ts`. `src/components/providers/DataHydrator.tsx` (in the `(app)` layout) hydrates on load and on `SIGNED_IN`/`TOKEN_REFRESHED`.
- **Schema**: `profiles` (auto-created on signup by the `handle_new_user` trigger), `analyses`, `interview_sessions`, `question_progress`, `notifications`. `analyses`/`sessions` use **text PKs** = the app's client-generated ids, with the full object in a `data jsonb` column. Change schema via the Supabase MCP `apply_migration`, then `get_advisors` (security) — SECURITY DEFINER trigger functions must have EXECUTE revoked from `anon`/`authenticated`.

The `history` page still merges store data in front of demo seed rows for display.

### Dev-server note

This app is sensitive to **dev-server thrash**: deleting `.next` mid-session causes stale-chunk 404s and phantom React hydration errors that silently break interactivity (form clicks do nothing). If forms/buttons stop working, do a **clean restart** (kill all node, `rm -rf .next`, start ONE server, wait for full compile) and test in a **fresh browser tab** before assuming a code bug.

### Layout & navigation

- `src/app/layout.tsx` — root, injects Inter font + `sonner` Toaster.
- `src/app/(app)/layout.tsx` → **`AppShell`** (`src/components/shell/`) — composes `Sidebar` + `TopNav` + overlays (`GlobalSearch` ⌘K, `NotificationPanel`, `ExportModal`, `MobileDrawer`).
- **`src/lib/nav.ts`** is the single source of truth for all nav items. The sidebar shows the same Resume + Interview groups on every route; `isActive()` handles the `/interview` exact-match edge case.

### Styling system

- **`src/app/globals.css`** defines all colors as CSS variables on `:root`, with `html.light` overrides for light mode. **Never hardcode hex outside this file** — use Tailwind tokens (`bg-surface`, `text-secondary`, `accent`, `score-green/amber/red`, etc.) mapped in `tailwind.config.ts`.
- Theme toggle (settings page) works by toggling the `light` class on `<html>` — no `next-themes` provider is wired despite the dep being installed.
- Reusable primitives live in `src/components/ui/` (`Card`, `Button`, `Badge`, `ScoreDial`, `RadialScore`, `Modal`, `EmptyState`, `PageHeader`, etc.). Prefer these over ad-hoc markup; `PageHeader` keeps typographic rhythm consistent across every route.
- `cn()` (`src/lib/cn.ts`) = clsx + tailwind-merge for conditional classes.

## Conventions

- All interactive pages are `"use client"`. Server code is confined to `src/app/api/*` and `src/lib/gemini.ts` (server-only — the key never reaches the browser).
- Every meaningful action fires a `toast` (from `sonner`).
- Types live in `src/types/index.ts`; ambient module decls (mammoth/pdf worker) in `src/types/modules.d.ts`.
- Seed/demo data is in `src/data/`. Question bank (`questions.ts`) and templates (`templates.ts`) are representative samples, not exhaustive.

## Gemini key setup

Copy `.env.local.example` → `.env.local`, add `GEMINI_API_KEY` (free key from https://aistudio.google.com/app/apikey), restart. Model is `gemini-2.0-flash` (see `src/lib/gemini.ts`). Without a key the UI shows "Offline mode" and uses `mockAnalysis`.
