"use client"

// The film on /process. It is stock b-roll, not a recording of a PentaXL build, so it is
// treated as illustration: muted, hidden from screen readers, with the text beside it
// doing the explaining. There is no audio track carrying meaning, so nothing to caption.
//
// It plays only while on screen and pauses when scrolled away, so it costs nothing when
// nobody is looking at it. Anyone who has asked for reduced motion gets the poster and a
// play button instead of autoplay. The pause control is always visible: WCAG 2.2.2 —
// anything that moves on its own for more than five seconds needs a way to stop it.
// A pause by hand is remembered, so scrolling away and back does not override it.

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"

export function EngagementFilm({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const heldByUser = useRef(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause()
        else if (!heldByUser.current) video.play().catch(() => {})
      },
      { threshold: 0.25 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    heldByUser.current = !video.paused
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <div className="border-line relative overflow-hidden border">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block aspect-video h-auto w-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the video" : "Play the video"}
        className="bg-canvas/75 border-line-strong text-ink hover:text-accent absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full border transition-colors"
      >
        {playing ? (
          <Pause aria-hidden="true" className="size-4" />
        ) : (
          <Play aria-hidden="true" className="size-4" />
        )}
      </button>
    </div>
  )
}
