"use client"

// Carousel built on native scroll-snap: touch drag, trackpad and keyboard all work
// without a gesture library. Arrows disable at the ends instead of wrapping silently,
// and the live region announces position for screen readers.
//
// No autoplay, deliberately — nothing here moves on its own, so there is no WCAG
// 2.2.2 pause control to get wrong, and the reader stays in charge.

import { Children, useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Carousel({
  label,
  children,
  itemClass = "w-[85%] sm:w-[60%] lg:w-[38%]",
}: {
  label: string
  children: React.ReactNode
  /** Width of each slide. Percentages keep it responsive without a resize listener. */
  itemClass?: string
}) {
  const rail = useRef<HTMLUListElement>(null)
  const [state, setState] = useState({ index: 0, atStart: true, atEnd: false })
  // Children.toArray flattens nested arrays and fragments, so `{list}` followed by a
  // trailing slide becomes one slide each rather than [allOfTheList, trailing].
  const items = Children.toArray(children)

  const sync = useCallback(() => {
    const el = rail.current
    if (!el) return
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4

    // Nearest slide by offset, not scrollLeft / step: the final slide can never scroll
    // all the way to the left edge, so a step-based index would never reach the last one.
    const slides = [...el.children] as HTMLElement[]
    let index = 0
    let best = Infinity
    slides.forEach((slide, i) => {
      const d = Math.abs(slide.offsetLeft - el.offsetLeft - el.scrollLeft)
      if (d < best) {
        best = d
        index = i
      }
    })

    setState({
      index: atEnd ? slides.length - 1 : index,
      atStart: el.scrollLeft < 4,
      atEnd,
    })
  }, [])

  useEffect(() => {
    sync()
    const el = rail.current
    if (!el) return
    el.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      el.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [sync])

  const goTo = (i: number) => {
    const el = rail.current
    if (!el) return
    const slide = el.children[Math.max(0, Math.min(el.children.length - 1, i))] as
      HTMLElement | undefined
    if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" })
  }

  const page = (dir: 1 | -1) => goTo(state.index + dir)

  return (
    <div className="group/car">
      <ul ref={rail} className="rail gap-4" tabIndex={0} aria-label={label}>
        {items.map((child, i) => (
          <li key={i} className={itemClass}>
            {child}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-6">
        {/* Dots double as position indicator and direct navigation. */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to item ${i + 1} of ${items.length}`}
              aria-current={i === state.index}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === state.index ? "bg-accent w-8" : "bg-line hover:bg-muted w-4",
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={state.atStart}
            aria-label="Previous"
            className="glow border-line text-muted hover:text-accent inline-flex size-11 items-center justify-center border disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={state.atEnd}
            aria-label="Next"
            className="glow border-line text-muted hover:text-accent inline-flex size-11 items-center justify-center border disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Item {state.index + 1} of {items.length}
      </p>
    </div>
  )
}
