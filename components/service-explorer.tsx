"use client"

// The five disciplines as a tabbed showcase: a list on one side, one large glass panel
// on the other. Client only because the selection changes, and because it advances on
// its own (with a visible progress line) until someone picks a discipline themselves.
// Proper tabs pattern: arrow keys move between tabs, the panel is labelled by its tab.
// Below lg the list becomes a row of chips above the panel.

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { services } from "@/content/services"
import { serviceMedia } from "@/content/media"
import { ServiceIcon } from "./icons"
import { cn } from "@/lib/utils"

const AUTO_MS = 3800

export function ServiceExplorer() {
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [paused, setPaused] = useState(false)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const service = services[active]

  useEffect(() => {
    if (held || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % services.length), AUTO_MS)
    return () => window.clearTimeout(id)
  }, [active, held, paused])

  const pick = (i: number, focus = false) => {
    setHeld(true)
    setActive(i)
    if (focus) tabs.current[i]?.focus()
  }

  return (
    <div
      className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:gap-8"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        role="tablist"
        aria-label="Disciplines"
        aria-orientation="vertical"
        className="rail -mx-5 gap-2 px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        onKeyDown={(e) => {
          const n = services.length
          if (e.key === "ArrowDown" || e.key === "ArrowRight") pick((active + 1) % n, true)
          else if (e.key === "ArrowUp" || e.key === "ArrowLeft") pick((active - 1 + n) % n, true)
          else return
          e.preventDefault()
        }}
      >
        {services.map((s, i) => {
          const on = i === active
          return (
            <button
              key={s.slug}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`svc-tab-${s.slug}`}
              aria-selected={on}
              aria-controls="svc-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => pick(i)}
              className={cn(
                "group relative flex min-h-11 items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3 text-left transition-colors duration-300 lg:py-4",
                on ? "border-line-strong bg-surface-2" : "hover:bg-surface border-transparent",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300",
                  on ? "border-accent/50 text-accent-2 bg-accent/10" : "border-line text-muted",
                )}
              >
                <ServiceIcon slug={s.slug} className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="font-display block text-base whitespace-nowrap lg:text-lg">
                  {s.name}
                </span>
                <span className="text-muted hidden text-sm lg:line-clamp-1">{s.summary}</span>
              </span>
              {/* Time until the next discipline, while it is still advancing by itself. */}
              {on && !held ? (
                <span
                  key={`p${active}`}
                  aria-hidden="true"
                  className="tab-progress from-accent-2 to-accent absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r"
                  style={{
                    animationDuration: `${AUTO_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              ) : null}
            </button>
          )
        })}
      </div>

      <div
        id="svc-panel"
        role="tabpanel"
        aria-labelledby={`svc-tab-${service.slug}`}
        className="panel relative overflow-hidden rounded-3xl"
      >
        {/* Masked rather than scrimmed, so the photograph fades into the panel's own
            glass instead of ending on a darker band. */}
        <div className="relative aspect-[16/9] w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:aspect-[21/9]">
          {services.map((s, i) => (
            <Image
              key={s.slug}
              src={serviceMedia[s.slug].src}
              alt={i === active ? serviceMedia[s.slug].alt : ""}
              aria-hidden={i !== active}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={cn(
                "object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
              )}
            />
          ))}
        </div>

        <div key={service.slug} className="rise relative -mt-16 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl">{service.name}</h3>
          <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">{service.summary}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {service.deliverables.slice(0, 4).map((d) => (
              <li key={d} className="flex gap-3 text-base">
                <Check aria-hidden="true" className="text-accent-2 mt-1 size-4 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
          <Link
            href={`/services/${service.slug}`}
            className="text-accent group mt-8 inline-flex min-h-11 items-center gap-2 font-mono text-sm"
          >
            Explore {service.name}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
