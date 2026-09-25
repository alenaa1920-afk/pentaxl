import Image from "next/image"
import { Container } from "./ui"
import { cn } from "@/lib/utils"
import type { media } from "@/content/media"

type Photo = (typeof media)[keyof typeof media]

/**
 * A full-width band with photography behind it, taken straight from the media registry
 * so the alt text and credit travel with the image rather than being retyped per page.
 *
 * The scrim is not decoration: text over bare photography fails contrast the moment the
 * image changes. Everything inside uses `.on-photo`, which is only safe above a scrim.
 */
export function PhotoBand({
  photo,
  eyebrow,
  title,
  body,
  height = "tall",
  priority = false,
  children,
}: {
  photo: Photo
  eyebrow?: string
  title: string
  body?: string
  height?: "tall" | "short"
  /** Set on a band that is above the fold, so it is not lazy-loaded. */
  priority?: boolean
  children?: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "on-photo relative isolate flex items-end overflow-hidden",
        height === "tall" ? "min-h-[32rem] md:min-h-[38rem]" : "min-h-[22rem]",
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="100vw"
        className="ken-burns -z-20 object-cover"
        priority={priority}
      />
      {/* Scrim: dark at the bottom where the text sits, lighter up top. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a1028f2] via-[#0a1028b3] to-[#0a102855]"
      />

      <Container>
        <div className="max-w-measure py-14 md:py-20">
          {eyebrow ? <p className="text-accent font-mono text-sm">{eyebrow}</p> : null}
          <h2 className="mt-3 text-2xl md:text-3xl">{title}</h2>
          {body ? <p className="text-muted mt-5 text-base md:text-lg">{body}</p> : null}
          {children}
        </div>
      </Container>

      <p className="text-muted absolute right-4 bottom-3 font-mono text-sm opacity-70">
        {photo.credit}
      </p>
    </section>
  )
}
