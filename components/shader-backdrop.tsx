"use client"

// The site's background: one fixed, full-viewport shader behind every page, always
// moving. Two stacked mesh gradients at different speeds and swirls, which is what
// gives the ground depth rather than one flat drifting blob.
//
// WebGL cannot paint before its JS loads, so the arrival is hidden rather than
// avoided: the `mesh` gradient in globals.css is the same palette in the same
// positions, painted server-side on the first frame, and the canvas cross-fades over
// it for 1.4s. Nothing pops in because there is nothing new to see.
//
// The shader only animates over the first screen. A full-viewport canvas that keeps
// repainting is the single thing this page cannot afford: it is composited under every
// translucent panel on screen, and each repaint forces all of their backdrop-filters to
// run again. Measured on an Intel UHD 630, any perpetually animating full-screen canvas
// pinned the page at 25-40 fps, and freezing it returned it to 60 — resolution barely
// mattered, so this is compositing cost, not shading cost. `speed={0}` is the
// library's own supported stop: it cancels the render loop and leaves the last frame
// on screen, so the ground below the fold is a still gradient rather than a missing
// one. The library already stops for a hidden tab and for an off-screen element, but
// this element is `fixed`, so it is never off-screen and that never fires.

import { MeshGradient } from "@paper-design/shaders-react"
import { useEffect, useState } from "react"

/**
 * The library renders at `max(devicePixelRatio, minPixelRatio)` and defaults
 * minPixelRatio to 2 — so on an ordinary 1x display each of these canvases was running
 * a fragment shader over 2880x1800, twice, every frame. That measured 3 fps on an
 * Intel UHD 630. These two props are the whole fix: a mesh gradient is soft blobs with
 * no edge to alias, so rendering below the viewport and letting the browser scale it up
 * is visually identical and many times less work.
 *
 * The cap is 1024x576 because that is where the hero measured a clean 60 fps; 720p sat
 * at ~52 and 480p bought nothing further. Raise it only with a frame-rate measurement
 * in hand.
 */
const RENDER = { minPixelRatio: 1, maxPixelCount: 1024 * 576 }

/**
 * Deep base, brand violet, magenta, teal — base first and last so the loop returns to
 * it. Saturation and contrast are baked into these values rather than applied as a CSS
 * filter on the wrapper: a filter over the canvas stack is a full-screen composite pass
 * every frame, and the colours are static, so it may as well be free.
 */
const BASE = ["#03002a", "#5119ff", "#ff00da", "#009fd3", "#180048"]
/** A faster, swirlier veil on top. Lighter hues so it reads as light, not paint. */
const VEIL = ["#03002a", "#29f4ff", "#ff6acb", "#bfadff"]

export function ShaderBackdrop() {
  const [live, setLive] = useState(false)
  const [moving, setMoving] = useState(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setLive(true)

    // Re-rendering on every scroll event would cost more than it saves; React bails out
    // when the value is unchanged, so this only re-renders on the two crossings.
    const sync = () => setMoving(window.scrollY < window.innerHeight)
    sync()
    window.addEventListener("scroll", sync, { passive: true })
    return () => window.removeEventListener("scroll", sync)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-50">
      <div className="mesh absolute inset-0" />
      {live ? (
        <div className="shader-in absolute inset-0">
          <MeshGradient
            className="absolute inset-0 h-full w-full"
            colors={BASE}
            speed={moving ? 0.3 : 0}
            {...RENDER}
          />
          <MeshGradient
            className="absolute inset-0 h-full w-full opacity-45"
            colors={VEIL}
            speed={moving ? 0.21 : 0}
            swirl={0.6}
            {...RENDER}
          />
        </div>
      ) : null}
      {/* The scrim every contrast number in globals.css assumes. */}
      <div className="absolute inset-0 bg-[#07061a]/58" />
    </div>
  )
}
