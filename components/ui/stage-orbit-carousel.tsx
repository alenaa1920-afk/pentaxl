"use client"

// The delivery stages as an orbit carousel, adapted from the supplied
// DishOrbitCarousel: the photo swings out over the top on a wide orbit while the next
// swings in, the two-weight title wipes out and back in, the card cross-fades and a
// pastel arc behind turns and takes the stage's colour.
//
// Scrolling *over the carousel* turns the stages — down for the next, up for the one
// before — until the last (or first) is reached, and then scrolls the page on.
// Scrolling anywhere else, the sides included, always scrolls the page. Each wheel or
// swipe gesture is decided by its first event and moves at most one stage; it ends once
// the input has been quiet for QUIET_MS, so trackpad momentum can never carry a second
// stage, and a page scroll that drifts under the cursor never turns into one.

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { journey, processStages } from "@/content/process"
import { stageMedia } from "@/content/media"

/** Badge and band colours, one per stage, tuned to read on the violet ground. Hex, so
 *  the band can morph between them. */
const ACCENTS = ["#9deeff", "#b9adff", "#ff9bd6", "#ffd38a", "#8ef0c4"]

const stages = processStages.map((s, i) => ({
  ...s,
  ...stageMedia[i],
  accent: ACCENTS[i % ACCENTS.length],
}))
const n = stages.length

// The photos' orbit: its pivot sits above the canvas (the .dsh-orbit transform-origin).
const ORBIT_X = 299
const ORBIT_Y = -450
const ORBIT_R = 650
/** Where the band rests for each stage, [start, end] degrees along the orbit. */
const ARC_REST = [
  [50, 98],
  [46, 124],
  [60, 126],
  [40, 100],
]
/** The band mid-swap, stretched to trail between the outgoing and incoming photo. */
const ARC_SWEEP = [38, 146]
const SWING = 50 // degrees a photo travels round the orbit's pivot
/** Playback speed of the swap. 1 is the original's pace; asked for snappier. */
const SPEED = 1.35
/** Input silence that ends a gesture. Long enough to cover trackpad momentum gaps. */
const QUIET_MS = 180
/** Share of the carousel that must be on screen before scrolling over it turns stages. */
const MIN_VISIBLE = 0.6
const ITEM = 118 // thumbnail pitch in canvas px
const VISIBLE = 4

const HIDE_1 = "inset(0% 0% 0% 100%)" // thin line: wipes in from the right
const HIDE_2 = "inset(0% 100% 0% 0%)" // heavy line: wipes in from the left
const SHOW = "inset(0% 0% 0% 0%)"

/** Title font size so a line of `chars` characters fits `width` px at `em` average glyph width. */
const fitSize = (chars: number, max: number, width: number, em: number) =>
  Math.min(max, width / (Math.max(1, chars) * em))

/** The band: a thick stroke along the photos' orbit circle, tapering at both ends. */
function arcPath(a0: number, a1: number, w = 118, steps = 48) {
  const outer: string[] = []
  const inner: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45)
    const [c, s] = [Math.cos(a), Math.sin(a)]
    outer.push(
      `${(ORBIT_X + c * (ORBIT_R + h)).toFixed(1)} ${(ORBIT_Y + s * (ORBIT_R + h)).toFixed(1)}`,
    )
    inner.push(
      `${(ORBIT_X + c * (ORBIT_R - h)).toFixed(1)} ${(ORBIT_Y + s * (ORBIT_R - h)).toFixed(1)}`,
    )
  }
  return `M${outer.join("L")}L${inner.reverse().join("L")}Z`
}

// Everything that moves is transform, opacity or clip — and no backdrop-filter: a
// blurred glass card over a moving shader and a moving arc re-blurs every frame, which
// is what stood between this and a steady 60fps.
const CSS =
  // A framed box rather than full-bleed, so there are sides of the page to scroll on.
  ".dsh-root{--dsh-top:4.5rem;position:relative;overflow:hidden;width:100%;height:min(calc(100svh - var(--dsh-top) - 3rem),44rem);" +
  "border-radius:28px;border:1px solid var(--color-line);background:rgba(255,255,255,.03);color:var(--color-ink);" +
  "font-family:var(--font-display);container-type:inline-size;-webkit-tap-highlight-color:transparent}" +
  "@media (min-width:768px){.dsh-root{--dsh-top:5.5rem}}" +
  ".dsh-root *{box-sizing:border-box}" +
  ".dsh-root:focus-visible{outline:2px solid var(--color-accent-2);outline-offset:-4px}" +
  ".dsh-canvas{position:absolute;left:50%;top:50%;width:960px;height:520px;transform:translate(-50%,-50%) scale(var(--dsh-s,1))}" +
  ".dsh-arc{position:absolute;inset:0;width:960px;height:520px;overflow:visible;pointer-events:none}" +
  ".dsh-btn{appearance:none;border:0;background:none;color:inherit;font:inherit;padding:0;margin:0;cursor:pointer}" +
  ".dsh-btn:focus-visible{outline:2px solid var(--color-accent-2);outline-offset:3px;border-radius:10px}" +
  ".dsh-pager{position:absolute;left:76px;top:172px;display:flex;flex-direction:column;align-items:center;gap:7px}" +
  ".dsh-dot{width:14px;height:10px;display:grid;place-items:center;transition:height .4s cubic-bezier(.3,.7,.2,1)}" +
  ".dsh-dot i{display:block;width:3px;height:3px;border-radius:3px;background:var(--color-ink);opacity:.45;transition:height .4s cubic-bezier(.3,.7,.2,1),opacity .3s}" +
  ".dsh-dot[aria-selected=true]{height:26px}" +
  ".dsh-dot[aria-selected=true] i{height:22px;opacity:.9}" +
  ".dsh-plates{position:absolute;left:130px;top:82px;width:245px;height:245px}" +
  ".dsh-orbit{position:absolute;inset:0;transform-origin:69% -217%;visibility:hidden;will-change:transform}" +
  ".dsh-photo{position:absolute;inset:0;border-radius:50%;overflow:hidden;" +
  "box-shadow:0 0 0 1px rgba(255,255,255,.22),0 0 0 7px rgba(255,255,255,.05),0 22px 40px -12px rgba(0,0,0,.55)}" +
  ".dsh-photo img,.dsh-thi img{object-fit:cover;user-select:none;-webkit-user-drag:none}" +
  ".dsh-head{position:absolute;left:388px;top:64px;width:320px;height:290px}" +
  ".dsh-hd{position:absolute;inset:0;visibility:hidden}" +
  ".dsh-eye{font-family:var(--font-mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--color-accent-2);margin:0 0 4px 2px}" +
  ".dsh-t1,.dsh-t2{display:block;white-space:nowrap;line-height:1;text-transform:uppercase;margin:6px 0 0}" +
  ".dsh-t1{font-weight:200;letter-spacing:-.015em}" +
  ".dsh-t2{font-weight:800;letter-spacing:-.025em;color:color-mix(in oklab,var(--color-ink) 90%,transparent)}" +
  ".dsh-desc{font-family:var(--font-sans);font-size:12px;line-height:1.5;margin:14px 0 0 2px;color:var(--color-muted)}" +
  ".dsh-card{position:absolute;left:722px;top:112px;width:223px;padding:18px 20px 20px;border-radius:20px;" +
  "background:rgba(22,15,58,.78);border:1px solid var(--color-line);box-shadow:0 18px 40px -24px rgba(0,0,0,.5)}" +
  ".dsh-tabs{display:flex;justify-content:space-between;padding:0 6px 0 20px;font-family:var(--font-sans);font-size:12px;margin-bottom:18px}" +
  ".dsh-tab{color:var(--color-muted);font-weight:500;padding:3px 0}" +
  ".dsh-tab[aria-selected=true]{color:var(--color-ink);font-weight:600;box-shadow:0 1px 0 var(--color-accent-2)}" +
  ".dsh-bodies{display:grid}" +
  ".dsh-body{grid-area:1/1;visibility:hidden}" +
  ".dsh-rate{display:flex;align-items:center;gap:12px;margin:0 0 14px 6px}" +
  ".dsh-badge{position:relative;width:40px;height:52px;border-radius:10px;flex:none}" +
  ".dsh-badge svg{position:absolute;left:12px;top:18px;width:16px;height:16px;fill:var(--color-on-accent);opacity:.85}" +
  ".dsh-lab{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--color-muted)}" +
  ".dsh-out{font-size:15px;font-weight:600;letter-spacing:-.01em;line-height:1.3;margin:0 0 12px}" +
  ".dsh-txt{font-family:var(--font-sans);font-size:12.5px;line-height:1.45;margin:0;min-height:72px;color:var(--color-muted)}" +
  ".dsh-cta{display:inline-flex;align-items:center;min-height:36px;margin-top:16px;padding:0 16px;border-radius:99px;" +
  "font-family:var(--font-sans);font-size:12px;font-weight:600;background:var(--color-accent);color:var(--color-on-accent)}" +
  ".dsh-strip{position:absolute;left:130px;top:388px;width:550px;height:122px;display:flex;align-items:center}" +
  ".dsh-arrow{width:36px;height:36px;display:grid;place-items:center;flex:none}" +
  ".dsh-arrow svg{width:12px;height:16px;fill:currentColor}" +
  ".dsh-arrow:disabled{opacity:.3;cursor:default}" +
  `.dsh-win{position:relative;width:${ITEM * VISIBLE}px;height:122px;overflow:hidden;flex:none;margin:0 2px;` +
  "-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}" +
  ".dsh-track{position:absolute;left:0;top:0;display:flex;transition:transform .5s cubic-bezier(.65,0,.35,1)}" +
  `.dsh-th{width:${ITEM}px;height:122px;display:flex;justify-content:center;padding-top:3px}` +
  ".dsh-th .dsh-btn{width:84px;height:116px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:9px;transition:background .4s}" +
  ".dsh-th .dsh-btn[aria-current]{background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px var(--color-line)}" +
  // No hover/active scale on the thumbnail: an upscaled bitmap is what looked soft.
  ".dsh-thi{position:relative;width:56px;height:56px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.2)}" +
  ".dsh-th .dsh-btn[aria-current] .dsh-thi{box-shadow:0 0 0 2px var(--color-accent-2)}" +
  ".dsh-thl{font-family:var(--font-sans);font-size:10.5px;line-height:1.25;text-align:center;font-weight:500;color:var(--color-muted);max-width:80px}" +
  ".dsh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  "@container (max-width:639px){" +
  ".dsh-canvas{position:relative;left:auto;top:auto;width:100%;height:auto;transform:none;display:flex;flex-direction:column;align-items:center;padding:14px 16px 18px}" +
  ".dsh-arc{width:200%;height:auto;left:-60%;top:-30px}" +
  ".dsh-pager{left:14px;top:120px}" +
  ".dsh-plates{position:relative;left:auto;top:auto;width:min(48vw,28svh);height:min(48vw,28svh)}" +
  ".dsh-head{position:relative;left:auto;top:auto;width:100%;height:150px;margin-top:10px}" +
  ".dsh-hd{text-align:center;transform:scale(.78);transform-origin:50% 0}" +
  ".dsh-desc{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px}" +
  ".dsh-card{position:relative;left:auto;top:auto;width:100%;max-width:420px;margin-top:8px}" +
  ".dsh-rate,.dsh-strip{display:none}" +
  "}" +
  "@media (prefers-reduced-motion:reduce){.dsh-track,.dsh-dot,.dsh-dot i,.dsh-th .dsh-btn{transition:none}}"

export function StageOrbitCarousel() {
  const [index, setIndex] = useState(0)
  const [tab, setTab] = useState<"overview" | "ai">("overview")

  const rootRef = useRef<HTMLDivElement>(null)
  const orbits = useRef<(HTMLDivElement | null)[]>([])
  const heads = useRef<(HTMLDivElement | null)[]>([])
  const bodies = useRef<(HTMLDivElement | null)[]>([])
  const arcRef = useRef<SVGPathElement>(null)
  const arc = useRef({ a0: 0, a1: 0 })
  const shown = useRef(-1)
  const indexRef = useRef(0)
  const dirRef = useRef<1 | -1>(1)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  /** Only refs and a state setter, so it is safe to call from long-lived listeners. */
  const go = (to: number) => {
    const next = Math.max(0, Math.min(n - 1, to))
    if (next === indexRef.current) return
    dirRef.current = next > indexRef.current ? 1 : -1
    indexRef.current = next
    setIndex(next)
  }

  // Fit the 960 x 520 design canvas to the root. Measured on resize only.
  useLayoutEffect(() => {
    const el = rootRef.current!
    const fit = () =>
      el.style.setProperty(
        "--dsh-s",
        String(Math.min(el.clientWidth / 960, el.clientHeight / 520, 1.6)),
      )
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // The swap. Every stage is in the DOM; GSAP only moves the outgoing and incoming one.
  useLayoutEffect(() => {
    const from = shown.current
    const to = index
    shown.current = to
    const parts = (i: number) => {
      const q = (s: string) => heads.current[i]?.querySelector(s) ?? null
      return {
        orbit: orbits.current[i],
        head: heads.current[i],
        eye: q(".dsh-eye"),
        t1: q(".dsh-t1"),
        t2: q(".dsh-t2"),
        desc: q(".dsh-desc"),
        body: bodies.current[i],
      }
    }
    const drawArc = () => arcRef.current?.setAttribute("d", arcPath(arc.current.a0, arc.current.a1))
    const rest = ARC_REST[to % ARC_REST.length]
    tlRef.current?.progress(1).kill()
    const b = parts(to)

    if (from === -1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stages.forEach((_, i) => {
        if (i === to) return
        const p = parts(i)
        gsap.set([p.orbit, p.head, p.body], { autoAlpha: 0 })
      })
      gsap.set([b.orbit, b.head, b.body, b.eye, b.desc], { autoAlpha: 1, rotation: 0, y: 0 })
      gsap.set([b.t1, b.t2], { clipPath: SHOW })
      arc.current.a0 = rest[0]
      arc.current.a1 = rest[1]
      drawArc()
      gsap.set(arcRef.current, { fill: stages[to].accent })
      return
    }

    const a = parts(from)
    const d = dirRef.current
    const tl = gsap.timeline({ onComplete: () => void (tlRef.current = null) }).timeScale(SPEED)
    tlRef.current = tl
    // photo: out over the top on the orbit, the next one swings in from the far side
    tl.to(a.orbit, { rotation: SWING * d, duration: 0.62, ease: "power2.in" }, 0)
      .set(a.orbit, { autoAlpha: 0, rotation: 0 }, 0.62)
      .fromTo(
        b.orbit,
        { autoAlpha: 1, rotation: -SWING * d },
        { rotation: 0, duration: 0.95, ease: "power3.out" },
        0.3,
      )
      // title: thin line clips away right, heavy line left, then the next wipes in
      .to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: "power2.in" }, 0)
      .to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: "power2.in" }, 0.06)
      .to([a.eye, a.desc], { autoAlpha: 0, duration: 0.25 }, 0)
      .set(a.head, { autoAlpha: 0 }, 0.5)
      .set(b.head, { autoAlpha: 1 }, 0.5)
      .fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.55)
      .fromTo(
        b.t1,
        { clipPath: HIDE_1 },
        { clipPath: SHOW, duration: 0.7, ease: "power3.out" },
        0.55,
      )
      .fromTo(
        b.t2,
        { clipPath: HIDE_2 },
        { clipPath: SHOW, duration: 0.7, ease: "power3.out" },
        0.62,
      )
      .fromTo(b.desc, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.75)
      // card: cross-fade, the incoming rows rise in turn
      .to(a.body, { autoAlpha: 0, y: -6, duration: 0.3, ease: "power1.in" }, 0.05)
      .set(b.body, { autoAlpha: 1, y: 0 }, 0.4)
      .fromTo(
        b.body?.children ?? [],
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
        0.4,
      )
      // the band stretches along the orbit with the photos, then settles in the new colour
      .to(
        arc.current,
        {
          a0: ARC_SWEEP[0],
          a1: ARC_SWEEP[1],
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: drawArc,
        },
        0,
      )
      .to(
        arc.current,
        { a0: rest[0], a1: rest[1], duration: 0.85, ease: "power3.out", onUpdate: drawArc },
        0.6,
      )
      .to(arcRef.current, { fill: stages[to].accent, duration: 1.1, ease: "power1.inOut" }, 0.1)
  }, [index])

  useEffect(() => () => void tlRef.current?.kill(), [])

  // Scroll handling. See the header comment.
  useEffect(() => {
    const root = rootRef.current!
    let mode: "" | "page" | "stage" = "" // what the current gesture belongs to
    let quiet = 0
    const settle = () => {
      clearTimeout(quiet)
      quiet = window.setTimeout(() => (mode = ""), QUIET_MS)
    }

    // The carousel takes a gesture only when it is mostly on screen and has a stage left
    // in that direction. It then squares itself fully on screen as it turns.
    const decide = (dir: 1 | -1): "page" | "stage" => {
      const r = root.getBoundingClientRect()
      const line = parseFloat(getComputedStyle(root).getPropertyValue("--dsh-top")) * 16
      const seen = (Math.min(r.bottom, window.innerHeight) - Math.max(r.top, line)) / r.height
      const next = indexRef.current + dir
      if (seen < MIN_VISIBLE || next < 0 || next >= n) return "page"
      const dy =
        r.top < line
          ? r.top - line
          : r.bottom > window.innerHeight
            ? Math.min(r.bottom - window.innerHeight + 16, r.top - line)
            : 0
      if (dy) window.scrollBy({ top: dy, behavior: "smooth" })
      go(next)
      return "stage"
    }

    // Capture phase on window, passive: sees every wheel first, and claims for the page
    // any gesture that starts outside the carousel. Only the carousel's own listener is
    // non-passive, so scrolling elsewhere stays on the fast path.
    const onAnyWheel = (e: WheelEvent) => {
      if (!mode && !root.contains(e.target as Node)) mode = "page"
      settle()
    }
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      if (!mode) mode = decide(e.deltaY > 0 ? 1 : -1)
      if (mode === "stage") e.preventDefault()
    }
    let y0 = 0
    const onTouchStart = (e: TouchEvent) => {
      y0 = e.touches[0].clientY
      mode = ""
    }
    const onTouchMove = (e: TouchEvent) => {
      const dy = y0 - e.touches[0].clientY
      if (!mode) {
        if (Math.abs(dy) < 10) return
        mode = decide(dy > 0 ? 1 : -1)
      }
      if (mode === "stage" && e.cancelable) e.preventDefault()
    }

    window.addEventListener("wheel", onAnyWheel, { capture: true, passive: true })
    root.addEventListener("wheel", onWheel, { passive: false })
    root.addEventListener("touchstart", onTouchStart, { passive: true })
    root.addEventListener("touchmove", onTouchMove, { passive: false })
    return () => {
      window.removeEventListener("wheel", onAnyWheel, { capture: true })
      root.removeEventListener("wheel", onWheel)
      root.removeEventListener("touchstart", onTouchStart)
      root.removeEventListener("touchmove", onTouchMove)
      clearTimeout(quiet)
    }
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    go(indexRef.current + (e.key === "ArrowRight" ? 1 : -1))
  }

  const start = Math.max(0, Math.min(index - 1, n - VISIBLE))
  const stage = stages[index]

  return (
    <div
      ref={rootRef}
      className="dsh-root"
      role="region"
      aria-roledescription="carousel"
      aria-label="Delivery stages"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <style>{CSS}</style>
      <div className="dsh-canvas">
        <svg className="dsh-arc" viewBox="0 0 960 520" aria-hidden="true">
          <path ref={arcRef} opacity={0.3} />
        </svg>

        <div className="dsh-pager" role="tablist" aria-label="Choose a stage">
          {stages.map((s, i) => (
            <button
              key={s.name}
              type="button"
              role="tab"
              className="dsh-btn dsh-dot"
              aria-selected={i === index}
              aria-label={s.name}
              onClick={() => go(i)}
            >
              <i />
            </button>
          ))}
        </div>

        <div className="dsh-plates">
          {stages.map((s, i) => (
            <div
              key={s.name}
              ref={(el) => void (orbits.current[i] = el)}
              className="dsh-orbit"
              aria-hidden={i !== index}
            >
              <div className="dsh-photo">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 640px) 400px, 50vw"
                  quality={85}
                  draggable={false}
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="dsh-head">
          {stages.map((s, i) => (
            <div
              key={s.name}
              ref={(el) => void (heads.current[i] = el)}
              className="dsh-hd"
              aria-hidden={i !== index}
            >
              <p className="dsh-eye">{journey.eyebrow}</p>
              <h2 style={{ margin: 0, font: "inherit" }}>
                <span
                  className="dsh-t1"
                  style={{ fontSize: fitSize(s.phase.length, 56, 320, 0.56) }}
                >
                  {s.phase}
                </span>
                <span
                  className="dsh-t2"
                  style={{ fontSize: fitSize(s.name.length, 62, 310, 0.64) }}
                >
                  {s.name}
                </span>
              </h2>
              <p className="dsh-desc">{s.what}</p>
            </div>
          ))}
        </div>

        <div className="dsh-card">
          <div className="dsh-tabs" role="tablist" aria-label="Stage details">
            {(["overview", "ai"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                className="dsh-btn dsh-tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
              >
                {t === "overview" ? "Overview" : "With AI"}
              </button>
            ))}
          </div>
          <div className="dsh-bodies">
            {stages.map((s, i) => (
              <div
                key={s.name}
                ref={(el) => void (bodies.current[i] = el)}
                className="dsh-body"
                aria-hidden={i !== index}
              >
                <div className="dsh-rate">
                  <div className="dsh-badge" style={{ background: s.accent }}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10z" />
                    </svg>
                  </div>
                  <span className="dsh-lab">What lands</span>
                </div>
                <p className="dsh-out">{s.deliverable}</p>
                <p className="dsh-txt">
                  {tab === "overview" ? (
                    <>
                      <span className="dsh-lab">You · </span>
                      {s.clientDoes}
                    </>
                  ) : (
                    s.ai
                  )}
                </p>
                <Link
                  href="/contact"
                  data-project-dialog=""
                  className="dsh-cta"
                  tabIndex={i === index ? 0 : -1}
                >
                  Start a project
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="dsh-strip">
          <button
            type="button"
            className="dsh-btn dsh-arrow"
            aria-label="Previous stage"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            <svg viewBox="0 0 12 16" aria-hidden="true">
              <path d="M11 0v16L0 8z" />
            </svg>
          </button>
          <div className="dsh-win">
            <div className="dsh-track" style={{ transform: `translateX(${-start * ITEM}px)` }}>
              {stages.map((s, i) => (
                <div key={s.name} className="dsh-th">
                  <button
                    type="button"
                    className="dsh-btn"
                    aria-current={i === index ? "step" : undefined}
                    onClick={() => go(i)}
                  >
                    <span className="dsh-thi">
                      {/* 56px, drawn at up to 1.6x canvas scale on a 2x screen. */}
                      <Image src={s.src} alt="" fill sizes="180px" quality={85} draggable={false} />
                    </span>
                    <span className="dsh-thl">{s.phase}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="dsh-btn dsh-arrow"
            aria-label="Next stage"
            disabled={index === n - 1}
            onClick={() => go(index + 1)}
          >
            <svg viewBox="0 0 12 16" aria-hidden="true">
              <path d="M1 0v16l11-8z" />
            </svg>
          </button>
        </div>
      </div>
      <p className="dsh-sr" aria-live="polite">{`${stage.phase}: ${stage.name}`}</p>
    </div>
  )
}
