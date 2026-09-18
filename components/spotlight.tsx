"use client"

// Sets --mx/--my from the pointer so the `spot` utility's glow follows the cursor.
// Pointer-only: with touch or keyboard the CSS falls back to a centred glow on
// :focus-within, so nothing depends on a mouse.

import { cn } from "@/lib/utils"

export function Spotlight({
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  as?: "div" | "li" | "article"
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty("--mx", `${x}px`)
    el.style.setProperty("--my", `${y}px`)
    // Tilt toward the cursor, capped at 5deg so it reads as depth rather than a gimmick.
    el.style.setProperty("--ry", `${((x / r.width - 0.5) * 10).toFixed(2)}deg`)
    el.style.setProperty("--rx", `${((0.5 - y / r.height) * 10).toFixed(2)}deg`)
  }

  const reset = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
  }

  return (
    <Tag
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn("spot", className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
