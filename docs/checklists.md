# Pre-ship checklists

Run these before calling a page done and again before a deploy. Report failures only.

## Design review

**Direction.** Dark, technical, futurist: near-black ground, mint accent for interaction
and glow, hairlines rather than shadows, mono for micro-labels and stack data. Motion is
intentional here — scroll reveals, the live hero figure, the stack ticker.

- No hex, `rgb()` or `hsl()` literals in components — tokens only. Grep `#[0-9a-fA-F]{3,6}`.
- No arbitrary Tailwind values (`text-[13px]`, `p-[7px]`). Legitimate exceptions: SVG
  geometry, blur radii, `max-w-[78rem]`, conic gradients.
- Font sizes from the scale only: `text-sm` … `text-4xl`.
- `font-mono` only for code, versions, stack data or micro-labels.
- Reveals use the shared `reveal()` helper, never a bespoke observer.
- Content must be visible with JS off and under reduced motion.
- `bg-linear-to-*`, not `bg-gradient-to-*` — the v3 name compiles to nothing in v4.

**Never ship:** blue or indigo gradients · 3D or cloud renders · stock photos of people ·
ALL-CAPS tracked eyebrow labels · middle-dot meta strings (`A · B · C`) · arrows appended
to button labels · `shadow-*` on cards · `01/02/03` markers outside a real sequence ·
invented statistics, client names, testimonials or logo walls.

## Accessibility

```bash
pnpm test:e2e     # Playwright + axe across every route
```

Zero critical and zero serious violations is the pass condition. Then check by hand what
axe cannot:

- Tab through every route. Visible focus ring, logical order, no trap outside the drawer.
- Skip-to-content is first in the tab order and moves focus to `<main>`.
- The mobile drawer traps focus while open, restores it to the trigger, closes on Escape.
- Icon-only buttons have `aria-label`; no two links share an ambiguous name.
- Every input has a real `<label>`; errors are associated with `aria-describedby`.
- Validation fires on blur, never on keystroke.
- Any horizontally scrollable container has `tabIndex={0}` and an accessible name —
  without it keyboard users cannot scroll it, and axe fails it as serious.
- With `prefers-reduced-motion: reduce`, `data-motion` is never set and every reveal
  stays visible.
- 200% zoom at 375px wide loses no content and causes no horizontal scroll.
- Contrast: verify `muted` and `accent` against the background from the live tokens.
  Run axe with reduced motion, or it samples text mid-fade and reports a blended value.

## Performance

| Metric                    | Budget  |
| ------------------------- | ------- |
| LCP, mobile, simulated 4G | < 2.0s  |
| First-load JS, gzipped    | < 150KB |
| CLS                       | < 0.05  |
| Lighthouse ×4, mobile     | ≥ 95    |

```bash
pnpm build      # per-route First Load JS — the primary gate
pnpm analyze    # treemap of bundle contents
```

Check every route in the build table, not just Home, and confirm each rendered static
(○/●). An unexpected ƒ means something reads headers or cookies at request time.

Attribute any overage:

- `grep -rn '"use client"' app components` — each hit needs a justifying comment. A
  client boundary on a page rather than a leaf pulls its whole subtree into the bundle.
- `lucide-react` must be imported per-icon, never from the barrel.
- No animation or charting library belongs in `package.json`. The hero draw and every
  transition are CSS; the charts are hand-built.
- `next/image` with explicit dimensions — a missing dimension is a CLS fault.

## Content check

Before every deploy:

```bash
grep -rn 'href="#"' app components          # dead links
grep -rniE "lorem|ipsum|TODO|FIXME|TBD" app components content
grep -rn "PLACEHOLDER" content/ app/        # must be empty at launch
```

Also flag: percentages, multipliers or round counts in marketing copy without a stated
source; client or company names that are not our own products; testimonial markup; logo
walls. Every `page.tsx` must export `metadata` or `generateMetadata`.
