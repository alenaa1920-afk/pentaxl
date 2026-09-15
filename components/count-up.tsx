"use client"

// Counts a number up once, when it first scrolls into view. Honours reduced motion by
// rendering the final value immediately, and renders the final value server-side so the
// figure is never missing or wrong for crawlers.

import { useEffect, useRef, useState } from "react"

export function CountUp({ to, duration = 1100 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(to)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          // easeOutCubic — fast then settling, which reads as a counter landing.
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        setValue(0)
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  )
}
