import Image from "next/image"
import { Container } from "./ui"
import { ShaderBackdrop } from "./shader-backdrop"
import { cn } from "@/lib/utils"

/**
 * A full-width band with photography behind it.
 *
 * Pass `src` (a file in public/media) and it renders the real image with a slow Ken
 * Burns zoom under a gradient scrim. With no `src` it falls back to the animated vivid
 * mesh, so the band is alive rather than empty — and it names the asset it is waiting
 * for, at the exact size needed.
 *
 * The scrim is not decoration: text over bare photography fails contrast the moment the
 * image changes. Everything inside uses `.on-photo`, which is only safe above a scrim.
 *
 * PLACEHOLDER: every band currently has no `src`. Drop files into public/media and pass
 * the path — nothing else needs to change.
 */
export function PhotoBand({
  src,
  alt,
  eyebrow,
  title,
  body,
  spec,
  credit,
  height = "tall",
  children,
}: {
  /** e.g. "/media/team-review.jpg". Omit to show the animated fallback. */
  src?: string
  alt?: string
  eyebrow?: string
  title: string
  body?: string
  /** Shown only in the fallback state, so you know what belongs here. */
  spec?: string
  /** Small source line, bottom-right. */
  credit?: string
  height?: "tall" | "short"
  children?: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "on-photo relative isolate flex items-end overflow-hidden",
        height === "tall" ? "min-h-[32rem] md:min-h-[38rem]" : "min-h-[22rem]",
      )}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            sizes="100vw"
            className="ken-burns -z-20 object-cover"
            priority={false}
          />
          {/* Scrim: dark at the bottom where the text sits, lighter up top. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a1028f2] via-[#0a1028b3] to-[#0a102855]"
          />
        </>
      ) : (
        <>
          {/* No photo: the signature shader, with the same scrim treatment. */}
          <ShaderBackdrop />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/30 to-transparent"
          />
        </>
      )}

      <Container>
        <div className="max-w-measure py-14 md:py-20">
          {eyebrow ? <p className="text-accent font-mono text-sm">{eyebrow}</p> : null}
          <h2 className="mt-3 text-2xl md:text-3xl">{title}</h2>
          {body ? <p className="text-muted mt-5 text-base md:text-lg">{body}</p> : null}
          {children}
          {!src && spec ? (
            <p className="border-line mt-8 inline-block border px-3 py-1.5 font-mono text-sm">
              Photograph goes here — {spec}
            </p>
          ) : null}
        </div>
      </Container>

      {credit ? (
        <p className="text-muted absolute right-4 bottom-3 font-mono text-sm opacity-70">
          {credit}
        </p>
      ) : null}
    </section>
  )
}
