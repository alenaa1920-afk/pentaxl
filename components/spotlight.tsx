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
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
  }

  return (
    <Tag onPointerMove={onPointerMove} className={cn("spot", className)} {...rest}>
      {children}
    </Tag>
  )
}
