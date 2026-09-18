"use client"

// Real ARIA tabs: roving tabindex, arrow/Home/End keys, one tab in the tab order.
// Hovering a tab glows it; selecting swaps the panel. Used for the services explorer
// and the stack clusters.

import { useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type Tab = {
  id: string
  label: string
  icon?: React.ReactNode
}

export function Tabs({
  tabs,
  children,
  label,
  className,
}: {
  tabs: Tab[]
  /** Renders the panel for the active tab. */
  children: (activeId: string, index: number) => React.ReactNode
  label: string
  className?: string
}) {
  const [active, setActive] = useState(0)
  const uid = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (to: number) => {
    const next = (to + tabs.length) % tabs.length
    setActive(next)
    refs.current[next]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number | undefined> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: tabs.length - 1,
    }
    const to = keys[e.key]
    if (to === undefined) return
    e.preventDefault()
    move(to)
  }

  return (
    <div className={className}>
      {/* Scrolls horizontally on narrow screens rather than wrapping into a block. */}
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="rail -mx-5 gap-2 px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {tabs.map((tab, i) => {
          const selected = i === active
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "glow inline-flex min-h-11 items-center gap-2 border px-4 text-base whitespace-nowrap",
                selected
                  ? "glow-on bg-surface-2 text-accent"
                  : "border-line text-muted hover:text-ink",
              )}
            >
              {tab.icon ? (
                <span aria-hidden="true" className="shrink-0">
                  {tab.icon}
                </span>
              ) : null}
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${uid}-panel-${tab.id}`}
          aria-labelledby={`${uid}-tab-${tab.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-8 focus-visible:outline-2"
        >
          {i === active ? children(tab.id, i) : null}
        </div>
      ))}
    </div>
  )
}
