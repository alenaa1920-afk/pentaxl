# Pentaxl website

Marketing site for Pentaxl — a ten-person technical consulting startup doing software
development, AI and ML integration, cloud and DevOps, security and compliance, and data
and integrations.

Warm pearl ground with obsidian luxe bands, jade for interaction and gold for emphasis.
Motion throughout is CSS: scroll reveals, a self-drawing hero, pointer-driven 3D card
tilt, animated stage illustrations, and a floating contact launcher.

Next.js 15 App Router, React 19, TypeScript, Tailwind v4. No CMS: content is typed
TypeScript in `content/`. No animation library: the motion is CSS.

## Running it

```bash
export PATH="$HOME/.local/bin:$PATH"   # pnpm was installed here
pnpm install
pnpm dev                               # http://localhost:3000
```

| Command          | What it does                                                |
| ---------------- | ----------------------------------------------------------- |
| `pnpm dev`       | Dev server with Turbopack                                   |
| `pnpm build`     | Production build; prints per-route first-load JS            |
| `pnpm start`     | Serve the production build                                  |
| `pnpm typecheck` | `tsc --noEmit`                                              |
| `pnpm lint`      | ESLint                                                      |
| `pnpm format`    | Prettier, including Tailwind class ordering                 |
| `pnpm test:e2e`  | Playwright: axe, structure, responsive widths, contact form |
| `pnpm analyze`   | Bundle treemap                                              |

`pnpm test:e2e` builds and serves on port 3210 itself. If Playwright reports a missing
browser: `pnpm exec playwright install chromium chromium-headless-shell`.

After deleting or moving a route, `rm -rf .next` before `pnpm typecheck` — stale generated
route types will otherwise fail it.

## Layout

```
app/                 routes; every page exports metadata
  blog/              index + one page per post
content/             all copy and data — the single source of truth
  site.ts            company facts, nav, form options, legal copy
  services.ts        five disciplines + hero figure edges
  stack.ts           six technology clusters
  process.ts         five delivery stages
  work.ts            case studies
components/
  ui.tsx             layout, actions, headings, breadcrumbs, footer, ticker
  chrome.tsx         header, mobile drawer, the reveal observer
  hero.tsx           animated network figure
  rows.tsx           service and case-study list rows
  stack-explorer.tsx cluster filter
lib/                 cn + metadata, lead schema
e2e/                 Playwright specs, routes derived from content
docs/                pre-ship checklists, client wireframe sheet
```

Pages never hardcode copy. Adding a service means one entry in `content/services.ts` —
the detail route, prev/next, index row and hero node all follow.

## Design and motion

Dark and technical: `void` ground, mint `accent` for interaction and glow, hairlines
instead of shadows, mono for micro-labels and stack data. Tokens live in `app/globals.css`
under `@theme`; there is no `tailwind.config.ts`.

Motion is CSS keyframes only:

- **Scroll reveal** — spread `{...reveal(i)}` on any element, `i` staggers siblings. One
  IntersectionObserver in `MotionRoot` drives all of them. `data-motion` is only set after
  mount and only when motion is not reduced, so with JS off nothing is ever hidden.
- **Hero** — the pentagon redraws on every page load and traces one line at a time, as
  if drawn by hand: `SEG_MS` in `hero.tsx` is both the segment duration and the segment
  delay, so each edge starts when the previous finishes. Dots light up as the line
  reaches them; pulses appear only once the figure is complete. ~3.6s in total. Pure CSS
  with server-rendered classes, so it starts on first paint and runs without JS.
- **Ticker** — the stack marquees under the hero.
- **Scroll progress** — a hairline under the header, via `animation-timeline: scroll()`
  where supported.

Everything is disabled under `prefers-reduced-motion: reduce`.

Two Tailwind v4 traps worth knowing: gradients are `bg-linear-to-*` (the v3 name
`bg-gradient-to-*` silently produces nothing), and a colour token named `base` would
collide with the `text-base` font-size utility — which is why the background is `void`.

## Interaction

| Piece                       | Where                | Notes                                                                        |
| --------------------------- | -------------------- | ---------------------------------------------------------------------------- |
| Service tabs                | home                 | ARIA tabs, arrow keys, glow on hover and selection                           |
| Work carousel               | home                 | scroll-snap, arrows disable at ends, dots, live-region position              |
| FAQ accordion               | home                 | native `<details name>`, `FAQPage` JSON-LD, zero JS                          |
| Spotlight cards             | home, services, work | cursor-following glow, focus fallback                                        |
| Count-up stats              | home                 | animates once on view, skipped under reduced motion                          |
| Stack filter                | `/stack`             | glowing pills, scrollable on mobile                                          |
| Pentagon hero               | home                 | traces one line at a time on every load                                      |
| Duration charts             | home                 | min–max range bars, hover emphasis, table view; numbers come from `content/` |
| Industry + commitment cards | home                 | icon tiles with spotlight glow                                               |
| Media slots                 | home                 | reserved frames for real photo/video assets, sized to avoid layout shift     |

Two rules worth keeping: `Carousel` must flatten with
`Children.toArray` (otherwise a mapped list plus a trailing slide becomes one slide), and
any horizontally scrollable container needs `tabIndex={0}` plus a name or axe fails it as
a serious violation — correctly, since keyboard users cannot scroll it otherwise.

## Before launch

```bash
grep -rn "PLACEHOLDER" content/ app/    # must return nothing
```

1. **Buy the mailbox** on `pentaxl.com`. Then set `emailIsLive: true` in
   `content/site.ts`, `pnpm add resend`, set `RESEND_API_KEY`, and replace `deliver()` in
   `app/contact/actions.ts`. Until then the form shows an honest failure state and logs
   the lead server-side rather than pretending to deliver it.
2. **Confirm the company facts** in `content/site.ts`: tagline, phone, the city shown
   publicly.
3. **Write the two case studies** in `content/work.ts` and flip `status` to
   `"published"`. Drafts are `noindex`, excluded from the sitemap, and say plainly that
   the write-up is unfinished. All seven sections are required, including "what we would
   do differently".
4. **Add real names** to `/about`.
5. **Have privacy and terms reviewed.** They describe what the site does today.
6. **Add an HD background video** if you want one — Pexels blocks direct download
   without an API key. Either set `PEXELS_API_KEY` and ask for a clip to be fetched, or
   download an MP4 (1920×1080, under ~8 MB, plus a poster frame) into `public/media`.
   The band component already supports it.
7. **Confirm the stack list** in `content/stack.ts` is what Pentaxl genuinely works in,
   and add specific model or vendor names if you want them public — the AI cluster is
   deliberately vendor-neutral right now.
8. **Swap the rate limiter** in `app/contact/actions.ts` for `@upstash/ratelimit` if the
   form gets real traffic; it is in-memory, so it is per-instance.

## Deliberate deviations from the brief

| Brief says                                            | Built as                                          | Why                                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Calm "engineering document", paper palette, no motion | Dark futurism with scroll reveals and a live hero | Owner's direction, 2026-09-15. This supersedes brief Sections 6–7.                                                         |
| Tokens in `tailwind.config.ts`                        | `@theme` in `app/globals.css`                     | Tailwind v4 is CSS-first and has no config file.                                                                           |
| `@upstash/ratelimit`                                  | In-memory limiter                                 | No Redis credentials exist; an unconfigured limiter fails open on every request.                                           |
| Radix/shadcn select                                   | Native `<select>`                                 | Fully accessible, platform picker on mobile, 0KB. Radix still handles the drawer, where focus management is the hard part. |
| `react-hook-form`                                     | Zod + native form state                           | The shared schema does the work; on-blur validation is a few lines.                                                        |
| Lighthouse 95+ verified                               | Not measured                                      | `@lhci/cli` is not installed here. Per-route JS is measured from the build; LCP and CLS are not.                           |

## Tests

112 Playwright tests across mobile and desktop projects:

- axe on every route, zero critical or serious, run with reduced motion so it measures
  settled colours rather than text mid-fade
- computed contrast for `muted` and `accent` read from the live tokens
- one `h1`, canonical, landmarks and no dead links per route
- no horizontal overflow at 375, 768, 1280 and 1920
- skip link, drawer focus return, hero node navigation, scroll reveal, nav current-route
- the six contact-form cases, including the honest not-configured state
- tab keyboard navigation, carousel paging and end-states, accordion grouping
- the pentagon redrawing on every load and tracing one line at a time
