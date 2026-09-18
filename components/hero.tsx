"use client"

// Interactive: hovering a node dims the rest and swaps the supporting line. The figure
// redraws on every load, then the travelling pulses keep running so it reads as a live
// system rather than a diagram.

import Link from "next/link"
import { useState } from "react"
import { heroCycle, services, serviceEdges } from "@/content/services"
import { site } from "@/content/site"
import { cn } from "@/lib/utils"

const W = 440
const H = 400
const CX = 220
const CY = 196
const R = 140

/**
 * Milliseconds per segment. Each edge waits for the previous one to finish, so the
 * figure is traced one line at a time like a pen travelling between the dots rather
 * than every edge fading up at once. serviceEdges is ordered to walk the pentagon
 * perimeter first, then the two interior chords.
 */
const SEG_MS = 520

const points = heroCycle
  .map((slug) => services.find((s) => s.slug === slug)!)
  .filter(Boolean)
  .map((service, i, all) => {
    const angle = (-90 + i * (360 / all.length)) * (Math.PI / 180)
    return {
      slug: service.slug,
      name: service.name,
      label: service.nodeLabel,
      x: CX + R * Math.cos(angle),
      y: CY + R * Math.sin(angle),
    }
  })

const edges = serviceEdges.flatMap(([from, to]) => {
  const a = points.find((p) => p.slug === from)
  const b = points.find((p) => p.slug === to)
  if (!a || !b) return []
  return [{ from, to, a, b, len: Math.round(Math.hypot(b.x - a.x, b.y - a.y)) }]
})

const labelPos = (x: number, y: number) =>
  y < CY - 40
    ? "bottom-full left-1/2 -translate-x-1/2 pb-3"
    : y > CY + 40
      ? "top-full left-1/2 -translate-x-1/2 pt-3"
      : x > CX
        ? "left-full top-1/2 -translate-y-1/2 pl-3"
        : "right-full top-1/2 -translate-y-1/2 pr-3"

export function HeroFigure() {
  const [active, setActive] = useState<string | null>(null)

  // The draw replays on every load, by request. The classes are server-rendered and
  // `--len` is an inline style, so it is pure CSS — the animation starts on first paint
  // instead of waiting for hydration, and runs even with JS disabled.
  const current = active ? points.find((p) => p.slug === active) : null
  const summary = active ? services.find((s) => s.slug === active)?.summary : site.tagline

  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-[26rem]" style={{ aspectRatio: W / H }}>
        <div
          aria-hidden="true"
          className="halo pointer-events-none absolute inset-[12%] rounded-full bg-[conic-gradient(from_0deg,transparent,var(--color-accent),transparent_55%)] opacity-[0.18] blur-2xl"
        />

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0H0V28" fill="none" stroke="var(--color-line)" strokeWidth="1" />
            </pattern>
          </defs>
          <g className="grid-drift">
            <rect x="-28" y="-28" width={W + 56} height={H + 56} fill="url(#grid)" opacity="0.55" />
          </g>

          {edges.map((edge, i) => {
            const dim = active !== null && edge.from !== active && edge.to !== active
            const shared = { x1: edge.a.x, y1: edge.a.y, x2: edge.b.x, y2: edge.b.y }
            return (
              <g
                key={`${edge.from}-${edge.to}`}
                style={{ "--len": edge.len } as React.CSSProperties}
              >
                <line
                  {...shared}
                  stroke={dim ? "var(--color-line)" : "var(--color-accent-dim)"}
                  strokeWidth={dim ? 1 : 1.5}
                  className={cn("edge-draw transition-[stroke] duration-300")}
                  style={{
                    animationDuration: `${SEG_MS}ms`,
                    animationDelay: `${i * SEG_MS}ms`,
                  }}
                />
                {!dim ? (
                  // Revealed only once the whole figure is traced, so it cannot make the
                  // pentagon look finished while it is still being drawn.
                  <g
                    className="pulse-in"
                    style={{ animationDelay: `${edges.length * SEG_MS + 500}ms` }}
                  >
                    <line
                      {...shared}
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="edge-pulse"
                      style={{ animationDelay: `${i * 300}ms` }}
                    />
                  </g>
                ) : null}
              </g>
            )
          })}

          {points.map((p, i) => {
            const dim = active !== null && p.slug !== active
            return (
              <g key={p.slug} className="node-in" style={{ animationDelay: `${i * SEG_MS}ms` }}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="var(--color-pearl)"
                  stroke={dim ? "var(--color-line)" : "var(--color-accent)"}
                  strokeWidth="1.5"
                  className={cn("transition-[stroke] duration-300", !dim && "node-pulse")}
                  style={{ animationDelay: `${i * 260}ms` }}
                />
                {p.slug === active ? (
                  <circle cx={p.x} cy={p.y} r="2.5" fill="var(--color-accent)" />
                ) : null}
              </g>
            )
          })}
        </svg>

        {/* Real links, so the figure is navigation rather than decoration. */}
        {points.map((p) => (
          <Link
            key={p.slug}
            href={`/services/${p.slug}`}
            onMouseEnter={() => setActive(p.slug)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(p.slug)}
            onBlur={() => setActive(null)}
            className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
          >
            <span className="sr-only">{p.name}</span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute font-mono text-sm whitespace-nowrap transition-colors duration-300",
                labelPos(p.x, p.y),
                active !== null && p.slug !== active ? "text-muted/50" : "text-ink",
              )}
            >
              {p.label}
            </span>
          </Link>
        ))}
      </div>

      <p className="text-muted mx-auto mt-8 min-h-12 max-w-[26rem] text-center text-base">
        {current ? summary : site.tagline}
      </p>
    </div>
  )
}

/** Headline that assembles itself word by word. */
export function HeroHeadline({ text, className }: { text: string; className?: string }) {
  return (
    <h1 className={className}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span className="rise inline-block" style={{ animationDelay: `${i * 45}ms` }}>
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </h1>
  )
}
