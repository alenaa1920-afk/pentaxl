# Pentaxl website — engineering conventions

Technical consulting startup, ten engineers: software development, AI and ML integration,
cloud and DevOps, security and compliance, data and integrations.

## Stack

Next.js 15.5 App Router · React 19 · TypeScript strict · Tailwind v4 · pnpm · Vercel

## Commands

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test:e2e` · `pnpm analyze`

pnpm lives at `~/.local/bin` — `export PATH="$HOME/.local/bin:$PATH"` if not found.
`ERR_PNPM_IGNORED_BUILDS` on install is harmless; packages install correctly.
After deleting or moving a route, `rm -rf .next` before `pnpm typecheck` — stale generated
route types otherwise fail the check.

## Rules

- Server Components by default. `"use client"` only for real interactivity — say why in a
  comment. Only four client files exist: `chrome`, `hero`, `stack-explorer`, `contact/form`.
- No arbitrary hex, px or font values in components. Tokens only.
- All copy and data comes from `content/`. Never hardcode strings in a page.
- Every route exports `metadata`. Every detail route has breadcrumbs + JSON-LD.
- No `#` hrefs. No invented stats, clients, testimonials or logos — ever, not even as
  temporary filler. Placeholder _contact details_ are fine and are tagged `PLACEHOLDER:`.
- Prefer extending `content/` over writing new JSX. Adding a service or case study should
  need no new page code.

## Design tokens

Tailwind v4 is CSS-first: `app/globals.css` `@theme` is the single source of truth. There
is no `tailwind.config.ts` — do not create one.

```
canvas       #FFFFFF  page ground         bg-canvas
mist         #F4F7FB  alternate band      .on-mist
surface      #FFFFFF  cards               panel utility
ink          #0A1028  text                text-ink     (18.8:1)
muted        #4A5473  secondary text      text-muted   (7.5:1)
line          #E3E8F2  hairlines          border-line
accent       #4F2BFF  electric indigo     text-accent  (6.7:1)
accent-2     #7A2BF5  violet, markers     text-accent-2 (6.0:1)
hot          #BE185D  magenta highlight   text-hot     (6.0:1)
on-accent    #FFFFFF  text on accent fills
backdrop     #0A1028  dark backdrop — NOT overridden by .on-photo
```

The colour is named `void`, not `base` — `text-base` is the font-size utility, so a colour
called `base` collides with it. Do not rename it back.

Archivo (headings, `font-display`), IBM Plex Sans (body), IBM Plex Mono (`font-mono` —
code, versions, stack data, micro-labels). Sentence case throughout.

Scale 14 16 18 24 32 48 72 maps to `text-sm` `text-base` `text-lg` `text-xl` `text-2xl`
`text-3xl` `text-4xl`. Off-scale sizes (`text-xs`, `text-5xl`+) are set to `initial`, so
using one renders unstyled on purpose.

## Motion — wanted here

The owner asked for a futuristic, animated feel (2026-09-15), which **supersedes** the
brief's Sections 6 and 7 calm/no-motion direction. Do not "fix" the animations away.

- Scroll reveal: spread `{...reveal(i)}` onto any element; `i` staggers siblings. One
  IntersectionObserver in `MotionRoot` drives every one of them.
- `MotionRoot` sets `data-motion="on"` on `<html>` only after mount and only when the user
  has not asked for reduced motion. With JS off or motion reduced, nothing is ever hidden.
- Hero: the pentagon redraws on **every** page load (owner's request) and traces
  **one line at a time** — `SEG_MS` in `hero.tsx` is both the per-edge duration and the
  per-edge delay, so edge _i_ starts exactly when edge _i-1_ finishes. Each dot lights
  up as the pen reaches it. Pulses are wrapped in `pulse-in` (fill-mode `both`) so an
  idle pulse dash cannot sit visible at a line's start before that line is drawn. Whole
  sequence ~3.6s at 520ms per segment; the owner asked for it slow and sequential — do
  not speed it up or overlap the edges. It is pure CSS with
  server-rendered classes, so it starts on first paint and works with JS disabled. Do
  not gate it behind sessionStorage again. Ticker marquees the stack. All CSS keyframes
  — **no animation library is installed and none should be.**
- Everything degrades under `prefers-reduced-motion: reduce`.
- Tailwind v4 uses `bg-linear-to-r`, not `bg-gradient-to-r`. The old name silently
  produces no gradient.

## Interaction components

Reusable, all keyboard- and screen-reader-tested in `e2e/interactive.spec.ts`:

- `Tabs` (`components/tabs.tsx`) — real ARIA tabs: roving tabindex (one tab stop),
  arrow/Home/End keys, `aria-selected`, one visible panel. `ServiceTabs` composes it.
- `Carousel` (`components/carousel.tsx`) — native scroll-snap `rail`, so touch drag and
  keyboard work without a gesture library. Arrows disable at the ends; dots are real
  navigation; position is announced in a live region. **No autoplay** — nothing moves on
  its own, so there is no WCAG 2.2.2 pause control to get wrong. It calls
  `Children.toArray`, which matters: `{list}` plus a trailing slide otherwise arrives as
  `[wholeList, trailing]` and crams the list into one slide.
- `Spotlight` (`components/spotlight.tsx`) — sets `--mx/--my` from a mouse pointer so the
  `spot` utility's glow follows the cursor; touch and keyboard fall back to a centred
  glow on `:focus-within`.
- `CountUp` — animates a number once on first view; renders the final value server-side
  and skips the animation under reduced motion.
- `ContactDock` — the floating launcher, bottom-right. Hidden on `/contact`, closes on
  Escape and restores focus, and its bob runs **six iterations then stops**: an
  infinitely moving control is measurably harder to hit, and Playwright cannot land a
  click on one at all.
- `StageArt` — five hand-authored animated SVGs, one per delivery stage. Decorative and
  `aria-hidden`; the stage text carries the meaning.
- `Faq` — native `<details name="faq">`, so accordion behaviour, keyboard and
  find-in-page are free, plus `FAQPage` JSON-LD. Answers stay in the DOM when closed.

**Any horizontally scrollable element needs `tabIndex={0}` and an accessible name** —
axe flags a scrollable region with no focusable content as a serious failure, and
keyboard users genuinely cannot scroll it otherwise.

## Charts

`RangeChart` (`components/range-chart.tsx`) draws horizontal min–max bars. It is used
twice on Home: engagement stages and per-discipline durations.

- **Single hue, identity from the row label.** Stage order is a _sequence_, not a
  magnitude, so a sequential ramp would imply something untrue — and a five-colour
  categorical set cannot clear the CVD-separation check on this surface (verified with
  the dataviz validator; the darkest step also fell to 2.43:1). `accent` is 11.1:1 on
  `panel` and `accent-dim` 5.52:1; grid lines stay recessive at 1.22:1.
- **Every bar carries its own value label**, so colour is never the only channel, and a
  real `<table>` sits behind a "View as a table" toggle.
- **Numbers come from `content/`** (`service.weeks`, `stage.weeks`, `engagementWeeks`),
  never from parsing the prose — so chart and copy cannot disagree.
- Reserve the right gutter (`pr-20` / `mr-20`) for the end-of-bar labels; a bar at the
  axis maximum otherwise pushes its label off the page.

**No dual-axis charts, ever**, and no invented metrics — every number plotted must trace
to something in `content/`.

## Utilities worth knowing

`spot` (cursor glow) · `glow` / `glow-on` (hover and active lighting for tabs, pills,
arrows) · `aurora` (slow drifting background light) · `rail` (scroll-snap carousel) ·
`rule-draw` (hairline that draws itself when its section reveals) · `panel` /
`panel-hover` (card surface) · `tilt` / `lift` (pointer-driven 3D tilt, capped at 5°,
fed by `Spotlight`) · `sheen` (gold sweep) · `bob` / `ring-pulse` (contact dock) ·
`converge` / `fill-bar` / `tick-in` / `trace` / `travel` (stage illustrations)

**When editing `globals.css`, never replace a range between two comment anchors.** Doing
that once silently deleted `spot`, `glow`, `glow-on`, `aurora`, `rule-draw` and `rail`
while leaving 33 references to them in the components — the build stayed green and only
a carousel test caught it. Add and remove utilities by name.

## Still avoid

Blue/indigo gradients · 3D cloud renders · stock photography · ALL-CAPS eyebrow labels ·
`A · B · C` middle-dot meta strings · arrows appended to button text · drop shadows (the
house style is a hairline that lights up) · `01/02/03` markers outside a real sequence

## Content and placeholders

`content/site.ts` holds company facts, nav, form options and legal copy.
`grep -rn "PLACEHOLDER" content/ app/` is the complete pre-launch checklist.

`sam33@pentaxl.com` is a stand-in with no live mailbox, so the contact form's send is
deliberately stubbed in `app/contact/actions.ts` and the form says so honestly. Do not
point a live Resend send at it.

## Budgets

LCP < 2.0s · first-load JS < 150KB gz (currently 119–134KB) · CLS < 0.05 ·
zero Axe critical or serious issues · 98 e2e tests must stay green

Axe runs with `reducedMotion: "reduce"` so it measures settled colours; otherwise it
samples text mid-fade and reports a blended contrast value.

## The shader backdrop

`ShaderBackdrop` (`components/shader-backdrop.tsx`) is the site's signature: the Paper
Shaders mesh gradient in brand hues, behind the home hero and behind any `PhotoBand`
that has no photo.

Three rules keep it safe, and all three are load-bearing:

- **Loaded with `next/dynamic`, `ssr: false`.** The WebGL bundle is a separate chunk
  fetched after paint, which is why Home is still 132 kB first-load rather than ~180 kB.
  Do not convert it to a static import.
- **Skipped under `prefers-reduced-motion`, and when the tab is hidden.** The static
  `.mesh` gradient is always rendered underneath as the fallback, so there is never a
  blank frame. A test asserts zero canvases under reduced motion.
- **Always paired with a scrim by the caller.** Text never sits on raw shader output.

The header takes the hero's dark base (`bg-backdrop` + `.on-photo`) while at the top of
Home, then returns to the light surface on scroll. It is in normal flow, _not_ overlaying
the hero — making it transparent instead exposes the white body behind light text, which
axe measured at 1.27:1.

## Photo bands

`PhotoBand` is the full-width imagery band. Pass `src` (a file in `public/media`) and it
renders the photo with a slow Ken Burns zoom under a gradient scrim; omit `src` and it
falls back to the animated vivid gradient and names the asset it is waiting for.

The scrim over real photography is not decoration — text over bare imagery fails contrast
the moment the picture changes. Everything inside uses `.on-photo`, which is only safe
above that scrim.

Photography is Pexels stock, registered in `content/media.ts` with alt text and credit,
files in `public/media`, licence recorded in `public/media/CREDITS.md`. Swapping an image
is one path change. Band photos carry a slow Ken Burns zoom, which means Playwright can
never treat them as "stable" — assert on them with `page.evaluate`, not locator actions.

## Routes

`/`, `/services` + 5 details, `/process`, `/blog` + 3 posts, `/about`, `/contact`,
`/privacy`, `/terms`, plus designed 404 and 500.

**`/work` and `/stack` were deferred to phase two** and deleted. `content/stack.ts`
remains because services reference cluster ids for their tech chips — it is data, not a
page. Do not add a dynamic segment at the route root: an `app/[legal]` route once
served /privacy and /terms from one file and, with `dynamicParams = false`, answered
every other unknown top-level path with an internal NoFallbackError instead of the 404
page. Two thin pages sharing `components/legal-page.tsx` is the right trade.

A Playwright test crawls every internal link on every route and fails on any status
≥ 400, so a dead link cannot ship again.

## Reference

The original build spec is kept privately and is not part of this repository. Where the
two disagree, this file is newer and wins. Pre-ship checklists live in
`docs/checklists.md`.
