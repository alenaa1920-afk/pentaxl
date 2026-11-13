"use client"

// Client only for what needs the browser: the reveal observer, the current-route
// marker, and opening the menu dialog.

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { primaryNav, site } from "@/content/site"
import { Container, Action } from "./ui"
import { cn } from "@/lib/utils"

/**
 * Drives every `data-reveal` element on the page. One observer for the whole site
 * instead of a wrapper component per section — and if JS never runs, or the user asked
 * for reduced motion, `data-motion` is never set and the CSS leaves content visible.
 */
export function MotionRoot() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    root.dataset.motion = "on"

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-shown", "")
          io.unobserve(entry.target)
        }
      },
      // Only the bottom edge gates anything: an element counts as intersecting once its
      // top clears 12% above the fold. The enormous margins on the other three sides
      // are what stop content being stranded at opacity 0 forever — anything the
      // viewport jumped clean over (an anchor link, a restored scroll position, a fast
      // flick) never changes intersection state without them, so the observer would
      // simply never fire for it.
      { rootMargin: "100000px 100000px -12% 100000px", threshold: 0.05 },
    )

    document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [pathname])

  return null
}

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

/** Contact is the header's button, so it is not also a plain link beside it. The 404 page
 *  still lists it, which is why it stays in primaryNav itself. */
const headerLinks = primaryNav.filter((item) => item.href !== "/contact")

const LETTERS = [...site.name]
/** Where "XL" — the last two letters — starts: those drop in from above; the rest rise. */
const CUT = LETTERS.length - 2

/**
 * The wordmark arrives letter by letter, entirely inside its own box: the mask is
 * overflow-hidden, so every letter starts out of sight *within* the nav bar and moves
 * into place, rather than flying in from off the edge of it. "Penta" rises in turn;
 * "XL" drops in after it, lands with a small overshoot and a violet flash, then a shine
 * runs across the letters themselves. On hover the letters ripple. All of it is CSS, plays once
 * per page load (the header survives client-side navigation), and is skipped outright
 * under reduced motion. The visible letters are aria-hidden; the link is named by its
 * aria-label, so a screen reader hears "PentaXL — home", not seven separate letters.
 */
function Wordmark() {
  return (
    <span aria-hidden="true" className="brand-mask">
      {LETTERS.map((ch, k) => {
        const drop = k >= CUT
        // --k (inherited by the inner span) orders the shine and the hover ripple;
        // --i / --j order the rise and the drop.
        const vars = drop ? { "--j": k - CUT, "--k": k } : { "--i": k, "--k": k }
        return (
          <span
            key={k}
            className={`brand-letter ${drop ? "brand-drop" : "brand-rise"}`}
            style={vars as React.CSSProperties}
          >
            <span className="brand-wave">{ch}</span>
          </span>
        )
      })}
    </span>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const menu = useRef<HTMLDialogElement>(null)
  const closeMenu = () => menu.current?.close()

  // A floating bar rather than a strip: detached from the top edge, rounded, no rule
  // under it. Over the hero it is barely there — a light frost on the photograph — and
  // once the page scrolls under it, it darkens just enough that the links stay legible
  // over body text.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    // pt-2 + h-14 and md:pt-4 + md:h-16 keep the header's footprint at 64 / 80px, which
    // the home hero's negative margin is sized to.
    <header className="sticky top-0 z-40 pt-2 md:pt-4">
      <Container>
        <div
          className={cn(
            "enter flex h-14 items-center justify-between gap-6 rounded-2xl px-4 backdrop-blur-md transition-colors duration-300 md:h-16 md:px-6",
            scrolled
              ? "bg-[#0b0a22]/60 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8)]"
              : "bg-white/[0.04]",
          )}
        >
          <Link
            href="/"
            className="brand font-display text-[1.7rem] font-bold tracking-tight md:text-[2.15rem]"
            aria-label={`${site.name} — home`}
          >
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {headerLinks.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "py-1 text-base font-semibold tracking-wide transition-colors",
                        active ? "text-accent" : "text-ink hover:text-accent",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Action
                  href="/contact"
                  data-project-dialog=""
                  className="min-h-10 rounded-full px-5 py-2 text-sm font-semibold"
                >
                  Start a project
                </Action>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => menu.current?.showModal()}
            className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
            aria-label="Open menu"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
          {/* A native modal <dialog>, as a bottom sheet: the browser supplies the focus
              trap, Escape, the backdrop, inert content behind and focus restored to the
              button. A click on the dialog element itself is a click on the backdrop. */}
          <dialog
            ref={menu}
            aria-label="Menu"
            onClick={(e) => e.target === e.currentTarget && closeMenu()}
            className="menu-sheet border-line text-ink fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85vh] w-full max-w-none border-t bg-[#0d0b24] p-0 pb-8 md:hidden"
          >
            <div className="border-line flex items-center justify-between border-b px-5 py-4">
              <p className="font-display text-lg">Menu</p>
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex min-h-11 min-w-11 items-center justify-center"
                aria-label="Close menu"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <nav aria-label="Primary" className="overflow-y-auto px-5">
              <ul>
                {headerLinks.map((item) => (
                  <li key={item.href} className="border-line border-b">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center text-lg font-semibold",
                        isActive(pathname, item.href) ? "text-accent" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Primary action last, in thumb reach. The full contact page rather than
                  the project dialog: on a phone it is the better form. */}
              <Action href="/contact" onClick={closeMenu} className="mt-6 w-full rounded-full">
                Start a project
              </Action>
            </nav>
          </dialog>
        </div>
      </Container>
    </header>
  )
}
