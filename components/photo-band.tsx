import Image from "next/image"
import { Container } from "./ui"
import { cn } from "@/lib/utils"
import type { media } from "@/content/media"

type Photo = (typeof media)[keyof typeof media]

/**
 * A full-width band with photography behind it, taken straight from the media registry
 * so the alt text travels with the image rather than being retyped per page.
 *
 * The scrim is not decoration: text over bare photography fails contrast the moment the
 * image changes. Everything inside uses `.on-photo`, which is only safe above a scrim.
 */
export function PhotoBand({
  photo,
  title,
  body,
  height = "tall",
  priority = false,
  children,
}: {
  photo: Photo
  title: string
  body?: string
  height?: "tall" | "short"
  /** Set on a band that is above the fold, so it is not lazy-loaded. */
  priority?: boolean
  children?: React.ReactNode
}) {
  // Inset and rounded rather than edge to edge (feedback 2026-11): a framed picture
  // sitting on the shader ground, like every other surface on the site.
  return (
    <div className="py-6 md:py-10">
      <Container>
        <section
          className={cn(
            "on-photo border-line relative isolate flex items-end overflow-hidden rounded-3xl border",
            height === "tall" ? "min-h-[26rem] md:min-h-[34rem]" : "min-h-[20rem]",
          )}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1248px) 1168px, 100vw"
            className="ken-burns -z-20 object-cover"
            priority={priority}
          />
          {/* Scrim: dark at the bottom where the text sits, lighter up top. */}
          <div
            aria-hidden="true"
            className="from-canvas/95 via-canvas/55 to-accent-dim/10 absolute inset-0 -z-10 bg-linear-to-t"
          />
          <div className="max-w-measure px-6 py-10 md:px-12 md:py-14">
            <h2 className="text-2xl md:text-3xl">{title}</h2>
            {body ? <p className="text-muted mt-5 text-base md:text-lg">{body}</p> : null}
            {children}
          </div>
        </section>
      </Container>
    </div>
  )
}
