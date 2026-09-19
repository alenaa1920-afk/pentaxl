"use client"

// The hero. Centred, and the arrival is choreographed in CSS: eyebrow, then the
// headline word by word, then support, actions, stats, then the figure draws itself.
// No animation library — keyframes do this identically for 0 kB, and the complaint
// was that the site felt slow.

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

/** Milliseconds per traced segment. Owner asked for a visible, unhurried draw. */
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

/** Headline with a per-word entrance and the last clause in gradient. */
export function HeroHeadline({
  lead,
  accent,
  className,
}: {
  lead: string
  accent: string
  className?: string
}) {
  const words = lead.split(" ")
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span className="enter-word inline-block" style={{ animationDelay: `${180 + i * 55}ms` }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}{" "}
      <span className="inline-block overflow-hidden align-bottom">
        <span
          className="gradient-text enter-word inline-block"
          style={{ animationDelay: `${180 + words.length * 55}ms` }}
        >
          {accent}
        </span>
      </span>
    </h1>
  )
}

export function HeroFigure() {
  const [active, setActive] = useState<string | null>(null)
  const summary = active ? services.find((s) => s.slug === active)?.summary : null

  return (
    <div className="w-full">
      <div
        className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem]"
        style={{ aspectRatio: W / H }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden="true">
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
                  stroke={dim ? "var(--color-line)" : "var(--color-accent)"}
                  strokeWidth={dim ? 1 : 1.5}
                  className={cn("edge-draw transition-[stroke] duration-300")}
                  style={{
                    animationDuration: `${SEG_MS}ms`,
                    animationDelay: `${900 + i * SEG_MS}ms`,
                  }}
                />
                {!dim ? (
                  <g
                    className="pulse-in"
                    style={{ animationDelay: `${900 + edges.length * SEG_MS + 400}ms` }}
                  >
                    <line
                      {...shared}
                      stroke="var(--color-accent-2)"
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
              <g
                key={p.slug}
                className="node-in"
                style={{ animationDelay: `${900 + i * SEG_MS}ms` }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="var(--color-canvas)"
                  stroke={dim ? "var(--color-line)" : "var(--color-accent-2)"}
                  strokeWidth="1.5"
                  className={cn("transition-[stroke] duration-300", !dim && "node-pulse")}
                  style={{ animationDelay: `${i * 260}ms` }}
                />
              </g>
            )
          })}
        </svg>

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

      <p className="text-muted mx-auto mt-6 min-h-12 max-w-[26rem] text-center text-base">
        {summary ?? site.tagline}
      </p>
    </div>
  )
}
