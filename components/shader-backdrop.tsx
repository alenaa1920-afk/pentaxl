"use client"

// The Paper Shaders mesh gradient, adopted as the site's signature backdrop.
//
// Three things make this safe to put behind real content:
//   1. Loaded with next/dynamic so the WebGL bundle is a separate chunk fetched after
//      paint, not part of first-load JS.
//   2. Skipped entirely under prefers-reduced-motion, which falls back to the static
//      CSS gradient — a continuously moving backdrop is exactly what that setting is
//      for. Also skipped when the tab is hidden, so it stops costing GPU off-screen.
//   3. Always paired with a scrim by the caller; text never sits on raw shader output.

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false },
)

/** Brand hues, darkest first so the shader's base stays deep. */
const COLORS = ["#0a1028", "#4f2bff", "#7a2bf5", "#be185d", "#0a1028"]

export function ShaderBackdrop({
  className,
  speed = 0.22,
  swirl = 0.5,
}: {
  className?: string
  speed?: number
  swirl?: number
}) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (query.matches) return

    const onVisibility = () => setEnabled(!document.hidden)
    onVisibility()
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  return (
    <div aria-hidden="true" className={cn("absolute inset-0 -z-20 overflow-hidden", className)}>
      {/* The static gradient is always present: it is the reduced-motion and
          pre-hydration state, and the shader simply paints over it. */}
      <div className="mesh absolute inset-0" />
      {enabled ? (
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={COLORS}
          speed={speed}
          swirl={swirl}
        />
      ) : null}
    </div>
  )
}
