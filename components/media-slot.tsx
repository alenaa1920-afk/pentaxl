import { Film, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * A reserved space for a real photo, screenshot or video.
 *
 * PLACEHOLDER by design: it states exactly which asset belongs here and at what size,
 * so dropping the real file in is mechanical. It is deliberately styled as a reserved
 * frame rather than a grey box pretending to be an image — and it holds its aspect
 * ratio, so adding the real asset causes no layout shift.
 */
export function MediaSlot({
  kind = "image",
  title,
  spec,
  ratio = "16 / 9",
  className,
}: {
  kind?: "image" | "video"
  title: string
  spec: string
  ratio?: string
  className?: string
}) {
  const Icon = kind === "video" ? Film : ImageIcon
  return (
    <figure
      className={cn(
        // w-full and min-w-0 matter: with only aspect-ratio set, a stretched grid item
        // derives its *width* from the row height and blows out its column.
        "border-line bg-panel relative m-0 grid w-full min-w-0 place-items-center border border-dashed",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-line) 0 1px, transparent 1px 10px)",
        }}
      />
      <figcaption className="relative grid justify-items-center gap-2 p-6 text-center">
        <Icon aria-hidden="true" className="text-accent size-5" />
        <span className="text-base">{title}</span>
        <span className="text-muted font-mono text-sm">{spec}</span>
      </figcaption>
    </figure>
  )
}
